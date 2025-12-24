import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import emailjs from "@emailjs/browser"; // Import EmailJS library

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // EmailJS Configuration (Public Client-Side Keys)
    const serviceId = "service_w08x5id";
    const templateId = "template_pw72a1g";
    const publicKey = "N2N3v2w9YWxYCFG85";

    // Matching template variables to form data
    const templateParams = {
      // Keys must match variables in your EmailJS Template
      name: `${form.firstName} ${form.lastName}`, // Matches {{name}}
      email: form.email, // Matches {{email}} (Reply To)
      from_email: form.email, // Matches {{from_email}}
      message: form.message,
      to_name: "Admin",
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      alert("Message sent successfully! 🚀");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-24"
    >
      <div className="w-full max-w-4xl">
        <div className="text-center mb-14">
          <span className="px-4 audiowide-regular py-1 rounded-full text-sm bg-white/5 border border-white/10">
            Contact
          </span>
          <h1 className="text-4xl audiowide-regular md:text-5xl font-bold mt-4">
            Get in <span className="text-orange-500">Touch</span> with Us
          </h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Have questions about Monexa or need help managing your finances?
            Fill the form and we’ll get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#0F0F0F] border border-orange-500/20 rounded-2xl p-6 flex gap-4">
            <Mail className="text-orange-500" />
            <div>
              <h3 className="font-semibold">Email Us</h3>
              <p className="text-gray-400 text-sm">kashafnoor346@gmail.com</p>
            </div>
          </div>

          <div className="bg-[#0F0F0F] border border-orange-500/20 rounded-2xl p-6 flex gap-4">
            <MessageSquare className="text-orange-500" />
            <div>
              <h3 className="font-semibold">Fast Support</h3>
              <p className="text-gray-400 text-sm">
                We usually reply within 24 hours
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="input"
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="input"
              required
            />
          </div>

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
            className="input mt-6"
            required
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={5}
            className="input mt-6 resize-none"
            required
          />

          <button
            disabled={loading}
            className={`mt-8 w-full py-3 rounded-xl font-semibold transition
              ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-black hover:bg-orange-400"
              }`}
          >
            {loading ? "Sending Message..." : "Submit Form"}
          </button>
        </form>
      </div>
    </section>
  );
}
