/**
 * @author Coderc
 * @description Entry file for server.
 */

/**
 * @description Package dependencies.
 */
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

/**
 *  @description Internal dependencies.
 */
const connectDB = require("./config/db");
const logger = require("./config/logger");
const indexRoutes = require("./routes");

/**
 *  @description Defining variables.
 */
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * @description Configuring middleware.
 */
app.use(express.json());
app.use(cookieParser());

const allowedDomains = ["http://127.0.0.1:3000", "http://localhost:3000"];
app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            // bypass the requests with no origin (like curl requests, mobile apps, etc )
            if (!origin) return callback(null, true);

            if (
                allowedDomains.indexOf(origin) !== -1 ||
                origin.includes("coderc")
            ) {
                return callback(null, true);
            }

            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        },
    })
);

app.use(
    morgan("[:date[clf]] - :method :url :status - :response-time ms", {
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
