import { Prisma, OrderItems } from '@prisma/client';

export interface OrderItemsRepositoryDomain {
  orderItemById(id: number): Promise<OrderItems | null>;

  orderItems(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderItemsWhereUniqueInput;
    where?: Prisma.OrderItemsWhereInput;
    orderBy?: Prisma.OrderItemsOrderByWithRelationInput;
  }): Promise<OrderItems[]>;

  orderItemByProductIdTx(
    orderId: number,
    productId: number,
    tx: Prisma.TransactionClient,
  ): Promise<OrderItems | null>;

  orderItemsByOrderIdTx(
    orderId: number,
    tx: Prisma.TransactionClient,
  ): Promise<OrderItems[]>;

  orderItemsByOrderId(orderId: number): Promise<OrderItems[]>;

  createOrderItem(data: Prisma.OrderItemsCreateInput): Promise<OrderItems>;
  createOrderItemTx(
    data: Prisma.OrderItemsUncheckedCreateInput,
    tx: Prisma.TransactionClient,
  ): Promise<OrderItems>;

  updateOrderItemById(params: {
    id: number;
    data: Prisma.OrderItemsUpdateInput;
  }): Promise<OrderItems>;

  updateOrderItemByIdTx(params: {
    id: number;
    data: Prisma.OrderItemsUpdateInput;
    tx: Prisma.TransactionClient;
  }): Promise<OrderItems>;

  deleteOrderItemById(id: number): Promise<OrderItems>;

  deleteOrderItemByIdTx(
    id: number,
    tx: Prisma.TransactionClient,
  ): Promise<OrderItems>;
}
