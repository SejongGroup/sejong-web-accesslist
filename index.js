/** import */
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const { LIMITER_ENTER_TYPE, LIMITER_LEAVE_TYPE } = require("./const/const");
const { expressError } = require("./router/error");
const { root } = require("./router/root");
const { limiter, conCurrentLimiter } = require("./utils/limiter");
const { loggerInfo } = require("./utils/logger");

/** const */
const app = express();
const hostname = "0.0.0.0";
const port = 3000;
const jsName = path.basename(__filename);

/** express middleware settings */
app.set("view engine", "ejs"); // express view engine 을 ejs 로 변경함 (html -> ejs)
app.set("views", path.join(__dirname, "views")); // exporess view path 를 세팅함
app.use("/static", express.static("public")); // render path를 설정하기 위함
app.use(express.json()); // express body parser
app.use(express.urlencoded({ extended: true })); // express body parser
app.use(limiter); // 하나의 아이피에 대한 시간당 요청 수 제한
app.use(conCurrentLimiter(LIMITER_ENTER_TYPE)); // 동시접속자 제한 및 접속자에 대한 세션 추가
app.use("/", root); // root router
app.use(conCurrentLimiter(LIMITER_LEAVE_TYPE)); // 접속자에 대한 세션 삭제
app.use(expressError.httpError); // express error handler
app.use(expressError.errorHander); // express error handler

/** print logger */
loggerInfo(jsName, `express setting - "html" 문법을 "ejs" 로 변경`);
loggerInfo(jsName, `express setting - "front" 디렉토리를 ./views 로 변경`);
loggerInfo(jsName, `express setting - "static" 디렉토리를 ./public 로 변경`);
loggerInfo(jsName, `express setting - DDOS 방어 및 시간당 요청수 제한 설정`);
loggerInfo(jsName, `express setting - 동시접속자 제한 및 접속자에 대한 세션 제어`);
loggerInfo(jsName, `express setting - "BodyParser" 설정`);
loggerInfo(jsName, `express setting - "root" 라우터 설정`);
loggerInfo(jsName, `express setting - "error" 라우터 설정`);

/** express Server Start */
app.listen(port, hostname, () => {
    loggerInfo(jsName, `PortNumber : ${port} - 전자출입명부 웹페이지 서비스를 시작합니다. `);
});
