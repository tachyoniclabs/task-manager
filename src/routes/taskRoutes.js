const express = require('express');

// TODO: Add input validation for task creation

function createTaskRoutes(taskService) {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    try {
      const { status, priority, page, limit } = req.query;
      const result = taskService.getAllTasks({
        status,
        priority,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/stats', (req, res, next) => {
    try {
      const stats = taskService.getTaskStats();
      res.json({ stats });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', (req, res, next) => {
    try {
      const task = taskService.getTaskById(parseInt(req.params.id, 10));
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', (req, res, next) => {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      const task = taskService.createTask(req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  router.put('/:id', (req, res, next) => {
    try {
      const task = taskService.updateTask(parseInt(req.params.id, 10), req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', (req, res, next) => {
    try {
      taskService.deleteTask(parseInt(req.params.id, 10));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = { createTaskRoutes };
