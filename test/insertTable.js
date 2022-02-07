const { createKey, enCrypt } = require("../utils/aes");
const { getDate } = require("../utils/dateFormat");
const { connection } = require("../utils/dbConect");

let caller = "01065629300";
let called = "07079372101";
let timestamp = getDate("yyyymmddHHMMss").format;
let plainText = JSON.stringify({ caller: caller, called: called });
let key = createKey(timestamp);

let aesURL = enCrypt(plainText, key);

connection().then((dbInstance) => {
    dbInstance.query(`INSERT INTO URLDATE values ('${aesURL}', '${timestamp}')`, function (error, result) {
        if (error) {
            console.log(error);
        }

        if (result.affectedRows == 1) {
            console.log("success");
        }
    });

    dbInstance.end();
});
