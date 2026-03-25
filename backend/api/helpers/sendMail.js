const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - email body html
 */
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"E-Commerce Store" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`[MAIL SENT] To: ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[MAIL ERROR] Failed to send to ${to}:`, err.message);
    throw err;
  }
};

module.exports = sendMail;
