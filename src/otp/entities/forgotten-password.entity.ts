import { IsEmail } from 'class-validator';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('forgotten-password')
export class ForgottenPasswordEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  newPasswordToken: string;

  @Column()
  timestamp: Date;
}
