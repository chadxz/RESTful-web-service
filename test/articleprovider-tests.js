var should = require("should")
  , assert = require("assert")
  , _ = require("underscore");

describe("article provider", function () {

  var articleProvider = require("../lib/articleprovider");
  var testArticleId;

  beforeEach(function (done) {

    var testArticle = {
      title: "test article",
      body: "test body",
      author: "test@email.com"
    };

    articleProvider.clear(function (clearError) {
      articleProvider.save(testArticle, function (saveError, savedArticles) {
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

      articleProvider.save(someArticles, function (saveError, savedArticles) {
        articleProvider.findAll(function (findAllError, allArticles) {
          should.not.exist(findAllError);
          allArticles.length.should.equal(4);
          done();
        });
      });
    });

  });

  describe("#clear()", function () {

    it("should remove all articles from storage", function (done) {
      articleProvider.clear(function (clearError) {
        should.not.exist(clearError);

        articleProvider.findAll(function (findAllError, allArticles) {
          allArticles.length.should.equal(0);
          done();
        });
      });
    });

  });

  describe("#findById()", function () {

    it("should return an article when a valid id is supplied", function (done) {
      articleProvider.findById(testArticleId, function (findError, foundArticle) {
        should.not.exist(findError);
        foundArticle.id.should.equal(testArticleId);
        done();
      });
    });

    it("should return an article when a string numeric id is supplied", function (done) {
      articleProvider.findById(testArticleId.toString(), function (findError, foundArticle) {
        should.not.exist(findError);
        foundArticle.id.should.equal(testArticleId);
        done();
      });
    });

    it("should return an error when an invalid id is supplied", function (done) {
      articleProvider.findById(-1, function (findError, foundArticle) {
        should.exist(findError);
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

      articleProvider.save(anArticle, function (saveError, savedArticles) {
        should.not.exist(saveError);
        savedArticles[0].title.should.equal(articleTitle);
        savedArticles[0].should.haveOwnProperty("id");
        savedArticles[0].should.haveOwnProperty("createdAt");

        articleProvider.findAll(function (findAllError, allArticles) {
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

      articleProvider.save(anArticle, function (saveError, savedArticles) {
        should.not.exist(saveError);
        should.exist(savedArticles);

        articleProvider.findAll(function (findAllError, allArticles) {
          allArticles.length.should.equal(2);
          done();
        });
      });
    });

    it("should EDIT an article when article.id matches an article existing in storage", function (done) {

      articleProvider.findById(testArticleId, function (findError, foundArticle) {
        foundArticle.body = "edited body";

        articleProvider.save(foundArticle, function (saveError, savedArticles) {
          should.not.exist(saveError);
          savedArticles[0].body.should.equal(foundArticle.body);
          savedArticles[0].id.should.equal(foundArticle.id);
          savedArticles[0].should.haveOwnProperty("lastUpdatedAt");

          articleProvider.findAll(function (findAllError, allArticles) {
            allArticles.should.have.length(1);
            done();
          });
        });
      });
    });

  });

  describe("#remove()", function () {

    it("should delete an article when a valid article.id is specified", function (done) {
      articleProvider.remove(testArticleId, function (removeError) {
        should.not.exist(removeError);
        articleProvider.findAll(function (findAllError, allArticles) {
          allArticles.length.should.equal(0);
          done();
        });
      });
    });

    it("should return an error when an invalid article.id is specified", function (done) {
      articleProvider.remove(-1, function (removeError) {
        should.exist(removeError);
        articleProvider.findAll(function (findAllError, allArticles) {
          allArticles.length.should.equal(1);
          done();
        });
      });
    });

  });

  describe("#add()", function() {
    var articleTitle = "Yogi Bear's Picnic";

    var anArticle = {
      title: articleTitle,
      body: "The picnic was excellent",
      author: "yogi@bears.com"
    };

    it("should add an article when article.id is not specified", function (done) {
      articleProvider.add(anArticle, function (addError, savedArticle) {
        should.not.exist(addError);
        should.exist(savedArticle);
        savedArticle.should.haveOwnProperty("id");
        savedArticle.should.haveOwnProperty("createdAt");
        savedArticle.title.should.equal(articleTitle);

        articleProvider.findAll(function (findAllError, allArticles) {
          allArticles.length.should.equal(2);
          done();
        });
      });
    });

    it("should throw an error when article.id is specified", function (done) {
      var addArticle = _.extend({}, anArticle);
      addArticle.id = 37;
      articleProvider.add(addArticle, function (addError, savedArticle) {
        should.exist(addError);
        should.not.exist(savedArticle);
        done();
      });
    });

    it("should allow createdAt to be specified ahead of time", function (done) {
      anArticle.createdAt = new Date();
      articleProvider.add(anArticle, function (addError, savedArticle) {
        should.not.exist(addError);
        should.exist(savedArticle);
        savedArticle.createdAt.should.equal(anArticle.createdAt);
        done();
      });
    });
  });

});