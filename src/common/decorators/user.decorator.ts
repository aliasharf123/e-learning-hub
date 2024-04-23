import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

/*
The `LoggedInUser` decorator is used to get the user object from the request object.
*/
export const LoggedInUser = createParamDecorator(
  (data: keyof UserEntity, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<NestifyRequest>();

    const user = request.user as UserEntity;

    return data ? user[data] : user;
  },
);
