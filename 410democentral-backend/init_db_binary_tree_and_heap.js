var db = require("./db.js");
var fs = require("fs");

let promises = [];

// this pushes one promise which pushes many other promises
async function init(){
        await db.clearDB();
        let comp210 = await db.createGroup("comp210");
        await db.makeUserInstructorFor("test", "comp210");
        let algos = await db.createCategory("Algorithms", null, "comp210");
        let dstructures = await db.createCategory("Data Structures", null, "comp210");
        let bst = await db.createCategory("Binary Search Tree", dstructures, "comp210");
        let bheap = await db.createCategory("Binary Heap", dstructures, "comp210");
        promises.push(db.putCodeSample(bst, "comp210", {
            name: "Basic BST",
            code: fs.readFileSync("Code Examples/BasicBST").toString('utf-8')
        }));
        promises.push(db.putCodeSample(bst, "comp210", {
            name: "BST Height Complexity",
            code: fs.readFileSync("Code Examples/BSTHeightComplexity").toString('utf-8')
        }));
        promises.push(db.putCodeSample(bst, "comp210", {
            name: "BST Sort",
            code: fs.readFileSync("Code Examples/BSTSort").toString('utf-8')
        }));
        promises.push(db.putCodeSample(bheap, "comp210", {
            name: "Basic Min Heap",
            code: fs.readFileSync("Code Examples/BasicMinHeap").toString('utf-8')
        }));
        promises.push(db.putCodeSample(bheap, "comp210", {
            name: "Heap Sort Comparison",
            code: fs.readFileSync("Code Examples/HeapSortComparison").toString('utf-8')
        }));
        promises.push(db.putCodeSample(algos, "comp210", {
            name: "Test UI Widgets",
            code: fs.readFileSync("Code Examples/TestWidgets").toString('utf-8')
        }));
        return Promise.all(promises);
}

init().then(() => {
    console.log("Db init successful");
    process.exit();
}).catch(err => {
    console.log("Failed to init DB. Reason:");
    console.log(err);
    process.exit();
});
