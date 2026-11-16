const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const AppError = require('../utils/AppError');
const { validateRegister, validateLogin } = require('../utils/validators');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

const toPublicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = validateRegister(req.body || {});

  const existing = await db.findUserByEmail(email);
  if (existing) throw new AppError('Bu email artıq qeydiyyatdan keçib', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.createUser({ name, email, passwordHash });

  res.status(201).json({ success: true, token: signToken(user), user: toPublicUser(user) });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = validateLogin(req.body || {});

  const user = await db.findUserByEmail(email);
  // Email və ya şifrə — hansının səhv olduğunu demirik (təhlükəsizlik)
  const ok = user && (await bcrypt.compare(password, user.password_hash));
  if (!ok) throw new AppError('Email və ya şifrə yanlışdır', 401);

  res.json({ success: true, token: signToken(user), user: toPublicUser(user) });
}

// GET /api/auth/me  (qorunan)
async function me(req, res) {
  res.json({ success: true, user: req.user });
}

module.exports = { register, login, me };
