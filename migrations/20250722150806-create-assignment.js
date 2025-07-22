'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      total_marks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      assignment_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true
      },
      instructions: {
        type: Sequelize.STRING,
        allowNull: true
      },
     created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      assigned_to: {
        type: Sequelize.JSON, // <-- Changed from ARRAY to JSON for MySQL compatibility
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Assignments');
  }
};