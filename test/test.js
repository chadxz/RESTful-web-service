var should = require("should");
var assert = require("assert");

describe("the dirty blog", function () {

  describe("articles", function () {

    var articleProvider = require("../lib/articleprovider");
    var testArticleID;

    beforeEach(function (done) {

      var testArticle = {
        title: "test article",
        body: "test body",
        author: "test@email.com"
      };

      articleProvider.clear(function (err) {
        articleProvider.save(testArticle, function(err, savedArticle) {
          testArticleID = savedArticle.id;
          done();
        });
      });
    });

    it("should be able to be add an article", function (done) {

      var articleTitle = "Yogi Bear's Picnic";

      var anArticle = {
        title: articleTitle,
        body: "The picnic was excellent",
        author: "yogi@bears.com"
      };

      articleProvider.save(anArticle, function (err, savedArticle) {

        should.not.exist(err);
        savedArticle.title.should.equal(articleTitle);
        savedArticle.should.haveOwnProperty("id");
        savedArticle.should.haveOwnProperty("createdAt");
        done();
      });
    });

    it("should be able to be edit an article", function (done) {

      articleProvider.findByID(testArticleID, function (err, foundArticle) {

        should.not.exist(err);
        should.exist(foundArticle);
        foundArticle.body = "edited body";

        articleProvider.save(foundArticle, function (err, newSavedArticle) {

          should.not.exist(err);
          newSavedArticle.body.should.equal(foundArticle.body);
          newSavedArticle.id.should.equal(foundArticle.id);

          articleProvider.findAll(function (err, allArticles) {

            should.not.exist(err);
            allArticles.should.have.length(1);
            done();
          });
        });
      });
    });

    it("should be able to be delete an article");
  });
});