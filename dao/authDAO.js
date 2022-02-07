const { connection } = require("../utils/dbConect");

function invaildAuthKey(authKey) {
    return new Promise(function (resolve, reject) {
        connection()
            .then((dbInstance) => {
                dbInstance.query(`SELECT COUNT(*) as cnt FROM TEST where URL = '${authKey}'`, function (error, result) {
                    if (error) {
                        console.log(error);
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

module.exports.invaildAuthKey = invaildAuthKey;
