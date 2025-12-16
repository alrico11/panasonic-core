import { NestFactory } from '@nestjs/core';
import { CustomerPortalModule } from './customer-portal.module';
import { Logger, ValidationPipe, type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import type express from 'express';
import { parse } from 'qs';

function setupOpenApi(app: INestApplication) {
  const creds = process.env['APIDOCS_CREDS'] ?? 'ApiDocsSecret'
  const apiDocsPrefix = process.env['APIDOCS_PREFIX'] ?? '/docs'
  Logger.debug(`Setup OpenApi on ${apiDocsPrefix} with creds u: ${creds}, p: ${creds}`, 'SetupOpenApi')
  const config = new DocumentBuilder()
    .setTitle('Customer Portal API')
    .setDescription('Customer Portal API description')
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
  const app = await NestFactory.create(CustomerPortalModule);
  const port = process.env.PORT || 4001;

  const instance: express.Application = app.getHttpAdapter().getInstance()
  instance.set('query parser', (str) => parse(str, { arrayLimit: 100 }));

  // Enable swagger on non-production
  if (process.env.NODE_ENV !== 'production') {
    Logger.warn(`Application running in NON-PRODUCTION mode.`)
    setupOpenApi(app)

    // Trust proxy from local network
    // instance.set('trust proxy', process.env.INTERNAL_IPS || 'loopback,uniquelocal')
    // Enable pretty JSON
    instance.set('json spaces', 2)
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: process.env.FE_URL,
    credentials: true,
  });
  await app.listen(port);
  console.log(`🚀 Customer Portal API running on http://localhost:${port}`);
  console.log(`Updated CORS Origin: ${process.env.FE_URL}`);
}
bootstrap();
