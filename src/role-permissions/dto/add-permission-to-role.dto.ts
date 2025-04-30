import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPermissionToRoleDto {
  @ApiProperty({
    example: 'UUID',
    description: 'roleId',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;


  @ApiProperty({
    example: 'UUID',
    description: 'permissionId',
  })
  @IsString()
  @IsNotEmpty()
  permissionId: string;
}