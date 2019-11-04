// haircut/src/config.js

module.exports = {
  projectId: process.env.PROJECT_ID,
  port: process.env.PORT || 8080,
  isProd: process.env.NODE_ENV === 'production',
  linkedInKey: process.env.LINKEDIN_KEY,
  linkedInSecret: process.env.LINKEDIN_SECRET,
  linkedInCallbackURL: process.env.LINKEDIN_CALLBACK_URL,
  sessionSecret: process.env.SESSION_SECRET || 'disgusting foot secret',
};
