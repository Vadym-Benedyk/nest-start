import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const userIdFromRequest = request.params.id;

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const canUpdateOwn = user.permissions.includes('update_own_user');
    const isOwner = user.id === userIdFromRequest;

    if (canUpdateOwn && isOwner) {
      return true;
    }

    throw new ForbiddenException('Access denied');
  }
}