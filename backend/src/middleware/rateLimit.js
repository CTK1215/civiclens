const rateLimit = require('express-rate-limit');

// Counts failed register and login attempts per IP address. Successful requests don't use
// up the budget, so someone logging in normally is never blocked. AUTH_RATE_LIMIT in
// backend/.env changes the limit. The default is 20 failures per 15 minutes.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT) || 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many failed attempts. Try again in 15 minutes.' },
});

module.exports = { authLimiter };
