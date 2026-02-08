console.log("SERVER DOSYASI ÇALIŞTI");

require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path"); // 1. Path modülünü ekledik

const app = express();

app.use(cors());
app.use(express.json());

// 2. Statik dosya yolunu Render/Linux uyumlu hale getirdik
app.use(express.static(path.join(__dirname, "..", "public")));

/* ================= MAIL AYARI ================= */

const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail için en kısa ve güvenli yol
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
      to: process.env.EMAIL_USER, // Kendi mailine gönderiyorsun
      subject: "Portfolio İletişim Formu",
      text: `İsim: ${name}\nEmail: ${email}\nMesaj: ${message}`,
      html: `<p><strong>İsim:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mesaj:</strong> ${message}</p>`,
    });

    res.json({ message: "Mesaj başarıyla gönderildi ✅" });
  } catch (err) {
    console.error("MAIL HATASI:", err);
    // Hata detayını frontend'e gönderiyoruz ki sorunu görebilelim
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
    console.error(err);
    res.status(500).send(`HATA ❌: ${err.message}`);
  }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor → http://localhost:${PORT}`);
});