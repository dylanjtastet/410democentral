let MongoClient = require("mongodb");

let dbPromise = MongoClient.connect("mongodb://localhost:27017").then((client) => client.db("democentral"));

///////// Access promise objects (chain with dbPromise) /////////

/// Crap, change all of these to use async await ///
let codeSamplePromise = async(db, id) => db.collection("samples").findOne({_id: new MongoClient.ObjectId(id)});

let codeSampleInsertPromise = async(db, category, sample) => db.collection("samples").insertOne({...sample, category:category});

let createCategoryPromise = async(db, name, parent) => db.collection("categories").insertOne({_id:name, parent:parent});

let getAllCategoriesPromise = async(db) => db.collection("categories").find({}).toArray();

let getCategoriesByParentListPromise = async(db, parents) => db.collection("categories").find({parent:{$in: parents}}, {projection: {_id:1}}).toArray();
  
// Only return ids and categories of code samples to build directory
let getAllSamplesPromise = async(db) => db.collection("samples").find({}, {projection:{category:1, name:1, _id:1}}).toArray();

let recursiveDeleteListPromise = async(db,parents) => {
    let categories = await getCategoriesByParentListPromise(db, parents);
    let subList = [];
    if(categories.length > 0){
        subList = await recursiveDeleteListPromise(db, parents);
    }
    return parents.concat(subList);
}

let deleteCategoriesPromise = async(db, categories) => db.collection("categories").remove({_id: {$in: categories}});

let deleteSamplesByCategoriesPromise = async(db, categories) => db.collection("samples").remove({category: {$in: categories}});

let deleteSampleByIdPromise = async(db, id) => db.collection("samples").remove({_id: new MongoClient.ObjectId(id)}, promiseCallback(resolve, reject));

///// Clear collections promises /////
let clearCollectionPromise = async(db, collectionName) => db.collection(collectionName).remove({});


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
