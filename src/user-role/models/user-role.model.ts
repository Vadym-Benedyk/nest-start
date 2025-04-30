import { Model, Table, Column, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { User } from '@/src/users/models/user.model';
import { RoleModel } from '@/src/role/models/role.model';

@Table({
  tableName: 'user_roles',
  timestamps: true
})

export class UserRoleModel  extends Model<UserRoleModel> {

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  })
  userId: string;


  @ForeignKey(() => RoleModel)
  @Column({
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id',
    },
    onDelete: 'CASCADE',
  })
  roleId: string;


  @Column({
    type: DataTypes.DATE,
  })
  createdAt: Date;


  @Column({
    type: DataTypes.DATE,
  })
  updatedAt: Date;
}