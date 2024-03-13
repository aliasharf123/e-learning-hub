import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';

export class CreateExamDto {
  @ApiProperty({
    description: 'Title of the exam',
    example: 'Midterm Exam',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Description of the exam',
    example: 'This is a midterm exam',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
  description: string;

  @ApiProperty({
    description: 'Score of the exam',
    example: 100,
  })
  @IsPositive()
  @Min(0)
  score: number;

  @ApiProperty({
    description: 'Start date and time of the exam',
    example: '2024-10-20T14:00:00.000Z',
  })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'End date and time of the exam',
    example: '2024-10-20T16:00:00.000Z',
  })
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    description: 'Duration of the exam in minutes',
    example: 120,
  })
  @IsPositive()
  @IsNotEmpty()
  durationInMinutes: number;

  @ApiProperty({
    description: 'Subject of the exam',
    example: 1,
  })
  @IsNotEmpty()
  subjectId: SubjectEntity['id'];

  @ApiProperty({
    description: 'Active status of the exam',
    example: true,
  })
  active: boolean;
}
