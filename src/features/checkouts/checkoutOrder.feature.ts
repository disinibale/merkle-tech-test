import { PrismaServiceBase } from 'src/domain/config/prisma.base';
import { IException } from 'src/domain/exception/exception.interface';
import { OrderItemsRepositoryDomain } from 'src/domain/repositories/orderItems.interface';
import { OrdersRepositoryDomain } from 'src/domain/repositories/orders.interface';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';

export class CheckoutOrderFeature {
  constructor(
    private readonly ordersRepository: OrdersRepositoryDomain,
    private readonly orderItemsRepository: OrderItemsRepositoryDomain,
    private readonly productsRepository: ProductRepositoryDomain,
    private readonly prismaService: PrismaServiceBase,
    private readonly exceptionService: IException,
  ) {}

  async execute(userId: number) {
    return this.prismaService.$transaction(async (tx) => {
      const order = await this.ordersRepository.activeOrderByUserIdTx(
        userId,
        tx,
      );

      if (!order) {
        this.exceptionService.notFoundException({ message: 'Cart not found!' });
      }

      const orderItems = await this.orderItemsRepository.orderItemsByOrderIdTx(
        order.id,
        tx,
      );

      if (orderItems.length < 1) {
        this.exceptionService.notFoundException({
          message: 'Cart got 0 items',
        });
      }

      const totalPrice = orderItems.reduce(
        (sum, item) => sum + item.price.toNumber(),
        0,
      );

      await this.ordersRepository.updateOrderByIdTx({
        id: order.id,
        data: {
          status: 'PAID',
          price: totalPrice,
        },
        tx,
      });

      return { success: true, message: 'Checkout successfully' };
    });
  }
}
