let MongoClient = require("mongodb");

let dbPromise = new Promise((resolve, reject) => {
    MongoClient.connect("mongodb://localhost:27017", function(err, conn){
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

let codeSampleInsertPromise = (db, category, sample) => new Promise((resolve, reject) => {
    db.collection("samples").insertOne({...sample, category:category}, (err, result) => {
        if(err){
            reject(err);
        }
        else{
            resolve(result._id);
        }
    });
});

let createCategoryPromise = (db, name, parent) => new Promise((resolve, reject) => {
    db.collection("categories").insertOne({_id:name, parent:parent}, (err, result) => {
        if(err){
            reject(err);
        }
        else{
            resolve();
        }
    });
});

let getAllCategoriesPromise = (db) => new Promise((resolve, reject) => {
    db.collection("categories").find({}).toArray((err, result) => {
        if(err){
            reject(err);
        }
        else{
            resolve(result);
        }
    });
});
  
// Only return ids and categories of code samples to build directory
let getAllSamplesPromise = (db) => new Promise((resolve, reject) => {
    db.collection("samples").find({}, {projection:{category:1, _id:1}}).toArray((err,result) => {
        if(err){
            reject(err);
        }
        else{
            resolve(result);
        }
    });
});

///// Clear collections promises /////
let clearCollectionPromise = (db, collectionName) => new Promise((resolve,reject) => {
    db.collection(collectionName).remove({}, (err, res) => {
        if(err){
            reject(err);
        }
        else{
            resolve(res);
        }
    });
});


//////// db api functions. Return promises that resolve with requested data /////////

module.exports.getCodeSample = function(id){
    return dbPromise.then(db => {
        return codeSamplePromise(db, id);
    });
};

module.exports.putCodeSample = function(category, sample){
    //Todo: check ref integrity of category
    return dbPromise.then(db => {
        return codeSampleInsertPromise(db, category, sample);
    });
};

module.exports.createCategory = function(name, parent){
    //Todo: check ref integrity of parent
    return dbPromise.then(db => {
        return createCategoryPromise(db, name, parent);
    });
};

module.exports.getAllCategories = function(){
    return dbPromise.then(db =>{
        return getAllCategoriesPromise(db);
    });
}

module.exports.getAllSampleStubs = function(){
    return dbPromise.then(db => {
        return getAllSamplesPromise(db);
    });
}

///// For testing. Clear the database. Expand when adding new collections
module.exports.clearDB = function(){
    return dbPromise.then(db => {
        return Promise.all([clearCollectionPromise(db, "samples"), clearCollectionPromise(db, "categories")]);
    });
}
