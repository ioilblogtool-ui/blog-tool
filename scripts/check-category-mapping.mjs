import { readFileSync } from 'fs';

const idx = readFileSync('src/pages/index.astro', 'utf8');
const ridx = readFileSync('src/pages/reports/index.astro', 'utf8');
const tools = readFileSync('src/data/tools.ts', 'utf8');
const reports = readFileSync('src/data/reports.ts', 'utf8');

// topicBySlug 키 (계산기 카테고리)
const topicKeys = [...idx.matchAll(/["']([a-z0-9][a-z0-9-]+)["']\s*:\s*["'][^"']+["']/g)].map(m => m[1]);

// index.astro reportMetaBySlug 키
const homeReportKeys = [...idx.matchAll(/["']([a-z0-9][a-z0-9-]+)["']\s*:\s*\{[^}]*category/g)].map(m => m[1]);

// reports/index.astro reportMetaBySlug 키
const hubReportKeys = [...ridx.matchAll(/["']([a-z0-9][a-z0-9-]+)["']\s*:\s*\{[^}]*eyebrow/g)].map(m => m[1]);

// tools.ts 슬러그
const toolSlugs = [...tools.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]).filter(s => s !== 'string');

// reports.ts 슬러그
const reportSlugs = [...reports.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]).filter(s => s !== 'string');

const missingTopic = toolSlugs.filter(s => !topicKeys.includes(s));
const missingHomeReport = reportSlugs.filter(s => !homeReportKeys.includes(s));
const missingHubReport = reportSlugs.filter(s => !hubReportKeys.includes(s));

let hasError = false;

if (missingTopic.length) {
  console.log(`\n❌ topicBySlug 누락 (${missingTopic.length}개) — index.astro에 카테고리 추가 필요:`);
  missingTopic.forEach(s => console.log(`   "${s}": "카테고리"`));
  hasError = true;
}

if (missingHomeReport.length) {
  console.log(`\n❌ index.astro reportMetaBySlug 누락 (${missingHomeReport.length}개):`);
  missingHomeReport.forEach(s => console.log(`   "${s}": { category: "...", isNew: true }`));
  hasError = true;
}

if (missingHubReport.length) {
  console.log(`\n❌ reports/index.astro reportMetaBySlug 누락 (${missingHubReport.length}개):`);
  missingHubReport.forEach(s => console.log(`   "${s}": { eyebrow: "...", tags: [...], category: "...", isNew: true }`));
  hasError = true;
}

if (!hasError) {
  console.log(`✅ 누락 없음 — tools ${toolSlugs.length}개, reports ${reportSlugs.length}개 모두 매핑됨`);
}

process.exit(hasError ? 1 : 0);
