"use strict";
var MyApp = require('./app');
var app = new MyApp();
app.server.listen(app.PORT, function () {
    console.log("Server listening at " + app.PORT);
});
