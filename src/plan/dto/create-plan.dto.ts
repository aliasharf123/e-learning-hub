import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({
    example: 100,
    description: 'The cost of the plan',
  })
  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @ApiProperty({
    example: 'Basic',
    description: 'The name of the plan',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Basic plan',
    description: 'The description of the plan',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 6,
    description: 'The duration of the plan in months',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  durationInMonths?: number;

  @ApiProperty({
    example: '2024-03-15',
    description: 'The end date of the plan',
    required: false,
  })
  // @MinDate(new Date()) have bug always return error even if the date is valid
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
