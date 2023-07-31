import { Service } from 'typedi';
import { AppLogger } from '../utils';

@Service()
class AuthService {
  constructor() {}

  public sendInviteToUser = async (email: string) => {
    AppLogger.info(`Sending invite to user with email >>> ${email}`);
    return { sent: true, email };
  };
}

export default AuthService;
