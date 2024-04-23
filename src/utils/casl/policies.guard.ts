import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '.';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { PolicyHandler } from './policy.interface';
import { CHECK_POLICIES_KEY_META } from 'src/common/constant';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY_META,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest<NestifyRequest>();

    const { user } = request;

    const ability = this.caslAbilityFactory.createForUser(user as UserEntity);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, request, ability),
    );
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    request: NestifyRequest,
    ability: AppAbility,
  ) {
    if (typeof handler === 'function') return handler(request, ability);

    return handler.handle(request, ability);
  }
}
