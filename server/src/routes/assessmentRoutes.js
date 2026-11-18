const { Router } = require('express');
const { getQuestions, submitAssessment } = require('../controllers/assessmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware); // bütün route-lar qorunur

router.get('/questions/:direction', getQuestions);
router.post('/', submitAssessment);

module.exports = router;
