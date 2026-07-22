import { writeFile } from "node:fs/promises";

const config = {
  apiUrl: process.env.API_URL || "http://localhost:8000/api/v1",
  recaptchaSiteKey:
    process.env.RECAPTCHA_SITE_KEY || "6Lcam_srAAAAAOxgfnoik-nEGZqvWc8A1NtupfG9",
};

if (!config.recaptchaSiteKey) {
  throw new Error("RECAPTCHA_SITE_KEY must be configured");
}

const contents = `window.APP_CONFIG = Object.freeze(${JSON.stringify(config, null, 2)});\n`;
await writeFile(new URL("../js/config.js", import.meta.url), contents, "utf8");
