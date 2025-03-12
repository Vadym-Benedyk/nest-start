import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChapterService } from '@/src/chapter/chapter.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { ChapterDto } from '@/src/chapter/dto/chapter.dto';
import { ChapterInterface, ChapterListInterface, ResponseMsgInterface } from '@/src/chapter/interfaces/chapter.interface';
import { RoleGuard } from '@/src/auth/guards/RoleGuard';
import { Roles } from '@/src/auth/decorators/get-role.decorator';
import { PermissionsGuard } from '@/src/auth/guards/PermissionsGuard';
import { Permissions } from '@/src/auth/decorators/get-permission.decorator';



@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService ) {}


  @ApiOperation({
    summary: 'Chapters array',
    description: 'Get Chapters array'
  })
  @ApiResponse({
    type: [String],
    status: HttpStatus.OK,
    description: 'chapters list'
  })
  @Get()
  async getChaptersArray(): Promise<string[]> {
    return await this.chapterService.getChaptersArray();
  }


  @ApiOperation({
    summary: 'Chapters list',
    description: 'Getting list of chapters'
  })
  @ApiResponse({
    type: ChapterDto,
    status: HttpStatus.OK,
    description: 'chapters list'
  })
  @Get('/list')
  async getChapters(): Promise<ChapterListInterface> {
    return await this.chapterService.getChapters();
  }


  @ApiOperation({
    summary: 'Get Chapter by id',
    description: 'Getting chapter by id'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'id: 888f2acd-5581-48d4-a8ca-74dfa412f873, chapterName: Tourism'
  })
  @Get(':id')
  async getChapter(@Param('id', new ParseUUIDPipe()) id: string): Promise<ChapterInterface> {
    return await this.chapterService.getChapterById(id);
  }


  @Roles('senator')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add new Chapter',
    description: 'Adding new chapter'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'chapter added'
  })
  @Post()
  async addChapter(@Body() addChapterDto: AddChapterDto): Promise<ChapterInterface> {
    return await this.chapterService.createChapter(addChapterDto);
  }



  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('delete_chapter')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Chapter',
    description: 'Deleting chapter by id'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'chapter deleted'
  })
  @Delete('/delete/:id')
  async deleteChapter(@Param('id', new ParseUUIDPipe()) id: string): Promise<ResponseMsgInterface> {
    return await this.chapterService.deleteChapter(id);
  }


  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('senator', 'emperor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Chapter',
    description: 'Updating chapter by Body'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'chapter updated'
  })
  @Patch('/update')
  async updateChapter(@Body() chapterDto: ChapterDto): Promise<ChapterInterface> {
    return await this.chapterService.updateChapter(chapterDto);
  }
}
