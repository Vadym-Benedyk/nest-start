import { UserDto } from '@/src/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserWithRolesDto extends UserDto {
  @ApiProperty({ example: '["emperor", "general"]', description: 'user roles' })
  @IsString()
  @IsOptional()
  roles: string[];
}