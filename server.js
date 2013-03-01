var app = require("./lib/app");

var port = app.get("port");
app.listen(port, function () {
  console.log("web server listening at http://localhost:" + port);
});