const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// One row per reported issue. userId is the account that created it.
const Issue = sequelize.define(
  'Issue',
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'other' },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'open' },
    votes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // Public path of the photo, like /uploads/<file>.jpg, or null when there is no photo
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  {
    // Keep the Phase 1 response shape: createdAt, no updatedAt
    updatedAt: false,
  }
);

Issue.belongsTo(User, { foreignKey: 'userId' });

module.exports = Issue;
