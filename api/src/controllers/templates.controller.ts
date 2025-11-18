import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { TemplateService, RenderService, S3Service, EntitlementsService } from '../services';
import { EmailService } from '../email/email.service';

/**
 * TemplatesController
 *
 * Endpoints:
 * - GET /v1/templates - List templates with filters
 * - GET /v1/templates/:code - Get template details
 * - GET /v1/forms/:templateCode - Get JSON Schema form
 * - POST /v1/preview/:templateCode - Free preview (HTML only, no file)
 * - POST /v1/generate/:templateCode - Paywalled generate (PDF/DOCX + S3 + email)
 * - GET /v1/user/documents - List user's documents
 * - GET /v1/user/documents/:id/download - Get download URL
 */
@ApiTags('Templates')
@Controller('v1/templates')
export class TemplatesController {
  private readonly logger = new Logger(TemplatesController.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly templateService: TemplateService,
    private readonly renderService: RenderService,
    private readonly s3Service: S3Service,
    private readonly entitlementsService: EntitlementsService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * GET /v1/templates
   * List active templates with optional filters
   */
  @Get()
  @ApiOperation({ summary: 'List all active templates' })
  @ApiResponse({ status: 200, description: 'List of templates' })
  async listTemplates(
    @Query('category') category?: string,
    @Query('jurisdiction') jurisdiction?: string,
    @Query('search') search?: string,
  ) {
    this.logger.log(
      `Listing templates - category: ${category}, jurisdiction: ${jurisdiction}, search: ${search}`,
    );

    let query = this.dataSource
      .createQueryBuilder()
      .select('*')
      .from('templates', 't')
      .where('t.is_active = true');

    if (category) {
      query = query.andWhere('t.category = :category', { category });
    }

    if (jurisdiction) {
      query = query.andWhere(':jurisdiction = ANY(t.jurisdictions)', {
        jurisdiction,
      });
    }

    if (search) {
      query = query.andWhere(
        '(t.title ILIKE :search OR t.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const templates = await query.orderBy('t.category', 'ASC').addOrderBy('t.title', 'ASC').getRawMany();

    return {
      templates,
      total: templates.length,
    };
  }

  /**
   * GET /v1/templates/:code
   * Get template details including metadata and availability
   */
  @Get(':code')
  @ApiOperation({ summary: 'Get template details' })
  @ApiResponse({ status: 200, description: 'Template details' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async getTemplate(@Param('code') code: string) {
    this.logger.log(`Getting template: ${code}`);

    const template = await this.dataSource.query(
      `SELECT * FROM templates WHERE code = $1 AND is_active = true`,
      [code],
    );

    if (!template || template.length === 0) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }

    // Get available jurisdictions with overlays
    const overlays = await this.dataSource.query(
      `SELECT jurisdiction, language FROM template_overlays
       WHERE template_code = $1 AND is_active = true`,
      [code],
    );

    return {
      ...template[0],
      availableOverlays: overlays,
    };
  }

  /**
   * GET /v1/forms/:templateCode
   * Get JSON Schema form for template
   */
  @Get('forms/:templateCode')
  @ApiOperation({ summary: 'Get template form schema' })
  @ApiResponse({ status: 200, description: 'Form schema' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  async getForm(@Param('templateCode') templateCode: string) {
    this.logger.log(`Getting form schema for: ${templateCode}`);

    const form = await this.dataSource.query(
      `SELECT schema, ui_schema, defaults FROM form_schemas
       WHERE template_code = $1 AND is_active = true
       ORDER BY version DESC LIMIT 1`,
      [templateCode],
    );

    if (!form || form.length === 0) {
      throw new HttpException('Form schema not found', HttpStatus.NOT_FOUND);
    }

    return {
      schema: form[0].schema,
      uiSchema: form[0].ui_schema,
      defaults: form[0].defaults,
    };
  }

  /**
   * POST /v1/preview/:templateCode
   * Free preview - returns HTML preview only (no file, no paywall)
   */
  @Post('preview/:templateCode')
  @ApiOperation({ summary: 'Preview template (free)' })
  @ApiResponse({ status: 200, description: 'HTML preview' })
  async previewTemplate(
    @Param('templateCode') templateCode: string,
    @Body() body: { answers: any; jurisdiction: string; language?: string },
  ) {
    this.logger.log(`Preview request for: ${templateCode}, jurisdiction: ${body.jurisdiction}`);

    // Get template
    const template = await this.dataSource.query(
      `SELECT * FROM templates WHERE code = $1 AND is_active = true`,
      [templateCode],
    );

    if (!template || template.length === 0) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }

    // Get overlay if exists
    let overlay = null;
    const overlayResult = await this.dataSource.query(
      `SELECT overlay FROM template_overlays
       WHERE template_code = $1 AND jurisdiction = $2 AND language = $3 AND is_active = true
       LIMIT 1`,
      [templateCode, body.jurisdiction, body.language || 'en'],
    );

    if (overlayResult && overlayResult.length > 0) {
      overlay = overlayResult[0].overlay;
    }

    // Merge data
    const mergedData = {
      ...body.answers,
      title: template[0].title,
      jurisdiction: body.jurisdiction,
      overlay: overlay,
    };

    // Get HTML template
    const htmlTemplate = this.renderService.getDefaultHtmlTemplate(
      templateCode,
      overlay,
    );

    // Compile to HTML
    const Handlebars = require('handlebars');
    const compiledTemplate = Handlebars.compile(htmlTemplate);
    const html = compiledTemplate(mergedData);

    return {
      html,
      previewOnly: true,
    };
  }

  /**
   * POST /v1/generate/:templateCode
   * Paywalled generate - creates PDF/DOCX, uploads to S3, sends email
   * Requires active subscription OR one-time entitlement
   */
  @Post('generate/:templateCode')
  @ApiOperation({ summary: 'Generate document (paywalled)' })
  @ApiResponse({ status: 200, description: 'Document generated' })
  @ApiResponse({ status: 402, description: 'Payment required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateDocument(
    @Param('templateCode') templateCode: string,
    @Body()
    body: {
      answers: any;
      jurisdiction: string;
      language?: string;
      fileType?: 'pdf' | 'docx';
    },
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id']; // Support both Clerk and header-based auth

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    this.logger.log(
      `Generate request for: ${templateCode}, user: ${userId}, jurisdiction: ${body.jurisdiction}`,
    );

    // 1. Check entitlement (paywall)
    const access = await this.entitlementsService.checkAccess(
      userId,
      templateCode,
    );

    if (!access.hasAccess) {
      this.logger.warn(`User ${userId} denied access to ${templateCode} - paywall required`);
      throw new HttpException(
        {
          error: 'Payment required',
          requirePayment: true,
          templateCode,
          message: 'Subscription or one-time purchase required to generate this document',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // 2. Get template
    const template = await this.dataSource.query(
      `SELECT * FROM templates WHERE code = $1 AND is_active = true`,
      [templateCode],
    );

    if (!template || template.length === 0) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }

    // 3. Get overlay
    let overlay = null;
    const overlayResult = await this.dataSource.query(
      `SELECT overlay FROM template_overlays
       WHERE template_code = $1 AND jurisdiction = $2 AND language = $3 AND is_active = true
       LIMIT 1`,
      [templateCode, body.jurisdiction, body.language || 'en'],
    );

    if (overlayResult && overlayResult.length > 0) {
      overlay = overlayResult[0].overlay;
    }

    // 4. Merge data
    const mergedData = {
      ...body.answers,
      title: template[0].title,
      jurisdiction: body.jurisdiction,
      overlay: overlay,
    };

    // 5. Render document
    const fileType = body.fileType || (template[0].render_engine === 'docx' ? 'docx' : 'pdf');
    let documentBuffer: Buffer;

    if (fileType === 'pdf') {
      const htmlTemplate = this.renderService.getDefaultHtmlTemplate(
        templateCode,
        overlay,
      );
      documentBuffer = await this.renderService.renderToPdf(
        htmlTemplate,
        mergedData,
      );
    } else {
      documentBuffer = await this.renderService.renderToDocx(
        { title: template[0].title },
        mergedData,
      );
    }

    // 6. Upload to S3
    const s3Key = this.s3Service.generateUserDocKey(
      userId,
      templateCode,
      fileType,
    );
    const contentType =
      fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    await this.s3Service.uploadDocument(s3Key, documentBuffer, contentType);

    const signedUrl = await this.s3Service.getSignedUrl(s3Key, 86400); // 24h expiry

    // 7. Save to documents table
    const documentId = await this.dataSource.query(
      `INSERT INTO documents (user_id, template_code, jurisdiction, language, answers, s3_key, file_type, file_size_bytes, generated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       RETURNING id`,
      [
        userId,
        templateCode,
        body.jurisdiction,
        body.language || 'en',
        JSON.stringify(body.answers),
        s3Key,
        fileType,
        documentBuffer.length,
      ],
    );

    // 8. Consume entitlement if one-time purchase
    if (access.method === 'one-time' && access.entitlementId) {
      await this.entitlementsService.consumeEntitlement(access.entitlementId);
      this.logger.log(`Consumed entitlement ${access.entitlementId} for user ${userId}`);
    }

    // 9. Send email confirmation (non-blocking)
    this.sendDocumentReadyEmail(userId, template[0].title).catch((err) =>
      this.logger.error(`Email failed: ${err.message}`),
    );

    // 10. Return response
    return {
      success: true,
      documentId: documentId[0].id,
      downloadUrl: signedUrl,
      fileType,
      expiresIn: 86400,
    };
  }

  /**
   * GET /v1/user/documents
   * List user's generated documents
   */
  @Get('user/documents')
  @ApiOperation({ summary: 'List user documents' })
  @ApiResponse({ status: 200, description: 'List of documents' })
  async getUserDocuments(@Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'];

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const documents = await this.dataSource.query(
      `SELECT
        d.id,
        d.template_code,
        t.title as template_title,
        t.category,
        d.jurisdiction,
        d.file_type,
        d.generated_at,
        d.download_count
       FROM documents d
       LEFT JOIN templates t ON d.template_code = t.code
       WHERE d.user_id = $1
       ORDER BY d.generated_at DESC`,
      [userId],
    );

    return { documents };
  }

  /**
   * GET /v1/user/documents/:id/download
   * Get signed URL for document download
   */
  @Get('user/documents/:id/download')
  @ApiOperation({ summary: 'Get document download URL' })
  @ApiResponse({ status: 200, description: 'Download URL' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocumentDownload(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'];

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const document = await this.dataSource.query(
      `SELECT s3_key, file_type FROM documents
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (!document || document.length === 0) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    // Increment download count
    await this.dataSource.query(
      `UPDATE documents
       SET download_count = download_count + 1, last_downloaded_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id],
    );

    const signedUrl = await this.s3Service.getSignedUrl(
      document[0].s3_key,
      1800,
    ); // 30min expiry

    return {
      downloadUrl: signedUrl,
      fileType: document[0].file_type,
      expiresIn: 1800,
    };
  }

  /**
   * Helper: Send document ready email
   */
  private async sendDocumentReadyEmail(userId: string, templateTitle: string) {
    try {
      const user = await this.dataSource.query(
        `SELECT email FROM users WHERE id = $1`,
        [userId],
      );
      if (user && user.length > 0 && user[0].email) {
        const frontendUrl = process.env.FRONTEND_URL || 'https://legmint.com';
        await this.emailService['sendEmail']({
          to: user[0].email,
          subject: `Your ${templateTitle} is Ready`,
          html: `
            <h2>Document Ready!</h2>
            <p>Your <strong>${templateTitle}</strong> has been generated and is ready to download.</p>
            <a href="${frontendUrl}/dashboard/documents" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;margin:16px 0;">View in Dashboard</a>
            <p>Your document is available in your dashboard for download.</p>
            <p><strong>Legmint</strong><br>Legal documents, minted for startups</p>
          `,
        });
      }
    } catch (error) {
      // Log but don't fail
      this.logger.error(`Email send failed: ${error.message}`);
    }
  }
}
