import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
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
  @IsOptional()
  startsAt?: Date;

  @ApiProperty({
    description: 'End date and time of the exam',
    example: '2024-10-20T16:00:00.000Z',
  })
  @IsOptional()
  endsAt?: Date;

  @ApiProperty({
    description: 'Duration of the exam in minutes',
    example: 120,
  })
  @IsPositive()
  @Min(1)
  @IsOptional()
  durationInMinutes: number;

  @ApiProperty({
    description: 'Enable after end time',
    example: false,
  })
  @IsOptional()
  enableAfterEndTime?: boolean;

  @ApiProperty({
    description: 'Reveal answers at end',
    example: false,
  })
  @IsOptional()
  revealAnswersAtEnd?: boolean;

  @ApiProperty({
    description: 'Subject of the exam',
    example: 1,
  })
  @IsNotEmpty()
  subjectId: SubjectEntity['id'];

  // @ApiProperty({
  //   description: 'Active status of the exam',
  //   example: true,
  // })
  // active: boolean;
}
