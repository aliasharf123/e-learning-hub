import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthConfirmEmailHashDto {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}
