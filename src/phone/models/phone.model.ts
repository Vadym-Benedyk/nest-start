import { Column, DataType, Model, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from '@/src/users/models/user.model';
import { MAX } from 'class-validator';


@Table({
  tableName: 'users_phone',
  modelName: 'PhoneModel',
  timestamps: true,
})
export class PhoneModel extends Model<PhoneModel> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  verified: boolean;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}