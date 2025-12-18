'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_attachments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      workType: {
        type: Sequelize.ENUM('classwork', 'homework'),
        allowNull: false
      },

      workId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      fileUrl: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('work_attachments');
  }
};
