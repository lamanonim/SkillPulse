/**
 * MÜVƏQQƏTİ MOCK DB
 * ------------------------------------------------------------------
 * 3-cü nəfər real PostgreSQL versiyasını hazırlayana qədər məlumatlar
 * yaddaşda (RAM) saxlanılır. Server yenidən başlayanda hər şey silinir.
 *
 * VACİB: Real versiyada funksiya adları, parametrlər və qaytarılan
 * obyektlərin formatı EYNİ qalmalıdır ki, controller-lər dəyişməsin.
 * Bütün funksiyalar async-dir (pg də Promise qaytarır).
 */

// ---------------- Seed məlumatları ----------------

const questions = [
  // ===== frontend =====
  { id: 1, direction: 'frontend', skill: 'HTML', question: 'Hansı teq ən böyük başlıq üçündür?', options: ['<h6>', '<h1>', '<head>', '<title>'], correct_answer: '<h1>' },
  { id: 2, direction: 'frontend', skill: 'HTML', question: 'Linki yeni tabda açmaq üçün hansı atribut istifadə olunur?', options: ['target="_blank"', 'rel="new"', 'href="_new"', 'open="tab"'], correct_answer: 'target="_blank"' },
  { id: 3, direction: 'frontend', skill: 'HTML', question: 'Semantik teq hansıdır?', options: ['<div>', '<span>', '<article>', '<b>'], correct_answer: '<article>' },

  { id: 4, direction: 'frontend', skill: 'CSS', question: 'Flexbox-da elementləri üfüqi mərkəzləşdirən xassə?', options: ['align-items', 'justify-content', 'text-align', 'float'], correct_answer: 'justify-content' },
  { id: 5, direction: 'frontend', skill: 'CSS', question: 'Ən yüksək spesifiklik hansıdır?', options: ['.class', 'div', '#id', '*'], correct_answer: '#id' },
  { id: 6, direction: 'frontend', skill: 'CSS', question: 'position: absolute element nəyə görə yerləşir?', options: ['body-yə', 'Ən yaxın positioned valideynə', 'Viewport-a', 'Əvvəlki qardaş elementə'], correct_answer: 'Ən yaxın positioned valideynə' },

  { id: 7, direction: 'frontend', skill: 'JavaScript', question: 'typeof null nə qaytarır?', options: ['"null"', '"undefined"', '"object"', '"number"'], correct_answer: '"object"' },
  { id: 8, direction: 'frontend', skill: 'JavaScript', question: 'Hansı açar söz blok scope yaradır?', options: ['var', 'let', 'function', 'this'], correct_answer: 'let' },
  { id: 9, direction: 'frontend', skill: 'JavaScript', question: '[1,2,3].map(x => x * 2) nəticəsi?', options: ['[1,2,3]', '[2,4,6]', '6', 'undefined'], correct_answer: '[2,4,6]' },

  // ===== backend =====
  { id: 10, direction: 'backend', skill: 'Node.js', question: 'Node.js hansı mühərrik üzərində işləyir?', options: ['SpiderMonkey', 'V8', 'Chakra', 'JVM'], correct_answer: 'V8' },
  { id: 11, direction: 'backend', skill: 'Node.js', question: 'Express-də middleware-i növbətiyə ötürən funksiya?', options: ['done()', 'next()', 'pass()', 'continue()'], correct_answer: 'next()' },
  { id: 12, direction: 'backend', skill: 'Node.js', question: 'package.json-da asılılıqları quraşdıran əmr?', options: ['npm start', 'npm install', 'node install', 'npm run'], correct_answer: 'npm install' },

  { id: 13, direction: 'backend', skill: 'SQL', question: 'Təkrarlanan sətirləri çıxaran açar söz?', options: ['UNIQUE', 'DISTINCT', 'GROUP', 'ONLY'], correct_answer: 'DISTINCT' },
  { id: 14, direction: 'backend', skill: 'SQL', question: 'Hər iki cədvəldə uyğun gələn sətirləri qaytaran JOIN?', options: ['LEFT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN'], correct_answer: 'INNER JOIN' },
  { id: 15, direction: 'backend', skill: 'SQL', question: 'Qruplaşdırılmış nəticəni filtrləyən hissə?', options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], correct_answer: 'HAVING' },
];

const tasks = [
  { id: 1, skill: 'HTML', title: 'Semantik teqlərlə bloq səhifəsi qur', description: 'header, nav, main, article, footer istifadə et.' },
  { id: 2, skill: 'HTML', title: 'Qeydiyyat formu hazırla', description: 'input tipləri, label və required atributlarını tətbiq et.' },
  { id: 3, skill: 'HTML', title: 'MDN-də HTML forms bölməsini oxu', description: 'Əsas form elementlərinin siyahısını çıxar.' },
  { id: 4, skill: 'CSS', title: 'Flexbox Froggy oyununu bitir', description: 'Bütün 24 səviyyəni keç.' },
  { id: 5, skill: 'CSS', title: 'Responsiv kart grid-i yarat', description: 'CSS Grid və media query istifadə et.' },
  { id: 6, skill: 'CSS', title: 'Position xassələrini praktikada yoxla', description: 'relative/absolute/fixed/sticky üçün demo hazırla.' },
  { id: 7, skill: 'JavaScript', title: 'To-do list tətbiqi yaz', description: 'DOM manipulyasiyası və localStorage ilə.' },
  { id: 8, skill: 'JavaScript', title: 'Array metodları üzrə 10 tapşırıq həll et', description: 'map, filter, reduce, find istifadə et.' },
  { id: 9, skill: 'JavaScript', title: 'Fetch ilə açıq API-dən məlumat göstər', description: 'async/await və xəta idarəsi ilə.' },
  { id: 10, skill: 'Node.js', title: 'Sadə Express REST API yaz', description: 'CRUD endpoint-ləri ilə.' },
  { id: 11, skill: 'Node.js', title: 'Custom logger middleware yaz', description: 'Hər sorğunun metodu və müddətini log et.' },
  { id: 12, skill: 'Node.js', title: 'fs modulu ilə fayl oxu/yaz', description: 'Promise əsaslı fs/promises istifadə et.' },
  { id: 13, skill: 'SQL', title: 'SQLBolt dərslərini bitir', description: 'İlk 12 dərsi keç.' },
  { id: 14, skill: 'SQL', title: 'JOIN növləri üzrə 5 sorğu yaz', description: 'INNER, LEFT, RIGHT nümunələri.' },
  { id: 15, skill: 'SQL', title: 'GROUP BY + HAVING tapşırıqları', description: 'Aqreqat funksiyalarla hesabat sorğuları yaz.' },
];

// Dinamik "cədvəllər"
const users = [];
const assessments = [];
const userTasks = []; // { id, user_id, task_id, assessment_id, status: 'pending'|'done', ... }

let userSeq = 1;
let assessmentSeq = 1;
let userTaskSeq = 1;

const now = () => new Date().toISOString();

// ---------------- Funksiyalar ----------------

/**
 * @param {{ name: string, email: string, passwordHash: string }} data
 * @returns {Promise<{ id, name, email, created_at }>}  (password_hash QAYTARILMIR)
 */
async function createUser({ name, email, passwordHash }) {
  const user = { id: userSeq++, name, email, password_hash: passwordHash, created_at: now() };
  users.push(user);
  const { password_hash, ...safe } = user;
  return safe;
}

/**
 * @param {string} email
 * @returns {Promise<{ id, name, email, password_hash, created_at } | null>}
 */
async function findUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

/**
 * @param {string} direction  məs: 'frontend', 'backend'
 * @returns {Promise<Array<{ id, direction, skill, question, options: string[], correct_answer }>>}
 */
async function getQuestionsByDirection(direction) {
  return questions.filter((q) => q.direction === direction);
}

/**
 * @param {string} skill
 * @param {number} [limit]
 * @returns {Promise<Array<{ id, skill, title, description }>>}
 */
async function getTasksBySkill(skill, limit) {
  const list = tasks.filter((t) => t.skill === skill);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

/**
 * Qiymətləndirməni və ona bağlı tapşırıq planını saxlayır.
 * @param {{ userId, direction, results: Array<{skill, correct, total, percentage, level}>, taskIds: number[] }} data
 * @returns {Promise<{ id, user_id, direction, results, created_at }>}
 */
async function saveAssessment({ userId, direction, results, taskIds = [] }) {
  const assessment = { id: assessmentSeq++, user_id: userId, direction, results, created_at: now() };
  assessments.push(assessment);

  for (const taskId of taskIds) {
    userTasks.push({
      id: userTaskSeq++,
      user_id: userId,
      task_id: taskId,
      assessment_id: assessment.id,
      status: 'pending',
      created_at: now(),
    });
  }
  return assessment;
}

/**
 * İstifadəçinin son qiymətləndirməsi və tapşırıqları.
 * @param {number} userId
 * @returns {Promise<{ assessment: object|null, tasks: Array<{ id, task_id, skill, title, description, status }> }>}
 */
async function getUserProgress(userId) {
  const mine = assessments.filter((a) => a.user_id === userId);
  const latest = mine[mine.length - 1] || null;
  if (!latest) return { assessment: null, tasks: [] };

  const list = userTasks
    .filter((ut) => ut.user_id === userId && ut.assessment_id === latest.id)
    .map((ut) => {
      const t = tasks.find((x) => x.id === ut.task_id);
      return { id: ut.id, task_id: ut.task_id, skill: t.skill, title: t.title, description: t.description, status: ut.status };
    });

  return { assessment: latest, tasks: list };
}

/**
 * Tapşırığın statusunu pending <-> done dəyişir.
 * @param {number} userId
 * @param {number} userTaskId  (user_tasks cədvəlindəki id)
 * @returns {Promise<{ id, task_id, status } | null>}  tapılmasa null
 */
async function toggleTaskStatus(userId, userTaskId) {
  const ut = userTasks.find((x) => x.id === userTaskId && x.user_id === userId);
  if (!ut) return null;
  ut.status = ut.status === 'done' ? 'pending' : 'done';
  return { id: ut.id, task_id: ut.task_id, status: ut.status };
}

module.exports = {
  createUser,
  findUserByEmail,
  getQuestionsByDirection,
  getTasksBySkill,
  saveAssessment,
  getUserProgress,
  toggleTaskStatus,
};
