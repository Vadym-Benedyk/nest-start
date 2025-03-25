import { CreateUserDto } from '@/src/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserWithRolesDto extends CreateUserDto {
  @ApiProperty({ example: '["emperor", "general"]', description: 'user roles' })
  @IsString()
  @IsOptional()
  roles: string[];
}