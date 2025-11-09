import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { TemplateService } from './template.service';
import { S3Service } from './s3.service';
import { AuditLogService } from './audit-log.service';
import { EmailService } from '../email/email.service';
import { AuditLogStatus } from '../entities/audit-log.entity';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { v4 as uuidv4 } from 'uuid';

export interface GenerationResult {
  auditId?: string;
  outputs: Record<string, string>;
  expiresAt: Date;
  templateCode: string;
  templateVersion: string;
  jurisdiction: string;
}

@Injectable()
export class GenerationService {
  private readonly logger = new Logger(GenerationService.name);
  private readonly ajv: Ajv;

  constructor(
    private templateService: TemplateService,
    private s3Service: S3Service,
    private auditLogService: AuditLogService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    // Initialize AJV for JSON Schema validation
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);

    // Register Handlebars helpers
    this.registerHandlebarsHelpers();
  }

  /**
   * Generate HTML preview of document
   */
  async generatePreview(
    userId: string,
    templateCode: string,
    jurisdiction: string,
    answers: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ previewUrl: string; expiresAt: Date }> {
    const startTime = Date.now();

    try {
      // Get template with overlay
      const template = await this.templateService.getTemplateWithOverlay(
        templateCode,
        jurisdiction,
      );

      // Validate answers against schema
      this.validateAnswers(answers, template.variablesSchema);

      // Render HTML
      const html = this.renderHtml(template, answers);

      // Upload to S3
      const key = `previews/${userId}/${uuidv4()}.html`;
      const previewUrl = await this.s3Service.uploadAndGetSignedUrl(
        key,
        Buffer.from(html),
        'text/html',
        3600, // 1 hour expiration
        true, // isPreview
      );

      const expiresAt = new Date(Date.now() + 3600 * 1000);

      // Log to audit
      const renderTimeMs = Date.now() - startTime;
      await this.auditLogService.create({
        userId,
        templateCode,
        templateVersion: template.version,
        jurisdiction,
        answers,
        outputFormats: ['html'],
        status: AuditLogStatus.SUCCESS,
        renderTimeMs,
        outputUrls: { html: previewUrl },
        ipAddress,
        userAgent,
      });

      this.logger.log(
        `Generated preview for ${templateCode} in ${renderTimeMs}ms`,
      );

      return { previewUrl, expiresAt };
    } catch (error) {
      this.logger.error(`Preview generation failed: ${error.message}`);

      // Log error to audit
      await this.auditLogService.create({
        userId,
        templateCode,
        templateVersion: 'unknown',
        jurisdiction,
        answers,
        outputFormats: ['html'],
        status: AuditLogStatus.FAILED,
        errorMessage: error.message,
        ipAddress,
        userAgent,
      });

      throw error;
    }
  }

  /**
   * Generate final documents (PDF/DOCX)
   */
  async generateDocuments(
    userId: string,
    templateCode: string,
    jurisdiction: string,
    answers: Record<string, any>,
    formats: string[],
    ipAddress?: string,
    userAgent?: string,
  ): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      // Get template with overlay
      const template = await this.templateService.getTemplateWithOverlay(
        templateCode,
        jurisdiction,
      );

      // Validate answers
      this.validateAnswers(answers, template.variablesSchema);

      // Render HTML base
      const html = this.renderHtml(template, answers);

      // Generate requested formats
      const outputs: Record<string, string> = {};

      for (const format of formats) {
        if (format === 'pdf') {
          outputs.pdf = await this.generatePdf(userId, html);
        } else if (format === 'docx') {
          outputs.docx = await this.generateDocx(userId, template, answers);
        }
      }

      const expiresAt = new Date(Date.now() + 86400 * 1000); // 24 hours

      // Increment template usage count
      await this.templateService.incrementUsageCount(templateCode);

      // Log to audit
      const renderTimeMs = Date.now() - startTime;
      const auditLog = await this.auditLogService.create({
        userId,
        templateCode,
        templateVersion: template.version,
        jurisdiction,
        answers,
        outputFormats: formats,
        status: AuditLogStatus.SUCCESS,
        renderTimeMs,
        outputUrls: outputs,
        ipAddress,
        userAgent,
      });

      this.logger.log(
        `Generated documents for ${templateCode} in ${renderTimeMs}ms`,
      );

      return {
        auditId: auditLog.id,
        outputs,
        expiresAt,
        templateCode,
        templateVersion: template.version,
        jurisdiction,
      };
    } catch (error) {
      this.logger.error(`Document generation failed: ${error.message}`);

      // Log error to audit
      await this.auditLogService.create({
        userId,
        templateCode,
        templateVersion: 'unknown',
        jurisdiction,
        answers,
        outputFormats: formats,
        status: AuditLogStatus.FAILED,
        errorMessage: error.message,
        ipAddress,
        userAgent,
      });

      throw error;
    }
  }

  /**
   * Validate answers against JSON Schema
   */
  private validateAnswers(
    answers: Record<string, any>,
    schema: Record<string, any>,
  ): void {
    const validate = this.ajv.compile(schema);
    const valid = validate(answers);

    if (!valid) {
      const errors = validate.errors
        ?.map((e) => `${e.instancePath} ${e.message}`)
        .join(', ');
      throw new BadRequestException(
        `Validation failed: ${errors || 'Invalid input'}`,
      );
    }
  }

  /**
   * Render template to HTML
   */
  private renderHtml(template: any, answers: Record<string, any>): string {
    // Convert clauses to HTML
    let html = '<html><head><style>body { font-family: Arial; }</style></head><body>';

    for (const clause of template.clauses) {
      if (clause.text) {
        const compiled = Handlebars.compile(clause.text);
        html += `<p>${compiled(answers)}</p>`;
      }
    }

    html += '</body></html>';

    return html;
  }

  /**
   * Generate PDF from HTML
   */
  private async generatePdf(userId: string, html: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: this.configService.get('PUPPETEER_EXECUTABLE_PATH'),
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      const key = `documents/${userId}/${uuidv4()}.pdf`;
      const url = await this.s3Service.uploadAndGetSignedUrl(
        key,
        pdfBuffer,
        'application/pdf',
        86400,
      );

      return url;
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate DOCX from template
   */
  private async generateDocx(
    userId: string,
    template: any,
    answers: Record<string, any>,
  ): Promise<string> {
    const paragraphs: Paragraph[] = [];

    for (const clause of template.clauses) {
      if (clause.text) {
        const compiled = Handlebars.compile(clause.text);
        const text = compiled(answers);
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(text)],
          }),
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          children: paragraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    const key = `documents/${userId}/${uuidv4()}.docx`;
    const url = await this.s3Service.uploadAndGetSignedUrl(
      key,
      buffer,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      86400,
    );

    return url;
  }

  /**
   * Register Handlebars helpers
   */
  private registerHandlebarsHelpers(): void {
    Handlebars.registerHelper('uppercase', (str: string) => str?.toUpperCase());
    Handlebars.registerHelper('lowercase', (str: string) => str?.toLowerCase());
    Handlebars.registerHelper('formatDate', (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });
    Handlebars.registerHelper('formatCurrency', (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    });
  }

  /**
   * Send email notification when documents are ready
   */
  async notifyDocumentReady(
    userEmail: string,
    userName: string | undefined,
    templateCode: string,
    dashboardUrl: string,
  ): Promise<void> {
    try {
      const tpl = this.emailService.documentReadyTemplate({
        firstName: userName,
        docName: templateCode,
        dashboardUrl,
      });

      await this.emailService.sendEmail({
        to: userEmail,
        subject: tpl.subject,
        html: tpl.html,
      });

      this.logger.log(`Document ready email sent to ${userEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send document ready email: ${error.message}`);
      // Don't throw - email failure shouldn't break document generation
    }
  }
}
