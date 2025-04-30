import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from '@/src/post/dto/create-post.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class PostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    example: 'UUID',
    description: 'Post Id',
  })
  @IsString()
  @IsNotEmpty()
  id: string;


  @ApiProperty({
    example: 'Date and time of the post',
    description: 'Date and time of the post',
  })
  @IsDate()
  createdAt: Date;


  @ApiProperty({
    example: 'Date and time of the post',
    description: 'Date and time of the post',
  })
  @IsDate()
  updatedAt: Date;
}
