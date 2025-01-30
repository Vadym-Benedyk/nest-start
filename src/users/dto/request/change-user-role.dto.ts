import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserRoleDto } from './user-role.dto';

export class ChangeUserRoleDto extends UserRoleDto {
  @ApiProperty({
    example: 'UUID',
    description: 'Id of the admin who made the change',
  })
  @IsString()
  @IsNotEmpty()
  UpdateBy: string;
}
