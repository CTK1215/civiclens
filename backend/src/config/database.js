const { Sequelize } = require('sequelize');

// The connection string lives in backend/.env as DATABASE_URL, never in code.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to backend/.env');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
