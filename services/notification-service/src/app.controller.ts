import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentCompletedEvent } from './events/payment-completed.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async handlePaymentCompleted(data: PaymentCompletedEvent) {
    return this.appService.handlePaymentCompleted(data);
  }
}
