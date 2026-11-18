// Gözlənilən (idarə olunan) xətalar üçün: throw new AppError('Mesaj', 400)
class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = AppError;
