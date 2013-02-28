var should = require("should")
  , assert = require("assert")
  , req = require("supertest")
  , app = require("../");

describe("the dirty blog", function() {
  it("should respond to HTTP GET at / with HTTP response code 200", function (done) {
    req(app)
    .get("/")
    .expect(200, done);
  });
});