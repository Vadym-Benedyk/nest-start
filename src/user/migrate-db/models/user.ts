import { Model } from 'sequelize';

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
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
