import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChapterEntity } from '@/src/chapter/entities/chapter.entity';

@Entity()
export class TopicEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  topicName: string

  @ManyToMany(() => ChapterEntity, (chapter) => chapter.topics, {onDelete: "CASCADE"})
  @JoinColumn()
  chapter: ChapterEntity
}