import path from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import express from "express";
import helmet from "helmet";

import cors from "cors";

import { initDb } from "./lib/db.js";
import contactHandler from "./routes/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// if we are behind a proxy (Verdcel or other hosts) we trust `X-Forwarded-*` headers
if (process.env.TRUST_PROXY === "true" || process.env.VERCEL) {
  app.set("trust proxy", true);
}

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR =
  process.env.PUBLIC_DIR || path.resolve(__dirname, "..", "THE END"); // serve your existing frontend

// Security headers (safe defaults)
app.use(
  helmet({
    contentSecurityPolicy: false, // keep off for now because of external fonts + particles CDN
  }),
);

// Parse JSON for APIs
app.use(express.json({ limit: "250kb" }));

// optional blanket CORS, can be restricted with CORS_ORIGIN env var
const corsOptions = {};
if (process.env.CORS_ORIGIN) {
  corsOptions.origin = process.env.CORS_ORIGIN;
}
app.use(cors(corsOptions));

// Initialize DB (creates file + table if missing)
initDb();

const apiRouter = express.Router();
apiRouter.post("/contact", contactHandler);
// also keep health check under same router if desired
apiRouter.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", apiRouter);

// When running locally (not Vercel), serve the static frontend as before
if (!process.env.VERCEL) {
  app.use(express.static(PUBLIC_DIR));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
  });
}

// start the server when running outside of the Vercel infrastructure
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Serving frontend from: ${PUBLIC_DIR}`);
  });
}

// export for serverless environments (Vercel will invoke this as a handler)
export default app;

// allow changing the JSON body limit from vercel config if necessary
export const config = { api: { bodyParser: { sizeLimit: "250kb" } } };
