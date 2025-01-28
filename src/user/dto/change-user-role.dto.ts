import { UpdateUserDto } from './update-user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserRole } from '../interfaces/role.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class ChangeUserRoleDto extends PartialType(UpdateUserDto) {
  @ApiProperty({
    example: UserRole.USER,
    description: 'The role of the user.',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;
}
