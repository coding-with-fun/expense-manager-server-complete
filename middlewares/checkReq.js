/**
 * @author Coderc
 * @description Request validation.
 */

const { check, validationResult } = require("express-validator");

/**
 * @description Defining check conditions.
 */
const checks = {
    // For Sign In and Sign Up
    checkName: check("name").not().isEmpty().withMessage("Name is required"),
};

/**
 * @description Defining SignUp check.
 */
const SignUpCheck = () => {
    checks.checkName;
};

/**
 * @description Checking for errors.
 * @param req
 * @param res
 * @param next
 * @returns Array of errors
 */
const returnError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: {
                message: errors.array()[0].msg,
            },
        });
    }
    next();
};

module.exports = userValidator = {
    validateSignUp: [SignUpCheck(), returnError],
};
