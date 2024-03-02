import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthResendEmailConfirmationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
