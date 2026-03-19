const path = require('path');
const express = require('express');
const { createDatabase } = require('./db/database');
const { createTaskRepository } = require('./repositories/taskRepository');
const { createTaskService } = require('./services/taskService');
const { createTaskRoutes } = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/errorHandler');

function createApp(dbPath) {
  const app = express();
  const db = createDatabase(dbPath);

  const taskRepository = createTaskRepository(db);
  const taskService = createTaskService(taskRepository);
  const taskRoutes = createTaskRoutes(taskService);

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.json());
  app.use('/api/tasks', taskRoutes);
  app.use(errorHandler);

  app.locals.db = db;

  return app;
}

module.exports = { createApp };
