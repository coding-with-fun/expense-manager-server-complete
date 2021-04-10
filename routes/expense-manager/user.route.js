/**
 * @author @harsh-coderc
 * @description User router for Expense Manager.
 */

/**
 * @description Importing package dependencies.
 */
const express = require("express");

/**
 *  @description Importing internal dependencies.
 */
const { userDetails } = require("../../controllers");
const { authenticateToken } = require("../../middleware/auth");

/**
 *  @description Defining variables.
 */
const router = express.Router();

/**
 * @type        GET
 * @route       /expense-manager/user
 * @description Get user details Route.
 * @access      Private
 */
router.get("/", authenticateToken(), userDetails);

module.exports = router;
