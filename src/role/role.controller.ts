import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from '@/src/role/role.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleDto } from '@/src/role/dto/role.dto';
import { RoleInterface } from '@/src/role/interfaces/role.interfaces';
import { NameRoleDto } from '@/src/role/dto/name-role.dto';
import { UpdateUserRoleDto } from '@/src/role/dto/update-user-role.dto';



@Controller('role')
export class RoleController {
  constructor( private readonly roleService: RoleService ) {}


  @ApiOperation({
    summary: 'Get all roles',
    description: 'Get roles list'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all roles',
    type: [RoleDto]
  })
  @Get()
  async getAllRoles(): Promise<RoleInterface[]> {
    return await this.roleService.getAllRoles()
  }


  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Get role by ID',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    type: RoleDto
  })
  @Get(':id')
  async getRole(@Param('id') id: string): Promise<RoleInterface> {
    return await this.roleService.getRoleByPK(id)
  }


  @ApiOperation({
    summary: 'Add role',
    description: 'Add new role'
  })
  @ApiResponse({
    status:HttpStatus.ACCEPTED,
    description: 'New role created',
    type: RoleDto
  })
  @Post()
  async createNewRole( @Body() createRoleDto: NameRoleDto ) {
    return await this.roleService.createRole(createRoleDto)
  }


  @ApiOperation({
    summary: 'Delete role',
    description: 'Delete role'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role successfully destroyed'
  })
  @Delete('delete/:id')
  async deleteRole(@Param('id') id: string): Promise<void> {
    return await this.roleService.deleteRole(id);
  }


  //------------------------ u s e r ------------------------
// @ApiBody({ description: 'New role data', type: UpdateUserRoleDto })
// @UseGuards(JwtAuthGuard, AdminGuard)
// @ApiBearerAuth()
// @Patch('update/role')

  @ApiOperation({
    summary: 'Update user role',
    description: 'Update user role'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Applied new role to user'
  })
  @Patch('update')
  async updateRole( @Body() updateRoleDto: UpdateUserRoleDto ): Promise<any> {
    return await this.roleService.updateRole(updateRoleDto);
  }

}
