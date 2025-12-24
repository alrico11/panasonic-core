import { NestFactory } from '@nestjs/core';
import { PartnerPortalModule } from './partner-portal.module';
import { Logger, ValidationPipe, type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import type express from 'express';
import { parse } from 'qs';
import { CoreInterceptor, ExceptionHandler } from '@lib';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomStrategy, MicroserviceOptions } from '@nestjs/microservices';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

function setupOpenApi(app: INestApplication) {
  const creds = process.env['APIDOCS_CREDS'] ?? 'ApiDocsSecret'
  const apiDocsPrefix = process.env['APIDOCS_PREFIX'] ?? '/docs'
  Logger.debug(`Setup OpenApi on ${apiDocsPrefix} with creds u: ${creds}, p: ${creds}`, 'SetupOpenApi')
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

function setupMicroservice(app: INestApplication) {
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: process.env.NATS_URL as string,
        name: `cakrawala-hub-partner-portal-connection`,
      },
      consumerOptions: {
        durable: `app-partner-portal`,
        deliverGroup: `cakrawala-hub-partner-portal-queue`,
        deliverTo: `INBOX.cakrawala-hub-partner-portal.sync`,
        manualAck: true,
        maxAckPending: 10,
        maxDeliver: 10,
      },
      streamConfig: [
        // {
        //   name: CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_EMAIL,
        //   subjects: [CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_EMAIL],
        //   retention: RetentionPolicy.Workqueue,
        //   storage: StorageType.File,
        //   max_age: 259200000000000, // 3 days
        //   max_msgs: 10000,
        //   allow_direct: true,
        //   duplicate_window: 300000000000, // 5 minutes
        // },
        // {
        //   name: CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_WHATSAPP,
        //   subjects: [CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_WHATSAPP],
        //   retention: RetentionPolicy.Workqueue,
        //   storage: StorageType.File,
        //   max_age: 259200000000000, // 3 days
        //   max_msgs: 10000,
        //   allow_direct: true,
        //   duplicate_window: 300000000000, // 5 minutes
        // }
      ],
    }),
  } as CustomStrategy);
  return microservice;
}

async function bootstrap() {
  // Set APP_NAME for interceptor (can be overridden by environment variable)
  process.env.APP_NAME = process.env.APP_NAME || 'partner-portal';

  const app = await NestFactory.create(PartnerPortalModule);
  const port = process.env.PORT || 4002;

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

  const microservice = setupMicroservice(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new ExceptionHandler(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new CoreInterceptor());
  app.enableCors({
    origin: process.env.FE_URL,
    credentials: true,
  });
  microservice.listen().then(() => {
    const IS_PROD = (process.env.ENV || process.env.NODE_ENV) == 'production';
    Logger.log('NATS Microservice started successfully environment ' + IS_PROD ? 'production' : 'development');
  }).catch(error => {
    Logger.error('Failed to start microservice:', error);
  });
  await app.listen(port);
  console.log(`Partner Portal API running on http://localhost:${port}`);
}
bootstrap();
