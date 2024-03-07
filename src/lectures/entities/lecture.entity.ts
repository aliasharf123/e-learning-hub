import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lecture')
export class LectureEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => SubjectEntity, (subject) => subject.lectures)
  subject: SubjectEntity;
}
