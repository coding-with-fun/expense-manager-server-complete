/**
 * @author @harsh-coderc
 * @description Request validation.
 */

/**
 * @description Importing package dependencies.
 */
const { check, validationResult, oneOf } = require("express-validator");
const moment = require("moment");

/**
 * @description Defining check conditions.
 */
const checks = {
    // For Sign In and Sign Up
    checkName: check("name")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Name is required."),
    checkUserName: check("username")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Username must be at least 5 characters long."),
    checkEmail: check("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email."),
    checkPassword: check("password")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long."),
    checkConfirmPassword: check("confirmPassword")
        .trim()
        .isLength({ min: 5 })
        .withMessage(
            "Confirmation password must be at least 5 characters long."
        )
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords does not match.");
            }
            return true;
        }),

    // For Transactions
    checkTitle: check("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required."),
    checkDescription: check("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),
    checkAmount: check("amount")
        .trim()
        .notEmpty()
        .withMessage("Amount is required.")
        .isDecimal()
        .withMessage("Please enter a valid Amount."),
    checkDate: check("date")
        .trim()
        .notEmpty()
        .withMessage("Date is required.")
        .custom((value) => {
            if (!moment.unix(value).isValid() || value.length !== 10) {
                throw new Error("Please enter a valid date.");
            }
            return true;
        }),
    checkCategory: check("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required.")
        .custom((value) => {
            if (!["income", "expense"].includes(value)) {
                throw new Error("Please enter a valid category.");
            }
            return true;
        }),
};

/**
 * @description Defining SignUp check.
 */
const signUpCheckReq = () => [
    checks.checkUserName,
    checks.checkEmail,
    checks.checkPassword,
    checks.checkConfirmPassword,
];

/**
 * @description Defining SignIn check.
 */
const signInCheckReq = () => [
    oneOf([checks.checkUserName, checks.checkEmail]),
    checks.checkPassword,
];

/**
 * @description Defining Transactions check.
 */
const transactionsCheckReq = () => [
    checks.checkTitle,
    checks.checkDescription,
    checks.checkAmount,
    checks.checkDate,
    checks.checkCategory,
];

/**
 * @description Checking for errors.
 * @returns Array of errors
 */
const returnErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }
    next();
};

module.exports = {
    validateSignUp: [signUpCheckReq(), returnErrors],
    validateSignIn: [signInCheckReq(), returnErrors],
    validateTransaction: [transactionsCheckReq(), returnErrors],
};
