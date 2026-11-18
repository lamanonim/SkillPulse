# SkillPulse

**Karyera yolunu öz bacarıqlarınla qur.**

SkillPulse tələbələrə seçdikləri karyera istiqamətində hazırkı bacarıq səviyyəsini müəyyənləşdirməyə, çatışmayan bilikləri görməyə və onları inkişaf etdirmək üçün konkret plan əldə etməyə kömək edən veb-platformadır.

| | |
|---|---|
| 🌐 **Canlı sayt** | https://skill-pulse-sepia.vercel.app |
| ⚙️ **API** | https://skillpulse-zg86.onrender.com/api |
| 📘 **API sənədləri (Swagger)** | https://skillpulse-zg86.onrender.com/swagger |

> Backend Render-in pulsuz planında işləyir. Server bir müddət istifadə olunmayanda yatır, ona görə ilk sorğu 30–60 saniyə çəkə bilər.

---

## Problem

Tələbələr karyeraya hazırlaşarkən çox vaxt haradan başlamalı, hansı bacarıqları inkişaf etdirməli və hansı ardıcıllıqla irəliləməli olduqlarını bilmirlər. Məlumat internetdə var, amma dağınıqdır. Öz səviyyəni obyektiv ölçmək isə çətindir.

## Həll

SkillPulse bu prosesi vahid platformada birləşdirir:

1. **Qiymətləndirmə:** seçilmiş istiqamət üzrə real situasiyalara əsaslanan suallar.
2. **Şəffaf nəticə:** hər bacarıq üzrə faiz və aydın səviyyə (Güclü / Orta / Zəif).
3. **Fərdi inkişaf planı:** zəif və orta bacarıqlar üçün avtomatik seçilən praktiki tapşırıqlar.
4. **İrəliləyişin izlənməsi:** tamamlanan tapşırıqlar şəxsi kabinetdə izlənilir.

## Funksiyalar

- Qeydiyyat və giriş (JWT ilə autentifikasiya)
- 10 karyera istiqaməti, 174 sual, 108 praktiki tapşırıq
- Qaydalara əsaslanan qiymətləndirmə: əvvəlcədən müəyyən edilmiş meyarlar
- Avtomatik fərdi inkişaf planı
- Şəxsi kabinet: bacarıqlar, plan, irəliləyiş faizi
- Açıq və qaranlıq rejim (seçim yadda saxlanılır)
- Mobil cihazlara uyğun dizayn

## İstiqamətlər

| İstiqamət | Bacarıqlar | Sual |
|---|---|---|
| Frontend Developer | HTML, CSS, JavaScript, React, Git | 30 |
| Backend Developer | Node.js, Express, SQL, REST API, Veb təhlükəsizliyi | 30 |
| UI/UX Dizayn | UI əsasları, UX araşdırma, Figma, Rəng və tipoqrafiya, Prototipləmə | 30 |
| Data Analitika | Excel, SQL ilə analiz, Data vizualizasiya | 12 |
| Rəqəmsal Marketinq | SMM, SEO, Marketinq analitikası | 12 |
| QA (Testləşdirmə) | Manual testləşdirmə, Bug hesabatı, Avtomatlaşdırılmış test | 12 |
| Mobil Developer | Mobil UX, React Native, Mobil platformalar | 12 |
| DevOps | Linux, Docker, CI/CD | 12 |
| Kibertəhlükəsizlik | Şəbəkə təhlükəsizliyi, OWASP Top 10, Kriptoqrafiya əsasları | 12 |
| Layihə idarəetməsi | Agile və Scrum, Planlaşdırma, Komanda kommunikasiyası | 12 |

## Qiymətləndirmə qaydası

| Nəticə | Səviyyə | Plana düşən tapşırıq |
|---|---|---|
| ≥ 70% | Güclü | 0 |
| 40–69% | Orta | 2 |
| < 40% | Zəif | 3 |

Cavablandırılmayan suallar səhv sayılır. Düzgün cavablar frontend-ə göndərilmir, yoxlama serverdə aparılır.

## Texnologiyalar

| Hissə | Texnologiya |
|---|---|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express 5, JWT, bcryptjs, Swagger (OpenAPI) |
| Verilənlər bazası | PostgreSQL (Neon) |
| Deploy | Vercel (frontend), Render (backend) |

## Layihənin quruluşu

```
SkillPulse/
├── client/                 # React tətbiqi
│   └── src/
│       ├── api/            # Axios və token idarəsi
│       ├── context/        # Auth və tema (açıq/qaranlıq)
│       ├── components/     # Navbar, ikonlar, qrafiklər
│       └── pages/          # Səhifələr
└── server/                 # Express API
    ├── docs/               # API və DB müqavilələri
    └── src/
        ├── routes/ controllers/ services/ middleware/
        └── db/             # PostgreSQL qatı, sxem və məzmun
```

## API

| Metod | Endpoint | Təsvir | Token |
|---|---|---|---|
| POST | `/api/auth/register` | Qeydiyyat | — |
| POST | `/api/auth/login` | Giriş | — |
| GET | `/api/auth/me` | Cari istifadəçi | ✓ |
| GET | `/api/assessments/questions/:direction` | İstiqamət üzrə suallar | ✓ |
| POST | `/api/assessments` | Testi göndər, nəticə və plan al | ✓ |
| GET | `/api/progress` | Son nəticə və tapşırıqlar | ✓ |
| PATCH | `/api/progress/tasks/:taskId/toggle` | Tapşırığı tamamlandı / tamamlanmadı et | ✓ |
| GET | `/api/health` | Serverin vəziyyəti | — |

Ətraflı sxemlər: [Swagger](https://skillpulse-zg86.onrender.com/swagger), həmçinin `server/docs/` qovluğu.

## Lokal işə salma

Tələblər: Node.js 20+ və PostgreSQL bazası (məsələn Neon).

### Backend

```bash
cd server
npm install
```

`server/.env` faylı:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=uzun-təsadüfi-gizli-söz
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://...
```

Bazanı qurmaq üçün (yalnız ilk dəfə):

```bash
node src/db/setup.js
```

> ⚠️ `setup.js` bütün cədvəlləri silib yenidən yaradır. Canlı bazada işlətməyin.

Serveri işə salmaq:

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
```

`client/.env` faylı:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Sayt `http://localhost:5173` ünvanında açılacaq.

## Komanda

| Üzv | Rol |
|---|---|
| **Imameli Huseynov** | Backend: Express API, autentifikasiya, qiymətləndirmə və plan məntiqi, Swagger, Render deploy |
| **Rubabe Qubadova** | Data: PostgreSQL sxemi, DB qatı, 10 istiqamət üzrə sual və tapşırıq məzmunu, Neon |
| **Leman Mustafayeva** | Frontend: React tətbiqi, dizayn, açıq/qaranlıq rejim, Vercel deploy |

## Gələcək planlar

- Vakansiyalar bölməsi: vakansiyanın tələblərini istifadəçinin nəticələri ilə müqayisə
- Yeni istiqamətlər və hər bacarıq üçün daha çox sual
- Tələbələrdən rəy toplayıb qiymətləndirmə meyarlarını təkmilləşdirmək
- AI-ın real fayda verəcəyi funksiyaların araşdırılması (məs. fərdi tövsiyələr)
