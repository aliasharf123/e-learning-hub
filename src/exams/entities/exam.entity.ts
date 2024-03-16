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
import { ExamQuestionEntity } from './exam-question.entity';
import { ExamAttemptEntity } from './exam-attempt.entity';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';

@Entity('exam')
export class ExamEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  score: number;

  @Column({ nullable: true })
  startsAt?: Date;

  @Column({ nullable: true })
  endsAt?: Date;

  // in case of a timed exam that does not have a specific start and end date
  @Column({ nullable: true })
  durationInMinutes?: number;

  @Column({ default: false })
  enableAfterEndTime: boolean;

  @Column({ default: false })
  revealAnswersAtEnd: boolean;

  @Column({ default: false })
  isAttemptedOnce: boolean;

  @Column()
  isLiveExam: boolean;

  @OneToMany(() => ExamQuestionEntity, (question) => question.exam, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  questions: ExamQuestionEntity[];

  @OneToMany(() => ExamAttemptEntity, (attempt) => attempt.exam)
  attempts: ExamAttemptEntity[];

  @ManyToOne(() => SubjectEntity, (subject) => subject.exams)
  subject: SubjectEntity;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
