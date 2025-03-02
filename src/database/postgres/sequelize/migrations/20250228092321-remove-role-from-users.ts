import { DataTypes, QueryInterface } from 'sequelize';

export default  {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'role')
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'guest'
    });
  }
}