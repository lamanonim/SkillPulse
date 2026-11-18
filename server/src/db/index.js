/**
 * REAL PostgreSQL DB (mock faylın əvəzi)
 * ------------------------------------------------------------------
 * Funksiya adları, parametrlər və qaytarılan formatlar DB_CONTRACT.md
 * və əvvəlki mock ilə EYNİDİR. Controller-ləri dəyişmək lazım deyil.
 * dotenv src/app.js-də yüklənir.
 */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon/Supabase üçün SSL. Lokal Postgres-də .env-ə DB_SSL=false yazın.
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
});

// ---------------- Funksiyalar ----------------

/**
 * @param {{ name: string, email: string, passwordHash: string }} data
 * @returns {Promise<{ id, name, email, created_at }>}  (password_hash QAYTARILMIR)
 */
async function createUser({ name, email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );
  return rows[0];
}

/**
 * @param {string} email
 * @returns {Promise<{ id, name, email, password_hash, created_at } | null>}
 */
async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password_hash, created_at
     FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

/**
 * @param {string} direction  məs: 'frontend', 'backend'
 * @returns {Promise<Array<{ id, direction, skill, question, options: string[], correct_answer }>>}
 */
async function getQuestionsByDirection(direction) {
  const { rows } = await pool.query(
    `SELECT id, direction, skill, question, options, correct_answer
     FROM questions WHERE direction = $1
     ORDER BY id`,
    [direction]
  );
  return rows;
}

/**
 * @param {string} skill
 * @param {number} [limit]  verilməsə hamısı qaytarılır
 * @returns {Promise<Array<{ id, skill, title, description }>>}
 */
async function getTasksBySkill(skill, limit) {
  const { rows } = await pool.query(
    `SELECT id, skill, title, description
     FROM tasks WHERE skill = $1
     ORDER BY id
     LIMIT $2`, // LIMIT NULL = limitsiz
    [skill, typeof limit === 'number' ? limit : null]
  );
  return rows;
}

/**
 * Qiymətləndirməni və ona bağlı tapşırıq planını BİR tranzaksiyada saxlayır.
 * @param {{ userId, direction, results: Array<{skill, correct, total, percentage, level}>, taskIds: number[] }} data
 * @returns {Promise<{ id, user_id, direction, results, created_at }>}
 */
async function saveAssessment({ userId, direction, results, taskIds = [] }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO assessments (user_id, direction, results)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, direction, results, created_at`,
      [userId, direction, JSON.stringify(results)]
    );
    const assessment = rows[0];

    if (taskIds.length > 0) {
      await client.query(
        `INSERT INTO user_tasks (user_id, task_id, assessment_id, status)
         SELECT $1, t.task_id, $2, 'pending'
         FROM UNNEST($3::int[]) WITH ORDINALITY AS t(task_id, ord)
         ORDER BY t.ord`, // taskIds sırası qorunur
        [userId, assessment.id, taskIds]
      );
    }

    await client.query('COMMIT');
    return assessment;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * İstifadəçinin son qiymətləndirməsi və tapşırıqları.
 * @param {number} userId
 * @returns {Promise<{ assessment: object|null, tasks: Array<{ id, task_id, skill, title, description, status }> }>}
 */
async function getUserProgress(userId) {
  const { rows: aRows } = await pool.query(
    `SELECT id, user_id, direction, results, created_at
     FROM assessments
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC
     LIMIT 1`,
    [userId]
  );
  const assessment = aRows[0] || null;
  if (!assessment) return { assessment: null, tasks: [] };

  const { rows: tasks } = await pool.query(
    `SELECT ut.id, ut.task_id, t.skill, t.title, t.description, ut.status
     FROM user_tasks ut
     JOIN tasks t ON t.id = ut.task_id
     WHERE ut.user_id = $1 AND ut.assessment_id = $2
     ORDER BY ut.id`,
    [userId, assessment.id]
  );

  return { assessment, tasks };
}

/**
 * Tapşırığın statusunu pending <-> done dəyişir.
 * @param {number} userId
 * @param {number} userTaskId  (user_tasks cədvəlindəki id)
 * @returns {Promise<{ id, task_id, status } | null>}  tapılmasa null
 */
async function toggleTaskStatus(userId, userTaskId) {
  const { rows } = await pool.query(
    `UPDATE user_tasks
     SET status = CASE WHEN status = 'done' THEN 'pending' ELSE 'done' END
     WHERE id = $1 AND user_id = $2
     RETURNING id, task_id, status`,
    [userTaskId, userId]
  );
  return rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  getQuestionsByDirection,
  getTasksBySkill,
  saveAssessment,
  getUserProgress,
  toggleTaskStatus,
  pool, // setup skripti və testlər üçün
};
