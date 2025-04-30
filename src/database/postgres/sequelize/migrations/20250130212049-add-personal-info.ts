import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('personal_info', 'status', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('personal_info', 'photo', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('personal_info', 'status');
    await queryInterface.removeColumn('personal_info', 'photo');
  },
};
