import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateWeddingBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  note: string;
}
