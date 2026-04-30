import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS must be set in environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: `"SwitchYard FX" <${user}>`,
    to,
    subject,
    html,
  });

  console.log('Email sent:', info.messageId);
  return { success: true, messageId: info.messageId };
}



export function buildInsightsEmail({
  recipientName,
  recipientEmail,
  insights,
  fullInsightsUrl,
}: {
  recipientName: string
  recipientEmail: string
  insights: { title: string; summary: string; category: string; date: string; trend: "up" | "down" | "neutral" }[]
  fullInsightsUrl: string
}) {
  const trendLabel = (t: "up" | "down" | "neutral") =>
    t === "up" ? "📈 Bullish" : t === "down" ? "📉 Bearish" : "➡️ Neutral"
  const trendColor = (t: "up" | "down" | "neutral") =>
    t === "up" ? "#065f46" : t === "down" ? "#991b1b" : "#374151"
  const trendBg = (t: "up" | "down" | "neutral") =>
    t === "up" ? "#d1fae5" : t === "down" ? "#fee2e2" : "#f3f4f6"

  const insightRows = insights.slice(0, 5).map((item) => `
    <tr>
      <td style="padding: 0 0 20px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="background-color: #ffffff; border: 1px solid #dce5e1; border-radius: 10px; overflow: hidden;">
          <tr>
            <td style="padding: 20px 24px;">
              <span style="display: inline-block; padding: 3px 10px; border-radius: 20px;
                background-color: #e8eeeb; color: #2d6a4f; font-size: 11px; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.5px;">${item.category}</span>
              &nbsp;
              <span style="display: inline-block; padding: 3px 10px; border-radius: 20px;
                background-color: ${trendBg(item.trend)}; color: ${trendColor(item.trend)};
                font-size: 11px; font-weight: 600;">${trendLabel(item.trend)}</span>
              <h3 style="margin: 10px 0 6px; font-size: 16px; font-weight: 700; color: #12261f; line-height: 1.4;">${item.title}</h3>
              <p style="margin: 0 0 10px; font-size: 14px; color: #4a5a55; line-height: 1.6;">${item.summary}</p>
              <span style="font-size: 12px; color: #52796f;">${item.date}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your FX Market Insights — SwitchYard FX</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7f6; padding: 40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
        <tr>
          <td style="background-color: #12261f; padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">SwitchYard FX</h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: #a8c5ba;">Corporate FX Advisory</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 32px 40px 8px;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; background-color: #2d6a4f;
              color: #a8c5ba; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
              Weekly Insights
            </span>
            <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #12261f;">Hi ${recipientName},</h2>
            <p style="margin: 0 0 28px; font-size: 15px; color: #4a5a55; line-height: 1.7;">
              Here's your summary of this week's key FX movements and strategic commentary from the SwitchYard FX team.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 0 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${insightRows}</table>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 8px 40px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #12261f; border-radius: 12px;">
              <tr>
                <td style="padding: 32px; text-align: center;">
                  <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #ffffff;">Want the full picture?</h3>
                  <p style="margin: 0 0 20px; font-size: 14px; color: #a8c5ba; line-height: 1.6;">
                    View in-depth analysis, filter by currency pair, participate in polls, and interact with the full insights page.
                  </p>
                  <a href="${fullInsightsUrl}" style="display: inline-block; padding: 14px 36px; background-color: #2d6a4f;
                    color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 700;">
                    Take Me to My Full Insights →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color: #12261f; padding: 24px 40px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="margin: 0 0 6px; font-size: 13px; color: #a8c5ba;">SwitchYard FX | Corporate FX Advisory</p>
            <p style="margin: 0 0 6px; font-size: 12px; color: #52796f;">Powered by Ebury Partners Australia | AFSL 520548</p>
            <p style="margin: 12px 0 0; font-size: 11px; color: #52796f;">
              This email was sent to ${recipientEmail}. If you didn't sign up, please ignore this email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
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
