import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AddOrRemoveItemDTO {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(999)
  quantity: number;
}
