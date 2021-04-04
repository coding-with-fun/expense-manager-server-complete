/**
 * @author Coderc
 * @description Connection to MongoDB.
 */

const mongoose = require("mongoose");
require("colors");
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

        console.log(`MongoDB is connected!!`.magenta);
    } catch (error) {
        console.log(`${error.message}`.red);

        /**
         * @description Exit process with failure
         */
        process.exit(1);
    }
};

module.exports = connectDB;
