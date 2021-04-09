/**
 * @author Coderc
 * @description Index router for Expense Manager.
 */

const express = require("express");
const { signup, signin } = require("../../controllers/expense-manager/auth");
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

module.exports = router;
