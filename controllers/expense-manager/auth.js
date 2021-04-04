/**
 * @type        GET
 * @route       /expense-manager/auth/signup
 * @description Sign Up Route.
 * @access      Public
 */
exports.signup = async (req, res) => {
    try {
        return res.json({
            message: "true",
        });
    } catch (error) {
        console.log(`${error.message}`.red);
        return res.status(500).json({
            error: {
                message: "Internal server error...",
            },
        });
    }
};
