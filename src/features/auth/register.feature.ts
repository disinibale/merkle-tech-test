import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import { IException } from 'src/domain/exception/exception.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { UserRepositoryDomain } from 'src/domain/repositories/users.interface';

export class RegisterFeature {
  constructor(
    private readonly logger: ILogger,
    private readonly exceptionService: IException,
    private readonly bcryptService: IBcryptService,
    private readonly userRepository: UserRepositoryDomain,
  ) {}

  async createUserAndWallet(username: string, password) {
    this.logger.log('Register Feature', 'Creating User...');

    const hashedPassword = await this.bcryptService.hash(password);

    return await this.userRepository.createUser({
      username,
      password: hashedPassword,
      wallet: {
        create: {
          balance: 0,
        },
      },
    });
  }

  async isUserExist(username): Promise<boolean> {
    const user = await this.userRepository.userByUsername(username);

    if (user) {
      return true;
    }

    return false;
  }
}
