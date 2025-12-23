import { Logger, Module } from '@nestjs/common';
// import { ScheduleModule } from '@nestjs/schedule';
import { WorkerSenderController } from './worker-sender.controller';
import { WorkerSenderService } from './worker-sender.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { RedisModule, RedisModuleOptions } from '@nestjs-redis';
// import Redis from 'ioredis';
import { NatsModule } from '@lib';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { NatsService } from '@lib';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ScheduleModule.forRoot(),
    // RedisModule.forRootAsync({
    //   useFactory: (
    //     configService: ConfigService,
    //     logger: Logger,
    //   ): RedisModuleOptions => {
    //     const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
    //     const redisTLS = configService.get<string>('REDIS_TLS') === 'true';
    //     const defaultConfig: RedisModuleOptions = {
    //       host: configService.get<string>('REDIS_HOST') as string,
    //       port: Number(configService.get<string>('REDIS_PORT')),
    //       db: Number(configService.get<string>('REDIS_DB')),
    //       keyPrefix: configService.get<string>('REDIS_KEY_PREFIX') || '',
    //       onClientReady: (client: Redis) => {
    //         return client.on('error', (err) =>
    //           logger.error(err, 'REDIS CHANNEL SENDER DISPATCHER'),
    //         );
    //       },
    //       retryStrategy: (times: number): number => {
    //         logger.warn(
    //           times,
    //           'RETRY REDIS CHANNEL SENDER DISPATCHER CONNECTION',
    //         );
    //         const delay = Math.min(times * 50, 2000);
    //         return delay;
    //       },
    //     };
    //     if (['test', 'development', 'staging'].includes(nodeEnv) && !redisTLS) {
    //       return defaultConfig;
    //     } else {
    //       return Object.assign(defaultConfig, {
    //         tls: {
    //           rejectUnauthorized: false,
    //         },
    //         username: configService.get<string>('REDIS_USERNAME'),
    //         password: configService.get<string>('REDIS_PASSWORD'),
    //       }) as RedisModuleOptions;
    //     }
    //   },
    //   inject: [ConfigService, Logger],
    // }),
    NatsModule,
    EmailModule,

  ],
  controllers: [WorkerSenderController],
  providers: [Logger,
    WorkerSenderService,
    EmailService,
    WhatsAppService,
    NatsService,
  ],
  exports: [
    WorkerSenderService,
    EmailService,
    WhatsAppService,
    NatsService,
  ],
})
export class WorkerSenderModule { }
