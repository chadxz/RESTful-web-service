var should = require("should")
  , assert = require("assert")
  , req = require("supertest");

var libdir = process.env.DIRTYBLOG_COV ? "../lib-cov/" : "../lib/";
var app = require (libdir + "app");

describe("the dirty blog", function () {

  describe("/", function () {

    it("should respond ok", function (done) {
      req(app)
      .get("/")
      .expect(200, done);
    });

  });

  describe("article routes", function () {

    var articleProvider = require(libdir + "articleprovider")
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

          articleProvider.findAll(function (err, articles) {
            var articlesJSON = JSON.stringify(articles, app.get("json replacer"), app.get("json spaces"));
            articlesJSON.should.equal(res.text);
            done();
          });
        });
      });

    });

    describe("/articles/:id", function() {

      it("should retrieve the specified article as JSON", function (done) {
        req(app)
        .get("/articles/" + testArticleId)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          should.not.exist(err);

          articleProvider.findById(testArticleId, function (err, article) {
            var articleJSON = JSON.stringify(article, app.get("json replacer"), app.get("json spaces"));
            articleJSON.should.equal(res.text);
            done();
          });
        });
      });

    });

  });
});