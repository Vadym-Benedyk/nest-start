import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ChapterRepository } from '@/src/chapter/repositories/chapter.repository';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';
import { ChapterDto } from '@/src/chapter/dto/chapter.dto';

@Injectable()
export class ChapterService {
  private readonly logger = new Logger(ChapterService.name);
  constructor( private readonly chapterRepository: ChapterRepository ) {}

  async getChapters(): Promise<any> {
    const chapters = await this.chapterRepository.getAllChapters()
    return chapters.map(chapter => chapter.chapterName)
  }

  async getChapterById(id: string): Promise<ChapterDto> {
    return await this.chapterRepository.findChapterById(id)
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

  async deleteChapter(id: string): Promise<void> {
      await this.chapterRepository.deleteChapter(id)
  }

  async updateChapter(chapterDto: ChapterDto) {
    return await this.chapterRepository.updateChapter(chapterDto)
  }
}
