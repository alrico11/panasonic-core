import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { CHANNEL_SENDER_DISPATCHER, NatsChannelPayload } from '@tcid/core/nats/nats.interface';
import { WhatsAppPayload } from './whatsapp/whatsapp.entity';
import { WorkerSenderService } from './worker-sender.service';
import { Logger } from '@nestjs/common';

@Controller()
export class WhatsAppConsumerController {
  private readonly logger = new Logger(WhatsAppConsumerController.name);
  constructor(private readonly workerSenderService: WorkerSenderService) {}

  /**
   * Handle WhatsApp channel dispatch messages. Delegates to WorkerSenderService.
   * Always ack to avoid redelivery storms; warns only when payload invalid.
   */
  @EventPattern(CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_WHATSAPP)
  async channelWhatsApp(
    @Payload() dataMessage: NatsChannelPayload<WhatsAppPayload>,
    @Ctx() context: NatsJetStreamContext,
  ) {
    try {
      const payload = (dataMessage as any)?.data ?? dataMessage;
      if (!payload) {
        this.logger.warn('[WHATSAPP][CONSUMER] empty payload');
        throw new Error('empty payload');
      }
      await this.workerSenderService.process(payload);
      context?.message?.ack?.();
    } catch (error) {
      this.logger.error('[WHATSAPP][CONSUMER] error processing payload', error);
      return context?.message?.nak?.();
    }
  }
}
