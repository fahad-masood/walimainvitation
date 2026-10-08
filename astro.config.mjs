import { defineConfig } from "astro/config";

// A real host URL is supplied at deployment; never invent an invitation URL.
const host =
  process.env.SITE_URL ||
  process.env.URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
const site = host ? new URL(host).origin : undefined;

export default defineConfig({
  site,
  output: "static",
  build: { format: "directory", inlineStylesheets: "never" },
  vite: { build: { assetsInlineLimit: 0 } },
});
