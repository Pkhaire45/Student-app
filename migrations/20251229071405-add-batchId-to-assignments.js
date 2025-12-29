"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add batchId as nullable (safe for existing data)
    await queryInterface.addColumn("Assignments", "batchId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "batches",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Assignments", "batchId");
  },
};
