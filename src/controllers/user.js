// haircut/src/controllers/user.js

const auth = require('@root/auth');

const getLogin = (req, res) => {
  console.log('GET /login');
  res.redirect('/auth/linkedin');
};

const getLogout = (req, res) => {
  console.log('GET /logout');
  req.logout();
  res.redirect('/');
};

const getAccount = (req, res) => {
  console.log('GET /account');
  res.render('account', {
    title: 'Account',
    name: req.user.givenName,
  });
};

const getLinkedInAuth = (req, res) => {
  console.log('GET /auth/linkedin');
};

module.exports = {
  getLogin,
  getLogout,
  getAccount,
  getLinkedInAuth,
};
