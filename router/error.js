const expressErrorHandler = require("express-error-handler");

const errorHander = expressErrorHandler({
    static: {
        404: "views/404.ejs",
    },
});

const httpError = expressErrorHandler.httpError(404);

const expressError = {
    errorHander: errorHander,
    httpError: httpError,
};

module.exports.expressError = expressError;
