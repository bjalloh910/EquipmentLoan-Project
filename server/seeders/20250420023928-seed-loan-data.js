'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Import models directly
const { User, Equipment } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const loanData = [];

    const csvFilePath = path.join(__dirname, '../data/loans_data.csv');
    const rows = [];

    // Step 1: Load all CSV rows
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    // Step 2: For each row, resolve the user and equipment IDs
    for (const row of rows) {
      const user = await User.findOne({ where: { personnel_number: parseInt(row.personnel_number) } });
      const equipment = await Equipment.findOne({ where: { serial_code: row.serial_code } });

      if (user && equipment) {
        loanData.push({
          user_id: user.id,
          equipment_id: equipment.id,
          date_out: row.date_out ? new Date(row.date_out) : null,
          date_in: row.date_in ? new Date(row.date_in) : null,
          location: row.location || null,
          purpose: row.purpose || 'Loan',
          units: parseInt(row.units) || 1,
          comments: row.comments || null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (loanData.length > 0) {
      await queryInterface.bulkInsert('loans', loanData, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loans', null, {});
  }
}

