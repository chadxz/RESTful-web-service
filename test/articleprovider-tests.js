var should = require("should")
  , assert = require("assert");

var libpath = process.env.DIRTYBLOG_COV ? "../lib-cov/" : "../lib/";

describe("article provider", function () {

  var articleProvider = require(libpath + "articleprovider");
  var testArticleId;

  beforeEach(function (done) {

    var testArticle = {
      title: "test article",
      body: "test body",
      author: "test@email.com"
    };

    articleProvider.clear(function (err) {
      articleProvider.save(testArticle, function (err, savedArticles) {
        testArticleId = savedArticles[0].id;
        done();
      });
    });
  });

  after(function (done) {
    articleProvider.clear(done);
  });

  describe("#findAll()", function () {

    it("should retrieve all articles from storage", function (done) {
      var someArticles = [
        {title: "t1", body: "b1", author: "me@here.com"},
        {title: "t2", body: "b2", author: "me@here.com"},
        {title: "t3", body: "b3", author: "me@here.com"}
      ];

      articleProvider.save(someArticles, function (err, savedArticles) {
        articleProvider.findAll(function (err, allArticles) {
          should.not.exist(err);
          allArticles.length.should.equal(4);
          done();
        });
      });
    });

  });

  describe("#clear()", function () {

    it("should remove all articles from storage", function (done) {
      articleProvider.clear(function (err) {
        should.not.exist(err);

        articleProvider.findAll(function (err, allArticles) {
          allArticles.length.should.equal(0);
          done();
        });
      });
    });

  });

  describe("#findById()", function () {

    it("should return an article when a valid id is supplied", function (done) {
      articleProvider.findById(testArticleId, function (err, foundArticle) {
        should.not.exist(err);
        foundArticle.id.should.equal(testArticleId);
        done();
      });
    });

    it("should return an article when a string numeric id is supplied", function (done) {
      articleProvider.findById(testArticleId.toString(), function (err, foundArticle) {
        should.not.exist(err);
        foundArticle.id.should.equal(testArticleId);
        done();
      });
    });

    it("should return an error when an invalid id is supplied", function (done) {
      articleProvider.findById(-1, function (err, foundArticle) {
        should.exist(err);
        should.not.exist(foundArticle);
        done();
      });
    });

  });

  describe("#save()", function () {

    it("should ADD an article when article.id not specified", function (done) {
      var articleTitle = "Yogi Bear's Picnic";

      var anArticle = {
        title: articleTitle,
        body: "The picnic was excellent",
        author: "yogi@bears.com"
      };

      articleProvider.save(anArticle, function (err, savedArticles) {
        should.not.exist(err);
        savedArticles[0].title.should.equal(articleTitle);
        savedArticles[0].should.haveOwnProperty("id");
        savedArticles[0].should.haveOwnProperty("createdAt");

        articleProvider.findAll(function (err, allArticles) {
          allArticles.length.should.equal(2);
          done();
        });
      });
    });

    it("should ADD an article when article.id does not match an article existing in storage", function (done) {
      var anArticle = {
        id: 35,
        title: "Specifics are grand",
        body: "i am specifying the id",
        author: "cptobvious@gmail.com"
      };

      articleProvider.save(anArticle, function (err, savedArticles) {
        should.not.exist(err);
        should.exist(savedArticles);

        articleProvider.findAll(function (err, allArticles) {
          allArticles.length.should.equal(2);
          done();
        });
      });
    });

    it("should EDIT an article when article.id matches an article existing in storage", function (done) {

      articleProvider.findById(testArticleId, function (err, foundArticle) {
        foundArticle.body = "edited body";

        articleProvider.save(foundArticle, function (err, savedArticles) {
          should.not.exist(err);
          savedArticles[0].body.should.equal(foundArticle.body);
          savedArticles[0].id.should.equal(foundArticle.id);
          savedArticles[0].should.haveOwnProperty("lastUpdatedAt");

          articleProvider.findAll(function (err, allArticles) {
            allArticles.should.have.length(1);
            done();
          });
        });
      });
    });

  });

  describe("#remove()", function () {

    it("should delete an article when a valid article.id is specified", function (done) {
      articleProvider.remove(testArticleId, function (err) {
        should.not.exist(err);
        articleProvider.findAll(function (err, allArticles) {
          allArticles.length.should.equal(0);
          done();
        });
      });
    });

    it("should return an error when an invalid article.id is specified", function (done) {
      articleProvider.remove(-1, function (err) {
        should.exist(err);
        articleProvider.findAll(function (err, allArticles) {
          allArticles.length.should.equal(1);
          done();
        });
      });
    });

  });

});