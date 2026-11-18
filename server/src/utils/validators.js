const AppError = require('./AppError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Xəta varsa 400 atır, details-də hansı sahənin səhv olduğu göstərilir
function assertValid(errors) {
  if (Object.keys(errors).length > 0) {
    throw new AppError('Validasiya xətası', 400, errors);
  }
}

function validateRegister(body) {
  const errors = {};
  const { name, email, password } = body;

  if (typeof name !== 'string' || name.trim().length < 2) errors.name = 'Ad ən azı 2 simvol olmalıdır';
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) errors.email = 'Düzgün email daxil edin';
  if (typeof password !== 'string' || password.length < 6) errors.password = 'Şifrə ən azı 6 simvol olmalıdır';

  assertValid(errors);
  return { name: name.trim(), email: email.trim().toLowerCase(), password };
}

function validateLogin(body) {
  const errors = {};
  const { email, password } = body;

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) errors.email = 'Düzgün email daxil edin';
  if (typeof password !== 'string' || password.length === 0) errors.password = 'Şifrə tələb olunur';

  assertValid(errors);
  return { email: email.trim().toLowerCase(), password };
}

// Gözlənilən format: { direction: 'frontend', answers: [{ questionId: 1, answer: '<h1>' }, ...] }
function validateAssessment(body) {
  const errors = {};
  const { direction, answers } = body;

  if (typeof direction !== 'string' || direction.trim() === '') errors.direction = 'İstiqamət tələb olunur';

  if (!Array.isArray(answers) || answers.length === 0) {
    errors.answers = 'Cavablar boş olmayan massiv olmalıdır';
  } else {
    const bad = answers.some(
      (a) => !a || !Number.isInteger(Number(a.questionId)) || typeof a.answer !== 'string'
    );
    if (bad) errors.answers = 'Hər cavab { questionId: number, answer: string } formatında olmalıdır';
  }

  assertValid(errors);
  return {
    direction: direction.trim().toLowerCase(),
    answers: answers.map((a) => ({ questionId: Number(a.questionId), answer: a.answer })),
  };
}

module.exports = { validateRegister, validateLogin, validateAssessment };
