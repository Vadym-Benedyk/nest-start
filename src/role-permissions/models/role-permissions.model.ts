import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { RoleModel } from '@/src/role/models/role.model';
import { PermissionModel } from '@/src/permission/models/permission.model';
import { DataTypes } from 'sequelize';


@Table({
  tableName: 'role_permissions',
  timestamps: true
})

export class RolePermissionsModel extends Model<RolePermissionsModel> {

  @ForeignKey(() => RoleModel)
  @Column ({
  type: DataTypes.UUID,
  primaryKey: true,
  references: {
    model: 'roles',
    key: 'id',
  },
    onDelete: 'CASCADE',
  })
  roleId: string;


  @ForeignKey(() => PermissionModel)
  @Column({
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'permissions',
      key: 'id',
    },
    onDelete: 'CASCADE',
  })
  permissionId: string;


  @Column({
    type: DataTypes.DATE,
  })
  createdAt: Date;


  @Column({
    type: DataTypes.DATE,
  })
  updatedAt: Date;

}