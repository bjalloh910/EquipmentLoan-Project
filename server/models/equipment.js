'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
class Equipment extends Model {
 static associate(models) {
   // define association here
   Equipment.hasMany(models.Loan, {
     foreignKey: 'equipment_id'
   });
 }
}
 Equipment.init({
 // Auto-incrementing primary key
 id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true
 },
 // Equipment identifier (like serial number, inventory code, etc.)
 serial_code: {
   type: DataTypes.STRING(50),
   allowNull: true,
   unique: true
 },
 model: {
 type: DataTypes.STRING(100),
 allowNull: true
 },
 make: {
   type: DataTypes.STRING(100),
   allowNull: false
 },
 equip_type: {
   type: DataTypes.STRING(50),
   allowNull: false
 },
 purchase_date: {
   type: DataTypes.DATE,
   allowNull: true
 },
 checkout_status: {
   type: DataTypes.ENUM('available', 'in use'),
   allowNull: false,
   defaultValue: 'available'
 },
 firmware_update: {
   type: DataTypes.DATE,
   allowNull: true
 },
 health: {
   type: DataTypes.STRING(100),
   allowNull: true
 },
 notes: {
   type: DataTypes.TEXT,
   allowNull: true
 },
 total_days_inuse: {
   type: DataTypes.INTEGER,
   allowNull: true,
   defaultValue: 0
 }
}, {
 sequelize,
 modelName: 'Equipment',
 tableName: 'equipment', // Optional: explicitly set table name if different from model name
 timestamps: true // Enables createdAt and updatedAt
});
return Equipment;
};
