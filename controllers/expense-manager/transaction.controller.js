/**
 * @author @harsh-coderc
 * @description Transaction controller for Expense Manager.
 */

/**
 *  @description Importing internal dependencies.
 */
const logger = require("../../config/logger");
const { User, Transaction } = require("../../models");

/**
 * @type        GET
 * @route       /expense-manager/transaction
 * @description Fetch User's Transactions route.
 * @access      Private
 */
exports.getTransactions = async (req, res) => {
    try {
        const userID = req.auth;

        /**
         * @description Checking if user and user's transaction exists with given user ID.
         */
        const user = await User.findById(userID).populate(
            "transactionsList",
            "_id title description category amount date"
        );
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }
        if (!user.transactionsList) {
            return res.status(200).json({
                message: "No transaction found.",
            });
        }

        /**
         * @description Returning user's transactions.
         */
        return res.status(200).json({
            message: "User transactions fetched successfully.",
            transactionsList: user.transactionsList,
        });
    } catch (error) {
        logger.error(`${error.message}`);
        return res.status(500).json({
            message: "Internal server error...",
        });
    }
};

/**
 * @type        POST
 * @route       /expense-manager/transaction/insert
 * @description Add new transaction.
 * @access      Private
 */
exports.insertTransaction = async (req, res) => {
    try {
        /**
         * @description Creating new transaction.
         */
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();

        /**
         * @description Pushing new transaction's ID to user given in user ID,
         *              checking if user exists.
         */
        const userID = req.auth;
        const options = {
            new: true,
        }; // Returns updated value.
        const user = await User.findByIdAndUpdate(
            userID,
            {
                $push: {
                    transactionsList: newTransaction._id,
                },
            },
            options
        )
            .populate(
                "transactionsList",
                "_id title description category amount date"
            )
            .select({
                encryptedPassword: 0,
                salt: 0,
            });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        /**
         * @description Returning user details.
         */
        return res.status(200).json({
            message: "Transaction added successfully.",
            user,
        });
    } catch (error) {
        logger.error(`${error.message}`);
        return res.status(500).json({
            message: "Internal server error...",
        });
    }
};

/**
 * @type        DELETE
 * @route       /expense-manager/transaction/delete
 * @description Delete transaction.
 * @access      Private
 */
exports.deleteTransaction = async (req, res) => {
    try {
        /**
         * @description Checking if transaction ID is present
         *              and deleting transaction passed in query
         *              and checking if transaction exists.
         */
        const transactionID = req.query.id;
        if (!transactionID) {
            return res.status(400).json({
                error: {
                    message: "Transaction ID is not present.",
                },
            });
        }
        const deletedTransaction = await Transaction.findByIdAndDelete(
            transactionID
        );
        if (!deletedTransaction) {
            return res.status(404).json({
                error: {
                    message: "Item is not present.",
                },
            });
        }

        /**
         * @description Popping transaction's ID to user given in user ID,
         *              checking if user exists.
         */
        const userID = req.auth;
        const user = await User.findByIdAndUpdate(userID, {
            $pull: {
                transactionList: transactionID,
            },
        }).populate(
            "transactionList",
            "_id title description category amount date"
        );
        if (!user) {
            return res.status(404).json({
                error: {
                    message: "User not found.",
                },
            });
        }

        /**
         * @description Returning user's transactions.
         */
        return res.status(200).json({
            success: {
                message: "Transaction deleted successfully.",
                transactionList: user.transactionList,
            },
        });
    } catch (error) {
        logger.error(`${error.message}`);
        return res.status(500).json({
            message: "Internal server error...",
        });
    }
};
