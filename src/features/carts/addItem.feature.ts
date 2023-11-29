import { PrismaServiceBase } from 'src/domain/config/prisma.base';
import { IException } from 'src/domain/exception/exception.interface';
import { OrderItemsRepositoryDomain } from 'src/domain/repositories/orderItems.interface';
import { OrdersRepositoryDomain } from 'src/domain/repositories/orders.interface';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';

export class AddItemFeature {
  constructor(
    private readonly productsRepository: ProductRepositoryDomain,
    private readonly ordersRepository: OrdersRepositoryDomain,
    private readonly orderItemsRepository: OrderItemsRepositoryDomain,
    private readonly prisma: PrismaServiceBase,
    private readonly exceptionService: IException,
  ) {}

  async execute(userId: number, productId: number, quantity: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const product = await this.productsRepository.productByIdTx(
          productId,
          tx,
        );
        const order = await this.ordersRepository.activeOrderByUserId(userId);
        const existingOrderItem =
          await this.orderItemsRepository.orderItemByProductIdTx(
            order.id,
            productId,
            tx,
          );

        if (!product) {
          this.exceptionService.notFoundException({
            message: 'Product not found!',
          });
        }

        if (!order) {
          this.exceptionService.notFoundException({
            message: 'Cart not found!',
          });
        }

        if (product.quantity < quantity) {
          this.exceptionService.badRequestException({
            message: `Product ${product.name} stock is not available`,
          });
        }

        const totalPrice = product.price.toNumber() * quantity;

        if (existingOrderItem) {
          await this.orderItemsRepository.updateOrderItemByIdTx({
            id: productId,
            data: {
              quantity: existingOrderItem.quantity + quantity,
              price: existingOrderItem.price.toNumber() + totalPrice,
            },
            tx,
          });
        } else {
          await this.orderItemsRepository.createOrderItemTx(
            {
              orderId: order.id,
              productId,
              quantity,
              price: totalPrice,
            },
            tx,
          );
        }

        return {
          message: 'Item successfully added',
        };
      });
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
  }
}
