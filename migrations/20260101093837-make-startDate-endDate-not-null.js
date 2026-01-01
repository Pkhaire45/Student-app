"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("homeworks", "startDate", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn("homeworks", "endDate", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("homeworks", "startDate");
    await queryInterface.removeColumn("homeworks", "endDate");
  }
};
