import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '@/src/users/models/user.model';
import { StatusEnum } from '@/src/personal-info/interfaces/personal-info.interface';

@Table({
  tableName: 'personal_info',
  timestamps: true,
})
export class PersonalInfo extends Model<PersonalInfo> {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  age: number;

  @Column({
    type: DataType.ENUM(...Object.values(StatusEnum)),
    allowNull: true,
  })
  status: StatusEnum;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  photo: string;
}
