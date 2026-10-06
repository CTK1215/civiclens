const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');
const { handleError } = require('./middleware/errorHandler');
const { UPLOAD_DIR } = require('./middleware/upload');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/issues', issueRoutes);

// Issue photos are public, since anyone can view an issue. <img> tags can't send a token.
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  })
);

// Anything that did not match a route above
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Last, so everything above can fall into it
app.use(handleError);

module.exports = app;
