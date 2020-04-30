let MongoClient = require("mongodb");

let dbPromise = MongoClient.connect("mongodb://localhost:27017").then((client) => client.db("democentral"));

///////// Access promise objects (chain with dbPromise) /////////

/// Crap, change all of these to use async await ///
let codeSamplePromise = async(db, id) =>  db.collection("samples").findOne({_id: new MongoClient.ObjectId(id)});

let codeSampleInsertPromise = async(db, category, group, sample, user) => db.collection("samples").insertOne({...sample, group:group, category:category, user:user});

let createCategoryPromise = async(db, name, parent, group) => db.collection("categories").insertOne({name:name, parent:parent, group:group});

let getAllCategoriesPromise = async(db) => db.collection("categories").find({}).toArray();

let getCategoriesByParentListPromise = async(db, parents) => db.collection("categories").find({parent:{$in: parents}}, {projection: {_id:1}}).toArray();
  
// Only return ids and categories of code samples to build directory
let getAllSamplesPromise = async(db) => db.collection("samples").find({},{projection:{category:1, name:1, user:1, _id:1}}).toArray();

let recursiveDeleteListPromise = async(db,parents) => {
    let categories = await getCategoriesByParentListPromise(db, parents);
    let subList = [];
    if(categories.length > 0){
        subList = await recursiveDeleteListPromise(db, parents);
    }
    return parents.concat(subList);
}

let deleteCategoriesPromise = async(db, categories) => db.collection("categories").deleteMany({_id: {$in: categories}});

let deleteSamplesByCategoriesPromise = async(db, categories) => db.collection("samples").deleteMany({category: {$in: categories}});

let deleteSampleByIdPromise = async(db, id) => db.collection("samples").deleteOne({_id: new MongoClient.ObjectId(id)});

///// Clear collections promises /////
let clearCollectionPromise = async(db, collectionName) => db.collection(collectionName).deleteMany({});


//////// db api functions. Return promises that resolve with requested data /////////

module.exports.getCodeSample = async function(id){
    let db = await dbPromise;
    // console.log(id);
    return codeSamplePromise(db, id);
}

module.exports.putCodeSample = async function(category, group, sample, user=false){
    //Todo: check ref integrity of category
    let db = await dbPromise;
    return (await codeSampleInsertPromise(db, category, group, sample, user)).ops[0]._id;
};

module.exports.updateCodeSample = async function(id, newFields){
    let db = await dbPromise;
    return db.collection("samples").update({_id: new MongoClient.ObjectId(id)}, {$set: newFields});
}

module.exports.createCategory = async function(name, parent, group){
    //Todo: check ref integrity of parent
    let db = await dbPromise;
    return (await createCategoryPromise(db, name, parent, group)).ops[0]._id;
};

module.exports.getAllCategories = async function(){
    let db = await dbPromise;
    return getAllCategoriesPromise(db);
}

module.exports.getAllSampleStubs = async function(){
    let db = await dbPromise;
    return getAllSamplesPromise(db);
}

module.exports.getUserSampleStubs = async function(user){
    let db = await dbPromise;
    let publicSamples = await db.collection("samples").find({user: false, group: {$in: user.groups}}, {projection:{category:1, user:1, name:1, _id:1}}).toArray();
    let privateSamples = await db.collection("samples").find({user: user._id}).toArray();
    return publicSamples.concat(privateSamples);
}

module.exports.deleteCategory = async function(id){
    let db = await dbPromise;
    let categories = await recursiveDeleteListPromise(db, [new MongoClient.ObjectId(id)]);
    return Promise.all([deleteSamplesByCategoriesPromise(db, categories), deleteCategoriesPromise(db, categories)]);
}

module.exports.deleteSample = async function(id){
    let db = await dbPromise;
    return deleteSampleByIdPromise(db, id);
}

module.exports.insertUser = async function(username, creds, email){
    let db = await dbPromise;
    return db.collection("users").insertOne({
        _id: username,
        creds: creds,
        email: email,
        groups: [],
        isroot: false
    });
}

module.exports.makeUserInstructorFor = async function(username, group){
    let db = await dbPromise;
    return db.collection("groups").update(
        {_id: group},
        {
            $push: {instructors: username}
        }
    );
}

module.exports.getUserCreds = async function(username){
    let db = await dbPromise;
    return db.collection("users").findOne({_id: username}, {projection: {creds:1}});
}

module.exports.checkUserExists = async function(username){
    let db = await dbPromise;
    let user = await db.collection("users").findOne({_id: username}, {projection: {_id:1}});
    if(user){
        return true;
    }
    return false;
}
module.exports.insertUserSession = async function(sessid, username, exp){
    let db = await dbPromise;
    return db.collection("sessions").insertOne({
        _id: sessid,
        user: username,
        exp: exp
    });
}

module.exports.deleteUserSession = async function(sessid){
    let db = await dbPromise;
    return db.collection("sessions").deleteOne({
        _id: sessid
    });
}

module.exports.deleteSessionByUser = async function(username){
    let db = await dbPromise;
    return db.collection("sessions").deleteOne({
        user:username
    });
}

module.exports.test_getCatsInSubtree = async function(category){
    let db = await dbPromise;
    return recursiveDeleteListPromise(db, [category]);
}

module.exports.getUserForSession = async function(sessid){
    let db = await dbPromise;
    // let id = MongoClient.ObjectId(sessid);
    let session = await db.collection("sessions").findOne({
        _id: sessid
    });
    if(new Date(session.exp) < new Date(Date.now())){
        await db.collection("sessions").deleteOne({
            _id: sessid
        });
        return false;
    }
    return db.collection("users").findOne({
        _id:session.user
    });
}

module.exports.createGroup = async function(name){
    let db = await dbPromise;
    return db.collection("groups").insertOne({
        _id: name,
        instructors: []
    });
}

module.exports.getGroup = async function(name){
    let db = await dbPromise;
    return db.collection("groups").findOne({
        _id: name
    });
}

module.exports.deleteGroup = async function(name){
    let db = await dbPromise;

    await db.collection("samples").deleteMany({group: name});
    await db.collection("categories").deleteMany({group: name});

    let members = await this.getUsersInGroup(name);

    for (i = 0; i < members.length; i++) {
        await this.removeUserFromGroup(members[i]._id, name);
    }

    return db.collection("groups").deleteOne({
        _id: name
    });
}

module.exports.getAllGroups = async function(){
    let db = await dbPromise;
    return db.collection("groups").find({}).toArray();
}

module.exports.getCategory = async function(id){
    let db = await dbPromise;
    return db.collection("categories").findOne({
        _id: new MongoClient.ObjectId(id)
    });
}

module.exports.getCategoriesForUser = async function(user){
    let db = await dbPromise;
    return db.collection("categories").find({
        group: {$in: user.groups}
    }).toArray();
}

module.exports.getAllNonUserSamples = async function(){
    let db = await dbPromise;
    return db.collection("samples").find({
        user: false
    },{
        projection: {
            user:1,
            _id:1,
            category:1,
            name: 1
        }
    }).toArray();
}

module.exports.checkGroupExists = async function(name){
    let db = await dbPromise;
    let group = await db.collection("groups").findOne({_id: name});
    return !!group;
}

module.exports.getUsersInGroup = async function(group){
    let db = await dbPromise;
    return db.collection("users").find({
        groups: group
    }).toArray();
}

module.exports.removeUserAsInstructor = async function(group, username){
    let db = await dbPromise;
    return db.collection("groups").update({_id: group}, {$pull: {instructors: username}});
}

module.exports.addUserToGroup = async function(username, group){
    let db = await dbPromise;
    return db.collection("users").updateOne(
        {"_id": {$eq: username}},
        {
            $addToSet: {"groups": group}
        },
        {}
    );
}

module.exports.removeUserFromGroup = async function(username, group){
    let db = await dbPromise;
    return db.collection("users").update(
        {_id: username},
        {
            $pull: {groups: group}
        }
    );
}

///// For testing. Clear the database. Expand when adding new collections
module.exports.clearDB = async function(){
    let db = await dbPromise;
    return Promise.all([clearCollectionPromise(db, "samples"), clearCollectionPromise(db, "categories"), db.collection("groups").deleteMany({})]);
}
