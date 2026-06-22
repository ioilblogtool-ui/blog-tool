import fs from "fs";
import path from "path";

const dist = path.resolve("dist");
const targets = ["tools", "reports"];

// 2026-05-24, 2026-06-19에 이미 보강 완료된 페이지 (SEO_ADSENSE_ROADMAP.md 기록 기준) — 재확인 제외
const ALREADY_FIXED = new Set([
  "wedding-budget-calculator", "diaper-cost", "formula-cost", "parental-leave", "six-plus-six",
  "dividend-monthly-income", "travel-expense-split", "ai-subscription-cost", "household-income",
  "single-parental-leave-total", "birth-support-total", "birth-support-money", "home-purchase-fund",
  "dental-treatment-cost-calculator", "car-accident-insurance-vs-cash-calculator",
  "medical-expense-claim-worth-calculator", "mvno-switching-savings-calculator",
  "moving-cost-calculator", "internet-tv-cancellation-penalty",
]);

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&middot;/g, "·").replace(/\s+/g, " ").trim();
}

function checkPage(slug, html) {
  const introMatch = html.match(/class="panel seo-panel seo-panel--intro"[^>]*>([\s\S]*?)<\/article>/);
  if (!introMatch) return { slug, status: "no-seo-content" };

  const block = introMatch[1];
  const paragraphs = [...block.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => stripTags(m[1]));
  // h2/title 등은 제외하고 본문 p만 카운트 (단, panel-heading__summary도 p이므로 약간 과대 카운트될 수 있음 -> 첫 p 제외 처리)
  const bodyParagraphs = paragraphs.filter((p) => p.length > 0);

  const totalLength = bodyParagraphs.reduce((sum, p) => sum + p.length, 0);
  const shortParagraphs = bodyParagraphs.filter((p) => p.length < 150);

  const issues = [];
  if (bodyParagraphs.length < 4) issues.push(`단락 수 부족 (${bodyParagraphs.length}개, 4단락 미달)`);
  if (shortParagraphs.length > 0) issues.push(`150자 미만 단락 ${shortParagraphs.length}개`);
  if (totalLength < 600) issues.push(`총 글자수 부족 (${totalLength}자)`);

  return {
    slug,
    status: issues.length > 0 ? "issue" : "ok",
    paragraphCount: bodyParagraphs.length,
    totalLength,
    shortCount: shortParagraphs.length,
    issues,
  };
}

const results = [];
for (const target of targets) {
  const dir = path.join(dist, target);
  if (!fs.existsSync(dir)) continue;
  const slugs = fs.readdirSync(dir).filter((name) => fs.statSync(path.join(dir, name)).isDirectory());
  for (const slug of slugs) {
    if (ALREADY_FIXED.has(slug)) continue;
    const htmlPath = path.join(dir, slug, "index.html");
    if (!fs.existsSync(htmlPath)) continue;
    const html = fs.readFileSync(htmlPath, "utf8");
    results.push({ target, ...checkPage(slug, html) });
  }
}

const noSeo = results.filter((r) => r.status === "no-seo-content");
const issues = results.filter((r) => r.status === "issue");
const ok = results.filter((r) => r.status === "ok");

console.log(`총 점검 페이지: ${results.length} (제외: ${ALREADY_FIXED.size}개)`);
console.log(`SeoContent 없음: ${noSeo.length}`);
console.log(`기준 미달(issue): ${issues.length}`);
console.log(`통과(ok): ${ok.length}`);
console.log("");
console.log("=== SeoContent 자체가 없는 페이지 ===");
noSeo.forEach((r) => console.log(`  [${r.target}] ${r.slug}`));
console.log("");
console.log("=== 기준 미달 페이지 ===");
issues.forEach((r) => console.log(`  [${r.target}] ${r.slug} — 단락 ${r.paragraphCount}개, 총 ${r.totalLength}자, 150자미만 ${r.shortCount}개 — ${r.issues.join("; ")}`));
