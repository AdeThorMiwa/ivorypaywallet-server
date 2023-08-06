import { Inject, Service } from 'typedi';
import { AppLogger } from '../utils';
import { BadRequest } from 'http-errors';
import TokenService from './TokenService';
import EmailService from './EmailService';
import EncryptionService from './EncryptionService';
import DatabaseService from './DatabaseService';
import { User } from '../entities';
import { CreateUserResponse, UserStatus, UserType } from '../interfaces';
import AvatarService from './AvatarService';
import { AppEvents, SCOPES } from '../constants';
import AppEventService from './AppEventService';
import { getPaginationConfig, paginateResponse } from '../utils/pagination';
import { FindManyOptions } from 'typeorm';

@Service()
class AdminService {
  private readonly adminRepository = DatabaseService.getInstance().getRepository(User);
  constructor(
    @Inject() readonly tokenService: TokenService,
    @Inject() readonly emailService: EmailService,
    @Inject() readonly encryptionService: EncryptionService,
    @Inject() readonly avatarService: AvatarService,
    @Inject() readonly appEventService: AppEventService,
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

  public createAdmin = async (
    email: string,
    username: string,
    password: string,
  ): Promise<CreateUserResponse> => {
    const adminExist = await this.adminRepository.exist({
      where: [
        { email, userType: UserType.ADMIN },
        { username, userType: UserType.ADMIN },
      ],
    });
    if (adminExist) {
      throw new BadRequest('username or email is already taken');
    }

    const avatar = await this.avatarService.getRandomAvatar();
    const encryptedPassword = await this.encryptionService.passwordEncrypt(password);

    const admin = new User();
    admin.username = username;
    admin.email = email;
    admin.password = encryptedPassword;
    admin.avatar = avatar;
    admin.userType = UserType.ADMIN;

    await this.adminRepository.save(admin);

    // inform the system of the event
    this.appEventService.emit(AppEvents.NEW_ADMIN, admin.uid);

    const authToken = await this.tokenService.generateAuthToken(admin.uid, [SCOPES.ADMIN]);

    return { token: authToken };
  };

  public getAdminById = async (adminId: string) => {
    return await this.adminRepository.findOne({ where: { uid: adminId } });
  };

  public getAdmins = async (page?: number, limit?: number, desc = true) => {
    const [take, skip] = getPaginationConfig(page, limit);

    const query: FindManyOptions<User> = {
      where: { userType: UserType.ADMIN },
      take,
      skip,
      order: { createdOn: desc ? 'DESC' : 'ASC' },
    };

    const data = await this.adminRepository.find(query);
    const count = await this.adminRepository.count(query);

    return paginateResponse(data, count, page, limit);
  };

  public updateUserStatus = async (userId: string, status: UserStatus) => {
    return await this.adminRepository.update({ uid: userId }, { status });
  };

  private _adminWithEmailExist = async (email: string) => {
    return await this.adminRepository.exist({ where: { email, userType: UserType.ADMIN } });
  };
}

export default AdminService;
