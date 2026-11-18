const db = require('../db');
const AppError = require('../utils/AppError');

/**
 * @openapi
 * /api/progress:
 *   get:
 *     tags: [Progress]
 *     summary: Ən son qiymətləndirmə və tapşırıqların vəziyyəti
 *     description: Test verilməyibsə `assessment` null, `tasks` boş massiv olur.
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: İrəliləyiş
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 assessment:
 *                   nullable: true
 *                   allOf:
 *                     - $ref: '#/components/schemas/Assessment'
 *                 tasks:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/UserTask' }
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total: { type: integer, example: 5 }
 *                     done: { type: integer, example: 1 }
 *                     pending: { type: integer, example: 4 }
 *                     percentage: { type: integer, example: 20 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
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

/**
 * @openapi
 * /api/progress/tasks/{taskId}/toggle:
 *   patch:
 *     tags: [Progress]
 *     summary: Tapşırığın statusunu dəyiş (pending ↔ done)
 *     description: "`taskId` = `GET /api/progress` cavabındakı `tasks[].id` (user_tasks ID-si), `task_id` deyil."
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Yeni status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 task:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     task_id: { type: integer, example: 4 }
 *                     status: { type: string, enum: [pending, done], example: done }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
async function toggleTask(req, res) {
  const taskId = Number(req.params.taskId);
  if (!Number.isInteger(taskId) || taskId <= 0) throw new AppError('Tapşırıq ID-si düzgün deyil', 400);

  const updated = await db.toggleTaskStatus(req.user.id, taskId);
  if (!updated) throw new AppError('Tapşırıq tapılmadı', 404);

  res.json({ success: true, task: updated });
}

module.exports = { getProgress, toggleTask };
