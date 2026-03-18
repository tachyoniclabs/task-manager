const request = require('supertest');
const { createTestApp } = require('./setup');

let app;

beforeEach(() => {
  app = createTestApp();
});

afterEach(() => {
  app.locals.db.close();
});

describe('POST /api/tasks', () => {
  it('creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Buy groceries', description: 'Milk, eggs, bread' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.status).toBe('pending');
    expect(res.body.priority).toBe('medium');
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });
});

describe('GET /api/tasks', () => {
  it('lists all tasks', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task 1' });
    await request(app).post('/api/tasks').send({ title: 'Task 2' });

    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns a single task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'My task' });

    const res = await request(app).get(`/api/tasks/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('My task');
  });

  it('returns 404 for missing task', async () => {
    const res = await request(app).get('/api/tasks/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });
});

describe('PUT /api/tasks/:id', () => {
  it('updates a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Original' });

    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ title: 'Updated', status: 'in_progress' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.status).toBe('in_progress');
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('soft deletes a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'To delete' });

    const deleteRes = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(getRes.status).toBe(404);
  });
});

describe('GET /api/tasks (pagination)', () => {
  it('returns correct results for page 1', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task 1' });
    await request(app).post('/api/tasks').send({ title: 'Task 2' });
    await request(app).post('/api/tasks').send({ title: 'Task 3' });

    const res = await request(app).get('/api/tasks?page=1&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(2);
    expect(res.body.total).toBe(3);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(2);
  });
});

describe('GET /api/tasks/stats', () => {
  it('returns task counts by status', async () => {
    await request(app).post('/api/tasks').send({ title: 'Pending 1' });
    await request(app).post('/api/tasks').send({ title: 'Pending 2' });
    await request(app)
      .post('/api/tasks')
      .send({ title: 'Done', status: 'completed' });

    const res = await request(app).get('/api/tasks/stats');

    expect(res.status).toBe(200);
    expect(res.body.stats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: 'pending', count: 2 }),
        expect.objectContaining({ status: 'completed', count: 1 }),
      ]),
    );
  });
});
