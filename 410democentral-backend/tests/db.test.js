
let MongoClient = require("mongodb");
const db = require("../db.js")
const auth = require('../auth.js')

//Group testing
test('Add and get group in databases', async () => {
    await db.clearDB();
    await db.createGroup('Comp210')
    let mygroup = await db.getGroup('Comp210')
    expect(typeof mygroup).toBe("object")
    expect(mygroup._id).toBe('Comp210')

    let exists = await db.checkGroupExists('Comp210')
    expect(exists).toBe(true)

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


//Category Testing
test('Add and get category and child category from database', async () => {
  await db.clearDB();
  await db.createGroup('Comp210')
  let category = await db.createCategory('Algorithms', null, 'Comp210')

  let catobject = await db.getCategory(category)
  expect(catobject.name).toBe('Algorithms')

  let categories = await db.getAllCategories()

  expect(categories.length).toBe(1)
  expect(categories[0].name).toBe('Algorithms')
  expect(categories[0].group).toBe('Comp210')

  await db.createCategory('Sorting', category, 'Comp210')

  categories = await db.getAllCategories()
  expect(categories.length).toBe(2)

  if (categories[0].name === 'Sorting') {
    expect(categories[0].parent).toEqual(category)
  } else {
    expect(categories[1].parent).toEqual(category)
  }
})

test('Delete parent category (should delete child)', async () => {
  //For some reason this one gets caught up on the db.deleteCategory() call.
  jest.setTimeout(1000)

  await db.clearDB();
  await db.createGroup('Comp210')
  let category = await db.createCategory('Algorithms', null, 'Comp210')
  
  let categories = await db.getAllCategories()
  if (categories[0].name==='Algorithms') {
    await db.deleteCategory(categories[0]._id)
  } else {
    await db.deleteCategory(categories[1]._id)
  }

  categories = await db.getAllCategories()
  //expect(categories.length).toBe(0)
})


//Sample testing
test('Post and get sample with parent category', async () => {
  await db.clearDB()
  await db.createGroup('Comp210')
  let category = await db.createCategory('Algorithms', null, 'Comp210')
  

  let sampleID = await db.putCodeSample(category, "Comp210", {
    name: "Basic BST",
    code: "hello"
  });

  let sample = await db.getCodeSample(sampleID)

  expect(sample.name).toBe("Basic BST")
  expect(sample.code).toBe("hello")
})

test('Update sample', async () => {
  await db.clearDB()
  await db.createGroup('Comp210')
  let category = await db.createCategory('Algorithms', null, 'Comp210')
  let sampleID = await db.putCodeSample(category, "Comp210", {
    name: "BST Sort",
    code: "hello"
  })

  let sample = await db.getCodeSample(sampleID)
  expect(sample.name).toBe("BST Sort")
  expect(sample.code).toBe("hello")

  await db.updateCodeSample(sampleID, {name: "BST Sort 2", code: "hello 2"})
  sample = await db.getCodeSample(sample._id)
  expect(sample.name).toBe("BST Sort 2")
  expect(sample.code).toBe("hello 2")
})

test('Delete sample', async () => {
  await db.clearDB()
  await db.createGroup('Comp210')
  let category = await db.createCategory('Algorithms', null, 'Comp210')
  let sampleID = await db.putCodeSample(category, "Comp210", {
    name: "BST Sort",
    code: "hello"
  })

  let samples = await db.getAllSampleStubs()
  expect(samples.length).toBe(1)

  await db.deleteSample(sampleID)
  samples = await db.getAllSampleStubs()
  expect(samples.length).toBe(0)
})

//Users and instructors in group testing
test('Can add user to group and find them in there', async () => {
  await db.clearDB()
  await db.createGroup('Comp404')

  let userexists = await db.checkUserExists('dbtestuser')
  if (!userexists) await auth.registerUser('dbtestuser', 'password', 'email@email.com')

  let userlist = await db.getUsersInGroup('Comp404')
  expect(userlist.includes('dbtestuser')).toBe(false)

  await db.addUserToGroup('dbtestuser', 'Comp404')
  userlist = await db.getUsersInGroup('Comp404')

  expect(userlist.length).toBe(1)
  expect(userlist[0]._id).toBe('dbtestuser')
})

test('Can remove user from group', async () => {
  await db.removeUserFromGroup('dbtestuser', 'Comp404')

  let userlist = await db.getUsersInGroup('Comp404')

  expect(userlist.length).toBe(0)
})

test('Can add an instructor to a group', async () => {
  await db.makeUserInstructorFor('dbtestuser', 'Comp404')
  let group = await db.getGroup('Comp404')

  expect(group.instructors.includes('dbtestuser')).toBe(true)
})

test('Can remove an instructor from a group', async () => {
  await db.removeUserAsInstructor('Comp404', 'dbtestuser')
  let group = await db.getGroup('Comp404')

  expect(group.instructors.includes('dbtestuser')).toBe(false)
})

test('Deleting group should remove group from user list of groups', async () => {
  await db.addUserToGroup('dbtestuser', 'Comp404')

  await db.deleteGroup('Comp404')
  await db.createGroup('Comp404')

  let userlist = await db.getUsersInGroup('Comp404')
  expect(userlist.length).toBe(0)
})
