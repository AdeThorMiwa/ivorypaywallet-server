import { Inject, Service } from 'typedi';
import {
  InitiateTransactionPayload,
  IntitiateTransactionResponse,
  TransactionStatus,
} from '../interfaces/transactions';
import UserService from './UserService';
import { BadRequest, Forbidden, InternalServerError } from 'http-errors';
import WalletService from './WalletService';
import Decimal from 'decimal.js';
import DatabaseService from './DatabaseService';
import { Transaction } from '../entities';
import { AppLogger } from '../utils';
import AppEventService from './AppEventService';
import { AppEvents } from '../constants';

@Service()
class TransactionService {
  private readonly transactionRepository = DatabaseService.getInstance().getRepository(Transaction);
  constructor(
    @Inject() readonly userService: UserService,
    @Inject() readonly walletService: WalletService,
    @Inject() readonly appEventService: AppEventService,
  ) {}

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

      // notify the system of the event
      this.appEventService.emit(AppEvents.NEW_TRANSACTION, transaction.uid);
      return { transactionId: transaction.uid };
    } catch (e) {
      AppLogger.error('An error occured while trying to create transaction', e);
      throw new InternalServerError('Something went wrong');
    }
  };
}

export default TransactionService;
