import nodemailer from "nodemailer";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export async function getTransport() {
  // Option A (recommended): SMTP credentials
  // SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
  if (process.env.SMTP_HOST) {
    const host = requireEnv("SMTP_HOST");
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = String(process.env.SMTP_SECURE || "false") === "true";
    const user = requireEnv("SMTP_USER");
    const pass = requireEnv("SMTP_PASS");

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  // Option B: Gmail using an "App Password" (not your normal password)
  // GMAIL_USER, GMAIL_APP_PASSWORD
  if (process.env.GMAIL_USER) {
    const user = requireEnv("GMAIL_USER");
    const pass = requireEnv("GMAIL_APP_PASSWORD");
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  // No credentials provided; fall back to an ethereal test account for dev
  // This allows the contact endpoint to be exercised locally without real
  // SMTP settings.  Messages will be stored by nodemailer and a preview URL
  // printed to the console.  For production (e.g. Vercel) you should always
  // supply a real transport via env vars.
  const testAccount = await nodemailer.createTestAccount();
  console.log("Using ethereal test account:", testAccount);
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

export function getMailDefaults() {
  const to = requireEnv("CONTACT_TO_EMAIL");
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    process.env.SMTP_USER ||
    process.env.GMAIL_USER ||
    to;
  return { to, from };
}
