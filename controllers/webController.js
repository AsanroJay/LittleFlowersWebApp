const nodemailer = require('nodemailer');

exports.handleContactSubmission = async (req, res) => {
  try {
    const { name, email, phone, inquiry } = req.body;

    // Validate fields
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !inquiry?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose message
    const mailOptions = {
      from: `"Little Flowers Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Inquiry:</b><br>${inquiry.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="font-size: 12px; color: #777;">This message was sent from the Little Flowers Website contact form.</p>
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "✅ Your message has been sent successfully!" });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
  }
};
