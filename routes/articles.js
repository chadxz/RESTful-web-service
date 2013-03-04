var articleProvider = require("../lib/articleprovider");

exports.findAll = function (req, res) {
  articleProvider.findAll(function (err, articles) {
    res.send(articles);
  });
};

exports.findById = function (req, res) {
  var id = req.params.id;
  articleProvider.findById(id, function (err, article) {
    if (err) {
      res.send(404);
      return;
    }
    res.send(article);
  });
};