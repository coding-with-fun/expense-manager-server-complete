/**
 * @author @harsh-coderc
 * @description Authentication controller for Expense Manager.
 */

/**
 * @description Importing package dependencies.
 */
const jwt = require("jsonwebtoken");

/**
 *  @description Importing internal dependencies.
 */
const logger = require("../../config/logger");
const sendEmail = require("../../config/nodemailer");
const { User } = require("../../models");

/**
 * @description Defining options to set cookies in response.
 */
const resCookieOptions =
    process.env.ENV === "DEV"
        ? {
              maxAge: 999999999999999,
          }
        : {
              maxAge: 999999999999999,
              httpOnly: true,
              sameSite: "none",
              secure: true,
          };

/**
 * @description Sending confirmation email to given email address.
 * @param {string} emailAddress
 * @param {string} token
 */
const sendConfirmationEmail = (emailAddress, token) => {
    const emailSubject = "Please confirm your account.";
    const emailText =
        `<p>To confirm your account please click on this ` +
        `<a href="${process.env.CLIENT_URL}/auth/confirm-account?token=Bearer ${token}">` +
        `link` +
        `</a>` +
        `</p>`;

    sendEmail(emailAddress, emailSubject, emailText);
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
         * @description Checking if user exists with given email or username.
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
         * @description Creating new user with passed request body and save it.
         */
        let user = new User(req.body);
        await user.save();

        /**
         * @description Deleting salt and encrypted password from user object.
         */
        user = user.toJSON();
        delete user.salt;
        delete user.encryptedPassword;

        /**
         * @description Generating token using jsonwebtoken package with user ID.
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
         * @description Sending confirmation email to the given email address.
         */
        sendConfirmationEmail(user.email, token);
        return res.json({
            message:
                "User created successfully. Confirmation mail has been sent to your email address. Please validate your account.",
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
         * @description Checking if user exists with given email or username.
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
         * @description Checking if user is present with provided email address or username or
         *              if password is matched with database.
         */
        if (!user || !user.authenticate(password)) {
            return res.status(401).json({
                message: "Please check credentials.",
            });
        }

        /**
         * @description If user is not authenticated,
         *              sending confirmation email to given email address.
         */
        if (!user.isAuthenticated) {
            /**
             * @description Generating token using jsonwebtoken package with user ID.
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
             * @description Sending confirmation email to the given email address.
             */
            sendConfirmationEmail(user.email, token);
            return res.status(401).json({
                message:
                    "Confirmation mail has been sent to your email address. Please validate your account.",
            });
        }

        /**
         * @description Deleting salt and encrypted password from user object.
         */
        user = user.toJSON();
        delete user.salt;
        delete user.encryptedPassword;

        /**
         * @description Generating token using jsonwebtoken package.
         *              Setting token to cookie.
         *              Returning the user details with token.
         */
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.SECRET
        );
        res.cookie(
            "expense_manager_user_token",
            "Bearer " + token,
            resCookieOptions
        );
        return res.status(200).json({
            message: "User signed in successfully",
            token,
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
 * @type        PUT
 * @route       /expense-manager/auth/confirm-account
 * @description Account confirmation Route.
 * @access      Private
 */
exports.confirmAccount = async (req, res) => {
    try {
        const user = req.auth;

        /**
         * @description Checking if user exists with given user ID.
         * @returns
         *          - 401 -> User does not exist.
         *          - 404 -> User is already authenticated.
         */
        let existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(401).json({
                message: "User not found.",
            });
        }
        if (existingUser.isAuthenticated) {
            return res.status(404).json({
                message: "URL not found.",
            });
        }

        /**
         * @description Updating the user and returns user without salt and encrypted password.
         *              Setting isAuthenticated parameter to true.
         */
        const updateQuery = {
            isAuthenticated: true,
        };
        const options = {
            new: true,
        }; // Returns updated value.
        let updatedUser = await User.findByIdAndUpdate(
            user._id,
            updateQuery,
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
         * @description Generating token using jsonwebtoken package.
         *              Setting token to cookie.
         *              Returning the user details with token.
         */
        const token = jwt.sign(
            {
                _id: updatedUser._id,
            },
            process.env.SECRET
        );
        res.cookie(
            "expense_manager_user_token",
            "Bearer " + token,
            resCookieOptions
        );
        return res.status(200).json({
            message: "User authenticated successfully.",
            token,
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`${error.message}`);
        return res.status(500).json({
            message: "Internal server error...",
        });
    }
};
