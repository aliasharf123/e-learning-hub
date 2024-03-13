import { IsUUID } from 'class-validator';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELED = 'canceled',
}
@Entity('subscription')
export class SubscriptionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(() => SubjectEntity, (subject) => subject.subscriptions)
  subject: SubjectEntity;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ default: 1 })
  durationInMonths: number;

  @Column({ default: false })
  isCanceled: boolean;

  @Column({
    default: SubscriptionStatus.INACTIVE,
  })
  status: SubscriptionStatus;

  @Column()
  @IsUUID()
  key: string;

  @Column({ nullable: true })
  canceledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  keyExpiresAt: Date;
}
