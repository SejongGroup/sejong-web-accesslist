/** import */
const express = require("express");
const { invaildAuthKey } = require("../dao/authDAO");
const router = express.Router();

/**
 * @method POST
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
 *
 * @description 데이터베이스에서 aes 암호화 된 url 데이터를 삭제합니다.
 * 삭제한 후 사용자에게는 출입이 등록되었다는 페이지를 변경하기 위해 {success: true} 를 전송합니다.
 * @param req
 * @param res
 * @returns {json} success
 */
router.post("/jongsungogo", async (req, res) => {
    console.log(req.body.authKey);
    console.log(req.body.accessCode);

    setTimeout(() => {
        return res.json({ success: true });
    }, 2000);
});

module.exports.root = router;
