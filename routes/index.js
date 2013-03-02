exports.index = function (req, res) {
  res.send("ohayou gozaimasu");
};

exports.articles = require("./articles");