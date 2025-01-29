import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users_password', 'createdAt', {
    type: DataTypes.DATE,
    allowNull: false,
  });
  await queryInterface.addColumn('users_password', 'updatedAt', {
    type: DataTypes.DATE,
    allowNull: false,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('users_password', 'createdAt');
  await queryInterface.removeColumn('users_password', 'updatedAt');
}
