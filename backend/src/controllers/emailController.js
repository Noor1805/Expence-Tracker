import axios from "axios";

export const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Credentials from Env (Moved from Frontend)
  const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "service_w08x5id";
  const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "template_pw72a1g";
  const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "N2N3v2w9YWxYCFG85";
  const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; // Optional: For higher security if enabled in dashboard

  try {
    const payload = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        name: name,
        email: email, // Reply-to
        from_email: email, // From Email
        message: message,
        to_name: "Admin",
      },
    };

    // If you enable "Private Key" security in EmailJS, you must pass accessToken
    if (PRIVATE_KEY) {
      payload.accessToken = PRIVATE_KEY;
    }

    // Call EmailJS REST API from Backend (Hidden from user)
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", payload);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error(
      "EmailJS Backend Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to send email via secure relay.",
    });
  }
};
