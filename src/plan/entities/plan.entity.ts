import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { CodeEntity } from 'src/subscriptions/entities/code.entity';
import { SubscriptionEntity } from 'src/subscriptions/entities/subscription.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('plan')
export class PlanEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  cost: number;

  @Column({ nullable: true })
  durationInMonths?: number;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  startDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => SubjectEntity, (subject) => subject.plans)
  @JoinColumn({ name: 'subjectId' })
  subject: SubjectEntity;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.plan)
  @JoinColumn()
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => CodeEntity, (code) => code.plan)
  @JoinColumn()
  codes: CodeEntity[];

  @Column()
  subjectId: number;
}
