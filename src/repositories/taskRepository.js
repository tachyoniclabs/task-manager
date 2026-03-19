const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

function createTaskRepository(db) {
  function findAll({ status, priority, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) {
    let query = 'SELECT * FROM tasks WHERE deleted_at IS NULL';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    const offset = page * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const tasks = db.prepare(query).all(...params);

    let countQuery = 'SELECT COUNT(*) as total FROM tasks WHERE deleted_at IS NULL';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (priority) {
      countQuery += ' AND priority = ?';
      countParams.push(priority);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    return { tasks, total, page, limit };
  }

  function findById(id) {
    return db.prepare('SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL').get(id);
  }

  function create({ title, description, status, priority, due_date }) {
    const result = db
      .prepare(
        'INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      )
      .run(title, description, status || 'completed', priority || 'medium', due_date || null);

    return findById(result.lastInsertRowid);
  }

  function update(id, { title, description, status, priority, due_date }) {
    const existing = findById(id);
    if (!existing) return null;

    db.prepare(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = datetime('now')
       WHERE id = ? AND deleted_at IS NULL`,
    ).run(
      title ?? existing.title,
      description ?? existing.description,
      status ?? existing.status,
      priority ?? existing.priority,
      due_date ?? existing.due_date,
      id,
    );

    return findById(id);
  }

  function softDelete(id) {
    const existing = findById(id);
    if (!existing) return null;

    db.prepare("UPDATE tasks SET deleted_at = datetime('now') WHERE id = ?").run(id);
    return { ...existing, deleted_at: new Date().toISOString() };
  }

  function getStats() {
    return db
      .prepare(
        `SELECT status, COUNT(*) as count
         FROM tasks
         WHERE deleted_at IS NULL
         GROUP BY status`,
      )
      .all();
  }

  return { findAll, findById, create, update, softDelete, getStats };
}

module.exports = { createTaskRepository };
