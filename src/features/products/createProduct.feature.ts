import { Prisma, Products as ProductsModel } from '@prisma/client';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';

export class CreateProductFeature {
  constructor(private readonly productRepository: ProductRepositoryDomain) {}

  async execute(data: Prisma.ProductsCreateInput): Promise<ProductsModel> {
    return this.productRepository.createProduct(data);
  }
}
