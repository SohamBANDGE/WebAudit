const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const LEADS_PATH = path.join(__dirname, "..", "data", "leads.json");

function readLeads() {
  try {
    return JSON.parse(fs.readFileSync(LEADS_PATH, "utf-8"));
  } catch (_) {
    return [];
  }
}

function writeLeads(leads) {
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2));
}

router.post("/", (req, res) => {
  const { name, email, message, scannedUrl } = req.body || {};

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: "Name and email are required." });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const lead = {
    id: Date.now().toString(36),
    name: name.trim(),
    email: email.trim(),
    message: (message || "").trim(),
    scannedUrl: scannedUrl || null,
    receivedAt: new Date().toISOString(),
  };

  const leads = readLeads();
  leads.push(lead);
  writeLeads(leads);

  // eslint-disable-next-line no-console
  console.log("New lead captured:", lead);

  return res.status(201).json({ ok: true });
});

module.exports = router;
