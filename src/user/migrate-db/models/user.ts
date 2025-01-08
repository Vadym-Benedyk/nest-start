import { Model } from 'sequelize';
import { UserRole } from '../../interfaces/role.enum';
import { DataType } from 'sequelize-typescript';

module.exports = (sequelize: any, DataTypes: { INTEGER: any; STRING: any }) => {
  class User extends Model {
    //   static associate(models) {
    // }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      age: DataTypes.INTEGER,
      role: DataType.ENUM(...Object.values(UserRole)),
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
