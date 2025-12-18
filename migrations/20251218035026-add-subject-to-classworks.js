'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('classworks', 'subjectId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('classworks', 'subjectId');
  }
};
