const db = require("../db.js");
const auth = require("../auth.js")

module.exports.init =  async function () {
    await db.clearDB();
    let userexists = await db.checkUserExists('testuser')
    if (!userexists) await auth.registerUser('testuser', 'password', 'email@email.com')
    await db.removeUserAsInstructor('testuser','comp210')
    await db.removeUserFromGroup('testuser','comp210')
    await db.removeUserFromGroup('testuser','comp310')

    await db.createGroup("comp210");
    await db.addUserToGroup("testuser", "comp210");
    await db.makeUserInstructorFor("testuser", "comp210");

    let comp310 = await db.createGroup("comp310");
    await db.addUserToGroup("testuser", "comp310");
    let algos = await db.createCategory("Algorithms", null, "comp310");
    let sort = await db.createCategory("Sorting", algos, "comp310")
    let sample = await db.putCodeSample(sort, "comp310", {
        name: "Bubble sort",
        code: "Hello"
    })

    let comp410 = await db.createGroup("comp410");
}