const db = require('../db');
const AppError = require('../utils/AppError');

// GET /api/progress
async function getProgress(req, res) {
  const { assessment, tasks } = await db.getUserProgress(req.user.id);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;

  res.json({
    success: true,
    assessment,
    tasks,
    summary: {
      total,
      done,
      pending: total - done,
      percentage: total === 0 ? 0 : Math.round((done / total) * 100),
    },
  });
}

// PATCH /api/progress/tasks/:taskId/toggle
async function toggleTask(req, res) {
  const taskId = Number(req.params.taskId);
  if (!Number.isInteger(taskId) || taskId <= 0) throw new AppError('Tapşırıq ID-si düzgün deyil', 400);

  const updated = await db.toggleTaskStatus(req.user.id, taskId);
  if (!updated) throw new AppError('Tapşırıq tapılmadı', 404);

  res.json({ success: true, task: updated });
}

module.exports = { getProgress, toggleTask };
