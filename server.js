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
require("colors");
require("dotenv").config();

/**
 *  @description Internal dependencies.
 */
const connectDB = require("./config/db");

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

/**
 *  @description Establishing Server Connection.
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`.magenta);
});

/**
 *  @description Connecting to MongoDB.
 */
connectDB();

/**
 *  @description Defining Routes.
 */
app.use("/", (req, res) => {
    res.json({
        message: "Hello Sir...",
    });
});
