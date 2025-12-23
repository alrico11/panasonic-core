import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { NatsChannelPayload, CHANNEL_DISPATCHER_TYPE, NATS_CHANNEL_ACTION } from '@lib';
import {
  isActivationUser,
  isResetPassword,
  isSurveyOtpWeb,
  isUnhappyCustomerSurveyReport,
  isUnhappyCustomerNotification,
  isUnhappyCustomerSurveyReportItem,
  NatsPayloadChannelSender,
  isExport,
} from './email/email.entity';
import { WhatsAppPayload } from './whatsapp/whatsapp.entity';

@Injectable()
export class WorkerSenderService {
  constructor(
    private readonly emailService: EmailService,
    private readonly whatsAppService: WhatsAppService,
    private readonly logger: Logger,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async processEmail(
    natsPayload: NatsChannelPayload<NatsPayloadChannelSender>,
  ): Promise<void> {
    this.logger.log(`[EMAIL PAYLOAD]: ${JSON.stringify(natsPayload)}`);
    this.logger.log(`email.action=${natsPayload.action}`);

    if (natsPayload.action === NATS_CHANNEL_ACTION.EXPORT) {
      this.logger.debug(`export ${isExport(natsPayload.payload)}`);
      if (isExport(natsPayload.payload)) {
        await this.emailService.sendExportFile(
          natsPayload.to as string,
          natsPayload.subject as string,
          natsPayload.payload,
        );
      } else {
        this.logger.warn('EMAIL action EXPORT but payload is not Export shape');
      }
      return;
    }
    if (natsPayload.action === NATS_CHANNEL_ACTION.ACTIVATION_USER) {
      this.logger.debug(`isActivationUser ${isActivationUser(natsPayload.payload)}`);
      if (isActivationUser(natsPayload.payload)) {
        await this.emailService.sendActivationUser(
          natsPayload.to as string,
          natsPayload.subject as string,
          natsPayload.payload,
        );
      } else {
        this.logger.warn('EMAIL action ACTIVATION_USER but payload is not ActivationUser shape');
      }
      return;
    }
    if (natsPayload.action === NATS_CHANNEL_ACTION.RESET_PASSWORD) {
      this.logger.debug(`isResetPassword ${isResetPassword(natsPayload.payload)}`);
      if (isResetPassword(natsPayload.payload)) {
        await this.emailService.sendResetPassword(
          natsPayload.to as string,
          natsPayload.subject as string,
          natsPayload.payload,
        );
      } else {
        this.logger.warn('EMAIL action RESET_PASSWORD but payload is not ResetPassword shape');
      }
      return;
    }
    if (natsPayload.action === NATS_CHANNEL_ACTION.SURVEY_OTP_WEB) {
      this.logger.debug(`isSurveyOtpWeb ${isSurveyOtpWeb(natsPayload.payload)}`);
      if (isSurveyOtpWeb(natsPayload.payload)) {
        await this.emailService.sendSurveyOtpWeb(
          natsPayload.to as string,
          natsPayload.subject as string,
          natsPayload.payload,
        );
      } else {
        this.logger.warn('EMAIL action SURVEY_OTP_WEB but payload is not SurveyOtpWeb shape');
      }
      return;
    }
    if (natsPayload.action === NATS_CHANNEL_ACTION.UNHAPPY_CUSTOMER_SURVEY_REPORT) {
      this.logger.debug(`isUnhappyCustomerSurveyReport ${isUnhappyCustomerSurveyReport(natsPayload.payload)}`);
      if (isUnhappyCustomerSurveyReport(natsPayload.payload)) {
        await this.emailService.sendUnhappyCustomerSurvey(
          natsPayload.to as string,
          natsPayload.subject as string,
          natsPayload.payload,
        );
      } else {
        this.logger.warn('EMAIL action UNHAPPY_CUSTOMER_SURVEY but payload is not UnhappyCustomerSurvey shape');
      }
      return;
    }

    if (isExport(natsPayload.payload)) {
      await this.emailService.sendExportFile(
        natsPayload.to as string,
        natsPayload.subject as string,
        natsPayload.payload,
      );
    } else if (isActivationUser(natsPayload.payload)) {
      await this.emailService.sendActivationUser(
        natsPayload.to as string,
        natsPayload.subject as string,
        natsPayload.payload,
      );
    } else if (isResetPassword(natsPayload.payload)) {
      await this.emailService.sendResetPassword(
        natsPayload.to as string,
        natsPayload.subject as string,
        natsPayload.payload,
      );
    } else if (isSurveyOtpWeb(natsPayload.payload)) {
      await this.emailService.sendSurveyOtpWeb(
        natsPayload.to as string,
        natsPayload.subject as string,
        natsPayload.payload,
      );
    } else if (isUnhappyCustomerNotification(natsPayload.payload)) {
      await this.emailService.sendUnhappyCustomerNotification(
        natsPayload.to as string,
        natsPayload.subject as string,
        natsPayload.payload,
      );
    } else if (isUnhappyCustomerSurveyReport(natsPayload.payload)) {
      await this.emailService.sendUnhappyCustomerSurvey(
        natsPayload.to as string,
        natsPayload.subject as string,
        natsPayload.payload,
      );
    } else {
      this.logger.warn('EMAIL payload did not match known actions or type guards');
    }
  }

  async processWhatsApp(
    natsPayload: NatsChannelPayload<WhatsAppPayload>,
  ): Promise<void> {
    this.logger.log(`[WHATSAPP PAYLOAD]: ${JSON.stringify(natsPayload)}`);
    if (!natsPayload.action && (natsPayload.payload as any)?.messageType === 'web_survey') {
      natsPayload.action = NATS_CHANNEL_ACTION.SURVEY_OTP_WEB as any;
    }
    this.logger.log(`whatsapp.action=${natsPayload.action}`);

    try {
      if (natsPayload.action === NATS_CHANNEL_ACTION.SURVEY_OTP_WEB) {
        const p: any = natsPayload.payload as any;
        if (p.messageType !== 'web_survey') {
          this.logger.warn('WA SURVEY_OTP_WEB expects messageType="web_survey"');
        }
        if (!p.webSurveyCode) {
          this.logger.warn('WA SURVEY_OTP_WEB expects webSurveyCode in payload');
        }
        if (!p.otpCode) {
          this.logger.warn('WA SURVEY_OTP_WEB: otpCode not provided; template will render without OTP');
        }
      }
      const dealerId = natsPayload.payload.dealerId;
      if (!dealerId) {
        this.logger.error('DealerId not found in WhatsApp payload');
        throw new Error('DealerId is required');
      }

      const result = await this.whatsAppService.sendWhatsAppMessage(
        natsPayload.to as string,
        natsPayload.payload,
      );

      if (result.status === 'error') {
        throw new Error(result.error);
      }

      this.logger.log(`WhatsApp message sent successfully to ${natsPayload.to}`);
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${natsPayload.to}:`, error);
      throw error;
    }
  }

  async process(
    natsPayload: NatsChannelPayload<NatsPayloadChannelSender | WhatsAppPayload>,
  ): Promise<void> {
    this.logger.log(`[RETRIEVE PAYLOAD]: Channel=${natsPayload.channel}, To=${natsPayload.to}`);

    try {
      if (natsPayload.channel === CHANNEL_DISPATCHER_TYPE.EMAIL) {
        await this.processEmail(natsPayload as NatsChannelPayload<NatsPayloadChannelSender>);
      } else if (natsPayload.channel === CHANNEL_DISPATCHER_TYPE.WHATSAPP) {
        await this.processWhatsApp(natsPayload as NatsChannelPayload<WhatsAppPayload>);
      } else {
        this.logger.error(`Unsupported channel type: ${natsPayload.channel}`);
        throw new Error(`Unsupported channel type: ${natsPayload.channel}`);
      }
    } catch (error) {
      this.logger.error('Failed to process message:', error);
      throw error;
    }
  }
}
