var express = require("express");
var app = module.exports = express();

// configure settings
app.set("port", 3000);

// configure routes
app.get("/", function(req, res) {
  res.send("ohayou gozaimasu");
});