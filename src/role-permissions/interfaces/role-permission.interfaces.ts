import { PermissionInterface } from '@/src/permission/interfaces/permission.interface';

export interface RolePermissionInterface {
  roleId: string;
  permissionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolesWithPermissionInterface {
  id: string,
  role: string,
  permissions: PermissionInterface[]
}