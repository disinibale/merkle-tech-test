import { Products as ProductsModel } from '@prisma/client';
import { ProductRepositoryDomain } from 'src/domain/repositories/products.interface';
import { ExceptionService } from 'src/infrastructure/exception/exception.service';

export class DeleteProductFeature {
  constructor(
    private readonly productRepository: ProductRepositoryDomain,
    private readonly exceptionService: ExceptionService,
  ) {}

  async execute(id: number): Promise<ProductsModel> {
    const isDataExist = await this.productRepository.productById(id);

    if (!isDataExist) {
      this.exceptionService.notFoundException({
        message: `Product with id ${id} is not exist!`,
      });
    }

    return this.productRepository.deleteProductById(id);
  }
}
