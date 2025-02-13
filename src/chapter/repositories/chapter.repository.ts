import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterEntity } from '@/src/chapter/entities/chapter.entity';
import { Repository } from 'typeorm';
import { AddChapterDto } from '@/src/chapter/dto/add-chapter.dto';
import { ChapterDto } from '@/src/chapter/dto/chapter.dto';
import { ChapterInterface } from '@/src/chapter/interfaces/chapter.interface';

@Injectable()
export class ChapterRepository {
  constructor(
    @InjectRepository(ChapterEntity)
    private readonly chapterRepository: Repository<ChapterEntity>
  ) {}

  async getAllChapters(): Promise<ChapterDto[]> {
    try {
      return this.chapterRepository.find({ select: ['chapterName']})
    } catch (error) {
      throw new HttpException(
        'Internal server error by getting all chapters',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }


  async findChapterById(id: string): Promise<ChapterInterface> {
    const chapter = await this.chapterRepository.findOneBy({ id })
    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
    return chapter
  }


  async findByChapterName(chapterName: string): Promise<ChapterInterface> {
    try {
      return  await this.chapterRepository.findOneBy({ chapterName })
    } catch (error) {
      throw new HttpException(
        'Internal server error by getting chapter',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }


  async createChapter(addChapterDto: AddChapterDto): Promise<ChapterInterface> {
    try {
      const newChapter = this.chapterRepository.create(addChapterDto);
      return await this.chapterRepository.save(newChapter);
    } catch (error) {
      throw new HttpException(
        'Internal server error by creating chapter',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }


  async deleteChapter(id: string): Promise<void> {
      await this.findChapterById( id )
    try {
      await this.chapterRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        'Internal server error by deleting chapter',
        HttpStatus.FORBIDDEN
      );
    }
  }


  async updateChapter(chapterDto: ChapterDto): Promise<ChapterInterface> {
    const result = await this.chapterRepository.update(chapterDto.id, chapterDto);
    if (result.affected === 0) {
      throw new HttpException(`Chapter with id:${chapterDto.id} not found`, HttpStatus.NOT_FOUND);
    }

    return chapterDto;
  }
}