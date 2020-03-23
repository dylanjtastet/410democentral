let Mongo = require("mongodb");

let dbPromise = new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, conn){
        if(err){
            reject(err);
        }
        else{
            resolve(conn.db("democentral"));
        }
    });
});

///////// Access promise objects (chain with dbPromise) /////////
let codeSamplePromise = (db, id) => new Promise((resolve, reject) => {
    db.collection("samples").findOne({id:id}, (err, result) => {
        if(err){
            reject(err);
        }
        else{
            resolve(result);
        }
    });
});

let codeSampleInsertPromise = (db, sample) => new Promise((resolve, reject) => {
    db.collection("samples").insertOne(sample, (err, result) => {
        if(err){
            reject(err);
        }
        else{
            resolve(result._id);
        }
    });
});

//TODO: Check uniqueness first (might be a job for one layer up)
let createCategoryPromise = (db, name) => new Promise((resolve, reject) => {
    db.collection("categories").insertOne({_id:name, children:[]}, (err, result) => {
        if(err){
            reject(err);
        }
        else{
            resolve();
        }
    });
});



//////// db api functions. Return promises that resolve with requested data /////////

// This was going to be to get the entire category tree
// Might be a job for one layer up to assemble it
let getDir = function(){
};

let getCodeSample = function(id){
    return dbPromise.then(db => {
        return codeSamplePromise(db, id);
    });
};

let putCodeSample = function(sample){
    return dbPromise.then(db => {
        return codeSampleInsertPromise(db, sample);
    });
};

let createCategory = function(name){
    return dbPromise.then(db => {
        return createCategoryPromise(db, name);
    });
};

module.exports.getDir = getDir;
module.exports.getCodeSample = getCodeSample;
module.exports.putCodeSample = putCodeSample;
module.exports.createCategory = createCategory;