import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

type Address = string | { email: string; name?: string };

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly from: Address;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      this.logger.error('SENDGRID_API_KEY is missing');
    } else {
      sgMail.setApiKey(apiKey);
    }
    this.from = process.env.EMAIL_FROM || 'no-reply@localhost';
  }

  /**
   * Send a basic HTML email.
   */
  async sendEmail(opts: {
    to: Address;
    subject: string;
    html: string;
    replyTo?: Address;
  }) {
    const msg = {
      to: opts.to,
      from: this.from,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    };

    try {
      await sgMail.send(msg as any);
      this.logger.log(`Email sent → ${typeof opts.to === 'string' ? opts.to : opts.to.email}`);
      return { ok: true };
    } catch (err: any) {
      const body = err?.response?.body;
      this.logger.error(`SendGrid error`, body ?? err);
      return { ok: false, error: body ?? String(err) };
    }
  }

  /**
   * Lightweight template helpers for common Legmint events.
   */
  documentReadyTemplate(params: { firstName?: string; docName: string; dashboardUrl: string }) {
    const name = params.firstName ? ` ${params.firstName}` : '';
    return {
      subject: `Your ${params.docName} is ready`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
          <p>Hi${name},</p>
          <p>Your document <strong>${params.docName}</strong> has been generated successfully.</p>
          <p><a href="${params.dashboardUrl}">Open your Legmint dashboard</a> to download it securely.</p>
          <p style="color:#666">— The Legmint Team</p>
        </div>
      `,
    };
  }

  referralAssignedTemplate(params: { firstName?: string; lawyerName: string; caseUrl: string }) {
    const name = params.firstName ? ` ${params.firstName}` : '';
    return {
      subject: `Your lawyer ${params.lawyerName} has been assigned`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
          <p>Hi${name},</p>
          <p>We've assigned <strong>${params.lawyerName}</strong> to your request.</p>
          <p><a href="${params.caseUrl}">View your case</a> to share any notes or uploads.</p>
          <p style="color:#666">— Legmint</p>
        </div>
      `,
    };
  }

  welcomeEmailTemplate(params: { firstName?: string; dashboardUrl: string }) {
    const name = params.firstName || 'there';
    return {
      subject: 'Welcome to Legmint',
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
          <h2 style="color:#059669">Welcome to Legmint!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for joining Legmint — your startup's legal copilot.</p>
          <p>You can now browse our library of legal templates for startups across multiple jurisdictions.</p>
          <p><a href="${params.dashboardUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:16px 0">Go to Dashboard</a></p>
          <p><strong>Ready to unlock all features?</strong><br>Upgrade to Pro for unlimited document generation, downloads, and access to our verified lawyer network.</p>
          <p style="color:#666;font-size:14px;margin-top:24px">Questions? Reply to this email or reach us at support@legmint.com</p>
          <p style="color:#666">— The Legmint Team</p>
        </div>
      `,
    };
  }

  lawyerApplicationConfirmationTemplate(params: { fullName: string; applicationId: string }) {
    return {
      subject: 'Lawyer Partnership Application Received',
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
          <h2 style="color:#4f46e5">Application Received</h2>
          <p>Dear ${params.fullName},</p>
          <p>Thank you for applying to join the Legmint lawyer network.</p>
          <p>We've received your application (ID: <strong>${params.applicationId}</strong>) and will review your credentials within 2-3 business days.</p>

          <h3 style="color:#1f2937;font-size:16px">What happens next?</h3>
          <ol style="color:#4b5563">
            <li>Our team reviews your license, insurance, and credentials</li>
            <li>You'll receive an approval email with next steps</li>
            <li>Connect your Stripe account to start receiving referrals</li>
            <li>Get matched with startup founders needing legal expertise</li>
          </ol>

          <h3 style="color:#1f2937;font-size:16px">Referral Fee Structure</h3>
          <ul style="color:#4b5563">
            <li><strong>€30 fixed fee</strong> per initial document review</li>
            <li><strong>15% commission</strong> on additional work billed through the platform</li>
            <li>Instant payouts via Stripe Connect</li>
          </ul>

          <p style="color:#666;font-size:14px;margin-top:24px">Questions? Email us at support@legmint.com</p>
          <p style="color:#666">— The Legmint Team</p>
        </div>
      `,
    };
  }

  subscriptionConfirmationTemplate(params: { firstName?: string; plan: string; billingCycle: string; dashboardUrl: string }) {
    const name = params.firstName || 'there';
    const price = params.billingCycle === 'yearly' ? '€1,009/year (€84/mo)' : '€99/month';
    return {
      subject: `Welcome to Legmint ${params.plan}!`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
          <h2 style="color:#059669">You're now on Legmint Pro! 🎉</h2>
          <p>Hi ${name},</p>
          <p>Your subscription to <strong>Legmint Pro</strong> (${price}, billed ${params.billingCycle}) is now active.</p>

          <h3 style="color:#1f2937;font-size:16px">What you get:</h3>
          <ul style="color:#4b5563">
            <li>Full access to all legal templates across UK, DE, CZ, US-DE, US-CA</li>
            <li>Unlimited document generation and downloads (PDF/DOCX)</li>
            <li>Multilingual templates (EN, DE, CS)</li>
            <li>Auto-updates when laws change</li>
            <li>Access to verified lawyer referral network</li>
            <li>Early access to new template categories</li>
          </ul>

          <p><a href="${params.dashboardUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:16px 0">Start Creating Documents</a></p>

          <p style="color:#666;font-size:14px;margin-top:24px">Manage your subscription anytime from your billing portal. Questions? Email support@legmint.com</p>
          <p style="color:#666">— The Legmint Team</p>
        </div>
      `,
    };
  }
}
