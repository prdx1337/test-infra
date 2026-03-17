import { Kafka, Producer } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS ?? 'host.docker.internal:9092').split(',');

export function createKafkaInstance(clientId: string): Kafka {
  return new Kafka({ clientId, brokers });
}

export async function getKafkaProducer(clientId: string): Promise<Producer> {
  const producer = createKafkaInstance(clientId).producer();
  await producer.connect();
  return producer;
}
