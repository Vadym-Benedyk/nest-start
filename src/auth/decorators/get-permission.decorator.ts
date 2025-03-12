import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '@/src/permission/permission.service';

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) return true; // якщо пермішени не потрібні для цього маршруту

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const userPermissions = await this.permissionService.getPermissionsByUserId(user.id);
    // console.log('-= userPermissions =-', userPermissions);

    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }
}