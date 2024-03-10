import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubjectEntity } from './subject.entity';

@Entity('enrollment')
export class EnrollmentEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (student) => student.enrollments)
  student: UserEntity;

  @ManyToOne(() => SubjectEntity, (subject) => subject.enrollments)
  subject: SubjectEntity;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  deletedAt: Date;
}
