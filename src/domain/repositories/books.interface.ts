import { Books, Prisma } from '@prisma/client';

export interface BooksRepositoryDomain {
  bookById(id: number): Promise<Books | null>;

  books(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BooksWhereUniqueInput;
    where?: Prisma.BooksWhereInput;
    orderBy?: Prisma.BooksOrderByWithRelationInput;
  }): Promise<Books[]>;

  createBook(data: Prisma.BooksCreateInput): Promise<Books>;

  updateBookById(params: {
    id: number;
    data: Prisma.BooksUpdateInput;
  }): Promise<Books>;

  deleteBookById(id: number): Promise<Books>;
}
