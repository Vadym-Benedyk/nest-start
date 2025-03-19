import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonalInfoService } from '@/src/personal-info/personal-info.service';
import { AddUserInfoDto } from '@/src/personal-info/dto/addUserInfo.dto';
import { PersonalInfoInterface, UpdateInfoResponseInterface } from '@/src/personal-info/interfaces/personal-info.interface';
import { UserInfoDto } from '@/src/personal-info/dto/userInfo.dto';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { RoleGuard } from '@/src/auth/guards/RoleGuard';
import { Roles } from '@/src/auth/decorators/get-role.decorator';


@ApiTags('User additional information')
@ApiBearerAuth()
@Roles('emperor', 'senator', 'legionary', 'general')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('user_info')
export class PersonalInfoController {
  constructor(private readonly personalInfoService: PersonalInfoService) {}

  @ApiOperation({
    summary: 'Add user info',
    description: 'Create user information and save to db',
  })
  @ApiResponse({ type: AddUserInfoDto })
  @Post()
  public async addUserInfo(
    @Body() addUserInfoDto: AddUserInfoDto
  ): Promise<PersonalInfoInterface> {
    return await this.personalInfoService.addUserInfo(addUserInfoDto);
  }

  @ApiOperation({
    summary: 'Get one user info',
    description: 'Get user info by id (age, status and photo)',
  })
  @ApiResponse({ type: AddUserInfoDto })
  @Get(':id')
  async getUserInfoById(
    @Param('id') id: string,
  ): Promise<PersonalInfoInterface> {
    return await this.personalInfoService.getUserInfo(id);
  }


  @ApiOperation({
    summary: 'Get all users info',
    description: 'Get all users info',
  })
  @ApiResponse({ type: [AddUserInfoDto] })
  @Get()
  async getAllUsersInfo(): Promise<PersonalInfoInterface[]> {
    return await this.personalInfoService.getAllUsersInfo();
  }


  @ApiOperation({
    summary: 'Update fields: age, status, photo',
    description: 'Update user info',
  })
  @ApiResponse({ type: UserInfoDto })
  @Patch('/update')
  async updateInfo(
    @Body() userInfoDto: UserInfoDto,
  ): Promise<UpdateInfoResponseInterface> {
    return this.personalInfoService.updateUserInfo(userInfoDto);
  }
}
