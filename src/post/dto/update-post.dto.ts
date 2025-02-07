import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from '@/src/post/dto/create-post.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    example: 'UUID',
    description: 'Post Id',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}