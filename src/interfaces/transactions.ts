import { IPaginatedRequest } from './util';

export enum TransactionType {
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
}

export enum TransactionStatus {
  CREATED = 'CREATED',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
}

export interface InitiateTransactionPayload {
  type: TransactionType.TRANSFER | TransactionType.WITHDRAW;
  amount: string;
  to: string;
  note: string;
}

export interface TransactionListPayload extends IPaginatedRequest {}

export interface IntitiateTransactionResponse {
  transactionId: string;
}
