import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { UserRepositoryDomain } from 'src/domain/repositories/users.interface';
import { PrismaService } from '../config/prisma/prisma.service';

@Injectable()
export class UsersRepository implements UserRepositoryDomain {
  constructor(private readonly prismaService: PrismaService) {}

  async userById(id: number): Promise<{
    id: number;
    username: string;
    password: string;
    lastLogin: Date;
    hashRefreshToken: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prismaService.users.findUnique({
      where: { id },
    });
  }

  async userByUsername(username: string): Promise<{
    id: number;
    username: string;
    password: string;
    lastLogin: Date;
    hashRefreshToken: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prismaService.users.findFirst({
      where: { username },
    });
  }

  async userRoleByUsername(username: string): Promise<string[]> {
    const user = await this.prismaService.users.findFirst({
      where: {
        username,
      },
      select: {
        roles: true,
      },
    });

    return [...user.roles];
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UsersWhereUniqueInput;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }): Promise<
    {
      id: number;
      username: string;
      password: string;
      lastLogin: Date;
      hashRefreshToken: string;
      roles: string[];
      createdAt: Date;
      updatedAt: Date;
    }[]
  > {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.users.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UsersCreateInput): Promise<{
    id: number;
    username: string;
    password: string;
    lastLogin: Date;
    hashRefreshToken: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prismaService.users.create({ data });
  }

  async updateUserById(params: {
    id: number;
    data: Prisma.UsersUpdateInput;
  }): Promise<{
    id: number;
    username: string;
    password: string;
    lastLogin: Date;
    hashRefreshToken: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
  }> {
    const { id, data } = params;
    return this.prismaService.users.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUserById(id: number): Promise<{
    id: number;
    username: string;
    password: string;
    lastLogin: Date;
    hashRefreshToken: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prismaService.users.delete({ where: { id } });
  }
}
