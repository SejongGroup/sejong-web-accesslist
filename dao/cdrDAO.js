const { DATABASE_CDR_TYPE } = require("../const/const");
const { connection } = require("../utils/dbConect");

/**
 * @description CDR 테이블에 파라미터 데이터를 등록합니다.
 * @param authKey
 * @returns {success} true
 */
function insertCDR(caller, called, accessCode) {
    return new Promise((resolve, reject) => {
        connection(DATABASE_CDR_TYPE).then((dbInstance) => {
            let queryStr = dbInstance.configQuery.insertCDR.replace("()", `('${caller}', '${called}', '${accessCode}', NOW())`);
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
        });
    }).catch((err) => {
        return reject(err);
    });
}

module.exports.insertCDR = insertCDR;
