import { ApiProperty } from '@nestjs/swagger';
import { UserSecureDto } from '@/src/users/dto/user-secure.dto';

export class ResponseUpdateUserDto {
  @ApiProperty({ example: '1', description: 'Number of updated rows' })
  updates: number;

  @ApiProperty({ example: 'User', description: 'Updated users object' })
  user: UserSecureDto;
}
