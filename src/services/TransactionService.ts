import { Inject, Service } from 'typedi';
import {
  InitiateTransactionPayload,
  IntitiateTransactionResponse,
  TransactionStatus,
} from '../interfaces/transactions';
import UserService from './UserService';
import { BadRequest, Forbidden, InternalServerError, NotFound } from 'http-errors';
import WalletService from './WalletService';
import Decimal from 'decimal.js';
import DatabaseService from './DatabaseService';
import { Transaction } from '../entities';
import { AppLogger } from '../utils';
import AppEventService from './AppEventService';
import { Job, Queue, Worker } from 'bullmq';
import { QueueToConfigMap, Queues, TransactionJobTypes } from '../constants/queue';
import { getPaginationConfig, paginateResponse } from '../utils/pagination';
import { FindManyOptions } from 'typeorm';

@Service()
class TransactionService {
  private readonly transactionRepository = DatabaseService.getInstance().getRepository(Transaction);
  private readonly transactionQueue = new Queue(Queues.TRANSACTION, QueueToConfigMap.transaction);
  private worker: Worker;

  constructor(
    @Inject() readonly userService: UserService,
    @Inject() readonly walletService: WalletService,
    @Inject() readonly appEventService: AppEventService,
  ) {
    this._setupQueueWorkers();
  }

  private _setupQueueWorkers() {
    this.worker = new Worker(
      Queues.TRANSACTION,
      async (job: Job<IntitiateTransactionResponse>) => {
        switch (job.name) {
          case TransactionJobTypes.PROCESS_TRANSACTION:
            await this._processNewTransaction(job.data.transactionId);
            break;
        }
      },
      { connection: QueueToConfigMap[Queues.TRANSACTION].connection },
    );

    this.worker.on('completed', (job: Job, value) => {
      AppLogger.info(
        `[TRANSACTION QUEUE] Completed job with data\n
            Data: ${job.asJSON().data}\n
            ID: ${job.id}\n
            Value: ${value}
          `,
      );
    });

    this.worker.on('failed', (job: Job | undefined, error: Error) => {
      AppLogger.error(
        `[TRANSACTION QUEUE] Failed job with data\n
            Data: ${job?.asJSON().data}\n
            ID: ${job?.id}\n
            Error: ${error}
          `,
      );
    });
  }

  public initiateTransaction = async (
    userId: string,
    payload: InitiateTransactionPayload,
  ): Promise<IntitiateTransactionResponse> => {
    const [sender, receiver] = await Promise.all([
      this.userService.getUserById(userId),
      this.userService.getUserByUsername(payload.to),
    ]);

    if (!receiver) {
      throw new BadRequest('Missing or invalid params');
    }

    const amount = new Decimal(payload.amount);
    const userHasEnoughBalance = await this.walletService.userHasEnoughWalletBalance(
      userId,
      amount,
    );

    if (!userHasEnoughBalance) {
      throw new Forbidden('Balance is too low');
    }

    const transaction = new Transaction();
    transaction.type = payload.type;
    transaction.status = TransactionStatus.CREATED;
    transaction.amount = amount;
    transaction.from = sender!;
    transaction.to = receiver.username;
    transaction.note = payload.note;

    try {
      await this.transactionRepository.save(transaction);

      const res = { transactionId: transaction.uid };
      // notify the system of the event
      this.transactionQueue.add(TransactionJobTypes.PROCESS_TRANSACTION, res);
      return res;
    } catch (e) {
      AppLogger.error('An error occured while trying to create transaction', e);
      throw new InternalServerError('Something went wrong');
    }
  };

  public getTransactions = async (
    userId: string | undefined,
    page?: number,
    limit?: number,
    desc = true,
  ) => {
    const [take, skip] = getPaginationConfig(page, limit);

    const query: FindManyOptions<Transaction> = {
      take,
      skip,
      order: { createdOn: desc ? 'DESC' : 'ASC' },
    };

    if (userId) {
      const user = await this.userService.getUserById(userId);
      query.where = [{ from: { uid: userId } }, { to: user?.username }];
    }

    const data = await this.transactionRepository.find(query);
    const count = await this.transactionRepository.count(query);

    return paginateResponse(data, count, page, limit);
  };

  public getTransaction = async (userId: string, transactionId: string) => {
    const transaction = await this.transactionRepository.findOne({
      where: { uid: transactionId },
    });

    if (!transaction || (await this._transactionNotBelongToUser(transaction, userId))) {
      throw new NotFound('Transaction not found');
    }

    return transaction;
  };

  private _transactionNotBelongToUser = async (transaction: Transaction, userId: string) => {
    return (
      transaction.from.uid !== userId &&
      transaction.to !== (await this.userService.getUserById(userId))?.username
    );
  };

  private _processNewTransaction = async (transactionId: string) => {
    AppLogger.info(`[TRANSACTION QUEUE] Processing new transaction >>> ${transactionId}`);
  };
}

export default TransactionService;
