var db = require("./db.js");
var fs = require("fs");

let promises = [];

// this pushes one promise which pushes many other promises
promises.push(db.clearDB().then(() => {
    promises.push(db.createCategory("Algorithms", null));
    promises.push(db.createCategory("Data Structures", null));
    promises.push(db.createCategory("Binary Search Tree", "Data Structures"));
    promises.push(db.createCategory("Binary Heap", "Data Structures"));
    promises.push(db.putCodeSample("Binary Search Tree", {
        name: "Basic BST",
        code: fs.readFileSync("Code Examples/BasicBST").toString('utf-8')
    }));
    promises.push(db.putCodeSample("Binary Search Tree", {
        name: "BST Height Complexity",
        code: fs.readFileSync("Code Examples/BSTHeightComplexity").toString('utf-8')
    }));
    promises.push(db.putCodeSample("Binary Search Tree", {
        name: "BST Sort",
        code: fs.readFileSync("Code Examples/BSTSort").toString('utf-8')
    }));
    promises.push(db.putCodeSample("Binary Heap", {
        name: "Basic Min Heap",
        code: fs.readFileSync("Code Examples/BasicMinHeap").toString('utf-8')
    }));
    promises.push(db.putCodeSample("Binary Heap", {
        name: "Heap Sort Comparison",
        code: fs.readFileSync("Code Examples/HeapSortComparison").toString('utf-8')
    }));
}).catch((err) => {
    console.log("Unable to clear database before init: ");
    console.log(err);
    process.exit();
}));

Promise.all(promises).then(() => {
    Promise.all(promises).then((vals) => {
        console.log("Db init successful");
        process.exit();
    });
}).catch(err => {
    console.log("Failed to init DB. Reason:");
    console.log(err);
    process.exit();
});
