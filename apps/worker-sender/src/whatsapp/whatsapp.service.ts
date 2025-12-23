import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
import {
  WhatsAppPayload,
  WhatsAppSurveyPayload,
  WhatsAppOTPPayload,
  QontakApiResponse,
  QontakMessageRequest,
  isSurveyMessage,
  isOTPMessage
} from './whatsapp.entity';
import axios from 'axios';
import { NatsService, NATS_SUBJECTS, QUOTA_ENVELOPE_SUBJECT } from '@lib';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly http: AxiosInstance;
  private readonly defaultDealerName?: string;
  private readonly isDryRun: boolean;

  constructor(
    private readonly configService: ConfigService,
    // private readonly vendorConfig: VendorConfigService,
    private readonly natsService: NatsService,
  ) {
    this.defaultDealerName = this.configService.get<string>('QONTAK_DEALER_NAME') || 'Suzuki';
    this.isDryRun = (this.configService.get<string>('DRY_RUN') || 'false') === 'true';
    this.http = null as unknown as AxiosInstance;
  }

  /**
   * Send WhatsApp message via Qontak. Uses Redis-loaded vendor config.
   * Emits quota.sync event (dry-run and live) for AMS to persist quota-log.
   * @param to - Recipient phone number
   * @param payload - WhatsApp payload
   * @returns Qontak API response
   * - OTP: send OTP via WhatsApp
   * - SURVEY_OTP_WEB: send survey URL and OTP via WhatsApp (if provided)
   */
  async sendWhatsAppMessage(to: string, payload: WhatsAppPayload): Promise<QontakApiResponse> {
    try {
      this.logger.debug(`[WA] send type=${payload.messageType} to=${to}`);
      // await this.vendorConfig.ensureLoaded();

      // const { templateId, channelIntegrationId } = this.vendorConfig.getTemplateAndChannel();
      // if (!templateId || !channelIntegrationId) {
      //   throw new Error('WhatsApp vendor template/channel not found');
      // }
      const baseUrl = this.configService.get<string>('WHATAPP_BASE_URL');
      const templateId = this.configService.get<string>('WHATSAPP_TEMPLATE_ID');
      const channelIntegrationId = this.configService.get<string>('WHATSAPP_CHANNEL_ID');
      const token = this.configService.get<string>('WHATSAPP_TOKEN');
      if (!templateId || !channelIntegrationId || !token) {
        throw new Error('WhatsApp vendor template/channel not found');
      }
      const endpoint = await this.configService.get('WHATSAPP_BLAST_ENDPOINT');
      if (!endpoint) {
        throw new Error('WhatsApp vendor endpoint not found');
      }
      const http = axios.create({
        baseURL: baseUrl || undefined,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: 15000,
      });
      const body = this.buildQontakBroadcastPayload(this.formatPhoneNumber(to), payload, templateId!, channelIntegrationId!);

      if (!body) {
        throw new Error('WhatsApp vendor body not found');
      }

      if (this.isDryRun) {
        const trxId = `dryrun-${Date.now()}`;
        this.logger.debug(`[WHATSAPP][DRY-RUN] ${endpoint.method} ${endpoint.url} headers=${JSON.stringify(endpoint.headers)} body=${JSON.stringify(body)}`);
        try {
          this.logger.debug('[QUOTA-LOG][DRY-RUN] emitted quota.sync');
        } catch (e) {
          this.logger.error('[QUOTA-LOG][DRY-RUN] Failed to emit quota.sync', e?.response?.data || e?.message || e);
        }

        return { status: 'success', data: { id: trxId, dryRun: true } as any };
      }

      const response = await http.request({ method: endpoint.method, url: endpoint.url, headers: endpoint.headers, data: body });
      const trxId = response.data?.data?.id || null;
      this.logger.log(`[QONTAK][OK] to=${to} trxId=${trxId || '-'} status=${response.data?.status}`);

      try {
        this.logger.debug('[QUOTA-LOG] emitted quota.sync');
      } catch (e) {
        this.logger.error('[QUOTA-LOG] Failed to emit quota.sync', e?.response?.data || e?.message || e);
      }

      return { status: 'success', data: response.data };

    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${to}: ${error?.response?.data?.message || error?.message || 'unknown error'}`);

      return {
        status: 'error',
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Build Qontak template broadcast payload using seeded template/channel config.
   * - OTP: Use otp from OTP message or from survey payload if provided (SURVEY_OTP_WEB case)
   */
  private buildQontakBroadcastPayload(toNumber: string, payload: WhatsAppPayload, templateId: string, channelIntegrationId: string) {
    const language = { code: 'id' };
    const name = (isSurveyMessage(payload) ? payload.customerName : (payload as any).customerName) || '';
    const dealer = this.defaultDealerName || 'Suzuki';
    const otp = isOTPMessage(payload)
      ? payload.otpCode
      : (isSurveyMessage(payload) && (payload as any).otpCode)
        ? (payload as any).otpCode
        : '-';
    const surveyUrlCode = isSurveyMessage(payload)
      ? `${(this.configService.get<string>('FE_URL') || this.configService.get<string>('FRONTEND_URL'))}/survey/${payload.webSurveyCode}`
      : '-';

    return {
      to_number: toNumber,
      to_name: name,
      message_template_id: templateId,
      channel_integration_id: channelIntegrationId,
      language,
      parameters: {
        body: [
          { key: '1', value: 'name', value_text: name },
          { key: '2', value: 'dealer', value_text: dealer },
          { key: '3', value: 'otp', value_text: otp },
          { key: '4', value: 'survey', value_text: surveyUrlCode },
        ],
        buttons: [
          { index: '0', type: 'url', value: surveyUrlCode },
        ],
      },
    };
  }

  /**
   * Normalize phone to MSISDN format (62xxxxxxxxxx).
   * - Remove all non-digit characters
   * - Handle Indonesian phone numbers
   *   - Replace leading 0 with 62
   *   - Add 62 prefix if not present
   */
  private formatPhoneNumber(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }

    return cleaned;
  }
}
