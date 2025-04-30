import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface)=> {
    await queryInterface.addColumn('posts', 'topicId', {
      type: DataTypes.UUID,
      allowNull:false,
      references: {
        model: 'topic',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await  queryInterface.removeColumn('posts', 'topicId')
  }
}