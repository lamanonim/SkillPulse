const db = require('../db');
const AppError = require('../utils/AppError');
const { validateAssessment } = require('../utils/validators');
const { scoreAnswers, tasksNeeded } = require('../services/assessmentService');

// GET /api/assessments/questions/:direction
// Suallar düzgün cavabsız göndərilir!
async function getQuestions(req, res) {
  const direction = String(req.params.direction).toLowerCase();
  const questions = await db.getQuestionsByDirection(direction);

  if (questions.length === 0) throw new AppError(`"${direction}" istiqaməti üzrə sual tapılmadı`, 404);

  const safe = questions.map(({ correct_answer, ...q }) => q);
  res.json({ success: true, direction, count: safe.length, questions: safe });
}

// POST /api/assessments
// Body: { direction: 'frontend', answers: [{ questionId: 1, answer: '<h1>' }] }
async function submitAssessment(req, res) {
  const { direction, answers } = validateAssessment(req.body || {});

  const questions = await db.getQuestionsByDirection(direction);
  if (questions.length === 0) throw new AppError(`"${direction}" istiqaməti üzrə sual tapılmadı`, 404);

  // 1) Cavabları yoxla, bacarıq üzrə % və səviyyə
  const results = scoreAnswers(questions, answers);

  // 2) Plan: Zəif -> 3, Orta -> 2, Güclü -> 0 tapşırıq
  const plan = [];
  for (const r of results) {
    const count = tasksNeeded(r.level);
    if (count === 0) continue;
    const tasks = await db.getTasksBySkill(r.skill, count);
    plan.push({ skill: r.skill, level: r.level, tasks: tasks.slice(0, count) });
  }

  const taskIds = plan.flatMap((p) => p.tasks.map((t) => t.id));

  // 3) Yadda saxla
  const assessment = await db.saveAssessment({ userId: req.user.id, direction, results, taskIds });

  res.status(201).json({
    success: true,
    assessmentId: assessment.id,
    direction,
    results,
    plan,
  });
}

module.exports = { getQuestions, submitAssessment };
