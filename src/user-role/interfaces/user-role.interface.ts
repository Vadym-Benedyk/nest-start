import { UserRole } from '@/src/role/interfaces/role.enum';
import { UserInterfaces } from '@/src/users/interfaces/user.interfaces';

export interface UserWithRolesInterface extends UserInterfaces{
  roles: UserRole[]
}

export interface UserRoleInterface {
  userId: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}