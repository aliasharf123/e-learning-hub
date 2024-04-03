import type {
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/common/@types';
import { ExamAttemptChoiceEntity } from 'src/exams/entities/exam-attempt-choice.entity';
import { ExamAttemptEntity } from 'src/exams/entities/exam-attempt.entity';
import { ExamEntity } from 'src/exams/entities/exam.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { User } from 'src/users/domain/user';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
// import type { Tag } from '@entities';
// import { Comment, Post, User } from '@entities';

export type Subjects =
  | InferSubjects<
      | typeof User
      | typeof ExamEntity
      | typeof ExamAttemptEntity
      | typeof ExamAttemptChoiceEntity
    >
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (!user.role) {
      return build({}); // no permissions
    }
    /* Giving the user the ability to read and write to everything if they are an admin. */

    if (user.role.id === RoleEnum.admin)
      can(Action.Manage, 'all'); // read-write access to everything
    else can(Action.Read, 'all'); // read-only access to everything

    // user specific permissions
    can(Action.Update, User, { id: user.id });
    cannot(Action.Delete, User);

    // exam specific permissions
    can([Action.Update], ExamAttemptChoiceEntity, {
      attempt: { student: user },
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
