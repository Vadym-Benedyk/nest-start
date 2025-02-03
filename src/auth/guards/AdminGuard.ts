import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import { UserRole } from '@/src/users/interfaces/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const dbUser = await this.userService.getUserById(user.id);

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    if (!dbUser || dbUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only Admins can access this route.');
    }

    return true;
  }
}
