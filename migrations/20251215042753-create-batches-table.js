'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batches', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      batchName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      standard: {
        type: Sequelize.STRING(30),
        allowNull: false
      },

      stream: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      academicYear: {
        type: Sequelize.STRING(20),
        allowNull: false
      },

      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active'
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('batches');
  }
};
