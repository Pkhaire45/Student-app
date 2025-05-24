'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      testId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tests', key: 'id' },
        onDelete: 'CASCADE'
      },
      questionText: { type: Sequelize.TEXT, allowNull: false },
      correctOption: { type: Sequelize.INTEGER, allowNull: false }, // 1,2,3,4
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Questions');
  }
};