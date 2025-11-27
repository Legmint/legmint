import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Packs')
@Controller('packs')
@Version('1')
export class PacksController {
  @Get()
  @ApiOperation({ summary: 'List all template packs' })
  @ApiQuery({
    name: 'include_templates',
    required: false,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'List of packs',
  })
  async listPacks(@Query('include_templates') includeTemplates?: boolean) {
    // Mock data for now - will be replaced with database query
    return {
      packs: [
        {
          pack_code: 'fundraising',
          name: 'Fundraising Pack',
          description: 'Essential documents for startup fundraising',
          template_count: 8,
          access_level: 'starter',
          pricing: {
            starter: 99,
            pro: 49,
            scale: 149,
          },
          templates: includeTemplates
            ? [
                {
                  template_code: 'SAFE_PM_V1',
                  name: 'SAFE Agreement (Post-Money)',
                  access_level: 'starter',
                },
              ]
            : undefined,
        },
        {
          pack_code: 'saas',
          name: 'SaaS Operations Pack',
          description: 'B2B SaaS subscription and compliance documents',
          template_count: 9,
          access_level: 'pro',
          pricing: {
            pro: 49,
            scale: 149,
          },
        },
      ],
    };
  }

  @Get(':pack_code')
  @ApiOperation({ summary: 'Get pack details' })
  @ApiResponse({
    status: 200,
    description: 'Pack details',
  })
  @ApiResponse({
    status: 404,
    description: 'Pack not found',
  })
  async getPack(@Param('pack_code') packCode: string) {
    // Mock data - will be replaced with database query
    const packs = {
      fundraising: {
        pack_code: 'fundraising',
        name: 'Fundraising Pack',
        description: 'Essential documents for startup fundraising',
        template_count: 8,
        access_level: 'starter',
        pricing: {
          starter: 99,
          pro: 49,
          scale: 149,
        },
        templates: [
          {
            template_code: 'SAFE_PM_V1',
            name: 'SAFE Agreement (Post-Money)',
            access_level: 'starter',
          },
        ],
      },
      saas: {
        pack_code: 'saas',
        name: 'SaaS Operations Pack',
        description: 'B2B SaaS subscription and compliance documents',
        template_count: 9,
        access_level: 'pro',
        pricing: {
          pro: 49,
          scale: 149,
        },
      },
    };

    return packs[packCode] || { error: 'Pack not found' };
  }
}
