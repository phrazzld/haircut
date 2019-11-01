// haircut/src/config.js

module.exports = {
  projectId: process.env.PROJECT_ID,
  port: process.env.PORT || 8080,
  isProd: process.env.NODE_ENV === 'production',
};
