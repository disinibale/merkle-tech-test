import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
