import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserWithRolesDto } from '@/src/user-role/dto/user-with-roles.dto';
import { UserRoleService } from '@/src/user-role/user-role.service';
import { UserWithRolesInterface } from '@/src/user-role/interfaces/user-role.interface';
import { UserRoleDto } from '@/src/user-role/dto/user-role.dto';
import { Response } from 'express';


@ApiTags('User Roles')
@Controller('user-role')
export class UserRoleController {
  constructor( private readonly userRoleService: UserRoleService ) {}


  @ApiOperation({ summary: 'Get user with roles', description: 'Get user by id' })
  @ApiResponse({ type: UserWithRolesDto })
  @Get('role/:id')
  async getUserWithRoles(@Param('id') id: string): Promise<UserWithRolesInterface> {
    return await this.userRoleService.getUserWithRoles(id)
  }

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
        message: `Roles ${roles} added to user ${firstName} ${lastName}`,
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: error,
      });
    }
  }


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

  //------------------------ u s e r ------------------------
// @ApiBody({ description: 'New role data', type: UpdateUserRoleDto })
// @UseGuards(JwtAuthGuard, AdminGuard)
// @ApiBearerAuth()
// @Patch('update/role')

  // @ApiOperation({
  //   summary: 'Update user role',
  //   description: 'Update user role'
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'New role applied to user'
  // })
  // @Patch('user')
  // async updateUserRole( @Body() updateUserRoleDto: UpdateUserRoleDto ): Promise<UserWithRolesInterface> {
  //   return await this.roleService.updateUserRole(updateUserRoleDto);
  // }

  //
  // @ApiOperation({
  //   summary: 'Update User Role',
  //   description: 'Change the role of a users by ID.',
  // })
  // @ApiResponse({ type: ResponseUpdateUserDto })
  // @ApiBody({ description: 'New role data', type: UpdateUserRoleDto })
  // @UseGuards(JwtAuthGuard, AdminGuard)
  // @ApiBearerAuth()
  // @Patch('update/role')
  // async updateRole(
  //   @Body() userRoleDto: UpdateUserRoleDto,
  // ): Promise<UpdateUserInterface> {
  //   try {
  //     return await this.userService.updateRole(userRoleDto);
  //   } catch (error) {
  //     throw new UnauthorizedException(
  //       'Error by editing. User not found' + error,
  //     );
  //   }
  // }
}
