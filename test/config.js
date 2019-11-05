// test/config.js

require('module-alias/register');
require('dotenv').config();
const proctor = require('@test/proctor');
const config = require('@root/config');
const expect = require('chai').expect;

describe('App config', function() {
  it('should have projectId as a string', function() {
    expect(config.projectId).to.be.a('string');
  });
  it('should have port as a number', function() {
    expect(parseInt(config.port)).to.be.a('number');
  });
  it('should have isProd as a boolean', function() {
    expect(config.isProd).to.be.a('boolean');
  });
  it('should have linkedInKey as a string', function() {
    expect(config.linkedInKey).to.be.a('string');
  });
  it('should have linkedInSecret as a string', function() {
    expect(config.linkedInSecret).to.be.a('string');
  });
  it('should have linkedInCallbackURL as a string', function() {
    expect(config.linkedInCallbackURL).to.be.a('string');
  });
  it('should have sessionSecret as a string', function() {
    expect(config.sessionSecret).to.be.a('string');
  });
});
