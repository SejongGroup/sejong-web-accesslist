/** import */
const express = require("express");
const path = require("path");
const { invaildAuthKey, authKey2DecryptJSON, deleteAuthKey } = require("../dao/authDAO");
const { insertCDR } = require("../dao/cdrDAO");
const { loggerInfo, loggerError } = require("../utils/logger");

/** const */
const router = express.Router();
const jsName = path.basename(__filename);

/**
 * @method POST
 * @url /auth
 *
 * @description auth 로 들어오는 post Method 에 대하여 처리를 시행합니다.
 *  데이터베이스에 저장된 aes 경로와 path 가 일치할 경우 access  페이지를 보여줍니다.
 * @param req
 * @param res
 * @returns {render} pages
 */
router.post("/auth", (req, res) => {
    let authKey = req.body.authKey;
    let frontLogger = `[url:/auth|method:${req.method}]`;

    loggerInfo(jsName, `${frontLogger} - ${req.ip} - 사용자가 접근하였습니다.`);

    if (authKey.length == 0 || typeof authKey == undefined || authKey == null) {
        loggerInfo(jsName, `${frontLogger} - ${req.ip} - authKey가 존재하지 않아 오류페이지를 제공합니다. - 요청받은 authKey : ${authKey}`);
        return res.render("404");
    }

    invaildAuthKey(authKey)
        .then((res2) => {
            if (res2 == true) {
                return res.render("access", { authKey: req.body.authKey });
            } else {
                loggerInfo(jsName, `${frontLogger} - ${req.ip} - 데이터베이스에 일치하는 authKey가 없어 오류페이지를 제공합니다. - 요청받은 authKey : ${authKey}`);
                return res.render("404");
            }
        })
        .catch((err) => {
            loggerError(jsName, `${frontLogger} - ${req.ip} - 데이터베이스 접근 도중 에러가 발생하였습니다.`);
            loggerError(jsName, `${frontLogger} - ${req.ip} - ${err}`);
            return res.render("404");
        });
});

/**
 * @method GET
 * @url /auth
 *
 * @description auth 로 들어오는 get Method 에 대하여 처리를 시행합니다.
 *  데이터베이스에 저장된 aes 경로와 path 가 일치할 경우 index  페이지를 보여줍니다.
 * @param req
 * @param res
 * @returns {render} pages
 */
router.use("/auth", (req, res) => {
    let authKey = req.path.substring(1, req.path.length);
    let frontLogger = `[url:/auth|method:${req.method}]`;

    loggerInfo(jsName, `${frontLogger} - ${req.ip} - 사용자가 접근하였습니다.`);

    if (authKey.length < 1 || typeof authKey == "undefined" || authKey == null) {
        loggerInfo(jsName, `${frontLogger} - ${req.ip} - authKey가 존재하지 않아 오류페이지를 제공합니다. - 요청받은 authKey : ${authKey}`);
        return res.render("404");
    }

    invaildAuthKey(authKey)
        .then((res2) => {
            if (res2 === true) {
                return res.render("index", { authKey: authKey });
            } else {
                loggerInfo(jsName, `${frontLogger} - ${req.ip} - 데이터베이스에 일치하는 authKey가 없어 오류페이지를 제공합니다. - 요청받은 authKey : ${authKey}`);
                return res.render("404");
            }
        })
        .catch((err) => {
            loggerError(jsName, `${frontLogger} - ${req.ip} - 데이터베이스 접근 도중 에러가 발생하였습니다.`);
            loggerError(jsName, `${frontLogger} - ${req.ip} - ${err}`);
            return res.render("404");
        });
});

/**
 * @method post
 * @url /authsubmit
 *
 * @description 데이터베이스에서 aes 암호화 된 url 데이터를 삭제합니다.
 * 삭제한 후 사용자에게는 출입이 등록되었다는 페이지를 변경하기 위해 {success: true} 를 전송합니다.
 * @param req
 * @param res
 * @returns {json} success
 */
router.post("/authsubmit", async (req, res) => {
    let authKey = req.body.authKey;
    let accessCode = req.body.accessCode;
    let frontLogger = `[url:/authsubmit|method:${req.method}]`;

    loggerInfo(jsName, `${frontLogger} - ${req.ip} - 사용자가 접근하였습니다.`);

    if (authKey.length == 0 || authKey == "undefined" || authKey == null) {
        loggerInfo(jsName, `${frontLogger} - ${req.ip} - 데이터베이스에 일치하는 authKey가 없어 오류페이지를 제공합니다. - 요청받은 authKey : ${authKey}`);
        return res.json({ success: false });
    }

    if (accessCode.length == 0 || accessCode == "undefined" || accessCode == null) {
        loggerInfo(jsName, `${frontLogger} - ${req.ip} - accessCode 파라미터가 존재하지 않아 오류페이지를 제공합니다. - 요청받은 accessCode : ${accessCode}`);
        return res.json({ success: false });
    }

    invaildAuthKey(authKey)
        .then((res2) => {
            if (res2 === true) {
                authKey2DecryptJSON(authKey)
                    .then(async (res3) => {
                        let caller = res3.caller;
                        let called = res3.called;

                        let deleteAuthKeyResult = await deleteAuthKey(authKey);

                        if (deleteAuthKeyResult != true) {
                            loggerError(jsName, `${frontLogger} - ${req.ip} - ${deleteAuthKeyResult}`);
                            return res.json({ success: false });
                        }

                        let insertCDRResult = await insertCDR(caller, called, accessCode);

                        if (insertCDRResult != true) {
                            loggerError(jsName, `${frontLogger} - ${req.ip} - ${insertCDRResult}`);
                            return res.json({ success: false });
                        }

                        setTimeout(() => {
                            loggerInfo(jsName, `${frontLogger} - ${req.ip} - 출입등록이 완료되었습니다.`);
                            return res.json({ success: true });
                        }, 2000);
                    })
                    .catch((err) => {
                        loggerError(jsName, `${frontLogger} - ${req.ip} - ${err}`);
                        return res.json({ success: false });
                    });
            } else {
                loggerInfo(jsName, `${frontLogger} - ${req.ip} - 데이터베이스에 일치하는 authKey가 없어 오류페이지를 제공합니다. - 요청받은 authKey : ${authKey}`);
                return res.json({ success: false });
            }
        })
        .catch((err) => {
            loggerError(jsName, `${frontLogger} - ${req.ip} - 데이터베이스 접근 도중 에러가 발생하였습니다.`);
            loggerError(jsName, `${frontLogger} - ${req.ip} - ${err}`);
            return res.json({ success: false });
        });
});

module.exports.root = router;
