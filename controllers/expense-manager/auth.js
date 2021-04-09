/**
 * @author Coderc
 * @description Authentication controller.
 */

const jwt = require("jsonwebtoken");

const logger = require("../../config/logger");
const sendEmail = require("../../config/nodemailer");
const User = require("../../models/expense-manager/User");

/**
 * @type        POST
 * @route       /expense-manager/auth/signup
 * @description Sign Up Route.
 * @access      Public
 */
exports.signup = async (req, res) => {
    try {
        /**
         * @description Check if user exists with given username.
         * @param username
         * @param email
         */
        const username = req.body.username;
        const email = req.body.email;
        const existingUser = await User.findOne({
            $or: [
                {
                    email: email,
                },
                {
                    username: username,
                },
            ],
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists.",
            });
        }

        /**
         * @description Create new user and save it.
         * @param Request Body
         */
        let user = new User(req.body);
        await user.save();

        user = user.toJSON();
        delete user.salt;
        delete user.encryptedPassword;

        /**
         * @description Generate token using jsonwebtoken package.
         *              Set token to cookie.
         *              Return the user details with token.
         * @param User ID
         * @param A string as salt
         */
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.SECRET,
            {
                expiresIn: "0.5hr",
            }
        );

        const emailSubject = "Please confirm your account.";
        const emailText = `To confirm your account please click on this link, ${process.env.SERVER_URL}/confirm-account?token=${token}`;
        sendEmail(user.email, emailSubject, emailText);
        return res.json({
            message: "User created successfully.",
        });
    } catch (error) {
        logger.error(`${error.message}`);
        return res.status(500).json({
            message: "Internal server error...",
        });
    }
};
