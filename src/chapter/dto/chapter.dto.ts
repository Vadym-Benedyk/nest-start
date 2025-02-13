import { ApiProperty } from '@nestjs/swagger';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChapterDto extends AddChapterDto {
  @ApiProperty({ example: '1816f2e7-3663-42a5-9fd9-27a7eed23879', description: 'chapter uuid' })
  @IsUUID()
  @IsNotEmpty()
  id: string
}