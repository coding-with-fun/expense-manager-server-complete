/**
 * @author Coderc
 * @description Index router for Expense Manager.
 */

const express = require("express");
const { signup } = require("../../controllers/expense-manager/auth");
const { validateSignUp } = require("../../middleware/checkReq");

const router = express.Router();

/**
 * @type        GET
 * @route       /expense-manager/auth/signup
 * @description Sign Up Route.
 * @access      Public
 */
router.post("/signup", validateSignUp, signup);

module.exports = router;
