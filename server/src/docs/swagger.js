const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const port = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SkillPulse API',
      version: '1.0.0',
      description:
        'Tələbələrin karyera istiqaməti üzrə biliklərini test edən və zəif bacarıqlara uyğun fərdi tapşırıq planı yaradan platformanın API-si.\n\n' +
        '**Qorunan route-lar (🔒)** üçün əvvəlcə `/api/auth/login` və ya `/api/auth/register` ilə token alın, sonra yuxarıdakı **Authorize** düyməsinə tokeni yapışdırın.\n\n' +
        '**Səviyyələr:** ≥70% Güclü, 40–69% Orta, <40% Zəif. Zəif bacarığa 3, Orta bacarığa 2 tapşırıq təyin olunur.',
    },
    servers: [
      { url: `http://localhost:${port}`, description: 'Lokal' },
      ...(process.env.PUBLIC_URL ? [{ url: process.env.PUBLIC_URL, description: 'Production' }] : []),
    ],
    tags: [
      { name: 'Auth', description: 'Qeydiyyat və giriş' },
      { name: 'Assessments', description: 'Test sualları və qiymətləndirmə' },
      { name: 'Progress', description: 'Tapşırıq planı və irəliləyiş' },
      { name: 'System', description: 'Server statusu' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Xəta mesajı' },
            errors: {
              type: 'object',
              additionalProperties: { type: 'string' },
              description: 'Yalnız validasiya xətalarında (400): sahə adı → xəta mesajı',
              example: { email: 'Düzgün email daxil edin' },
            },
          },
        },
        PublicUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Aysel' },
            email: { type: 'string', example: 'aysel@mail.com' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/PublicUser' },
          },
        },
        Question: {
          type: 'object',
          description: 'Düzgün cavab göndərilmir',
          properties: {
            id: { type: 'integer', example: 1 },
            direction: { type: 'string', example: 'frontend' },
            skill: { type: 'string', example: 'HTML' },
            question: { type: 'string', example: 'Hansı teq ən böyük başlıq üçündür?' },
            options: { type: 'array', items: { type: 'string' }, example: ['<h6>', '<h1>', '<head>', '<title>'] },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 4 },
            skill: { type: 'string', example: 'CSS' },
            title: { type: 'string', example: 'Flexbox Froggy oyununu bitir' },
            description: { type: 'string', example: 'Bütün 24 səviyyəni keç.' },
          },
        },
        SkillResult: {
          type: 'object',
          properties: {
            skill: { type: 'string', example: 'CSS' },
            correct: { type: 'integer', example: 2 },
            total: { type: 'integer', example: 3 },
            percentage: { type: 'integer', example: 67 },
            level: { type: 'string', enum: ['Güclü', 'Orta', 'Zəif'], example: 'Orta' },
          },
        },
        PlanItem: {
          type: 'object',
          properties: {
            skill: { type: 'string', example: 'CSS' },
            level: { type: 'string', enum: ['Orta', 'Zəif'], example: 'Orta' },
            tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
          },
        },
        Assessment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            direction: { type: 'string', example: 'frontend' },
            results: { type: 'array', items: { $ref: '#/components/schemas/SkillResult' } },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        UserTask: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1, description: 'user_tasks ID-si. Toggle-da bu istifadə olunur' },
            task_id: { type: 'integer', example: 4, description: 'tasks cədvəlindəki ID' },
            skill: { type: 'string', example: 'CSS' },
            title: { type: 'string', example: 'Flexbox Froggy oyununu bitir' },
            description: { type: 'string', example: 'Bütün 24 səviyyəni keç.' },
            status: { type: 'string', enum: ['pending', 'done'], example: 'pending' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Token yoxdur, etibarsızdır və ya vaxtı bitib',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        ValidationError: {
          description: 'Validasiya xətası',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NotFound: {
          description: 'Tapılmadı',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
  },
  // Annotasiyalar controller fayllarında və app.js-dədir
  // glob Windows-da "\" qəbul etmir, ona görə "/" -ə çeviririk
  apis: [path.join(__dirname, '../controllers/*.js'), path.join(__dirname, '../app.js')].map((p) =>
    p.replace(/\\/g, '/')
  ),
};

module.exports = swaggerJsdoc(options);
