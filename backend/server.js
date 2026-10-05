require('dotenv').config();

const app = require('./src/app');
const sequelize = require('./src/config/database');
require('./src/models/Issue'); // loads the models so sync() creates their tables
require('./src/models/User');

// Tokens are signed with this secret. Without it, anyone could forge a login.
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add it to backend/.env');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

// Create any missing tables, then listen. If the database is unreachable,
// stop here rather than answering requests with no database behind them.
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`CivicLens API running at http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to the database:', err.message);
    process.exit(1);
  });
