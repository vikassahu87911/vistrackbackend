const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;