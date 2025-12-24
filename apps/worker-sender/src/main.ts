import { NestFactory } from '@nestjs/core';
import { WorkerSenderModule } from './worker-sender.module';
import { Module } from '@nestjs/common';
import { EmailConsumerController } from './email-consumer.controller';
import { WhatsAppConsumerController } from './whatsapp-consumer.controller';
import { CHANNEL_SENDER_DISPATCHER } from '@lib';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { RetentionPolicy, StorageType } from 'nats';

// Feature modules that include only one consumer controller each
@Module({
  imports: [WorkerSenderModule],
  controllers: [EmailConsumerController],
})
class EmailConsumerModule { }

@Module({
  imports: [WorkerSenderModule],
  controllers: [WhatsAppConsumerController],
})
class WhatsAppConsumerModule { }

async function bootstrap() {
  // EMAIL microservice (push consumer)
  const emailMs = await NestFactory.createMicroservice(
    EmailConsumerModule,
    {
      strategy: new NatsJetStreamServer({
        connectionOptions: {
          servers: process.env.NATS_URL as string,
          name: 'worker-sender-email-connection',
        },
        consumerOptions: {
          durable: 'base-worker-email', //process.env.NATS_DURABLE_EMAIL ||
          deliverGroup: 'base-worker-queue', //process.env.NATS_QUEUE_EMAIL || 
          deliverTo: 'INBOX.worker.email', //process.env.NATS_DELIVER_EMAIL || 
          manualAck: true,
          filterSubject: CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_EMAIL,
          maxAckPending: 100,
          maxDeliver: 10,
        },
        streamConfig: {
          name: CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_EMAIL,
          subjects: [CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_EMAIL],
          retention: RetentionPolicy.Workqueue,
          storage: StorageType.File,
          max_age: 259200000000000, // 3 days
          max_msgs: 10000,
          allow_direct: true,
          duplicate_window: 300000000000, // 5 minutes
        },
      }),
    },
  );

  // WHATSAPP microservice (push consumer)
  const whatsappMs = await NestFactory.createMicroservice(
    WhatsAppConsumerModule,
    {
      strategy: new NatsJetStreamServer({
        connectionOptions: {
          servers: process.env.NATS_URL as string,
          name: 'worker-sender-whatsapp-connection',
        },
        consumerOptions: {
          durable: 'base-worker-whatsapp', //process.env.NATS_DURABLE_WHATSAPP || 
          deliverGroup: 'base-worker-queue', //process.env.NATS_QUEUE_WHATSAPP || process.env.NATS_QUEUE_EMAIL || 
          deliverTo: 'INBOX.worker.whatsapp', //process.env.NATS_DELIVER_WHATSAPP || 
          manualAck: true,
          filterSubject: CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_WHATSAPP,
          maxAckPending: 100,
          maxDeliver: 10,
        },
        streamConfig: {
          name: CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_WHATSAPP,
          subjects: [CHANNEL_SENDER_DISPATCHER.CHANNEL_SEND_WHATSAPP],
          retention: RetentionPolicy.Workqueue,
          storage: StorageType.File,
          max_age: 259200000000000, // 3 days
          max_msgs: 10000,
          allow_direct: true,
          duplicate_window: 300000000000, // 5 minutes
        },
      }),
    },
  );

  emailMs.enableShutdownHooks();
  whatsappMs.enableShutdownHooks();
  await Promise.all([emailMs.listen(), whatsappMs.listen()]);
}

void bootstrap();
