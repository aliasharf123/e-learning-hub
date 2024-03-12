import { ApiProperty } from '@nestjs/swagger';
import {
  QuestionDifficulty,
  QuestionType,
} from '../entities/exam-question.entity';
import { CreateExamOptionDto } from './create-exam-option.dto';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamOptionEntity } from '../entities/exam-option.entity';

export class CreateExamQuestionDto {
  @ApiProperty({
    description: 'Type of the question',
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @ApiProperty({
    description: 'Value of the question',
    example: 'What is the capital of France?',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(1024)
  value: string;

  @ApiProperty({
    description: 'Difficulty of the question',
    example: QuestionDifficulty.EASY,
    enum: QuestionDifficulty,
  })
  @IsEnum(QuestionDifficulty)
  @IsNotEmpty()
  difficulty: QuestionDifficulty;

  @ApiProperty({
    description: 'Multiple correct answers status of the question',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  multipleCorrectAnswers: boolean;

  @ApiProperty({
    description: 'Points of the question',
    example: 10,
  })
  @Min(0)
  @IsPositive()
  @IsInt()
  points: number;

  @ApiProperty({
    description: 'Options of the question',
    type: [CreateExamOptionDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateExamOptionDto)
  options: ExamOptionEntity[];

  @ApiProperty({
    description: 'Active status of the question',
    example: true,
  })
  @IsBoolean()
  active: boolean;
}
