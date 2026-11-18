-- SkillPulse — verilənlər bazası sxemi (DB_CONTRACT.md-yə uyğun)
-- ⚠️ Bu fayl cədvəlləri SİLİB yenidən yaradır. Canlı bazada real istifadəçilər olanda işlətməyin!

-- Əvvəlki (köhnə) sxemin cədvəlləri də silinir
DROP TABLE IF EXISTS plan_items, skill_results, assessment_answers, skills, directions CASCADE;
DROP TABLE IF EXISTS user_tasks, assessments, tasks, questions, users CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE questions (
  id             SERIAL PRIMARY KEY,
  direction      VARCHAR(50)  NOT NULL,   -- 'frontend' | 'backend' (kiçik hərf)
  skill          VARCHAR(100) NOT NULL,   -- tasks.skill ilə EYNİ yazılmalı
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,          -- ["A","B","C","D"]
  correct_answer TEXT NOT NULL,           -- options-dakı birinin tam mətni
  -- correct_answer mütləq options-un içində olmalıdır
  CONSTRAINT correct_answer_in_options CHECK (options ? correct_answer)
);

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  skill       VARCHAR(100) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE assessments (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  direction  VARCHAR(50) NOT NULL,
  results    JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_tasks (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id       INTEGER NOT NULL REFERENCES tasks(id),
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  status        VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_direction ON questions(direction);
CREATE INDEX idx_tasks_skill         ON tasks(skill);
CREATE INDEX idx_assessments_user    ON assessments(user_id);
CREATE INDEX idx_user_tasks_user     ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_assess   ON user_tasks(assessment_id);
