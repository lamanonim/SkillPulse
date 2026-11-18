# SkillPulse Backend API — Frontend üçün müqavilə

> Bu sənəd Frontend (React + Vite + Axios) tərəfi üçündür. Burada yazılan URL-lər, sorğu və cavab formatları backend-də **artıq işləyir**. Frontend kodu bu formatlara tam uyğun yazılmalıdır. Format haqqında təxmin etmə, burada yazılmayan bir şey lazımdırsa Backend-dən (1-ci nəfər) soruş.

## 1. Əsas məlumatlar

| | |
|---|---|
| Lokal base URL | `http://localhost:5000/api` |
| Production base URL | Render deploy olunandan sonra veriləcək |
| Format | JSON (`Content-Type: application/json`) |
| Auth | JWT, header-də: `Authorization: Bearer <token>` |
| Token müddəti | 7 gün |
| CORS | Hazırda yalnız `http://localhost:5173` (Vite default) icazəlidir. Vercel ünvanını Backend-ə göndər, əlavə olunacaq |

Base URL-i `.env`-də saxla: `VITE_API_URL=http://localhost:5000/api`

**Diqqət:** Backend hazırda müvəqqəti mock DB ilə işləyir. Server yenidən başlayanda bütün istifadəçilər silinir. Login birdən `401` qaytarırsa, yenidən register et.

## 2. Ümumi cavab formatı

Uğurlu cavabların hamısında `"success": true` olur.

Xətaların hamısı **eyni formatdadır**:

```json
{
  "success": false,
  "message": "İstifadəçiyə göstərilə bilən mesaj (Azərbaycan dilində)",
  "errors": { "email": "Düzgün email daxil edin" }
}
```

- `errors` yalnız validasiya xətalarında (400) olur. Açarlar form sahələrinin adlarıdır, ona görə hər sahənin altında öz xətasını göstərmək olar.
- `message`-i birbaşa UI-da göstərmək olar.

| Status | Nə vaxt |
|---|---|
| 400 | Validasiya xətası və ya səhv JSON |
| 401 | Token yoxdur, etibarsızdır, vaxtı bitib, və ya login səhvdir |
| 404 | Tapılmadı (istiqamət, tapşırıq, route) |
| 409 | Email artıq qeydiyyatdan keçib |
| 500 | Server xətası |

## 3. Tövsiyə olunan Axios quraşdırması

```js
// src/api/client.js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Qorunan route-da 401 gəlsə: tokeni sil, login səhifəsinə yönləndir
    if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

Xəta mesajını belə götür: `err.response?.data?.message`. Sahə xətaları: `err.response?.data?.errors`.

## 4. Endpoint-lər

### 4.1 `POST /auth/register`, token lazım deyil

Sorğu:
```json
{ "name": "Aysel", "email": "aysel@mail.com", "password": "123456" }
```
Qaydalar: `name` ən azı 2 simvol, `email` düzgün format, `password` ən azı 6 simvol. Email avtomatik kiçik hərfə çevrilir.

Cavab `201`:
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "name": "Aysel", "email": "aysel@mail.com" }
}
```
Qeydiyyatdan sonra istifadəçi **avtomatik daxil olmuş sayılır**. `token`-i saxla, ayrıca login etmək lazım deyil.

Xətalar: `400` (validasiya), `409` (email artıq var).

### 4.2 `POST /auth/login`, token lazım deyil

Sorğu:
```json
{ "email": "aysel@mail.com", "password": "123456" }
```
Cavab `200`: register ilə eyni formatdadır (`token`, `user`).

Xətalar: `400` (validasiya), `401` (`"Email və ya şifrə yanlışdır"`).

### 4.3 `GET /auth/me` 🔒

Səhifə yenilənəndə tokenin hələ etibarlı olduğunu yoxlamaq və istifadəçini almaq üçündür.

Cavab `200`:
```json
{ "success": true, "user": { "id": 1, "email": "aysel@mail.com", "name": "Aysel" } }
```

### 4.4 `GET /assessments/questions/:direction` 🔒

`:direction` mümkün dəyərləri: `frontend`, `backend` (kiçik hərflə).

Cavab `200`:
```json
{
  "success": true,
  "direction": "frontend",
  "count": 9,
  "questions": [
    {
      "id": 1,
      "direction": "frontend",
      "skill": "HTML",
      "question": "Hansı teq ən böyük başlıq üçündür?",
      "options": ["<h6>", "<h1>", "<head>", "<title>"]
    }
  ]
}
```
- Düzgün cavab frontend-ə **göndərilmir**. Yoxlamanı backend edir.
- `options` mətn massividir. İstifadəçi seçəndə həmin variantın **mətnini olduğu kimi** göndər (indeksini yox).
- Mövcud olmayan istiqamət üçün `404` qaytarılır.

### 4.5 `POST /assessments` 🔒: testi təqdim et

Sorğu:
```json
{
  "direction": "frontend",
  "answers": [
    { "questionId": 1, "answer": "<h1>" },
    { "questionId": 4, "answer": "justify-content" }
  ]
}
```
- `answer` = seçilmiş variantın tam mətni (`options`-dakı ilə eyni).
- Cavablandırılmayan suallar göndərilməyə bilər, onlar **səhv** sayılır.
- `answers` boş olmamalıdır.

Cavab `201`:
```json
{
  "success": true,
  "assessmentId": 1,
  "direction": "frontend",
  "results": [
    { "skill": "HTML", "correct": 3, "total": 3, "percentage": 100, "level": "Güclü" },
    { "skill": "CSS", "correct": 2, "total": 3, "percentage": 67, "level": "Orta" },
    { "skill": "JavaScript", "correct": 0, "total": 3, "percentage": 0, "level": "Zəif" }
  ],
  "plan": [
    {
      "skill": "CSS",
      "level": "Orta",
      "tasks": [
        { "id": 4, "skill": "CSS", "title": "Flexbox Froggy oyununu bitir", "description": "Bütün 24 səviyyəni keç." },
        { "id": 5, "skill": "CSS", "title": "Responsiv kart grid-i yarat", "description": "CSS Grid və media query istifadə et." }
      ]
    },
    {
      "skill": "JavaScript",
      "level": "Zəif",
      "tasks": [ { "id": 7, "...": "..." }, { "id": 8, "...": "..." }, { "id": 9, "...": "..." } ]
    }
  ]
}
```
- `level` yalnız bu 3 dəyərdən biridir: `"Güclü"` (≥70%), `"Orta"` (40–69%), `"Zəif"` (<40%). Rəng və ikon üçün bu mətnləri istifadə et.
- `plan`-da yalnız Orta (2 tapşırıq) və Zəif (3 tapşırıq) bacarıqlar olur. Güclü bacarıq plana düşmür. Hamısı Güclüdürsə, `plan` boş massiv `[]` olur, bunu UI-da ayrıca göstər.
- Bu cavab nəticə səhifəsi üçündür. Tapşırıqları "bitdi" kimi işarələmək üçün progress endpoint-ini istifadə et (aşağıda), çünki orada lazım olan ID var.

### 4.6 `GET /progress` 🔒

İstifadəçinin **ən son** qiymətləndirməsi və onun tapşırıqları.

Cavab `200`:
```json
{
  "success": true,
  "assessment": {
    "id": 1,
    "user_id": 1,
    "direction": "frontend",
    "results": [ { "skill": "HTML", "correct": 3, "total": 3, "percentage": 100, "level": "Güclü" } ],
    "created_at": "2026-11-16T17:47:01.719Z"
  },
  "tasks": [
    {
      "id": 1,
      "task_id": 4,
      "skill": "CSS",
      "title": "Flexbox Froggy oyununu bitir",
      "description": "Bütün 24 səviyyəni keç.",
      "status": "pending"
    }
  ],
  "summary": { "total": 5, "done": 1, "pending": 4, "percentage": 20 }
}
```
- `status`: `"pending"` və ya `"done"`.
- İstifadəçi hələ test verməyibsə: `assessment: null`, `tasks: []`, `summary`-də hamısı `0`. Bu halda "Testə başla" ekranını göstər.
- `summary.percentage` progress bar üçün hazır dəyərdir.

### 4.7 `PATCH /progress/tasks/:taskId/toggle` 🔒

Tapşırığın statusunu `pending` ↔ `done` dəyişir. Body lazım deyil.

⚠️ **`:taskId` = `GET /progress` cavabındakı `tasks[].id`-dir, `task_id` deyil.**
Nümunə: yuxarıdakı tapşırıq üçün `PATCH /progress/tasks/1/toggle` (4 yox).

Cavab `200`:
```json
{ "success": true, "task": { "id": 1, "task_id": 4, "status": "done" } }
```
Xətalar: `400` (ID rəqəm deyil), `404` (tapşırıq yoxdur və ya bu istifadəçiyə aid deyil).

Toggle-dan sonra UI-da həmin tapşırığın `status`-unu yenilə. `summary`-ni ya lokal hesabla, ya da `GET /progress`-i yenidən çağır.

### 4.8 `GET /health`, token lazım deyil

Server işləyirmi deyə yoxlamaq üçündür: `{ "success": true, "status": "ok", "time": "..." }`

## 5. Tövsiyə olunan istifadəçi axını

1. Register və ya login, sonra `token`-i `localStorage`-a yaz.
2. Tətbiq açılanda token varsa `GET /auth/me` çağır. 401 gəlsə, login səhifəsinə yönləndir.
3. İstiqamət seçimi (`frontend` / `backend`), sonra `GET /assessments/questions/:direction`.
4. Test ekranı: suallar və variantlar. Sonda `POST /assessments`.
5. Nəticə ekranı: `results` (bacarıq faizləri və səviyyələr) və `plan`.
6. Dashboard / Progress: `GET /progress`. Checkbox kliklənəndə `PATCH /progress/tasks/:id/toggle`.
