import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Subscription } from '../entities/subscription.entity';
import { Template } from '../entities/template.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { Partner } from '../entities/partner.entity';
import { Referral } from '../entities/referral.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get('NODE_ENV', 'development');
  const databaseUrl = configService.get('DATABASE_URL');

  if (!databaseUrl) {
    console.warn('DATABASE_URL is not defined - database features will be unavailable');
    // Return a minimal config that won't attempt to connect
    return {
      type: 'postgres',
      url: 'postgresql://localhost:5432/temp',
      retryAttempts: 0,
      autoLoadEntities: false,
      synchronize: false,
    } as TypeOrmModuleOptions;
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    ssl:
      configService.get('DATABASE_SSL') === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : false,
    entities: [User, Subscription, Template, AuditLog, Partner, Referral],
    synchronize: nodeEnv === 'development', // WARNING: Never use in production
    logging: nodeEnv === 'development',
    retryAttempts: 3, // Reduced retry attempts
    poolSize: parseInt(configService.get('DATABASE_POOL_MAX', '10')),
    extra: {
      max: parseInt(configService.get('DATABASE_POOL_MAX', '10')),
      min: parseInt(configService.get('DATABASE_POOL_MIN', '2')),
    },
  };
};
