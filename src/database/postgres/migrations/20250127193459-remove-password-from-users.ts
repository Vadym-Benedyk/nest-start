import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'password');
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'password', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
