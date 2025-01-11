export default {
  up: async (queryInterface: any) => {
    await queryInterface.removeConstraint('users', 'users_email_key');

    await queryInterface.addConstraint('users', {
      fields: ['id'],
      type: 'primary key',
      name: 'users_pkey', // Назва обмеження
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.removeConstraint('users', 'users_pkey');

    await queryInterface.changeColumn('users', 'id', {
      autoIncrement: true,
    });

    await queryInterface.addConstraint('users', {
      fields: ['id'],
      type: 'unique',
      name: 'users_email_key',
    });
  },
};
