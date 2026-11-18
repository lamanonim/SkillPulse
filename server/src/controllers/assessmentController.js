const db = require('../db');
const AppError = require('../utils/AppError');
const { validateAssessment } = require('../utils/validators');
const { scoreAnswers, tasksNeeded } = require('../services/assessmentService');

/**
 * @openapi
 * /api/assessments/questions/{direction}:
 *   get:
 *     tags: [Assessments]
 *     summary: İstiqamət üzrə test sualları
 *     description: Suallar düzgün cavab olmadan göndərilir.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: direction
 *         required: true
 *         schema: { type: string, enum: [frontend, backend] }
 *     responses:
 *       200:
 *         description: Sual siyahısı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 direction: { type: string, example: frontend }
 *                 count: { type: integer, example: 9 }
 *                 questions:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Question' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
async function getQuestions(req, res) {
  const direction = String(req.params.direction).toLowerCase();
  const questions = await db.getQuestionsByDirection(direction);

  if (questions.length === 0) throw new AppError(`"${direction}" istiqaməti üzrə sual tapılmadı`, 404);

  const safe = questions.map(({ correct_answer, ...q }) => q);
  res.json({ success: true, direction, count: safe.length, questions: safe });
}

/**
 * @openapi
 * /api/assessments:
 *   post:
 *     tags: [Assessments]
 *     summary: Testi təqdim et, nəticə və fərdi plan al
 *     description: |
 *       Cavablar yoxlanır, bacarıq üzrə faiz və səviyyə hesablanır.
 *       Zəif bacarığa 3, Orta bacarığa 2 tapşırıq təyin olunur, Güclü bacarıq plana düşmür.
 *       Cavablandırılmayan suallar səhv sayılır.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [direction, answers]
 *             properties:
 *               direction: { type: string, example: frontend }
 *               answers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [questionId, answer]
 *                   properties:
 *                     questionId: { type: integer, example: 1 }
 *                     answer: { type: string, example: '<h1>', description: Seçilmiş variantın tam mətni }
 *     responses:
 *       201:
 *         description: Nəticə və plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 assessmentId: { type: integer, example: 1 }
 *                 direction: { type: string, example: frontend }
 *                 results:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/SkillResult' }
 *                 plan:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/PlanItem' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
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
