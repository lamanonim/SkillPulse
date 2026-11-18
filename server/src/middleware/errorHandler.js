const AppError = require('../utils/AppError');

// Heç bir route uyğun gəlmədikdə
function notFound(req, res, next) {
  next(new AppError(`Route tapılmadı: ${req.method} ${req.originalUrl}`, 404));
}

// Mərkəzi xəta idarəetməsi — bütün xətalar bura gəlir
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Səhv JSON body (express.json parse xətası)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'JSON formatı səhvdir' });
  }

  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) console.error('[XƏTA]', err);

  res.status(statusCode).json({
    success: false,
    // 500 xətalarında daxili detalları production-da gizlədirik
    message: isServerError && process.env.NODE_ENV === 'production' ? 'Serverdə xəta baş verdi' : err.message,
    ...(err.details && { errors: err.details }),
  });
}

module.exports = { notFound, errorHandler };
