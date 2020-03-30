var db = require("./db.js");

let promises = [];

promises.push(db.clearDB().then(() => {
    promises.push(db.createCategory("Algorithms", null));
    promises.push(db.createCategory("Category 1", "Algorithms"));
    promises.push(db.createCategory("Category 2", "Algorithms"));
    promises.push(db.createCategory("Data Structures", null));
    promises.push(db.createCategory("Category 3", "Data Structures"));
    promises.push(db.createCategory("Triple Nested Category", "Category 3"));
    promises.push(db.putCodeSample("Algorithms", {name: "Universal Algorithm", code: "console.log('NP is a strict subset of P');"}));
    promises.push(db.putCodeSample("Data Structures", {name: "Universal Data Structure", code: "console.log('Robert Tarjan');"}));
    promises.push(db.putCodeSample("Category 1", {name: "Dummy code", code: "console.log('hello world');"}));
    promises.push(db.putCodeSample("Category 1", {name: "Dummy code 2", code: "console.log('this code sucks');"}));
    promises.push(db.putCodeSample("Category 2", {name: "Dummy code 3", code: "console.log('bruh');"}));
    promises.push(db.putCodeSample("Category 2", {name: "Dummy code 4", code: "console.log('test code');"}));
    promises.push(db.putCodeSample("Category 3", {name: "Dummy code 5", code: "console.log('lets goooo');"}));
    promises.push(db.putCodeSample("Triple Nested Category", {name: "Dummy code 6", code: "console.log('bruh**bruh');"}));
}).catch((err) => {
    console.log("Unable to clear database before init: ");
    console.log(err);
    process.exit();
}));
Promise.all(promises).then((vals) => {
    console.log("Db init successful");
}).catch(err => {
    console.log("Failed to init DB. Reason:");
    console.log(err);
    process.exit();
});