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
}
