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

let promiseCallback = function(resolve, reject){
    return (err, result) => {
        if(err){
            reject(err);
        }
        else{
            resolve(result);
        }
    }
}

///////// Access promise objects (chain with dbPromise) /////////

/// Crap, change all of these to use async await ///
let codeSamplePromise = (db, id) => new Promise((resolve, reject) => {
    db.collection("samples").findOne({_id: new MongoClient.ObjectId(id)}, promiseCallback(resolve, reject));
});

let codeSampleInsertPromise = (db, category, sample) => new Promise((resolve, reject) => {
    db.collection("samples").insertOne({...sample, category:category}, promiseCallback(resolve, reject));
});

let createCategoryPromise = (db, name, parent) => new Promise((resolve, reject) => {
    db.collection("categories").insertOne({_id:name, parent:parent}, promiseCallback(resolve, reject));
});

let getAllCategoriesPromise = (db) => new Promise((resolve, reject) => {
    db.collection("categories").find({}).toArray(promiseCallback(resolve, reject));
});

let getCategoriesByParentListPromise = (db, parents) => new Promise((resolve, reject) => {
    db.collection("categories").find({parent:{$in: parents}}, {projection: {_id:1}}).toArray(promiseCallback(resolve, reject));
});
  
// Only return ids and categories of code samples to build directory
let getAllSamplesPromise = (db) => new Promise((resolve, reject) => {
    db.collection("samples").find({}, {projection:{category:1, name:1, _id:1}}).toArray(promiseCallback(resolve, reject));
});

let recursiveDeleteListPromise = async(db,parents) => {
    let categories = await getCategoriesByParentListPromise(db, parents);
    let subList = [];
    if(categories.length > 0){
        subList = await recursiveDeleteListPromise(db, parents);
    }
    return parents.concat(subList);
}

// let recursiveDeleteListPromise = (db, parents) => {
//     return getCategoriesByParentListPromise(db, parents).then((categories) => {
//         if(categories.length > 0){
//             return recursiveDeleteListPromise(db, categories.map(cat => cat._id));
//         }
//         return [];
//     }).then((subList) =>{
//         return parents.concat(subList);
//     });
// }

let deleteCategoriesPromise = (db, categories) => new Promise((resolve, reject) => {
    db.collection("categories").remove({_id: {$in: categories}}, promiseCallback(resolve, reject));
});

let deleteSamplesByCategoriesPromise = (db, categories) => new Promise((resolve, reject) => {
    db.collection("samples").remove({category: {$in: categories}}, promiseCallback(resolve, reject));
});

let deleteSampleByIdPromise = (db, id) => new Promise((resolve, reject) => {
    db.collection("samples").remove({_id: new MongoClient.ObjectId(id)}, promiseCallback(resolve, reject));
});

///// Clear collections promises /////
let clearCollectionPromise = (db, collectionName) => new Promise((resolve,reject) => {
    db.collection(collectionName).remove({}, promiseCallback(resolve, reject));
});


//////// db api functions. Return promises that resolve with requested data /////////

module.exports.getCodeSample = async function(id){
    let db = await dbPromise;
    return codeSamplePromise(db, id);
}

module.exports.putCodeSample = async function(category, sample){
    //Todo: check ref integrity of category
    let db = await dbPromise;
    return codeSampleInsertPromise(db, category, sample);
};

module.exports.createCategory = async function(name, parent){
    //Todo: check ref integrity of parent
    let db = await dbPromise;
    return createCategoryPromise(db, name, parent)
};

module.exports.getAllCategories = async function(){
    let db = await dbPromise;
    return getAllCategoriesPromise(db);
}

module.exports.getAllSampleStubs = async function(){
    let db = await dbPromise;
    return getAllSamplesPromise(db);
}

module.exports.deleteCategory = async function(category){
    let db = await dbPromise;
    let categories = await recursiveDeleteListPromise(db, [category]);
    return Promise.all([deleteSamplesByCategoriesPromise(db, categories), deleteCategoriesPromise(db, categories)]);
}

module.exports.deleteSample = async function(id){
    let db = await dbPromise;
    return deleteSampleByIdPromise(db, id);
}

module.exports.test_getCatsInSubtree = async function(category){
    let db = await dbPromise;
    return recursiveDeleteListPromise(db, [category]);
}


///// For testing. Clear the database. Expand when adding new collections
module.exports.clearDB = async function(){
    let db = await dbPromise;
    return Promise.all([clearCollectionPromise(db, "samples"), clearCollectionPromise(db, "categories")]);
}
