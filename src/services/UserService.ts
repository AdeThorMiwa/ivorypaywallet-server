import { Service } from 'typedi';
import { User } from './../entities';
import DatabaseService from './DatabaseService';

@Service()
class UserService {
  private readonly userRepository = DatabaseService.getInstance().getRepository(User);
  constructor() {}

  public userWithEmailExist = async (email: string) => {
    return await this.userRepository.exist({ where: { email } });
  };
}

export default UserService;
