import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces';
import WalletService from '../services/WalletService';

@Service()
class WalletController {
  constructor(@Inject() readonly walletService: WalletService) {}

  public getAuthenticatedUserWallet = async (req: Request, res: Response) => {
    const { auth } = <AuthRequest>req;
    const response = await this.walletService.getWalletByUserId(auth.userId!);
    res.status(200).json(response);
  };
}

export default WalletController;
