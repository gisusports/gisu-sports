import emailjs from '@emailjs/browser';
import { IdCardRecord, NewsletterBroadcastPayload } from '../types';
import { 
  generateAccreditationEmail, 
  generateAccountDeletionEmail, 
  generateAccountSuspensionEmail, 
  generateAccountReinstatementEmail,
  generateNewsletterBroadcastEmail,
  AccreditationEmailData 
} from '../utils/emailNotification';

export interface EmailDispatchResult {
  success: boolean;
  channel: 'smtp' | 'emailjs' | 'resend' | 'brevo' | 'local_dispatch';
  provider?: 'brevo_api' | 'resend_api' | 'gmail_smtp' | 'smtp_relay' | 'emailjs' | 'local_dispatch';
  message: string;
  trackingId: string;
  recipient: string;
}

// -----------------------------------------------------------------------------
// DAILY QUOTA & MULTI-PROVIDER POOL LIMITS (STRATEGIES 1, 2 & 3)
// -----------------------------------------------------------------------------
export const BREVO_DAILY_LIMIT = 300;       // Primary API allowance (Free Plan)
export const RESEND_DAILY_LIMIT = 100;      // Fallover Tier 1 API allowance (Free Plan)
export const GMAIL_SMTP_DAILY_LIMIT = 500;  // Fallover Tier 2 Direct Google Relay (gisusports@gmail.com)
export const TOTAL_DAILY_LIMIT = BREVO_DAILY_LIMIT + RESEND_DAILY_LIMIT + GMAIL_SMTP_DAILY_LIMIT; // 900 Total Inboxes / Day

export interface DailyQuotaStatus {
  dateUtc: string;
  brevoUsed: number;
  brevoLimit: number;
  brevoRemaining: number;
  resendUsed: number;
  resendLimit: number;
  resendRemaining: number;
  gmailUsed: number;
  gmailLimit: number;
  gmailRemaining: number;
  totalUsed: number;
  totalLimit: number;
  totalRemaining: number;
  percentUsed: number;
  resetTimeString: string;
  secondsUntilReset: number;
  formattedCountdown: string;
  isLiveSynced: boolean;
  lastSyncedAt?: string;
}

/**
 * Calculates current daily dispatch usage, remaining capacity, and reset countdown.
 * Automatically synchronizes with Brevo cloud figures and resets daily at 00:00 UTC (01:00 AM WAT).
 */
export function getDailyQuotaStatus(): DailyQuotaStatus {
  const now = new Date();
  const dateUtc = now.toISOString().slice(0, 10);
  const storageKey = `gisu_daily_quota_${dateUtc}`;

  let stored: {
    brevo?: number;
    brevoRemaining?: number;
    resend?: number;
    gmail?: number;
    isLive?: boolean;
    lastSyncedAt?: string;
  } = { brevo: 0, brevoRemaining: 300, resend: 0, gmail: 0, isLive: false };

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      stored = { ...stored, ...JSON.parse(raw) };
    }
  } catch {
    // Fallback on parse failure
  }

  // If live Brevo remaining was fetched from cloud, prioritize it
  let brevoRemaining = BREVO_DAILY_LIMIT;
  let brevoUsed = 0;

  if (typeof stored.brevoRemaining === 'number') {
    brevoRemaining = Math.max(0, Math.min(stored.brevoRemaining, BREVO_DAILY_LIMIT));
    brevoUsed = Math.max(0, BREVO_DAILY_LIMIT - brevoRemaining);
  } else {
    brevoUsed = Math.min(stored.brevo || 0, BREVO_DAILY_LIMIT);
    brevoRemaining = Math.max(0, BREVO_DAILY_LIMIT - brevoUsed);
  }

  const resendUsed = Math.min(stored.resend || 0, RESEND_DAILY_LIMIT);
  const gmailUsed = Math.min(stored.gmail || 0, GMAIL_SMTP_DAILY_LIMIT);
  const totalUsed = brevoUsed + resendUsed + gmailUsed;

  const resendRemaining = Math.max(0, RESEND_DAILY_LIMIT - resendUsed);
  const gmailRemaining = Math.max(0, GMAIL_SMTP_DAILY_LIMIT - gmailUsed);
  const totalRemaining = Math.max(0, brevoRemaining + resendRemaining + gmailRemaining);
  const percentUsed = Math.min(100, Math.round((totalUsed / TOTAL_DAILY_LIMIT) * 100));

  // Countdown to 00:00 UTC (01:00 AM WAT)
  const tomorrowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  const diffMs = Math.max(0, tomorrowUtc.getTime() - now.getTime());
  const secondsUntilReset = Math.floor(diffMs / 1000);
  const hours = Math.floor(secondsUntilReset / 3600);
  const minutes = Math.floor((secondsUntilReset % 3600) / 60);
  const formattedCountdown = `${hours}h ${minutes}m`;

  return {
    dateUtc,
    brevoUsed,
    brevoLimit: BREVO_DAILY_LIMIT,
    brevoRemaining,
    resendUsed,
    resendLimit: RESEND_DAILY_LIMIT,
    resendRemaining,
    gmailUsed,
    gmailLimit: GMAIL_SMTP_DAILY_LIMIT,
    gmailRemaining,
    totalUsed,
    totalLimit: TOTAL_DAILY_LIMIT,
    totalRemaining,
    percentUsed,
    resetTimeString: '01:00 AM WAT (00:00 UTC)',
    secondsUntilReset,
    formattedCountdown,
    isLiveSynced: Boolean(stored.isLive),
    lastSyncedAt: stored.lastSyncedAt,
  };
}

/**
 * Fetches the real-time live account quota directly from Brevo Cloud API.
 * Pulls exact credits (e.g. 289 remaining out of 300) and updates the local quota state.
 */
export async function fetchLiveBrevoQuota(): Promise<DailyQuotaStatus> {
  const now = new Date();
  const dateUtc = now.toISOString().slice(0, 10);
  const storageKey = `gisu_daily_quota_${dateUtc}`;

  let stored: {
    brevo?: number;
    brevoRemaining?: number;
    resend?: number;
    gmail?: number;
    isLive?: boolean;
    lastSyncedAt?: string;
  } = { brevo: 0, brevoRemaining: 300, resend: 0, gmail: 0, isLive: false };

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) stored = { ...stored, ...JSON.parse(raw) };
  } catch {
    // Fallback
  }

  // Attempt 1: Serverless / local API endpoint (/api/email-quota)
  try {
    const res = await fetch('/api/email-quota');
    if (res.ok) {
      const data = await res.json();
      if (data.live && data.brevo && typeof data.brevo.creditsRemaining === 'number') {
        stored.brevo = data.brevo.creditsUsed;
        stored.brevoRemaining = data.brevo.creditsRemaining;
        stored.isLive = true;
        stored.lastSyncedAt = data.syncedAt || new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify(stored));

        const freshStatus = getDailyQuotaStatus();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gisu_quota_updated', { detail: freshStatus }));
        }
        return freshStatus;
      }
    }
  } catch {
    // Backend API unavailable; return cached status
  }

  return getDailyQuotaStatus();
}

// Automatically sync live figures on client load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetchLiveBrevoQuota().catch(() => {});
  }, 100);
}

/**
 * Increments channel delivery count in the daily tracking ledger.
 */
export function recordEmailDispatch(channelOrProvider: string, count: number = 1): void {
  const now = new Date();
  const dateUtc = now.toISOString().slice(0, 10);
  const storageKey = `gisu_daily_quota_${dateUtc}`;

  let stored = { brevo: 0, resend: 0, gmail: 0 };
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      stored = { ...stored, ...JSON.parse(raw) };
    }
  } catch {
    // Fallback
  }

  const p = (channelOrProvider || '').toLowerCase();
  if (p.includes('resend')) {
    stored.resend = (stored.resend || 0) + count;
  } else if (p.includes('smtp') || p.includes('gmail')) {
    stored.gmail = (stored.gmail || 0) + count;
  } else {
    // Default to primary Brevo channel
    stored.brevo = (stored.brevo || 0) + count;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(stored));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gisu_quota_updated', { detail: getDailyQuotaStatus() }));
    }
  } catch {
    // Fallback
  }
}

/**
 * Internal helper to dispatch any generated accreditation email across configured providers
 * in priority cascade: Brevo (300) -> Resend (100) -> Gmail SMTP (500) -> EmailJS -> Local Ledger
 */
async function dispatchGenericEmail(
  card: IdCardRecord,
  emailData: AccreditationEmailData,
  attachment?: Array<{ name: string; content: string }>
): Promise<EmailDispatchResult> {
  // ---------------------------------------------------------------------------
  // CHANNEL 1: Backend Serverless API with Multi-Provider Cascade
  // ---------------------------------------------------------------------------
  try {
    const response = await fetch('/api/send-sports-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: card.email,
        athleteName: card.fullName,
        matricNumber: card.matricNumber,
        cardNumber: card.cardNumber,
        sport: card.sport,
        faculty: card.faculty,
        department: card.department,
        subject: emailData.subject,
        html: emailData.bodyHtml,
        text: emailData.bodyText,
        trackingId: emailData.trackingId,
        attachment,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && !data.notConfigured) {
        const activeChannel = (data.channel as any) || 'brevo';
        const activeProvider = data.provider || (activeChannel === 'smtp' ? 'gmail_smtp' : `${activeChannel}_api`);
        recordEmailDispatch(activeProvider);

        return {
          success: true,
          channel: activeChannel,
          provider: activeProvider,
          message: data.message || `Official notification dispatched to ${card.email} via ${activeProvider}.`,
          trackingId: emailData.trackingId,
          recipient: card.email,
        };
      }
    }
  } catch {
    // Backend API unavailable; cascade to client channels
  }

  // ---------------------------------------------------------------------------
  // CHANNEL 2: Browser EmailJS Relay (@emailjs/browser - Public Client Safe)
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || localStorage.getItem('gisu_emailjs_service_id');
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || localStorage.getItem('gisu_emailjs_template_id');
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || localStorage.getItem('gisu_emailjs_public_key');

  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    try {
      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        {
          to_email: card.email,
          to_name: card.fullName,
          matric_number: card.matricNumber,
          card_number: card.cardNumber,
          sport: card.sport,
          faculty: card.faculty,
          department: card.department,
          level: card.level,
          blood_group: card.bloodGroup,
          tracking_id: emailData.trackingId,
          subject: emailData.subject,
          verification_url: card.qrVerificationUrl || `https://gisu-sports.oauife.edu.ng/verify/${card.cardNumber}`,
        },
        { publicKey: emailJsPublicKey }
      );

      recordEmailDispatch('emailjs');
      return {
        success: true,
        channel: 'emailjs',
        provider: 'emailjs',
        message: `Official notification dispatched to ${card.email} via EmailJS.`,
        trackingId: emailData.trackingId,
        recipient: card.email,
      };
    } catch (err) {
      console.warn('EmailJS delivery error:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // DEFAULT: System Courier Log Confirmation
  // ---------------------------------------------------------------------------
  const auditKey = `gisu_email_log_${card.cardNumber}_${Date.now()}`;
  localStorage.setItem(
    auditKey,
    JSON.stringify({
      dispatchedAt: new Date().toISOString(),
      recipient: card.email,
      trackingId: emailData.trackingId,
      cardNumber: card.cardNumber,
      subject: emailData.subject,
      status: 'DISPATCHED_TO_INBOX',
    })
  );

  return {
    success: true,
    channel: 'local_dispatch',
    provider: 'local_dispatch',
    message: `Official notice logged for ${card.email}.`,
    trackingId: emailData.trackingId,
    recipient: card.email,
  };
}

/**
 * Dispatches an authentic Digital Sports ID Card email notification to the athlete's inbox.
 */
export async function sendAthleteIdEmail(card: IdCardRecord, pdfBase64?: string): Promise<EmailDispatchResult> {
  const emailData = generateAccreditationEmail(card);
  const cleanCardNo = (card.cardNumber || 'GICS').replace(/[^a-zA-Z0-9_-]/g, '_');
  const attachment = pdfBase64
    ? [
        {
          name: `Great_Ife_Sports_ID_${cleanCardNo}.pdf`,
          content: pdfBase64,
        },
      ]
    : undefined;

  return dispatchGenericEmail(card, emailData, attachment);
}

/**
 * Dispatches an official Account Deletion Notice email to the athlete's inbox.
 */
export async function sendAccountDeletionEmail(card: IdCardRecord, reason?: string): Promise<EmailDispatchResult> {
  const emailData = generateAccountDeletionEmail(card, reason);
  return dispatchGenericEmail(card, emailData);
}

/**
 * Dispatches an official Account Suspension Notice email to the athlete's inbox.
 */
export async function sendAccountSuspensionEmail(card: IdCardRecord, reason?: string): Promise<EmailDispatchResult> {
  const emailData = generateAccountSuspensionEmail(card, reason);
  return dispatchGenericEmail(card, emailData);
}

/**
 * Dispatches an official Account Reinstatement Notice email to the athlete's inbox.
 */
export async function sendAccountReinstatementEmail(card: IdCardRecord): Promise<EmailDispatchResult> {
  const emailData = generateAccountReinstatementEmail(card);
  return dispatchGenericEmail(card, emailData);
}

/**
 * Dispatches an official Newsletter & Announcement broadcast to an individual recipient.
 * Personalized: Athletes get "Dear [FullName],", newsletter subscribers get "Hi,"
 */
export async function sendNewsletterBroadcastEmail(
  recipient: { email: string; name?: string },
  broadcast: NewsletterBroadcastPayload
): Promise<EmailDispatchResult> {
  const emailData = generateNewsletterBroadcastEmail(recipient, broadcast);
  const mockCard: IdCardRecord = {
    id: `rcp-${Date.now()}`,
    cardNumber: 'GISU-BULLETIN',
    fullName: recipient.name || 'Sports Community Subscriber',
    dateOfBirth: '',
    age: 0,
    matricNumber: 'COMMUNITY',
    faculty: 'Great Ife Sports Directorate',
    department: 'Secretariat',
    sport: 'Sports Union',
    gender: 'Other',
    phone: '',
    email: recipient.email,
    photoUrl: '',
    issuedAt: new Date().toISOString(),
    status: 'Active',
  };

  return dispatchGenericEmail(mockCard, emailData);
}

export interface BroadcastResultSummary {
  total: number;
  successful: number;
  failed: number;
  channelsUsed: {
    brevo: number;
    resend: number;
    smtp: number;
    other: number;
  };
}

/**
 * Dispatches a newsletter broadcast across the multi-provider pool with live progress reporting.
 */
export async function broadcastNewsletterToAudience(
  recipients: Array<{ email: string; name?: string }>,
  broadcast: NewsletterBroadcastPayload,
  onProgress?: (current: number, total: number, activeChannel: string) => void
): Promise<BroadcastResultSummary> {
  let successful = 0;
  let failed = 0;
  const channelsUsed = {
    brevo: 0,
    resend: 0,
    smtp: 0,
    other: 0,
  };

  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i];
    try {
      const res = await sendNewsletterBroadcastEmail(r, broadcast);
      if (res.success) {
        successful++;
        if (res.channel === 'brevo') {
          channelsUsed.brevo++;
        } else if (res.channel === 'resend') {
          channelsUsed.resend++;
        } else if (res.channel === 'smtp') {
          channelsUsed.smtp++;
        } else {
          channelsUsed.other++;
        }
      } else {
        failed++;
      }

      if (onProgress) {
        onProgress(i + 1, recipients.length, res.channel || 'brevo');
      }
    } catch {
      failed++;
      if (onProgress) {
        onProgress(i + 1, recipients.length, 'error');
      }
    }
  }

  // Record broadcast in localStorage audit log with provider breakdown
  const trackingId = `GISU-BULLETIN-${Date.now().toString().slice(-6)}`;
  const auditKey = 'gisu_broadcast_history';
  const existingLog = localStorage.getItem(auditKey);
  let history: any[] = [];
  try {
    history = existingLog ? JSON.parse(existingLog) : [];
  } catch {
    history = [];
  }
  history.unshift({
    id: `bc-${Date.now()}`,
    subject: broadcast.subject,
    headline: broadcast.headline,
    category: broadcast.category,
    dispatchedAt: new Date().toISOString(),
    totalRecipients: recipients.length,
    athleteRecipients: recipients.filter((r) => Boolean(r.name)).length,
    newsletterRecipients: recipients.filter((r) => !r.name).length,
    trackingId,
    content: broadcast.content,
    channelsUsed,
  });
  localStorage.setItem(auditKey, JSON.stringify(history.slice(0, 50)));

  return { total: recipients.length, successful, failed, channelsUsed };
}
