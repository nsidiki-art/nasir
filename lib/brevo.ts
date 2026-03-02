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
    subject: `Portfolio Contact: ${safeSubject}`,
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3a69ff;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
          <td style="padding: 8px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #3a69ff;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
          <td style="padding: 8px 0;">${safeSubject}</td>
        </tr>
      </table>
      <div style="margin-top: 20px;">
        <h3 style="color: #555;">Message:</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${safeMessage}
        </div>
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #999;">
        Sent from portfolio contact form at ${new Date().toISOString()}
      </p>
    </div>
  `,
  };

  // Auto-reply to sender
  const autoReplyParams = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: data.email, name: data.name }],
    subject: "Thanks for reaching out!",
    replyTo: { email: adminEmail, name: "Nasir Siddiqui" },
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
      <div style="background: linear-gradient(135deg, #3a69ff 0%, #1a47ff 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Thank You, ${safeName}! 👋</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thanks for reaching out! I've received your message and I'll get back to you within 24 hours.
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 20px;">
          In the meantime, feel free to check out my <a href="${getAbsolutePath('/projects')}" style="color: #3a69ff;">projects</a>
          or <a href="${getAbsolutePath('/services')}" style="color: #3a69ff;">services</a>.
        </p>
        <div style="margin-top: 30px;">
          <a href="${siteConfig.url}" style="display: inline-block; background: #3a69ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Visit Portfolio
          </a>
        </div>
      </div>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
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
