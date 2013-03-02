var articleProvider = require("../lib/articleprovider");

exports.findAll = function (req, res) {
  articleProvider.findAll(function (err, articles) {
    res.send(articles);
  });
};

exports.findById = function (req, res) {
  var id = req.params.id;
  articleProvider.findById(id, function (err, article) {
    res.send(article);
  });
};