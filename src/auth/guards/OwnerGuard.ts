import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import util from 'node:util';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request; // userId from token
    // const userIdFromRequest = request.params.id; //undefined
    const bodyUserId = request.body.userId; // userId from body request

    console.log('User from request', user);
    // console.log('User ID from request', userIdFromRequest);
    console.log('User ID from request', bodyUserId);


    for (const role of user.roles) {
      console.log(role);
    }

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    // const canUpdateOwn = user.permissions.includes('update_own_user');
    // const isOwner = user.id === userIdFromRequest;
    //
    // if (canUpdateOwn && isOwner) {
    //   return true;
    // }

    throw new ForbiddenException('Access denied');
  }
}


// async canActivate(context: ExecutionContext): Promise<boolean> {
//   const request = context.switchToHttp().getRequest();
//   const userFromRequest = request.user;
//   const bodyUserId = request.body.userId;
//   this.logger.log( `get user from access token User: ${util.inspect(userFromRequest.id, { depth: null })}` );
//
//   const userFromDb = await this.userService.getUserById(userFromRequest.id);
//   this.logger.log( `User ID from User: ${util.inspect(userFromDb.id, { depth: null })} with Role: ${userFromDb.role}` );
//
//   if (userFromRequest.id !== userFromDb.id) {
//   this.logger.warn('Request user is not in range of users database');
//   return false;
// }
//
// if (userFromDb !== bodyUserId && userFromDb.role !== 'admin') {
//   this.logger.warn('Access user has no permission to access this route');
//   throw new ForbiddenException(
//     'Access user has no permission to access this route',
//   );
// }
