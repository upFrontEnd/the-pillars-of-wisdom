import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

// Skip sur Netlify (build variable read-only)
if (process.env.NETLIFY === "true") {
  console.log("[screenshot] Skipped on Netlify build environment.");
  process.exit(0);
}

const URL = process.env.SCREENSHOT_URL ?? "http://localhost:3000";
const OUTPUT_PATH = "public/img/screen.png";

(async () => {
  console.log("Lancement de la création du screenshot pour", URL);

  // Assure le dossier de sortie
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  let browser;
  try {
    browser = await chromium.launch(); // headless par défaut
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto(URL, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: OUTPUT_PATH, fullPage: true, type: "png" });
    console.log("Screenshot mis à jour :", OUTPUT_PATH);
  } catch (error) {
    console.error("Erreur pendant la génération du screenshot :", error);
    process.exitCode = 1; // échoue en CI si tu l’exécutes
  } finally {
    if (browser) await browser.close();
  }
})();
