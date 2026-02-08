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
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= MAIL GÖNDERME ================= */

app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Portfolio İletişim Formu",
      text: `İsim: ${name}\nEmail: ${email}\nMesaj: ${message}`,
    });

    res.json({ message: "Mesaj başarıyla gönderildi ✅" });
  } catch (err) {
    console.log("MAIL HATASI:", err);
    res.status(500).json({ message: "Mail gönderilemedi ❌" });
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

app.listen(5000, () => {
  console.log("Server çalışıyor → http://localhost:5000");
});
