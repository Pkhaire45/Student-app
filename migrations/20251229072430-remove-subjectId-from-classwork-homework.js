"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn("classworks", "subjectId");
    await queryInterface.removeColumn("homeworks", "subjectId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("classworks", "subjectId", {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.addColumn("homeworks", "subjectId", {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
