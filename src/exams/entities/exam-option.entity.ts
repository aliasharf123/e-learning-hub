import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExamQuestionEntity } from './exam-question.entity';
import { ExamAttemptChoiceEntity } from './exam-attempt-choice.entity';
import { Expose } from 'class-transformer';

@Entity('exam_option')
export class ExamOptionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExamQuestionEntity, (question) => question.options)
  question: ExamQuestionEntity;

  @Column()
  value: string;

  // @Exclude({ toPlainOnly: true })
  @Expose({ groups: ['admin', 'assistant'] })
  @Column()
  correct: boolean;

  @Column({ nullable: true })
  explanation?: string;

  @ManyToMany(() => ExamAttemptChoiceEntity, (choice) => choice.selectedOptions)
  selectedBy: ExamAttemptChoiceEntity[];

  @DeleteDateColumn()
  deletedAt: Date;
}
