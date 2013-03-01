var articleProvider = require("../lib/articleprovider");
exports.list = function (req, res) {
  articleProvider.findAll(function (err, articles) {
    res.send(JSON.stringify(articles));
  });
};