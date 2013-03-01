var should = require("should")
  , assert = require("assert")
  , req = require("supertest");

var libdir = process.env.DIRTYBLOG_COV ? "../lib-cov/" : "../lib/";
var app = require (libdir + "app");

describe("the dirty blog", function () {
  describe("/", function (done) {
    it("should respond ok", function (done) {
      req(app)
      .get("/")
      .expect(200, done);
    });
  });

  describe("/articles", function () {
    it("should respond ok", function (done) {
      req(app)
      .get("/articles")
      .expect(200, done);
    });

    it("should list all articles as JSON", function (done) {
      var articleProvider = require(libdir + "articleprovider");
      var sampleArticle = {
        title : "my title",
        body  : "my body",
        author: "test@email.com"
      };

      articleProvider.save(sampleArticle, function (saveError, articles) {
        req(app)
        .get("/articles")
        .expect(JSON.stringify(articles), function (error) {
          if (error) {
            return done(error);
          }

          articleProvider.clear(function (clearError) {
            done(clearError);
          });
        });
      });
    });
  });
});