import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ChapterRepository } from '@/src/chapter/repositories/chapter.repository';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';
import { ChapterDto } from '@/src/chapter/dto/chapter.dto';
import { ChapterInterface } from '@/src/chapter/interfaces/chapter.interface';

@Injectable()
export class ChapterService {
  constructor( private readonly chapterRepository: ChapterRepository ) {}

  async getChapters(): Promise<string[]> {
    const chapters = await this.chapterRepository.getAllChapters()
    return chapters.map(chapter => chapter.chapterName)
  }

  async getChapterById(id: string): Promise<ChapterInterface> {
    return await this.chapterRepository.findChapterById(id)
  }

  async createChapter(addChapterDto: AddChapterDto): Promise<ChapterInterface> {
    const isChapterExist = await this.chapterRepository.findByChapterName(addChapterDto.chapterName)

    if (isChapterExist) {
      throw new HttpException('Chapter already exists', HttpStatus.CONFLICT)
    }
    return await this.chapterRepository.createChapter(addChapterDto)
  }

  async deleteChapter(id: string): Promise<void> {
      await this.chapterRepository.deleteChapter(id)
  }

  async updateChapter(chapterDto: ChapterDto): Promise<ChapterInterface> {
    return await this.chapterRepository.updateChapter(chapterDto)
  }
}
