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

exports.options = function(req, res) {
  res.set("Allow", "GET,POST,OPTIONS,HEAD");
  res.send(200);
};

exports.head = function(req, res) {
  articleProvider.findAll(function (err, articles) {
    var content = JSON.stringify(articles, req.app.get("json replacer"), req.app.get("json spaces"));
    res.set("Content-Length", content.length);
    res.send(200);
  });
};

exports.add = function(req, res) {
  if(!req.is("json")) {
    res.status(400);
    res.json({"message": "Content-Type must be application/json: [" + req.get("Content-Type") + "]"});
    return;
  }

  var articleToSave = req.body;
  articleProvider.add(articleToSave, function (err, savedArticle) {
    var articleLocation = req.protocol + "://" + req.get("host") + req.route.path + "/" + savedArticle.id;
    res.location(articleLocation);
    res.send(201);
  });
};