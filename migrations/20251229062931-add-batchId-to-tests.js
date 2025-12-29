"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tests", "batchId", {
      type: Sequelize.INTEGER,
      allowNull: true, // 👈 IMPORTANT
      references: {
        model: "batches",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tests", "batchId");
  },
};
