import { Prisma, Products as ProductsModel } from '@prisma/client';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';
import { ExceptionService } from 'src/infrastructure/exception/exception.service';

export class UpdateProductFeature {
  constructor(
    private readonly productRepository: ProductRepositoryDomain,
    private readonly exceptionService: ExceptionService,
  ) {}

  async execute(
    id: number,
    data: Prisma.ProductsUpdateInput,
  ): Promise<ProductsModel> {
    const isDataExist = await this.productRepository.productById(id);

    if (!isDataExist) {
      this.exceptionService.notFoundException({
        message: `Product with id ${id} is not exist!`,
      });
    }

    return this.productRepository.updateProductById({ id, data });
  }
}
