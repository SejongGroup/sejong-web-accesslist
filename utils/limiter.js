/** import */
const rateLimit = require("express-rate-limit");
const path = require("path");
const { LIMITER_MAX_COUNT, LIMITER_ENTER_TYPE, LIMITER_LEAVE_TYPE } = require("../const/const");
const { loggerInfo } = require("./logger");

/** const */
const jsName = path.basename(__filename);

/**
 * @description rateLimit 라이브러리를 사용하여 한 아이피의 접근을 제어하고 있습니다. 1분당 최대 20번 들어올 가능성이 있다고 가정하였습니다.
 * @returns {function} next
 */
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    handler: (request, response, next, options) => {
        return response.render("exceed");
    },
});

const timeOuts = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

/** class */
class ConcurrentLimiter {
    constructor(maxConcurrent) {
        this.maxConcurrent = maxConcurrent;
        this.currentConcurrent = 0;
    }

    ableToEntry() {
        if (this.currentConcurrent < this.maxConcurrent) {
            return true;
        } else {
            return false;
        }
    }

    addConcurrent() {
        this.currentConcurrent = this.currentConcurrent + 1;
    }

    removeConcurrent() {
        this.currentConcurrent = this.currentConcurrent - 1;
    }

    countConcurrent() {
        return this.currentConcurrent;
    }

    getMaxConcurrent() {
        return this.maxConcurrent;
    }
}

/** Instance */
const conCurrentLimit = new ConcurrentLimiter(LIMITER_MAX_COUNT);

/**
 * @description 서버에 접근하는 동시 접속자의 수를 제한합니다.
 * @param type 타입이 ENTER 일 경우 접속자의 수를 검사하여 최대 접속자의 수 보다 적을 경우 접속을 허용합니다. 그렇지 않을 경우 접근을 제한합니다.
 * 타입이 LEAVE 일 경우 로그의 출력과 함께 접속자의 수 하나를 제거합니다. favicon 과 같은 경우에는 한번 더 들어올 가능성이 있어 LEAVE 타입도 미들웨어에 등록합니다.
 * @param type
 * @returns {function} next
 */
function conCurrentLimiter(type) {
    return function (req, res, next) {
        if (type == LIMITER_ENTER_TYPE) {
            if (conCurrentLimit.ableToEntry()) {
                loggerInfo(jsName, `허용 접속자 수 : ${conCurrentLimit.getMaxConcurrent()} - 현재 접속자 : ${conCurrentLimit.countConcurrent()} - ${req.ip} 사용자가 접근합니다.`);
                conCurrentLimit.addConcurrent();
                return next();
            } else {
                loggerInfo(jsName, `허용 접속자 수 : ${conCurrentLimit.getMaxConcurrent()} - 현재 접속자 : ${conCurrentLimit.countConcurrent()} - ${req.ip} 사용자의 접근을 제한합니다.`);
                return res.render("exceed");
            }
        } else if (type == LIMITER_LEAVE_TYPE) {
            loggerInfo(jsName, `허용 접속자 수 : ${conCurrentLimit.getMaxConcurrent()} - 현재 접속자 : ${conCurrentLimit.countConcurrent()} - ${req.ip} 사용자가 접근을 해제합니다.`);
            conCurrentLimit.removeConcurrent();

            if (next !== null) return next();
        }
    };
}

module.exports.limiter = limiter;
module.exports.timeouts = timeOuts;
module.exports.conCurrentLimiter = conCurrentLimiter;
