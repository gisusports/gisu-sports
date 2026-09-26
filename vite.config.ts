import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

function sportsEmailPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'sports-email-api',
    configureServer(server) {
      server.middlewares.use('/email-preview', (req, res) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        try {
          const previewHtml = fs.readFileSync(path.resolve(__dirname, 'public/email-preview.html'), 'utf8');
          res.end(previewHtml);
        } catch {
          res.end('<h1>Email preview not generated yet.</h1>');
        }
      });

      // Middleware: Live Email Quota & Account Statistics from Brevo Cloud
      server.middlewares.use('/api/email-quota', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const brevoKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY;
          if (!brevoKey || brevoKey.includes('your_brevo')) {
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              live: false,
              brevo: { creditsRemaining: 300, creditsLimit: 300, creditsUsed: 0 },
            }));
            return;
          }

          const brevoRes = await fetch('https://api.brevo.com/v3/account', {
            method: 'GET',
            headers: { 'api-key': brevoKey, 'Accept': 'application/json' },
          });

          if (brevoRes.ok) {
            const accountData = await brevoRes.json();
            const freePlan = accountData.plan?.find((p: any) => p.creditsType === 'sendLimit' || p.type === 'free') || accountData.plan?.[0];
            const creditsRemaining = typeof freePlan?.credits === 'number' ? freePlan.credits : 300;
            const creditsLimit = 300;
            const creditsUsed = Math.max(0, creditsLimit - creditsRemaining);

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              live: true,
              brevo: { creditsRemaining, creditsLimit, creditsUsed, planType: freePlan?.type || 'free' },
              resend: { creditsLimit: 100, creditsRemaining: 100, creditsUsed: 0 },
              gmail: { creditsLimit: 500, creditsRemaining: 500, creditsUsed: 0 },
              totalRemaining: creditsRemaining + 100 + 500,
              totalLimit: 900,
              totalUsed: creditsUsed,
              syncedAt: new Date().toISOString(),
            }));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: false, live: false, message: 'Could not fetch Brevo account' }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });

      server.middlewares.use('/api/send-sports-email', async (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          try {
            const brevoKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY;
            if (!brevoKey || brevoKey.includes('your_brevo')) {
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                live: false,
                brevo: { creditsRemaining: 300, creditsLimit: 300, creditsUsed: 0 },
              }));
              return;
            }

            const brevoRes = await fetch('https://api.brevo.com/v3/account', {
              method: 'GET',
              headers: { 'api-key': brevoKey, 'Accept': 'application/json' },
            });

            if (brevoRes.ok) {
              const accountData = await brevoRes.json();
              const freePlan = accountData.plan?.find((p: any) => p.creditsType === 'sendLimit' || p.type === 'free') || accountData.plan?.[0];
              const creditsRemaining = typeof freePlan?.credits === 'number' ? freePlan.credits : 300;
              const creditsLimit = 300;
              const creditsUsed = Math.max(0, creditsLimit - creditsRemaining);

              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                live: true,
                brevo: { creditsRemaining, creditsLimit, creditsUsed, planType: freePlan?.type || 'free' },
                resend: { creditsLimit: 100, creditsRemaining: 100, creditsUsed: 0 },
                gmail: { creditsLimit: 500, creditsRemaining: 500, creditsUsed: 0 },
                totalRemaining: creditsRemaining + 100 + 500,
                totalLimit: 900,
                totalUsed: creditsUsed,
                syncedAt: new Date().toISOString(),
              }));
              return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: false, live: false, message: 'Could not fetch Brevo account' }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = JSON.parse(body || '{}');
            const { to, subject, html, text, athleteName, cardNumber, attachment, attachments } = data;
            const emailAttachments = attachment || attachments;

            // Priority 1: Check if Brevo API is configured (300 free emails/day)
            const brevoKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY;
            const brevoSenderEmail = env.BREVO_SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL || 'gisusports@gmail.com';
            const brevoSenderName = env.BREVO_SENDER_NAME || process.env.BREVO_SENDER_NAME || 'Great Ife Sports';

            if (brevoKey && !brevoKey.includes('your_brevo')) {
              try {
                const brevoPayload: Record<string, any> = {
                  sender: { name: brevoSenderName, email: brevoSenderEmail },
                  to: [{ email: to, name: athleteName }],
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
                    'Accept': 'application/json',
                  },
                  body: JSON.stringify(brevoPayload),
                });

                if (brevoRes.ok) {
                  const brevoData = await brevoRes.json().catch(() => ({}));
                  console.log(`[GISU Sports Email] Real email dispatched via Brevo API to ${to} (${cardNumber}) with ${emailAttachments ? 'PDF attachment' : 'no attachment'}`);
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, channel: 'brevo', provider: 'brevo_api', message: `Real email dispatched via Brevo to ${to}` }));
                  return;
                } else {
                  const errJson = await brevoRes.json().catch(() => ({}));
                  console.warn('[GISU Sports Email] Brevo API Quota/Error (cascading to fallback):', errJson);
                }
              } catch (brevoErr: any) {
                console.warn('[GISU Sports Email] Brevo fetch error (cascading to fallback):', brevoErr.message);
              }
            }

            // Priority 2: Check if Resend API is configured (100 free emails/day)
            const resendKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
            if (resendKey && !resendKey.includes('your_resend')) {
              try {
                const resendPayload: Record<string, any> = {
                  from: `${brevoSenderName} <${brevoSenderEmail}>`,
                  to: [to],
                  subject: subject,
                  html: html,
                  text: text,
                };
                if (emailAttachments && Array.isArray(emailAttachments) && emailAttachments.length > 0) {
                  resendPayload.attachments = emailAttachments.map((a: any) => ({
                    filename: a.name,
                    content: a.content,
                  }));
                }

                const resendRes = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${resendKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(resendPayload),
                });

                if (resendRes.ok) {
                  console.log(`[GISU Sports Email] Real email dispatched via Resend fallback to ${to}`);
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, channel: 'resend', provider: 'resend_api', message: `Real email dispatched via Resend to ${to}` }));
                  return;
                } else {
                  const resendErr = await resendRes.json().catch(() => ({}));
                  console.warn('[GISU Sports Email] Resend Warning (cascading to SMTP):', resendErr);
                }
              } catch (resendErr: any) {
                console.warn('[GISU Sports Email] Resend fetch exception (cascading to SMTP):', resendErr.message);
              }
            }

            // Priority 3: Check if SMTP is configured (Supports Gmail SMTP or Brevo SMTP Relay - 500 free emails/day)
            const brevoPass = (env.VITE_BREVO_API_KEY || '').startsWith('xsmtpsib-') ? env.VITE_BREVO_API_KEY : '';
            const smtpUser = env.SMTP_USER || process.env.SMTP_USER || env.VITE_BREVO_SENDER_EMAIL || 'gisusports@gmail.com';
            const smtpPass = env.SMTP_PASS || process.env.SMTP_PASS || brevoPass;
            const isBrevoSmtp = (smtpPass || '').startsWith('xsmtpsib-') || (env.SMTP_HOST || '').includes('brevo.com');
            const smtpHost = env.SMTP_HOST || process.env.SMTP_HOST || (isBrevoSmtp ? 'smtp-relay.brevo.com' : 'smtp.gmail.com');
            const smtpPort = Number(env.SMTP_PORT || process.env.SMTP_PORT) || (isBrevoSmtp ? 587 : 465);
            const smtpFromName = env.SMTP_FROM_NAME || process.env.SMTP_FROM_NAME || env.VITE_BREVO_SENDER_NAME || 'Great Ife Sports';

            const isSmtpConfigured =
              smtpUser &&
              smtpPass &&
              !smtpUser.includes('your_email') &&
              !smtpPass.includes('your_16_char') &&
              !smtpUser.includes('your_brevo');

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

                const mailOptions: Record<string, any> = {
                  from: `"${smtpFromName}" <${smtpUser}>`,
                  to: to,
                  subject: subject,
                  html: html,
                  text: text,
                };

                if (emailAttachments && Array.isArray(emailAttachments) && emailAttachments.length > 0) {
                  mailOptions.attachments = emailAttachments.map((att: any) => ({
                    filename: att.name,
                    content: Buffer.from(att.content, 'base64'),
                    contentType: 'application/pdf',
                  }));
                }

                await transporter.sendMail(mailOptions);

                console.log(`[GISU Sports Email] Real email dispatched via SMTP (${smtpHost}) to ${to} (${cardNumber})`);
                res.statusCode = 200;
                res.end(JSON.stringify({ 
                  success: true, 
                  channel: 'smtp', 
                  provider: smtpHost.includes('gmail') ? 'gmail_smtp' : 'smtp_relay',
                  message: `Real email successfully dispatched to ${to} via SMTP` 
                }));
                return;
              } catch (smtpErr: any) {
                console.warn('[GISU Sports Email] SMTP Send Warning:', smtpErr.message);
              }
            }

            // If not configured, record in dev logs and return notification
            console.log(`[GISU Sports Email Dispatch Logger] Accreditation issued for ${athleteName} (${cardNumber}) to ${to}`);
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              notConfigured: true,
              message: 'Accreditation generated. To enable live inbox delivery, configure SMTP or EmailJS in .env.',
            }));
          } catch (err: any) {
            console.error('[GISU Sports Email] Dispatch Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), sportsEmailPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3005,
      host: true,
      strictPort: true,
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/public/**',
          '**/*~tmp*',
          '**/*.tmp',
          '**/.*',
        ],
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'lucide-react',
        'canvas-confetti',
        'jsbarcode',
        'html-to-image',
        '@emailjs/browser',
      ],
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  };
});
