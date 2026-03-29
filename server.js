import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

import "dotenv/config";
// ─────────────────────────────────────────
//  EDIT THESE TWO LINES
// ─────────────────────────────────────────
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const SENDER_NAME = process.env.SENDER_NAME;
// ─────────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

// Status / health check
app.get("/status", async (req, res) => {
  try {
    await transporter.verify();
    res.json({ ok: true, email: GMAIL_USER });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Send email
app.post("/send", async (req, res) => {
  const { to, subject, body, attachment } = req.body;
  if (!to || !subject || !body) {
    return res
      .status(400)
      .json({ error: "to, subject, and body are required." });
  }
  try {
    const mailOptions = {
      from: `"${SENDER_NAME}" <${GMAIL_USER}>`,
      to,
      subject,
      text: body,
    };

    // Add attachment if provided
    if (attachment && attachment.data && attachment.filename) {
      mailOptions.attachments = [
        {
          filename: attachment.filename,
          content: Buffer.from(attachment.data, "base64"),
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Sent to ${to} — ${info.messageId}`);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(`✗ Failed to ${to} — ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("\n  HR Outreach — Backend Server");
  console.log(`  Running at  → http://localhost:${PORT}`);
  console.log(`  Sending as  → ${GMAIL_USER}`);
  console.log("\n  Frontend    → npm run dev  (in a separate terminal)\n");
});
