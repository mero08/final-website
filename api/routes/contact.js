import { z } from "zod";
import { getTransport, getMailDefaults } from "../lib/mailer.js";
import { dbRun } from "../lib/db.js";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(3000),
});

// tiny in-memory rate limit
const lastSentByIp = new Map();
const RATE_LIMIT_MS = Number(process.env.CONTACT_RATE_LIMIT_MS || 20_000);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation error",
    });
  }

  const ip =
    req.headers["x-forwarded-for"]?.toString()?.split(",")?.[0]?.trim() ||
    "unknown";

  const now = Date.now();
  const last = lastSentByIp.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    const retryAfterMs = RATE_LIMIT_MS - (now - last);
    res.setHeader("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
    return res.status(429).json({
      success: false,
      message: `Too many requests. Please wait ${Math.ceil(retryAfterMs / 1000)}s and try again.`,
      retryAfterMs,
    });
  }
  lastSentByIp.set(ip, now);

  const { name, phone, email, message } = parsed.data;
  const createdAt = new Date().toISOString();

  try {
    // build mail transport from shared helper
    const transport = await getTransport();
    const { to, from } = getMailDefaults();

    const subject = `New portfolio contact: ${name}`;
    const text = [
      `New message from your portfolio contact form`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Time: ${createdAt}`,
      `IP: ${ip}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    await transport.sendMail({
      to,
      from,
      subject,
      text,
      replyTo: email,
    });

    // optionally log the submission to the local SQLite database
    try {
      await dbRun(
        `INSERT INTO contact_messages (created_at, name, phone, email, message, ip, user_agent, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          createdAt,
          name,
          phone,
          email,
          message,
          ip,
          req.headers["user-agent"] || null,
          "sent",
        ],
      );
    } catch (err) {
      // logging failure shouldn't prevent sending response
      console.warn("Failed to log contact message:", err);
    }
    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (err) {
    console.error("Contact email failed:", err);

    const errMsg =
      err && typeof err === "object" && "message" in err
        ? String(err.message)
        : "";

    return res.status(500).json({
      success: false,
      message: errMsg
        ? `Email failed: ${errMsg}`
        : "Email failed. Check server logs.",
    });
  }
}
