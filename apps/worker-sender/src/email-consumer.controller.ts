import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { CHANNEL_SENDER_DISPATCHER, NatsChannelPayload } from '@tcid/core/nats/nats.interface';
import { NatsPayloadChannelSender } from './email/email.entity';
import { WorkerSenderService } from './worker-sender.service';
import { Logger } from '@nestjs/common';

@Controller()
export class EmailConsumerController {
  private readonly logger = new Logger(EmailConsumerController.name);
  constructor(private readonly workerSenderService: WorkerSenderService) {}

  /**
   * Handle Email channel dispatch messages. Delegates to WorkerSenderService.
   * Always ack to avoid redelivery; warns only when payload invalid.
   */
  @EventPattern(CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_EMAIL)
  async channelEmail(
    @Payload() dataMessage: NatsChannelPayload<NatsPayloadChannelSender>,
    @Ctx() context: NatsJetStreamContext,
  ) {
    try {
      const payload = (dataMessage as any)?.data ?? dataMessage;
      if (!payload) {
        this.logger.warn('[EMAIL][CONSUMER] empty payload');
        throw new Error('empty payload');
      }
      await this.workerSenderService.process(payload);
      context?.message?.ack?.();
    } catch (error) {
      this.logger.error('[EMAIL][CONSUMER] error processing payload', error);
      return context?.message?.nak?.();
    }
  }
}
