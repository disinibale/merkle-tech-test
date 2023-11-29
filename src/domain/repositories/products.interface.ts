import { Prisma, Products } from '@prisma/client';

export interface ProductRepositoryDomain {
  productById(id: number): Promise<Products | null>;

  productByIdTx(
    id: number,
    tx: Prisma.TransactionClient,
  ): Promise<Products | null>;

  products(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductsWhereUniqueInput;
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput;
  }): Promise<Products[]>;

  createProduct(data: Prisma.ProductsCreateInput): Promise<Products>;

  updateProductById(params: {
    id: number;
    data: Prisma.ProductsUpdateInput;
  }): Promise<Products>;

  updateProductByIdTx(params: {
    id: number;
    data: Prisma.ProductsUpdateInput;
    tx: Prisma.TransactionClient;
  }): Promise<Products>;

  updateProductQuantityTx(
    productId: number,
    quantity: number,
  ): Promise<Products>;

  deleteProductById(id: number): Promise<Products>;
}
