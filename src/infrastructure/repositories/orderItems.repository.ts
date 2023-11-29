import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderItemsRepositoryDomain } from 'src/domain/repositories/orderItems.interface';
import { PrismaService } from '../config/prisma/prisma.service';

@Injectable()
export class OrderItemsRepository implements OrderItemsRepositoryDomain {
  constructor(private readonly prismaService: PrismaService) {}
  orderItemByProductIdTx(
    orderId: number,
    productId: number,
    tx: Prisma.TransactionClient,
  ): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return tx.orderItems.findFirst({
      where: {
        productId,
        orderId,
      },
    });
  }
  orderItemById(id: number): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.orderItems.findUnique({ where: { id } });
  }
  orderItemsByOrderIdTx(
    orderId: number,
    tx: Prisma.TransactionClient,
  ): Promise<
    {
      id: number;
      orderId: number;
      productId: number;
      quantity: number;
      price: Prisma.Decimal;
    }[]
  > {
    return tx.orderItems.findMany({
      where: {
        orderId,
      },
    });
  }
  async orderItemsByOrderId(orderId: number): Promise<
    {
      id: number;
      orderId: number;
      productId: number;
      quantity: number;
      price: Prisma.Decimal;
    }[]
  > {
    return await this.prismaService.orderItems.findMany({
      where: {
        orderId,
      },
    });
  }
  orderItems(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderItemsWhereUniqueInput;
    where?: Prisma.OrderItemsWhereInput;
    orderBy?: Prisma.OrdersOrderByWithRelationInput;
  }): Promise<
    {
      id: number;
      orderId: number;
      productId: number;
      quantity: number;
      price: Prisma.Decimal;
    }[]
  > {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.orderItems.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  createOrderItem(data: Prisma.OrderItemsCreateInput): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.orderItems.create({ data });
  }
  createOrderItemTx(
    data: Prisma.OrderItemsUncheckedCreateInput,
    tx: Prisma.TransactionClient,
  ): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return tx.orderItems.create({ data });
  }
  updateOrderItemById(params: {
    id: number;
    data: Prisma.OrderItemsUpdateInput;
  }): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    const { id, data } = params;
    return this.prismaService.orderItems.update({
      where: {
        id,
      },
      data,
    });
  }
  updateOrderItemByIdTx(params: {
    id: number;
    data: Prisma.OrderItemsUpdateInput;
    tx: Prisma.TransactionClient;
  }): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    const { id, data, tx } = params;
    return tx.orderItems.update({
      where: {
        id,
      },
      data,
    });
  }
  deleteOrderItemById(id: number): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return this.prismaService.orderItems.delete({ where: { id } });
  }
  deleteOrderItemByIdTx(
    id: number,
    tx: Prisma.TransactionClient,
  ): Promise<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
  }> {
    return tx.orderItems.delete({
      where: {
        id,
      },
    });
  }
}
