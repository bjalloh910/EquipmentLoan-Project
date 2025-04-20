'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('equipment', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      serial_code: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: true
      },
      model: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      make: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      equip_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      purchase_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      checkout_status: {
        type: Sequelize.ENUM('available', 'in use'),
        allowNull: false,
        defaultValue: 'available'
      },
      firmware_update: {
        type: Sequelize.DATE,
        allowNull: true
      },
      health: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      total_days_inuse: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('equipment');
  }
};
