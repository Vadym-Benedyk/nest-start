import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRoleDto } from '@/src/role/dto/create-role.dto';


export class RoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    example: 'UUID',
    description: 'role id',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}