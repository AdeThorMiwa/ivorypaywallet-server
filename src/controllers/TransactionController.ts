import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces';
import TransactionService from '../services/TransactionService';
import { InitiateTransactionPayload, TransactionListPayload } from '../interfaces/transactions';

@Service()
class TransactionController {
  constructor(@Inject() readonly transactionService: TransactionService) {}

  public initiateTransaction = async (req: Request, res: Response) => {
    const { auth } = <AuthRequest>req;
    const body = <InitiateTransactionPayload>req.body;
    const response = await this.transactionService.initiateTransaction(auth.userId!, body);
    res.status(201).json(response);
  };

  public getAuthenticatedUserTransactions = async (req: Request, res: Response) => {
    const { auth } = <AuthRequest>req;
    const body = <TransactionListPayload>req.body;
    const response = await this.transactionService.getTransactions(
      auth.userId!,
      body.page,
      body.limit,
    );
    res.status(200).json(response);
  };

  public getTransactionById = async (req: Request, res: Response) => {
    const { auth } = <AuthRequest>req;
    const response = await this.transactionService.getTransaction(
      auth.userId!,
      req.body.transactionId,
    );
    res.status(200).json(response);
  };
}

export default TransactionController;
