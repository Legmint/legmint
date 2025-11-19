import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

// Import configuration
import { getDatabaseConfig } from './config/database.config';

// Import controllers
import {
  GenerationController,
  ReferralController,
  PacksController,
  TemplatesController,
  QuestionnairesController,
  PurchaseController,
  UsersController,
  LawyerController,
} from './controllers';

// Import entities
import * as entities from './entities';

// Import services
import {
  S3Service,
  AuditLogService,
  StripeService,
  TemplateService,
  GenerationService,
  LawyerService,
  EntitlementsService,
  RenderService,
} from './services';

// Import modules
import { PaymentsModule } from './payments/payments.module';
import { EmailModule } from './email/email.module';

// TODO: Import middleware when implemented
// import { PaywallMiddleware } from './middleware/paywall.middleware';

@Module({
  imports: [
    // Configuration module - loads .env files
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'authenticated',
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
      {
        name: 'unauthenticated',
        ttl: 60000,
        limit: 10, // 10 requests per minute
      },
    ]),

    // Database configuration (TypeORM) - conditionally registered
    ...(process.env.DATABASE_URL
      ? [
          TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
              getDatabaseConfig(configService),
          }),
          // Register entities for repository injection
          TypeOrmModule.forFeature([
            entities.User,
            entities.Subscription,
            entities.Template,
            entities.AuditLog,
            entities.Partner,
            entities.Referral,
            entities.LawyerApplication,
          ]),
        ]
      : []),

    // Payments module (Stripe integration)
    PaymentsModule,

    // Email module (SendGrid integration)
    EmailModule,

    // TODO: Add JWT authentication module
    // TODO: Add Passport module for authentication strategies
  ],

  controllers: [
    // Controllers that work without database
    PacksController,
    PurchaseController,
    UsersController,
    // Database-dependent controllers (only when DATABASE_URL is available)
    ...(process.env.DATABASE_URL
      ? [
          GenerationController,
          ReferralController,
          TemplatesController,
          QuestionnairesController,
          LawyerController,
        ]
      : []),
    // TODO: Add AdminController when needed
  ],

  providers: [
    // Services (always available)
    S3Service,
    StripeService,
    RenderService,
    // Database-dependent services (only when DATABASE_URL is available)
    ...(process.env.DATABASE_URL
      ? [
          AuditLogService,
          TemplateService,
          LawyerService,
          GenerationService,
          EntitlementsService,
        ]
      : []),
    // TODO: Add more services:
    // ReferralService,
    // UserService,
  ],
})
export class AppModule {}
