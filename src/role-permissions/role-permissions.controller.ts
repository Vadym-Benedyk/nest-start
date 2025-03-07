import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { RolePermissionsService } from '@/src/role-permissions/role-permissions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolePermissionDto } from '@/src/role-permissions/dto/role-permission.dto';
import { AddPermissionToRoleDto } from '@/src/role-permissions/dto/add-permission-to-role.dto';
import {
  RolePermissionInterface,
  RolesWithPermissionInterface,
} from '@/src/role-permissions/interfaces/role-permission.interfaces';
import { PermissionDto } from '@/src/permission/dto/permission.dto';


@ApiTags('Roles with Permissions')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @ApiOperation({ summary: 'Get all roles with current permissionId', description: 'Get all roles with permission ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [{
        id: 'role UUID',
        role: 'role name',
        permissions: { type: 'array', items: { $ref: 'PermissionInterface' } },
      }]
    }
  })
  @Get('permission/:roleId')
  async getRolesWithPermissionId(@Param('roleId') roleId: string): Promise<RolesWithPermissionInterface[]> {
    return await this.rolePermissionsService.getRolesWithPermissionId(roleId);
  }

  @ApiOperation({ summary: 'Get Permissions by roleId', description: 'Get Permissions by roleId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type:  PermissionDto
  })
  @Get(':roleId')
  async getRolePermissions(@Param('roleId') roleId: string): Promise<RolesWithPermissionInterface> {
    return await this.rolePermissionsService.getRolePermissions(roleId);
  }


  @ApiOperation({ summary: 'Add permission to role', description: 'Add permission to role' })
  @ApiResponse({ type: RolePermissionDto })
  @Post()
  async addPermissionToRole(@Body() addPermissionToRoleDto: AddPermissionToRoleDto): Promise<RolePermissionInterface> {
    return await this.rolePermissionsService.addPermissionToRole(addPermissionToRoleDto);
  }


  @ApiOperation({ summary: 'Remove permission from a role', description: 'Remove certain role permission '})
  @ApiResponse({ type: RolePermissionDto, status: HttpStatus.OK, description: 'Permission  removed from role' })
  @Delete(':roleId/:permissionId')
  async removeRolePermission(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string): Promise<any> {
    return this.rolePermissionsService.deletePermissionFromRole(roleId, permissionId)
  }

}
