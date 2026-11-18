# SkillPulse — `server/src/db/index.js` üçün müqavilə (Data/DB üçün)

> Bu sənəd Data/DB tərəfi (PostgreSQL, Neon/Supabase) üçündür. Backend controller-ləri artıq yazılıb və hazırda **mock** `server/src/db/index.js` ilə işləyir. Sənin vəzifən həmin faylı real PostgreSQL versiyası ilə **əvəz etməkdir**. Funksiya adları, parametrlər və qaytarılan obyektlərin formatı burada yazıldığı kimi **dəqiq** qalmalıdır. Əks halda backend sınacaq. Nəsə dəyişmək lazımdırsa, əvvəlcə Backend-lə (1-ci nəfər) razılaş.
>
> Referans: mock versiyanı aç: `server/src/db/index.js` (`backend` branch). Davranış ondakı ilə eyni olmalıdır.

## 1. Texniki tələblər

- **CommonJS** modulu: `require` və `module.exports` (ESM `import/export` yox).
- Paket: `pg` (`npm install pg`, `server/` qovluğunda).
- Qoşulma: `process.env.DATABASE_URL`. `dotenv` artıq `src/app.js`-də yüklənir, faylda yenidən çağırmaq lazım deyil.
- Neon/Supabase üçün SSL: `new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })`
- **Bütün funksiyalar `async`** olmalıdır (Promise qaytarmalıdır).
- **Parametrləşdirilmiş sorğular** (`$1, $2`). String birləşdirmə ilə SQL yazma (SQL injection).
- Xətanı udma (boş `catch` yazma). Xəta baş verərsə `throw` olsun, backend onu mərkəzi şəkildə tutur.
- Tapılmayan tək obyekt üçün **`null`** qaytar (`undefined` yox). Siyahılar üçün boş massiv `[]`.
- Qaytarılan sahə adları **snake_case**-dir (`password_hash`, `correct_answer`, `user_id`, `task_id`, `created_at`). PostgreSQL sütun adları bunlardırsa, `SELECT` ilə birbaşa gəlir.
- **ID-lər integer** olmalıdır (`SERIAL` / `INTEGER GENERATED ALWAYS AS IDENTITY`). UUID istifadə etsən, backend-dəki toggle route-u sınacaq, əvvəlcədən xəbər ver.

## 2. Funksiyalar (7 ədəd, hamısı export olunmalıdır)

```js
module.exports = {
  createUser,
  findUserByEmail,
  getQuestionsByDirection,
  getTasksBySkill,
  saveAssessment,
  getUserProgress,
  toggleTaskStatus,
};
```

### 2.1 `createUser({ name, email, passwordHash })`
- Giriş: **bir obyekt**. `passwordHash` artıq bcrypt ilə hash olunub, onu `password_hash` sütununa yaz. Email artıq kiçik hərfə çevrilib.
- Qaytarır: `{ id, name, email, created_at }`
- ⚠️ `password_hash`-i **qaytarma**.
- `email` sütununda `UNIQUE` olsun. Backend əvvəlcə `findUserByEmail` ilə yoxlayır, amma qoruma DB-də də olmalıdır.

### 2.2 `findUserByEmail(email)`
- Giriş: string.
- Qaytarır: `{ id, name, email, password_hash, created_at }` və ya `null`.
- ⚠️ Burada `password_hash` **mütləq olmalıdır**, login bcrypt ilə onu yoxlayır.

### 2.3 `getQuestionsByDirection(direction)`
- Giriş: string, kiçik hərflə: `'frontend'` və ya `'backend'`.
- Qaytarır: massiv, `id`-yə görə sıralanmış:
  ```js
  [{ id, direction, skill, question, options, correct_answer }]
  ```
- ⚠️ `options` **JS massivi** olmalıdır (`['<h6>', '<h1>', ...]`), JSON string yox. `TEXT[]` və ya `JSONB` sütunu istifadə et, `pg` hər ikisini avtomatik massivə çevirir.
- `correct_answer` `options`-dakı variantlardan birinin **tam mətni** ilə eyni olmalıdır (boşluq və hərf ölçüsü daxil). Backend cavabları `===` ilə müqayisə edir.
- İstiqamət yoxdursa: `[]`.

### 2.4 `getTasksBySkill(skill, limit)`
- Giriş: `skill` string (`'CSS'`), `limit` rəqəm (backend 2 və ya 3 göndərir) və ya `undefined` (onda hamısını qaytar).
- Qaytarır: `[{ id, skill, title, description }]`, `id`-yə görə sıralanmış, ən çox `limit` qədər.

### 2.5 `saveAssessment({ userId, direction, results, taskIds })`
- Giriş:
  - `userId`: integer
  - `direction`: string
  - `results`: massiv `[{ skill, correct, total, percentage, level }]`. Olduğu kimi saxla (`JSONB` sütunu tövsiyə olunur).
  - `taskIds`: integer massivi (`tasks.id`). Boş ola bilər.
- Edir:
  1. `assessments` cədvəlinə bir sətir əlavə edir.
  2. Hər `taskId` üçün `user_tasks` cədvəlinə bir sətir əlavə edir (`user_id`, `task_id`, `assessment_id`, `status='pending'`).
  - Bu ikisi **bir tranzaksiyada** olsun (`BEGIN` / `COMMIT` / `ROLLBACK`, `pool.connect()` ilə bir client).
- Qaytarır: `{ id, user_id, direction, results, created_at }` (`results` yenə massiv olaraq).

### 2.6 `getUserProgress(userId)`
- Giriş: integer.
- Qaytarır **həmişə bir obyekt**:
  ```js
  {
    assessment: { id, user_id, direction, results, created_at } | null,  // ƏN SON qiymətləndirmə
    tasks: [{ id, task_id, skill, title, description, status }]           // yalnız həmin qiymətləndirməyə aid
  }
  ```
- `assessment` = həmin istifadəçinin **ən son** qiymətləndirməsi (`ORDER BY created_at DESC, id DESC LIMIT 1`).
- `tasks`:
  - `user_tasks` ilə `tasks`-ı JOIN et, `assessment_id = son qiymətləndirmə`, `ORDER BY user_tasks.id`.
  - ⚠️ `id` = **`user_tasks.id`**.
  - `task_id` = `tasks.id`.
  - `skill`, `title`, `description` `tasks` cədvəlindən gəlir.
  - `status` `user_tasks`-dan gəlir.
- İstifadəçinin heç bir qiymətləndirməsi yoxdursa: `{ assessment: null, tasks: [] }`.

### 2.7 `toggleTaskStatus(userId, userTaskId)`
- Giriş: hər ikisi integer. `userTaskId` = `user_tasks.id`.
- Edir: `status`-u `'pending'` ↔ `'done'` dəyişir.
- ⚠️ `WHERE id = $1 AND user_id = $2` şərti **mütləqdir**, istifadəçi başqasının tapşırığını dəyişə bilməməlidir.
- Qaytarır: `{ id, task_id, status }` (yeni status ilə) və ya sətir tapılmasa **`null`** (backend bundan 404 çıxarır).
- Bir sorğu ilə etmək olar:
  `UPDATE user_tasks SET status = CASE WHEN status='done' THEN 'pending' ELSE 'done' END WHERE id=$1 AND user_id=$2 RETURNING id, task_id, status`

## 3. Tövsiyə olunan cədvəl strukturu

Sütun adlarını dəyişsən, `SELECT`-də `AS` ilə yuxarıdakı adlara uyğunlaşdır.

```sql
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
  correct_answer TEXT NOT NULL            -- options-dakı birinin tam mətni
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
  status        VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','done')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_direction ON questions(direction);
CREATE INDEX idx_tasks_skill        ON tasks(skill);
CREATE INDEX idx_assessments_user   ON assessments(user_id);
CREATE INDEX idx_user_tasks_user    ON user_tasks(user_id);
```

Qeyd: `JSONB` sütununa yazanda `pg`-yə massivi `JSON.stringify(arr)` kimi ötür. Oxuyanda avtomatik massiv gəlir.

## 4. Seed məlumatlar üçün qaydalar

- `direction` dəyərləri kiçik hərflə: `frontend`, `backend`. Frontend bu adlarla sorğu göndərir.
- `questions.skill` və `tasks.skill` **hərfi-hərfinə eyni** olmalıdır (`'JavaScript'` ≠ `'Javascript'`). Əks halda plana tapşırıq düşməz.
- Hər bacarıq üçün **ən azı 3 tapşırıq** olsun (Zəif səviyyəyə 3 tapşırıq verilir).
- Hər bacarıq üçün ən azı 3 sual olsun ki, faizlər mənalı çıxsın.
- Başlanğıc məzmun mock-da hazırdır: `server/src/db/index.js`-dəki `questions` (15) və `tasks` (15) massivləri. Onları `INSERT`-ə çevirmək olar.

## 5. Hazır olanda (təhvil)

1. Yeni `server/src/db/index.js`. Mock faylı birbaşa əvəz edir.
2. Cədvəl yaradan və seed edən SQL faylları (məs. `server/src/db/schema.sql`, `server/src/db/seed.sql`).
3. `DATABASE_URL`, təhlükəsiz kanalla Backend-ə. GitHub-a **commit etmə**.

Backend `npm install pg` edəcək, `.env`-ə `DATABASE_URL` yazacaq və bütün endpoint-ləri yenidən test edəcək.
