import {
  ForcedSubject,
  MongoAbility,
  RawRuleOf,
  createMongoAbility,
} from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Action, Subject } from 'src/common/@types';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

export type Abilities = [
  Action,
  Subject | ForcedSubject<Exclude<typeof Subject, 'all'>>,
];
export type AppAbility = MongoAbility<Abilities>;
export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  createMongoAbility<AppAbility>(rules);

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    if (!user.role) {
      throw new ForbiddenException('User does not have a role');
    }
    return createAbility(user.role.permissions);
  }
}
