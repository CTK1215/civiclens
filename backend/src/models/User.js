const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// One row per account. The password column holds a bcrypt hash, never the plain password.
const User = sequelize.define(
  'User',
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    updatedAt: false,
  }
);

// Responses are built from this model, so drop the hash before any JSON leaves the server
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
