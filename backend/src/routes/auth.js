const express = require('express');

const { register, login } = require('../controllers/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Failed attempts on these two routes count toward the limit
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

module.exports = router;
