import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  Query, UseGuards, Res, Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation, ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserInterface, UserInterfaces, UserWithoutPasswordInterfaces } from './interfaces/user.interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { OwnerGuard } from '@/src/auth/guards/OwnerGuard';
import { Response } from 'express';
import { IdDto } from '@/src/users/dto/id.dto';
import { UserDto } from '@/src/users/dto/user.dto';
import { UserSecureDto } from '@/src/users/dto/userSecure.dto';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users', description: 'Get all users' })
  @ApiResponse({ type: [CreateUserDto] })
  @Get()
  async getAllUsers(): Promise<UserWithoutPasswordInterfaces[]> {
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
  async getUsers(@Query() getUsersDto: GetUsersDto) {
    return await this.userService.getUsers(getUsersDto);
  }


  @ApiOperation({
    summary: 'Get user by id',
    description: 'Get user by id'
  })
  @ApiParam({ name: 'id', required: true, type: 'string', description: 'UUID of the user' })
  @ApiResponse({ type: UserSecureDto })
  @Post(':id')
  async getUserById(@Param() idDto: IdDto): Promise<UserSecureDto> {
    const {password, ...user} = await this.userService.getUserById(idDto.id);
    return user;
  }


  @ApiOperation({
    summary: 'Get user by email',
    description: 'Get user detail by email',
  })
  @ApiResponse({ type: UserSecureDto })
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserSecureDto> {
    const {password, ...user} = await this.userService.getUserByEmail(email);
    return user;
  }


  @ApiOperation({
    summary: 'Delete users by id',
    description: 'Delete users by id',
  })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @Delete(':id')


  async deleteUser(@Param('id') idDto: IdDto, @Res() res: Response): Promise<Response> {
    await this.userService.deleteUser(idDto);
    return res.status(HttpStatus.OK).json({ message: 'User deleted successfully' });
  }


  @ApiOperation({
    summary: 'Update users by id',
    description: 'Update users by id',
  })
  @ApiResponse({ type: UserDto })
  @Patch('update')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserInterface> {
    return await this.userService.updateUser(updateUserDto);
  }

}