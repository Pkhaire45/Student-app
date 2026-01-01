"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("classworks", "startDate", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn("classworks", "endDate", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("classworks", "startDate");
    await queryInterface.removeColumn("classworks", "endDate");
  }
};
