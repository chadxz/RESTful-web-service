var express = require("express")
  , routes = require("../routes");

var app = module.exports = express();

// configure settings
app.set("port", 3000);

// configure middleware
app.use(express.bodyParser());
app.use(app.router);

// configure routes
app.get("/", routes.home.index);

app.get("/articles", routes.articles.findAll);
app.post("/articles", routes.articles.add);
app.options("/articles", routes.articles.options);
app.head("/articles", routes.articles.head);

app.get("/articles/:id", routes.articles.findById);