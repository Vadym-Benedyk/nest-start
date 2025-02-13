import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, Unique, ManyToOne } from 'typeorm';
import { ChapterEntity } from '@/src/chapter/entities/chapter.entity';


@Entity({ name: 'topic' })
@Unique(['topicName', 'chapter'])
export class TopicEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  topicName: string

  @ManyToOne(() => ChapterEntity, (chapter) => chapter.topics, {onDelete: "CASCADE"})
  @JoinColumn()
  chapter: ChapterEntity
}