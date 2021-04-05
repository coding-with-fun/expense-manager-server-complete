/**
 * @author Coderc
 * @description Connection to MongoDB.
 */

const mongoose = require("mongoose");
const logger = require("./logger");
require("dotenv").config();

const connectDB = async () => {
    try {
        /**
         * @description Connection to MongoDB
         * @param MONGO_URI
         */
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        logger.info("MongoDB is connected!!");
    } catch (error) {
        logger.error(`${error.message}`);

        /**
         * @description Exit process with failure
         */
        process.exit(1);
    }
};

module.exports = connectDB;
