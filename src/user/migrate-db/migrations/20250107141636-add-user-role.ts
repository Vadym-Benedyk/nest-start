/** @type {import('sequelize-cli').Migration} */
import { QueryInterface, DataTypes } from 'sequelize';

export default {
 up: async (queryInterface: QueryInterface)=> {
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.ENUM('admin', 'user', 'guest'),
      allowNull: true,
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'role');
  },
};
