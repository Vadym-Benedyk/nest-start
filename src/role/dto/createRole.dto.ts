import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@/src/role/interfaces/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    example:  UserRole.LEGIONARY,
    description: 'user role'
  })
  @IsString()
  @IsNotEmpty()
  role: string
}