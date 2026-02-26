const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Followup = sequelize.define(
  'Followup',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    lead_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    followup_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: 'followups',
    timestamps: false
  }
);

module.exports = Followup;
