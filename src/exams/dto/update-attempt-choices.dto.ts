import { ApiProperty } from '@nestjs/swagger';
import { ExamOptionEntity } from '../entities/exam-option.entity';
import { ExamQuestionEntity } from '../entities/exam-question.entity';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAttemptChoiceDto {
  @ApiProperty({
    description: 'Id of the question',
    example: 1,
  })
  @IsNotEmpty()
  questionId: ExamQuestionEntity['id'];

  @ApiProperty({
    description: 'Ids of the selected options',
    example: [1, 2],
  })
  @IsNotEmpty()
  // @ValidateNested({ each: true })
  @Type(() => Number)
  selectedOptionsIds: ExamOptionEntity['id'][];
}
