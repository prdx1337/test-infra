import { EachMessagePayload } from 'kafkajs';
import { createKafkaInstance } from './kafka.client';

const RETRY_DELAY_MS = 5000;

export async function startKafkaConsumer(
  clientId: string,
  groupId: string,
  topic: string,
  handler: (data: unknown, meta: { topic: string; partition: number; offset: string }) => Promise<unknown>,
): Promise<void> {
  const consumer = createKafkaInstance(clientId).consumer({ groupId });

  const tryConnect = async (): Promise<void> => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          const raw = message.value!.toString();
          const data = JSON.parse(raw);
          const meta = { topic, partition, offset: message.offset };

          console.log(`[${clientId}] consumed from topic="${topic}" partition=${partition} offset=${message.offset}`);
          console.log(`[${clientId}] payload:`, data);

          await handler(data, meta);
        },
      });
    } catch (err: any) {
      if (err?.retriable) {
        console.warn(`[${clientId}] retriable error, retrying in ${RETRY_DELAY_MS}ms:`, err.message);
        await consumer.disconnect().catch(() => {});
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        return tryConnect();
      }
      console.error(`[${clientId}] fatal Kafka error:`, err);
      process.exit(1);
    }
  };

  await tryConnect();
}
