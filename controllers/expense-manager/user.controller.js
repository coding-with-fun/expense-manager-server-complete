/**
 * @author @harsh-coderc
 * @description User controller for Expense Manager.
 */

/**
 *  @description Importing internal dependencies.
 */
const logger = require("../../config/logger");
const { User } = require("../../models");

/**
 * @type        GET
 * @route       /expense-manager/user
 * @description Fetch User's Details route.
 * @access      Private
 */
exports.userDetails = async (req, res) => {
    try {
        const userID = req.auth;

        /**
         * @description Checking if user exists with given user ID
         *              and returns user without salt and encrypted password.
         */
        const user = await User.findById(userID)
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
         * @description Returning the user details.
         */
        return res.status(200).json({
            message: "User details fetched successfully.",
            user,
        });
    } catch (error) {
        logger.error(`${error.message}`);
        return res.status(500).json({
            message: "Internal server error...",
        });
    }
};
