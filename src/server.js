require('dotenv').config();

const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || './data/tasks.db';

const app = createApp(DB_PATH);

app.listen(PORT, () => {
  console.log(`Task Manager API running on http://localhost:${PORT}`);
});
