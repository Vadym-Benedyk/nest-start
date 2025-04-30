import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('roles', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('roles')
  }
}