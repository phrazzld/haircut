// haircut/test/proctor.js
//
// Without requirements or design,
// programming is the art of adding bugs to an empty text file.

require('module-alias/register');
const expect = require('chai').expect;

const check = err => {
  if (err) {
    console.error(err);
    expect(err).to.be.null;
  }
};

const expectRedirect = (err, res, redirectLocation) => {
  check(err);
  expect(res.statusCode).to.equal(302);
  expect(res.text).to.equal(`Found. Redirecting to ${redirectLocation}`);
};

module.exports = {
  check,
  expectRedirect,
};
