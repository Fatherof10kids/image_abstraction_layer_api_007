var express = require('express');
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var route = express.Router();

var key = process.env.GOOGLE_KEY; // this thing doesnt run local :( wasted 1 hour, i going to get node debug inspector tonight
var cx = '002242856440632671206:hcqpsa883so';

var url = process.env.MONGOLAB_URI||'mongodb://localhost:27017/Info';

var handleResponse = function(res,body){
  //url
  // snippet
  //thumbnail
  //context
  var bodyJSON = JSON.parse(body);
  var arrItemResponse=bodyJSON.items;
  var arrResponse = [];
arrItemResponse.forEach((value,index)=>{
    var url = value['link'];
    var snippet = value['snippet'];
    var thumbnail = value['image']['thumbnailLink'];
    var context = value['image']['contextLink'];
    arrResponse.push({
      'url' : url,
      'snippet' : snippet,
      'thumbnail': thumbnail,
      'context' : context
    });
  });
  res.end(JSON.stringify(arrResponse));
}


var getResult = function(search_text,offset,res){
  request('https://www.googleapis.com/customsearch/v1?key=' +key+ '&cx='+cx+'&searchType=image&fileType=jpg&imgSize=large&alt=json&q='+search_text+ '&start='+offset,
    (err,response,body)=>{
      if(!err && response.statusCode ==200)
      handleResponse(res,body);
    });
}

route.get('/api/imagesearch/:text',(req,res)=>{
  var offset = req.query.offset; // results pagination
  var search_text = req.params.text; // search what?

if(offset==undefined) getResult(search_text,1,res);
else if ( +offset <= 0 || ((+offset)>90)){
  res.json({ 'error' : 'There is only 100 results return, offset must be start from 1 to 90'});
}
else getResult(search_text,offset,res);

// ip address reogize user
var ip;
if(req.header('x-forwarded-for')){
      var arrIp=req.header('x-forwarded-for').split(',');
      ip = arrIp[0];
      console.log( req.header('x-forwarded-for').split(',')[0]);
    }
    else{
      ip =req.connection.remoteAddress;
    }

if(ip){
// mongodb store user data
MongoClient.connect(url,(err,db)=>{
var date = new Date();
  db.collection('users').insert({'ip':ip.toString(),'term':search_text,'when':date},(err,result)=>{
    if(err){
       console.log("can not insert doc");
       throw err;
     }
  });
  db.close();
});
}

});


route.get('/api/latest/imagesearch',(req,res)=>{
  var ip; // req.headers['x-fowarded-for'] or req.connection.remoteAddress
  if(req.header('x-forwarded-for')){
        var arrIp=req.header('x-forwarded-for').split(',');
        ip = arrIp[0];
        console.log( req.header('x-forwarded-for').split(',')[0]);
      }
      else{
        ip =req.connection.remoteAddress;
      }

  if(ip){
  MongoClient.connect(url,(err,db)=>{
ip=ip.toString();
    db.collection('users').find({'ip':ip}).limit(10).toArray((err,docs)=>{
      var resArr=[];
      docs.forEach((value,index)=>{
        var term = value.term;
        var when = value['when'];
        resArr.push({'term':term,'when':when});
      });
        res.json(resArr);
    });
    //close db
    db.close();
  });
}
  //res.send("lastest search words");
});

module.exports = route;
