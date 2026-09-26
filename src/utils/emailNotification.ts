import type { IdCardRecord, NewsletterBroadcastPayload } from '../types';

export interface AccreditationEmailData {
  fromEmail: string;
  fromName: string;
  toEmail: string;
  toName: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  timestamp: string;
  trackingId: string;
  status: 'Delivered';
  verificationUrl: string;
}

// Authentic Supabase CDN branding logos and icons (PNG format for 100% Gmail & Outlook compatibility)
export const GISU_LOGO_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/gisu_logo.jpg';
export const OAU_LOGO_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/oau_logo.jpg';
export const HEADSET_ICON_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_headset.png';
export const FACEBOOK_ICON_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_facebook.png';
export const TWITTER_ICON_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_twitter_x.png';
export const INSTAGRAM_ICON_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_instagram.png';
export const LINKEDIN_ICON_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_linkedin.png';
export const CELEBRATION_ICON_URL = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_celebration.png';

export const renderExecutiveSignatoriesHtml = (trackingId: string): string => `
  <!-- OFFICIAL ISSUANCE DESK SIGNATORIES -->
  <div style="background-color: #FAFCF9; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin: 24px 0 16px 0; font-size: 12px; color: #475569; line-height: 1.6;">
    <div style="font-weight: 800; color: #071E10; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
      Office of the Director of Sports &bull; Great Ife Students' Union
    </div>
    <p style="margin: 0 0 2px 0; color: #1E293B;">
      <strong>Comrade Oladosu Miracle Okikijesu (Big Pope)</strong>, Director of Sports
    </p>
    <p style="margin: 0 0 10px 0; color: #1E293B;">
      <strong>Abdul Yekeen Muiz Olayinka</strong>, Personal Assistant to Director of Sports
    </p>
    <div style="border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 11px; color: #64748B;">
      <div>Tracking Reference: <span style="font-family: monospace; font-weight: 700; color: #071E10;">${trackingId}</span></div>
      <div>Secretariat: Ken Saro-Wiwa Building, Great Ife Students' Union, Obafemi Awolowo University, Ile-Ife</div>
      <div>Sports Secretariat: OAU Sports Complex, Ile-Ife &bull; Email: <a href="mailto:gisusports@gmail.com" style="color: #16A34A; text-decoration: none; font-weight: 700;">gisusports@gmail.com</a></div>
    </div>
  </div>
`.trim();

export const renderSocialChannelsHtml = (): string => `
  <!-- SOCIAL CHANNELS -->
  <div style="text-align: center; padding: 16px 0 12px 0; border-top: 1px solid #F1F5F9; margin-top: 14px;">
    <div style="font-size: 10px; font-weight: 800; color: #64748B; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
      Follow Great Ife Sports
    </div>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="padding: 0 5px;">
          <a href="https://facebook.com/greatifesports" target="_blank" title="Facebook" style="display: inline-block; width: 32px; height: 32px; border-radius: 8px; background-color: #071E10; text-align: center; line-height: 32px; text-decoration: none;">
            <img src="${FACEBOOK_ICON_URL}" width="16" height="16" alt="Facebook" style="vertical-align: middle; display: inline-block; border: 0;" />
          </a>
        </td>
        <td style="padding: 0 5px;">
          <a href="https://x.com/greatifesports" target="_blank" title="Twitter / X" style="display: inline-block; width: 32px; height: 32px; border-radius: 8px; background-color: #071E10; text-align: center; line-height: 32px; text-decoration: none;">
            <img src="${TWITTER_ICON_URL}" width="14" height="14" alt="X" style="vertical-align: middle; display: inline-block; border: 0;" />
          </a>
        </td>
        <td style="padding: 0 5px;">
          <a href="https://instagram.com/greatifesports" target="_blank" title="Instagram" style="display: inline-block; width: 32px; height: 32px; border-radius: 8px; background-color: #071E10; text-align: center; line-height: 32px; text-decoration: none;">
            <img src="${INSTAGRAM_ICON_URL}" width="16" height="16" alt="Instagram" style="vertical-align: middle; display: inline-block; border: 0;" />
          </a>
        </td>
        <td style="padding: 0 5px;">
          <a href="https://linkedin.com/company/greatifesports" target="_blank" title="LinkedIn" style="display: inline-block; width: 32px; height: 32px; border-radius: 8px; background-color: #071E10; text-align: center; line-height: 32px; text-decoration: none;">
            <img src="${LINKEDIN_ICON_URL}" width="14" height="14" alt="LinkedIn" style="vertical-align: middle; display: inline-block; border: 0;" />
          </a>
        </td>
      </tr>
    </table>
  </div>
`.trim();

export const renderDeveloperFooterHtml = (): string => `
  <!-- DEVELOPER ATTRIBUTION FOOTER -->
  <tr>
    <td style="background-color: #071E10; border-top: 1px solid #1E293B; padding: 18px 24px; text-align: center;">
      <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #86EFAC; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">
        Developed by Marx Dev Studio
      </div>
      <p style="margin: 0 0 8px 0; font-size: 11px; color: rgba(255, 255, 255, 0.75); line-height: 1.5;">
        WhatsApp: <a href="https://wa.me/2348105742618" target="_blank" style="color: #86EFAC; text-decoration: underline;">+2348105742618</a> &bull; Email: <a href="mailto:marxmediahq@gmail.com" style="color: #86EFAC; text-decoration: underline;">marxmediahq@gmail.com</a>
      </p>
      <p style="margin: 0; font-size: 10px; color: rgba(255, 255, 255, 0.4); line-height: 1.4;">
        Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria &bull; All Rights Reserved
      </p>
    </td>
  </tr>
`.trim();

export const renderStandardBodyTextFooter = (trackingId: string, timestamp: string): string => `
======================================================================
EXECUTIVE SECRETARIAT & OFFICIAL SIGNATORIES:
======================================================================
- Director of Sports:    Comrade Oladosu Miracle Okikijesu (Big Pope)
- P.A. to Director:      Abdul Yekeen Muiz Olayinka
- Official Office Email: gisusports@gmail.com
- Secretariat:           Ken Saro-Wiwa Building, Great Ife Students' Union, OAU
- Sports Complex Office: OAU Sports Complex Main Bowl, Ile-Ife
- Tracking Reference:    ${trackingId}

======================================================================
OFFICIAL SOCIAL MEDIA CHANNELS:
======================================================================
- Facebook:  https://facebook.com/greatifesports
- Twitter/X: https://x.com/greatifesports
- Instagram: https://instagram.com/greatifesports
- LinkedIn:  https://linkedin.com/company/greatifesports

======================================================================
DEVELOPED BY MARX DEV STUDIO:
======================================================================
WhatsApp: https://wa.me/2348105742618 (+2348105742618)
Email: marxmediahq@gmail.com
Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria
Dispatched at: ${timestamp}
`.trim();

/**
 * Generates official accreditation email receipt and body for a registered student athlete.
 */
export const generateAccreditationEmail = (card: IdCardRecord): AccreditationEmailData => {
  const timestamp = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const trackingId = `GISU-NOTIF-${Date.now().toString().slice(-6)}`;
  const firstName = card.fullName.trim().split(' ')[0] || 'Athlete';
  const cardEncoded = encodeURIComponent(card.cardNumber);

  // Determine active application base URL (localhost:3005 in dev, or deployed domain)
  const envAppUrl =
    typeof import.meta !== 'undefined' && import.meta?.env
      ? import.meta.env.VITE_APP_URL
      : typeof process !== 'undefined' && process?.env
      ? process.env.VITE_APP_URL
      : undefined;

  const baseUrl =
    typeof window !== 'undefined' && window.location?.origin && !window.location.origin.includes('about:')
      ? window.location.origin
      : envAppUrl || 'http://localhost:3005';

  // Direct, working URL to view and download the ID card
  const verificationUrl = `${baseUrl}/verify?card=${cardEncoded}`;

  // Authentic Supabase CDN branding logos and icons (PNG format for 100% Gmail & Outlook compatibility)
  const gisuLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/gisu_logo.jpg';
  const oauLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/oau_logo.jpg';
  const headsetIconUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_headset.png';
  const facebookIconUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_facebook.png';
  const twitterIconUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_twitter_x.png';
  const instagramIconUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_instagram.png';
  const linkedinIconUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_linkedin.png';
  const celebrationIconUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/icon_celebration.png';

  // Executive, institutional subject line
  const cleanCardNo = (card.cardNumber || 'GICS').replace(/[^a-zA-Z0-9_-]/g, '_');
  const subject = `Official Sports Accreditation & ID Card - ${card.fullName} (${card.cardNumber})`;

  const bodyText = `
GREAT IFE STUDENTS' UNION (GISU)
OFFICE OF THE DIRECTOR OF SPORTS
Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria

----------------------------------------------------------------------
OFFICIAL ATHLETE ACCREDITATION & DIGITAL SPORTS ID
----------------------------------------------------------------------

Dear ${card.fullName},

We are pleased to inform you that your official student-athlete accreditation has been cleared and registered with the Great Ife Sports Central Registry for the ${card.session} academic session.

ATTACHED DOCUMENT:
A single 2-page PDF document containing both your Front Page and Back Page Official Sports ID Card has been generated and attached to this email:
File: Great_Ife_Sports_ID_${cleanCardNo}.pdf

======================================================================
ACCREDITATION CREDENTIALS:
======================================================================
- Card Reference ID:      ${card.cardNumber}
- Accredited Sport:       ${card.sport}
- Full Name:              ${card.fullName}
- Matriculation Number:   ${card.matricNumber}
- Faculty:                ${card.faculty}
- Department:             ${card.department}
- Academic Level:         ${card.level}
- Squad Role / Jersey:    ${card.jerseyNumber ? '#' + card.jerseyNumber : 'Standard Squad'}
- Blood Group:            ${card.bloodGroup}
- Next-of-Kin Contact:    ${card.emergencyContact}
- Issued Date:            ${card.issuedAt}
- Session:                ${card.session}
- Status:                 ACTIVE / VERIFIED (Anti-Mercenary Screened)

======================================================================
ONLINE ACCESS & DIGITAL PASS:
======================================================================
You can also view and verify your accreditation credentials online at:
${verificationUrl}

MATCHDAY ACCREDITATION DIRECTIVE:
Tournament referees and match commissioners scan your CODE128 security barcode at stadium gates prior to kickoff. Present the attached 2-page PDF pass on your mobile device or your printed PVC badge.

${renderStandardBodyTextFooter(trackingId, timestamp)}
`.trim();

  // Institutional, sleek, and executive HTML Email Template
  const bodyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0F172A;">
  <div style="background-color: #F1F5F9; padding: 32px 14px; min-height: 100%;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
      
      <!-- 1. OFFICIAL INSTITUTIONAL HEADER -->
      <tr>
        <td style="background-color: #071E10; padding: 22px 28px; border-bottom: 3px solid #16A34A;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="left" valign="middle">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- Dual University Emblems -->
                    <td valign="middle" style="padding-right: 14px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="line-height: 0;">
                            <img src="${gisuLogoUrl}" width="44" height="44" alt="GISU Emblem" style="border-radius: 50%; border: 2px solid #86EFAC; display: inline-block; vertical-align: middle; background-color: #071E10;" />
                          </td>
                          <td style="line-height: 0; padding-left: 6px;">
                            <img src="${oauLogoUrl}" width="44" height="44" alt="OAU Crest" style="border-radius: 50%; border: 2px solid #FFFFFF; display: inline-block; vertical-align: middle; background-color: #FFFFFF;" />
                          </td>
                        </tr>
                      </table>
                    </td>

                    <!-- Letterhead Brand Titles -->
                    <td valign="middle">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.2px; line-height: 1.2;">
                        Great Ife <span style="color: #86EFAC;">Sports</span>
                      </div>
                      <div style="font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 10px; font-weight: 700; color: rgba(255, 255, 255, 0.7); letter-spacing: 1.2px; text-transform: uppercase; margin-top: 3px;">
                        STUDENTS' UNION &bull; OBAFEMI AWOLOWO UNIVERSITY
                      </div>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- Session Badge -->
              <td align="right" valign="middle">
                <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; padding: 4px 10px; font-family: monospace; font-size: 11px; font-weight: 700; color: #86EFAC;">
                  ${card.session}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 2. DOCUMENT BANNER: ATTACHED 2-PAGE PDF CARD NOTICE -->
      <tr>
        <td style="padding: 24px 28px 0 28px;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="padding: 16px 20px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="42" valign="middle" align="center">
                      <div style="width: 36px; height: 36px; border-radius: 8px; background-color: #DCFCE7; border: 1px solid #86EFAC; text-align: center; line-height: 36px; font-size: 11px; font-weight: 800; color: #15803D; font-family: monospace;">
                        PDF
                      </div>
                    </td>
                    <td style="padding-left: 14px;" valign="middle">
                      <div style="font-size: 13px; font-weight: 800; color: #14532D; text-transform: uppercase; letter-spacing: 0.5px;">
                        Official 2-Page ID Card Attached (Front &amp; Back)
                      </div>
                      <div style="font-size: 12px; color: #166534; line-height: 1.5; margin-top: 3px;">
                        Attached file: <strong>Great_Ife_Sports_ID_${cleanCardNo}.pdf</strong> &bull; Contains Page 1 (Front View) and Page 2 (Back View) in high-resolution, ready for color printing and PVC pass issuance.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 3. MAIN BODY & CREDENTIALS -->
      <tr>
        <td style="padding: 24px 28px 8px 28px;">
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Dear ${card.fullName},
          </h2>
          <p style="font-size: 14px; line-height: 1.65; color: #334155; margin: 0 0 20px 0;">
            This is an official communication confirming that your student-athlete accreditation has been cleared and verified by the <strong>Great Ife Students' Union Directorate of Sports</strong> for the <strong>${card.session}</strong> academic session.
          </p>

          <!-- OFFICIAL ACCREDITATION CARD SUMMARY PANEL -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 22px;">
            <tr>
              <td style="padding: 18px 20px; text-align: center;">
                <div style="font-size: 10px; font-weight: 800; color: #64748B; letter-spacing: 1.2px; text-transform: uppercase;">
                  Official Accreditation Pass Number
                </div>
                <div style="font-size: 28px; font-weight: 900; color: #071E10; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; letter-spacing: 2px; margin: 8px 0;">
                  ${card.cardNumber}
                </div>
                <div style="display: inline-block; background-color: #E8F8EE; border: 1px solid #BBF7D0; color: #15803D; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 9999px;">
                  Accredited Sport: <strong>${card.sport}</strong> &bull; Status: ACTIVE
                </div>
              </td>
            </tr>
          </table>

          <!-- CREDENTIAL DETAILS TABLE -->
          <div style="font-size: 11px; font-weight: 800; color: #64748B; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px;">
            Athlete Credential Record
          </div>
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.5; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
            <tr>
              <td style="padding: 10px 14px; color: #64748B; width: 42%; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">Athlete Legal Name:</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #0F172A; text-align: right; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">${card.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">Matriculation Number:</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #071E10; font-family: monospace; text-align: right; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">${card.matricNumber}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">Faculty:</td>
              <td style="padding: 10px 14px; font-weight: 600; color: #0F172A; text-align: right; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">${card.faculty}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">Department:</td>
              <td style="padding: 10px 14px; font-weight: 600; color: #0F172A; text-align: right; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">${card.department}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">Academic Level:</td>
              <td style="padding: 10px 14px; font-weight: 600; color: #0F172A; text-align: right; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">${card.level}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">Squad Role / Jersey:</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #166534; text-align: right; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">${card.jerseyNumber ? '#' + card.jerseyNumber : 'Standard Squad'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">Blood Group:</td>
              <td style="padding: 10px 14px; font-weight: 600; color: #0F172A; text-align: right; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;">${card.bloodGroup}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">Next-of-Kin Contact:</td>
              <td style="padding: 10px 14px; font-weight: 600; color: #0F172A; text-align: right; background-color: #F8FAFC; border-bottom: 1px solid #F1F5F9;">${card.emergencyContact}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748B; background-color: #FFFFFF;">Issuance Date:</td>
              <td style="padding: 10px 14px; font-weight: 600; color: #0F172A; text-align: right; background-color: #FFFFFF;">${card.issuedAt}</td>
            </tr>
          </table>

          <!-- MATCHDAY PROTOCOL -->
          <div style="background-color: #F8FAFC; border-left: 4px solid #16A34A; border-radius: 8px; padding: 14px 16px; margin-bottom: 22px; font-size: 12px; line-height: 1.6; color: #334155;">
            <strong style="color: #071E10;">Matchday Clearance Directive:</strong> Match officials, referees, and stadium marshals will scan the CODE128 security barcode printed on your ID pass prior to entry. You may present either the attached PDF file on your device or a printed/laminated badge.
          </div>

          <!-- ONLINE PORTAL BUTTON -->
          <div style="text-align: center; margin: 24px 0 20px 0;">
            <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #071E10; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; padding: 14px 34px; border-radius: 8px; letter-spacing: 0.5px; text-transform: uppercase; border: 1px solid #000000;">
              Verify Accreditation Record Online
            </a>
            <div style="font-size: 11px; color: #64748B; margin-top: 8px;">
              Reference: ${card.cardNumber} &bull; Valid for the ${card.session} season
            </div>
          </div>

          <!-- 4. OFFICIAL ISSUANCE DESK SIGNATORIES -->
          ${renderExecutiveSignatoriesHtml(trackingId)}

          <!-- 5. SOCIAL CHANNELS -->
          ${renderSocialChannelsHtml()}

        </td>
      </tr>

      <!-- 6. DEVELOPER ATTRIBUTION FOOTER -->
      ${renderDeveloperFooterHtml()}

    </table>
  </div>
</body>
</html>
`.trim();

  return {
    fromEmail: 'gisusports@gmail.com',
    fromName: "Great Ife Sports",
    toEmail: card.email,
    toName: card.fullName,
    subject,
    bodyText,
    bodyHtml,
    timestamp,
    trackingId,
    status: 'Delivered',
    verificationUrl,
  };
};

/**
 * Creates an external mailto URL allowing the athlete to open their email client
 * and forward/save their official credentials.
 */
export const generateMailtoLink = (card: IdCardRecord): string => {
  const emailData = generateAccreditationEmail(card);
  const encodedSubject = encodeURIComponent(emailData.subject);
  const encodedBody = encodeURIComponent(emailData.bodyText);
  return `mailto:${encodeURIComponent(card.email)}?subject=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Generates official notification email when an athlete's account and ID pass are deleted by the Director
 */
export const generateAccountDeletionEmail = (card: IdCardRecord, reason?: string): AccreditationEmailData => {
  const timestamp = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const trackingId = `GISU-DEL-${Date.now().toString().slice(-6)}`;
  const cleanCardNo = (card.cardNumber || 'GICS').replace(/[^a-zA-Z0-9_-]/g, '_');
  const deletionReason = reason?.trim() || 'Administrative governance directive / Decommission of athlete registration';

  const gisuLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/gisu_logo.jpg';
  const oauLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/oau_logo.jpg';

  const subject = `Official Notice: Sports Accreditation Account Deleted - ${card.fullName} (${card.cardNumber})`;

  const bodyText = `
GREAT IFE STUDENTS' UNION (GISU)
OFFICE OF THE DIRECTOR OF SPORTS
Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria

----------------------------------------------------------------------
OFFICIAL NOTICE: SPORTS ACCREDITATION RECORD DELETED & VACATED
----------------------------------------------------------------------

Dear ${card.fullName},

This is an official communication from the Office of the Director of Sports, Great Ife Students' Union (OAU).

Please be informed that your student-athlete accreditation profile and Digital Sports ID Card (${card.cardNumber}) have been PERMANENTLY DELETED from the Great Ife Sports Central Database.

======================================================================
DELETED ACCREDITATION DETAILS:
======================================================================
- Card Reference ID:      ${card.cardNumber} (NOW VACANT)
- Full Name:              ${card.fullName}
- Matriculation Number:   ${card.matricNumber}
- Faculty:                ${card.faculty}
- Department:             ${card.department}
- Sport Discipline:       ${card.sport}
- Status:                 PERMANENTLY DELETED / DECOMMISSIONED
- Action Authorized By:   Office of the Director of Sports

======================================================================
REASON FOR RECORD DELETION:
======================================================================
${deletionReason}

======================================================================
IMPORTANT DIRECTIVE & STATUS OF ID:
======================================================================
1. The accreditation reference ${card.cardNumber} is now VACANT and has been purged from the active registry.
2. The Digital Sports ID pass and associated CODE128 barcode previously issued to you are hereby INVALIDATED.
3. You are not eligible to present this pass for matchday entrance, Inter-Faculty Games, or varsity trials.
4. If this action was taken to permit re-registration or data correction, you may submit a fresh application on the portal.

For appeals or clearance inquiries, contact the Sports Council Secretariat:
Office of the Director of Sports, Students' Union Building (SUB), OAU.
Official Email: gisusports@gmail.com

${renderStandardBodyTextFooter(trackingId, timestamp)}
`.trim();

  const bodyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <div style="background-color: #F8FAFC; padding: 32px 14px; min-height: 100%;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
      
      <!-- HEADER -->
      <tr>
        <td style="background-color: #071E10; padding: 22px 28px; border-bottom: 3px solid #DC2626;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="left" valign="middle">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle" style="padding-right: 14px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="line-height: 0;">
                            <img src="${gisuLogoUrl}" width="44" height="44" alt="GISU Emblem" style="border-radius: 50%; border: 2px solid #FCA5A5; display: inline-block; vertical-align: middle; background-color: #071E10;" />
                          </td>
                          <td style="line-height: 0; padding-left: 6px;">
                            <img src="${oauLogoUrl}" width="44" height="44" alt="OAU Crest" style="border-radius: 50%; border: 2px solid #FFFFFF; display: inline-block; vertical-align: middle; background-color: #FFFFFF;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.2px; line-height: 1.2;">
                        Great Ife <span style="color: #FCA5A5;">Sports</span>
                      </div>
                      <div style="font-family: monospace; font-size: 10px; font-weight: 700; color: rgba(255, 255, 255, 0.7); letter-spacing: 1.2px; text-transform: uppercase; margin-top: 3px;">
                        OFFICE OF THE DIRECTOR OF SPORTS &bull; OAU
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right" valign="middle">
                <div style="display: inline-block; background-color: rgba(220, 38, 38, 0.2); border: 1px solid #DC2626; border-radius: 6px; padding: 4px 10px; font-family: monospace; font-size: 11px; font-weight: 700; color: #FCA5A5;">
                  RECORD PURGED
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- BANNER -->
      <tr>
        <td style="background-color: #FEF2F2; padding: 18px 28px; border-bottom: 1px solid #FEE2E2;">
          <div style="font-family: monospace; font-size: 11px; font-weight: 800; color: #991B1B; text-transform: uppercase; letter-spacing: 0.5px;">
            OFFICIAL NOTICE // ACCREDITATION RECORD DELETED & VACATED
          </div>
          <div style="font-size: 16px; font-weight: 800; color: #7F1D1D; margin-top: 4px;">
            Sports Pass ${card.cardNumber} Has Been Decommissioned
          </div>
        </td>
      </tr>

      <!-- BODY CONTENT -->
      <tr>
        <td style="padding: 28px;">
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #1E293B; line-height: 1.6;">
            Dear <strong>${card.fullName}</strong>,
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
            This is an official administrative notice from the Office of the Director of Sports, Great Ife Students' Union (OAU). Your student-athlete accreditation profile and sports credential pass have been <strong>permanently deleted from the central registry</strong>.
          </p>

          <!-- DETAILS TABLE -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; font-size: 13px;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; width: 40%;">Card Reference ID:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #991B1B; font-family: monospace; font-weight: 700;">${card.cardNumber} (VACATED)</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Student Athlete:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-weight: 700;">${card.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Matriculation Number:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-family: monospace;">${card.matricNumber}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Faculty / Discipline:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${card.faculty} &bull; ${card.sport}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #64748B;">Registry Status:</td>
              <td style="padding: 12px 16px; color: #991B1B; font-weight: 700; font-family: monospace;">PURGED / VACANT</td>
            </tr>
          </table>

          <!-- REASON BOX -->
          <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 14px 16px; border-radius: 6px; margin: 20px 0;">
            <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #991B1B; text-transform: uppercase;">
              REASON PROVIDED BY THE OFFICE OF THE DIRECTOR OF SPORTS:
            </div>
            <div style="font-size: 13px; color: #7F1D1D; margin-top: 4px; line-height: 1.5;">
              ${deletionReason}
            </div>
          </div>

          <div style="background-color: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-top: 20px;">
            <div style="font-size: 12px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">
              Directives Regarding Deletion:
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569; line-height: 1.6;">
              <li>The issued Digital Sports ID pass (${card.cardNumber}) and its security barcode are immediately invalidated.</li>
              <li>Attempting to present this credential at matchday gates will result in an invalid barcode scan flag.</li>
              <li>Your matriculation number is now freed in the central registry. If you require registration correction, you may re-apply on the official portal.</li>
            </ul>
          </div>

          ${renderExecutiveSignatoriesHtml(trackingId)}
          ${renderSocialChannelsHtml()}
        </td>
      </tr>

      ${renderDeveloperFooterHtml()}

    </table>
  </div>
</body>
</html>
`.trim();

  return {
    fromEmail: 'gisusports@gmail.com',
    fromName: 'Great Ife Sports',
    toEmail: card.email,
    toName: card.fullName,
    subject,
    bodyText,
    bodyHtml,
    timestamp,
    trackingId,
    status: 'Delivered',
    verificationUrl: '',
  };
};

/**
 * Generates official notification email when an athlete's account is placed on suspension by the Director
 */
export const generateAccountSuspensionEmail = (card: IdCardRecord, reason?: string): AccreditationEmailData => {
  const timestamp = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const trackingId = `GISU-SUSP-${Date.now().toString().slice(-6)}`;
  const suspensionReason = reason?.trim() || 'Official Sports Council administrative inquiry / Eligibility compliance review';

  const gisuLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/gisu_logo.jpg';
  const oauLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/oau_logo.jpg';

  const subject = `Urgent Notice: Sports Accreditation Suspended - ${card.fullName} (${card.cardNumber})`;

  const bodyText = `
GREAT IFE STUDENTS' UNION (GISU)
OFFICE OF THE DIRECTOR OF SPORTS
Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria

----------------------------------------------------------------------
URGENT NOTICE: ATHLETE SPORTS PASS TEMPORARILY SUSPENDED
----------------------------------------------------------------------

Dear ${card.fullName},

This is an urgent official notice from the Office of the Director of Sports, Great Ife Students' Union.

Your Digital Sports ID Card (${card.cardNumber}) has been placed on SUSPENDED STATUS effective immediately.

======================================================================
ACCREDITATION RECORD UNDER SUSPENSION:
======================================================================
- Card Reference ID:      ${card.cardNumber}
- Student Athlete:        ${card.fullName}
- Matriculation Number:   ${card.matricNumber}
- Faculty / Department:   ${card.faculty} &bull; ${card.department}
- Sport Discipline:       ${card.sport}
- Current Status:         SUSPENDED / INELIGIBLE

======================================================================
REASON FOR SUSPENSION:
======================================================================
${suspensionReason}

======================================================================
IMPLICATIONS & RESOLUTION DIRECTIVES:
======================================================================
1. While suspended, your CODE128 security barcode will return "SUSPENDED / INELIGIBLE" when scanned at stadium gates.
2. Referees and match officials are instructed not to clear suspended athletes for Inter-Faculty or varsity fixtures.
3. To lift this suspension or resolve any outstanding eligibility inquiries, report in person to the Sports Council Secretariat:
   Office of the Director of Sports, Students' Union Building (SUB), OAU.
   Official Email: gisusports@gmail.com

${renderStandardBodyTextFooter(trackingId, timestamp)}
`.trim();

  const bodyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <div style="background-color: #F8FAFC; padding: 32px 14px; min-height: 100%;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
      
      <!-- HEADER -->
      <tr>
        <td style="background-color: #071E10; padding: 22px 28px; border-bottom: 3px solid #EAB308;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="left" valign="middle">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle" style="padding-right: 14px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="line-height: 0;">
                            <img src="${gisuLogoUrl}" width="44" height="44" alt="GISU Emblem" style="border-radius: 50%; border: 2px solid #FDE047; display: inline-block; vertical-align: middle; background-color: #071E10;" />
                          </td>
                          <td style="line-height: 0; padding-left: 6px;">
                            <img src="${oauLogoUrl}" width="44" height="44" alt="OAU Crest" style="border-radius: 50%; border: 2px solid #FFFFFF; display: inline-block; vertical-align: middle; background-color: #FFFFFF;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.2px; line-height: 1.2;">
                        Great Ife <span style="color: #FDE047;">Sports</span>
                      </div>
                      <div style="font-family: monospace; font-size: 10px; font-weight: 700; color: rgba(255, 255, 255, 0.7); letter-spacing: 1.2px; text-transform: uppercase; margin-top: 3px;">
                        OFFICE OF THE DIRECTOR OF SPORTS &bull; OAU
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right" valign="middle">
                <div style="display: inline-block; background-color: rgba(234, 179, 8, 0.2); border: 1px solid #EAB308; border-radius: 6px; padding: 4px 10px; font-family: monospace; font-size: 11px; font-weight: 700; color: #FDE047;">
                  SUSPENDED
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- BANNER -->
      <tr>
        <td style="background-color: #FEFCE8; padding: 18px 28px; border-bottom: 1px solid #FEF08A;">
          <div style="font-family: monospace; font-size: 11px; font-weight: 800; color: #854D0E; text-transform: uppercase; letter-spacing: 0.5px;">
            OFFICIAL NOTICE // TEMPORARY SUSPENSION OF ACCREDITATION
          </div>
          <div style="font-size: 16px; font-weight: 800; color: #713F12; margin-top: 4px;">
            Sports Pass ${card.cardNumber} Temporarily Suspended
          </div>
        </td>
      </tr>

      <!-- BODY CONTENT -->
      <tr>
        <td style="padding: 28px;">
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #1E293B; line-height: 1.6;">
            Dear <strong>${card.fullName}</strong>,
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
            Please be informed that your official student-athlete sports accreditation pass (<strong>${card.cardNumber}</strong>) has been placed on <strong>TEMPORARY SUSPENSION</strong> by the Office of the Director of Sports.
          </p>

          <!-- DETAILS TABLE -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; font-size: 13px;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; width: 40%;">Card Reference ID:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-family: monospace; font-weight: 700;">${card.cardNumber}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Student Athlete:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-weight: 700;">${card.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Matriculation Number:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-family: monospace;">${card.matricNumber}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Faculty / Sport:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${card.faculty} &bull; ${card.sport}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #64748B;">Current Status:</td>
              <td style="padding: 12px 16px; color: #B45309; font-weight: 700; font-family: monospace;">TEMPORARILY SUSPENDED</td>
            </tr>
          </table>

          <!-- REASON BOX -->
          <div style="background-color: #FEFCE8; border-left: 4px solid #EAB308; padding: 14px 16px; border-radius: 6px; margin: 20px 0;">
            <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #854D0E; text-transform: uppercase;">
              REASON FOR SUSPENSION:
            </div>
            <div style="font-size: 13px; color: #713F12; margin-top: 4px; line-height: 1.5;">
              ${suspensionReason}
            </div>
          </div>

          <div style="background-color: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-top: 20px;">
            <div style="font-size: 12px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">
              Matchday Guidelines Under Suspension:
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569; line-height: 1.6;">
              <li>Barcode scanner check-in will flag your pass as suspended and ineligible.</li>
              <li>You may not participate in official collegiate matches, tournament lineups, or trials until this status is lifted.</li>
              <li>To appeal or provide required clearance documentation, contact the Sports Council Secretariat.</li>
            </ul>
          </div>

          ${renderExecutiveSignatoriesHtml(trackingId)}
          ${renderSocialChannelsHtml()}
        </td>
      </tr>

      ${renderDeveloperFooterHtml()}

    </table>
  </div>
</body>
</html>
`.trim();

  return {
    fromEmail: 'gisusports@gmail.com',
    fromName: 'Great Ife Sports',
    toEmail: card.email,
    toName: card.fullName,
    subject,
    bodyText,
    bodyHtml,
    timestamp,
    trackingId,
    status: 'Delivered',
    verificationUrl: '',
  };
};

/**
 * Generates official notification email when an athlete's suspended pass is reinstated back to active
 */
export const generateAccountReinstatementEmail = (card: IdCardRecord): AccreditationEmailData => {
  const timestamp = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const trackingId = `GISU-REIN-${Date.now().toString().slice(-6)}`;

  const gisuLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/gisu_logo.jpg';
  const oauLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/oau_logo.jpg';

  const subject = `Official Notice: Sports Accreditation Reinstated - ${card.fullName} (${card.cardNumber})`;

  const bodyText = `
GREAT IFE STUDENTS' UNION (GISU)
OFFICE OF THE DIRECTOR OF SPORTS
Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria

----------------------------------------------------------------------
OFFICIAL NOTICE: SPORTS ACCREDITATION REINSTATED TO ACTIVE STATUS
----------------------------------------------------------------------

Dear ${card.fullName},

We are pleased to inform you that following clearance review by the Office of the Director of Sports, your Digital Sports ID Card (${card.cardNumber}) has been REINSTATED TO ACTIVE STATUS.

- Card Reference ID:      ${card.cardNumber}
- Student Athlete:        ${card.fullName}
- Matriculation Number:   ${card.matricNumber}
- Faculty / Department:   ${card.faculty} &bull; ${card.department}
- Sport Discipline:       ${card.sport}
- Status:                 ACTIVE &amp; VERIFIED

Your barcode security pass has been re-authorized for matchday clearance, Inter-Faculty Games fixtures, and varsity trials.

${renderStandardBodyTextFooter(trackingId, timestamp)}
`.trim();

  const bodyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <div style="background-color: #F8FAFC; padding: 32px 14px; min-height: 100%;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
      
      <!-- HEADER -->
      <tr>
        <td style="background-color: #071E10; padding: 22px 28px; border-bottom: 3px solid #16A34A;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="left" valign="middle">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle" style="padding-right: 14px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="line-height: 0;">
                            <img src="${gisuLogoUrl}" width="44" height="44" alt="GISU Emblem" style="border-radius: 50%; border: 2px solid #86EFAC; display: inline-block; vertical-align: middle; background-color: #071E10;" />
                          </td>
                          <td style="line-height: 0; padding-left: 6px;">
                            <img src="${oauLogoUrl}" width="44" height="44" alt="OAU Crest" style="border-radius: 50%; border: 2px solid #FFFFFF; display: inline-block; vertical-align: middle; background-color: #FFFFFF;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.2px; line-height: 1.2;">
                        Great Ife <span style="color: #86EFAC;">Sports</span>
                      </div>
                      <div style="font-family: monospace; font-size: 10px; font-weight: 700; color: rgba(255, 255, 255, 0.7); letter-spacing: 1.2px; text-transform: uppercase; margin-top: 3px;">
                        OFFICE OF THE DIRECTOR OF SPORTS &bull; OAU
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right" valign="middle">
                <div style="display: inline-block; background-color: rgba(22, 163, 74, 0.2); border: 1px solid #16A34A; border-radius: 6px; padding: 4px 10px; font-family: monospace; font-size: 11px; font-weight: 700; color: #86EFAC;">
                  REINSTATED
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding: 28px;">
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #1E293B; line-height: 1.6;">
            Dear <strong>${card.fullName}</strong>,
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
            We are pleased to inform you that your sports accreditation pass (<strong>${card.cardNumber}</strong>) has been <strong>REINSTATED TO ACTIVE STATUS</strong> following official clearance by the Office of the Director of Sports.
          </p>
          <p style="margin: 0 0 16px 0; font-size: 13px; color: #16A34A; font-weight: 700;">
            Your CODE128 security barcode is fully cleared for all upcoming Inter-Faculty and varsity tournament matchdays.
          </p>

          <!-- DETAILS TABLE -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; font-size: 13px;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B; width: 40%;">Card Reference ID:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-family: monospace; font-weight: 700;">${card.cardNumber}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Student Athlete:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-weight: 700;">${card.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Matriculation Number:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-family: monospace;">${card.matricNumber}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #64748B;">Faculty / Sport:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${card.faculty} &bull; ${card.sport}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #64748B;">Accreditation Status:</td>
              <td style="padding: 12px 16px; color: #16A34A; font-weight: 700; font-family: monospace;">ACTIVE &amp; CLEARED</td>
            </tr>
          </table>

          ${renderExecutiveSignatoriesHtml(trackingId)}
          ${renderSocialChannelsHtml()}
        </td>
      </tr>

      ${renderDeveloperFooterHtml()}

    </table>
  </div>
</body>
</html>
`.trim();

  return {
    fromEmail: 'gisusports@gmail.com',
    fromName: 'Great Ife Sports',
    toEmail: card.email,
    toName: card.fullName,
    subject,
    bodyText,
    bodyHtml,
    timestamp,
    trackingId,
    status: 'Delivered',
    verificationUrl: '',
  };
};

export interface NewsletterBroadcastEmailData extends AccreditationEmailData {
  headline: string;
  category: string;
  salutation: string;
}

/**
 * Generates an official institutional newsletter & announcement email.
 * Salutation is personalized:
 * - Registered athletes with names receive: "Dear [FullName],"
 * - Public newsletter subscribers who only entered their email receive: "Hi,"
 */
export const generateNewsletterBroadcastEmail = (
  recipient: { email: string; name?: string },
  broadcast: NewsletterBroadcastPayload
): NewsletterBroadcastEmailData => {
  const timestamp = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const trackingId = `GISU-BULLETIN-${Date.now().toString().slice(-6)}`;
  const hasName = Boolean(recipient.name && recipient.name.trim().length > 0);
  const salutation = hasName ? `Dear ${recipient.name!.trim()},` : 'Hi,';
  const toName = hasName ? recipient.name!.trim() : 'Sports Community Subscriber';

  const gisuLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/gisu_logo.jpg';
  const oauLogoUrl = 'https://psehglykjebatlpdgiph.supabase.co/storage/v1/object/public/athlete-photos/branding/oau_logo.jpg';

  const subject = broadcast.subject.trim() || 'Official Sports Directorate Bulletin - Great Ife Sports';
  const headline = broadcast.headline.trim() || 'Great Ife Sports Directorate Bulletin';
  const category = (broadcast.category || 'General Update').toUpperCase();

  // Convert multi-line announcement content into clean HTML paragraphs
  const contentParagraphs = broadcast.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.7;">${p.replace(/\n/g, '<br />')}</p>`
    )
    .join('');

  const ctaButtonHtml =
    broadcast.ctaText && broadcast.ctaUrl
      ? `
        <div style="text-align: center; margin: 26px 0 22px 0;">
          <a href="${broadcast.ctaUrl}" target="_blank" style="display: inline-block; background-color: #071E10; color: #FFFFFF; font-size: 13px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.5px; text-transform: uppercase; border: 1px solid #000000;">
            ${broadcast.ctaText}
          </a>
        </div>
      `
      : '';

  const bodyText = `
GREAT IFE STUDENTS' UNION (GISU)
OFFICE OF THE DIRECTOR OF SPORTS
Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria

----------------------------------------------------------------------
OFFICIAL SPORTS DIRECTORATE BULLETIN // [${category}]
${headline}
----------------------------------------------------------------------

${salutation}

${broadcast.content.trim()}

${broadcast.ctaText && broadcast.ctaUrl ? `\nOFFICIAL LINK: ${broadcast.ctaText} -> ${broadcast.ctaUrl}\n` : ''}
${renderStandardBodyTextFooter(trackingId, timestamp)}
`.trim();

  const bodyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style type="text/css">
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F8FAFC; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding: 18px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <div style="background-color: #F8FAFC; padding: 32px 14px; min-height: 100%;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
      
      <!-- 1. OFFICIAL INSTITUTIONAL HEADER -->
      <tr>
        <td style="background-color: #071E10; padding: 22px 28px; border-bottom: 3px solid #16A34A;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="left" valign="middle">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle" style="padding-right: 14px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="line-height: 0;">
                            <img src="${gisuLogoUrl}" width="44" height="44" alt="GISU Emblem" style="border-radius: 50%; border: 2px solid #86EFAC; display: inline-block; vertical-align: middle; background-color: #071E10;" />
                          </td>
                          <td style="line-height: 0; padding-left: 6px;">
                            <img src="${oauLogoUrl}" width="44" height="44" alt="OAU Crest" style="border-radius: 50%; border: 2px solid #FFFFFF; display: inline-block; vertical-align: middle; background-color: #FFFFFF;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.2px; line-height: 1.2;">
                        Great Ife <span style="color: #86EFAC;">Sports</span>
                      </div>
                      <div style="font-family: monospace; font-size: 10px; font-weight: 700; color: rgba(255, 255, 255, 0.7); letter-spacing: 1.2px; text-transform: uppercase; margin-top: 3px;">
                        OFFICIAL BULLETIN &bull; GISU / OAU
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right" valign="middle">
                <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; padding: 4px 10px; font-family: monospace; font-size: 10px; font-weight: 700; color: #86EFAC; text-transform: uppercase;">
                  ${category}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 2. ANNOUNCEMENT HEADLINE BANNER -->
      <tr>
        <td style="background-color: #F0FDF4; padding: 20px 28px; border-bottom: 1px solid #DCFCE7;">
          <div style="font-family: monospace; font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.8px;">
            GREAT IFE SPORTS CENTRAL BULLETIN
          </div>
          <h1 style="font-size: 19px; font-weight: 900; color: #071E10; margin: 6px 0 0 0; line-height: 1.35;">
            ${headline}
          </h1>
        </td>
      </tr>

      <!-- 3. BODY CONTENT -->
      <tr>
        <td class="mobile-padding" style="padding: 28px;">
          <!-- Personalized Salutation: 'Dear [FullName],' for athletes vs 'Hi,' for newsletter subscribers -->
          <p style="font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0;">
            ${salutation}
          </p>

          ${contentParagraphs}

          ${ctaButtonHtml}

          <!-- Signatories and Footers -->
          ${renderExecutiveSignatoriesHtml(trackingId)}
          ${renderSocialChannelsHtml()}
        </td>
      </tr>

      <!-- 4. DEVELOPER ATTRIBUTION FOOTER -->
      ${renderDeveloperFooterHtml()}

    </table>
  </div>
</body>
</html>
`.trim();

  return {
    fromEmail: 'gisusports@gmail.com',
    fromName: 'Office of the Director of Sports',
    toEmail: recipient.email,
    toName,
    salutation,
    headline,
    category,
    subject,
    bodyText,
    bodyHtml,
    timestamp,
    trackingId,
    status: 'Delivered',
    verificationUrl: '',
  };
};

