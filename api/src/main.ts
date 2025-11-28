import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Run database migrations on startup
 * This ensures the database schema is up to date
 */
async function runMigrations(dataSource: DataSource, logger: any) {
  if (!dataSource?.isInitialized) {
    logger.log('Database not connected, skipping migrations');
    return;
  }

  // Try multiple possible locations for migrations
  const possibleDirs = [
    path.join(__dirname, 'migrations'),           // dist/migrations (copied by nest build)
    path.join(__dirname, '..', 'migrations'),     // api/migrations (development)
    path.join(process.cwd(), 'migrations'),       // cwd/migrations
  ];

  let migrationsDir: string | null = null;
  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      migrationsDir = dir;
      logger.log(`Found migrations directory at: ${dir}`);
      break;
    }
  }

  if (!migrationsDir) {
    logger.warn('Migrations directory not found in any expected location');
    logger.warn(`Searched: ${possibleDirs.join(', ')}`);
    return;
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  logger.log(`Found ${migrationFiles.length} migration files`);

  for (const file of migrationFiles) {
    try {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await dataSource.query(sql);
      logger.log(`Migration ${file} applied successfully`);
    } catch (error) {
      // Ignore "already exists" errors
      if (!error.message?.includes('already exists') &&
          !error.message?.includes('duplicate key') &&
          !error.message?.includes('violates check constraint')) {
        logger.error(`Migration ${file} failed: ${error.message}`);
      } else {
        logger.log(`Migration ${file}: already applied or constraint exists`);
      }
    }
  }
}

async function bootstrap() {
  // Configure logging
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger,
    rawBody: true, // Enable raw body for webhook signature verification
  });

  const configService = app.get(ConfigService);

  // Run database migrations on startup
  try {
    logger.log('Attempting to run database migrations...');
    const dataSource = app.get(DataSource);
    logger.log(`DataSource initialized: ${dataSource?.isInitialized}`);
    await runMigrations(dataSource, logger);
    logger.log('Database migrations completed');
  } catch (error) {
    logger.warn(`Database migrations skipped: ${error.message}`);
    logger.warn(`Full error: ${JSON.stringify(error)}`);
  }

  // Security middleware
  app.use(helmet());

  // Compression middleware
  app.use(compression());

  // CORS configuration
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', 'http://localhost:3001')
    .split(',')
    .map(origin => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Swagger API documentation (only in non-production)
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Legmint API')
      .setDescription(
        'API for Legmint - Legal docs, minted for startups. Interactive legal template generation with paywall, guided questionnaire flow, and attorney referral system.',
      )
      .setVersion('1.0.0')
      .setContact(
        'Legmint Support',
        'https://legmint.com',
        'support@legmint.com',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from authentication flow',
        },
        'BearerAuth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'Partner API key for webhooks',
        },
        'ApiKeyAuth',
      )
      .addServer('http://localhost:3000/v1', 'Local Development')
      .addServer('https://api-staging.legmint.com/v1', 'Staging')
      .addServer('https://api.legmint.com/v1', 'Production')
      .addTag('Packs', 'Template pack catalog and listing')
      .addTag('Templates', 'Template metadata (no raw content)')
      .addTag('Questionnaires', 'Guided questionnaire flow')
      .addTag('Generation', 'Template rendering and document generation')
      .addTag('Purchase', 'Subscription and payment')
      .addTag('Referrals', 'Attorney referral system')
      .addTag('Users', 'User account management')
      .addTag('Admin', 'Admin operations (internal only)')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      customSiteTitle: 'Legmint API Documentation',
      customfavIcon: 'https://legmint.com/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });
  }

  // Health check endpoint
  app.getHttpAdapter().get('/v1/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.get('NODE_ENV'),
    });
  });

  // Database status endpoint for debugging
  app.getHttpAdapter().get('/v1/db-status', async (req, res) => {
    try {
      const dataSource = app.get(DataSource);
      const isInitialized = dataSource?.isInitialized;

      let tables = [];
      if (isInitialized) {
        const result = await dataSource.query(`
          SELECT tablename FROM pg_tables WHERE schemaname = 'public'
        `);
        tables = result.map((r: any) => r.tablename);
      }

      res.status(200).json({
        database_connected: isInitialized,
        tables,
        migrations_dir_exists: fs.existsSync(path.join(__dirname, 'migrations')),
        migrations_dir: path.join(__dirname, 'migrations'),
        cwd: process.cwd(),
        dirname: __dirname,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        database_connected: false,
      });
    }
  });

  // Manual migration trigger endpoint
  app.getHttpAdapter().post('/v1/run-migrations', async (req, res) => {
    try {
      const dataSource = app.get(DataSource);
      await runMigrations(dataSource, logger);

      const result = await dataSource.query(`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `);
      const tables = result.map((r: any) => r.tablename);

      res.status(200).json({
        success: true,
        tables,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        success: false,
      });
    }
  });

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 Legmint API is running on: http://localhost:${port}/v1`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  logger.log(`🏥 Health Check: http://localhost:${port}/v1/health`);
}

bootstrap();
