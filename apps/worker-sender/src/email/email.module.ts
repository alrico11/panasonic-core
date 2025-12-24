import { Logger, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

const EMAIL_TEMPLATES_DIR = join(__dirname, '..', '..', 'templates');
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MailerOptions => {
        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: Number(configService.get<number>('EMAIL_PORT') || 587),
            auth: {
              user: configService.get<string>('EMAIL_USER'),
              pass: configService.get<string>('EMAIL_PASS'),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.get<string>('EMAIL_SENDER')}>`,
          },
          // preview: true, // DEBUG
          template: {
            dir: EMAIL_TEMPLATES_DIR,
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  providers: [EmailService, Logger],
  exports: [EmailService],
})
export class EmailModule {}
