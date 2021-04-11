/**
 * @author @harsh-coderc
 * @description Authentication router for Expense Manager.
 */

/**
 * @description Importing package dependencies.
 */
const express = require("express");

/**
 *  @description Importing internal dependencies.
 */
const { signup, signin, confirmAccount } = require("../../controllers");
const { authenticateToken } = require("../../middleware/auth");
const { validateSignUp, validateSignIn } = require("../../middleware/checkReq");

/**
 *  @description Defining variables.
 */
const router = express.Router();

/**
 * @type        POST
 * @route       /expense-manager/auth/signup
 * @description Sign Up Route.
 * @access      Public
 */
router.post("/signup", validateSignUp, signup);

/**
 * @type        POST
 * @route       /expense-manager/auth/signin
 * @description Sign In Route.
 * @access      Public
 */
router.post("/signin", validateSignIn, signin);

/**
 * @type        PUT
 * @route       /expense-manager/auth/confirm-account?token=:token
 * @description Account confirmation Route.
 * @access      Private
 */
router.put("/confirm-account", authenticateToken(), confirmAccount);

module.exports = router;
