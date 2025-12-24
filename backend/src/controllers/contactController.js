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
    // Use environment variables if present, otherwise fallback to Gmail SSL (Port 465)
    // FIX: Default to Port 465 (SSL) if EMAIL_PORT is missing. This prevents ETIMEDOUT on Render.
    const transportHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const transportPort = process.env.EMAIL_PORT || 465;
    const transportSecure =
      process.env.EMAIL_SECURE === "true" || transportPort == 465;

    console.log("DEBUG EMAIL CONFIG:", {
      user: process.env.EMAIL_USER ? "SET" : "MISSING",
      pass: process.env.EMAIL_PASS ? "SET" : "MISSING",
      host: transportHost,
      port: transportPort,
      secure: transportSecure,
    });

    const transporter = nodemailer.createTransport({
      host: transportHost,
      port: transportPort,
      secure: transportSecure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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
