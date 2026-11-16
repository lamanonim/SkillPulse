require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET .env faylında təyin edilməyib!');
  process.exit(1);
}

const app = express();

// ---------- CORS ----------
// CLIENT_URL vergüllə bir neçə ünvan ola bilər (localhost + Vercel)
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Postman/curl kimi origin-siz sorğulara icazə veririk
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(null, false);
    },
  })
);

app.use(express.json({ limit: '100kb' }));

// ---------- Route-lar ----------
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/progress', progressRoutes);

// ---------- Xətalar (həmişə ən sonda) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Test zamanı require edildikdə serveri avtomatik başlatmırıq
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SkillPulse API işləyir: http://localhost:${PORT}`);
  });
}

module.exports = app;
