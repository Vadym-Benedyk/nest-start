import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterEntity } from '@/src/chapter/entities/chapter.entity';
import { Repository } from 'typeorm';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';

@Injectable()
export class ChapterRepository {
  constructor(
    @InjectRepository(ChapterEntity)
    private readonly chapterRepository: Repository<ChapterEntity>
  ) {}

  async getAllChapters(): Promise<any> {
    try {
      return this.chapterRepository.find({ select: ['chapterName']})
    } catch (error) {
      throw new HttpException(
        'Internal server error by getting all chapters',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

  }

  async findByChapterName(chapterName: string): Promise<any> {
    try {
      return this.chapterRepository.findOneBy({ chapterName })
    } catch (error) {
      throw new HttpException(
        'Internal server error by getting chapter',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async createChapter(addChapterDto: AddChapterDto): Promise<any> {
    try {
      const newChapter = this.chapterRepository.create(addChapterDto);
      return await this.chapterRepository.save(newChapter);
    } catch (error) {
      throw new HttpException(
        'Internal server error by creating chapter',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}