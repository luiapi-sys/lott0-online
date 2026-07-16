import pino from 'pino';

const redact = [
  'req.headers.authorization',
  'req.headers.cookie',
  'password',
  'secret',
  'token',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

export class AppLogger {
  private readonly logger: pino.Logger;

  constructor() {
    const isProd = process.env.NODE_ENV === 'production';
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? 'info',
      redact,
      ...(isProd
        ? {}
        : {
            transport: {
              target: 'pino-pretty',
              options: { colorize: true, singleLine: false },
            },
          }),
    });
  }

  log(message: string, context?: string): void {
    this.logger.info({ context }, message);
  }
  warn(message: string, context?: string): void {
    this.logger.warn({ context }, message);
  }
  error(message: string, context?: string, err?: unknown): void {
    this.logger.error({ context, err }, message);
  }
  debug(message: string, context?: string): void {
    this.logger.debug({ context }, message);
  }
}
