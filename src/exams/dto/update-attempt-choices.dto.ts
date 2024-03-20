import { ExamOptionEntity } from '../entities/exam-option.entity';
import { ExamQuestionEntity } from '../entities/exam-question.entity';

export class UpdateAttemptChoiceDto {
  attemptId: number;
  questionId: ExamQuestionEntity['id'];
  selectedOptionsIds: ExamOptionEntity['id'][];
}
