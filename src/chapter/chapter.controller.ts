import { Body, Controller, Delete, Get, HttpStatus, Post } from '@nestjs/common';
import { ChapterService } from '@/src/chapter/chapter.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService ) {}

  @ApiOperation({
    summary: 'list of all Chapters',
    description: 'Getting array of chapter list'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'chapters list'
  })
  @Get()
  async getChapters(): Promise<any> {
    return await this.chapterService.getChapters();
  }

  @ApiOperation({
    summary: 'Add new Chapter',
    description: 'Adding new chapter'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'chapter added'
  })
  @Post()
  async addChapter(@Body() addChapterDto: AddChapterDto): Promise<any> {
    return await this.chapterService.createChapter(addChapterDto);
  }

  // @ApiOperation({
  //   summary: 'Delete Chapter',
  //   description: 'Deleting chapter by id'
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'chapter deleted'
  // })
  // @Delete()
}
