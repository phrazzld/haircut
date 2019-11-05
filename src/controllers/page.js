// haircut/src/controllers/page.js

const auth = require('@root/auth');

const statusTitleFromCode = code => {
  const statusCode = parseInt(code);
  if (statusCode >= 400 && statusCode < 500) {
    return 'You Messed Up';
  }
  if (statusCode >= 500) {
    return 'We Messed Up';
  }
  return 'Redirect';
};

const getHome = (req, res) => {
  console.log('GET /home');
  res.render('home', {
    title: 'Haircut',
  });
};

const getError = (req, res) => {
  const statusCode = req.params.statusCode;
  console.log(`GET /error/${statusCode}`);
  const statusTitle = statusTitleFromCode(statusCode);
  res.render('error', {
    title: `${statusCode} ERROR`,
    statusCode: statusCode,
    statusTitle: statusTitle,
  });
};

module.exports = {
  getHome,
  getError,
};
