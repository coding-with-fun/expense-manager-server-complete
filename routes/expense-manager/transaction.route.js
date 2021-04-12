/**
 * @author @harsh-coderc
 * @description Transaction router for Expense Manager.
 */

/**
 * @description Importing package dependencies.
 */
const express = require("express");
const {
    getTransactions,
    insertTransaction,
    deleteTransaction,
} = require("../../controllers");
const { authenticateToken } = require("../../middleware/auth");
const { validateTransaction } = require("../../middleware/checkReq");

/**
 *  @description Defining variables.
 */
const router = express.Router();

/**
 * @type        GET
 * @route       /expense-manager/transaction
 * @description Fetch User's Transactions route.
 * @access      Private
 */
router.get("/", authenticateToken(), getTransactions);

/**
 * @type        POST
 * @route       /expense-manager/transaction/insert
 * @description Add new transaction.
 * @access      Private
 */
router.post(
    "/insert",
    authenticateToken(),
    validateTransaction,
    insertTransaction
);

/**
 * @type        DELETE
 * @route       /expense-manager/transaction/delete
 * @description Delete transaction.
 * @access      Private
 */
router.delete("/delete", authenticateToken(), deleteTransaction);

module.exports = router;
