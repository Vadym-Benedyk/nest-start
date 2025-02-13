import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddChapterDto {

  @ApiProperty({ example: 'Tourism', description: 'chapter name' })
  @IsString()
  @IsNotEmpty()
  chapterName: string
}