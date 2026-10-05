const express = require('express');
const cors = require('cors');

const issueRoutes = require('./routes/issues');
const { handleError } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/issues', issueRoutes);

// Anything that did not match a route above
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Last, so everything above can fall into it
app.use(handleError);

module.exports = app;
