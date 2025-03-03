import { AddPermissionDto } from '@/src/permission/dto/add-permission.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class PermissionDto extends PartialType(AddPermissionDto) {
  @ApiProperty({ example: 'UUID', description: 'Permission id' })
  @IsString()
  id: string;
}