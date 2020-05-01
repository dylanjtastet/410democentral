const crypto = require("crypto");
const util = require("util");
const db = require("./db.js")

const PBKDF2_ITERATIONS = 10000;
const RANDLEN = 64;
const HASHLEN = RANDLEN; //In bytes
const SALTLEN = RANDLEN;
const HASH_FN = "sha512";
const TTL = 5; //Days

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

module.exports.registerUser = async function(username, passwd, email, isroot){
    let creds = await getPasswordSaltedHash(passwd);
    await db.insertUser(username, creds, email, isroot);
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
        let exp = new Date(Date.now() + TTL * 24 * 60 * 60 * 1000); //days, hours, minutes, seconds, milliseconds (since epoch)
        await db.insertUserSession(sessid, username, exp);
        return {
            sessid: sessid,
            exp: exp
        };
    }
    return false;
}

module.exports.logoutUser = async function(sessid){
    return db.deleteUserSession(sessid);
}

module.exports.isRootSession = async function(sessid){
    let user = await db.getUserForSession(sessid);
    return user.isroot;
}

module.exports.checkGroupPermissionsForSession = async function(sessid, groupName){
    let user = await db.getUserForSession(sessid);
    return this.checkGroupPermissions(user, groupName);
}

module.exports.checkGroupPermissions = async function(user, groupName){
    let group = await db.getGroup(groupName);
    if(!group){
        return false;
    }
    if(user.isroot){
        return true;
    }
    return group.instructors.indexOf(user._id)>=0;
}

module.exports.hasSampleEditPermission = async function(sessid, sid){
    let user = await db.getUserForSession(sessid);
    let sample = await db.getCodeSample(sid);
    if(sample.user && sample.user == user._id){
        return true;
    }
    return this.checkGroupPermissions(user, sample.group);
}

module.exports.canViewSample = async function(sessid, sid){
    let user = await db.getUserForSession(sessid);
    if(user.isroot){
        return true;
    }
    let sample = await db.getCodeSample(sid);
    if(sample.user){
        return sample.user == user._id;
    }
    return user.groups.indexOf(sample.group) >= 0;
}