import { Inject, Service } from 'typedi';
import { AppLogger } from '../utils';
import UserService from './UserService';
import { BadRequest } from 'http-errors';
import TokenService from './TokenService';
import EmailService from './EmailService';

@Service()
class AuthService {
  constructor(
    @Inject() readonly userService: UserService,
    @Inject() readonly tokenService: TokenService,
    @Inject() readonly emailService: EmailService,
  ) {}

  public sendInviteToUser = async (email: string) => {
    AppLogger.info(`Sending invite to user with email >>> ${email}`);

    if (await this.userService.userWithEmailExist(email)) {
      throw new BadRequest('email already exist');
    }

    const inviteToken = await this.tokenService.newInviteToken(email);

    await this.emailService.sendInviteTokenMail(email, inviteToken);

    return { sent: true };
  };
}

export default AuthService;
