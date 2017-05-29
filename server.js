var express = require('express');
var router = require('./api_route');
var app = express();

var port = process.env.PORT || 5000;

app.set('port',port);


app.use('/',router);
app.use('/',express.static(__dirname +'/public'));

/*app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/index.html');
});*/

app.listen(port, console.log("Server is starting at port", app.get('port')));
