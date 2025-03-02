import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdRoleDto {
  @ApiProperty({
    example: 'UUID',
    description: 'role id',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}