const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: config.email.username,
        pass: config.email.appPassword
    }
});

module.exports = transporter;
