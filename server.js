/**
 * @author @harsh-coderc
 * @description Entry file for server.
 */

/**
 * @description Importing package dependencies.
 */
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

/**
 *  @description Importing internal dependencies.
 */
const connectDB = require("./config/db");
const logger = require("./config/logger");
const indexRoutes = require("./routes");

/**
 *  @description Defining variables.
 */
const app = express();
const PORT = process.env.PORT || 5000;
const allowedDomains = ["http://127.0.0.1:3000", "http://localhost:3000"];

/**
 * @description Configuring middleware.
 */
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            /**
             * @description Bypassing the requests with no origin (like curl requests, mobile apps, etc).
             */
            if (!origin) return callback(null, true);

            /**
             * @description Checking if required URL is present in the origin request.
             */
            if (
                allowedDomains.indexOf(origin) !== -1 ||
                origin.includes("coderc")
            ) {
                return callback(null, true);
            }

            /**
             * @description Returning error if the required URL is present in the origin request.
             */
            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        },
    })
);

/**
 * @description Logging every incoming API.
 * @example https://github.com/expressjs/morgan#readme
 */
app.use(
    morgan(process.env.ENV === "DEV" ? "dev" : "combined", {
        stream: logger.stream,
    })
);

/**
 *  @description Establishing Server Connection.
 */
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}...`);
});

/**
 *  @description Connecting to MongoDB.
 */
connectDB();

/**
 *  @description Defining Routes.
 */
app.use(indexRoutes);
