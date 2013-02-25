var ArticleProvider = (function () {

  var _ = require("underscore");
  var articleCache = [];
  var articleCounter = 1;

  var clearAllArticles = function (doneCallback) {
    articleCache = [];
    articleCounter = 1;
    doneCallback(null);
  };

  var getAllArticles = function (doneCallback) {
    doneCallback(null, articleCache);
  };

  var getArticleByID = function (id, doneCallback) {
    var result = null;
    var err = null;

    for (var i = 0, l = articleCache.length; i < l; i++) {
      if (articleCache[i].id === id) {
        result = _.extend({}, articleCache[i]);
        break;
      }
    }

    if (result === "undefined") {
      err = "the article could not be found";
    }

    doneCallback(err, result);
  };

  var saveExistingArticle = function (article, doneCallback) {
    var found = false;

    for (var i = 0, l = articleCache.length; i < l; i++) {
      if (articleCache[i].id === article.id) {
        article.lastUpdatedAt = new Date();
        articleCache[i] = article;
        found = true;
        break;
      }
    }

    doneCallback(found);
  };

  var saveNewArticle = function (article) {
    article.id = articleCounter++;
    article.createdAt = new Date();
    articleCache[articleCache.length] = article;
  };

  var saveArticle = function (article, doneCallback) {
    var foundArticle = false;
    var articleToSave = _.extend({}, article);

    if (articleToSave.id) {
      saveExistingArticle(articleToSave, function (found) {
        foundArticle = found;
      });
    }

    if (!foundArticle) {
      saveNewArticle(articleToSave);
    }

    var articleToReturn = _.extend({}, articleToSave);
    doneCallback(null, articleToReturn);
  };

  return {
    clear: clearAllArticles,
    findAll: getAllArticles,
    findByID: getArticleByID,
    save: saveArticle
  };
}());

module.exports = ArticleProvider;