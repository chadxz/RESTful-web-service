var express = require("express")
  , routes = require("../routes");

var app = module.exports = express();

// configure settings
app.set("port", 3000);

// configure routes
app.get("/", routes.home.index);
app.get("/articles", routes.articles.findAll);
app.get("/articles/:id", routes.articles.findById);