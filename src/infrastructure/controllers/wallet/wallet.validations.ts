import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class WalletTopUpValidation {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly amount: string;
}

export class WalletTransferValidation {
  @IsNotEmpty()
  @IsString()
  to_username: string;

  @IsNumber()
  @Min(1)
  amount: string;
}
