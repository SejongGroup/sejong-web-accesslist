/** import */
const mysql = require("mysql");
const path = require("path");
const { DATABASE_CDR_TYPE, DATABASE_AUTH_TYPE } = require("../const/const");
const { createIniParaser } = require("./iniParser");
const { loggerError, loggerInfo } = require("./logger");

/** const */
const jsName = path.basename(__filename);
const iniParser = createIniParaser("./const/db.ini"); // 설정 정보를 파서
const authDBConfig = iniParser.getKey("AUTH"); // 설정 정보를 파서
const cdrDBConfig = iniParser.getKey("CDR"); // 설정 정보를 파서

/**
 * @description DB 연결을 위한 클래스를 생성합니다. IniParser 클래스의 인스턴스를 받아 ini 설정파일을 파서한 후, 파서한 데이터를 이용하여 connection 객체를 생성합니다.
 * 생성한 후 데이터베이스를 연결합니다. 연결 도중 끊어지면 재연결을 시도합니다.
 * 재연결을 5번 초과하였을 경우, 데이터베이스의 대한 연결이 되지 않는다고 판단하고 앱을 종료합니다.
 * @param {IniParser} config - IniParser 클래스를 파라미터로 받습니다.
 */
class DBConnection {
    constructor(config) {
        this.connection = mysql.createConnection({
            host: config.host || "localhost",
            user: config.user || "root",
            password: config.password || "vkvkdltm",
            database: config.database || "JONG",
        });
        this.reconnectionCount = 0;
        this.config = config;
        this.connect();
    }

    connect() {
        loggerInfo(jsName, "database setting - 데이터베이스 접근을 시도합니다.");
        if (this.reconnectionCount >= 5) {
            loggerError(jsName, "database setting - 데이터베이스 접근을 할 수 없어 프로세스가 자동으로 종료됩니다.");
            return process.exit(0);
        } else {
            this.connection.connect((err) => {
                if (err) {
                    loggerError(jsName, "database setting - 데이터베이스를 접근할 수 없습니다. 잠시 후 다시 시도합니다.");
                } else {
                    loggerInfo(jsName, "database setting - 성공적으로 데이터베이스에 접근하였습니다.");
                }
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
                this.connection.configQuery = this.config;
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
/** Instance */
const dbConnection = new DBConnection(authDBConfig);
const cdrdbConnection = new DBConnection(cdrDBConfig);

/**
 * @description 타입에 따른 데이터베이스 인스턴스를 리턴합니다.
 * 생성된 데이터베이스 인스턴스는 다음과 같습니다.
 * 1. CDR database Instance : 전화출입명부의 CDR 인스턴스 기록을 위한 테이블입니다.
 * 2. AUTH database Instance : 일반적으로 전화출입이 실패한 경우 데이터베이스에 기록을 하기 위한 테이블입니다.
 *
 * @param {String} type - 타입은 const.js 에서 정의되어 있습니다.
 *
 * @return {DBConnection} 데이터베이스 인스턴스
 */
async function getDBInstance(type) {
    if (type == DATABASE_CDR_TYPE) {
        return await cdrdbConnection.getInstance();
    } else if (type == DATABASE_AUTH_TYPE) {
        return await dbConnection.getInstance();
    } else {
        return null;
    }
}

module.exports.connection = getDBInstance;
