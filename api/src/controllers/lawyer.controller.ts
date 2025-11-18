import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { LawyerService } from '../services/lawyer.service';
import { S3Service } from '../services/s3.service';
import { EmailService } from '../email/email.service';
import {
  CreateLawyerApplicationDto,
  UpdateLawyerProfileDto,
  VerifyLawyerDto,
  ConnectStripeDto,
  LawyerDashboardQueryDto,
} from '../dto/lawyer.dto';

@ApiTags('Lawyers')
@Controller('v1/lawyers')
export class LawyerController {
  constructor(
    private readonly lawyerService: LawyerService,
    private readonly s3Service: S3Service,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Create a new lawyer application
   */
  @Post('apply')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit lawyer partnership application' })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid application data or email already exists',
  })
  async applyAsLawyer(@Body() dto: CreateLawyerApplicationDto) {
    const result = await this.lawyerService.createApplication(dto);

    // Send confirmation email
    const emailTemplate = this.emailService.lawyerApplicationConfirmationTemplate({
      fullName: dto.fullName,
      applicationId: result.applicationId,
    });

    await this.emailService.sendEmail({
      to: dto.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return {
      message: 'Application received. We will review your submission shortly.',
      partnerId: result.partnerId,
      applicationId: result.applicationId,
      status: result.status,
    };
  }

  /**
   * Upload supporting documents (license, insurance, ID)
   */
  @Post('applications/:applicationId/documents')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload supporting documents for application' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        documentType: {
          type: 'string',
          enum: ['license', 'insurance', 'identification'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document uploaded successfully',
  })
  async uploadDocument(
    @Param('applicationId') applicationId: string,
    @Body('documentType') documentType: 'license' | 'insurance' | 'identification',
    @UploadedFile() file: any,
  ) {
    // Upload file to S3
    const fileKey = `lawyer-applications/${applicationId}/${documentType}-${Date.now()}.${file.originalname.split('.').pop()}`;
    const fileUrl = await this.s3Service.uploadDocument(fileKey, file.buffer, file.mimetype);

    // Update application with document URL
    await this.lawyerService.updateApplicationDocuments(
      applicationId,
      documentType,
      fileUrl,
    );

    return {
      message: 'Document uploaded successfully',
      documentType,
      fileUrl,
    };
  }

  /**
   * Get application details
   */
  @Get('applications/:applicationId')
  @ApiOperation({ summary: 'Get application details' })
  @ApiResponse({
    status: 200,
    description: 'Application details retrieved',
  })
  async getApplication(@Param('applicationId') applicationId: string) {
    return await this.lawyerService.getApplication(applicationId);
  }

  /**
   * Get all pending applications (admin only)
   * TODO: Add @UseGuards(AdminGuard) decorator before deployment
   * AdminGuard should verify user has admin role from Clerk or JWT
   */
  @Get('applications/pending/all')
  // @UseGuards(AdminGuard) // UNCOMMENT THIS AFTER IMPLEMENTING AdminGuard
  @ApiOperation({ summary: 'Get all pending applications (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of pending applications',
  })
  async getPendingApplications() {
    return await this.lawyerService.getPendingApplications();
  }

  /**
   * Verify application (approve/reject) - Admin only
   * TODO: Add @UseGuards(AdminGuard) decorator before deployment
   * TODO: Get admin user ID from JWT token via @CurrentUser() decorator
   */
  @Post('applications/verify')
  // @UseGuards(AdminGuard) // UNCOMMENT THIS AFTER IMPLEMENTING AdminGuard
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve or reject lawyer application (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Application processed',
  })
  async verifyApplication(@Body() dto: VerifyLawyerDto) {
    // TODO: Replace with actual admin user ID from JWT: @CurrentUser() user: User
    const adminUserId = 'admin-temp-id';

    const result = await this.lawyerService.verifyApplication(dto, adminUserId);

    return {
      message: `Application ${dto.decision}`,
      applicationId: result.id,
      status: result.status,
    };
  }

  /**
   * Create Stripe Connect onboarding link
   */
  @Post('connect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Stripe Connect onboarding link' })
  @ApiResponse({
    status: 200,
    description: 'Stripe Connect link created',
  })
  async connectStripe(@Body() dto: ConnectStripeDto) {
    const result = await this.lawyerService.createStripeConnectLink(
      dto.partnerId,
      dto.returnUrl,
      dto.refreshUrl,
    );

    return {
      url: result.url,
      stripeAccountId: result.stripeAccountId,
    };
  }

  /**
   * Verify Stripe Connect account status
   */
  @Get(':partnerId/stripe-status')
  @ApiOperation({ summary: 'Check Stripe Connect account status' })
  @ApiResponse({
    status: 200,
    description: 'Stripe account status',
  })
  async getStripeStatus(@Param('partnerId') partnerId: string) {
    return await this.lawyerService.verifyStripeAccount(partnerId);
  }

  /**
   * Get lawyer profile
   */
  @Get(':partnerId/profile')
  @ApiOperation({ summary: 'Get lawyer profile' })
  @ApiResponse({
    status: 200,
    description: 'Lawyer profile details',
  })
  async getLawyerProfile(@Param('partnerId') partnerId: string) {
    return await this.lawyerService.getLawyerProfile(partnerId);
  }

  /**
   * Update lawyer profile
   * TODO: Add @UseGuards(JwtAuthGuard) decorator before deployment
   * TODO: Verify that current user ID matches partnerId (prevent updating other lawyers' profiles)
   */
  @Patch(':partnerId/profile')
  // @UseGuards(JwtAuthGuard) // UNCOMMENT THIS AFTER IMPLEMENTING JwtAuthGuard
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lawyer profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  async updateLawyerProfile(
    @Param('partnerId') partnerId: string,
    @Body() dto: UpdateLawyerProfileDto,
    // @CurrentUser() user: User, // UNCOMMENT AND USE TO VERIFY OWNERSHIP
  ) {
    // TODO: Add check: if (user.partnerId !== partnerId) throw new ForbiddenException();
    const result = await this.lawyerService.updateLawyerProfile(partnerId, dto);

    return {
      message: 'Profile updated successfully',
      partner: result,
    };
  }

  /**
   * Get lawyer dashboard - referrals list
   */
  @Get(':partnerId/referrals')
  @ApiOperation({ summary: 'Get lawyer referrals (for dashboard)' })
  @ApiResponse({
    status: 200,
    description: 'List of referrals',
  })
  async getLawyerReferrals(
    @Param('partnerId') partnerId: string,
    @Query() query: LawyerDashboardQueryDto,
  ) {
    return await this.lawyerService.getLawyerReferrals(
      partnerId,
      query.status,
      query.limit,
      query.offset,
    );
  }

  /**
   * Get lawyer payout summary
   */
  @Get(':partnerId/payouts')
  @ApiOperation({ summary: 'Get lawyer payout summary and history' })
  @ApiResponse({
    status: 200,
    description: 'Payout summary and Stripe balance',
  })
  async getLawyerPayouts(@Param('partnerId') partnerId: string) {
    return await this.lawyerService.getLawyerPayoutSummary(partnerId);
  }
}
