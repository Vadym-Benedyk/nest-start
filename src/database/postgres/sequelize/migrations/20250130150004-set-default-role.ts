import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'role', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USER',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'role', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
