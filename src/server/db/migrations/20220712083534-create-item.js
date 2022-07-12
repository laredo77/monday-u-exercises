'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ItemName: {
        type: Sequelize.STRING
      },
      PokemonId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Items', ['ItemName'], {
      name: 'index_items_itemName',
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  }
};