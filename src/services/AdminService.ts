import { Inject, Service } from 'typedi';
import { AppLogger } from '../utils';
import { BadRequest } from 'http-errors';
import TokenService from './TokenService';
import EmailService from './EmailService';
import EncryptionService from './EncryptionService';
import DatabaseService from './DatabaseService';
import { User } from '../entities';
import { UserType } from '../interfaces';

@Service()
class AdminService {
  private readonly adminRepository = DatabaseService.getInstance().getRepository(User);
  constructor(
    @Inject() readonly tokenService: TokenService,
    @Inject() readonly emailService: EmailService,
    @Inject() readonly encryptionService: EncryptionService,
  ) {}

  public sendAdminInvite = async (email: string) => {
    AppLogger.info(`Sending admin invite to email >>> ${email}`);

    if (await this._adminWithEmailExist(email)) {
      throw new BadRequest('admin with email already exist');
    }

    const inviteToken = await this.tokenService.newInviteToken(email, UserType.ADMIN);

    await this.emailService.sendInviteTokenMail(email, inviteToken);

    return { sent: true };
  };

  private _adminWithEmailExist = async (email: string) => {
    return await this.adminRepository.exist({ where: { email, userType: UserType.ADMIN } });
  };
}

export default AdminService;
