import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class RolePermissionDto {
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


  @ApiProperty({
    example: '2025-01-31 15:12:43.245000 +00:00',
    description: 'createdAt',
  })
  @IsDate()
  createdAt: Date;


  @ApiProperty({
    example: '2025-01-31 15:12:43.245000 +00:00',
    description: 'updatedAt',
  })
  @IsDate()
 updatedAt: Date;
}