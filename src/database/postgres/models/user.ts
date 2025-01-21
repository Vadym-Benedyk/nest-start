import { UserRole } from '../../../user/interfaces/role.enum';
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
      role: DataType.ENUM(...Object.values(UserRole)),
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
