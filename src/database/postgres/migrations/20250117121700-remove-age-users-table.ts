import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'age');
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'age', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },
};
