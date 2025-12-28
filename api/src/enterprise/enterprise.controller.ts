import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnterpriseService } from './enterprise.service';
import {
  CreateEnterpriseApplicationDto,
  ReviewEnterpriseApplicationDto,
  EnterpriseApplicationQueryDto,
  SignContractDto,
} from '../dto/enterprise-application.dto';

@Controller('enterprise')
@ApiTags('Enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  /**
   * Submit a new enterprise application
   * Public endpoint - no auth required
   */
  @Post('apply')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit enterprise application' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  async submitApplication(
    @Body() dto: CreateEnterpriseApplicationDto,
    @Request() req: any,
  ) {
    const userId = req.auth?.userId || null;
    const application = await this.enterpriseService.createApplication(dto, userId);

    return {
      success: true,
      message: 'Application submitted successfully. We will review and respond within 24-48 hours.',
      applicationId: application.id,
    };
  }

  /**
   * Get application status by email
   * Public endpoint for applicants to check their status
   */
  @Get('status')
  @ApiOperation({ summary: 'Check application status by email' })
  async checkStatus(@Query('email') email: string) {
    const applications = await this.enterpriseService.getApplicationByEmail(email);

    return applications.map((app: any) => ({
      id: app.id,
      planType: app.plan_type || app.planType,
      companyName: app.company_name || app.companyName,
      status: app.status,
      submittedAt: app.created_at || app.createdAt,
      reviewedAt: app.reviewed_at || app.reviewedAt,
      clarificationRequest: app.clarification_request || app.clarificationRequest,
    }));
  }

  /**
   * Sign the enterprise contract
   * Public endpoint - validated by application ID
   */
  @Post('contract/sign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign enterprise contract' })
  async signContract(@Body() dto: SignContractDto, @Ip() ip: string) {
    const application = await this.enterpriseService.signContract(dto, ip);

    return {
      success: true,
      message: 'Contract signed successfully. Your invoice has been sent to your email.',
      applicationId: application.id,
    };
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // TODO: Add @UseGuards(AdminGuard) before production
  // ==========================================

  /**
   * Get all enterprise applications (Admin)
   */
  @Get('admin/applications')
  @ApiOperation({ summary: '[Admin] List all enterprise applications' })
  async getApplications(@Query() query: EnterpriseApplicationQueryDto) {
    return await this.enterpriseService.getApplications(query);
  }

  /**
   * Get single application details (Admin)
   */
  @Get('admin/applications/:id')
  @ApiOperation({ summary: '[Admin] Get application details' })
  async getApplicationById(@Param('id') id: string) {
    return await this.enterpriseService.getApplicationById(id);
  }

  /**
   * Review and update application status (Admin)
   */
  @Patch('admin/applications/:id/review')
  @ApiOperation({ summary: '[Admin] Review enterprise application' })
  async reviewApplication(
    @Param('id') id: string,
    @Body() dto: ReviewEnterpriseApplicationDto,
    @Request() req: any,
  ) {
    // TODO: Get reviewer email from authenticated admin user
    const reviewerEmail = req.auth?.email || 'admin@legmint.com';

    const application = await this.enterpriseService.reviewApplication(id, dto, reviewerEmail);

    return {
      success: true,
      message: `Application ${dto.status === 'approved' ? 'approved and invoice sent' : dto.status}`,
      application,
    };
  }
}
