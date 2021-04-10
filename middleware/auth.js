/**
 * @author @harsh-coderc
 * @description Bearer token validation.
 */

/**
 * @description Importing package dependencies.
 */
const jwt = require("express-jwt");

/**
 *  @description Importing internal dependencies.
 */
const logger = require("../config/logger");

exports.authenticateToken = () => {
    return [
        /**
         * @description Checking for Bearer token.
         */
        jwt({
            secret: process.env.SECRET,
            algorithms: ["HS256"],
            userProperty: "auth",
            getToken: function getJWT(req) {
                /**
                 * @description Getting token from query or headers or cookies.
                 * @example Bearer {token}
                 */
                let token =
                    req.query.token ||
                    req.headers.expense_manager_user_token ||
                    req.cookies.expense_manager_user_token;

                /**
                 * @description Checking if a valid token is present.
                 */
                if (token) {
                    token = token.split(" ");
                    if (token[0] === "Bearer") {
                        return token[1];
                    }
                }
            },
        }),
        (err, req, res, next) => {
            logger.error("Invalid token received.");
            return res.status(err.status).json({
                message: err.inner.message,
            });
        },
    ];
};
