import { GradeLevelEntity } from 'src/grade-levels/entities/grade-level.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EnrollmentEntity } from './enrollment.entity';
import { LectureEntity } from 'src/lectures/entities/lecture.entity';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';
import { ExamEntity } from 'src/exams/entities/exam.entity';

@Entity('subject')
export class SubjectEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => FileEntity, { eager: true })
  @JoinColumn()
  photo?: FileEntity | null;

  @Column()
  gradeLevelId: number;

  @ManyToOne(() => GradeLevelEntity, (gradeLevel) => gradeLevel.subjects)
  @JoinColumn({ name: 'gradeLevelId' })
  gradeLevel: GradeLevelEntity;

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.subject)
  enrollments: EnrollmentEntity[];

  @OneToMany(() => LectureEntity, (lecture) => lecture.subject)
  lectures: LectureEntity[];

  @OneToMany(() => ExamEntity, (exam) => exam.subject)
  exams: ExamEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
