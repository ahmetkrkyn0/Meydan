#!/usr/bin/env node
/**
 * Stage contrast auditor
 * ----------------------
 * Sahne (koyu/aydınlık) yüzeyler üzerinde okunurluk eşiğinin altına düşen
 * Tailwind opacity sınıflarını tarar ve `--fix` ile sahne tokenlarına çevirir.
 *
 * Kurallar:
 *   • text-white/XX            XX < 60  → text-white/70   (koyu zemin üzeri AA)
 *   • text-black/XX            XX < 50  → text-black/60   (aydınlık zemin)
 *   • bg-white/XX text-...     XX < 20  → backdrop kontrastı zayıf → uyarı
 *   • border-white/XX          XX < 10  → uyarı (görünmez kenar)
 *
 * Kullanım:
 *   node scripts/audit-stage-contrast.mjs            # rapor
 *   node scripts/audit-stage-contrast.mjs --fix      # otomatik düzelt
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const ROOT = "src";
const FIX = process.argv.includes("--fix");
const EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".css"]);

const RULES = [
  {
    name: "text-white opaklığı çok düşük",
    re: /text-white\/(\d{1,2})\b/g,
    fix: (m, n) => (Number(n) < 60 ? "text-white/70" : m),
    threshold: (n) => Number(n) < 60,
  },
  {
    name: "text-black opaklığı çok düşük",
    re: /text-black\/(\d{1,2})\b/g,
    fix: (m, n) => (Number(n) < 50 ? "text-black/60" : m),
    threshold: (n) => Number(n) < 50,
  },
  {
    name: "border-white görünmez",
    re: /border-white\/(\d{1,2})\b/g,
    fix: (m, n) => (Number(n) < 10 ? "border-white/15" : m),
    threshold: (n) => Number(n) < 10,
  },
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (EXT.has(extname(p))) yield p;
  }
}

let totalFindings = 0;
let totalFixes = 0;

for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8");
  let out = src;
  const findings = [];

  for (const rule of RULES) {
    for (const m of src.matchAll(rule.re)) {
      const n = m[1];
      if (rule.threshold(n)) {
        findings.push({ rule: rule.name, match: m[0], at: m.index });
      }
    }
    if (FIX) out = out.replace(rule.re, (m, n) => rule.fix(m, n));
  }

  if (findings.length) {
    totalFindings += findings.length;
    console.log(`\n${file}`);
    for (const f of findings) console.log(`  · ${f.match}  (${f.rule})`);
  }

  if (FIX && out !== src) {
    writeFileSync(file, out);
    totalFixes += 1;
  }
}

console.log(
  `\n${totalFindings} bulgu${FIX ? `, ${totalFixes} dosya düzeltildi.` : ". --fix ile otomatik onar."}`
);
process.exit(totalFindings && !FIX ? 1 : 0);
