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

module.exports = {
  check,
};
