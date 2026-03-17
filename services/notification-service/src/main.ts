import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startKafkaConsumer } from './kafka/kafka.consumer';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);

  await app.listen(process.env.PORT ?? 3000);

  startKafkaConsumer(
    'notification-service-consumer',
    'notification-service',
    'payment.completed',
    (data) => appService.handlePaymentCompleted(data as any),
  ).catch((err) => {
    console.error('[notification-service-consumer] fatal:', err);
    process.exit(1);
  });
}
bootstrap();
