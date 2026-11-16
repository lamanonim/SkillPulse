// Bazanı qurur: schema.sql + seed.sql
// İşə salmaq (server qovluğunda):  node src/db/setup.js
// ⚠️ Bütün cədvəlləri silib yenidən yaradır!
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { pool } = require('./index');

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL tapılmadı. server/.env faylını yoxlayın.');
  }
  for (const file of ['schema.sql', 'seed.sql']) {
    await pool.query(fs.readFileSync(path.join(__dirname, file), 'utf8'));
    console.log('✔ ' + file);
  }
  const { rows } = await pool.query(`
    SELECT (SELECT COUNT(*) FROM questions)::int AS questions,
           (SELECT COUNT(*) FROM tasks)::int     AS tasks`);
  console.log('Baza hazırdır:', rows[0]);
}

run()
  .catch((err) => {
    console.error('Xəta:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
