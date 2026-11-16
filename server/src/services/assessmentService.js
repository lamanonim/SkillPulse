/**
 * Qiymətləndirmə və plan məntiqi (DB-dən asılı olmayan, təmiz funksiyalar).
 */

const LEVELS = { STRONG: 'Güclü', MEDIUM: 'Orta', WEAK: 'Zəif' };

// Səviyyəyə görə neçə tapşırıq veriləcək
const TASKS_PER_LEVEL = { [LEVELS.WEAK]: 3, [LEVELS.MEDIUM]: 2, [LEVELS.STRONG]: 0 };

function getLevel(percentage) {
  if (percentage >= 70) return LEVELS.STRONG;
  if (percentage >= 40) return LEVELS.MEDIUM;
  return LEVELS.WEAK;
}

/**
 * Cavabları yoxlayır və bacarıq üzrə nəticə qaytarır.
 * Cavablandırılmayan suallar səhv sayılır (total-a daxildir).
 *
 * @param {Array} questions  DB-dən gələn suallar (correct_answer ilə)
 * @param {Array<{questionId, answer}>} answers
 * @returns {Array<{ skill, correct, total, percentage, level }>}
 */
function scoreAnswers(questions, answers) {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]));
  const bySkill = {};

  for (const q of questions) {
    if (!bySkill[q.skill]) bySkill[q.skill] = { skill: q.skill, correct: 0, total: 0 };
    bySkill[q.skill].total += 1;
    if (answerMap.get(q.id) === q.correct_answer) bySkill[q.skill].correct += 1;
  }

  return Object.values(bySkill).map((s) => {
    const percentage = Math.round((s.correct / s.total) * 100);
    return { ...s, percentage, level: getLevel(percentage) };
  });
}

function tasksNeeded(level) {
  return TASKS_PER_LEVEL[level] || 0;
}

module.exports = { LEVELS, getLevel, scoreAnswers, tasksNeeded };
