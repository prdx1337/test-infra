import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startKafkaConsumer } from './kafka/kafka.consumer';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);

  await app.listen(process.env.PORT ?? 3000);

  startKafkaConsumer(
    'payment-service-consumer',
    'payment-service',
    'order.created',
    (data) => appService.handleOrderCreated(data as any),
  ).catch((err) => {
    console.error('[payment-service-consumer] fatal:', err);
    process.exit(1);
  });
}
bootstrap();
