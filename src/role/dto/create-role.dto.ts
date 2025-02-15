import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'user / admin / guest ...',
    description: 'user role'
  })
  @IsString()
  @IsNotEmpty()
  role: string
}