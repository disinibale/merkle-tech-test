import { ApiProperty } from '@nestjs/swagger';

export class IsAuthReponse {
  @ApiProperty()
  username: string;
}
