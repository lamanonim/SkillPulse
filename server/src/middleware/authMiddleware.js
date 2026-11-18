const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Header: Authorization: Bearer <token>
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Token tapılmadı. Zəhmət olmasa daxil olun.', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Tokenin vaxtı bitib' : 'Token etibarsızdır';
    next(new AppError(message, 401));
  }
}

module.exports = authMiddleware;
