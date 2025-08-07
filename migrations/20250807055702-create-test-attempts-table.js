'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TestAttempts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // This MUST be the actual table name for your User model
          key: 'id'
        },
        onDelete: 'CASCADE' // If a student is deleted, their attempts are also deleted.
      },
      testId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tests', // This MUST be the actual table name for your Test model
          key: 'id'
        },
        onDelete: 'CASCADE' // If a test is deleted, its attempts are also deleted.
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions', // This MUST be the actual table name for your Question model
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      selectedOption: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TestAttempts');
  }
};