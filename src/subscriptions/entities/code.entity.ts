import { PlanEntity } from 'src/plan/entities/plan.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// All Activate code will be stored in this table
@Entity('code')
export class CodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 8, unique: true })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => PlanEntity, (plan) => plan.codes)
  plan: PlanEntity;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
