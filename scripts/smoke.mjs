/**
 * Smoke test: loads every route of the dev server in headless Edge/Chrome,
 * fails on console errors / pageerrors, and saves screenshots to .screenshots/.
 * Usage: node scripts/smoke.mjs [baseUrl]   (default http://localhost:5173)
 */
import { mkdirSync, existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:5173";
const routes = [
  ["study-pve", "/#/study/pve"],
  ["study-aos", "/#/study/aos"],
  ["setup", "/#/study/setup"],
  ["combos", "/#/study/combos"],
  ["practice-pve", "/#/practice/pve"],
  ["practice-aos", "/#/practice/aos"],
];

const candidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) throw new Error("No Chrome/Edge found");

mkdirSync(".screenshots", { recursive: true });

const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1400 });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console error: ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
page.on("response", (res) => {
  if (res.status() >= 400) errors.push(`HTTP ${res.status()}: ${res.url()}`);
});

for (const [name, route] of routes) {
  await page.goto(base + route, { waitUntil: "networkidle0" });
  const text = await page.evaluate(() => document.body.innerText.length);
  if (text < 200) errors.push(`${name}: page looks empty (${text} chars)`);
  await page.screenshot({ path: `.screenshots/${name}.png`, fullPage: false });
  console.log(`${name}: ${text} chars of text`);
}

await browser.close();
if (errors.length) {
  console.error("FAILURES:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("Smoke test OK — all routes render without console errors.");
