# LegalMind MVP Implementation Roadmap
## Technical Implementation Plan for Weeks 3-8

**Document Version:** 1.0  
**Last Updated:** 2025-10-20  
**Status:** Implementation Ready  
**Team:** Full-Stack Engineering Team  

# CMS Configuration Blueprint

## Strapi CMS Setup

### Content Types (Collections)

```json path=/Users/marekchudomel/coding/LegalMind/cms/src/api/template/content-types/template/schema.json start=null
{
  "kind": "collectionType",
  "collectionName": "templates",
  "info": {
    "singularName": "template",
    "pluralName": "templates",
    "displayName": "Template",
    "description": "Legal document templates"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "code": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "category": {
      "type": "enumeration",
      "enum": ["Founding", "Employment", "Compliance", "Funding", "Operations"],
      "required": true
    },
    "description": {
      "type": "text",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "complexity_score": {
      "type": "integer",
      "min": 1,
      "max": 10,
      "default": 5
    },
    "estimated_minutes": {
      "type": "integer",
      "min": 1,
      "default": 15
    },
    "is_premium": {
      "type": "boolean",
      "default": false
    },
    "supported_jurisdictions": {
      "type": "json",
      "required": true
    },
    "template_content": {
      "type": "json",
      "required": true
    },
    "preview_image": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "jurisdiction_overlays": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::jurisdiction-overlay.jurisdiction-overlay",
      "mappedBy": "template"
    },
    "translations": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::template-translation.template-translation",
      "mappedBy": "template"
    },
    "status": {
      "type": "enumeration",
      "enum": ["draft", "review", "approved", "published"],
      "default": "draft"
    },
    "legal_reviewer": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::lawyer.lawyer"
    },
    "review_notes": {
      "type": "text"
    }
  }
}
```

### Jurisdiction Overlay Content Type

```json path=/Users/marekchudomel/coding/LegalMind/cms/src/api/jurisdiction-overlay/content-types/jurisdiction-overlay/schema.json start=null
{
  "kind": "collectionType",
  "collectionName": "jurisdiction_overlays",
  "info": {
    "singularName": "jurisdiction-overlay",
    "pluralName": "jurisdiction-overlays",
    "displayName": "Jurisdiction Overlay",
    "description": "Jurisdiction-specific legal overlays for templates"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "template": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::template.template",
      "inversedBy": "jurisdiction_overlays"
    },
    "jurisdiction_code": {
      "type": "enumeration",
      "enum": ["UK", "US-DE", "DE", "FR", "ES", "CZ"],
      "required": true
    },
    "version": {
      "type": "string",
      "default": "1.0",
      "required": true
    },
    "overlay_content": {
      "type": "json",
      "required": true
    },
    "legal_citations": {
      "type": "json"
    },
    "validated_by": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::lawyer.lawyer"
    },
    "validation_date": {
      "type": "datetime"
    },
    "validation_notes": {
      "type": "text"
    },
    "effective_from": {
      "type": "date",
      "default": "today"
    },
    "effective_until": {
      "type": "date"
    },
    "status": {
      "type": "enumeration",
      "enum": ["draft", "review", "validated", "active", "deprecated"],
      "default": "draft"
    }
  }
}
```

### Custom Strapi Plugin: Template Preview

```typescript path=/Users/marekchudomel/coding/LegalMind/cms/src/extensions/template-preview/admin/src/index.js start=null
import TemplatePreviewIcon from './components/TemplatePreviewIcon';
import TemplatePreviewPage from './pages/TemplatePreviewPage';

export default {
  register(app) {
    app.addMenuLink({
      to: '/plugins/template-preview',
      icon: TemplatePreviewIcon,
      intlLabel: {
        id: 'template-preview.plugin.name',
        defaultMessage: 'Template Preview',
      },
      Component: async () => {
        const component = await import('./pages/TemplatePreviewPage');
        return component;
      },
      permissions: [
        {
          action: 'plugin::template-preview.read',
          subject: null,
        },
      ],
    });
  },

  bootstrap(app) {
    // Add template preview functionality to Template content type
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'template-preview-button',
      Component: () => {
        const { formatMessage } = useIntl();
        const { slug } = useParams();
        const { id } = useParams();
        
        if (slug !== 'api::template.template') {
          return null;
        }
        
        return (
          <LinkButton
            size="S"
            startIcon={<Eye />}
            style={{ width: '100%' }}
            to={`/plugins/template-preview/${id}`}
            variant="secondary"
          >
            {formatMessage({
              id: 'template-preview.button.preview',
              defaultMessage: 'Preview Template',
            })}
          </LinkButton>
        );
      },
    });
  },
};
```

### CMS Admin Permissions

```typescript path=/Users/marekchudomel/coding/LegalMind/cms/src/api/lawyer/content-types/lawyer/schema.json start=null
{
  "kind": "collectionType",
  "collectionName": "lawyers",
  "info": {
    "singularName": "lawyer",
    "pluralName": "lawyers",
    "displayName": "Lawyer",
    "description": "Legal professionals who validate templates and overlays"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "email",
      "required": true,
      "unique": true
    },
    "jurisdiction_specialties": {
      "type": "json",
      "required": true
    },
    "bar_number": {
      "type": "string"
    },
    "firm_name": {
      "type": "string"
    },
    "bio": {
      "type": "text"
    },
    "active": {
      "type": "boolean",
      "default": true
    },
    "validated_templates": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::template.template",
      "mappedBy": "legal_reviewer"
    },
    "validated_overlays": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::jurisdiction-overlay.jurisdiction-overlay",
      "mappedBy": "validated_by"
    }
  }
}
```

---

# Testing Strategy & Implementation

## Unit Testing Plan

### Overlay Merging Tests

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/templates/services/overlay-merger.service.spec.ts start=null
import { Test, TestingModule } from '@nestjs/testing';
import { OverlayMergerService } from './overlay-merger.service';

describe('OverlayMergerService', () => {
  let service: OverlayMergerService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OverlayMergerService],
    }).compile();
    
    service = module.get<OverlayMergerService>(OverlayMergerService);
  });
  
  describe('mergeTemplateWithOverlay', () => {
    it('should merge base template with UK overlay correctly', async () => {
      const baseTemplate = {
        id: 'test-template',
        template_content: {
          variables: [
            {
              id: 'equity_type',
              type: 'select',
              label: 'Equity Type',
              options: ['Shares', 'Options']
            }
          ],
          sections: [
            {
              id: 'definitions',
              clauses: [
                {
                  id: 'def_equity',
                  text: 'Equity means {{ equity_type }}',
                  universal: false
                }
              ]
            }
          ]
        }
      };
      
      const ukOverlay = {
        overlay_content: {
          variable_overrides: {
            equity_type: {
              default: 'Ordinary Shares',
              options: ['Ordinary Shares', 'Alphabet Shares'],
              helpText: 'UK companies typically issue Ordinary Shares'
            }
          },
          clause_overrides: {
            def_equity: {
              text: 'Equity means Ordinary Shares with nominal value £{{ nominal_value }}',
              legal_citation: 'Companies Act 2006, Section 542'
            }
          },
          additional_variables: [
            {
              id: 'nominal_value',
              type: 'number',
              label: 'Nominal Value (£)',
              default: 0.01
            }
          ]
        }
      };
      
      const merged = await service.mergeTemplateWithOverlay(baseTemplate, 'UK', ukOverlay);
      
      // Test variable override
      const equityTypeVar = merged.template_content.variables.find(v => v.id === 'equity_type');
      expect(equityTypeVar.default).toBe('Ordinary Shares');
      expect(equityTypeVar.helpText).toBe('UK companies typically issue Ordinary Shares');
      
      // Test additional variable
      const nominalValueVar = merged.template_content.variables.find(v => v.id === 'nominal_value');
      expect(nominalValueVar).toBeDefined();
      expect(nominalValueVar.default).toBe(0.01);
      
      // Test clause override
      const defEquityClause = merged.template_content.sections[0].clauses.find(c => c.id === 'def_equity');
      expect(defEquityClause.text).toContain('nominal value £{{ nominal_value }}');
      expect(defEquityClause.legal_citation).toBe('Companies Act 2006, Section 542');
      expect(defEquityClause.overridden).toBe(true);
    });
    
    it('should return base template when no overlay exists', async () => {
      const baseTemplate = { id: 'test', template_content: { variables: [], sections: [] } };
      
      const merged = await service.mergeTemplateWithOverlay(baseTemplate, 'UNKNOWN');
      
      expect(merged).toEqual(baseTemplate);
    });
  });
});
```

### JSONLogic Engine Tests

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/questionnaires/engines/jsonlogic.engine.spec.ts start=null
import { JSONLogicEngine } from './jsonlogic.engine';

describe('JSONLogicEngine', () => {
  let engine: JSONLogicEngine;
  
  beforeEach(() => {
    engine = new JSONLogicEngine();
  });
  
  describe('evaluateConditionalLogic', () => {
    it('should show fields based on conditions', () => {
      const rules = [
        {
          id: 'vesting_fields',
          rule: {
            if: [
              { '==': [{ var: 'vesting_enabled' }, true] },
              { show: ['vesting_period', 'cliff_period'] },
              { hide: ['vesting_period', 'cliff_period'] }
            ]
          }
        }
      ];
      
      const userAnswers = { vesting_enabled: true };
      
      const state = engine.evaluateConditionalLogic(rules, userAnswers);
      
      expect(state.visibleFields.has('vesting_period')).toBe(true);
      expect(state.visibleFields.has('cliff_period')).toBe(true);
      expect(state.hiddenFields.has('vesting_period')).toBe(false);
    });
    
    it('should require fields conditionally', () => {
      const rules = [
        {
          id: 'company_type_required',
          rule: {
            if: [
              { '==': [{ var: 'jurisdiction' }, 'DE'] },
              { require: ['share_capital', 'managing_directors'] }
            ]
          }
        }
      ];
      
      const userAnswers = { jurisdiction: 'DE' };
      
      const state = engine.evaluateConditionalLogic(rules, userAnswers);
      
      expect(state.requiredFields.has('share_capital')).toBe(true);
      expect(state.requiredFields.has('managing_directors')).toBe(true);
    });
    
    it('should generate warnings', () => {
      const rules = [
        {
          id: 'nominal_value_warning',
          rule: {
            if: [
              { and: [
                { '<': [{ var: 'nominal_value' }, 0.01] },
                { '>': [{ var: 'nominal_value' }, 1] }
              ]},
              { warn: 'Unusual nominal value: £{{ nominal_value }}' }
            ]
          },
          targetField: 'nominal_value'
        }
      ];
      
      const userAnswers = { nominal_value: 0.001 };
      
      const state = engine.evaluateConditionalLogic(rules, userAnswers);
      
      expect(state.warnings).toHaveLength(1);
      expect(state.warnings[0].message).toContain('Unusual nominal value');
      expect(state.warnings[0].fieldId).toBe('nominal_value');
    });
  });
});
```

## Integration Testing

### Template Generation Integration Tests

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/testing/integration/template-generation.integration-spec.ts start=null
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesModule } from '../../templates/templates.module';
import { QuestionnairesModule } from '../../questionnaires/questionnaires.module';
import { DocumentsModule } from '../../documents/documents.module';
import { DocumentGeneratorService } from '../../documents/document-generator.service';

describe('Template Generation Integration', () => {
  let app: TestingModule;
  let documentGenerator: DocumentGeneratorService;
  
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT) || 5432,
          username: process.env.DB_USER || 'test',
          password: process.env.DB_PASS || 'test',
          database: process.env.DB_NAME || 'legalmind_test',
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        TemplatesModule,
        QuestionnairesModule,
        DocumentsModule,
      ],
    }).compile();
    
    documentGenerator = app.get<DocumentGeneratorService>(DocumentGeneratorService);
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('Full document generation flow', () => {
    it('should generate Founders Agreement for UK jurisdiction', async () => {
      const result = await documentGenerator.generateDocument(
        'founders-agreement-v1',
        'UK',
        'en-UK',
        {
          company_name: 'Innovation Ltd',
          founders: [
            { name: 'Alice Johnson', email: 'alice@innovation.com', equity_percentage: 55 },
            { name: 'Bob Smith', email: 'bob@innovation.com', equity_percentage: 45 }
          ],
          vesting_enabled: true,
          vesting_period: 4,
          cliff_period: 1,
          nominal_value: 0.01,
          share_class: 'Ordinary'
        }
      );
      
      expect(result.id).toBeDefined();
      expect(result.outputs).toHaveLength(2);
      expect(result.outputs.find(o => o.format === 'docx')).toBeDefined();
      expect(result.outputs.find(o => o.format === 'pdf')).toBeDefined();
      expect(result.previewUrl).toContain('/documents/');
    });
    
    it('should apply German overlay with correct legal citations', async () => {
      const result = await documentGenerator.generateDocument(
        'founders-agreement-v1',
        'DE',
        'de-DE',
        {
          company_name: 'Innovation GmbH',
          share_capital: 25000,
          founders: [
            { name: 'Hans Weber', email: 'hans@innovation.de', equity_percentage: 50 },
            { name: 'Anna Fischer', email: 'anna@innovation.de', equity_percentage: 50 }
          ],
          managing_directors_count: 2,
          court_location: 'Munich'
        }
      );
      
      expect(result.metadata.overlayVersion).toBe('1.0');
      expect(result.metadata.conditionalState.warnings).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('notariell')
        })
      );
    });
  });
});
```

## Performance Testing

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/testing/performance/document-generation.perf-spec.ts start=null
import { performance } from 'perf_hooks';
import { DocumentGeneratorService } from '../../documents/document-generator.service';

describe('Document Generation Performance', () => {
  let documentGenerator: DocumentGeneratorService;
  
  beforeEach(() => {
    // Setup service with mocked dependencies
  });
  
  it('should generate simple template within 2 seconds', async () => {
    const start = performance.now();
    
    await documentGenerator.generateDocument(
      'offer-letter-v1',
      'UK',
      'en-UK',
      {
        candidate_name: 'John Doe',
        job_title: 'Software Engineer',
        salary_amount: 50000
      }
    );
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(2000);
  });
  
  it('should handle concurrent generation requests', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => 
      documentGenerator.generateDocument(
        'website-terms-v1',
        'UK',
        'en-UK',
        {
          platform_name: `Test Platform ${i}`,
          company_name: `Test Company ${i}`
        }
      )
    );
    
    const start = performance.now();
    const results = await Promise.all(promises);
    const duration = performance.now() - start;
    
    expect(results).toHaveLength(10);
    expect(duration).toBeLessThan(15000); // 15 seconds for 10 concurrent generations
    results.forEach(result => {
      expect(result.id).toBeDefined();
    });
  });
});
```

---

# Deployment Checklist

## Environment Setup

### Production Infrastructure

```yaml path=/Users/marekchudomel/coding/LegalMind/docker-compose.prod.yml start=null
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: legalmind
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
  
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASS}@postgres:5432/legalmind
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_S3_BUCKET: ${AWS_S3_BUCKET}
    depends_on:
      - postgres
      - redis
    ports:
      - "3001:3001"
  
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile.prod
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: https://api.legalmind.com
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY}
    ports:
      - "3000:3000"
  
  cms:
    build:
      context: .
      dockerfile: cms/Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASS}@postgres:5432/legalmind
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      JWT_SECRET: ${JWT_SECRET}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_S3_BUCKET: ${AWS_S3_BUCKET}
    depends_on:
      - postgres
    ports:
      - "1337:1337"

volumes:
  postgres_data:
  redis_data:
```

### Database Migration Script

```bash path=/Users/marekchudomel/coding/LegalMind/scripts/deploy-production.sh start=null
#!/bin/bash
set -e

echo "🚀 Starting LegalMind production deployment..."

# Check environment variables
required_vars=("DB_USER" "DB_PASS" "JWT_SECRET" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "AWS_S3_BUCKET")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set"
    exit 1
  fi
done

# Create database backup
echo "📦 Creating database backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/backup_$timestamp.sql

# Run database migrations
echo "🗄️  Running database migrations..."
npx typeorm migration:run -d apps/api/src/database/data-source.ts

# Build and deploy services
echo "🔨 Building services..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Stop existing services
echo "🛑 Stopping existing services..."
docker-compose -f docker-compose.prod.yml down

# Start new services
echo "▶️  Starting new services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run health checks
echo "🏥 Running health checks..."
for service in api web cms; do
  if ! docker-compose -f docker-compose.prod.yml exec $service curl -f http://localhost/health > /dev/null 2>&1; then
    echo "❌ Health check failed for $service"
    exit 1
  fi
done

# Seed initial data if needed
if [ "$SEED_DATA" = "true" ]; then
  echo "🌱 Seeding initial data..."
  docker-compose -f docker-compose.prod.yml exec api npm run seed:production
fi

echo "✅ Deployment completed successfully!"
echo "🌐 API: https://api.legalmind.com"
echo "🌐 Web: https://app.legalmind.com"
echo "🌐 CMS: https://cms.legalmind.com"
```

### Initial Seed Data

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/database/seeders/production.seeder.ts start=null
import { DataSource } from 'typeorm';
import { Template } from '../entities/template.entity';
import { JurisdictionOverlay } from '../entities/jurisdiction-overlay.entity';
import { Lawyer } from '../entities/lawyer.entity';

export class ProductionSeeder {
  
  async seed(dataSource: DataSource): Promise<void> {
    console.log('🌱 Seeding production data...');
    
    // 1. Create lawyers
    const lawyers = await this.seedLawyers(dataSource);
    
    // 2. Create base templates
    const templates = await this.seedTemplates(dataSource);
    
    // 3. Create jurisdiction overlays
    await this.seedJurisdictionOverlays(dataSource, templates, lawyers);
    
    console.log('✅ Production seeding completed');
  }
  
  private async seedLawyers(dataSource: DataSource): Promise<Lawyer[]> {
    const lawyerRepo = dataSource.getRepository(Lawyer);
    
    const lawyers = [
      {
        name: 'Sarah Thompson',
        email: 'sarah@legalexperts.uk',
        jurisdiction_specialties: ['UK'],
        bar_number: 'SRA123456',
        firm_name: 'Thompson Legal Ltd',
        active: true
      },
      {
        name: 'John Davis',
        email: 'john@uslaw.com',
        jurisdiction_specialties: ['US-DE'],
        bar_number: 'DE45678',
        firm_name: 'Davis & Associates',
        active: true
      },
      {
        name: 'Klaus Müller',
        email: 'klaus@rechtskanzlei.de',
        jurisdiction_specialties: ['DE'],
        bar_number: 'RAK789012',
        firm_name: 'Müller Rechtsanwälte',
        active: true
      },
      {
        name: 'Marie Dubois',
        email: 'marie@avocat-paris.fr',
        jurisdiction_specialties: ['FR'],
        bar_number: 'Paris34567',
        firm_name: 'Cabinet Dubois',
        active: true
      }
    ];
    
    const savedLawyers = [];
    for (const lawyerData of lawyers) {
      const lawyer = lawyerRepo.create(lawyerData);
      savedLawyers.push(await lawyerRepo.save(lawyer));
    }
    
    console.log(`👨‍⚖️ Created ${savedLawyers.length} lawyers`);
    return savedLawyers;
  }
  
  private async seedTemplates(dataSource: DataSource): Promise<Template[]> {
    const templateRepo = dataSource.getRepository(Template);
    
    const critical8Templates = [
      // Will be loaded from existing template specifications
      // This is a simplified version - actual implementation would load from JSON files
      {
        code: 'founders-agreement-v1',
        title: 'Founders\' Agreement',
        category: 'Founding',
        complexity_score: 7,
        estimated_minutes: 30,
        is_premium: true,
        supported_jurisdictions: ['UK', 'US-DE', 'DE', 'FR'],
        template_content: {}
        // ... full template content loaded from specification files
      }
      // ... other 7 critical templates
    ];
    
    const savedTemplates = [];
    for (const templateData of critical8Templates) {
      const template = templateRepo.create(templateData);
      savedTemplates.push(await templateRepo.save(template));
    }
    
    console.log(`📄 Created ${savedTemplates.length} templates`);
    return savedTemplates;
  }
  
  private async seedJurisdictionOverlays(
    dataSource: DataSource, 
    templates: Template[], 
    lawyers: Lawyer[]
  ): Promise<void> {
    const overlayRepo = dataSource.getRepository(JurisdictionOverlay);
    
    let overlayCount = 0;
    
    for (const template of templates) {
      for (const jurisdiction of template.supported_jurisdictions) {
        const lawyer = lawyers.find(l => l.jurisdiction_specialties.includes(jurisdiction));
        
        if (lawyer) {
          const overlay = overlayRepo.create({
            template,
            jurisdiction_code: jurisdiction,
            version: '1.0',
            overlay_content: {}, // Load from specification files
            legal_citations: [], // Load from specification files
            validated_by: lawyer,
            validation_date: new Date(),
            effective_from: new Date(),
            status: 'active'
          });
          
          await overlayRepo.save(overlay);
          overlayCount++;
        }
      }
    }
    
    console.log(`⚖️ Created ${overlayCount} jurisdiction overlays`);
  }
}
```

### Health Check Endpoints

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/health/health.controller.ts start=null
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
  
  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      // Add checks for external services (S3, Stripe, etc.)
    ]);
  }
  
  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
    ]);
  }
}
```

### Monitoring & Alerting

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/monitoring/metrics.service.ts start=null
import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly templateGenerations = new Counter({
    name: 'template_generations_total',
    help: 'Total number of template generations',
    labelNames: ['template_id', 'jurisdiction', 'status']
  });
  
  private readonly generationDuration = new Histogram({
    name: 'template_generation_duration_seconds',
    help: 'Time taken to generate templates',
    labelNames: ['template_id', 'jurisdiction'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30]
  });
  
  private readonly activeUsers = new Gauge({
    name: 'active_users',
    help: 'Number of active users'
  });
  
  private readonly errorRate = new Counter({
    name: 'errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'endpoint']
  });
  
  recordTemplateGeneration(templateId: string, jurisdiction: string, status: 'success' | 'error'): void {
    this.templateGenerations.inc({ template_id: templateId, jurisdiction, status });
  }
  
  recordGenerationDuration(templateId: string, jurisdiction: string, duration: number): void {
    this.generationDuration.observe({ template_id: templateId, jurisdiction }, duration);
  }
  
  setActiveUsers(count: number): void {
    this.activeUsers.set(count);
  }
  
  recordError(type: string, endpoint: string): void {
    this.errorRate.inc({ type, endpoint });
  }
  
  getMetrics(): string {
    return register.metrics();
  }
}
```

## Final Deployment Checklist

### Pre-Deployment

- [ ] All 8 critical templates created and tested
- [ ] Jurisdiction overlays validated by lawyers (UK, US-DE, DE, FR, ES)
- [ ] Translations completed for German and French
- [ ] Unit tests pass (>85% coverage)
- [ ] Integration tests pass
- [ ] Performance tests pass (<5s generation time)
- [ ] Security audit completed
- [ ] Database migrations tested

### Infrastructure

- [ ] Production database set up (PostgreSQL 14+)
- [ ] Redis cache configured
- [ ] S3 bucket for document storage
- [ ] CDN configured for static assets
- [ ] SSL certificates installed
- [ ] Load balancer configured
- [ ] Monitoring stack deployed (Prometheus + Grafana)
- [ ] Log aggregation configured (ELK Stack)

### Application

- [ ] Environment variables configured
- [ ] API documentation updated
- [ ] CMS admin accounts created
- [ ] Stripe webhooks configured
- [ ] Auth0/Clerk integration tested
- [ ] Email service configured (SendGrid)
- [ ] Error tracking configured (Sentry)

### Content

- [ ] Initial seed data loaded
- [ ] Lawyer accounts created and verified
- [ ] Template content validated
- [ ] Legal citations verified
- [ ] Translations reviewed
- [ ] Preview functionality tested

### Post-Deployment

- [ ] Health checks passing
- [ ] End-to-end generation tested
- [ ] Payment flow tested
- [ ] Email notifications working
- [ ] Analytics tracking verified
- [ ] Backup procedures tested
- [ ] Rollback plan validated

---

## Summary

This implementation roadmap provides a complete technical specification for LegalMind's MVP, covering:

**Week 3:** Database schema, API endpoints, and overlay merging system  
**Week 4:** Founders' Agreement pilot with validation and testing frameworks  
**Week 5-6:** Questionnaire engine with conditional logic and multi-step forms  
**Week 7-8:** Integration of all 8 critical templates with comprehensive testing  

**Key Deliverables:**
- Multi-jurisdiction architecture supporting 90% code reuse
- JSONLogic-powered conditional questionnaires
- Comprehensive testing suite (unit, integration, E2E)
- Production-ready CMS with lawyer validation workflow
- Scalable deployment infrastructure

The engineering team can now execute this plan to deliver a fully functional LegalMind MVP within the 8-week timeline.

---

## Executive Summary

This document provides a comprehensive implementation roadmap for LegalMind's MVP, translating specifications into working code, APIs, and CMS content structures. The plan covers the jurisdiction overlay system, questionnaire engine, and integration of 8 critical templates across 5 jurisdictions.

**Key Deliverables:**
- ✅ Multi-jurisdiction architecture with overlay system
- ✅ Questionnaire engine with JSONLogic conditional branching  
- ✅ 8 critical templates fully functional
- ✅ CMS integration for content management
- ✅ End-to-end document generation pipeline

---

# Week 3: Jurisdiction Overlay System

## System Implementation Plan

### File Structure

```
legalmind/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── templates/
│   │   │   │   ├── templates.module.ts
│   │   │   │   ├── templates.service.ts
│   │   │   │   ├── templates.controller.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── template.entity.ts
│   │   │   │   │   ├── jurisdiction-overlay.entity.ts
│   │   │   │   │   ├── template-translation.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-overlay.dto.ts
│   │   │   │   │   ├── merge-template.dto.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── overlay-merger.service.ts
│   │   │   │   │   ├── template-renderer.service.ts
│   │   │   │   │   ├── translation.service.ts
│   │   │   ├── questionnaires/
│   │   │   │   ├── questionnaires.module.ts
│   │   │   │   ├── questionnaires.service.ts
│   │   │   │   ├── questionnaires.controller.ts
│   │   │   │   ├── engines/
│   │   │   │   │   ├── jsonlogic.engine.ts
│   │   │   │   │   ├── conditional-display.engine.ts
│   │   │   ├── documents/
│   │   │   │   ├── documents.module.ts
│   │   │   │   ├── document-generator.service.ts
│   │   │   │   ├── generators/
│   │   │   │   │   ├── docx.generator.ts
│   │   │   │   │   ├── pdf.generator.ts
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   │   ├── 001_create_jurisdiction_overlays.sql
│   │   │   │   │   ├── 002_create_template_translations.sql
│   │   │   │   │   ├── 003_create_questionnaire_responses.sql
│   ├── web/                          # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── templates/
│   │   │   │   │   ├── [templateId]/
│   │   │   │   │   │   ├── questionnaire/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── [jurisdiction]/
│   │   │   │   │   │   │   │   ├── [language]/
│   │   │   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   ├── generate/
│   │   │   │   │   ├── [documentId]/
│   │   │   │   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── questionnaire/
│   │   │   │   │   ├── QuestionnaireForm.tsx
│   │   │   │   │   ├── ConditionalField.tsx
│   │   │   │   │   ├── JurisdictionSelector.tsx
│   │   │   │   │   ├── LanguageSelector.tsx
│   │   │   │   ├── templates/
│   │   │   │   │   ├── TemplatePreview.tsx
│   │   │   │   │   ├── DocumentViewer.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api/
│   │   │   │   │   ├── templates.ts
│   │   │   │   │   ├── questionnaires.ts
│   │   │   │   │   ├── documents.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── jsonlogic.ts
│   │   │   │   │   ├── i18n.ts
├── packages/
│   ├── shared/                       # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── template.types.ts
│   │   │   │   ├── overlay.types.ts
│   │   │   │   ├── questionnaire.types.ts
│   │   │   ├── schemas/
│   │   │   │   ├── template.schema.json
│   │   │   │   ├── overlay.schema.json
│   │   │   │   ├── questionnaire.schema.json
├── cms/                              # Strapi CMS
│   ├── src/
│   │   ├── api/
│   │   │   ├── template/
│   │   │   ├── jurisdiction-overlay/
│   │   │   ├── template-translation/
│   │   │   ├── lawyer/
│   │   ├── extensions/
│   │   │   ├── template-preview/
│   │   │   ├── overlay-validator/
├── docs/
│   ├── api/
│   │   ├── templates.md
│   │   ├── overlays.md
│   │   ├── questionnaires.md
```

## ERD Diagram

```mermaid
erDiagram
    templates ||--o{ template_jurisdiction_overlays : has_overlays
    templates ||--o{ template_translations : has_translations
    templates ||--o{ questionnaire_responses : generates_responses
    templates ||--o{ documents : generates_documents
    
    template_jurisdiction_overlays }o--|| lawyers : validated_by
    template_translations }o--|| translators : translated_by
    
    questionnaire_responses ||--|| documents : generates
    questionnaire_responses }o--|| users : belongs_to
    
    documents }o--|| users : belongs_to
    documents }o--|| templates : based_on
    
    templates {
        uuid id PK
        varchar code UK
        varchar title
        varchar category
        text description
        jsonb template_content
        varchar[] supported_jurisdictions
        boolean is_premium
        integer complexity_score
        integer estimated_minutes
        timestamp created_at
        timestamp updated_at
    }
    
    template_jurisdiction_overlays {
        uuid id PK
        uuid template_id FK
        varchar jurisdiction_code
        varchar version
        jsonb overlay_content
        uuid validated_by FK
        timestamp validation_date
        text[] legal_citations
        text notes
        date effective_from
        date effective_until
        timestamp created_at
        timestamp updated_at
    }
    
    template_translations {
        uuid id PK
        uuid template_id FK
        varchar jurisdiction_code
        varchar language_code
        jsonb translations
        varchar translated_by
        date translation_date
        varchar translation_status
        boolean native_speaker_reviewed
        boolean lawyer_reviewed
        timestamp created_at
        timestamp updated_at
    }
    
    questionnaire_responses {
        uuid id PK
        uuid template_id FK
        uuid user_id FK
        varchar jurisdiction
        varchar language
        jsonb user_answers
        jsonb computed_variables
        jsonb conditional_state
        varchar status
        timestamp created_at
        timestamp updated_at
    }
    
    documents {
        uuid id PK
        uuid user_id FK
        uuid template_id FK
        uuid questionnaire_response_id FK
        varchar jurisdiction
        varchar language
        jsonb user_data
        text generated_content
        varchar file_path_docx
        varchar file_path_pdf
        varchar status
        jsonb generation_metadata
        timestamp created_at
        timestamp updated_at
    }
    
    lawyers {
        uuid id PK
        varchar name
        varchar email
        varchar jurisdiction_specialties[]
        varchar bar_number
        varchar firm_name
        boolean active
        timestamp created_at
        timestamp updated_at
    }
    
    translators {
        uuid id PK
        varchar name
        varchar email
        varchar languages[]
        boolean native_speaker
        boolean legal_specialist
        timestamp created_at
        timestamp updated_at
    }
    
    users {
        uuid id PK
        varchar email UK
        varchar name
        varchar company
        jsonb preferences
        varchar subscription_tier
        timestamp created_at
        timestamp updated_at
    }
```

## API Endpoints

### Base Template Management

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/templates/templates.controller.ts start=null
@Controller('api/templates')
export class TemplatesController {
  
  @Get()
  async getTemplates(
    @Query('category') category?: string,
    @Query('jurisdiction') jurisdiction?: string,
    @Query('language') language?: string
  ): Promise<TemplateListResponse> {
    return this.templatesService.getTemplates({ category, jurisdiction, language });
  }

  @Get(':templateId')
  async getTemplate(
    @Param('templateId') templateId: string,
    @Query('jurisdiction') jurisdiction?: string,
    @Query('language') language?: string
  ): Promise<TemplateResponse> {
    return this.templatesService.getTemplate(templateId, { jurisdiction, language });
  }

  @Get(':templateId/jurisdictions')
  async getSupportedJurisdictions(
    @Param('templateId') templateId: string
  ): Promise<JurisdictionListResponse> {
    return this.templatesService.getSupportedJurisdictions(templateId);
  }

  @Post(':templateId/jurisdictions/:jurisdiction/overlays')
  @UseGuards(AdminGuard)
  async createOverlay(
    @Param('templateId') templateId: string,
    @Param('jurisdiction') jurisdiction: string,
    @Body() createOverlayDto: CreateOverlayDto
  ): Promise<OverlayResponse> {
    return this.overlayService.createOverlay(templateId, jurisdiction, createOverlayDto);
  }

  @Put(':templateId/jurisdictions/:jurisdiction/overlays/:version')
  @UseGuards(AdminGuard)
  async updateOverlay(
    @Param('templateId') templateId: string,
    @Param('jurisdiction') jurisdiction: string,
    @Param('version') version: string,
    @Body() updateOverlayDto: UpdateOverlayDto
  ): Promise<OverlayResponse> {
    return this.overlayService.updateOverlay(templateId, jurisdiction, version, updateOverlayDto);
  }
}
```

### Overlay Management

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/templates/services/overlay-merger.service.ts start=null
@Injectable()
export class OverlayMergerService {
  
  async mergeTemplateWithOverlay(
    baseTemplate: Template,
    jurisdiction: string
  ): Promise<MergedTemplate> {
    
    const overlay = await this.getActiveOverlay(baseTemplate.id, jurisdiction);
    
    if (!overlay) {
      return this.convertToMergedTemplate(baseTemplate);
    }

    const merged = _.cloneDeep(baseTemplate);
    
    // 1. Apply variable overrides
    this.applyVariableOverrides(merged, overlay);
    
    // 2. Add additional variables
    this.addAdditionalVariables(merged, overlay);
    
    // 3. Apply clause overrides
    this.applyClauseOverrides(merged, overlay);
    
    // 4. Add additional clauses
    this.addAdditionalClauses(merged, overlay);
    
    // 5. Merge conditional logic
    this.mergeConditionalLogic(merged, overlay);
    
    // 6. Add legal metadata
    this.addLegalMetadata(merged, overlay);
    
    return merged;
  }

  private applyVariableOverrides(template: Template, overlay: JurisdictionOverlay): void {
    if (!overlay.overlay_content.variable_overrides) return;
    
    template.template_content.variables = template.template_content.variables.map(variable => {
      const override = overlay.overlay_content.variable_overrides[variable.id];
      if (override) {
        return { ...variable, ...override };
      }
      return variable;
    });
  }

  private addAdditionalVariables(template: Template, overlay: JurisdictionOverlay): void {
    if (!overlay.overlay_content.additional_variables) return;
    
    template.template_content.variables.push(...overlay.overlay_content.additional_variables);
  }

  private applyClauseOverrides(template: Template, overlay: JurisdictionOverlay): void {
    if (!overlay.overlay_content.clause_overrides) return;
    
    template.template_content.sections.forEach(section => {
      section.clauses = section.clauses.map(clause => {
        const override = overlay.overlay_content.clause_overrides[clause.id];
        if (override) {
          return {
            ...clause,
            ...override,
            overridden: true,
            original_text: clause.text
          };
        }
        return clause;
      });
    });
  }

  private addAdditionalClauses(template: Template, overlay: JurisdictionOverlay): void {
    if (!overlay.overlay_content.additional_clauses) return;
    
    overlay.overlay_content.additional_clauses.forEach(additionalClause => {
      const section = template.template_content.sections.find(s => s.id === additionalClause.section_id);
      if (section) {
        section.clauses.push({
          ...additionalClause,
          jurisdiction_specific: true
        });
        
        // Re-sort clauses by order
        section.clauses.sort((a, b) => (a.order || 999) - (b.order || 999));
      }
    });
  }
}
```

### Questionnaire Engine

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/questionnaires/engines/jsonlogic.engine.ts start=null
@Injectable()
export class JSONLogicEngine {
  
  evaluateConditionalLogic(
    conditionalRules: ConditionalRule[],
    userAnswers: Record<string, any>
  ): ConditionalState {
    
    const state: ConditionalState = {
      visibleFields: new Set(),
      requiredFields: new Set(),
      hiddenFields: new Set(),
      warnings: [],
      errors: []
    };

    conditionalRules.forEach(rule => {
      try {
        const result = jsonLogic.apply(rule.rule, userAnswers);
        this.processRuleResult(rule, result, state, userAnswers);
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    });

    return state;
  }

  private processRuleResult(
    rule: ConditionalRule,
    result: any,
    state: ConditionalState,
    userAnswers: Record<string, any>
  ): void {
    
    if (typeof result === 'object' && result !== null) {
      
      // Handle show/hide actions
      if (result.show) {
        result.show.forEach(fieldId => state.visibleFields.add(fieldId));
      }
      
      if (result.hide) {
        result.hide.forEach(fieldId => state.hiddenFields.add(fieldId));
      }
      
      // Handle require/optional actions
      if (result.require) {
        result.require.forEach(fieldId => state.requiredFields.add(fieldId));
      }
      
      // Handle warnings and errors
      if (result.warn) {
        state.warnings.push({
          id: `${rule.id}_warning`,
          message: this.interpolateMessage(result.warn, userAnswers),
          fieldId: rule.targetField
        });
      }
      
      if (result.error) {
        state.errors.push({
          id: `${rule.id}_error`,
          message: this.interpolateMessage(result.error, userAnswers),
          fieldId: rule.targetField
        });
      }
      
      // Handle set operations
      if (result.set) {
        Object.entries(result.set).forEach(([key, value]) => {
          userAnswers[key] = value;
        });
      }
    }
  }

  private interpolateMessage(message: string, userAnswers: Record<string, any>): string {
    return message.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, variable) => {
      return userAnswers[variable]?.toString() || match;
    });
  }
}
```

## Example JSON Payloads

### Overlay Record

```json
{
  "id": "uuid-overlay-uk-1",
  "template_id": "founders-agreement-v1",
  "jurisdiction_code": "UK",
  "version": "1.0",
  "overlay_content": {
    "variable_overrides": {
      "equity_type": {
        "default": "Ordinary Shares",
        "options": ["Ordinary Shares", "Alphabet Shares", "Preference Shares"],
        "helpText": "UK companies typically issue Ordinary Shares to founders."
      },
      "governing_law_jurisdiction": {
        "default": "England and Wales",
        "options": ["England and Wales", "Scotland", "Northern Ireland"]
      }
    },
    "clause_overrides": {
      "def_equity": {
        "text": "\"Equity\" means Ordinary Shares with a nominal value of £{{ nominal_value }} each.",
        "legal_citation": "Companies Act 2006, Section 542"
      }
    },
    "additional_clauses": [
      {
        "section_id": "equity_allocation",
        "clause_id": "uk_share_certificates",
        "order": 3.5,
        "text": "Share certificates shall be issued in accordance with Companies Act 2006, Section 769.",
        "legal_citation": "Companies Act 2006, Section 769",
        "required": true
      }
    ],
    "additional_variables": [
      {
        "id": "nominal_value",
        "type": "number",
        "label": "Nominal Value per Share (£)",
        "default": 0.01,
        "validation": { "min": 0.0001, "max": 100 }
      }
    ],
    "conditional_logic": [
      {
        "rule": {
          "if": [
            {"!=": [{"var": "share_class"}, "Ordinary"]},
            {"set": {"require_lawyer_review": true}},
            {"set": {"require_lawyer_review": false}}
          ]
        }
      }
    ]
  },
  "legal_citations": [
    "Companies Act 2006, Section 33",
    "Companies Act 2006, Section 542",
    "Companies Act 2006, Section 769"
  ],
  "validated_by": "uuid-lawyer-uk-1",
  "validation_date": "2025-10-15T00:00:00Z",
  "effective_from": "2025-10-15",
  "effective_until": null
}
```

### Questionnaire Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Template Questionnaire",
  "type": "object",
  "properties": {
    "template_id": {
      "type": "string",
      "format": "uuid"
    },
    "jurisdiction": {
      "type": "string",
      "enum": ["UK", "US-DE", "DE", "FR", "ES"]
    },
    "language": {
      "type": "string",
      "enum": ["en-UK", "en-US", "de-DE", "fr-FR", "es-ES"]
    },
    "groups": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "order": { "type": "integer" },
          "fields": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "type": {
                  "type": "string",
                  "enum": ["text", "number", "boolean", "select", "multiselect", "date", "array"]
                },
                "label": { "type": "string" },
                "helpText": { "type": "string" },
                "placeholder": { "type": "string" },
                "required": { "type": "boolean" },
                "default": {},
                "options": {
                  "type": "array",
                  "items": { "type": "string" }
                },
                "validation": {
                  "type": "object",
                  "properties": {
                    "min": { "type": "number" },
                    "max": { "type": "number" },
                    "pattern": { "type": "string" }
                  }
                },
                "conditionalDisplay": {
                  "type": "object",
                  "description": "JSONLogic rule for showing/hiding field"
                }
              },
              "required": ["id", "type", "label"]
            }
          }
        },
        "required": ["id", "title", "order", "fields"]
      }
    },
    "conditional_logic": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "rule": { "type": "object" },
          "message": { "type": "string" },
          "targetField": { "type": "string" }
        }
      }
    }
  },
  "required": ["template_id", "jurisdiction", "language", "groups"]
}
```

### Template Generation Payload

```json
{
  "template_id": "founders-agreement-v1",
  "jurisdiction": "UK", 
  "language": "en-UK",
  "user_data": {
    "company_name": "Startup Ltd",
    "founders": [
      {
        "name": "John Smith",
        "email": "john@startup.com",
        "equity_percentage": 60
      },
      {
        "name": "Jane Doe", 
        "email": "jane@startup.com",
        "equity_percentage": 40
      }
    ],
    "vesting_enabled": true,
    "vesting_period": 4,
    "cliff_period": 1,
    "nominal_value": 0.01,
    "share_class": "Ordinary"
  },
  "generation_options": {
    "format": ["docx", "pdf"],
    "include_signatures": true,
    "include_schedule": true,
    "watermark": false
  }
}
```

---

# Week 4: Founders' Agreement Pilot

## Implementation Focus

Pilot the complete overlay system with Founders' Agreement template across 5 jurisdictions.

### Database Migrations

```sql path=/Users/marekchudomel/coding/LegalMind/apps/api/database/migrations/001_create_jurisdiction_overlays.sql start=null
-- Create jurisdiction overlays table
CREATE TABLE template_jurisdiction_overlays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  jurisdiction_code VARCHAR(10) NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  
  -- Overlay content (JSONB)
  overlay_content JSONB NOT NULL,
  
  -- Legal validation
  validated_by UUID REFERENCES lawyers(id),
  validation_date TIMESTAMPTZ,
  legal_citations TEXT[],
  
  -- Metadata
  notes TEXT,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(template_id, jurisdiction_code, version)
);

-- Indexes for performance
CREATE INDEX idx_overlays_template_jurisdiction ON template_jurisdiction_overlays(template_id, jurisdiction_code);
CREATE INDEX idx_overlays_effective ON template_jurisdiction_overlays(effective_from, effective_until);
CREATE INDEX idx_overlays_content_gin ON template_jurisdiction_overlays USING gin(overlay_content);

-- Create template translations table
CREATE TABLE template_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  jurisdiction_code VARCHAR(10),
  language_code VARCHAR(10) NOT NULL,
  
  -- Translation content (JSONB)
  translations JSONB NOT NULL,
  
  -- Translation metadata
  translated_by VARCHAR(255),
  translation_date DATE,
  translation_status VARCHAR(20) DEFAULT 'draft',
  native_speaker_reviewed BOOLEAN DEFAULT FALSE,
  lawyer_reviewed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(template_id, jurisdiction_code, language_code)
);

CREATE INDEX idx_translations_template_lang ON template_translations(template_id, language_code);
CREATE INDEX idx_translations_content_gin ON template_translations USING gin(translations);
```

### Validation Testing Framework

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/templates/services/overlay-validator.service.ts start=null
@Injectable()
export class OverlayValidatorService {
  
  async validateOverlay(
    templateId: string,
    jurisdiction: string,
    overlay: JurisdictionOverlay
  ): Promise<ValidationResult> {
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // 1. Schema validation
    const schemaErrors = await this.validateOverlaySchema(overlay);
    errors.push(...schemaErrors);
    
    // 2. Legal citation validation
    const citationWarnings = await this.validateLegalCitations(overlay, jurisdiction);
    warnings.push(...citationWarnings);
    
    // 3. Variable reference validation
    const variableErrors = await this.validateVariableReferences(templateId, overlay);
    errors.push(...variableErrors);
    
    // 4. Clause reference validation
    const clauseErrors = await this.validateClauseReferences(templateId, overlay);
    errors.push(...clauseErrors);
    
    // 5. JSONLogic validation
    const logicErrors = await this.validateConditionalLogic(overlay);
    errors.push(...logicErrors);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateValidationScore(errors, warnings)
    };
  }
  
  private async validateOverlaySchema(overlay: JurisdictionOverlay): Promise<ValidationError[]> {
    const schema = await this.getOverlaySchema();
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    
    const valid = validate(overlay);
    
    if (!valid) {
      return validate.errors?.map(error => ({
        type: 'schema',
        message: `Schema validation failed: ${error.instancePath} ${error.message}`,
        path: error.instancePath
      })) || [];
    }
    
    return [];
  }
  
  private async validateLegalCitations(
    overlay: JurisdictionOverlay, 
    jurisdiction: string
  ): Promise<ValidationWarning[]> {
    const warnings: ValidationWarning[] = [];
    const citations = overlay.legal_citations || [];
    
    // Check if citations match jurisdiction
    const jurisdictionPatterns = {
      'UK': /Companies Act|GDPR|UK DPA|Employment Rights Act/,
      'US-DE': /DGCL|IRC|Delaware/,
      'DE': /GmbHG|HGB|BGB/,
      'FR': /Code de commerce|Code civil/
    };
    
    const pattern = jurisdictionPatterns[jurisdiction];
    if (pattern) {
      const matchingCitations = citations.filter(citation => pattern.test(citation));
      if (matchingCitations.length === 0 && citations.length > 0) {
        warnings.push({
          type: 'legal_citation',
          message: `No jurisdiction-specific legal citations found for ${jurisdiction}`,
          severity: 'medium'
        });
      }
    }
    
    return warnings;
  }
}
```

### Document Generation Testing

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/documents/document-generator.service.ts start=null
@Injectable()
export class DocumentGeneratorService {
  
  constructor(
    private readonly overlayMerger: OverlayMergerService,
    private readonly templateRenderer: TemplateRendererService,
    private readonly docxGenerator: DOCXGeneratorService,
    private readonly pdfGenerator: PDFGeneratorService
  ) {}
  
  async generateDocument(
    templateId: string,
    jurisdiction: string,
    language: string,
    userAnswers: Record<string, any>,
    options: GenerationOptions = {}
  ): Promise<GeneratedDocument> {
    
    // Step 1: Load and merge template
    const baseTemplate = await this.getTemplate(templateId);
    const mergedTemplate = await this.overlayMerger.mergeTemplateWithOverlay(
      baseTemplate, 
      jurisdiction
    );
    
    // Step 2: Apply translations
    const localizedTemplate = await this.applyTranslations(
      mergedTemplate, 
      jurisdiction, 
      language
    );
    
    // Step 3: Evaluate conditional logic
    const conditionalState = await this.evaluateConditionalLogic(
      localizedTemplate, 
      userAnswers
    );
    
    // Step 4: Render template content
    const renderedContent = await this.templateRenderer.render(
      localizedTemplate,
      { ...userAnswers, ...conditionalState.computedVariables }
    );
    
    // Step 5: Generate documents
    const outputs: GenerationOutput[] = [];
    
    if (options.formats?.includes('docx') !== false) {
      const docxBuffer = await this.docxGenerator.generate(renderedContent, {
        template: localizedTemplate,
        metadata: {
          templateId,
          jurisdiction,
          language,
          generatedAt: new Date(),
          version: mergedTemplate.version
        }
      });
      
      const docxPath = await this.uploadFile(docxBuffer, 'docx', templateId);
      outputs.push({ format: 'docx', path: docxPath, size: docxBuffer.length });
    }
    
    if (options.formats?.includes('pdf') !== false) {
      const pdfBuffer = await this.pdfGenerator.generate(renderedContent, {
        template: localizedTemplate,
        watermark: options.watermark
      });
      
      const pdfPath = await this.uploadFile(pdfBuffer, 'pdf', templateId);
      outputs.push({ format: 'pdf', path: pdfPath, size: pdfBuffer.length });
    }
    
    // Step 6: Save generation record
    const document = await this.saveDocument({
      templateId,
      jurisdiction,
      language,
      userAnswers,
      renderedContent,
      outputs,
      metadata: {
        overlayVersion: mergedTemplate.overlayVersion,
        translationVersion: localizedTemplate.translationVersion,
        conditionalState,
        generationTime: Date.now() - startTime
      }
    });
    
    return {
      id: document.id,
      outputs,
      metadata: document.metadata,
      previewUrl: `${process.env.APP_URL}/documents/${document.id}/preview`
    };
  }
}
```

---

# Week 5-6: Questionnaire Engine Development

## Reusable Questionnaire System

### Frontend Questionnaire Components

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/web/src/components/questionnaire/QuestionnaireForm.tsx start=null
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JSONLogicEngine } from '@/lib/utils/jsonlogic';
import { ConditionalField } from './ConditionalField';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface QuestionnaireFormProps {
  templateId: string;
  jurisdiction: string;
  language: string;
  questionnaire: Questionnaire;
  onSubmit: (answers: Record<string, any>) => Promise<void>;
  initialAnswers?: Record<string, any>;
}

export function QuestionnaireForm({
  templateId,
  jurisdiction, 
  language,
  questionnaire,
  onSubmit,
  initialAnswers = {}
}: QuestionnaireFormProps) {
  
  const router = useRouter();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [conditionalState, setConditionalState] = useState<ConditionalState>({ 
    visibleFields: new Set(),
    hiddenFields: new Set(),
    requiredFields: new Set(),
    warnings: [],
    errors: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const currentGroup = questionnaire.groups[currentGroupIndex];
  const isLastGroup = currentGroupIndex === questionnaire.groups.length - 1;
  
  // Evaluate conditional logic whenever answers change
  useEffect(() => {
    if (questionnaire.conditional_logic) {
      const engine = new JSONLogicEngine();
      const newState = engine.evaluateConditionalLogic(
        questionnaire.conditional_logic,
        answers
      );
      setConditionalState(newState);
    }
  }, [answers, questionnaire.conditional_logic]);
  
  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear validation error for this field
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const { [fieldId]: _, ...rest } = prev;
        return rest;
      });
    }
  };
  
  const validateCurrentGroup = (): boolean => {
    const errors: Record<string, string> = {};
    
    currentGroup.fields.forEach(field => {
      // Skip validation for hidden fields
      if (conditionalState.hiddenFields.has(field.id)) {
        return;
      }
      
      // Check required fields
      const isRequired = field.required || conditionalState.requiredFields.has(field.id);
      if (isRequired && !answers[field.id]) {
        errors[field.id] = `${field.label} is required`;
        return;
      }
      
      // Field-specific validation
      const value = answers[field.id];
      if (value && field.validation) {
        if (field.type === 'number') {
          const numValue = Number(value);
          if (field.validation.min && numValue < field.validation.min) {
            errors[field.id] = `Must be at least ${field.validation.min}`;
          }
          if (field.validation.max && numValue > field.validation.max) {
            errors[field.id] = `Must be at most ${field.validation.max}`;
          }
        }
        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(String(value))) {
          errors[field.id] = `Invalid format`;
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (!validateCurrentGroup()) {
      return;
    }
    
    if (isLastGroup) {
      handleSubmit();
    } else {
      setCurrentGroupIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentGroupIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(answers);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const progress = ((currentGroupIndex + 1) / questionnaire.groups.length) * 100;
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <ProgressBar value={progress} className="mb-2" />
        <p className="text-sm text-gray-600">
          Step {currentGroupIndex + 1} of {questionnaire.groups.length}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-2">{currentGroup.title}</h2>
        {currentGroup.description && (
          <p className="text-gray-600 mb-6">{currentGroup.description}</p>
        )}
        
        <div className="space-y-6">
          {currentGroup.fields.map(field => (
            <ConditionalField
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={validationErrors[field.id]}
              conditionalState={conditionalState}
              jurisdiction={jurisdiction}
              language={language}
            />
          ))}
        </div>
        
        {/* Display warnings */}
        {conditionalState.warnings.length > 0 && (
          <div className="mt-6 space-y-2">
            {conditionalState.warnings.map(warning => (
              <Alert key={warning.id} variant="warning">
                {warning.message}
              </Alert>
            ))}
          </div>
        )}
        
        {/* Display errors */}
        {conditionalState.errors.length > 0 && (
          <div className="mt-6 space-y-2">
            {conditionalState.errors.map(error => (
              <Alert key={error.id} variant="error">
                {error.message}
              </Alert>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentGroupIndex === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isSubmitting || conditionalState.errors.length > 0}
          loading={isSubmitting}
        >
          {isLastGroup ? 'Generate Document' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
```

### Conditional Field Component

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/web/src/components/questionnaire/ConditionalField.tsx start=null
'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { DatePicker } from '@/components/ui/DatePicker';
import { ArrayField } from './ArrayField';
import { HelpTooltip } from '@/components/ui/HelpTooltip';

interface ConditionalFieldProps {
  field: QuestionnaireField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  conditionalState: ConditionalState;
  jurisdiction: string;
  language: string;
}

export function ConditionalField({
  field,
  value,
  onChange,
  error,
  conditionalState,
  jurisdiction,
  language
}: ConditionalFieldProps) {
  
  // Check if field should be hidden
  if (conditionalState.hiddenFields.has(field.id)) {
    return null;
  }
  
  // Check if field should be visible (only show if explicitly visible or not in visibility rules)
  const shouldShow = conditionalState.visibleFields.size === 0 || 
                     conditionalState.visibleFields.has(field.id);
  
  if (!shouldShow) {
    return null;
  }
  
  const isRequired = field.required || conditionalState.requiredFields.has(field.id);
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={isRequired}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value) || undefined)}
            placeholder={field.placeholder}
            required={isRequired}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      
      case 'boolean':
        return (
          <Checkbox
            checked={value || false}
            onChange={onChange}
            required={isRequired}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value || ''}
            onChange={onChange}
            options={field.options?.map(opt => ({ value: opt, label: opt })) || []}
            placeholder={field.placeholder || 'Select an option...'}
            required={isRequired}
          />
        );
      
      case 'multiselect':
        return (
          <Select
            multiple
            value={value || []}
            onChange={onChange}
            options={field.options?.map(opt => ({ value: opt, label: opt })) || []}
            placeholder={field.placeholder || 'Select options...'}
            required={isRequired}
          />
        );
      
      case 'date':
        return (
          <DatePicker
            value={value || null}
            onChange={onChange}
            required={isRequired}
          />
        );
      
      case 'array':
        return (
          <ArrayField
            field={field}
            value={value || []}
            onChange={onChange}
            jurisdiction={jurisdiction}
            language={language}
            required={isRequired}
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={isRequired}
          />
        );
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
        {field.helpText && (
          <HelpTooltip content={field.helpText} className="ml-1" />
        )}
      </label>
      
      {renderField()}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

---

# Week 7-8: Critical 8 Templates Integration

## Template Implementation Priority

### Week 7: Quick Wins (Low Complexity)

**Day 1-2: Offer Letter (Template 18)**
- Complexity: 2/10
- Universal structure across jurisdictions
- Minimal conditional logic
- Focus: At-will vs subject-to-contract variations

**Day 2-3: Board Resolution (Template 17)**
- Complexity: 3/10
- Standard corporate action formats
- Focus: Written resolutions vs meeting minutes

**Day 4-5: Website Terms (Template 16)**
- Complexity: 4/10
- Consumer vs B2B variations
- Focus: Liability limitations by jurisdiction

### Week 8: High-Value Templates

**Day 1-2: Privacy Policy (Template 15)**
- Complexity: 5/10
- GDPR/CCPA compliance focus
- Focus: Cookie consent and user rights

**Day 3-4: Contractor Agreement (Template 13)**
- Complexity: 5/10
- IR35/1099 classification critical
- Focus: Employment vs contractor tests

**Day 4-5: Shareholders' Agreement (Template 11)**
- Complexity: 8/10
- Most complex document
- Focus: Drag-along/tag-along rights

## End-to-End Testing Suite

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/testing/e2e/document-generation.e2e-spec.ts start=null
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Document Generation E2E', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  afterEach(async () => {
    await app.close();
  });
  
  describe('Founders Agreement Generation', () => {
    it('should generate UK founders agreement with overlay', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/documents/generate')
        .send({
          template_id: 'founders-agreement-v1',
          jurisdiction: 'UK',
          language: 'en-UK',
          user_data: {
            company_name: 'Test Startup Ltd',
            founders: [
              {
                name: 'John Smith',
                email: 'john@test.com',
                equity_percentage: 60
              },
              {
                name: 'Jane Doe',
                email: 'jane@test.com', 
                equity_percentage: 40
              }
            ],
            vesting_enabled: true,
            vesting_period: 4,
            cliff_period: 1,
            nominal_value: 0.01,
            share_class: 'Ordinary'
          }
        })
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.outputs).toHaveLength(2); // DOCX and PDF
      expect(response.body.metadata.jurisdiction).toBe('UK');
      expect(response.body.metadata.overlayVersion).toBe('1.0');
    });
    
    it('should generate German founders agreement with notarization warning', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/documents/generate')
        .send({
          template_id: 'founders-agreement-v1',
          jurisdiction: 'DE',
          language: 'de-DE',
          user_data: {
            company_name: 'Test Startup GmbH',
            share_capital: 25000,
            founders: [
              {
                name: 'Hans Müller',
                email: 'hans@test.de',
                equity_percentage: 50
              },
              {
                name: 'Anna Schmidt',
                email: 'anna@test.de',
                equity_percentage: 50
              }
            ],
            managing_directors_count: 2,
            court_location: 'Berlin'
          }
        })
        .expect(201);
      
      expect(response.body.metadata.warnings).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('notariell beurkundet')
        })
      );
    });
  });
  
  describe('Validation Tests', () => {
    it('should reject invalid jurisdiction', async () => {
      await request(app.getHttpServer())
        .post('/api/documents/generate')
        .send({
          template_id: 'founders-agreement-v1',
          jurisdiction: 'INVALID',
          language: 'en-UK',
          user_data: {}
        })
        .expect(400);
    });
    
    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/documents/generate')
        .send({
          template_id: 'founders-agreement-v1',
          jurisdiction: 'UK',
          language: 'en-UK',
          user_data: {
            // Missing required fields
          }
        })
        .expect(400);
    });
  });
  
  describe('Performance Tests', () => {
    it('should generate document within 5 seconds', async () => {
      const start = Date.now();
      
      await request(app.getHttpServer())
        .post('/api/documents/generate')
        .send({
          template_id: 'offer-letter-v1',
          jurisdiction: 'UK',
          language: 'en-UK',
          user_data: {
            candidate_name: 'John Smith',
            job_title: 'Software Engineer',
            salary_amount: 50000,
            start_date: '2025-01-01'
          }
        })
        .expect(201);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000);
    }, 10000);
  });
});
```

## Analytics and Usage Tracking

```typescript path=/Users/marekchudomel/coding/LegalMind/apps/api/src/analytics/template-analytics.service.ts start=null
@Injectable()
export class TemplateAnalyticsService {
  
  async trackTemplateUsage(
    templateId: string,
    jurisdiction: string,
    userId: string,
    action: 'view' | 'start_questionnaire' | 'complete' | 'download'
  ): Promise<void> {
    
    await this.analyticsDb.events.create({
      event_type: `template_${action}`,
      template_id: templateId,
      jurisdiction,
      user_id: userId,
      timestamp: new Date(),
      metadata: {
        user_agent: this.getCurrentUserAgent(),
        ip_address: this.getCurrentIP()
      }
    });
  }
  
  async getTemplatePerformanceMetrics(
    templateId: string,
    dateRange: { from: Date; to: Date }
  ): Promise<TemplateMetrics> {
    
    const metrics = await this.analyticsDb.query(`
      SELECT 
        jurisdiction,
        COUNT(*) FILTER (WHERE event_type = 'template_view') as views,
        COUNT(*) FILTER (WHERE event_type = 'template_start_questionnaire') as starts,
        COUNT(*) FILTER (WHERE event_type = 'template_complete') as completions,
        COUNT(*) FILTER (WHERE event_type = 'template_download') as downloads,
        AVG(EXTRACT(epoch FROM completed_at - started_at)) as avg_completion_time
      FROM analytics_events 
      WHERE template_id = $1 
        AND timestamp >= $2 
        AND timestamp <= $3
      GROUP BY jurisdiction
    `, [templateId, dateRange.from, dateRange.to]);
    
    return {
      template_id: templateId,
      date_range: dateRange,
      by_jurisdiction: metrics.map(m => ({
        jurisdiction: m.jurisdiction,
        views: parseInt(m.views),
        starts: parseInt(m.starts),
        completions: parseInt(m.completions),
        downloads: parseInt(m.downloads),
        conversion_rate: m.starts > 0 ? (m.completions / m.starts) * 100 : 0,
        avg_completion_time: parseFloat(m.avg_completion_time) || 0
      }))
    };
  }
}
```

---
