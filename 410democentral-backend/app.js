var express = require('express');
var db = require("./db.js");
var port = process.env.PORT || 3000;

var app = express();

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}));
});

app.get('/dir', function(req,res){
    db.getDir().then((res)=>{
        res.send(res);
    });
});

app.get('/sample', function(req,res){
    db.getCodeSample(req.params.sampId).then((res)=>{
        res.send(res);
    });
});

app.post('/sample', function(req,res){
    db.putCodeSample(req.params.category, req.body).then((res)=>{
        res.send(true);
    }).catch((err)=>{
        res.send(false);
    });
});

app.post('/category', function(req,res){
    db.createCategory(req.params.sampId, req.body).then((res)=>{
        res.send(true);
    }).catch((err)=>{
        res.send(false);
    });
});

app.listen(port, function () {
    console.log('Example app listening on port '+port);
});
