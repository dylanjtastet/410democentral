const auth = require("../auth.js");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter a username: ", async function(username){
    rl.question("Enter a password: ", async function(password){
        let res = await auth.registerUser(username, password, "", true); 
        if(res){
            console.log("Success!");
        }
        else{
            console.log("Failure");
        }
        rl.close();
        process.exit(0);
    });
});
