var express = require('express');
var db = require("./db.js");
var port = process.env.PORT || 3000;
var parser = require("body-parser");

var app = express();

app.use(parser.json());

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}));
});

app.get('/dir', async function(req,res, next){
    try{
        let [categories, samples] = await Promise.all([db.getAllCategories(), db.getAllSampleStubs()]);
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
    }
    catch(err){
        next(err);
    }
});

// Todo: All this. Note, use next() or throw() to return errors if the 
// error is in synchronous or asynchronous code respectively

app.get('/sample', async function(req,res,next){
    try{
        res.send(await db.getCodeSample(req.query.id));
    }
    catch(err){
        next(err);
    }
});

app.post('/sample', async function(req,res,next){
    try{
        res.send({newId: (await db.putCodeSample(req.query.category, req.body)).ops[0]._id});
    }
    catch(err){
        next(err);
    }
});


// body here should include parent if there is one
app.post('/category', async function(req,res,next){
    try{
        await db.createCategory(req.query.name, req.query.parent);
        res.send(true);
    }
    catch(err){
        next(err)
    }
});

app.delete('/category', async function(req,res,next){
    try{
        await db.deleteCategory(req.query.name);
        res.send(true);
    }
    catch(err){
        next(err);
    }
});

app.delete('/sample', async function(req, res, next){
    try{
        await db.deleteSample(req.query.id);
        res.send(true);
    }
    catch(err){
        next(err);
    }
});

app.listen(port, function () {
    console.log('Example app listening on port '+port);
});
