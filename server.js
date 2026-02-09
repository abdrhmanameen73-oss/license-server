const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

/* =========================
   Load Private Key
========================= */
const PRIVATE_KEY = process.env.PRIVATE_KEY
  ? process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
  : null;

console.log("PRIVATE KEY LOADED:", PRIVATE_KEY ? "YES" : "NO");

/* =========================
   Temporary License Store
   (هتستبدله بقاعدة بيانات بعدين)
========================= */
const licenses = {
  "TEST-123": {
    active: true,
    expiresAt: "2026-12-31"
  }
};

/* =========================
   Validate Endpoint
========================= */
app.post("/validate", (req, res) => {
  const { licenseKey, instanceId } = req.body;

  if (!PRIVATE_KEY) {
    return res.status(500).json({ error: "Private key not loaded" });
  }

  const license = licenses[licenseKey];

  if (!license || !license.active) {
    return res.status(401).json({ error: "Invalid license" });
  }

  // تحقق من تاريخ الانتهاء
  if (new Date(license.expiresAt) < new Date()) {
    return res.status(403).json({ error: "License expired" });
  }

  // إصدار JWT صالح 24 ساعة
  const token = jwt.sign(
    {
      status: "active",
      licenseKey,
      instanceId
    },
    PRIVATE_KEY,
    {
      algorithm: "RS256",
      expiresIn: "24h"
    }
  );

  res.json({ token });
});

/* =========================
   Health Check
========================= */
app.get("/", (req, res) => {
  res.send("License Server Running");
});

/* =========================
   Start Server
========================= */
app.listen(process.env.PORT || 3000, () => {
  console.log("License server running");
});
