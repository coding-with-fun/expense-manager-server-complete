/**
 * @author Coderc
 * @description Index router for Expense Manager.
 */

const express = require("express");
const { signup, signin, confirmAccount } = require("../../controllers");
const { authenticateToken } = require("../../middleware/auth");
const { validateSignUp, validateSignIn } = require("../../middleware/checkReq");

const router = express.Router();

/**
 * @type        GET
 * @route       /expense-manager/auth/signup
 * @description Sign Up Route.
 * @access      Public
 */
router.post("/signup", validateSignUp, signup);
router.post("/signin", validateSignIn, signin);
router.post("/confirm-account", authenticateToken(), confirmAccount);

module.exports = router;