import { QueueOptions } from 'bullmq';
import config from 'config';

export enum Queues {
  TRANSACTION = 'transaction',
}

const queueOptions: QueueOptions = {
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
  connection: {
    // redis server connection options
    host: process.env.REDIS_HOST ?? config.get<string>('queue.host'),
    port: process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT)
      : config.get<number>('queue.port'),
  },
};

export const QueueToConfigMap: Record<Queues, QueueOptions> = {
  [Queues.TRANSACTION]: { ...queueOptions },
};

export enum TransactionJobTypes {
  PROCESS_TRANSACTION = 'PROCESS_TRANSACTION',
}
