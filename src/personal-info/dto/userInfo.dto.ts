import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AddUserInfoDto } from '@/src/personal-info/dto/addUserInfo.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserInfoDto extends PartialType(AddUserInfoDto) {
  @ApiProperty({ example: 'UUID', description: 'Primary key' })
  @IsString()
  @IsNotEmpty()
  id: string;
}