import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserWithRolesDto } from '@/src/user-role/dto/user-with-roles.dto';
import { UserRoleService } from '@/src/user-role/user-role.service';
import { UsersInRoleInterface, UserWithRolesInterface } from '@/src/user-role/interfaces/user-role.interface';
import { UserRoleDto } from '@/src/user-role/dto/user-role.dto';
import { Response } from 'express';
import { RoleDto } from '@/src/role/dto/role.dto';
import { RoleInterface } from '@/src/role/interfaces/role.interfaces';
import { UsersInRoleDto } from '@/src/user-role/dto/users-in-role.dto';
import { Permissions } from '@/src/auth/decorators/get-permission.decorator';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { PermissionsGuard } from '@/src/auth/guards/PermissionsGuard';


@ApiTags('User Roles')
@Controller('user-role')
export class UserRoleController {
  constructor( private readonly userRoleService: UserRoleService ) {}


  @ApiOperation({ summary: 'Get user roles by userId', description: 'Get user roles by userId' })
  @ApiResponse({ type: RoleDto, status: HttpStatus.OK, example: { id: 'UUID', role: 'admin' } })
  @Get('roles/:id')
  async getUserRoles(@Param('id') id: string): Promise<RoleInterface[]> {
    return await this.userRoleService.getUserRoles(id)
  }


  @ApiOperation({ summary: 'Get user with roles', description: 'Get user by id' })
  @ApiResponse({ type: UserWithRolesDto })
  @Get('role/:id')
  async getUserWithRoles(@Param('id') id: string): Promise<UserWithRolesInterface> {
    return await this.userRoleService.getUserWithRoles(id)
  }


  @ApiOperation({ summary: 'Get role with users by roleId', description: 'Find list of users by selected role'})
  @ApiResponse({ type: UsersInRoleDto})
  @Get('users/:id')
  async getUsersWithRole(@Param('id') id: string): Promise<UsersInRoleInterface> {
    return await this.userRoleService.getUsersWithRole(id)
  }


  @ApiBearerAuth()
  @Permissions('add-role')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Add role to user', description: 'Add role to user by id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role added to user',
    type: UserWithRolesDto
  })
  @Post()
  async addRoleToUser(
    @Body() userRoleDto: UserRoleDto,
    @Res() res: Response,
  ): Promise<any> {

    try {
      const {firstName, lastName, roles} = await this.userRoleService.addNewRoleToUser(userRoleDto);

      return res.status(201).json({
        status: 'success',
        message: `Role ${roles} added to user ${firstName} ${lastName}`,
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: error,
      });
    }
  }


  @ApiBearerAuth()
  @Permissions('delete-role')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Remove role from user', description: 'Remove role from user by userId and roleId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role removed from user',
    type: UserWithRolesDto
  })
  @Delete(':userId/:roleId')
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string
  ): Promise<UserWithRolesInterface> {
    return this.userRoleService.removeRole(userId, roleId);
  }

}
