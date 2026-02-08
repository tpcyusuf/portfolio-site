console.log("SERVER DOSYASI ÇALIŞTI");

require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../public"));

/* ================= MAIL AYARI ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP
  port: 465,
  secure: true,           // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  family: 4, // ⚡ Render için IPv4 zorlaması
});

/* ================= MAIL GÖNDERME ================= */

app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Tüm alanlar doldurulmalı ❌" });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Portfolio İletişim Formu",
      text: `İsim: ${name}\nEmail: ${email}\nMesaj: ${message}`,
      html: `<p><strong>İsim:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mesaj:</strong> ${message}</p>`,
    });

    res.json({ message: "Mesaj başarıyla gönderildi ✅" });
  } catch (err) {
    console.error("MAIL HATASI:", err);
    res.status(500).json({ message: "Mail gönderilemedi ❌", details: err.message });
  }
});

/* ================= TEST ENDPOINT ================= */

app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "TEST MAIL",
      text: "Mail sistemi çalışıyor 🚀",
    });

    res.send("Mail gönderildi ✅");
  } catch (err) {
    console.log(err);
    res.send("HATA ❌");
  }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor → http://localhost:${PORT}`);
});
