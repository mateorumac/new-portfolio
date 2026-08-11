import { preview } from "vite";
import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");

const routes = ["/en", "/hr", "/en/resume", "/hr/resume"];

function lastCommitDate(relativeFile) {
  try {
    const date = execFileSync(
      "git",
      ["log", "-1", "--format=%cd", "--date=short", "--", relativeFile],
      { cwd: rootDir, encoding: "utf8" }
    ).trim();
    return date || null;
  } catch {
    return null;
  }
}

async function updateSitemapLastmod() {
  const sitemapPath = path.join(distDir, "sitemap.xml");
  let xml;
  try {
    xml = await fs.readFile(sitemapPath, "utf8");
  } catch {
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const homeDate = lastCommitDate("src/pages/HomePage.jsx") ?? today;
  const resumeDate = lastCommitDate("src/pages/Resume.jsx") ?? today;

  const blocks = xml.split(/(?=<url>)/);
  const updated = blocks
    .map((block) => {
      if (!block.includes("<loc>")) return block;
      const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1] ?? "";
      const route = loc.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
      // Only the routes this build renders. Sub-apps deployed elsewhere
      // (/game/, /tools/) also live in this sitemap, and their lastmod has
      // nothing to do with a commit in this repo.
      if (!routes.includes(route)) return block;
      const date = route.endsWith("/resume") ? resumeDate : homeDate;
      return block.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${date}</lastmod>`);
    })
    .join("");

  await fs.writeFile(sitemapPath, updated, "utf8");
  console.log(`Updated sitemap.xml lastmod (home: ${homeDate}, resume: ${resumeDate})`);
}

async function writeNotFoundPage() {
  const indexPath = path.join(distDir, "index.html");
  const notFoundPath = path.join(distDir, "404.html");

  let html = await fs.readFile(indexPath, "utf8");

  // Cloudflare Pages returns a genuine HTTP 404 for unmatched paths only
  // when a top-level 404.html exists; without one it silently falls back
  // to serving index.html with 200. This file boots the same built SPA
  // (correct hashed asset tags for this build) so the app's own router
  // still renders the real, themed, localized <NotFound/> route once JS
  // runs — but its pre-JS, server-rendered <head> must not claim to be
  // the homepage. Strip the homepage's canonical/OG/Twitter identity and
  // JSON-LD, and swap in generic "not found" copy, so a crawler or social
  // scraper that never executes JS doesn't see homepage metadata on a
  // 404 response.
  const NOT_FOUND_TITLE = "Page not found | Mateo Rumac";
  const NOT_FOUND_DESC =
    "The page you're looking for doesn't exist or may have moved.";

  html = html
    .replace(/<title>.*?<\/title>/, `<title>${NOT_FOUND_TITLE}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${NOT_FOUND_DESC}" />`
    )
    .replace(/[ \t]*<link rel="canonical"[^>]*\/>\n?/, "")
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${NOT_FOUND_TITLE}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${NOT_FOUND_DESC}" />`
    )
    .replace(/[ \t]*<meta property="og:url"[^>]*\/>\n?/, "")
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${NOT_FOUND_TITLE}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${NOT_FOUND_DESC}" />`
    )
    .replace(
      '<meta name="robots" content="index, follow" />',
      '<meta name="robots" content="noindex, follow" />'
    )
    .replace(
      /[ \t]*<!-- JSON-LD: Person \+ Website \+ projects -->\n?/,
      ""
    )
    .replace(
      /[ \t]*<script type="application\/ld\+json" id="ld-json-main">[\s\S]*?<\/script>\n?/,
      ""
    );

  await fs.writeFile(notFoundPath, html, "utf8");
  console.log(
    "Wrote dist/404.html (standalone 404 shell: own title/description, no homepage canonical/OG/JSON-LD, noindex)"
  );
}

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: true } });
  const base = `http://localhost:4173`;

  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      await page.goto(`${base}${route}`, { waitUntil: "networkidle0" });

      const html = await page.evaluate(() => {
        // eslint-disable-next-line no-undef -- runs in browser context via Puppeteer
        return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
      });

      const outDir = path.join(distDir, route);
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");

      console.log(`Prerendered ${route} -> dist${route}/index.html`);
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }

  await updateSitemapLastmod();
  await writeNotFoundPage();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
