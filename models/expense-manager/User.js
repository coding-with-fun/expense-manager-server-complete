/**
 * @author Coderc
 * @description User Model.
 */

const crypto = require("crypto");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const logger = require("../../config/logger");

const { ObjectId } = mongoose.Schema;

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },

        encryptedPassword: {
            type: String,
            trim: true,
            required: true,
        },

        isAuthenticated: {
            type: Boolean,
            required: true,
        },

        salt: String,

        transactionsList: {
            type: ObjectId,
            ref: "Transaction",
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuid();
        this.encryptedPassword = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    /**
     * @description Authenticate user with the plain password
     * @param plainPassword
     * @returns { boolean }
     */
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encryptedPassword;
    },

    /**
     * @description Hash the plain password
     * @param plainPassword
     * @returns { string }
     */
    securePassword: function (plainPassword) {
        if (plainPassword) {
            try {
                return crypto
                    .createHmac("sha256", this.salt)
                    .update(plainPassword)
                    .digest("hex");
            } catch (error) {
                logger.error("Error while hashing password.");
                return "";
            }
        } else {
            logger.error("No password found.");
            return "";
        }
    },
};

module.exports = User = mongoose.model("User", UserSchema);
