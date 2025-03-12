import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { RoleModel } from '@/src/role/models/role.model';
import { RolePermissionsModel } from '@/src/role-permissions/models/role-permissions.model';

@Table({
  tableName: 'permissions',
  timestamps: false,
})
export class PermissionModel extends Model<PermissionModel> {

  @Column({
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [1, 50] },
  })
  permission: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    validate: { len: [1, 100] },
  })
  description: string;

  @BelongsToMany(() => RoleModel, () => RolePermissionsModel)
  roles: RoleModel[];
}