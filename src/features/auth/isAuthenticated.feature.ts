import { Users as UserModel } from '@prisma/client';
import { UserRepositoryDomain } from 'src/domain/repositories/users.interface';

export class IsAuthenticatedFeature {
  constructor(private readonly userRepository: UserRepositoryDomain) {}

  async execute(username: string): Promise<UserModel> {
    return await this.userRepository.userByUsername(username);
  }
}
