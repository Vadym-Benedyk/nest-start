import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhoneService } from '@/src/phone/phone.service';
import { PhoneDto } from '@/src/phone/dto/phone.dto';


@ApiTags('Phone')
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @ApiOperation({
    summary: 'Get user phone',
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
  @ApiResponse({ status: 200, type: PhoneDto })
  @Patch('update')
  async updateUserPhone( @Body() phoneDto: PhoneDto): Promise<any> {
    return this.phoneService.updatePhone(phoneDto);
  }

  @ApiOperation({
    summary: 'Delete user phone',
    description: 'Delete user phone by userId',
  })
  @ApiResponse({ status: 200, type: PhoneDto })
  @Delete(':userId')
  async deleteUserPhone( @Param('userId') userId: string ): Promise<any> {
    return this.phoneService.deletePhone(userId);
  }

}
