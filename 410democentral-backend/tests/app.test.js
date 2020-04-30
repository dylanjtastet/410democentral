const testInit = require("./init_tests.js")
var chai = require('chai')
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

beforeAll(async () => {
    await testInit.init()
});

//Login testing
test('User can login and receive a sessid', async () => {

    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    expect(sessid).not.toBe(null)
})

test('User can logout with sessid obtained from logging in', async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    let res2 = await chai.request('http://localhost:3009')
        .get('/logout')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessid=' + sessid)

    let data2 = await JSON.parse(res2.text)
    expect(data2).toBe(true)
})

test('User can get all groups they are in and see if they are an instructor', async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    let res2 = await chai.request('http://localhost:3009')
        .get('/allgroups')
        .set('Cookie', 'sessid=' + sessid)

    let data2 = await JSON.parse(res2.text)
    expect(data2.length).toBe(2)

    if(data2[0]._id==="comp210") {
        expect(data2[0].isInstructor).toBe(true)
        expect(data2[1].isInstructor).toBe(false)
    } else {
        expect(data2[0].isInstructor).toBe(false)
        expect(data2[1].isInstructor).toBe(true)
    }
})

test('User can remove and then add themselves to a group', async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = JSON.parse(res.text)
    let sessid = data.sessid

    res = await chai.request('http://localhost:3009')
        .get("/removefrom/comp310")
        .set('Cookie', 'sessid=' + sessid)

    let status = await JSON.parse(res.status)
    expect(status).toBe(200)

    res = await chai.request('http://localhost:3009')
        .get('/allgroups')
        .set('Cookie', 'sessid=' + sessid)

    data = await JSON.parse(res.text)
    //Array received has two objects, one with _id='comp210', the other with _id=null
    expect(data.length).toBe(1)

    res = await chai.request('http://localhost:3009')
        .get("/addto/comp310")
        .set('Cookie', 'sessid=' + sessid)
        .query({'group':'comp310'})

    status = await JSON.parse(res.status)
    expect(status).toBe(200)

    res = await chai.request('http://localhost:3009')
        .get('/allgroups')
        .set('Cookie', 'sessid=' + sessid)

    data = await JSON.parse(res.text)
    expect(data.length).toBe(2)

})

test('Nonroot user can neither delete nor add a group', async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    res = await chai.request('http://localhost:3009')
        .delete("/group")
        .set('Cookie', 'sessid=' + sessid)

    let status = await JSON.parse(res.status)
    expect(status).toBe(403)

    res = await chai.request('http://localhost:3009')
        .post("/group")
        .set('Cookie', 'sessid=' + sessid)

    status = await JSON.parse(res.status)
    expect(status).toBe(403)
})

test('User can request list of categories they have access to', async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    res = await chai.request('http://localhost:3009')
        .get("/allcategories")
        .set('Cookie', 'sessid=' + sessid)

    data = await JSON.parse(res.text)
    expect(data[0].name).toBe("Algorithms")
    expect(data[1].name).toBe("Sorting")
    expect(data.length).toBe(2)
})

test('User can add a category to course they are an instructor for', async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    res = await chai.request('http://localhost:3009')
        .post('/category')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessid='+sessid)
        .query({'group':'comp210','name':'Data Structures'})

    data = await JSON.parse(res.text)
    expect(data.newId).not.toBe(undefined)

    res = await chai.request('http://localhost:3009')
        .get("/allcategories")
        .set('Cookie', 'sessid=' + sessid)

    data2 = await JSON.parse(res.text)
    expect(data2.length).toBe(3)

})

test("Nonroot user cannot add a category to a course they are not an instructor for", async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    res = await chai.request('http://localhost:3009')
        .post('/category')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessid='+sessid)
        .query({'group':'comp310','name':'Data Structures'})

    
    let status = await JSON.parse(res.status)
    expect(status).toBe(403)
})

test("User can post and get a sample to a course they are an instructor for", async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    res = await chai.request('http://localhost:3009')
    .get("/allcategories")
    .set('Cookie', 'sessid=' + sessid)

    data = await JSON.parse(res.text)

    let catId
    for (cat of data) {
        if (cat.name==="Data Structures") catId=cat._id
    }

    res = await chai.request('http://localhost:3009')
        .post('/sample')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessid='+sessid)
        .query({'group':'comp210','category':catId})
        .send({'name': 'BST', 'code': 'Hello 2'})

    let sampleId = await JSON.parse(res.text)
    sampleId = sampleId.newId
    expect(sampleId).not.toBe(undefined)

    res = await chai.request('http://localhost:3009')
        .get('/sample')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessid='+sessid)
        .query({'id':sampleId})

    data = await JSON.parse(res.text)
    expect(data.name).toBe('BST')
    expect(data.code).toBe('Hello 2')
})

test("User can delete a sample in a course they are the instructor for", async () => {
    let res = await chai.request('http://localhost:3009')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ "username": "testuser", "password":"password" }))
    
    let data = await JSON.parse(res.text)
    let sessid = data.sessid

    res = await chai.request('http://localhost:3009')
    .get("/allcategories")
    .set('Cookie', 'sessid=' + sessid)

    data = await JSON.parse(res.text)

    let catId
    for (cat of data) {
        if (cat.name==="Data Structures") catId=cat._id
    }

    res = await chai.request('http://localhost:3009')
        .post('/sample')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessid='+sessid)
        .query({'group':'comp210','category':catId})
        .send({'name': 'BST Sort', 'code': 'Hello 3'})

    let sampleId = await JSON.parse(res.text)
    sampleId = sampleId.newId

    res = await chai.request('http://localhost:3009')
        .delete('/sample')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessid='+sessid)
        .send({'id':sampleId})

    let status = await JSON.parse(res.status)

    expect(status).toBe(200)
})



