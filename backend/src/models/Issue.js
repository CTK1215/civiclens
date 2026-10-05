const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// One row per reported issue. Phase 3 adds a userId column for ownership checks.
const Issue = sequelize.define(
  'Issue',
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'other' },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'open' },
    votes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    // Keep the Phase 1 response shape: createdAt, no updatedAt
    updatedAt: false,
  }
);

module.exports = Issue;
