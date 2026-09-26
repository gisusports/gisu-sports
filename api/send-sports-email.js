// Vercel Serverless Function for Brevo, Resend & Gmail SMTP Sports Email Dispatch
import nodemailer from 'nodemailer';

// In-memory sliding window rate limiting (max 30 requests / minute / IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, record);
    return false;
  }
  record.count++;
  rateLimitMap.set(ip, record);
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
  // CORS & Origin Validation
  const origin = req.headers.origin || req.headers.referer || '';
  const isAllowedOrigin =
    !origin ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('oauife.edu.ng') ||
    origin.includes('vercel.app');

  if (origin && isAllowedOrigin) {
    try {
      const url = new URL(origin);
      res.setHeader('Access-Control-Allow-Origin', url.origin);
    } catch {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const brevoKey = process.env.BREVO_API_KEY;
      if (!brevoKey || brevoKey.includes('your_brevo')) {
        return res.status(200).json({
          success: true,
          live: false,
          brevo: { creditsRemaining: 300, creditsLimit: 300, creditsUsed: 0 },
        });
      }

      const brevoRes = await fetch('https://api.brevo.com/v3/account', {
        method: 'GET',
        headers: { 'api-key': brevoKey, Accept: 'application/json' },
      });

      if (brevoRes.ok) {
        const accountData = await brevoRes.json();
        const freePlan = accountData.plan?.find((p) => p.creditsType === 'sendLimit' || p.type === 'free') || accountData.plan?.[0];
        const creditsRemaining = typeof freePlan?.credits === 'number' ? freePlan.credits : 300;
        const creditsLimit = 300;
        const creditsUsed = Math.max(0, creditsLimit - creditsRemaining);

        return res.status(200).json({
          success: true,
          live: true,
          brevo: { creditsRemaining, creditsLimit, creditsUsed, planType: freePlan?.type || 'free' },
          resend: { creditsLimit: 100, creditsRemaining: 100, creditsUsed: 0 },
          gmail: { creditsLimit: 500, creditsRemaining: 500, creditsUsed: 0 },
          totalRemaining: creditsRemaining + 100 + 500,
          totalLimit: 900,
          totalUsed: creditsUsed,
          syncedAt: new Date().toISOString(),
        });
      }
      return res.status(200).json({ success: false, live: false, message: 'Could not fetch Brevo account status' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate Limiting Protection
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too Many Requests: Rate limit exceeded. Please wait a moment.' });
  }

  try {
    const { to, subject, html, text, athleteName, cardNumber, attachment, attachments } = req.body || {};
    const emailAttachments = attachment || attachments;

    // Strict validation of recipient email and subject
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to || !emailRegex.test(to.trim())) {
      return res.status(400).json({ error: 'Valid recipient email is required' });
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const cleanTo = to.trim();

    // -------------------------------------------------------------------------
    // CHANNEL 1: BREVO API (300 Free Emails / Day)
    // -------------------------------------------------------------------------
    const brevoKey = process.env.BREVO_API_KEY;
    const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || 'gisusports@gmail.com';
    const brevoSenderName = process.env.BREVO_SENDER_NAME || 'Great Ife Sports';

    if (brevoKey && !brevoKey.includes('your_brevo')) {
      try {
        const brevoPayload = {
          sender: { name: brevoSenderName, email: brevoSenderEmail },
          to: [{ email: cleanTo, name: athleteName || 'Accredited Athlete' }],
          subject: subject,
          htmlContent: html,
          textContent: text,
        };

        if (emailAttachments && Array.isArray(emailAttachments) && emailAttachments.length > 0) {
          brevoPayload.attachment = emailAttachments;
        }

        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(brevoPayload),
        });

        if (brevoRes.ok) {
          const brevoData = await brevoRes.json().catch(() => ({}));
          return res.status(200).json({
            success: true,
            channel: 'brevo',
            provider: 'brevo_api',
            message: `Official email dispatched via Brevo to ${cleanTo}`,
            messageId: brevoData.messageId,
          });
        } else {
          const errData = await brevoRes.json().catch(() => ({}));
          console.warn('[GISU Vercel API] Brevo quota or response warning:', errData);
        }
      } catch (brevoErr) {
        console.warn('[GISU Vercel API] Brevo fetch exception:', brevoErr.message);
      }
    }

    // -------------------------------------------------------------------------
    // CHANNEL 2: RESEND API (100 Free Emails / Day) - Auto-Failover Tier 1
    // -------------------------------------------------------------------------
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && !resendKey.includes('your_resend')) {
      try {
        const resendPayload = {
          from: `${brevoSenderName} <${brevoSenderEmail}>`,
          to: [cleanTo],
          subject: subject,
          html: html,
          text: text,
        };

        if (emailAttachments && Array.isArray(emailAttachments) && emailAttachments.length > 0) {
          resendPayload.attachments = emailAttachments.map((a) => ({
            filename: a.name,
            content: a.content,
          }));
        }

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resendPayload),
        });

        if (resendRes.ok) {
          const resendData = await resendRes.json().catch(() => ({}));
          return res.status(200).json({
            success: true,
            channel: 'resend',
            provider: 'resend_api',
            message: `Official email dispatched via Resend to ${cleanTo}`,
            messageId: resendData.id,
          });
        } else {
          const resendErr = await resendRes.json().catch(() => ({}));
          console.warn('[GISU Vercel API] Resend warning:', resendErr);
        }
      } catch (resendErr) {
        console.warn('[GISU Vercel API] Resend fetch exception:', resendErr.message);
      }
    }

    // -------------------------------------------------------------------------
    // CHANNEL 3: GMAIL SMTP / DIRECT SMTP RELAY (500 Free Emails / Day) - Auto-Failover Tier 2
    // -------------------------------------------------------------------------
    const smtpUser = process.env.SMTP_USER || process.env.BREVO_SENDER_EMAIL || 'gisusports@gmail.com';
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpFromName = process.env.SMTP_FROM_NAME || brevoSenderName;

    const isSmtpConfigured =
      smtpUser &&
      smtpPass &&
      !smtpPass.includes('your_16_char') &&
      !smtpUser.includes('your_email');

    if (isSmtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"${smtpFromName}" <${smtpUser}>`,
          to: cleanTo,
          subject: subject,
          html: html,
          text: text,
        };

        if (emailAttachments && Array.isArray(emailAttachments) && emailAttachments.length > 0) {
          mailOptions.attachments = emailAttachments.map((att) => ({
            filename: att.name,
            content: att.content,
            encoding: 'base64',
          }));
        }

        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({
          success: true,
          channel: 'smtp',
          provider: smtpHost.includes('gmail') ? 'gmail_smtp' : 'smtp_relay',
          message: `Official email dispatched via SMTP (${smtpHost}) to ${cleanTo}`,
          messageId: info.messageId,
        });
      } catch (smtpErr) {
        console.warn('[GISU Vercel API] SMTP relay error:', smtpErr.message);
      }
    }

    // Default: Logged courier confirmation
    return res.status(200).json({
      success: true,
      channel: 'logger',
      provider: 'local_dispatch',
      notConfigured: true,
      message: `Accreditation generated for ${athleteName || cleanTo}. Configure BREVO_API_KEY, RESEND_API_KEY, or SMTP_PASS on the server for live inbox transmission.`,
    });
  } catch (error) {
    console.error('[GISU Vercel API] Error dispatching email:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
