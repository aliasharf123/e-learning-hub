import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateExamOptionDto {
  @ApiProperty({
    description: 'Value of the option',
    example: 'Paris',
  })
  @MinLength(1)
  @MaxLength(1024)
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Correct status of the option',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  correct: boolean;

  @ApiProperty({
    description: 'Explanation of the option',
    example: 'Paris is the capital of France',
  })
  @MaxLength(1024)
  explanation?: string;

  @ApiProperty({
    description: 'Active status of the option',
    example: true,
  })
  active: boolean;
}
