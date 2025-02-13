import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TopicEntity } from '@/src/topic/entities/topic.entity';


@Entity({ name: 'chapter' })
export class ChapterEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  chapterName: string

  @OneToMany(() => TopicEntity, (topic) => topic.chapter, {cascade: true})
  topics: TopicEntity[]
}