/**
 * Drives the practice pages in headless Edge/Chrome: clicks every combo in the
 * list (PvE and AOS) and checks the strip renders one step per combo step with
 * its icons. Usage: node scripts/practice-test.mjs [baseUrl]
 */
import { existsSync, readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:5173";
const combos = JSON.parse(readFileSync(new URL("../data/combos.json", import.meta.url), "utf-8")).combos;

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

for (const route of ["pve", "aos"]) {
  await page.goto(`${base}/#/practice/${route}`, { waitUntil: "networkidle0" });
  const mode = route === "aos" ? "pvp" : "pve";
  const modeCombos = combos.filter((c) => c.mode === mode);
  const buttons = await page.$$(".drill-select button");
  if (buttons.length !== modeCombos.length) {
    errors.push(`${route}: ${buttons.length} combo buttons, expected ${modeCombos.length}`);
  }
  for (let i = 0; i < buttons.length; i++) {
    await buttons[i].click();
    const steps = await page.$$eval(".combo-strip .strip-step", (els) => els.length);
    const icons = await page.$$eval(".combo-strip img", (els) => els.length);
    const expectSteps = modeCombos[i].steps.length;
    const expectIcons = modeCombos[i].steps.reduce(
      (n, s) => n + (s.choices ? s.choices.length : 1),
      0,
    );
    if (steps !== expectSteps || icons !== expectIcons) {
      errors.push(
        `${route} "${modeCombos[i].name}": ${steps}/${expectSteps} steps, ${icons}/${expectIcons} icons`,
      );
    }
  }
  console.log(`${route}: ${buttons.length} combos checked`);
}

await page.goto(`${base}/#/practice/pve`, { waitUntil: "networkidle0" });
await page.screenshot({ path: ".screenshots/practice-pve.png", fullPage: true });
await browser.close();
if (errors.length) {
  console.error("FAILURES:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("Practice test OK — every combo renders its strip.");
