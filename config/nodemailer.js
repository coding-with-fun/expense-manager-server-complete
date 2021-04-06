const nodemailer = require("nodemailer");
const logger = require("./logger");

const sendEmail = async () => {
    nodemailer.createTestAccount(() => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.host,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.user,
                pass: process.env.password,
            },
            tls: {
                secureProtocol: "TLSv1_method",
            },
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: `"Coderc" ${process.env.user}`, // sender address
            to: "harshp2482@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world...", // plain text body
            html: "<b>Hello world?</b>", // html body
        };

        // send mail with defined transport object
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
