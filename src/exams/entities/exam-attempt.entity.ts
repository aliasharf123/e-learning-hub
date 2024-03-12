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
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { ExamAttemptChoiceEntity } from './exam-attempt-choice.entity';

enum ExamAttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

@Entity('exam_attempt')
export class ExamAttemptEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExamEntity, (exam) => exam.attempts)
  exam: ExamEntity;

  @ManyToOne(() => UserEntity, (user) => user.examAttempts)
  student: UserEntity;

  @OneToMany(() => ExamAttemptChoiceEntity, (choice) => choice.attempt)
  choices?: ExamAttemptChoiceEntity[];

  @Column({ default: ExamAttemptStatus.IN_PROGRESS })
  status: ExamAttemptStatus;

  @Column({ nullable: true })
  endsAt?: Date;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
