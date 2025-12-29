"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Assignments", "batchId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "batches",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Assignments", "batchId", {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },
};
