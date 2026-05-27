const BRAND_PRIMARY = '#1354AF';
const BRAND_PRIMARY_DARK = '#0D476D';
const TEXT_PRIMARY = '#1a1a2e';
const TEXT_SECONDARY = '#5c5c6f';
const SURFACE_MUTED = '#f4f6f8';
const FOOTER_BG = '#eef1f5';

const emailFont =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

type ActionEmailOptions = {
  greeting: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  footerNote: string;
  heroEmoji: string;
  heroCaption: string;
};

const buildActionEmail = (options: ActionEmailOptions): string => {
  const origin = process.env.CORS_ORIGIN ?? '';
  const logoUrl = `${origin}/assets/logo/attendix-logo.svg`;
  const year = new Date().getFullYear();
  const supportEmail = process.env.SMTP_USERNAME ?? 'support';
  let siteLabel = 'Attendix';
  try {
    if (origin) siteLabel = new URL(origin).hostname;
  } catch {
    // keep default label when CORS_ORIGIN is not a valid URL
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Attendix</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:${emailFont};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 16px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="${logoUrl}" alt="Attendix" width="52" height="52" style="display:block;border:0;" />
              <p style="margin:12px 0 0;font-size:22px;font-weight:700;color:${TEXT_PRIMARY};letter-spacing:-0.02em;">Attendix</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${SURFACE_MUTED};border-radius:20px;">
                <tr>
                  <td align="center" style="padding:40px 24px;">
                    <p style="margin:0 0 8px;font-size:32px;line-height:1;">${options.heroEmoji}</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:${BRAND_PRIMARY_DARK};letter-spacing:0.04em;text-transform:uppercase;">${options.heroCaption}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 8px 12px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:${TEXT_PRIMARY};">${options.greeting}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 8px 28px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:${TEXT_SECONDARY};">${options.body}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="border-radius:999px;background-color:${BRAND_PRIMARY};">
                    <a href="${options.ctaHref}" target="_blank" style="display:inline-block;padding:16px 28px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">
                      <span style="vertical-align:middle;">${options.ctaLabel}</span>
                      <span style="display:inline-block;margin-left:12px;width:28px;height:28px;line-height:28px;text-align:center;background-color:#ffffff;color:${BRAND_PRIMARY};border-radius:50%;font-size:16px;vertical-align:middle;">&#8599;</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:${FOOTER_BG};border-radius:16px;padding:28px 24px;">
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${TEXT_SECONDARY};text-align:center;">
                ${options.footerNote}
                <a href="mailto:${supportEmail}" style="color:${BRAND_PRIMARY};text-decoration:none;font-weight:600;">${supportEmail}</a>.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.5;color:${TEXT_SECONDARY};text-align:center;">
                Thanks,<br />
                <strong style="color:${TEXT_PRIMARY};">The Attendix Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-size:12px;color:#9ca3af;">&copy; ${year} Attendix</td>
                  <td align="right" style="font-size:12px;color:#9ca3af;">${siteLabel}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const buildResetPasswordEmailHtml = (
  resetLink: string,
  firstName?: string
): string => {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';

  return buildActionEmail({
    greeting,
    body: 'Need to reset your password? No problem. Just click the button below. This link expires in 15 minutes.',
    ctaLabel: 'Reset password',
    ctaHref: resetLink,
    footerNote: 'If you did not initiate this request, please contact us at ',
    heroEmoji: '&#128273;',
    heroCaption: 'Password reset',
  });
};

export const buildApprovalEmailHtml = (
  loginLink: string,
  firstName: string,
  lastName: string
): string => {
  return buildActionEmail({
    greeting: `Hi ${firstName},`,
    body: `Your Attendix account (${firstName} ${lastName}) has been approved. Click the button below to sign in and get started.`,
    ctaLabel: 'Sign in',
    ctaHref: loginLink,
    footerNote: 'If you have questions about your account, please contact us at ',
    heroEmoji: '&#9989;',
    heroCaption: 'Account approved',
  });
};
