import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class RoleDto {
  @ApiProperty({
    example: 'UUID',
    description: 'role id',
  })
  @IsString()
  @IsNotEmpty()
  id: string;


@ApiProperty({
  example: 'user',
  description: 'user role'
})
  @IsString()
  @IsNotEmpty()
  role: string;
}
