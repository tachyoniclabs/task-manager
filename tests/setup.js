const { createApp } = require('../src/app');

function createTestApp() {
  return createApp(':memory:');
}

module.exports = { createTestApp };
