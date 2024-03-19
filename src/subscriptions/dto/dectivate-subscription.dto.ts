import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class DeactivateSubscriptionDto {
  @ApiProperty({
    example: '123e4567',
    description: 'The subscription key',
  })
  @Length(8, 8)
  @IsString()
  @IsNotEmpty()
  key: string;
}
