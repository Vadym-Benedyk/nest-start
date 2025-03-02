import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../interfaces/role.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'UUID', description: 'Id of users must be changed' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: UserRole.USER,
    description: `New role for user. Available roles: ${UserRole}`,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;
}
