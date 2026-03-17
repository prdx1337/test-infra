import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('users')
  async createUser(
    @Body() body: { userId: string; email: string; name: string },
  ) {
    return this.appService.createUser(body.userId, body.email, body.name);
  }
}
