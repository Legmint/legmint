import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditLogService } from '../services/audit-log.service';

@ApiTags('Users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'User details',
  })
  async getCurrentUser() {
    // TODO: Get userId from JWT token once auth is implemented
    // For now, return mock data
    return {
      user_id: 'temp-user-id',
      email: 'user@example.com',
      name: 'Test User',
      plan: 'pro',
      jurisdictions_allowed: ['GLOBAL-EN', 'UK', 'US-DE'],
      generation_count: 42,
      created_at: '2025-01-01T00:00:00Z',
    };
  }

  @Get('me/usage')
  @ApiOperation({ summary: 'Get usage statistics' })
  @ApiResponse({
    status: 200,
    description: 'Usage stats',
  })
  async getUsageStats() {
    // TODO: Get userId from JWT token
    const userId = 'temp-user-id'; // Placeholder

    try {
      const auditLogs = await this.auditLogService.findByUserId(userId, 100);

      // Aggregate statistics
      const templateUsage = auditLogs.reduce((acc, log) => {
        if (!acc[log.templateCode]) {
          acc[log.templateCode] = 0;
        }
        acc[log.templateCode]++;
        return acc;
      }, {} as Record<string, number>);

      const templatesUsed = Object.entries(templateUsage).map(
        ([template_code, count]) => ({
          template_code,
          count,
        }),
      );

      return {
        generation_count: auditLogs.length,
        last_generation: auditLogs[0]?.createdAt || null,
        templates_used: templatesUsed,
      };
    } catch (error) {
      return {
        generation_count: 0,
        last_generation: null,
        templates_used: [],
      };
    }
  }
}
