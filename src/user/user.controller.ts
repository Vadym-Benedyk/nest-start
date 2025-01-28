import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  Query,
  UseGuards, UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/request/user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUsersDto } from './dto/request/get-users.dto';
import { UpdateUserInterface } from './interfaces/user.interfaces';
import { UserRoleDto } from './dto/request/user-role.dto';
import { ResponseUpdateUserDto } from './dto/response/response-update-user-role.dto';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard';
import { AdminGuard } from '../auth/guards/AdminGuard';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get users with filters',
    description: 'Get users with pagination, sorting and search',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an array of users',
    type: UserDto,
  })
  @Get('list')
  @ApiOperation({ summary: 'Get all users', description: 'Get all users' })
  @ApiResponse({ type: [UserDto] })
  async getUsers(@Query() queryParams: GetUsersDto) {
    return await this.userService.getUsers(queryParams);
  }

  @ApiOperation({ summary: 'Get user by id', description: 'Get user by id' })
  @ApiResponse({ type: UserDto })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @ApiOperation({
    summary: 'Get user by email',
    description: 'Get user by email',
  })
  @ApiResponse({ type: UserDto })
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Delete user by id',
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  @ApiOperation({
    summary: 'Update user by id',
    description: 'Update user by id',
  })
  @ApiResponse({ type: UserDto })
  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<UpdateUserInterface> {
    return await this.userService.updateUser(updateUserDto);
  }

  @ApiOperation({
    summary: 'Update User Role',
    description: 'Change the role of a user by ID.',
  })
  @ApiResponse({ type: ResponseUpdateUserDto })
  @ApiBody({ description: 'New role data', type: UserRoleDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('update/role')
  async updateRole(@Body() userRoleDto: UserRoleDto): Promise<UpdateUserInterface> {
    try {
      return await this.userService.updateRole(userRoleDto);
    } catch (error) {
      throw new UnauthorizedException(
        'Error by editing. User not found' + error,
      );
    }
  }
}
