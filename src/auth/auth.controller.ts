import { UserDto } from '../user/dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create new user',
    description: 'Registration new user',
  })
  @ApiResponse({ type: UserDto })
  @Post('register')
  public async register(@Body() createUserDto: UserDto) {
    const payload = await this.authService.registerUser(createUserDto);

    return {
      status: 'success',
      data: payload,
    };
  }
}
