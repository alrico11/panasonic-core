import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  IActivationUserTemplate,
  IResetPasswordTemplate,
  ISurveyOtpWebTemplate,
  IUnhappyCustomerSurveyReportTemplate,
  IUnhappyCustomerNotificationTemplate,
  IExportTemplate,
} from './email.entity';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

const EMAIL_TEMPLATES_DIR = join(__dirname, '..', '..', 'templates');

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private logger: Logger,
  ) { }

  async sendExportFile(
    to: string,
    subject: string,
    exportData: IExportTemplate,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: join(EMAIL_TEMPLATES_DIR, 'email-export'),
        context: {
          name: exportData.name,
          downloadUrl: exportData.downloadUrl,
          module: exportData.module,
          format: exportData.format,
          size: exportData.size,
          createdAt: exportData.createdAt,
        },
      });
      return true;
    } catch (err: unknown) {
      this.logger.error(
        `Failed to send export file email to ${to}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  async sendActivationUser(
    to: string,
    subject: string,
    userData: IActivationUserTemplate,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: join(EMAIL_TEMPLATES_DIR, 'email-verif'),
        context: {
          name: userData.name,
          verificationLink: userData.verificationLink,
          email: userData.email,
          password: userData.password,
        },
      });
      return true;
    } catch (err: unknown) {
      this.logger.error(
        `Failed to send verification email to ${to}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  async sendResetPassword(
    to: string,
    subject: string,
    userData: IResetPasswordTemplate,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: join(EMAIL_TEMPLATES_DIR, 'email-reset'),
        context: {
          name: userData.name,
          resetUrl: userData.resetUrl,
        },
      });
      return true;
    } catch (err: unknown) {
      this.logger.error(
        `Failed to send reset password email to ${to}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  async sendSurveyOtpWeb(
    to: string,
    subject: string,
    data: ISurveyOtpWebTemplate,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: join(EMAIL_TEMPLATES_DIR, 'email-survey-otp'),
        context: {
          name: data.name,
          otpCode: data.otpCode,
          surveyUrl: data.surveyUrl,
          dealerName: data.dealerName || 'Suzuki',
        },
      });
      return true;
    } catch (err: unknown) {
      this.logger.error(
        `Failed to send survey OTP email to ${to}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  async sendUnhappyCustomerSurvey(
    to: string,
    subject: string,
    data: IUnhappyCustomerSurveyReportTemplate[],
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: join(EMAIL_TEMPLATES_DIR, 'email-unhappy-customer-survey'),
        context: {
          data,
        },
      });
      return true;
    } catch (err: unknown) {
      this.logger.error(
        `Failed to send unhappy customer survey email to ${to}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  async sendUnhappyCustomerNotification(
    to: string,
    subject: string,
    data: IUnhappyCustomerNotificationTemplate,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: join(EMAIL_TEMPLATES_DIR, 'email-unhappy-notification'),
        context: {
          ...data
        },
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send unhappy customer notification to ${to}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
