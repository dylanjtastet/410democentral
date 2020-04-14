var express = require('express');
var db = require("./db.js");
var auth = require("./auth.js");
var port = process.env.PORT || 3009;
var parser = require("body-parser");

var app = express();

app.use(parser.json({strict:false}));

app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next();
});

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
        res.send({newId: await db.putCodeSample(req.query.category, req.body)});
    }
    catch(err){
        next(err);
    }
});


// body here should include parent if there is one
app.get('/category', async function(req,res,next) {
    try {
        let categories = await db.getAllCategories();
        res.send(categories);
    } catch(err) {
        next(err);
    }
})

app.post('/category', async function(req,res,next){
    try{
        res.send({newId: await db.createCategory(req.query.name, req.query.parent, req.query.group)});
    }
    catch(err){
        next(err);
    }
});

app.delete('/category', async function(req,res,next){
    try{
        await db.deleteCategory(req.body.name);
        res.send(true);
    }
    catch(err){
        next(err);
    }
});

app.delete('/sample', async function(req, res, next){
    try{
        await db.deleteSample(req.body.id);
        res.send(true);
    }
    catch(err){
        next(err);
    }
});

// User stuff

app.get("/user/:username", async function(req, res, next){
    try{
        res.send({taken: (await db.checkUserExists(req.params.username))});
    }
    catch(err){
        next(err);
    }
});

app.post('/register', async function(req, res, next){
    try{
        if(!(await db.checkUserExists(req.body.username))){
            await auth.registerUser(req.body.username, req.body.password, req.body.email);
            res.send(true);
        }
        else{
            res.send(false);
        }
    }
    catch(err){
        next(err);
    }
});

app.get('/addInstructor', async function(req, res, next){
    try{
        let user = await db.getUserForSession()
    }
    catch(err){
        next(err);
    }
});

app.post('/login', async function(req, res, next){
    try{
        let ret = await auth.loginUser(req.body.username, req.body.password);
        res.send(ret);
    }
    catch(err){
        next(err);
    }
});

app.get('/logout', async function(req, res, next){
    try{
        await auth.logoutUser(req.cookies.sessid);
        return true;
    }
    catch(err){
        next(err);
    }
});

app.listen(port, function () {
    console.log('Example app listening on port '+port);
});
