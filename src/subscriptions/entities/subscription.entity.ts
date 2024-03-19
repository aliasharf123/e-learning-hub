import { PlanEntity } from 'src/plan/entities/plan.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// export enum SubscriptionStatus {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive',
//   CANCELED = 'canceled',
// }
@Entity('subscription')
export class SubscriptionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
