/**
 * check-category-mapping.mjs
 *
 * 새 계산기·리포트 추가 시 카테고리 매핑 누락을 자동 감지하고 수정합니다.
 *
 * 사용법:
 *   npm run check:mapping          # 검사만
 *   npm run check:mapping -- --fix  # 누락 항목 자동 추가
 */

import { readFileSync, writeFileSync } from 'fs';

const FIX_MODE = process.argv.includes('--fix');

// ── 파일 로드 ────────────────────────────────────────────────
let idxSrc  = readFileSync('src/pages/index.astro', 'utf8');
let ridxSrc = readFileSync('src/pages/reports/index.astro', 'utf8');
const toolsSrc   = readFileSync('src/data/tools.ts', 'utf8');
const reportsSrc = readFileSync('src/data/reports.ts', 'utf8');

// ── 기존 키 추출 ─────────────────────────────────────────────
const topicKeys      = [...idxSrc.matchAll(/["']([a-z0-9][a-z0-9-]+)["']\s*:\s*["'][^"']+["']/g)].map(m => m[1]);
const homeReportKeys = [...idxSrc.matchAll(/["']([a-z0-9][a-z0-9-]+)["']\s*:\s*\{[^}]*category/g)].map(m => m[1]);
const hubReportKeys  = [...ridxSrc.matchAll(/["']([a-z0-9][a-z0-9-]+)["']\s*:\s*\{[^}]*eyebrow/g)].map(m => m[1]);

// ── tools / reports 슬러그 + 메타 파싱 ────────────────────────
function parseEntries(src) {
  const entries = [];
  const blocks = src.matchAll(/\{([^{}]*slug:[^{}]*)\}/gs);
  for (const b of blocks) {
    const block = b[1];
    const slugM  = block.match(/slug:\s*['"]([^'"]+)['"]/);
    const titleM = block.match(/title:\s*['"]([^'"]+)['"]/);
    const catM   = block.match(/category:\s*['"]([^'"]+)['"]/);
    const descM  = block.match(/description:\s*['"]([^'"]+)['"]/);
    const badgesM = block.match(/badges:\s*\[([^\]]+)\]/);
    if (!slugM || slugM[1] === 'string') continue;
    const badges = badgesM
      ? [...badgesM[1].matchAll(/["']([^"']+)["']/g)].map(m => m[1])
      : [];
    entries.push({
      slug:     slugM[1],
      title:    titleM?.[1] ?? '',
      category: catM?.[1]  ?? '',
      desc:     descM?.[1] ?? '',
      badges,
    });
  }
  return entries;
}

const toolEntries   = parseEntries(toolsSrc);
const reportEntries = parseEntries(reportsSrc);

// ── 카테고리 추론 ─────────────────────────────────────────────

// tools → topicBySlug Korean 카테고리
const TOOL_CATEGORY_MAP = {
  '스포츠':      '스포츠',
  'sports':      '스포츠',
  '생활·유틸리티': '생활·유틸리티',
  'utility':     '생활·유틸리티',
  '투자·재테크':  '투자·재테크',
  'invest':      '투자·재테크',
  '부동산·세금':  '부동산·내집마련',
  'estate':      '부동산·내집마련',
  'support':     '복지·지원금',
  'salary':      '연봉·이직',
  'parenting':   '육아·양육',
};

const TOOL_KEYWORD_MAP = [
  [/성과급|OPI|PS|보너스|인센티브|상여/,               '성과급 비교'],
  [/연봉|급여|임금|월급|연차별|초봉|실수령|이직/,        '연봉·이직'],
  [/육아휴직|출산휴가|출산급여|배우자휴직|6\+6/,         '육아휴직·출산'],
  [/육아|분유|기저귀|아기|돌봄|어린이집|유치원|신생아/,   '육아·양육'],
  [/아파트|전세|월세|집값|부동산|청약|담보|대출|내집/,    '부동산·내집마련'],
  [/ETF|주식|배당|연금|IRP|ISA|적금|투자|재테크|FIRE/,   '투자·재테크'],
  [/세금|증여|양도|종합소득|연말정산|취득세|재산세/,       '세금·연말정산'],
  [/암호화폐|비트코인|이더리움|코인|가상자산/,             '암호화폐'],
  [/여행|항공|환전|호텔|해외|국내여행/,                  '여행·생활'],
  [/자동차|차량|전기차|EV|주유|보험료/,                  '자동차'],
  [/AI|인공지능|ChatGPT|부업|프리랜서/,                  'AI·생산성'],
  [/보험|의료비|실비|건강검진|치과|한방/,                 '보험·의료비'],
  [/결혼|웨딩|혼수|예식/,                               '결혼·웨딩'],
  [/골프|KBO|월드컵|스포츠|선수|감독/,                   '스포츠'],
  [/대출|금융|금리|이자|상환/,                           '대출·금융'],
  [/복지|지원금|수당|혜택|기초생활/,                     '복지·지원금'],
  [/임신|산후|조리원|산부인과/,                          '육아휴직·출산'],
];

function inferToolCategory(entry) {
  if (TOOL_CATEGORY_MAP[entry.category]) return TOOL_CATEGORY_MAP[entry.category];
  const text = [entry.title, ...entry.badges].join(' ');
  for (const [re, cat] of TOOL_KEYWORD_MAP) {
    if (re.test(text)) return cat;
  }
  return '생활·유틸리티';
}

// reports → HomeReportCategory (English)
const REPORT_KEYWORD_MAP = [
  [/연봉|급여|초봉|연차|이직|임금|공무원|경찰|소방|교사|의사|간호|약사|군인/,  'salary'],
  [/성과급|OPI|PS|보너스|인센티브/,                                          'bonus'],
  [/아파트|전세|월세|집값|부동산|청약|담보대출|실거래가|재건축|분당|동탄|강남|서울.*집|용인|수원|하남|성동|마포|강서|강동|광교|수지|용산|영통/,  'estate'],
  [/ETF|주식|배당|연금|IRP|ISA|투자|재테크|FIRE|코스피|나스닥|SPY|반도체.*주|빅테크.*주|IPO|상장|수익률|자산.*성장|부자/,  'asset'],
  [/결혼|육아|아기|출산|육아비|산후|어린이집|유치원|분유|기저귀|여행|생활비|혼수|돌봄|양육|식비|의식주/,  'life'],
  [/영화|드라마|엔터|음악|스포츠|KBO|월드컵|감독|선수|손흥민|이강인|메시|호날두|K리그/,  'culture'],
  [/복지|지원금|수당|혜택|기초생활|청년.*지원|출산.*지원|경기도.*돌봄|가족돌봄/,  'support'],
  [/보험|실비|건강검진|의료비|치과|한방/,                                     'insurance'],
  [/세금|증여|양도|취득세|재산세|연말정산|증여세|종합소득/,                    'tax'],
  [/대통령|국회의원|선거|정치|재산|후보|도지사|시장|교육감/,                   'politics'],
  [/비트코인|이더리움|암호화폐|코인|블록체인|사토시|비탈릭/,                    'crypto'],
  [/골프|KBO|월드컵|스포츠|리그|선수.*연봉|감독.*연봉/,                        'sports'],
];

function inferReportCategory(entry) {
  const text = [entry.title, entry.desc, ...entry.badges].join(' ');
  for (const [re, cat] of REPORT_KEYWORD_MAP) {
    if (re.test(text)) return cat;
  }
  return 'life';
}

// reports/index.astro용 eyebrow 생성 (타이틀 앞 키워드 or 첫 뱃지)
function makeEyebrow(entry) {
  if (entry.badges.length > 0) return entry.badges[0];
  const pipe = entry.title.indexOf('|');
  const base = pipe > -1 ? entry.title.slice(0, pipe).trim() : entry.title;
  return base.replace(/\d{4}$/, '').trim().slice(0, 16);
}

// reports/index.astro용 tags 생성 (첫 3개 뱃지)
function makeTags(entry, mod) {
  return entry.badges.slice(0, 3).map(label => ({ label, mod }));
}

// HomeReportCategory → mod 색상 (태그 스타일용)
const CAT_TO_MOD = {
  salary: 'salary', bonus: 'bonus', estate: 'asset',
  asset: 'asset', life: 'life', culture: 'culture',
  support: 'support', insurance: 'insurance', tax: 'tax',
  politics: 'politics', crypto: 'crypto', sports: 'sports',
};

// ── 누락 계산 ─────────────────────────────────────────────────
const missingTopic      = toolEntries.filter(e => !topicKeys.includes(e.slug));
const missingHomeReport = reportEntries.filter(e => !homeReportKeys.includes(e.slug));
const missingHubReport  = reportEntries.filter(e => !hubReportKeys.includes(e.slug));

let hasError = missingTopic.length > 0 || missingHomeReport.length > 0 || missingHubReport.length > 0;

if (!hasError) {
  console.log(`✅ 누락 없음 — tools ${toolEntries.length}개, reports ${reportEntries.length}개 모두 매핑됨`);
  process.exit(0);
}

// ── 보고 ──────────────────────────────────────────────────────
if (missingTopic.length) {
  console.log(`\n⚠️  topicBySlug 누락 ${missingTopic.length}개:`);
  for (const e of missingTopic) {
    const cat = inferToolCategory(e);
    console.log(`   "${e.slug}": "${cat}"  ← ${e.title.slice(0, 30)}`);
  }
}
if (missingHomeReport.length) {
  console.log(`\n⚠️  index.astro reportMetaBySlug 누락 ${missingHomeReport.length}개:`);
  for (const e of missingHomeReport) {
    const cat = inferReportCategory(e);
    console.log(`   "${e.slug}": { category: "${cat}", isNew: true }  ← ${e.title.slice(0, 30)}`);
  }
}
if (missingHubReport.length) {
  console.log(`\n⚠️  reports/index.astro reportMetaBySlug 누락 ${missingHubReport.length}개:`);
  for (const e of missingHubReport) {
    const cat = inferReportCategory(e);
    console.log(`   "${e.slug}": { eyebrow: "${makeEyebrow(e)}", category: "${cat}", isNew: true }  ← ${e.title.slice(0, 30)}`);
  }
}

if (!FIX_MODE) {
  console.log('\n💡 자동 수정하려면: npm run check:mapping -- --fix\n');
  process.exit(1);
}

// ── 자동 수정 ─────────────────────────────────────────────────
console.log('\n🔧 자동 수정 시작...');

// 1) topicBySlug — index.astro
if (missingTopic.length) {
  const insertLines = missingTopic
    .map(e => `  "${e.slug}": "${inferToolCategory(e)}",`)
    .join('\n');

  // 마지막 항목 바로 앞 닫는 `};` 찾아서 삽입
  idxSrc = idxSrc.replace(
    /("newborn-essentials-fullset-cost-2026":[^\n]+\n)\s*\};(\s*\nconst categories)/,
    `$1${insertLines}\n};\n$2`
  );
  // fallback: }; 직전 위치 (topicBySlug 블록 끝)
  if (!idxSrc.includes(missingTopic[0].slug)) {
    idxSrc = idxSrc.replace(
      /(\n\};\s*\nconst categories)/,
      `\n${insertLines}\n};\nconst categories`
    );
  }
  console.log(`  ✅ topicBySlug ${missingTopic.length}개 추가 → src/pages/index.astro`);
}

// 2) reportMetaBySlug — index.astro
if (missingHomeReport.length) {
  const insertLines = missingHomeReport
    .map(e => {
      const cat = inferReportCategory(e);
      return `  "${e.slug}": { category: "${cat}", isNew: true },`;
    })
    .join('\n');

  idxSrc = idxSrc.replace(
    /("seoul-district-apartment-price-ranking-2026":\s*\{[^}]+\},?\s*\n)\s*\};(\s*\nconst reportEntries|\s*\ntype HomeReport)/,
    `$1${insertLines}\n};\n$2`
  );
  // fallback
  if (!idxSrc.includes(missingHomeReport[0].slug)) {
    idxSrc = idxSrc.replace(
      /(\n\};\s*\nconst reportEntries)/,
      `\n${insertLines}\n};\nconst reportEntries`
    );
  }
  console.log(`  ✅ index.astro reportMetaBySlug ${missingHomeReport.length}개 추가`);
}

writeFileSync('src/pages/index.astro', idxSrc);

// 3) reportMetaBySlug — reports/index.astro
if (missingHubReport.length) {
  const insertLines = missingHubReport
    .map(e => {
      const cat   = inferReportCategory(e);
      const mod   = CAT_TO_MOD[cat] ?? 'asset';
      const eyebrow = makeEyebrow(e);
      const tags  = makeTags(e, mod);
      const tagsStr = tags.map(t => `{ label: "${t.label}", mod: "${t.mod}" }`).join(', ');
      return [
        `  "${e.slug}": {`,
        `    eyebrow: "${eyebrow}",`,
        `    tags: [${tagsStr}],`,
        `    category: "${cat}",`,
        `    isNew: true,`,
        `  },`,
      ].join('\n');
    })
    .join('\n');

  ridxSrc = ridxSrc.replace(
    /("seoul-district-apartment-price-ranking-2026":\s*\{[^}]+\},?\s*\n)\s*\};(\s*\nconst reportEntries)/,
    `$1${insertLines}\n};\n$2`
  );
  // fallback: 마지막 };  바로 앞
  if (!ridxSrc.includes(missingHubReport[0].slug)) {
    ridxSrc = ridxSrc.replace(
      /(\n\};\s*\nconst reportEntries)/,
      `\n${insertLines}\n};\nconst reportEntries`
    );
  }
  writeFileSync('src/pages/reports/index.astro', ridxSrc);
  console.log(`  ✅ reports/index.astro reportMetaBySlug ${missingHubReport.length}개 추가`);
}

console.log('\n🎉 완료. npm run build 로 검증하세요.\n');
