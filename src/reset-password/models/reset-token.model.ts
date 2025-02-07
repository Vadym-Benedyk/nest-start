import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import { User } from '@/src/users/models/user.model';

@Table({
  tableName: 'reset_token',
  modelName: 'ResetTokenModel',
  timestamps: true,
})
export class ResetTokenModel extends Model<ResetTokenModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  resetRequestCount: number;
}
