import { BelongsTo, Column, DataType, Model, ForeignKey, Table } from 'sequelize-typescript';
import { User } from '@/src/users/models/user.model';

@Table({
  tableName: 'posts',
  timestamps: true,
})
export class PostModel extends Model<PostModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onUpdate: 'CASCADE',
  })
  authorId: string;

  @BelongsTo(() => User)
  author: User;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;
}
