import { NestFactory } from '@nestjs/core';
import { PartnerPortalModule } from './partner-portal.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as expressBasicAuth from 'express-basic-auth';

function setupOpenApi(app: INestApplication) {
  const creds = process.env['APIDOCS_CREDS'] ?? 'ApiDocsSecret'
  const apiDocsPrefix = process.env['APIDOCS_PREFIX'] ?? '/api-docs'
  Logger.debug(`Setup OpenApi on ${apiDocsPrefix} with creds ${creds}`, 'SetupOpenApi')
  const config = new DocumentBuilder()
    .setTitle('Partner Portal API')
    .setDescription('Partner Portal API description')
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
  const app = await NestFactory.create(PartnerPortalModule);
  const port = process.env.PORT || 4002;

  if (process.env.NODE_ENV !== 'production') {
    Logger.warn(`Application running in NON-PRODUCTION mode.`)
    setupOpenApi(app)
  }

  await app.listen(port);
  console.log(`🚀 Partner Portal API running on http://localhost:${port}`);
}
bootstrap();
