import { RawRuleOf } from '@casl/ability';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AppAbility } from 'src/utils/casl';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  permissions: RawRuleOf<AppAbility>[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users?: UserEntity[] | null;
}
