"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /* -------------------------------------------------
       Ensure CASCADE rules on foreign keys only
       (no column / index creation)
    ------------------------------------------------- */

    await queryInterface.changeColumn("TestAttempts", "studentId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.changeColumn("TestAttempts", "testId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Tests",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.changeColumn("TestAttempts", "questionId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Questions",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down() {
    // no-op (schema already existed)
  },
};
