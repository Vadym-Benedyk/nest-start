import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import * as util from 'node:util';

@Injectable()
export class SelfGuard implements CanActivate {
  private readonly logger = new Logger(SelfGuard.name);

  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userFromRequest = request.user;
    this.logger.log( `get user from access token User: ${util.inspect(userFromRequest.id, { depth: null })}` );

    const userFromDb = await this.userService.getUserById(userFromRequest.id);
    this.logger.log( `User ID from User: ${util.inspect(userFromDb.id, { depth: null })}` );

    if (userFromRequest.id !== userFromDb.id) {
      this.logger.warn('Unauthorized access attempt');
      return false;
    }
    return true;
  }
}