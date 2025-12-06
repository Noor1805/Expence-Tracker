import transporter from "../config/emailConfig.js";

export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return info;

  } catch (err) {
    console.log("Email sending error:", err.message);
  }
}
