const Crypto = require("crypto");
const { getDate } = require("../utils/dateFormat");

let caller = "01065629300";
let called = "07079372101";
let timestamp = getDate("yyyymmddHHMMss").format;

let keys = createKey(caller, called, timestamp);

var plainText = JSON.stringify({ caller: caller, called: called });

function createKey(timestamp) {
    let myKey = timestamp + "SEJONG" + "GANGNAM";
    var md5 = Crypto.createHash("md5");
    return md5.update(myKey).digest("hex");
}

function enCrypt(plainText, key) {
    let iv = key.slice(16, 32);
    plainText = Buffer.from(plainText);
    let cipher = Crypto.createCipheriv("AES-256-CBC", key, iv);
    let encrypted = cipher.update(plainText);
    return Buffer.concat([encrypted, cipher.final()]).toString("base64");
}

function deCrypt(encryptText, key) {
    let iv = key.slice(16, 32);
    encryptText = Buffer.from(encryptText, "base64");
    let cipher = Crypto.createDecipheriv("AES-256-CBC", key, iv);
    let decrypted = cipher.update(encryptText);
    return Buffer.concat([decrypted, cipher.final()]).toString("utf-8");
}

var encryptText = enCrypt(plainText, keys);
console.log(encryptText);

var plainText = deCrypt(encryptText, keys);
console.log(plainText);

module.exports.enCrypt = enCrypt;
module.exports.deCrypt = deCrypt;
module.exports.createKey = createKey;
