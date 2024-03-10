import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExamEntity } from './exam.entity';
import { ExamOptionEntity } from './exam-option.entity';

enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_OR_FALSE = 'true_or_false',
}

@Entity('exam_question')
export class ExamQuestionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExamEntity, (exam) => exam.questions)
  exam: ExamEntity;

  @Column()
  type: QuestionType;

  @Column()
  value: string;

  @Column()
  difficulty: QuestionDifficulty;

  @Column()
  multipleCorrectAnswers: boolean;

  @Column()
  points: number;

  @OneToMany(() => ExamOptionEntity, (option) => option.question)
  options: ExamOptionEntity[];

  @Column()
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
