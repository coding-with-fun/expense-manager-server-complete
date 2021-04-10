/**
 * @author @harsh-coderc
 * @description Nodemailer configuration to send email.
 */

/**
 * @description Importing package dependencies.
 */
const nodemailer = require("nodemailer");

/**
 *  @description Importing internal dependencies.
 */
const logger = require("./logger");

const sendEmail = async (to, subject, text) => {
    nodemailer.createTestAccount(() => {
        /**
         * @description Creating reusable transporter object using the default SMTP transport.
         */
        let transporter = nodemailer.createTransport({
            host: process.env.host,
            port: 587,
            secure: false, // true for 465, false for other ports.
            auth: {
                user: process.env.user,
                pass: process.env.password,
            },
            tls: {
                secureProtocol: "TLSv1_method",
            },
        });

        /**
         * @description Setting up email data.
         */
        let mailOptions = {
            from: `"Coderc" ${process.env.user}`, // Sender address
            to: to, // List of receivers
            subject: subject, // Subject line
            text: text, // Plain text body
            html: text, // HTML body
        };

        /**
         * @description Sending email with defined transport object.
         */
        transporter.sendMail(mailOptions, (error) => {
            try {
                if (error) {
                    throw error;
                } else {
                    logger.info("Message sent successfully.");
                }
            } catch (error) {
                logger.error("Failed to send message!!");
            }
        });
    });
};

module.exports = sendEmail;
