/** import */
const { createKey, deCrypt } = require("../utils/aes");
const { timestamp2int } = require("../utils/dateFormat");
const { connection } = require("../utils/dbConect");
const { DATABASE_AUTH_TYPE } = require("../const/const");

/**
 * @description authKey가 데이터베이스에 존재하는 지 확인합니다.
 * @param authKey
 * @returns {bool} success
 */
function invaildAuthKey(authKey) {
    return new Promise(function (resolve, reject) {
        connection(DATABASE_AUTH_TYPE)
            .then((dbInstance) => {
                let queryStr = dbInstance.configQuery.invaildAuthKey + "'" + authKey + "'";
                dbInstance.query(queryStr, function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    if (result[0].cnt >= 1) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                });
            })
            .catch((err) => {
                return reject(err);
            });
    });
}

/**
 * @description authKey를 복호화하여 json 형태로 반환합니다.
 * @param authKey
 * @returns {json} {caller: '', called: ''}
 */
function authKey2DecryptJSON(authKey) {
    return new Promise((resolve, reject) => {
        connection(DATABASE_AUTH_TYPE)
            .then((dbInstance) => {
                let queryStr = dbInstance.configQuery.authKey2DecryptJSON + "'" + authKey + "'";
                dbInstance.query(queryStr, (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    res = res[0];

                    let timestamp = timestamp2int(res.date);
                    let key = createKey(timestamp);
                    let plainText = deCrypt(authKey, key);

                    if (plainText) {
                        return resolve(JSON.parse(plainText));
                    } else {
                        return reject("암호화 과정에서 실패하였습니다.");
                    }
                });
            })
            .catch((err) => {
                return reject(err);
            });
    });
}

/**
 * @description 데이터베이스에 존재하는 authKey를 삭제합니다.
 * @param authKey
 * @returns {success} true
 */
function deleteAuthKey(authKey) {
    return new Promise((resolve, reject) => {
        connection(DATABASE_AUTH_TYPE)
            .then((dbInstance) => {
                let queryStr = dbInstance.configQuery.deleteAuthKey + "'" + authKey + "'";
                dbInstance.query(queryStr, (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    if (res.affectedRows == 1) {
                        return resolve(true);
                    } else {
                        return reject("알 수 없는 오류가 발생하였습니다.");
                    }
                });
            })
            .catch((err) => {
                return reject(err);
            });
    });
}

module.exports.invaildAuthKey = invaildAuthKey;
module.exports.authKey2DecryptJSON = authKey2DecryptJSON;
module.exports.deleteAuthKey = deleteAuthKey;
