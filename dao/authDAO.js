const { createKey, deCrypt } = require("../utils/aes");
const { timestamp2int } = require("../utils/dateFormat");
const { connection } = require("../utils/dbConect");

function invaildAuthKey(authKey) {
    return new Promise(function (resolve, reject) {
        if (authKey.length == 0) {
            return reject();
        }

        let queryStr = `SELECT COUNT(*) as cnt FROM URLDATE where URL = '${authKey}'`;

        connection()
            .then((dbInstance) => {
                dbInstance.query(queryStr, function (error, result) {
                    if (error) {
                        return reject(false);
                    }

                    if (result[0].cnt >= 1) {
                        return resolve(true);
                    } else {
                        return reject(false);
                    }
                });
            })
            .catch(function (err) {
                return reject(false);
            });
    });
}

function authKey2DecryptJSON(authKey) {
    return new Promise((resolve, reject) => {
        if (authKey.length == 0) {
            return reject();
        }

        let queryStr = `SELECT * from URLDATE where URL = '${authKey}'`;

        connection()
            .then((dbInstance) => {
                dbInstance.query(queryStr, (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    res = res[0];

                    if (res.url == undefined || res.url == null) {
                        return reject();
                    }

                    if (res.date == "undefined" || res.date == null) {
                        return reject();
                    }

                    let timestamp = timestamp2int(res.date);
                    let key = createKey(timestamp);
                    let plainText = deCrypt(authKey, key);

                    if (plainText) {
                        return resolve(JSON.parse(plainText));
                    } else {
                        return reject();
                    }
                });
            })
            .catch(function (err) {
                return reject(err);
            });
    });
}

function deleteAuthKey(authKey) {
    return new Promise((resolve) => {
        if (authKey.length == 0) {
            return resolve();
        }

        let queryStr = `DELETE FROM URLDATE where URL = '${authKey}'`;

        connection().then((dbInstance) => {
            dbInstance.query(queryStr, (err, res) => {
                return resolve();
            });
        });
    });
}

module.exports.invaildAuthKey = invaildAuthKey;
module.exports.authKey2DecryptJSON = authKey2DecryptJSON;
module.exports.deleteAuthKey = deleteAuthKey;
