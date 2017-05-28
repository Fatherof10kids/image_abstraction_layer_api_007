var express = require('express');
var router = require('./api_route');
var app = express();

var port = process.env.PORT || 5000;

app.set('port',port);

app.use('/',router);

app.listen(port, console.log("Server is starting at port", app.get('port')));
