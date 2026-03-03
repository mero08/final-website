# Portfolio (Front-end + Back-end)

This project serves your portfolio front‑end from `THE END/` and adds a Node.js back‑end API that is compatible with both a standalone server and Vercel serverless functions.

- `POST /api/contact` sends contact form messages to your email
- A tiny SQLite database (`data.sqlite`) is used for logging when the server has write access (note that Vercel’s file system is ephemeral)

## Setup

1. Install Node.js (LTS).

2. Install dependencies:

```bash
npm install
```

3. Create your `.env` (for local development) or set the same values in Vercel’s Environment Variables section:

- Copy `.env.example` to `.env` (only for local use)
- Set `CONTACT_TO_EMAIL` to the email address where you want to receive messages
- Optionally set `CONTACT_FROM_EMAIL` if you need a from address different from your SMTP/Gmail user
- Configure **either** SMTP (`SMTP_*`) **or** Gmail (`GMAIL_*`)

4. Run locally (optional):

```bash
npm run dev   # starts express server on PORT or 3000
```

Open `http://localhost:3000` to verify.

Deployment to Vercel is automatic once you push to a git repo connected to your Vercel project. Static files in `THE END/` are served by Vercel, and the `/api` endpoints are handled by the same code as serverless functions (no need to start a listening server yourself).

## Notes

- The contact form in `THE END/index.js` uses a relative URL (`/api/contact`) so it works both in development and when deployed to any host (including Vercel).
- If you load `THE END/index.html` directly from the file system (file://) the API won’t be available; the front end must be served over HTTP by a server or the Vercel CDN.
