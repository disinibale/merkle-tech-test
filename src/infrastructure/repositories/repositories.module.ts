import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../config/prisma/prisma.module';
import { ProductsRepository } from './products.repository';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './orderItems.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersRepository,
    ProductsRepository,
    OrdersRepository,
    OrderItemsRepository,
  ],
  exports: [
    UsersRepository,
    ProductsRepository,
    OrdersRepository,
    OrderItemsRepository,
  ],
})
export class RepositoriesModule {}
