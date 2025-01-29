import { DataTypes, Model } from 'sequelize';

module.exports = (sequelize: any) => {
  class Password extends Model {}

  Password.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Password',
      tableName: 'users_password',
      timestamps: true,
    },
  );
  return Password;
};
