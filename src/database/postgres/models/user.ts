import { UserRole } from '@/src/users/interfaces/role.enum';
import { DataType, Model } from 'sequelize-typescript';

module.exports = (sequelize: any) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        onDelete: 'CASCADE',
      },
      firstName: DataType.STRING,
      lastName: DataType.STRING,
      email: DataType.STRING,
      password: DataType.STRING,
      age: DataType.INTEGER,
      role: {
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.USER,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  );
  return User;
};
