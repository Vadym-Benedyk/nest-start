import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'roles',
  timestamps: false
})
export class  RoleModel extends Model<RoleModel> {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  })
  id: string;


  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  role: string
}