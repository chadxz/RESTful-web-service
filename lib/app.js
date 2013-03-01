var express = require("express")
  , routes = require("../routes")
  , articles = require("../routes/articles");

var app = module.exports = express();

// configure settings
app.set("port", 3000);

// configure routes
app.get("/", routes.index);
app.get("/articles", articles.list);