// const nodemailer = require("nodemailer");

// const sendOTPEmail = async (email, otp) => {
//   try {
//     // Create transporter
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com", // Use Gmail's SMTP server
//         port: 587, // Or 465 for SSL
//         secure: false, // Set to true for 465 port
//         auth: {
//           user: process.env.EMAIL_USER, // Your email address
//           pass: process.env.EMAIL_PASS, // Your app password
//         },
//       });
      

//     // Email content
//     const mailOptions = {
//       from: `"Notes App" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP for Registration",
//       html: `<p>Your OTP for verification is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
//     };

//     // Send mail
//     await transporter.sendMail(mailOptions);
//     console.log("OTP email sent to:", email);
//   } catch (error) {
//     console.error("Error sending OTP email:", error);
//     throw new Error("Failed to send OTP email");
//   }
// };

// module.exports = sendOTPEmail;
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOTPEmail = async (email, otp) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Easier than host+port
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // App password (16 chars, no spaces)
      },
    });

    // Email content
    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration",
      html: `<p>Your OTP for verification is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = sendOTPEmail;
