import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserRoleModel } from '@/src/role/models/user-role.model';
import { User } from '@/src/users/models/user.model';
import { UserRole } from '@/src/role/interfaces/role.enum';

@Table({
  tableName: 'roles',
  timestamps: false
})

export class  RoleModel extends Model<RoleModel> {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  id: string;


  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.GUEST,
  })
  role: UserRole;

  @BelongsToMany(() => User, () => UserRoleModel)
  users: User[];

}