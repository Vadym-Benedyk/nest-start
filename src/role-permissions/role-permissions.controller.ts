import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolePermissionsService } from '@/src/role-permissions/role-permissions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolePermissionDto } from '@/src/role-permissions/dto/role-permission.dto';
import { RoleInterface } from '@/src/role/interfaces/role.interfaces';
import { AddPermissionToRoleDto } from '@/src/role-permissions/dto/add-permission-to-role.dto';


@ApiTags('Roles with Permissions')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @ApiOperation({ summary: 'Get roles with permission ID', description: 'Get all roles with permission ID' })
  @ApiResponse({ type: RolePermissionDto })
  @Get('permission/:roleId')
  async getRolesWithPermissionId(@Param('roleId') roleId: string): Promise<RoleInterface[]> {
    return await this.rolePermissionsService.getRolesWithPermissionId(roleId);
  }


  @ApiOperation({ summary: 'Add permission to role', description: 'Add permission to role' })
  @ApiResponse({ type: RolePermissionDto })
  @Post()
  async addPermissionToRole(@Body() addPermissionToRoleDto: AddPermissionToRoleDto): Promise<any> {
    return await this.rolePermissionsService.addPermissionToRole(addPermissionToRoleDto);
  }


}
