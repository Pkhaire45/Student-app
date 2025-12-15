'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_batches', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'batches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      joinedAt: {
        type: Sequelize.DATEONLY,
        allowNull: false
        // ❌ NO defaultValue here for MySQL
      }
    });

    await queryInterface.addConstraint('student_batches', {
      fields: ['studentId', 'batchId'],
      type: 'unique',
      name: 'unique_student_batch'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('student_batches');
  }
};
