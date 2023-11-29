import { Orders as OrdersModel } from 'prisma';
import { OrdersRepositoryDomain } from 'src/domain/repositories/orders.interface';

export class GetCartFeature {
  constructor(private readonly ordersRepository: OrdersRepositoryDomain) {}

  async getOrCreateCart(userId: number): Promise<{
    cart: OrdersModel;
    totalPrice: number;
  }> {
    let createdCart: OrdersModel;
    const cart = await this.ordersRepository.orderByUserIdIncludeItem(userId);

    if (cart) {
      createdCart = cart;
    } else {
      createdCart = await this.ordersRepository.createOrder({
        userId,
        status: 'CART',
      });
    }

    const totalPrice = createdCart.OrderItems.reduce(
      (sum, item) => sum + item.price.toNumber(),
      0,
    );

    return {
      cart: createdCart,
      totalPrice,
    };
  }
}
