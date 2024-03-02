import { IsEmail } from 'class-validator';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email-verification')
export class EmailVerificationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  emailToken: string;

  @Column()
  timestamp: Date;
}
