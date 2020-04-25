
let MongoClient = require("mongodb");
const db = require("../db.js")

test('Add and get group in databases', async () => {
    await db.clearDB();
    await db.createGroup('Comp210')
    let mygroup = await db.getGroup('Comp210')
    expect(typeof mygroup).toBe("object")
    expect(mygroup._id).toBe('Comp210')

    let allgroups = await db.getAllGroups()
    expect(allgroups[0]._id).toBe('Comp210')
  });

test('Remove group from database', async () => {
    let allgroups = await db.getAllGroups()
    expect(allgroups.length).toBe(1)
    await db.deleteGroup('Comp210')
    allgroups = await db.getAllGroups()
    expect(allgroups.length).toBe(0)
})

test('Add and get category and child category from database', async () => {
  await db.clearDB();
  await db.createGroup('Comp210')
  await db.createCategory('Algorithms', null, 'Comp210')
  let categories = await db.getAllCategories()

  console.log(categories)
})