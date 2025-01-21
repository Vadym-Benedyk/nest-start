import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  Res,
  HttpStatus,
  Query,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users', description: 'Get all users' })
  @ApiResponse({ type: [UserDto] })
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

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
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`User with email ${email} not found`);
    }
    return user;
  }

  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Delete user by id',
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({
    summary: 'Update user by id',
    description: 'Update user by id',
  })
  @ApiResponse({ type: UserDto })
  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Res() res) {
    const updatedUser = await this.userService.updateUser(updateUserDto);

    if (!updatedUser) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res.status(HttpStatus.OK).json(updatedUser);
  }
}
