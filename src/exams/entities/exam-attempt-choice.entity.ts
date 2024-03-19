import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => ExamOptionEntity, (option) => option.selectedBy)
  @JoinTable()
  selectedOptions: ExamOptionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
