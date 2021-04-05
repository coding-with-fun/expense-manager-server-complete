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
const indexRoutes = require("./router");

/**
 *  @description Defining variables.
 */
const app = express();
const PORT = process.env.PORT;

/**
 * @description Configuring middleware.
 */
app.use(express.json());
app.use(cookieParser());
app.use(cors());
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
    // logger.error("Server Sent A Hello World!");
    // logger.warn("Server Sent A Hello World!");
});

/**
 *  @description Connecting to MongoDB.
 */
connectDB();

/**
 *  @description Defining Routes.
 */
app.use(indexRoutes);
