import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(9999)
  readonly quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10000000)
  readonly price: number;
}

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(9999)
  readonly quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000000)
  readonly price: number;
}
