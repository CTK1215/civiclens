const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { badRequest } = require('../middleware/errorHandler');

// bcrypt makes a random salt for each hash and stores it inside the hash string.
// This number is the cost factor: higher is slower to brute force, and slower to log in.
const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

// A required text field has to be a string with something other than spaces in it.
const hasText = (value) => typeof value === 'string' && value.trim() !== '';

// Emails are stored lowercase so "Chris@Example.com" and "chris@example.com" are one account.
const normalizeEmail = (email) => email.trim().toLowerCase();

// POST /auth/register
// 201 with the new user (no password), 400 if fields are missing or weak, 409 if the email is taken
const register = async (req, res) => {
  const { email, password } = req.body || {};

  if (!hasText(email) || !hasText(password)) {
    return badRequest(res, 'email and password are required');
  }

  if (!email.includes('@')) {
    return badRequest(res, 'email must be a valid address');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return badRequest(res, `password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const normalized = normalizeEmail(email);
  const existing = await User.findOne({ where: { email: normalized } });

  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }

  const user = await User.create({
    email: normalized,
    password: await bcrypt.hash(password, SALT_ROUNDS),
  });

  res.status(201).json(user);
};

// POST /auth/login
// 200 with a token valid for one day, 401 if the email or password is wrong
const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!hasText(email) || !hasText(password)) {
    return badRequest(res, 'email and password are required');
  }

  const user = await User.findOne({ where: { email: normalizeEmail(email) } });
  const matches = user && (await bcrypt.compare(password, user.password));

  // Same message for "no such email" and "wrong password", so the response doesn't reveal which
  if (!matches) {
    return res.status(401).json({ error: 'Email or password is wrong' });
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: '1d',
  });

  res.status(200).json({ token });
};

module.exports = { register, login };
