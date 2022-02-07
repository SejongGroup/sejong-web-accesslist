/** import */
const express = require("express");
const path = require("path");
const { expressError } = require("./router/error");
const { root } = require("./router/root");
const { limiter } = require("./utils/limiter");

/** const */
const app = express();
const port = 3000;

/** express middleware settings */
app.set("view engine", "ejs"); // express view engine 을 ejs 로 변경함 (html -> ejs)
app.set("views", path.join(__dirname, "views")); // exporess view path 를 세팅함
app.use("/static", express.static("public")); // render path를 설정하기 위함
app.use(limiter); // 하나의 아이피에 대한 시간당 요청 수 제한
app.use(express.json()); // express body parser
app.use(express.urlencoded()); // express body parser
app.use("/", root); // root router
app.use(expressError.httpError); // express error handler
app.use(expressError.errorHander); // express error handler

/** express Server Start */
app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});
