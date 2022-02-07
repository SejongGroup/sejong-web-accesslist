var mysql = require("mysql");
const cryptoAES = require("./CryptoAES");

class DBConnection {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "vkvkdltm",
            database: "JONG",
        });
        this.reconnectionCount = 0;
        this.connect();
    }

    connect() {
        if (this.reconnectionCount >= 5) {
            return process.exit(0);
        } else {
            this.connection.connect((err) => {
                this.reconnectionCount++;
            });
        }
    }

    getState() {
        return this.connection.state;
    }

    timesleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    async getInstance() {
        try {
            if (this.getState() == "authenticated") {
                this.reconnectionCount = 0;
                return this.connection;
            } else {
                this.connect();
                await this.timesleep(1000);
                return this.getInstance();
            }
        } catch (err) {
            this.connect();
            await this.timesleep(1000);
            return this.getInstance();
        }
    }
}

const dbConnection = new DBConnection();

async function getDBInstance() {
    return await dbConnection.getInstance();
}

// connection.query("SELECT * FROM TEST", function (error, urldata, fields) {
//     if (error) {
//         console.log(error);
//     }
//     url = urldata;
//     console.log(urldata);
//     console.log("test url cryptoAES : " + cryptoAES.encrypted(urldata, secretKey));
// });
// connection.end();

// var secretKey = "secret key";
// var data = {
//     username: "jongsun",
//     age: 29,
// };

// console.log("test cryptoAES : " + cryptoAES.encrypted(data, secretKey));

module.exports.connection = getDBInstance;
