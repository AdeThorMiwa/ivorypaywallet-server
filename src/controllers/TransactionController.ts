import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces';
import TransactionService from '../services/TransactionService';
import { InitiateTransactionPayload } from '../interfaces/transactions';

@Service()
class TransactionController {
  constructor(@Inject() readonly transactionService: TransactionService) {}

  public initiateTransaction = async (req: Request, res: Response) => {
    const { auth } = <AuthRequest>req;
    const body = <InitiateTransactionPayload>req.body;
    const response = await this.transactionService.initiateTransaction(auth.userId!, body);
    res.status(200).json(response);
  };
}

export default TransactionController;
