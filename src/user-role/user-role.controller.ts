import { Body, Controller, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserWithRolesDto } from '@/src/user-role/dto/user-with-roles.dto';
import { UserRoleService } from '@/src/user-role/user-role.service';
import { UserWithRolesInterface } from '@/src/user-role/interfaces/user-role.interface';
import { UserRoleDto } from '@/src/user-role/dto/user-role.dto';


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
  async addRoleToUser( @Body() userRoleDto: UserRoleDto ): Promise<any> {
    return await this.userRoleService.addNewRoleToUser(userRoleDto)
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
