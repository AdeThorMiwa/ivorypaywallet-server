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
    host: config.get<string>('queue.host'),
    port: config.get<number>('queue.port'),
  },
};

export const QueueToConfigMap: Record<Queues, QueueOptions> = {
  [Queues.TRANSACTION]: { ...queueOptions },
};

export enum TransactionJobTypes {
  PROCESS_TRANSACTION = 'PROCESS_TRANSACTION',
}
