import { PrismaServiceBase } from 'src/domain/config/prisma.base';
import { IException } from 'src/domain/exception/exception.interface';
import { OrdersRepositoryDomain } from 'src/domain/repositories/orders.interface';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';
import { OrderItemsRepository } from 'src/infrastructure/repositories/orderItems.repository';

export class ModifyItemQuantityFeature {
  constructor(
    private readonly ordersRepository: OrdersRepositoryDomain,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly productsRepository: ProductRepositoryDomain,
    private readonly prisma: PrismaServiceBase,
    private readonly exceptionService: IException,
  ) {}

  async execute(userId: number, productId: number, quantity: number) {
    return this.prisma.$transaction(async (tx) => {
      const product = await this.productsRepository.productByIdTx(
        productId,
        tx,
      );
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

      if (!product) {
        this.exceptionService.notFoundException({
          message: `Product with ${productId} is not exist`,
        });
      }

      if (!order) {
        this.exceptionService.notFoundException({
          message: 'Cart not found!',
        });
      }

      if (!existingOrderItem) {
        this.exceptionService.notFoundException({
          message: 'Ordered Item has not added to the cart',
        });
      }

      const newTotalPrice = product.price.toNumber() * quantity;

      await this.orderItemsRepository.updateOrderItemByIdTx({
        id: existingOrderItem.id,
        data: {
          quantity,
          price: newTotalPrice,
        },
        tx,
      });
    });
  }
}
