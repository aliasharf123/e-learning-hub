import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateExamOptionDto } from './create-exam-option.dto';

export class UpdateExamOptionDto extends PartialType(CreateExamOptionDto) {
  @ApiHideProperty()
  @Exclude()
  questionId?: number | undefined;
}
