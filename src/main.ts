import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { GlobalExceptionFilter } from './shared/response/global-exception.filter';
import { ResponseTransformInterceptor } from './shared/response/response-transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const config = app.get(AppConfigService).getAppConfig();

  app.setGlobalPrefix('v1');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const swagger = new DocumentBuilder()
    .setTitle('lott0.online API')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  await app.listen(config.port);
  // eslint-disable-next-line no-console
  console.log(`lott0.online listening on :${config.port}`);
}

void bootstrap();
