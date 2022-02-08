/** import */
const ini = require("ini");
const fs = require("fs");

/**
 * @description IniParser 클래스는 filepath 로부터 받아온 ini 파일을 파서하여 this.config에 저장하는 클래스입니다.
 * @param {String} filePath - 파일명
 */
class IniParser {
    constructor(filePath) {
        this.ini = ini;
        this.filePath = filePath;
        this.file = null;
        this.config = null;
    }

    fileInvalid() {
        if (fs.existsSync(this.filePath)) {
            this.file = fs.readFileSync(this.filePath, "utf-8");
            return true;
        } else {
            return false;
        }
    }

    parse() {
        if (this.fileInvalid()) {
            this.config = this.ini.parse(this.file);
            return true;
        } else {
            return false;
        }
    }

    getKey(key) {
        if (this.parse()) {
            return this.config[key];
        } else {
            return false;
        }
    }
}

/**
 * @description IniParser 클래스에서 인스턴스를 생성합니다.
 * @param {String} filePath - 파일명
 */
module.exports.createIniParaser = (filepath) => {
    const iniParser = new IniParser(filepath);
    return iniParser;
};
