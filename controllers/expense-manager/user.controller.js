/**
 * @author Coderc
 * @description User controller.
 */

const logger = require("../../config/logger");
const { User } = require("../../models");

/**
 * @type        GET
 * @route       /api/user
 * @description Fetch User's Details controller.
 * @access      Private
 */
exports.userDetails = async (req, res) => {
    try {
        const userID = req.auth;
        const user = await User.findOne({
            _id: userID,
        })
            .populate(
                "transactionList",
                "_id title description category amount date"
            )
            .select({ encryptedPassword: 0, salt: 0 });

        /**
         * @description Return error if no user is present by given ID.
         */ if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

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
