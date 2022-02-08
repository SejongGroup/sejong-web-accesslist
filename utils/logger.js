/** import */
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");

/** const */
const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true,
    }),
    winston.format.label({
        label: "[LOGGER]",
    }),
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:MM:SS",
    }),
    winston.format.printf((info) => `[${info.timestamp}] | [${info.level}] | ${info.message}`)
);

const notalignColorsAndTime = winston.format.combine(
    winston.format.label({
        label: "[LOGGER]",
    }),
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:MM:SS",
    }),
    winston.format.printf((info) => `[${info.timestamp}] | [${info.level}] | ${info.message}`)
);

const logger = winston.createLogger({
    level: "debug",
    transports: [
        new winstonDaily({
            filename: "logs/accesslog",
            zippedArchive: true,
            format: winston.format.combine(notalignColorsAndTime),
        }),

        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
        }),
    ],
});

/** exports */
module.exports.loggerInfo = function (jsName, msg) {
    logger.info(`${jsName} | ${msg}`);
};
module.exports.loggerError = function (jsName, msg) {
    logger.error(`${jsName} | ${msg}`);
};
