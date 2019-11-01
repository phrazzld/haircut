// haircut/test/routes.home.js
//
// Tests of requests to the root route, /

// Import required modules
const proctor = require('@test/proctor');
const request = require('supertest');
const app = require('@root/app');
const expect = require('chai').expect;

// Define tests
describe('GET requests to /', function() {
  it('should 200', function(done) {
    request(app)
      .get('/')
      .end(function(err, res) {
        proctor.check(err);
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});
