import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producer } from 'kafkajs';
import { getKafkaProducer } from './kafka/kafka.client';
import { OrderCreatedEvent, PaymentCompletedEvent } from './events/order-created.event';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async onModuleInit() {
    this.producer = await getKafkaProducer('payment-service');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async handleOrderCreated(data: OrderCreatedEvent) {
    const paymentId = `payment-${Date.now()}`;
    const payment = new this.paymentModel({ paymentId, orderId: data.orderId, amount: data.amount });
    await payment.save();

    const event = new PaymentCompletedEvent(data.orderId, paymentId, data.amount);
    await this.producer.send({
      topic: 'payment.completed',
      messages: [{ value: JSON.stringify(event) }],
    });
    return { paymentId, status: 'completed' };
  }
}
