/**
 * Drives the PvE drill end-to-end in headless Edge/Chrome: answers every step
 * (clicking the first option), verifies feedback + progress, finishes the run,
 * and checks the localStorage-backed stats line appears.
 * Usage: node scripts/drill-test.mjs [baseUrl]
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

await page.goto(`${base}/#/practice/pve`, { waitUntil: "networkidle0" });

const text = async (sel) => page.$eval(sel, (el) => el.innerText).catch(() => null);

for (let step = 0; step < 30; step++) {
  const progress = await text(".drill-progress");
  if (progress?.startsWith("Done")) break;
  await page.click(".drill-option"); // first option — right or wrong, flow must continue
  const feedback = await text(".drill-feedback");
  if (!feedback || feedback.trim().length === 0) {
    errors.push(`step ${step}: no feedback after answering`);
    break;
  }
  await page.click(".drill button.primary"); // "Next step"
}

const done = await text(".drill-progress");
if (!done?.startsWith("Done")) errors.push(`drill never finished: ${done}`);
const stats = await text(".drill-stats");
if (!stats?.includes("Attempts: 1")) errors.push(`stats line wrong: ${stats}`);

// restart should reset progress and keep stats
await page.click(".drill button.primary"); // "Run it again"
const restarted = await text(".drill-progress");
if (!restarted?.startsWith("Step 1")) errors.push(`restart failed: ${restarted}`);

console.log(`final: ${done} | stats: ${stats}`);
await page.screenshot({ path: ".screenshots/drill-finished.png" });
await browser.close();
if (errors.length) {
  console.error("FAILURES:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("Drill test OK.");
