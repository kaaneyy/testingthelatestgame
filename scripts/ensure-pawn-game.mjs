import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "src", "PawnPlayGame.tsx");
const partsDir = join(root, "src", "pawn-game-source");

if (existsSync(target) && readFileSync(target, "utf8").includes("export default")) {
  process.exit(0);
}

const parts = readdirSync(partsDir)
  .filter((name) => name.endsWith(".b64"))
  .sort();

if (!parts.length) {
  throw new Error("Missing packed PawnPlayGame source parts.");
}

const packed = parts
  .map((name) => readFileSync(join(partsDir, name), "utf8").trim())
  .join("");

const source = Buffer.from(packed, "base64").toString("utf8");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, source);

console.log(`Prepared PawnPlayGame.tsx from ${parts.length} packed source parts.`);
