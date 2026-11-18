const { Router } = require('express');
const { getProgress, toggleTask } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', getProgress);
router.patch('/tasks/:taskId/toggle', toggleTask);

module.exports = router;
