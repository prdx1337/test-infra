import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('orders')
  async createOrder(@Body() body: { userId: string; amount: number; items: any[] }) {
    const orderId = `order-${Date.now()}`;
    return this.appService.createOrder(orderId, body.userId, body.amount, body.items);
  }
}
