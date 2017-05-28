var express = require('express');
var request = require('request');

var route = express.Router();

var getResult = function(res){
  request('https://www.googleapis.com/customsearch/v1?key=AIzaSyAINaVfHf8QL29goUL-e4e2KljWEqObTUw&cx=002242856440632671206:q5c9fppdzly&q=flower&searchType=image&fileType=jpg&imgSize=small&alt=json',
    (err,response,body)=>{
      if(response.statusCode ==200)
      res.end(body);
    })
}

route.get('/api/imagesearch/:text',(req,res)=>{
  // req.query.offset  pagination

//cx 002242856440632671206:q5c9fppdzly
//key AIzaSyAINaVfHf8QL29goUL-e4e2KljWEqObTUw
// 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAINaVfHf8QL29goUL-e4e2KljWEqObTUw&cx=002242856440632671206:q5c9fppdzly&q=flower&searchType=image&fileType=jpg&imgSize=small&alt=json'
getResult(res);
});


route.get('/api/lastest/imagesearch',(req,res)=>{
  res.send("lastest search words");
});


module.exports = route;
