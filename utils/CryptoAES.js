var CryptoJS = require("crypto-js");

function encrypted(data, secretKey) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

function decrypted(encrypted, secretKey) {
    return JSON.parse(CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8));
}

module.exports.encrypted = encrypted;

module.exports.decrypted = decrypted;
