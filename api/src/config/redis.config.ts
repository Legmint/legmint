import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const getRedisConfig = (configService: ConfigService): RedisOptions => {
  const redisUrl = configService.get('REDIS_URL');

  if (!redisUrl) {
    throw new Error(
      'REDIS_URL is not defined in environment variables. Please check your .env file.',
    );
  }

  // Parse Redis URL (format: redis://[:password@]host:port)
  const url = new URL(redisUrl);

  return {
    host: url.hostname,
    port: parseInt(url.port) || 6379,
    password: url.password || undefined,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
  };
};
