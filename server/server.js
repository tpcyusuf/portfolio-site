console.log("SERVER DOSYASI ÇALIŞTI");

require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- 1. Önce Statik Dosyalar (CSS, JS, Resimler) ---
// Bu satır her zaman rotalardan yukarıda olmalı
app.use(express.static(path.join(__dirname, "..", "public")));

/* ================= MAIL AYARI ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Burası 'Uygulama Şifresi' olmalı
  },
});

/* ================= ROTALAR ================= */

// Mail Gönderme
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

// Test Endpoint
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

// --- 2. EN SONDA: Tüm sayfaları index.html'e yönlendir ---
// (Bu satır tüm API rotalarının altında olmalı)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

/* ================= SERVER BAŞLATMA ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server çalışıyor → Port: ${PORT}`);
});