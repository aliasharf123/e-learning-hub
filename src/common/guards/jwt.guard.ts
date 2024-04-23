import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: Error, user: any, info: Error) {
    if (err || info || !user) {
      if (info instanceof TokenExpiredError) {
        throw new ForbiddenException('expired_token');
      } else if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException('malformed');
      } else {
        throw new UnauthorizedException(info?.message);
      }
    }

    return user;
  }
}
