const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("📨 Contact form submitted:", { name, email, message });

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Message",
      text: `${name} (${email}) says: ${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

module.exports = router;
