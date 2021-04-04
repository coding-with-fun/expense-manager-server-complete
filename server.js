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
require("colors");
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
    morgan(
        ":remote-addr - :remote-user [:date[clf]] - :method :url :status :res[content-length] - :response-time ms"
    )
);

/**
 *  @description Establishing Server Connection.
 */
app.listen(PORT, () => {
    logger.info("Server Sent A Hello World!");
    logger.error("Server Sent A Hello World!");
    logger.warn("Server Sent A Hello World!");
    logger.debug("Server Sent A Hello World!");
    console.log(`Server is running on port ${PORT}...`.magenta);
});

/**
 *  @description Connecting to MongoDB.
 */
connectDB();

/**
 *  @description Defining Routes.
 */
app.use(indexRoutes);
