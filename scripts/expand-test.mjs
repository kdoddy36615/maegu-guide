/**
 * Regression test: expands every ability ledger row on both Abilities pages
 * and fails on any pageerror (e.g. malformed cancel-entry assumptions).
 * Usage: node scripts/expand-test.mjs [baseUrl]
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:5173";

const candidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const executablePath = candidates.find((p) => existsSync(p));

const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1400 });
const errors = [];
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

for (const mode of ["pve", "pvp"]) {
  await page.goto(`${base}/#/${mode}/abilities`, { waitUntil: "networkidle0" });
  const count = await page.$$eval("button.lrow", (els) => els.length);
  for (let i = 0; i < count; i++) {
    // Click via the DOM so a crashed (unmounted) tree can't detach our handles.
    await page.evaluate((idx) => {
      document.querySelectorAll("button.lrow")[idx]?.click();
    }, i);
  }
  const expanded = await page.$$eval(".lexp", (els) => els.length);
  if (expanded !== count) {
    errors.push(`${mode}: ${expanded}/${count} rows expanded — a row crashed the tree`);
  }
  console.log(`${mode}: expanded ${expanded}/${count} rows`);
}

await browser.close();
if (errors.length) {
  console.error("FAILURES:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("Expand test OK — every ability row expands without errors.");
