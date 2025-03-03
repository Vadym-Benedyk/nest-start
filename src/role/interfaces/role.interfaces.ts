export interface createRoleInterface {
  role: string
}

export interface RoleInterface {
  id: string,
  role: string
}

export interface UserRolesInterface {
  userId: string,
  roleId: string,
  createdAt: Date,
  updatedAt: Date
}

export interface UpdateRoleInterface {
  updates: number,
  userRole: UserRolesInterface
}
