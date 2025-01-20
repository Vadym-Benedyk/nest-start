import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create new user',
    description: 'Registration new user',
  })
  @ApiResponse({ type: CreateUserDto })
  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto) {
    const payload = await this.authService.registerUser(createUserDto);

    return {
      status: 'success',
      data: payload,
    };
  }
}
