import { ApiProperty } from '@nestjs/swagger';
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
  example: 'legionary',
  description: 'user role'
})
  @IsString()
  @IsNotEmpty()
  role: string;
}
