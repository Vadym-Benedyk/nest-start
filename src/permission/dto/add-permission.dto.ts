import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddPermissionDto {
  @ApiProperty({ example: 'deleteUser', description: 'Permission name' })
  @IsString()
  @IsNotEmpty()
  permission: string;


  @ApiProperty({ example: 'Permission description', description: 'Permission description' })
  @IsString()
  @IsOptional()
  description: string;
}