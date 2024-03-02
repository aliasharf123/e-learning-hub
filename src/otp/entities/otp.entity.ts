import { IsEmail } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OTPType {
  EMAIL_CONFIRMATION = 'email_confirmation',
  PASSWORD_RESET = 'password_reset',
}

@Entity()
export class OTPEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => UserEntity, (user) => user.otps)
  // @JoinColumn()
  // user: UserEntity;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  otp: string;

  @Column({
    enum: OTPType,
  })
  type: OTPType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  expiresAt: Date;
}
