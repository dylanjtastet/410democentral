var express = require('express');
var db = require("./db.js");
var port = process.env.PORT || 3000;
var parser = require("body-parser");

var app = express();

app.use(parser.json());

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}));
});

app.get('/dir', function(req,res, next){
    Promise.all([db.getAllCategories(), db.getAllSampleStubs()]).then((data) => {
        let [categories, samples] = data;
        let catMap = {};
        let roots = [];
        for(i=0; i < categories.length; i++){
            catMap[categories[i]._id] = categories[i];
            categories[i].type = "category";
            categories[i].children = [];
        }
        for(i=0; i < categories.length; i++){
            if(parent = categories[i].parent){
                catMap[parent].children.push(categories[i]);
            }
            else{
                roots.push(categories[i]);
            }
        }
        for(i=0; i < samples.length; i++){
            samples[i].type = "sample";
            if(category = samples[i].category){
                catMap[category].children.push(samples[i])
            }
            else{
                roots.push(samples[i]);
            }
        }
        res.send(roots);
    }).catch((err) =>{
        next(err);
    });
});

// Todo: All this. Note, use next() or throw() to return errors if the 
// error is in synchronous or asynchronous code respectively

app.get('/sample', function(req,res,next){
    db.getCodeSample(req.query.id).then((data)=>{
        res.send(data);
    }).catch((err) => {
        next(err);
    });
});

app.post('/sample', function(req,res,next){
    db.putCodeSample(req.query.category, req.body).then((id)=>{
        res.send({newId:id});
    }).catch((err)=>{
        next(err);
    });
});


// body here should include parent if there is one
app.post('/category', function(req,res){
    db.createCategory(req.query.name, req.query.parent).then((data)=>{
        res.send(true);
    }).catch((err)=>{
        next(err);
    });
});

app.listen(port, function () {
    console.log('Example app listening on port '+port);
});
