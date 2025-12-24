import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    console.log("Contact Controller: Received request from", email);

    // FIX V7: Force Port 587 with explicit TLS requirement.
    // Enable logger/debug to see SMTP handshake details in Render Console.

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Must be false for 587
      requireTLS: true, // Force STARTTLS
      logger: true, // Log SMTP exchanges
      debug: true, // detailed debug output
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Log config summary (masked)
    console.log("DEBUG EMAIL CONFIG (V7):", {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      user: process.env.EMAIL_USER ? "SET" : "MISSING",
      pass: process.env.EMAIL_PASS ? "SET" : "MISSING",
    });

    const mailOptions = {
      from: `"Monexa Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Message from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("EMAIL ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
};
