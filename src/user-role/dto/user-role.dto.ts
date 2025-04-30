import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({
    example: 'UUID',
    description: 'roleId',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;


  @ApiProperty({
    example: 'UUID',
    description: 'userId',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}