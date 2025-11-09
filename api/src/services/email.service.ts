import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

/**
 * EmailService
 *
 * Sends transactional emails via SendGrid for:
 * - Lawyer application confirmations
 * - Lawyer verification notifications
 * - Referral status updates
 * - Document ready notifications
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly supportEmail: string;
  private readonly frontendUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SendGrid API key not configured - emails will not be sent');
    }

    this.fromEmail = this.configService.get('EMAIL_FROM', 'hello@legmint.com');
    this.supportEmail = this.configService.get('EMAIL_SUPPORT', 'support@legmint.com');
    this.frontendUrl = this.configService.get('FRONTEND_URL', 'https://legmint.com');
  }

  /**
   * Send email (base method)
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    if (!this.configService.get('SENDGRID_API_KEY')) {
      this.logger.log(`[DEV MODE] Would send email to ${to}: ${subject}`);
      return;
    }

    try {
      await sgMail.send({
        to,
        from: this.fromEmail,
        subject,
        html,
        text: text || subject,
      });

      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lawyer application received
   */
  async sendLawyerApplicationReceived(email: string, fullName: string): Promise<void> {
    const subject = 'Your Legmint Lawyer Application is Under Review';
    const html = `
      <h2>Thank you for applying, ${fullName}!</h2>
      <p>We've received your application to join the Legmint lawyer network.</p>
      <p>Our team will review your credentials and get back to you within 2-3 business days.</p>
      <h3>What happens next?</h3>
      <ol>
        <li>We verify your bar license and credentials</li>
        <li>You'll receive an email with approval status</li>
        <li>Connect your Stripe account to start receiving referrals</li>
      </ol>
      <p>Questions? Reply to this email or contact <a href="mailto:${this.supportEmail}">${this.supportEmail}</a></p>
      <p><strong>Legmint</strong><br>Legal documents, minted for startups</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Lawyer verified (approved)
   */
  async sendLawyerVerified(email: string, fullName: string): Promise<void> {
    const subject = 'Approved! Complete Your Legmint Lawyer Setup';
    const html = `
      <h2>Congratulations, ${fullName}!</h2>
      <p>Your application has been approved. You're one step away from receiving client referrals.</p>
      <h3>Next Step: Connect Stripe</h3>
      <p>To receive payments, you need to connect your Stripe account:</p>
      <a href="${this.frontendUrl}/lawyers/dashboard" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;margin:16px 0;">Go to Dashboard</a>
      <p>Once connected, you'll start receiving document review requests from verified users.</p>
      <h3>Fee Structure</h3>
      <ul>
        <li><strong>€25 fixed fee</strong> per referral (paid by platform)</li>
        <li><strong>10% fee</strong> on additional work billed through the platform</li>
        <li>You set your own base rates</li>
      </ul>
      <p>Welcome to the Legmint lawyer network!</p>
      <p><strong>Legmint</strong><br>Legal documents, minted for startups</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Lawyer application rejected
   */
  async sendLawyerRejected(email: string, fullName: string, reason?: string): Promise<void> {
    const subject = 'Update on Your Legmint Lawyer Application';
    const html = `
      <h2>Hello ${fullName},</h2>
      <p>Thank you for your interest in joining the Legmint lawyer network.</p>
      <p>After careful review, we're unable to approve your application at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you believe this is an error or have additional credentials to share, please contact us at <a href="mailto:${this.supportEmail}">${this.supportEmail}</a></p>
      <p>Best regards,<br><strong>Legmint Team</strong></p>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * User: Referral paid, assigned to lawyer
   */
  async sendReferralPaidUser(
    email: string,
    referralId: string,
    lawyerName: string,
  ): Promise<void> {
    const subject = 'Your Document is Being Reviewed';
    const html = `
      <h2>Payment Successful!</h2>
      <p>Your document has been assigned to <strong>${lawyerName}</strong> for professional review.</p>
      <h3>What to expect:</h3>
      <ul>
        <li>Lawyer will review your document within 3-5 business days</li>
        <li>You'll receive an email when the reviewed document is ready</li>
        <li>Download your reviewed document from your dashboard</li>
      </ul>
      <a href="${this.frontendUrl}/dashboard/referrals/${referralId}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;margin:16px 0;">View Status</a>
      <p>Questions? Contact <a href="mailto:${this.supportEmail}">${this.supportEmail}</a></p>
      <p><strong>Legmint</strong><br>Legal documents, minted for startups</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Lawyer: New referral assigned
   */
  async sendReferralAssignedLawyer(
    email: string,
    referralId: string,
    templateCode: string,
  ): Promise<void> {
    const subject = 'New Document Review Request';
    const html = `
      <h2>New Client Referral</h2>
      <p>You have a new document review request:</p>
      <ul>
        <li><strong>Template:</strong> ${templateCode}</li>
        <li><strong>Referral ID:</strong> ${referralId}</li>
      </ul>
      <a href="${this.frontendUrl}/lawyers/dashboard/referrals/${referralId}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;margin:16px 0;">Review Document</a>
      <p>Please review and deliver within 3-5 business days.</p>
      <p><strong>Legmint</strong><br>Legal documents, minted for startups</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * User: Review completed, document ready
   */
  async sendReviewCompleted(
    email: string,
    referralId: string,
    lawyerName: string,
  ): Promise<void> {
    const subject = 'Your Reviewed Document is Ready!';
    const html = `
      <h2>Document Review Complete</h2>
      <p><strong>${lawyerName}</strong> has completed the review of your document.</p>
      <a href="${this.frontendUrl}/dashboard/referrals/${referralId}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;margin:16px 0;">Download Document</a>
      <p>Your reviewed document is ready to download from your dashboard.</p>
      <p>Questions about the review? You can reach out to your lawyer through the platform.</p>
      <p><strong>Legmint</strong><br>Legal documents, minted for startups</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Admin: New application pending review
   */
  async sendAdminNewApplication(
    applicationId: string,
    lawyerName: string,
    lawyerEmail: string,
  ): Promise<void> {
    const adminEmail = this.supportEmail;
    const subject = `New Lawyer Application: ${lawyerName}`;
    const html = `
      <h2>New Lawyer Application</h2>
      <ul>
        <li><strong>Name:</strong> ${lawyerName}</li>
        <li><strong>Email:</strong> ${lawyerEmail}</li>
        <li><strong>Application ID:</strong> ${applicationId}</li>
      </ul>
      <a href="${this.frontendUrl}/admin/lawyers/applications/${applicationId}">Review Application</a>
    `;

    await this.sendEmail(adminEmail, subject, html);
  }
}
