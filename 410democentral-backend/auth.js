const crypto = require("crypto");
const util = require("util");
const db = require("./db.js")

const PBKDF2_ITERATIONS = 10000;
const RANDLEN = 64;
const HASHLEN = RANDLEN; //In bytes
const SALTLEN = RANDLEN;
const HASH_FN = "sha512";

const randomBytes = util.promisify(crypto.randomBytes);
const pbkdf2 = util.promisify(crypto.pbkdf2);

const getPasswordSaltedHash = async function(passwd){
    let salt = await randomBytes(SALTLEN);
    let saltedHash = await pbkdf2(passwd, salt, PBKDF2_ITERATIONS, HASHLEN, HASH_FN);
    return {
        iterations: PBKDF2_ITERATIONS,
        salt: salt,
        fn: HASH_FN,
        hash: saltedHash
    };
};

const verifyPasswd = async function(passwd, hashRecord){
    let testHash = await pbkdf2(passwd, hashRecord.salt, hashRecord.iterations, hashRecord.hash.length, hashRecord.fn);
    return testHash.equals(hashRecord.hash); 
}

module.exports.registerUser = async function(username, passwd, email){
    let creds = await getPasswordSaltedHash(passwd);
    await db.insertUser(username, creds, email);
    return true;
}

module.exports.loginUser = async function(username, passwd){
    let userCreds = await db.getUserCreds(username);
    if (userCreds == null) { // user does not exist
      return false;
    }

    let creds = userCreds.creds;
    // Mongo stores these as a type called Binary
    creds.salt = creds.salt.buffer;
    creds.hash = creds.hash.buffer;
    if(await verifyPasswd(passwd, creds)){
        await db.deleteSessionByUser(username);
        let sessid = (await randomBytes(RANDLEN)).toString("hex");
        await db.insertUserSession(sessid, username);
        return sessid;
    }
    return false;
}

module.exports.logoutUser = async function(sessid){
    return db.deleteUserSession(sessid);
}

