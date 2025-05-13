'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'contactNumber', {
      type: Sequelize.STRING(15),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'dateOfBirth', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'guardianName', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'guardianContactNumber', {
      type: Sequelize.STRING(15),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'guardianRelation', {
      type: Sequelize.STRING(30),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'contactNumber');
    await queryInterface.removeColumn('users', 'dateOfBirth');
    await queryInterface.removeColumn('users', 'guardianName');
    await queryInterface.removeColumn('users', 'guardianContactNumber');
    await queryInterface.removeColumn('users', 'guardianRelation');
  }
};
