import { Inject, Service } from 'typedi';
import { AppLogger } from '../utils';
import UserService from './UserService';
import { BadRequest } from 'http-errors';
import TokenService from './TokenService';
import EmailService from './EmailService';
import EncryptionService from './EncryptionService';
import { SCOPES } from '../constants';
import { UserType } from '../interfaces';

@Service()
class AuthService {
  constructor(
    @Inject() readonly userService: UserService,
    @Inject() readonly tokenService: TokenService,
    @Inject() readonly emailService: EmailService,
    @Inject() readonly encryptionService: EncryptionService,
  ) {}

  public sendInviteToUser = async (email: string) => {
    AppLogger.info(`Sending invite to user with email >>> ${email}`);

    if (await this.userService.userWithEmailExist(email)) {
      throw new BadRequest('email already exist');
    }

    const inviteToken = await this.tokenService.newInviteToken(email, UserType.USER);

    await this.emailService.sendInviteTokenMail(email, inviteToken);

    return { sent: true };
  };

  public authenticateUser = async (email: string, password: string) => {
    AppLogger.info(`Authenticating user >>> ${email}`);

    const user = await this.userService.getUserByEmail(email, { uid: true, password: true });
    if (!user) {
      throw new BadRequest('Missing or invalid param');
    }

    const isCorrectPassword = await this.encryptionService.comparePassword(password, user.password);
    if (!isCorrectPassword) {
      throw new BadRequest('Missing or invalid param');
    }

    const token = await this.tokenService.generateAuthToken(user.uid, [
      user.userType === UserType.ADMIN ? SCOPES.ADMIN : SCOPES.USER,
    ]);

    return { token };
  };
}

export default AuthService;
