import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producer } from 'kafkajs';
import { getKafkaProducer } from './kafka/kafka.client';
import { PaymentCompletedEvent, NotificationSentEvent } from './events/payment-completed.event';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  async onModuleInit() {
    this.producer = await getKafkaProducer('notification-service');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async handlePaymentCompleted(data: PaymentCompletedEvent) {
    const message = `Payment completed for order ${data.orderId}`;
    const notification = new this.notificationModel({ userId: 'user-id', message, type: 'email' });
    await notification.save();

    const event = new NotificationSentEvent('user-id', message, 'email');
    await this.producer.send({
      topic: 'notification.sent',
      messages: [{ value: JSON.stringify(event) }],
    });
    return { status: 'sent' };
  }
}
