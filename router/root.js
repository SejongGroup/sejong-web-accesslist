/** import */
const express = require("express");
const { invaildAuthKey, authKey2DecryptJSON, deleteAuthKey } = require("../dao/authDAO");
const { insertCDR } = require("../dao/cdrDAO");
const router = express.Router();

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

    if (authKey.length == 0 || typeof authKey == undefined || authKey == null) {
        return res.render("404");
    }

    invaildAuthKey(authKey)
        .then((res2) => {
            if (res2 == true) {
                return res.render("access", { authKey: req.body.authKey });
            } else {
                return res.render("404");
            }
        })
        .catch((err) => {
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

    if (authKey.length < 1 || typeof authKey == undefined || authKey == null) {
        return res.render("404");
    }

    invaildAuthKey(authKey)
        .then((res2) => {
            if (res2 === true) {
                return res.render("index", { authKey: authKey });
            } else {
                return res.render("404");
            }
        })
        .catch((err) => {
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

    if (authKey.length == 0 || accessCode.length == 0 || authKey == null || accessCode == null) {
        return res.json({ success: false });
    }

    if (authKey == undefined || accessCode == undefined) {
        return res.json({ success: false });
    }

    invaildAuthKey(authKey)
        .then((res2) => {
            if (res2 === true) {
                authKey2DecryptJSON(authKey)
                    .then(async (res3) => {
                        let caller = res3.caller;
                        let called = res3.called;

                        await deleteAuthKey(authKey);
                        await insertCDR(caller, called, accessCode);

                        setTimeout(() => {
                            return res.json({ success: true });
                        }, 2000);
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.json({ success: false });
                    });
            } else {
                return res.json({ success: false });
            }
        })
        .catch((err) => {
            return res.json({ success: false });
        });
});

module.exports.root = router;
