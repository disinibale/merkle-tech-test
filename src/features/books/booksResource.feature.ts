import { Prisma } from '@prisma/client';
import { IException } from 'src/domain/exception/exception.interface';
import { BooksRepositoryDomain } from 'src/domain/repositories/books.interface';

export class BookResourceFeature {
  constructor(
    private readonly booksRepository: BooksRepositoryDomain,
    private readonly exceptionService: IException,
  ) {}
  async getOne(id: number) {
    const data = await this.booksRepository.bookById(id);

    if (!data)
      this.exceptionService.notFoundException({
        message: `Wedding with id ${id} book not found`,
      });

    return data;
  }
  async getAll() {
    return await this.booksRepository.books({});
  }
  async createOne(data: Prisma.BooksCreateInput) {
    return await this.booksRepository.createBook(data);
  }
  async updateOne(id: number, data: Prisma.BooksCreateInput) {
    const isDataExist = await this.booksRepository.bookById(id);

    if (!isDataExist) {
      this.exceptionService.notFoundException({
        message: `Wedding book with ${id} is not found!`,
      });
    }

    return await this.booksRepository.updateBookById({ id, data });
  }
  async deleteOne(id: number) {
    const isDataExist = await this.booksRepository.bookById(id);

    if (!isDataExist) {
      this.exceptionService.notFoundException({
        message: `Wedding book with ${id} is not found!`,
      });
    }

    return await this.booksRepository.deleteBookById(id);
  }
}
