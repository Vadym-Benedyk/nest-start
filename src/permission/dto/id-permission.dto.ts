import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IdPermissionDto {
  @ApiProperty({ example: 'UUID', description: 'Permission id' })
  @IsString()
  id: string;
}