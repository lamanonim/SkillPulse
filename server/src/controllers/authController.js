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

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yeni istifadəçi qeydiyyatı
 *     description: Qeydiyyatdan sonra istifadəçi avtomatik daxil olmuş sayılır, token qaytarılır.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 2, example: Aysel }
 *               email: { type: string, format: email, example: aysel@mail.com }
 *               password: { type: string, minLength: 6, example: '123456' }
 *     responses:
 *       201:
 *         description: Qeydiyyat uğurludur
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       409:
 *         description: Bu email artıq qeydiyyatdan keçib
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
async function register(req, res) {
  const { name, email, password } = validateRegister(req.body || {});

  const existing = await db.findUserByEmail(email);
  if (existing) throw new AppError('Bu email artıq qeydiyyatdan keçib', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.createUser({ name, email, passwordHash });

  res.status(201).json({ success: true, token: signToken(user), user: toPublicUser(user) });
}

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Daxil ol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: aysel@mail.com }
 *               password: { type: string, example: '123456' }
 *     responses:
 *       200:
 *         description: Giriş uğurludur
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       401:
 *         description: Email və ya şifrə yanlışdır
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
async function login(req, res) {
  const { email, password } = validateLogin(req.body || {});

  const user = await db.findUserByEmail(email);
  // Email və ya şifrə — hansının səhv olduğunu demirik (təhlükəsizlik)
  const ok = user && (await bcrypt.compare(password, user.password_hash));
  if (!ok) throw new AppError('Email və ya şifrə yanlışdır', 401);

  res.json({ success: true, token: signToken(user), user: toPublicUser(user) });
}

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Cari istifadəçi (tokeni yoxlayır)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Token etibarlıdır
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 user: { $ref: '#/components/schemas/PublicUser' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
async function me(req, res) {
  res.json({ success: true, user: req.user });
}

module.exports = { register, login, me };
