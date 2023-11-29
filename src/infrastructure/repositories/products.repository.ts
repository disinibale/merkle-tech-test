import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';
import { PrismaService } from '../config/prisma/prisma.service';

@Injectable()
export class ProductsRepository implements ProductRepositoryDomain {
  constructor(private readonly prismaService: PrismaService) {}

  updateProductQuantityTx(
    productId: number,
    quantity: number,
  ): Promise<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.products.update({
      where: {
        id: productId,
      },
      data: {
        quantity,
      },
    });
  }

  productById(id: number): Promise<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: Decimal;
  }> {
    return this.prismaService.products.findUnique({
      where: { id },
    });
  }

  productByIdTx(
    id: number,
    tx: Prisma.TransactionClient,
  ): Promise<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return tx.products.findUnique({ where: { id } });
  }

  products(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductsWhereUniqueInput;
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput;
  }): Promise<
    {
      id: number;
      name: string;
      description: string;
      quantity: number;
      price: Decimal;
    }[]
  > {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.products.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  createProduct(data: Prisma.ProductsCreateInput): Promise<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: Decimal;
  }> {
    return this.prismaService.products.create({ data });
  }

  updateProductById(params: {
    id: number;
    data: Prisma.ProductsUpdateInput;
  }): Promise<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: Decimal;
  }> {
    const { id, data } = params;
    return this.prismaService.products.update({
      where: { id },
      data,
    });
  }

  updateProductByIdTx(params: {
    id: number;
    data: Prisma.ProductsUpdateInput;
    tx: Prisma.TransactionClient;
  }): Promise<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    const { id, data, tx } = params;

    return tx.products.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteProductById(id: number): Promise<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: Decimal;
  }> {
    return this.prismaService.products.delete({ where: { id } });
  }
}
