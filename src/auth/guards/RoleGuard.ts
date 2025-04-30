import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ROLES_KEY } from '@/src/auth/decorators/get-role.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied');
    }

    const hasRole = user.roles.some((role: string) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('User hasn\'t enough permissions' );
    }

    return true;
  }
}
