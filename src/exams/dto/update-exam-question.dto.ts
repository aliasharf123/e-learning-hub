import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { CreateExamQuestionDto } from './create-exam-question.dto';
import { Exclude } from 'class-transformer';

export class UpdateExamQuestionDto extends PartialType(CreateExamQuestionDto) {
  @ApiHideProperty()
  @Exclude()
  examId?: number | undefined;

  // @ApiHideProperty()
  // @Exclude()
}
