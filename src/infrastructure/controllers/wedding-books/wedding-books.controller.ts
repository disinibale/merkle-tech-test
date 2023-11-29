import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/domain/decorators/role.decorator';
import { BookResourceFeature } from 'src/features/books/booksResource.feature';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';
import { RoleGuard } from 'src/infrastructure/commons/guards/role.guard';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import { CreateWeddingBookDto } from './wedding-books.validation';

@Controller('wedding-books')
export class WeddingBooksController {
  constructor(
    @Inject(PresenterModule.BOOKING_RESOURCES_FEATURE_PRESENTER)
    private readonly bookingResources: FeaturePresenter<BookResourceFeature>,
  ) {}

  @Get('/soal1')
  async soalDua(@Res() res: Response) {
    const data = [];

    for (let i = 1; i <= 5; i++) {
      const row = [];
      for (let j = 1; j <= 5; j++) {
        row.push(i * j);
      }
      data.push(row);
    }

    const response = [
      data[0].join(' '),
      data[1].join(' '),
      data[2].join(' '),
      data[3].join(' '),
      data[4].join(' '),
    ];

    res.json(response);
  }

  @Get('/note-gallery')
  @UseGuards(JwtAuthGuard)
  async noteGallery(@Res() res: Response) {
    const response = await this.bookingResources.getInstance().getAll();
    const responseData = response.map((el) => ({
      name: el.name,
      note: el.note,
    }));

    console.log(responseData);

    return res.status(200).json(responseData);
  }

  @Get('/:bookId')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async getWeddingBookById(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() res: Response,
  ) {
    const response = await this.bookingResources.getInstance().getOne(bookId);

    return res.status(200).json(response);
  }

  @Get('/')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async getAllWeddingBook(@Res() res: Response) {
    const response = await this.bookingResources.getInstance().getAll();

    return res.status(200).json(response);
  }

  @Post('/')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async createWeddingBook(
    @Body() body: CreateWeddingBookDto,
    @Res() res: Response,
  ) {
    const response = await this.bookingResources.getInstance().createOne(body);

    return res.status(200).json(response);
  }

  @Put('/:bookId')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async updateWeddingBookById(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() body: CreateWeddingBookDto,
    @Res() res: Response,
  ) {
    const response = await this.bookingResources
      .getInstance()
      .updateOne(bookId, body);

    return res.status(201).json(response);
  }

  @Delete('/:bookId')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async deleteWeddingBookById(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() res: Response,
  ) {
    const response = await this.bookingResources
      .getInstance()
      .deleteOne(bookId);

    return res.status(204).json(response);
  }
}
