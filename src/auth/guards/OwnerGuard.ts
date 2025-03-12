import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';


@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceUserId = request.params.id || request.body.userId;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!resourceUserId) {
      throw new ForbiddenException('User ID is required for authorization');
    }

    if (user.id === resourceUserId) {
      return true;
    }

    throw new ForbiddenException('You do not have permission to access this resource');
  }
}