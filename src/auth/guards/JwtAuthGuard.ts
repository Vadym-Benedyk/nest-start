import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/src/users/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { UserRoleService } from '@/src/user-role/user-role.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    // private readonly userRoleService: UserRoleService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user: any = await this.userService.getUserById(payload.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Отримуємо всі ролі та дозволи користувача
      // const userRoles = await this.userRoleService.getUserRoles(user.id);
      // const userPermissions = await this.userRoleService.getUserPermissions(user.id);

      request.user = user.dataValues;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
