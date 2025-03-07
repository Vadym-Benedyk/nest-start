import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';


export class UsersInRoleDto {
  @ApiProperty({
    example: 'UUID',
    description: 'roleId',
  })
  @IsString()
  roleId: string;

  @ApiProperty({
    example: 'legionary',
    description: 'role'
  })
  @IsString()
  role: string;


  @ApiProperty({
    example: 'users',
    description: 'Array of users'
  })
  @IsArray()
  users: [
    { userId: string, email: string }
  ]
}