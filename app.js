var express = require("express");
var app = module.exports = express();

// configure settings
app.set("port", 3000);

// configure routes
app.get("/", function(req, res) {
  res.send("ohayou gozaimasu");
});

// start server if running as an app
if (!module.parent) {
  app.listen(app.get("port"), function () {
	console.log("web server listening on port " + app.get("port"));
  });  
}