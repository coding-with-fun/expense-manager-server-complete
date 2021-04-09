/**
 * @author Coderc
 * @description Bearer token validation.
 */

const jwt = require("express-jwt");
const logger = require("../config/logger");

exports.authenticateToken = () => {
    return [
        /**
         * @description Check for Bearer token.
         */
        jwt({
            secret: process.env.SECRET,
            algorithms: ["HS256"],
            getToken: function getJWT(req) {
                let token =
                    req.query.token || req.headers.expense_manager_user_token;
                token = token.split(" ");

                if (token && token[0] === "Bearer") {
                    return token[1];
                } else {
                    logger.error("Invalid token received.");
                    return null;
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
