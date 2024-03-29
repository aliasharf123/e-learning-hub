import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ActivateSubscriptionDto {
  @ApiProperty({
    example: '123e4567',
    description: 'The subscription key',
  })
  @Length(8, 8)
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: '1',
    description: 'The user ID',
  })
  @IsString()
  @IsNotEmpty()
  userID: string;
}
