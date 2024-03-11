import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExamAttemptEntity } from './exam-attempt.entity';
import { ExamQuestionEntity } from './exam-question.entity';
import { ExamOptionEntity } from './exam-option.entity';

@Entity('exam_attempt_choice')
export class ExamAttemptChoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExamAttemptEntity, (attempt) => attempt.choices)
  attempt: ExamAttemptEntity;

  @OneToOne(() => ExamQuestionEntity)
  question: ExamQuestionEntity;

  @OneToOne(() => ExamOptionEntity)
  choice: ExamOptionEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
