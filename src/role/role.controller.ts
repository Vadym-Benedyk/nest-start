import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from '@/src/role/role.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleDto } from '@/src/role/dto/role.dto';
import { RoleInterface } from '@/src/role/interfaces/role.interfaces';
import { CreateRoleDto } from '@/src/role/dto/createRole.dto';
import { Roles } from '@/src/auth/decorators/get-role.decorator';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { RoleGuard } from '@/src/auth/guards/RoleGuard';



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


  @ApiBearerAuth()
  @Roles('emperor')
  @UseGuards(JwtAuthGuard, RoleGuard)
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
  async createNewRole( @Body() createRoleDto: CreateRoleDto ): Promise<RoleInterface> {
    return await this.roleService.createRole(createRoleDto)
  }


  @ApiBearerAuth()
  @Roles('emperor')
  @UseGuards(JwtAuthGuard, RoleGuard)
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
}
