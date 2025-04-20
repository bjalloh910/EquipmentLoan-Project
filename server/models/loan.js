'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    static associate(models) {
      Loan.belongsTo(models.Equipment, { foreignKey: 'equipment_id' });
      Loan.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Loan.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_out: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_in: {
      type: DataTypes.DATE,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    units: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Loan',
    tableName: 'loans',
    timestamps: true
  });

  return Loan;
};
