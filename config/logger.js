/**
 * @author @harsh-coderc
 * @description Logger configuration.
 */

/**
 * @description Importing package dependencies.
 */
const { createLogger, format, transports } = require("winston");

const options = {
    /**
     * @description Options for writing logs to file.
     * @file logs/server.log
     */
    file: {
        filename: "logs/server.log",
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        handleExceptions: true,
        format: format.combine(
            format.timestamp({
                format: "DD-MMM-YYYY HH:mm:ss",
            }),
            format.align(),
            format.printf(
                (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
            )
        ),
    },

    /**
     * @description Options for logs to console.
     */
    console: {
        handleExceptions: true,
        format: format.combine(
            format.colorize(),
            format.timestamp({
                format: "DD-MMM-YYYY HH:mm:ss",
            }),
            format.align(),
            format.printf(
                (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
            )
        ),
    },
};

const fileTransport = new transports.File(options.file);
const consoleTransport = new transports.Console(options.console);

const logger = createLogger({
    transports:
        process.env.ENV === "DEV"
            ? [fileTransport, consoleTransport]
            : [consoleTransport],
    exitOnError: false,
});

logger.stream = {
    write(message) {
        logger.info(message);
    },
};

module.exports = logger;
