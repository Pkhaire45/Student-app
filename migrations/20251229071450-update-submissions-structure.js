"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /* ---------------------------------------
       1. Add status column
    --------------------------------------- */
    await queryInterface.addColumn("Submissions", "status", {
      type: Sequelize.ENUM("submitted", "late", "graded", "resubmitted"),
      defaultValue: "submitted",
    });

    /* ---------------------------------------
       2. Add composite unique constraint
          (assignment_id + student_id)
    --------------------------------------- */
    await queryInterface.addConstraint("Submissions", {
      fields: ["assignment_id", "student_id"],
      type: "unique",
      name: "unique_assignment_student_submission",
    });

    /* ---------------------------------------
       3. Enforce CASCADE rules
    --------------------------------------- */
    await queryInterface.changeColumn("Submissions", "assignment_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Assignments",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.changeColumn("Submissions", "student_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "Submissions",
      "unique_assignment_student_submission"
    );

    await queryInterface.removeColumn("Submissions", "status");
  },
};
