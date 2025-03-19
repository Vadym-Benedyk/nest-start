import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhoneService } from '@/src/phone/phone.service';
import { PhoneDto } from '@/src/phone/dto/phone.dto';
import { PhoneInterfaces, ResponseStatusInterface } from '@/src/phone/interfaces/phone.interfaces';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { VerifyUserPhoneDto } from '@/src/phone/dto/verify-user-phone.dto';
import { VerifyPhoneDto } from '@/src/sms/dto/verifyPhone.dto';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { RoleGuard } from '@/src/auth/guards/RoleGuard';
import { Roles } from '@/src/auth/decorators/get-role.decorator';
import { OwnerGuard } from '@/src/auth/guards/OwnerGuard';


@ApiTags('Phone')
@ApiBearerAuth()
@Roles('emperor', 'senator', 'legionary', 'general')
@UseGuards(JwtAuthGuard, RoleGuard, OwnerGuard)
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @ApiOperation({
    summary: 'Get phone user',
    description: 'Get user phone by userId',
  })
  @ApiResponse({ status: 200, type: PhoneDto })
  @Get(':userId')
  async getUserPhone( @Param('userId') userId: string ): Promise<any> {
    return this.phoneService.getPhone(userId);
  }


  @ApiOperation({
    summary: 'Add phone to user',
    description: 'Add phone to user by userId'
  })
  @ApiResponse({ status: 200, type: PhoneDto })
  @Post()
  async addPhone( @Body() phoneDto: PhoneDto ): Promise<any> {
    return this.phoneService.addPhone(phoneDto);
  }


  @ApiOperation({
    summary: 'Update user phone',
    description: 'Update user phone by userId',
  })
  @ApiResponse({ status: 200, type: UpdatePhoneDto })
  @Patch('update')
  async updateUserPhone( @Body() updatePhoneDto: UpdatePhoneDto): Promise<PhoneInterfaces> {
    return this.phoneService.updatePhone(updatePhoneDto);
  }


  @ApiOperation({
    summary: 'Delete user phone',
    description: 'Delete user phone by userId and phone',
  })
  @ApiResponse({ status: 200, description: 'delete message status' })
  @Delete(':userId/:phone')
  async deleteUserPhone(
    @Param('userId') userId: string,
    @Param('phone') phone: string
  ): Promise<ResponseStatusInterface> {
    return this.phoneService.deletePhone(userId, phone);
  }


  @ApiOperation({
    summary: 'Ask OTP',
    description: 'Get verify phone by userId and OTP',
  })
  @ApiResponse({ status: 200, type: VerifyUserPhoneDto })
  @Post('verify')
  async verifyPhone( @Body() phoneDto: PhoneDto ): Promise<ResponseStatusInterface> {
    return this.phoneService.verifyPhone(phoneDto)
  }

  @ApiOperation({
    summary: 'Get verify phone',
    description: 'Get verify phone by userId and OTP',
  })
  @ApiResponse({ status: 200, type: VerifyUserPhoneDto })
  @Post('verify/check')
  async getVerifiedPhone( @Body() verifyPhoneDto: VerifyPhoneDto ): Promise<ResponseStatusInterface> {
    return this.phoneService.getVerifiedPhone(verifyPhoneDto)
  }

}
