import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../config/prisma/prisma.service';
import { BooksRepositoryDomain } from 'src/domain/repositories/books.interface';

@Injectable()
export class BooksRepository implements BooksRepositoryDomain {
  constructor(private readonly prismaService: PrismaService) {}
  async bookById(id: number): Promise<{
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    note: string;
  }> {
    return await this.prismaService.books.findUnique({ where: { id } });
  }
  async books(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BooksWhereUniqueInput;
    where?: Prisma.BooksWhereInput;
    orderBy?: Prisma.BooksOrderByWithRelationInput;
  }): Promise<
    {
      id: number;
      name: string;
      address: string;
      phoneNumber: string;
      note: string;
    }[]
  > {
    return await this.prismaService.books.findMany({ ...params });
  }
  async createBook(data: Prisma.BooksCreateInput): Promise<{
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    note: string;
  }> {
    return await this.prismaService.books.create({ data });
  }
  async updateBookById(params: {
    id: number;
    data: Prisma.BooksUpdateInput;
  }): Promise<{
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    note: string;
  }> {
    return await this.prismaService.books.update({
      where: { id: params.id },
      data: params.data,
    });
  }
  async deleteBookById(id: number): Promise<{
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    note: string;
  }> {
    return await this.prismaService.books.delete({ where: { id } });
  }
}
