import { User } from '../entities';
import { Inject, Service } from 'typedi';
import AvatarService from '../services/AvatarService';
import EncryptionService from '../services/EncryptionService';
import { Seeder, UserStatus, UserType } from '../interfaces';
import { AppLogger } from '../utils';
import BaseSeeder from './base';

@Service()
export default class AdminSeeder extends BaseSeeder implements Seeder {
  constructor(
    @Inject() readonly avatarService: AvatarService,
    @Inject() readonly encryptionService: EncryptionService,
  ) {
    super();
  }

  public async seed(): Promise<void> {
    try {
      AppLogger.info(`Seeding super admin >>>`);
      const username = <string>process.env.ADMIN_USERNAME;
      const email = <string>process.env.ADMIN_EMAIL;
      const password = <string>process.env.ADMIN_PASS;
      const avatar = await this.avatarService.getRandomAvatar();

      const admin = new User();
      admin.username = username;
      admin.password = await this.encryptionService.passwordEncrypt(password);
      admin.avatar = avatar;
      admin.email = email;
      admin.userType = UserType.ADMIN;
      admin.status = UserStatus.ACTIVE;

      const dbInstance = await this.getDBInstance();
      const adminRepository = dbInstance.getRepository(User);

      await adminRepository.save(admin);

      AppLogger.info(`Super admin seeded >>> ${admin.uid}`);
    } catch (e: unknown) {
      AppLogger.error(`Failed to seed admin`, (e as Error)?.message);
    }
  }
}
