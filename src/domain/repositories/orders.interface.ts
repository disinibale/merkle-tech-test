import { Prisma, Orders } from '@prisma/client';

export interface OrdersRepositoryDomain {
  orderById(id: number): Promise<Orders | null>;
  activeOrderByUserId(
    userId: number,
    options?: { include: Prisma.OrdersInclude },
  ): Promise<Orders>;
  activeOrderByUserIdTx(
    userId: number,
    tx: Prisma.TransactionClient,
  ): Promise<Orders>;
  orderByUserIdIncludeItem(userId: number): Promise<Orders>;
  orders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrdersWhereUniqueInput;
    where?: Prisma.OrdersWhereInput;
    orderBy?: Prisma.OrdersOrderByWithRelationInput;
  }): Promise<Orders[]>;
  ordersTx(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrdersWhereUniqueInput;
    where?: Prisma.OrdersWhereInput;
    orderBy?: Prisma.OrdersOrderByWithRelationInput;
    tx: Prisma.TransactionClient;
  }): Promise<Orders[]>;
  createOrder(data: Prisma.OrdersUncheckedCreateInput): Promise<Orders>;
  createOrderTx(
    data: Prisma.OrdersUncheckedCreateInput,
    tx: Prisma.TransactionClient,
  ): Promise<Orders>;
  updateOrderById(params: {
    id: number;
    data: Prisma.OrdersUpdateInput;
  }): Promise<Orders>;
  updateOrderByIdTx(params: {
    id: number;
    data: Prisma.OrdersUpdateInput;
    tx: Prisma.TransactionClient;
  }): Promise<Orders>;
  deleteOrderById(id: number): Promise<Orders>;
}
