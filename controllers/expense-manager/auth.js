/**
 * @author Coderc
 * @description Authentication controller.
 */

const jwt = require("jsonwebtoken");

const logger = require("../../config/logger");
const sendEmail = require("../../config/nodemailer");
const User = require("../../models/expense-manager/User");

const options = {
    maxAge: 999999999999999,
    httpOnly: true,
    sameSite: "none",
    secure: true,
};

const sendConfirmationEmail = (token) => {
    /**
     * @description Send confirmation email to given email address.
     */
    const emailSubject = "Please confirm your account.";
    const emailText = `<p>To confirm your account please click on this <a href="${process.env.SERVER_URL}/auth/confirm-account?token=Bearer ${token}">link</a></p>`;
    sendEmail(user.email, emailSubject, emailText);
};

/**
 * @type        POST
 * @route       /expense-manager/auth/signup
 * @description Sign Up Route.
 * @access      Public
 */
exports.signup = async (req, res) => {
    try {
        const { username, email } = req.body;
        /**
         * @description Check if user exists with given username.
         * @param username
         * @param email
         * @param username
         */
        let existingUser = await User.findOne({
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

        /**
         * @description Send confirmation email to given email address.
         */
        sendConfirmationEmail(token);
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

/**
 * @type        POST
 * @route       /expense-manager/auth/signin
 * @description Sign In Route.
 * @access      Public
 */
exports.signin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        /**
         * @description Check if user exists with given username.
         * @param username
         * @param email
         */
        let user = await User.findOne({
            $or: [
                {
                    email: email,
                },
                {
                    username: username,
                },
            ],
        }).populate(
            "transactionList",
            "_id title description category amount date"
        );

        /**
         * @description Checks if user is present with provided username or email address or
         *              password if is matched with matched with database.
         */
        if (!user || !user.authenticate(password)) {
            return res.status(401).json({
                message: "Please check credentials.",
            });
        }

        if (!user.isAuthenticated) {
            /**
             * @description Generate token using jsonwebtoken package.
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

            /**
             * @description Send confirmation email to given email address.
             */
            sendConfirmationEmail(token);
            return res.status(401).json({
                message:
                    "Confirmation mail has been sent to your email address. Please validate your account.",
            });
        }

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
            process.env.SECRET
        );
        res.cookie("expense_manager_user_token", "Bearer " + token, options);

        return res.status(200).json({
            token,
            message: "User signed in successfully",
            user: user,
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
 * @route       /expense-manager/auth/confirm-account
 * @description Account confirmation Route.
 * @access      Public
 */
exports.confirmAccount = async (req, res) => {
    try {
        const user = req.auth;
        const options = {
            new: true,
        }; // Returns updated value.

        let existingUser = await User.findOne({
            _id: user._id,
        });

        if (existingUser.isAuthenticated) {
            return res.status(404).json({
                message: "URL not found.",
            });
        }

        let updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                isAuthenticated: true,
            },
            options
        )
            .populate(
                "transactionList",
                "_id title description category amount date"
            )
            .select({
                encryptedPassword: 0,
                salt: 0,
            });

        if (!updatedUser) {
            return res.status(401).json({
                message: "User not found.",
            });
        }

        /**
         * @description Generate token using jsonwebtoken package.
         *              Set token to cookie.
         *              Return the user details with token.
         * @param User ID
         * @param A string as salt
         */
        const token = jwt.sign(
            {
                _id: updatedUser._id,
            },
            process.env.SECRET
        );
        res.cookie("expense_manager_user_token", "Bearer " + token, options);

        return res.status(200).json({
            token,
            message: "User authenticated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`${error.message}`);
        return res.status(500).json({
            message: "Internal server error...",
        });
    }
};
