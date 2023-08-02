import { Service } from 'typedi';
import { AppLogger } from '../utils';
import DatabaseService from './DatabaseService';
import { User, Wallet } from '../entities';
import Decimal from 'decimal.js';
import { FindOptionsSelect } from 'typeorm';

@Service()
class WalletService {
  private readonly userRepository = DatabaseService.getInstance().getRepository(User);
  private readonly walletRepository = DatabaseService.getInstance().getRepository(Wallet);
  constructor() {}

  public getWalletByUserId = async (userId: string, select?: FindOptionsSelect<Wallet>) => {
    return await this.walletRepository.findOne({ where: { user: { uid: userId } }, select });
  };

  public userHasEnoughWalletBalance = async (userId: string, amount: Decimal): Promise<boolean> => {
    const userWallet = await this.getWalletByUserId(userId);
    const walletBalance = new Decimal(userWallet?.balance ?? 0);
    return walletBalance.greaterThanOrEqualTo(amount);
  };

  public setupUserWallet = async (userId: string) => {
    AppLogger.info(`Setting up wallet for user >>> ${userId}`);
    const user = await this.userRepository.findOne({ where: { uid: userId } });

    if (user) {
      try {
        const wallet = new Wallet();
        wallet.balance = new Decimal(0.0);

        await this.walletRepository.save(wallet);

        await this.userRepository.save({
          ...user,
          wallet,
        });
      } catch (e) {
        AppLogger.error('Error while setting up wallet >> ', e);
      }
    }
  };
}

export default WalletService;
