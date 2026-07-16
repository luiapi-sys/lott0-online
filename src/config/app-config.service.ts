import { Injectable } from '@nestjs/common';

export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  bcryptRounds: number;
}

@Injectable()
export class AppConfigService {
  getAppConfig(): AppConfig {
    return {
      port: Number(process.env.PORT ?? 3100),
      databaseUrl: process.env.DATABASE_URL ?? '',
      jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access',
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh',
      bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 12),
    };
  }
}
