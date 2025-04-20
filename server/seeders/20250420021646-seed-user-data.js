'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userData = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../data/users_data.csv'))
        .pipe(csv())
        .on('data', (row) => {
          const personnelNumber = row.personnel_number ? parseInt(row.personnel_number) : null;
          const contactType = row.contact_type || 'Student';

          if (!isNaN(personnelNumber)) {
            userData.push({
              personnel_name: row.personnel_name,
              email: row.email,
              contact_type: contactType,
              personnel_number: personnelNumber,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (userData.length > 0) {
      await queryInterface.bulkInsert('users', userData, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
