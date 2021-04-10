/**
 * @author Coderc
 * @description Index router for Expense Manager.
 */

const express = require("express");
const { userDetails } = require("../../controllers/expense-manager/user");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

/**
 * @type        GET
 * @route       /expense-manager/user
 * @description Get user details Route.
 * @access      Private
 */
router.get("/", authenticateToken(), userDetails);

module.exports = router;
