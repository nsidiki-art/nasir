import { BrevoClient } from "@getbrevo/brevo";
import { siteConfig, getAbsolutePath } from "./config";

// Get configuration from environment
const getSenderEmail = () => process.env.BREVO_SENDER_EMAIL || `noreply@${new URL(siteConfig.url).hostname}`;
const getSenderName = () => process.env.BREVO_SENDER_NAME || siteConfig.name;
const getAdminEmail = () => process.env.BREVO_ADMIN_EMAIL || "nasir@nasirsidiki.com";

// Get API key with validation
const getApiKey = () => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY not set in environment variables");
  }
  return apiKey;
};

// Initialize Brevo client (lazy initialization)
let brevoInstance: BrevoClient | null = null;

const getBrevoClient = () => {
  if (!brevoInstance) {
    brevoInstance = new BrevoClient({
      apiKey: getApiKey(),
      timeoutInSeconds: 30,
      maxRetries: 2,
    });
  }
  return brevoInstance;
};

export { getBrevoClient, getSenderEmail, getSenderName, getAdminEmail };

/**
 * Send a direct HTML email
 */
export async function sendDirectEmail(
  to: string,
  subject: string,
  htmlContent: string,
  toName?: string
) {
  const brevo = getBrevoClient();
  const result = await brevo.transactionalEmails.sendTransacEmail({
    sender: { email: getSenderEmail(), name: getSenderName() },
    to: [{ email: to, ...(toName && { name: toName }) }],
    subject,
    htmlContent,
    textContent: stripHtmlTags(htmlContent),
  });

  return result;
}

/**
 * Send contact form submission to admin with auto-reply to sender
 */
export async function handleContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const brevo = getBrevoClient();
  const senderEmail = getSenderEmail();
  const senderName = getSenderName();
  const adminEmail = getAdminEmail();

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeSubject = escapeHtml(data.subject);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br>");

  // Email to admin
  const adminEmailParams = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: adminEmail, name: "Nasir Siddiqui" }],
    subject: `📬 New Message: ${safeSubject}`,
    htmlContent: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0d0d0d 0%,#1a1a1a 100%);border:1px solid rgba(100,244,171,0.2);border-radius:12px 12px 0 0;padding:30px;text-align:center;">
          <div style="display:inline-block;background:rgba(100,244,171,0.1);border:1px solid #64F4AB;border-radius:8px;padding:6px 14px;margin-bottom:16px;">
            <span style="color:#64F4AB;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Portfolio Contact</span>
          </div>
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">New Message Received</h1>
          <p style="color:#888;margin:8px 0 0;font-size:13px;">Someone reached out via your portfolio</p>
        </div>

        <!-- Body -->
        <div style="background:#141414;border-left:1px solid rgba(100,244,171,0.1);border-right:1px solid rgba(100,244,171,0.1);padding:30px;">

          <!-- Sender Info -->
          <div style="background:#1a1a1a;border-radius:10px;padding:20px;margin-bottom:20px;border:1px solid #222;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #222;width:110px;">
                  <span style="color:#64F4AB;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">From</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #222;color:#e0e0e0;font-size:14px;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #222;">
                  <span style="color:#64F4AB;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Email</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #222;">
                  <a href="mailto:${safeEmail}" style="color:#FECD1A;text-decoration:none;font-size:14px;">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;">
                  <span style="color:#64F4AB;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Subject</span>
                </td>
                <td style="padding:10px 0;color:#e0e0e0;font-size:14px;">${safeSubject}</td>
              </tr>
            </table>
          </div>

          <!-- Message -->
          <div>
            <p style="color:#64F4AB;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">Message</p>
            <div style="background:#1a1a1a;border-left:3px solid #64F4AB;border-radius:0 8px 8px 0;padding:16px 20px;color:#cccccc;font-size:14px;line-height:1.7;">
              ${safeMessage}
            </div>
          </div>

          <!-- Reply CTA -->
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${safeEmail}?subject=Re: ${safeSubject}" style="display:inline-block;background:#FECD1A;color:#000000;padding:12px 32px;text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;">
              Reply to ${safeName} →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#0d0d0d;border:1px solid rgba(100,244,171,0.1);border-top:0;border-radius:0 0 12px 12px;padding:16px 30px;text-align:center;">
          <p style="color:#555;font-size:11px;margin:0;">Received ${new Date().toLocaleString('en-US',{dateStyle:'long',timeStyle:'short'})} · Nasir Siddiqui Portfolio</p>
        </div>

      </div>
    </body>
    </html>
    `,
  };

  // Auto-reply to sender
  const autoReplyParams = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: data.email, name: data.name }],
    subject: `Got your message, ${safeName}! ✅`,
    replyTo: { email: adminEmail, name: "Nasir Siddiqui" },
    htmlContent: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0d0d0d 0%,#111 100%);border:1px solid rgba(100,244,171,0.25);border-radius:12px 12px 0 0;padding:40px 30px;text-align:center;position:relative;overflow:hidden;">
          <!-- Decorative glow dot -->
          <div style="width:80px;height:80px;background:rgba(100,244,171,0.12);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(100,244,171,0.3);">
            <span style="font-size:36px;">✅</span>
          </div>
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">Message Received!</h1>
          <p style="color:#888;margin:10px 0 0;font-size:14px;line-height:1.5;">Thanks for reaching out, <span style="color:#64F4AB;font-weight:600;">${safeName}</span>!</p>
        </div>

        <!-- Body -->
        <div style="background:#141414;border-left:1px solid rgba(100,244,171,0.1);border-right:1px solid rgba(100,244,171,0.1);padding:30px;text-align:center;">
          <p style="color:#cccccc;font-size:15px;line-height:1.8;margin:0 0 24px;">
            I've received your message and will get back to you <strong style="color:#ffffff;">within 24 hours</strong>.
            In the meantime, feel free to explore my work.
          </p>

          <!-- Summary box -->
          <div style="background:#1a1a1a;border-radius:10px;border:1px solid #222;padding:16px 20px;margin:0 0 28px;text-align:left;">
            <p style="color:#555;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">Your message subject</p>
            <p style="color:#e0e0e0;font-size:14px;margin:0;font-style:italic;">"${safeSubject}"</p>
          </div>

          <!-- CTA Buttons -->
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <a href="${getAbsolutePath('/projects')}" style="display:inline-block;background:#FECD1A;color:#000;padding:12px 28px;text-decoration:none;border-radius:50px;font-weight:700;font-size:13px;">
              View Projects
            </a>
            <a href="${getAbsolutePath('/services')}" style="display:inline-block;background:transparent;color:#64F4AB;padding:12px 28px;text-decoration:none;border-radius:50px;font-weight:600;font-size:13px;border:1px solid #64F4AB;">
              My Services
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#0d0d0d;border:1px solid rgba(100,244,171,0.1);border-top:0;border-radius:0 0 12px 12px;padding:20px 30px;text-align:center;">
          <p style="color:#555;font-size:12px;margin:0 0 6px;">
            <a href="${siteConfig.url}" style="color:#64F4AB;text-decoration:none;font-weight:600;">nasirsidiki.com</a>
          </p>
          <p style="color:#444;font-size:11px;margin:0;">This is an automated confirmation. Please don't reply to this email directly.</p>
        </div>

      </div>
    </body>
    </html>
    `,
  };

  // Send both emails in parallel
  const [adminResult, autoReplyResult] = await Promise.all([
    brevo.transactionalEmails.sendTransacEmail(adminEmailParams),
    brevo.transactionalEmails.sendTransacEmail(autoReplyParams),
  ]);

  return {
    adminMessageId: adminResult.messageId,
    autoReplyMessageId: autoReplyResult.messageId,
  };
}

/**
 * Send email with error handling
 */
export async function sendEmailWithErrorHandling(
  to: string,
  subject: string,
  htmlContent: string,
  toName?: string
) {
  try {
    const brevo = getBrevoClient();
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: { email: getSenderEmail(), name: getSenderName() },
      to: [{ email: to, ...(toName && { name: toName }) }],
      subject,
      htmlContent,
    });
    return { success: true, messageId: result.messageId };
  } catch (err: unknown) {
    // Type guard for BrevoError
    const brevoError = err as { statusCode?: number; message?: string; body?: unknown };
    console.error("Brevo API error:", brevoError);
    return {
      success: false,
      error: brevoError.message || "Unknown error",
      code: brevoError.statusCode,
    };
  }
}

/**
 * Helper function to strip HTML tags for text content
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
