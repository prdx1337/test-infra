import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderCreatedEvent } from './events/order-created.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async handleOrderCreated(data: OrderCreatedEvent) {
    return this.appService.handleOrderCreated(data);
  }
}
