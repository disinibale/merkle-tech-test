import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';

import { OrdersRepositoryDomain } from 'src/domain/repositories/orders.interface';
import { PrismaService } from '../config/prisma/prisma.service';

@Injectable()
export class OrdersRepository implements OrdersRepositoryDomain {
  constructor(private readonly prismaService: PrismaService) {}
  orderByUserIdIncludeItem(userId: number): Promise<{
    id: number;
    userId: number;
    price: Prisma.Decimal;
    status: $Enums.OrderStatus;
  }> {
    return this.prismaService.orders.findFirst({
      where: { userId, status: 'CART' },
      include: {
        OrderItems: true,
      },
    });
  }
  activeOrderByUserIdTx(
    userId: number,
    tx: Prisma.TransactionClient,
  ): Promise<{
    id: number;
    userId: number;
    price: Prisma.Decimal;
    status: $Enums.OrderStatus;
  }> {
    return tx.orders.findFirst({
      where: {
        userId,
        status: 'CART',
      },
    });
  }
  orderById(id: number): Promise<{
    id: number;
    userId: number;
    status: $Enums.OrderStatus;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.orders.findUnique({
      where: { id },
    });
  }
  activeOrderByUserId(userId: number): Promise<{
    id: number;
    userId: number;
    status: $Enums.OrderStatus;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.orders.findFirst({
      where: {
        userId,
        status: 'CART',
      },
    });
  }
  orders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrdersWhereUniqueInput;
    where?: Prisma.OrdersWhereInput;
    orderBy?: Prisma.OrdersOrderByWithRelationInput;
  }): Promise<
    {
      id: number;
      userId: number;
      status: $Enums.OrderStatus;
      price: Prisma.Decimal;
    }[]
  > {
    return this.prismaService.orders.findMany(params);
  }
  ordersTx(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrdersWhereUniqueInput;
    where?: Prisma.OrdersWhereInput;
    orderBy?: Prisma.OrdersOrderByWithRelationInput;
    tx: Prisma.TransactionClient;
  }): Promise<
    {
      id: number;
      userId: number;
      status: $Enums.OrderStatus;
      price: Prisma.Decimal;
    }[]
  > {
    const { tx, ...rest } = params;
    return tx.orders.findMany({ ...rest });
  }
  createOrder(data: Prisma.OrdersUncheckedCreateInput): Promise<{
    id: number;
    userId: number;
    status: $Enums.OrderStatus;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.orders.create({
      data,
      include: { OrderItems: true },
    });
  }
  createOrderTx(
    data: Prisma.OrdersUncheckedCreateInput,
    tx: Prisma.TransactionClient,
  ): Promise<{
    id: number;
    userId: number;
    status: $Enums.OrderStatus;
    price: Prisma.Decimal;
  }> {
    return tx.orders.create({ data });
  }
  updateOrderById(params: {
    id: number;
    data: Prisma.OrdersUpdateInput;
  }): Promise<{
    id: number;
    userId: number;
    status: $Enums.OrderStatus;
    price: Prisma.Decimal;
  }> {
    const { id, data } = params;
    return this.prismaService.orders.update({
      where: { id },
      data,
    });
  }
  updateOrderByIdTx(params: {
    id: number;
    data: Prisma.OrdersUpdateInput;
    tx: Prisma.TransactionClient;
  }): Promise<{
    id: number;
    userId: number;
    status: $Enums.OrderStatus;
    price: Prisma.Decimal;
  }> {
    const { id, data, tx } = params;

    return tx.orders.update({ where: { id }, data });
  }
  deleteOrderById(id: number): Promise<{
    id: number;
    userId: number;
    status: $Enums.OrderStatus;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.orders.delete({ where: { id } });
  }
}
