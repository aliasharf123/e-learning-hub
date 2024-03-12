import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExamQuestionEntity } from './exam-question.entity';

@Entity('exam_option')
export class ExamOptionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExamQuestionEntity, (question) => question.options)
  question: ExamQuestionEntity;

  @Column()
  value: string;

  @Column()
  correct: boolean;

  @Column({ nullable: true })
  explanation?: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
