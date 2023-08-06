import { Inject, Service } from 'typedi';
import { User } from './../entities';
import DatabaseService from './DatabaseService';
import { BadRequest } from 'http-errors';
import AvatarService from './AvatarService';
import EncryptionService from './EncryptionService';
import TokenService from './TokenService';
import AppEventService from './AppEventService';
import { AppEvents, SCOPES } from '../constants';
import { FindManyOptions, FindOptionsSelect } from 'typeorm';
import { CreateUserResponse, UserType } from '../interfaces';
import { getPaginationConfig, paginateResponse } from '../utils/pagination';

@Service()
class UserService {
  private readonly userRepository = DatabaseService.getInstance().getRepository(User);
  constructor(
    @Inject() readonly avatarService: AvatarService,
    @Inject() readonly encryptionService: EncryptionService,
    @Inject() readonly tokenService: TokenService,
    @Inject() readonly appEventService: AppEventService,
  ) {}

  public createUser = async (
    email: string,
    username: string,
    password: string,
  ): Promise<CreateUserResponse> => {
    const userExist = await this.userRepository.exist({
      where: [
        { email, userType: UserType.USER },
        { username, userType: UserType.USER },
      ],
    });
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
    user.userType = UserType.USER;

    await this.userRepository.save(user);

    // inform the system of the event
    this.appEventService.emit(AppEvents.NEW_USER, user.uid);

    const authToken = await this.tokenService.generateAuthToken(user.uid, [SCOPES.USER]);

    return { token: authToken };
  };

  public getUserById = async (userId: string) => {
    return await this.userRepository.findOne({
      where: { uid: userId },
      select: { id: false },
    });
  };

  public userWithEmailExist = async (email: string) => {
    return await this.userRepository.exist({ where: { email, userType: UserType.USER } });
  };

  public getUserByEmail = async (email: string, select?: FindOptionsSelect<User>) => {
    return await this.userRepository.findOne({ where: { email }, select });
  };

  public getUserByUsername = async (username: string, select?: FindOptionsSelect<User>) => {
    return await this.userRepository.findOne({
      where: { username, userType: UserType.USER },
      select,
    });
  };

  public getUsers = async (page?: number, limit?: number, desc = true) => {
    const [take, skip] = getPaginationConfig(page, limit);

    const query: FindManyOptions<User> = {
      where: { userType: UserType.USER },
      take,
      skip,
      order: { createdOn: desc ? 'DESC' : 'ASC' },
    };

    const data = await this.userRepository.find(query);
    const count = await this.userRepository.count(query);

    return paginateResponse(data, count, page, limit);
  };
}

export default UserService;
