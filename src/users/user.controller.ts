import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  Query, UseGuards, Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserInterface, UserInterfaces } from './interfaces/user.interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { OwnerGuard } from '@/src/auth/guards/OwnerGuard';
import { Response } from 'express';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users', description: 'Get all users' })
  @ApiResponse({ type: [CreateUserDto] })
  @Get()
  async getAllUsers(): Promise<UserInterfaces[]> {
    return await this.userService.getAllUsers()
  }


  @ApiOperation({
    summary: 'Get users with filters',
    description: 'Get users with pagination, sorting and search',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an array of users',
    type: CreateUserDto,
  })
  @Get('list')
  async getUsers(@Query() queryParams: GetUsersDto) {
    return await this.userService.getUsers(queryParams);
  }


  @ApiOperation({ summary: 'Get user by id', description: 'Get user by id' })
  @ApiResponse({ type: CreateUserDto })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }


  @ApiOperation({
    summary: 'Get user by email',
    description: 'Get user detail by email',
  })
  @ApiResponse({ type: CreateUserDto })
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }


  @ApiOperation({
    summary: 'Delete users by id',
    description: 'Delete users by id',
  })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @Delete(':id')


  async deleteUser(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    await this.userService.deleteUser(id);
    return res.status(HttpStatus.OK).json({ message: 'User deleted successfully' });
  }


  @ApiOperation({
    summary: 'Update users by id',
    description: 'Update users by id',
  })
  @ApiResponse({ type: CreateUserDto })
  @Patch('update')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserInterface> {
    return await this.userService.updateUser(updateUserDto);
  }

}