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

    if (result === null) {
      err = "the specified article could not be found";
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

  var saveArticles = function (articles, doneCallback) {
    var foundArticle;
    var resultArticles = [];

    var saveCallback = function (found) {
      foundArticle = found;
    };

    if (!Array.isArray(articles)) {
      articles = [articles];
    }

    for (var i = 0, l = articles.length; i < l; i++) {
      foundArticle = false;
      var articleToSave = _.extend({}, articles[i]);

      if (articleToSave.id) {
        saveExistingArticle(articleToSave, saveCallback);
      }

      if (!foundArticle) {
        saveNewArticle(articleToSave);
      }

      resultArticles[resultArticles.length] = _.extend({}, articleToSave);
    }

    doneCallback(null, resultArticles);
  };

  var removeArticleByID = function (id, doneCallback) {
    var foundArticle = false;
    var err = null;

    for (var i = 0, l = articleCache.length; i < l; i++) {
      if (articleCache[i].id === id) {
        articleCache.splice(i, 1);
        foundArticle = true;
        break;
      }
    }

    if (!foundArticle) {
      err = "the specified article could not be found";
    }

    doneCallback(err);
  };

  return {
    clear: clearAllArticles,
    findAll: getAllArticles,
    findByID: getArticleByID,
    remove: removeArticleByID,
    save: saveArticles
  };
}());

module.exports = ArticleProvider;