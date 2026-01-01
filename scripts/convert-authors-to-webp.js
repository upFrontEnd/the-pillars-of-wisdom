import path from "node:path";
import { readdir, stat } from "node:fs/promises";
import sharp from "sharp";

const ROOT = path.resolve("public/authors");
const QUALITY = 80; // ajustez (70-85 typiquement)
const EFFORT = 4;   // 0..6 (plus haut = plus lent, souvent plus petit)

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function toWebpPath(file) {
  return file.replace(/\.(jpe?g)$/i, ".webp");
}

async function needsUpdate(input, output) {
  try {
    const [inStat, outStat] = await Promise.all([stat(input), stat(output)]);
    return inStat.mtimeMs > outStat.mtimeMs; // régénère si JPG plus récent
  } catch {
    return true; // output absent
  }
}

async function main() {
  const all = await walk(ROOT);
  const jpgs = all.filter((f) => /\.(jpe?g)$/i.test(f));

  let converted = 0;
  for (const input of jpgs) {
    const output = toWebpPath(input);
    if (!(await needsUpdate(input, output))) continue;

    await sharp(input)
      .webp({ quality: QUALITY, effort: EFFORT })
      .toFile(output);

    converted++;
    console.log(`✓ ${path.relative(process.cwd(), output)}`);
  }

  console.log(`Done. Converted: ${converted}/${jpgs.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
