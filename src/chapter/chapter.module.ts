import { Module } from '@nestjs/common';
import { ChapterEntity } from '@/src/chapter/entities/chapter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterController } from '@/src/chapter/chapter.controller';
import { ChapterService } from '@/src/chapter/chapter.service';
import { ChapterRepository } from '@/src/chapter/repositories/chapter.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterEntity])],
  controllers: [ChapterController],
  providers: [ChapterService, ChapterRepository],
  exports: [ChapterService, ChapterRepository]
})
export class ChapterModule {}
