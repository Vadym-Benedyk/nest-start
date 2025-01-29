import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../interfaces/role.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({ example: 'UUID', description: 'Id of user must be changed' })
  @IsString()
  @IsNotEmpty()
  UserId: string;

  @ApiProperty({
    example: UserRole.USER,
    description: `The role of the user to change. Available roles: ${UserRole}`,
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;
}
