import { NestFactory } from '@nestjs/core';
import { TechnicianPortalModule } from './technician-portal.module';
import { Logger, type INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { CoreInterceptor, ExceptionHandler } from '@lib';
import { HttpAdapterHost } from '@nestjs/core';

function setupOpenApi(app: INestApplication) {
  const creds = process.env['APIDOCS_CREDS'] ?? 'ApiDocsSecret'
  const apiDocsPrefix = process.env['APIDOCS_PREFIX'] ?? '/docs'
  Logger.debug(`Setup OpenApi on ${apiDocsPrefix} with creds u: ${creds}, p: ${creds}`, 'SetupOpenApi')
  const config = new DocumentBuilder()
    .setTitle('Technician Portal API')
    .setDescription('Technician Portal API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  app.use(
    `${apiDocsPrefix}/*any`, // Protect Swagger
    expressBasicAuth({
      challenge: true,
      users: { [creds]: creds },
    }),
  );
  SwaggerModule.setup(apiDocsPrefix, app, documentFactory);

}

async function bootstrap() {
  // Set APP_NAME for interceptor (can be overridden by environment variable)
  process.env.APP_NAME = process.env.APP_NAME || 'technician-portal';
  
  const app = await NestFactory.create(TechnicianPortalModule);
  const port = process.env.PORT || 4003;

  // Enable swagger on non-production
  if (process.env.NODE_ENV !== 'production') {
    Logger.warn(`Application running in NON-PRODUCTION mode.`)
    setupOpenApi(app)
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new ExceptionHandler(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new CoreInterceptor());
  app.enableCors({
    origin: process.env.FE_URL,
    credentials: true,
  });
  await app.listen(port);
  console.log(`🚀 Technician Portal API running on http://localhost:${port}`);
}
bootstrap();
