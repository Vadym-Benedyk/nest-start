import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ChapterRepository } from '@/src/chapter/repositories/chapter.repository';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';

@Injectable()
export class ChapterService {
  private readonly logger = new Logger(ChapterService.name);
  constructor( private readonly chapterRepository: ChapterRepository ) {}

  async getChapters(): Promise<any> {
    const chapters = await this.chapterRepository.getAllChapters()
    console.log(chapters);
    return chapters
  }

  async createChapter(addChapterDto: AddChapterDto): Promise<any> {
    const isChapterExist = await this.chapterRepository.findByChapterName(addChapterDto.chapterName)

    if (isChapterExist) {
      throw new HttpException('Chapter already exists', HttpStatus.BAD_REQUEST)
    }

    try {
      return await this.chapterRepository.createChapter(addChapterDto)
    } catch (error) {
      this.logger.error('There is a problem with creating the chapter on server', error)
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
