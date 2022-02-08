/** import */
const rateLimit = require("express-rate-limit");

/** const */
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    handler: (request, response, next, options) => {
        return response.render("exceed");
    },
});

module.exports.limiter = limiter;
