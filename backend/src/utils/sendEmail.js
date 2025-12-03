import nodemailer from "nodemailer";

export async function sendEmail({to, subject, text, html}) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }

        });
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