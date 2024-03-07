import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';
import { Exclude } from 'class-transformer';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @ApiHideProperty()
  @Exclude()
  gradeLevelId?: number | undefined;
}
