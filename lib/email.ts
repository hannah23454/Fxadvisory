import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      'SMTP credentials are not configured. Set SMTP_USER and SMTP_PASS in your environment variables.'
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const mailOptions = {
    from: `"SwitchYard FX" <${process.env.SMTP_FROM || 'hannah@switchyardfx.com.au'}>`,
    to,
    subject,
    html,
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

export function buildHedgePolicyEmail({
  email,
  fxVolume,
  fxProvider,
  passwordSetupUrl,
  isNewUser,
}: {
  email: string;
  fxVolume: string;
  fxProvider: string;
  passwordSetupUrl?: string;
  isNewUser: boolean;
}) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://switchyardfx.com.au';
  const dashboardUrl = `${baseUrl}/dashboard`;
  const loginUrl = `${baseUrl}/login`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your FX Hedge Policy Access</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #12261f; padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                SwitchYard FX
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #a8c5ba;">
                Corporate FX Advisory
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px;">
              <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #12261f;">
                Your FX Hedge Policy Access
              </h2>
              <p style="margin: 0 0 24px; font-size: 15px; color: #4a5a55; line-height: 1.6;">
                Thank you for your interest in our FX Hedge Policy Template. Here are your details:
              </p>

              <!-- Details Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7f6; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 13px; color: #4a5a55; font-weight: 600; width: 160px;">Annual FX Volume:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #12261f; font-weight: 700;">${fxVolume}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 13px; color: #4a5a55; font-weight: 600;">Current FX Provider:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #12261f; font-weight: 700;">${fxProvider}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 13px; color: #4a5a55; font-weight: 600;">Email:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #12261f;">${email}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0;">
                    <a href="${isNewUser ? loginUrl : dashboardUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2d6a4f; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: -0.2px;">
                      ${isNewUser ? 'Log In to Your Dashboard' : 'View Policy in Dashboard'}
                    </a>
                  </td>
                </tr>
              </table>

              ${isNewUser && passwordSetupUrl ? `
              <!-- Password Setup -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-top: 1px solid #dce5e1;">
                <tr>
                  <td style="padding: 24px 0 0;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #4a5a55; line-height: 1.6;">
                      We've created an account for you. Please set up your password to access your dashboard:
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${passwordSetupUrl}" style="display: inline-block; padding: 12px 28px; background-color: #0f5ca1; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                            Set Up Your Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 12px 0 0; font-size: 12px; color: #999;">
                      This link expires in 24 hours.
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #12261f; padding: 24px 40px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #a8c5ba;">
                SwitchYard FX | Corporate FX Advisory
              </p>
              <p style="margin: 0; font-size: 12px; color: #52796f;">
                Powered by Ebury Partners Australia | AFSL 520548
              </p>
              <p style="margin: 12px 0 0; font-size: 11px; color: #52796f;">
                This email was sent to ${email}. If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
