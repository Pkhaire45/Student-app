'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tests', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Duration in minutes'
    });
    await queryInterface.addColumn('Tests', 'dueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: 'Due date (YYYY-MM-DD)'
    });
    await queryInterface.addColumn('Tests', 'dueTime', {
      type: Sequelize.TIME,
      allowNull: true,
      comment: 'Due time (HH:mm:ss)'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tests', 'duration');
    await queryInterface.removeColumn('Tests', 'dueDate');
    await queryInterface.removeColumn('Tests', 'dueTime');
  }
};