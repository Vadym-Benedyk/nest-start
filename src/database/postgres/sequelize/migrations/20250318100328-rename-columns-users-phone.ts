import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('users_phone', 'user_id', 'userId');
    await queryInterface.renameColumn('users_phone', 'created_at', 'createdAt');
    await queryInterface.renameColumn('users_phone', 'updated_at', 'updatedAt');
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('users_phone', 'userId', 'user_id');
    await queryInterface.renameColumn('users_phone', 'createdAt', 'created_at');
    await queryInterface.renameColumn('users_phone', 'updatedAt', 'updated_at');
  },
};