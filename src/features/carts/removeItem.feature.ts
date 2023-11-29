import { PrismaServiceBase } from 'src/domain/config/prisma.base';
import { IException } from 'src/domain/exception/exception.interface';
import { OrderItemsRepositoryDomain } from 'src/domain/repositories/orderItems.interface';
import { OrdersRepositoryDomain } from 'src/domain/repositories/orders.interface';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';

export class RemoveItemFeature {
  constructor(
    private readonly orderItemsRepository: OrderItemsRepositoryDomain,
    private readonly productsRepository: ProductRepositoryDomain,
    private readonly ordersRepository: OrdersRepositoryDomain,
    private readonly prisma: PrismaServiceBase,
    private readonly exceptionService: IException,
  ) {}

  async removeItem(userId: number, productId: number) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const order = await this.ordersRepository.activeOrderByUserIdTx(
          userId,
          tx,
        );
        const existingOrderItem =
          await this.orderItemsRepository.orderItemByProductIdTx(
            order.id,
            productId,
            tx,
          );

        if (!order) {
          this.exceptionService.notFoundException({
            message: 'Cart not found!',
          });
        }

        if (!existingOrderItem) {
          this.exceptionService.notFoundException({
            message: 'Order item not found!',
          });
        }

        await this.orderItemsRepository.deleteOrderItemByIdTx(
          existingOrderItem.id,
          tx,
        );

        await this.productsRepository.updateProductByIdTx({
          id: productId,
          data: {
            quantity: {
              increment: existingOrderItem.quantity,
            },
          },
          tx,
        });
      });

      return { success: true, message: 'Cart Item removed Successfully' };
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
  }
}
