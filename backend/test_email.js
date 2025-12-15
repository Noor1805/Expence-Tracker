import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendTestEmail = async () => {
  console.log("Testing Nodemailer with credentials:");
  console.log("User:", process.env.EMAIL_USER);
  console.log("Pass exists:", !!process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Script",
      text: "If you see this, Nodemailer is working correctly!",
    });

    console.log("Email sent successfully!", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

sendTestEmail();
