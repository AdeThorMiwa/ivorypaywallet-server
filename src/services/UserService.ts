import { Inject, Service } from 'typedi';
import { User } from './../entities';
import DatabaseService from './DatabaseService';
import { BadRequest } from 'http-errors';
import AvatarService from './AvatarService';
import EncryptionService from './EncryptionService';
import TokenService from './TokenService';

@Service()
class UserService {
  private readonly userRepository = DatabaseService.getInstance().getRepository(User);
  constructor(
    @Inject() readonly avatarService: AvatarService,
    @Inject() readonly encryptionService: EncryptionService,
    @Inject() readonly tokenService: TokenService,
  ) {}

  public createUser = async (email: string, username: string, password: string) => {
    const userExist = await this.userRepository.exist({ where: [{ email }, { username }] });
    if (userExist) {
      throw new BadRequest('username or email is already taken');
    }

    const avatar = await this.avatarService.getRandomAvatar();
    const encryptedPassword = await this.encryptionService.passwordEncrypt(password);

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = encryptedPassword;
    user.avatar = avatar;

    await this.userRepository.save(user);

    const authToken = await this.tokenService.generateAuthToken(user.uid, []);

    return { token: authToken };
  };

  public getUserById = async (userId: string) => {
    return await this.userRepository.findOne({
      where: { uid: userId },
      select: { id: false },
    });
  };

  public userWithEmailExist = async (email: string) => {
    return await this.userRepository.exist({ where: { email } });
  };

  public getUserByEmail = async (email: string) => {
    return await this.userRepository.findOne({ where: { email } });
  };
}

export default UserService;
