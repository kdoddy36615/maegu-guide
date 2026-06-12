/**
 * Full-page screenshots of every route into docs/screenshots/ (committed, so a
 * design pass can see the current state without running the app).
 * Usage: node scripts/shoot.mjs [baseUrl]  (dev server must be running)
 */
import { existsSync, mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:5173";
const routes = [
  ["abilities-pve", "/#/pve/abilities"],
  ["abilities-pvp", "/#/pvp/abilities"],
  ["setup-pve", "/#/pve/setup"],
  ["setup-pvp", "/#/pvp/setup"],
  ["combos-pve", "/#/pve/combos"],
  ["combos-pvp", "/#/pvp/combos"],
  ["practice-pve", "/#/pve/practice"],
  ["practice-pvp", "/#/pvp/practice"],
  ["rank1", "/#/pvp/rank1"],
];
const candidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const executablePath = candidates.find((p) => existsSync(p));

mkdirSync("docs/screenshots", { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
for (const [name, route] of routes) {
  await page.goto(base + route, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: true });
  console.log(name);
}
await browser.close();
