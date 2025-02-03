import { QueryInterface, DataTypes } from 'sequelize';
import { StatusEnum } from '../../../personal-info/interfaces/personal-info.interface';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('personal_info', 'status', {
      type: DataTypes.ENUM(...Object.values(StatusEnum)),
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('personal_info', 'status', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
