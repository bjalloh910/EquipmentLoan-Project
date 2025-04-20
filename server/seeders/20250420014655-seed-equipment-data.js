'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const equipmentData = [];
    
    // Read the CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../data/equipment_data.csv'))
        .pipe(csv())
        .on('data', (row) => {
          // Convert date strings to Date objects
          const purchaseDate = row.purchase_date ? new Date(row.purchase_date) : null;
          const firmwareUpdate = row.firmware_update ? new Date(row.firmware_update) : null;
          
          equipmentData.push({
            serial_code: row.serial_code, // Updated from equipment_id
            model: row.model,
            make: row.make,
            equip_type: row.equip_type,
            purchase_date: purchaseDate,
            checkout_status: row.checkout_status || 'available',
            firmware_update: firmwareUpdate,
            health: row.health || null,
            notes: row.notes || null,
            total_days_inuse: parseInt(row.total_days_inuse) || 0,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert the data into the equipment table
    await queryInterface.bulkInsert('equipment', equipmentData, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all equipment data
    await queryInterface.bulkDelete('equipment', null, {});
  }
};

