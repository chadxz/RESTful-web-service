var should = require("should")
  , assert = require("assert")
  , req = require("supertest");

var app = require ("../lib/app");

describe("routes", function () {

  describe("home routes", function () {

    describe("/", function () {
      describe("GET", function () {

        it("should respond ok", function (done) {
          req(app)
          .get("/")
          .expect("Content-Type", "text/plain")
          .expect(200, done);
        });

      });
    });
  });

  describe("article routes", function () {

    var articleProvider = require("../lib/articleprovider")
      , testArticleId = "";

    beforeEach(function (done) {

      var sampleArticle = {
        title : "my title",
        body  : "my body",
        author: "test@email.com"
      };

      articleProvider.clear(function (clearError) {
        articleProvider.save(sampleArticle, function (saveError, savedArticles) {
          testArticleId = savedArticles[0].id;
          done(saveError);
        });
      });

    });

    after(function (done) {
      articleProvider.clear(done);
    });

    describe("/articles", function() {
      describe("GET", function () {

        it("should respond ok", function (done) {
          req(app)
          .get("/articles")
          .expect(200, done);
        });

        it("should list all articles as JSON", function (done) {
          req(app)
          .get("/articles")
          .expect("Content-Type", /json/)
          .end(function (err, res) {
            should.not.exist(err);
            articleProvider.findAll(function (findError, allArticles) {
              var articlesJSON = JSON.stringify(allArticles, app.get("json replacer"), app.get("json spaces"));
              articlesJSON.should.equal(res.text);
              done();
            });
          });
        });

      });

    });

    describe("/articles/:id", function() {
      describe("GET", function () {
        it("should retrieve the specified article as JSON", function (done) {
          req(app)
          .get("/articles/" + testArticleId)
          .expect("Content-Type", /json/)
          .end(function (err, res) {
            should.not.exist(err);

            articleProvider.findById(testArticleId, function (findError, article) {
              var articleJSON = JSON.stringify(article, app.get("json replacer"), app.get("json spaces"));
              articleJSON.should.equal(res.text);
              done();
            });
          });
        });

        it("should return 404 when an invalid article id is specified", function (done) {
          req(app)
          .get("/articles/foo")
          .expect(404)
          .end(function (err, resp) {
            req(app)
            .get("/articles/foo/bar")
            .expect(404)
            .end(function (err2, resp2) {
              req(app)
              .get("/articles/" + testArticleId + "/foo")
              .expect(404, done);
            });
          });
        });
      });
    });

  });
});