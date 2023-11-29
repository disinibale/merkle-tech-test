import { Prisma, Products as ProductsModel } from '@prisma/client';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';
import { ExceptionService } from 'src/infrastructure/exception/exception.service';

export class GetProductsFeature {
  constructor(
    private readonly productRepository: ProductRepositoryDomain,
    private readonly exceptionService: ExceptionService,
  ) {}

  async getById(id: number): Promise<ProductsModel | null> {
    const product = await this.productRepository.productById(id);

    if (!product) {
      this.exceptionService.notFoundException({
        message: `Product with id ${id} is not found`,
      });
    }

    return product;
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductsWhereUniqueInput;
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput;
  }): Promise<ProductsModel[]> {
    return this.productRepository.products(params);
  }
}
