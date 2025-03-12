import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable, Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRoleService } from '@/src/user-role/user-role.service';
import { PermissionService } from '@/src/permission/permission.service';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
    private readonly permissionService: PermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      this.logger.warn('No token provided');
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userWithRoles: any = await this.userRoleService.getUserWithRoles(payload.userId);
      const userPermissions: any = await this.permissionService.getPermissionsByUserId(payload.userId);

      if (!userWithRoles) {
        this.logger.warn('User not found');
        throw new UnauthorizedException('User not found');
      }

      request.user = {
        id: userWithRoles.id,
        roles: userWithRoles.roles,
        permissions: userPermissions
      };

    } catch {
      this.logger.error('Invalid token');
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
