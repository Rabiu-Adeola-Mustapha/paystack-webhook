require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendMail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_PASS, // Your Gmail password or App-specific password
    },
    defaults: {
      from: '"Paystack Webhook Registration Mail" tascom.app@gmail.com', // Make sure this domain is correctly configured
    },
  });

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", info.response);
    return info; // Return the info object in case you need it
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email");
  }
}

module.exports = {
  sendMail,
};
