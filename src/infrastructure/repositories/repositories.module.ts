import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../config/prisma/prisma.module';
import { ProductsRepository } from './products.repository';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './orderItems.repository';
import { BooksRepository } from './books.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersRepository,
    ProductsRepository,
    OrdersRepository,
    OrderItemsRepository,
    BooksRepository,
  ],
  exports: [
    UsersRepository,
    ProductsRepository,
    OrdersRepository,
    OrderItemsRepository,
    BooksRepository,
  ],
})
export class RepositoriesModule {}
