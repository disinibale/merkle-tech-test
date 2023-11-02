import { ApiProperty } from '@nestjs/swagger';

export class IsAuthResponse {
  @ApiProperty()
  username: string;
}
