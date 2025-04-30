import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('personal_info', 'phone', {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('personal_info', 'phone')
  }
}