import { Users, Prisma } from '@prisma/client';

export interface UserRepositoryDomain {
  userById(id: number): Promise<Users | null>;

  userByUsername(username: string): Promise<Users | null>;

  userRoleByUsername(username: string): Promise<Array<string>>;

  users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UsersWhereUniqueInput;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }): Promise<Users[]>;

  createUser(data: Prisma.UsersCreateInput): Promise<Users>;

  updateUserById(params: {
    id: number;
    data: Prisma.UsersUpdateInput;
  }): Promise<Users>;

  deleteUserById(id: number): Promise<Users>;
}
