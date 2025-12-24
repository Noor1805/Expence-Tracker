import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  // 1. Validation
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    console.log("📨 Contact Form Initiated by:", email);

    // 2. Transporter Configuration (Standard Gmail w/ STARTTLS)
    // using Port 587 is the most reliable method for Cloud Hosting (Render/AWS)
    // as Port 465 is frequently blocked.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // false = uses STARTTLS (Upgrade to SSL), which bypasses timeouts
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Helps avoid some strict SSL errors on shared hosting
      },
    });

    // 3. Verify Connection (Optional but good for debugging)
    await transporter.verify();
    console.log("✅ SMTP Connection Established");

    // 4. Email Content
    const mailOptions = {
      from: `"Monexa Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email, // Reply to the user
      subject: `New Message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #F97316;">New Contact Submission</h2>
          <p>You have received a new message via Monexa.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${message}
          </div>
        </div>
      `,
    };

    // 5. Send Email
    await transporter.sendMail(mailOptions);
    console.log("🚀 Email Sent Successfully");

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("❌ Email Error:", error);

    // Return specific error to help usage
    const errorMessage = error.message.includes("ETIMEDOUT")
      ? "Server Connection Timeout (Port Blocked)"
      : error.message || "Failed to send email";

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
