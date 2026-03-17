import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producer } from 'kafkajs';
import { getKafkaProducer } from './kafka/kafka.client';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderCreatedEvent } from './events/order-created.event';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async onModuleInit() {
    this.producer = await getKafkaProducer('order-service');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(orderId: string, userId: string, amount: number, items: any[]) {
    const order = new this.orderModel({ orderId, userId, amount, items });
    await order.save();

    const event = new OrderCreatedEvent(orderId, userId, amount, items);
    await this.producer.send({
      topic: 'order.created',
      messages: [{ value: JSON.stringify(event) }],
    });
    return { orderId, status: 'created' };
  }
}
