/**
 * @author @harsh-coderc
 * @description Index controller.
 */

const {
    signup,
    signin,
    confirmAccount,
} = require("./expense-manager/auth.controller");
const { userDetails } = require("./expense-manager/user.controller");

module.exports = {
    signup,
    signin,
    confirmAccount,
    userDetails,
};
