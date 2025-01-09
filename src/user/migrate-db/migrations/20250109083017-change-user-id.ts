import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: any) => {
    // Step 1: Add a new UUID column
    await queryInterface.addColumn('users', 'temp_uuid', {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    });

    // Step 2: Copy data from old 'id' column to 'temp_uuid' (if necessary)
    // If old IDs are irrelevant, skip this step.
    // PostgreSQL requires a manual query if you want to preserve data.
    // Example: await queryInterface.sequelize.query('UPDATE users SET temp_uuid = ...');

    // Step 3: Drop the old 'id' column
    await queryInterface.removeColumn('users', 'id');

    // Step 4: Rename 'temp_uuid' to 'id'
    await queryInterface.renameColumn('users', 'temp_uuid', 'id');

    // Step 5: Set 'id' as the primary key
    await queryInterface.changeColumn('users', 'id', {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    });
  },

  down: async (queryInterface: any) => {
    // Step 1: Add the old 'id' column
    await queryInterface.addColumn('users', 'temp_id', {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    });

    // Step 2: Drop the new 'id' column
    await queryInterface.removeColumn('users', 'id');

    // Step 3: Rename 'temp_id' back to 'id'
    await queryInterface.renameColumn('users', 'temp_id', 'id');

    // Step 4: Set 'id' as the primary key
    await queryInterface.changeColumn('users', 'id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
  },
};
