"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Items", "status", Sequelize.BOOLEAN);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Items", "status");
  },
};
