// TODO: Implement task search by title

function createTaskService(taskRepository) {
  function getAllTasks(filters) {
    return taskRepository.findAll(filters);
  }

  function getTaskById(id) {
    const task = taskRepository.findById(id);
    if (!task) {
      const error = new Error(`Task with id ${id} not found`);
      error.status = 404;
      throw error;
    }
    return task;
  }

  function createTask(taskData) {
    return taskRepository.create(taskData);
  }

  function updateTask(id, taskData) {
    const updated = taskRepository.update(id, taskData);
    if (!updated) {
      const error = new Error(`Task with id ${id} not found`);
      error.status = 404;
      throw error;
    }
    return updated;
  }

  function deleteTask(id) {
    const deleted = taskRepository.softDelete(id);
    if (!deleted) {
      const error = new Error(`Task with id ${id} not found`);
      error.status = 404;
      throw error;
    }
    return deleted;
  }

  function getTaskStats() {
    return taskRepository.getStats();
  }

  return { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getTaskStats };
}

module.exports = { createTaskService };
