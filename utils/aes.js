const Crypto = require("crypto");

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

module.exports.enCrypt = enCrypt;
module.exports.deCrypt = deCrypt;
module.exports.createKey = createKey;
