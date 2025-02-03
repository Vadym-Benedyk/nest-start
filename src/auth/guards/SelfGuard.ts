import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import * as util from 'node:util';

@Injectable()
export class SelfGuard implements CanActivate {
  private readonly logger = new Logger(SelfGuard.name);

  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userFromRequest = request.user;
    const bodyUserId = request.body.userId;
    this.logger.log( `get user from access token User: ${util.inspect(userFromRequest.id, { depth: null })}` );

    const userFromDb = await this.userService.getUserById(userFromRequest.id);
    this.logger.log( `User ID from User: ${util.inspect(userFromDb.id, { depth: null })} with Role: ${userFromDb.role}` );

    if (userFromRequest.id !== userFromDb.id) {
      this.logger.warn('Request user is not in range of users database');
      return false;
    }

    if (userFromDb !== bodyUserId && userFromDb.role !== 'admin') {
      this.logger.warn('Access user has no permission to access this route');
      throw new ForbiddenException(
        'Access user has no permission to access this route',
      );
    }

    return true;
  }
}