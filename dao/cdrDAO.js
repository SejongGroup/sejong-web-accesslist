const { connection } = require("../utils/dbConect");

function insertCDR(caller, called, accessCode) {
    return new Promise((resolve) => {
        if (caller.length == 0 || called == 0 || accessCode == 0) {
            return resolve();
        }

        let queryStr = `INSERT INTO TEST1 values ('${caller}', '${called}', '${accessCode}', NOW())`;

        connection().then((dbInstance) => {
            dbInstance.query(queryStr, (err, res) => {
                return resolve();
            });
        });
    });
}

module.exports.insertCDR = insertCDR;
