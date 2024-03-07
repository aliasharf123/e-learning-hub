import { GradeLevelEntity } from 'src/grade-levels/entities/grade-level.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EnrollmentEntity } from './enrollment.entity';
import { LectureEntity } from 'src/lectures/entities/lecture.entity';

@Entity('subject')
export class SubjectEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => GradeLevelEntity, (gradeLevel) => gradeLevel.subjects)
  gradeLevel: GradeLevelEntity;

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.subject)
  enrollments: EnrollmentEntity[];

  @OneToMany(() => LectureEntity, (lecture) => lecture.subject)
  lectures: LectureEntity[];
}
