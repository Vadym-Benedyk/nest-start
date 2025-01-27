import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint(
      'refresh_tokens',
      'refresh_tokens_userId_fkey',
    );
    await queryInterface.addConstraint('refresh_tokens', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'refresh_tokens_userId_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE', // Видаляє refresh_tokens, якщо user видаляється
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint(
      'refresh_tokens',
      'refresh_tokens_userId_fkey',
    );
    await queryInterface.addConstraint('refresh_tokens', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'refresh_tokens_userId_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },
};
