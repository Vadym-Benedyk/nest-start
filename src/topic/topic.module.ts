import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from '@/src/topic/entities/topic.entity';
import { TopicRepository } from '@/src/topic/repositories/topic.repository';
import { TopicController } from '@/src/topic/topic.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity])],
  controllers: [TopicController],
  providers: [TopicService, TopicRepository],
  exports: [TopicService],
})
export class TopicModule {}
