var express = require('express');
var db = require("./db.js");
var auth = require("./auth.js");
var port = process.env.PORT || 3009;
var parser = require("body-parser");
var cookieParser = require("cookie-parser");

var app = express();

app.use(parser.json({limit: '1mb', strict:false}));

app.use(cookieParser());

app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}));
});

app.get('/dir', async function(req,res, next){
    try{
        if(!req.cookies.sessid){
            res.sendStatus(401);
            return;
        }
        let user = await db.getUserForSession(req.cookies.sessid);
        let categories, samples, groups;
        let catMap = {};
        let groupMap = {};
        let userRoot = {
            type: "usercode",
            children: []
        }
        let roots = [userRoot];

        if(user.isroot){
            [categories, samples, groups] = await Promise.all([db.getAllCategories(), 
                db.getAllNonUserSamples(), db.getAllGroups()]);
        }
        else{
            [categories, samples] = await Promise.all([db.getCategoriesForUser(user), 
                db.getUserSampleStubs(user)]);
            groups = user.groups;
            groups = groups.map((name) => {
                return {_id: name}
            });
        }
        console.log(samples);
        // console.log(categories);
        // console.log(samples);

        for(i=0; i < groups.length; i++){
            groupMap[groups[i]._id] = groups[i];
            groups[i].type = "group";
            groups[i].children = [];
            roots.push(groups[i]);
        }
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
                groupMap[categories[i].group].children.push(categories[i]);
            }
        }
        for(i=0; i < samples.length; i++){
            samples[i].type = "sample";
            //Gotta do this because of js equality quirks
            if(samples[i].user !== false){
                userRoot.children.push(samples[i]);
            }
            else{
                if(category = samples[i].category){
                    catMap[category].children.push(samples[i]);
                }
                else{
                    groupMap[samples[i].group].children.push(samples[i]);
                }
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
        if(req.cookies.sessid){
            if(auth.canViewSample(req.cookies.sessid, req.query.id)){
                let sample = await db.getCodeSample(req.query.id);
                res.send({
                    ...sample,
                    isEditable: await auth.hasSampleEditPermission(req.cookies.sessid, req.query.id)
                });
            }
            else{
                res.sendStatus(403);
            }
        }
        else{
            res.sendStatus(401);
        }
    }
    catch(err){
        console.log(err)
        next(err);
    }
});

app.post('/sample', async function(req,res,next){
    try{
        if(req.body && (req.body.group || req.body.user)){
            res.sendStatus(400);
        }
        if(req.cookies.sessid){
            let sessid = req.cookies.sessid;
            // required params
            let group = req.query.group;
            if(!group){
                res.sendStatus(400);
                return;
            }
            if(req.query.sample){
                if(auth.hasSampleEditPermission(sessid, req.query.sample)){
                    let newFields = req.body;
                    if(req.query.category){
                        let category = await db.getCategory(req.query.category);
                        if(!category || category.group == group){
                            newFields["category"] = req.query.category;
                        }
                    }
                    await db.updateCodeSample(newFields);
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(403);
                }
            }
            else if(auth.checkGroupPermissionsForSession(sessid, group) || req.query.user){
                let category = await db.getCategory(req.query.category);
                if(!category || category.group === group){
                    if(req.query.user){
                        let user = await db.getUserForSession(sessid);
                        if(user){
                            res.send({newId: await db.putCodeSample(req.query.category, group, req.body, user._id)});
                        }
                        else{
                            res.send(404);
                        }
                    }
                    else{
                        // default for user param is 'false' to ensure it is public, just omit it here
                        res.send({newId: await db.putCodeSample(req.query.category, group, req.body)});
                    }
                }
                else{
                    res.sendStatus(400);
                }
            }
            else{
                res.sendStatus(403);
            }
        }
        else{
            res.sendStatus(401);
        }
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
        if(req.cookies.sessid){
            if(auth.checkGroupPermissionsForSession(req.query.group)){
                res.send({newId: await db.createCategory(req.query.name, req.query.parent, req.query.group)});
            }
            else{
                res.sendStatus(403);
            }
        }
        else{
            res.sendStatus(401);
        }
    }
    catch(err){
        next(err);
    }
});

app.delete('/category', async function(req,res,next){
    try{
        if(req.cookies.sessid){
            if(auth.checkGroupPermissionsForSession(req.cookies.sessid)){
                await db.deleteCategory(req.body.name);
                res.sendStatus(200);
            }
            else{
                res.sendStatus(403);
            }
        }
        else{
            res.sendStatus(401);
        }
    }
    catch(err){
        next(err);
    }
});

app.delete('/sample', async function(req, res, next){
    try{
        if(req.cookies.sessid){
            if(user){
                await db.deleteSample(req.body.id);
                res.sendStatus(200);
            }
            else{
                res.sendStatus(403);
            }
        }
        else{
            res.sendStatus(401)
        }
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
        if(req.cookies.sessid){
            if(isRootSession(req.cookies.sessid)){
                await db.makeUserInstructorFor(req.query.username, req.query.groupid);
                res.sendStatus(200);
            }
            else{
                res.sendStatus(403);
            }
        }
        else{
            res.sendStatus(401);
        }
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
        res.send(true);
    }
    catch(err){
        next(err);
    }
});

app.post("/group", async function(req, res, next){
    try{
        if(req.cookies.sessid){
            //Only root accts can create new groups
            if(auth.isRootSession(sessid)){
                await db.createGroup(req.query.name);
                res.sendStatus(200);
            }
            else{
                res.sendStatus(403);
            }
        }
        else{
            res.sendStatus(401);
        }
    }
    catch(err){
        next(err);
    }
});

app.listen(port, function () {
    console.log('Example app listening on port '+port);
});
