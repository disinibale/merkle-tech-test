import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class WalletTopUpValidation {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10000000)
  readonly amount: number;
}

export class WalletTransferValidation {
  @IsString()
  @IsNotEmpty()
  to_username: string;

  @IsNumber()
  @Min(1)
  @Max(10000000)
  @IsNotEmpty()
  amount: number;
}
