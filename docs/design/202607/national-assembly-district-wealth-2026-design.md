# 설계 문서
## 지역구별 국회의원 재산 순위 2026

> 기획 원본: `docs/plan/202607/national-assembly-district-wealth-2026.md`

---

## 0. 구현 개요

| 항목 | 값 |
|------|---|
| slug | `national-assembly-district-wealth-2026` |
| 페이지 경로 | `src/pages/reports/national-assembly-district-wealth-2026.astro` |
| 데이터 파일 | `src/data/nationalAssemblyDistrictWealth2026.ts` (신규, 기존 `nationalAssemblyWealth2026.ts`의 `NAW_TOP30`/`NAW_BOTTOM10`을 import해 파생) |
| 스크립트 | `public/scripts/national-assembly-district-wealth-2026.js` |
| SCSS | `src/styles/scss/pages/_national-assembly-district-wealth-2026.scss` |
| SCSS prefix | `.nadw` (National Assembly District Wealth) |
| 레이아웃 쉘 | BaseLayout 직접 구성 (기존 `national-assembly-wealth-2026` 패턴 재사용) |

⚠️ **선행 조건**: 이 문서는 기존 `src/data/nationalAssemblyWealth2026.ts`의 `NAW_TOP30`(30명) + `NAW_BOTTOM10`(10명) = **총 40명 표본**만 사용한다. 신규 개인 데이터를 추가 추정하지 않는다 (기획 문서 2절 스코프 제약 참조).

---

## 1. 데이터 파일 설계 (`nationalAssemblyDistrictWealth2026.ts`)

### 1-1. 설계 원칙

지역구 문자열("서울 종로구", "부산 남구갑" 등)에서 시·도명을 파싱해 권역으로 자동 분류한다. **수동으로 40명분 권역을 하드코딩하지 않고, 분류 함수 + 원본 데이터 재계산 방식**으로 구현 — 원본 데이터(`NAW_TOP30`/`NAW_BOTTOM10`)가 나중에 수정돼도 이 파일을 다시 손댈 필요가 없도록 한다.

### 1-2. 타입 및 분류 함수

```ts
// src/data/nationalAssemblyDistrictWealth2026.ts
import { NAW_TOP30, NAW_BOTTOM10, type LawmakerWealth } from "./nationalAssemblyWealth2026";

export type Region = "수도권" | "영남" | "호남" | "충청" | "강원·제주" | "비례대표" | "확인필요";

const REGION_PREFIX: Record<string, Region> = {
  "서울": "수도권", "경기": "수도권", "인천": "수도권",
  "부산": "영남", "울산": "영남", "경남": "영남", "대구": "영남", "경북": "영남",
  "광주": "호남", "전남": "호남", "전북": "호남",
  "대전": "충청", "세종": "충청", "충남": "충청", "충북": "충청",
  "강원": "강원·제주", "제주": "강원·제주",
};

export function classifyRegion(district: string): Region {
  if (district === "비례대표") return "비례대표";
  const prefix = district.slice(0, 2);
  return REGION_PREFIX[prefix] ?? "확인필요";
}
```

### 1-3. ⚠️ 데이터 정합성 이슈 (구현 전 확인 필수)

`NAW_TOP30` 14번째 항목(순위 14)의 `district` 값이 `"서울시장(겸임 불가 → 제외)"`로 되어 있다. 국회의원 지역구가 아닌 이상값으로, 원본 데이터 입력 오류로 추정된다.

→ **구현 착수 전 `nationalAssemblyWealth2026.ts` 원본에서 이 행의 실제 지역구를 확인·수정**해야 한다. 수정 전까지는 `classifyRegion()`이 `"확인필요"`로 분류하고, 화면에는 해당 인원을 권역 집계에서 제외하고 "데이터 확인 중" 처리한다.

### 1-4. 권역 분류 결과 (검증용 — 구현 시 프로그램 계산값과 대조)

기획 시점 수동 검산 기준 (이상값 1건 제외 39명 + 이상값 1건):

| 권역 | 인원(표본) | 비고 |
|------|-----------|------|
| 수도권 | 14 | 서울 8 · 경기 5 · 인천 1 |
| 비례대표 | 9 | |
| 호남 | 6 | 전남 3 · 광주 1 · 전북 2 |
| 영남 | 5 | 부산 3 · 울산 1 · 경북 1 |
| 충청 | 4 | 충북 1 · 대전 1 · 충남 2 |
| 강원·제주 | 1 | |
| 확인필요 | 1 | 위 1-3 이상값 |
| **합계** | **40** | |

구현 시 `classifyRegion()`을 40명 데이터에 실행한 결과가 이 표와 일치하는지 QA에서 대조한다 (일치하지 않으면 원본 데이터 변경 사항이 있었다는 신호).

### 1-5. 권역 요약 계산 (하드코딩 금지 — 런타임 파생)

```ts
export interface RegionSummary {
  region: Region;
  memberCountInSample: number;
  avgBillionInSample: number;
  topMember: { name: string; billion: number; district: string };
  members: Array<{ name: string; party: string; district: string; totalBillion: number; rank: number }>;
}

const ALL_SAMPLE: LawmakerWealth[] = [
  ...NAW_TOP30,
  ...NAW_BOTTOM10.map((m) => ({ ...m, realEstateBillion: 0, stockBillion: 0, depositBillion: 0, debtBillion: 0, yoyChangeBillion: 0, mainAsset: "-" })),
];

export const NADW_REGION_SUMMARY: RegionSummary[] = (() => {
  const groups = new Map<Region, LawmakerWealth[]>();
  for (const m of ALL_SAMPLE) {
    const region = classifyRegion(m.district);
    if (!groups.has(region)) groups.set(region, []);
    groups.get(region)!.push(m);
  }
  return [...groups.entries()]
    .filter(([region]) => region !== "확인필요") // 이상값은 요약 통계에서 제외
    .map(([region, members]) => {
      const sorted = [...members].sort((a, b) => b.totalBillion - a.totalBillion);
      const avg = members.reduce((s, m) => s + m.totalBillion, 0) / members.length;
      return {
        region,
        memberCountInSample: members.length,
        avgBillionInSample: Math.round(avg * 10) / 10,
        topMember: { name: sorted[0].name, billion: sorted[0].totalBillion, district: sorted[0].district },
        members: sorted.map((m) => ({ name: m.name, party: m.party, district: m.district, totalBillion: m.totalBillion, rank: m.rank })),
      };
    })
    .sort((a, b) => b.avgBillionInSample - a.avgBillionInSample);
})();

// 검색용 통합 리스트 (지역구·이름 필터 대상)
export const NADW_ALL_MEMBERS = ALL_SAMPLE.map((m) => ({
  rank: m.rank,
  name: m.name,
  party: m.party,
  district: m.district,
  region: classifyRegion(m.district),
  totalBillion: m.totalBillion,
}));
```

### 1-6. 메타 정보

```ts
export const NADW_META = {
  slug: "national-assembly-district-wealth-2026",
  title: "지역구별 국회의원 재산 순위 2026",
  seoTitle: "지역구별 국회의원 재산 순위 2026 | 우리 지역 의원은 몇 위",
  seoDescription:
    "TOP30·하위 10명 국회의원의 지역구·수도권/영남/호남/충청 권역별 재산을 순위로 비교. 우리 지역 의원 재산과 권역 평균까지 한눈에 확인하세요.",
  updatedAt: "2026-07-03",
  sampleNote: "공개된 TOP30·하위 10명(총 40명) 표본 기준입니다. 전체 253개 지역구를 포함하지 않습니다.",
  sourceReportSlug: "national-assembly-wealth-2026",
};
```

---

## 2. 화면 구성 상세

### 레이아웃 스켈레톤

```
[BaseLayout]
  [SiteHeader]
  [CalculatorHero]           ← 타이틀 + 부제 + "40명 표본" 배지
  <main class="nadw-page">
    [InfoNotice]              ← "TOP30·하위10 표본 기준, 전체 지역구 아님" 고지 (필수, 생략 금지)
    .nadw-summary             ← Summary 카드 4개
    .nadw-region-table        ← 권역별 비교표
    .nadw-search              ← 지역구·이름 검색 테이블 (40명 통합)
    .nadw-chart                ← 권역별 평균 바차트
    .nadw-source-link          ← 원본 TOP30 리포트 연결 카드
    .nadw-related               ← 지자체장 재산 리포트 3종 연결
    [SeoContent]                ← FAQ + SEO 텍스트
  </main>
  [SiteFooter]
```

### 2-1. Summary 카드 (4개)

| 카드 | 값 | 산출 |
|------|---|------|
| 표본 내 최고 재산 | "김재원 · 487억" | `ALL_SAMPLE` 중 `totalBillion` 최댓값 |
| 표본 내 최저 재산 | "김예지 · 1.2억" | `totalBillion` 최솟값 |
| 평균 재산 최고 권역 | "수도권 · XX억" | `NADW_REGION_SUMMARY[0]` |
| 수도권 vs 비수도권 격차 | "약 X.X배" | 수도권 평균 ÷ (비수도권 전체 평균) |

### 2-2. 권역별 비교표 (`.nadw-region-table`)

컬럼: `권역 | 표본 인원 | 표본 평균 재산 | 최고 의원 | 비고`

각 행 하단에 고정 각주: **"표본(40명) 기준이며 해당 권역 전체 지역구 평균이 아닙니다."**

```html
<table class="nadw-region-table-el">
  <thead>...</thead>
  <tbody>
    <tr>
      <td>수도권</td>
      <td>14명</td>
      <td>XX.X억</td>
      <td>김재원 (종로구 등)</td>
      <td class="nadw-note">표본 기준</td>
    </tr>
    ...
  </tbody>
</table>
```

### 2-3. 지역구·이름 검색 테이블 (`.nadw-search`)

- 검색창 1개: 지역구명 또는 의원명 입력 시 실시간 필터 (신규 API 불필요, 클라이언트 필터)
- 권역 필터 탭 (7개: 전체/수도권/영남/호남/충청/강원·제주/비례대표)
- 컬럼: `순위 | 이름 | 정당 | 지역구 | 권역 | 재산(억) | 원본 링크`

```html
<div class="nadw-search-bar">
  <input type="text" id="nadwSearchInput" placeholder="지역구 또는 의원 이름 검색 (예: 종로구, 김재원)" />
</div>
<div class="nadw-region-tabs">
  <button class="nadw-region-tab is-active" data-region="all">전체</button>
  <button class="nadw-region-tab" data-region="수도권">수도권</button>
  <button class="nadw-region-tab" data-region="영남">영남</button>
  <button class="nadw-region-tab" data-region="호남">호남</button>
  <button class="nadw-region-tab" data-region="충청">충청</button>
  <button class="nadw-region-tab" data-region="강원·제주">강원·제주</button>
  <button class="nadw-region-tab" data-region="비례대표">비례대표</button>
</div>
<div class="nadw-table-wrap">
  <table class="nadw-member-table">
    <tbody id="nadwMemberRows">
      <tr data-region="수도권" data-name="김재원" data-district="서울 종로구">
        <td>1</td><td>김재원</td><td>국민의힘</td><td>서울 종로구</td><td>수도권</td><td>487억</td>
        <td><a href="/reports/national-assembly-wealth-2026/#rank-1">TOP30에서 보기</a></td>
      </tr>
    </tbody>
  </table>
</div>
<p class="nadw-empty" id="nadwEmptyState" hidden>검색 결과가 없습니다. 표본(40명)에 포함되지 않은 지역구일 수 있어요 — <a href="/reports/national-assembly-wealth-2026/">전체 TOP30 리포트</a>에서 확인해보세요.</p>
```

검색 결과 0건일 때 **"표본에 없을 수 있다"는 안내**를 반드시 노출 — 사용자가 데이터 누락을 버그로 오인하지 않도록.

### 2-4. 권역별 바차트 (`.nadw-chart`)

Chart.js 수직 바차트, X축 권역명, Y축 표본 평균 재산(억). `chart-config.js` 공통 옵션 사용.

### 2-5. 원본 리포트 연결 카드 (`.nadw-source-link`)

"전체 TOP30 순위와 정당별·직업별 분석 자세히 보기 →" — `national-assembly-wealth-2026`으로 강조 링크.

### 2-6. 관련 리포트 그리드 (`.nadw-related`)

`seoul-mayor-candidate-assets-2026`, `local-election-candidate-assets-ranking-2026`, `governor-mayor-candidate-assets-comparison-2026` 카드 3개.

---

## 3. JS 설계 (`national-assembly-district-wealth-2026.js`)

```js
(function () {
  const input = document.getElementById("nadwSearchInput");
  const tabs = document.querySelectorAll(".nadw-region-tab");
  const rows = [...document.querySelectorAll("#nadwMemberRows tr")];
  const emptyState = document.getElementById("nadwEmptyState");

  let activeRegion = "all";

  function applyFilter() {
    const keyword = (input.value || "").trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach((row) => {
      const matchesRegion = activeRegion === "all" || row.dataset.region === activeRegion;
      const haystack = `${row.dataset.name} ${row.dataset.district}`.toLowerCase();
      const matchesKeyword = !keyword || haystack.includes(keyword);
      const visible = matchesRegion && matchesKeyword;
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
  }

  input.addEventListener("input", applyFilter);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      activeRegion = tab.dataset.region;
      applyFilter();
    });
  });

  // Chart.js — 권역별 평균 바차트
  function initChart() {
    const canvas = document.getElementById("nadwChartCanvas");
    if (!canvas) return;
    const labels = JSON.parse(canvas.dataset.labels);
    const data = JSON.parse(canvas.dataset.values);
    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: { labels, datasets: [{ data, backgroundColor: "rgba(26, 86, 219, 0.75)" }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { title: { display: true, text: "억원 (표본 평균)" } } } },
    });
  }

  initChart();
})();
```

Astro 페이지에서 `data-labels`/`data-values`를 `NADW_REGION_SUMMARY`로부터 `JSON.stringify`해 canvas에 주입.

---

## 4. SCSS 설계 (`_national-assembly-district-wealth-2026.scss`)

prefix: `.nadw`. 기존 `national-assembly-wealth-2026` 페이지의 색상 토큰·카드 패턴을 최대한 재사용.

```scss
.nadw-page {
  --nadw-ink: #172033;
  --nadw-muted: #667085;
  --nadw-line: #d8e0ea;
  --nadw-soft: #f6f8fb;
  --nadw-blue: #1a56db;
  --nadw-teal: #0f766e;

  .nadw-summary,
  .nadw-region-table,
  .nadw-search,
  .nadw-chart,
  .nadw-source-link,
  .nadw-related { margin-top: 28px; }

  .nadw-summary-grid {
    display: grid; gap: 12px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  // 검색 바
  .nadw-search-bar input {
    width: 100%; padding: 12px 14px; border: 1px solid var(--nadw-line);
    border-radius: 8px; font-size: 15px;
  }
  .nadw-search-bar input:focus { border-color: var(--nadw-blue); outline: none; }

  // 권역 탭
  .nadw-region-tabs { display: flex; gap: 8px; margin: 12px 0; overflow-x: auto; }
  .nadw-region-tab {
    border: 1px solid var(--nadw-line); border-radius: 999px; background: #fff;
    padding: 6px 14px; font-size: 13px; font-weight: 700; white-space: nowrap; cursor: pointer;
  }
  .nadw-region-tab.is-active { border-color: var(--nadw-blue); background: #eef2ff; color: var(--nadw-blue); }

  // 테이블
  .nadw-table-wrap { border: 1px solid var(--nadw-line); border-radius: 8px; overflow-x: auto; }
  .nadw-member-table { border-collapse: collapse; min-width: 720px; width: 100%; }
  .nadw-member-table tr[hidden] { display: none; }

  .nadw-empty {
    margin-top: 12px; padding: 16px; border-radius: 8px;
    background: var(--nadw-soft); color: var(--nadw-muted); font-size: 14px; text-align: center;
  }
  .nadw-empty a { color: var(--nadw-blue); font-weight: 700; }

  // 권역 요약 표 각주
  .nadw-note { font-size: 12px; color: var(--nadw-muted); }

  @media (max-width: 920px) {
    .nadw-summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .nadw-summary-grid { grid-template-columns: 1fr; }
    .nadw-region-tabs { flex-wrap: nowrap; }
  }
}
```

---

## 5. Astro 페이지 구조 (`national-assembly-district-wealth-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  NADW_META,
  NADW_REGION_SUMMARY,
  NADW_ALL_MEMBERS,
} from "../../data/nationalAssemblyDistrictWealth2026";

const sortedByWealth = [...NADW_ALL_MEMBERS].sort((a, b) => b.totalBillion - a.totalBillion);
const richest = sortedByWealth[0];
const poorest = sortedByWealth[sortedByWealth.length - 1];
const topRegion = NADW_REGION_SUMMARY[0];

const metro = NADW_REGION_SUMMARY.find((r) => r.region === "수도권");
const nonMetro = NADW_REGION_SUMMARY.filter((r) => r.region !== "수도권" && r.region !== "비례대표");
const nonMetroAvg =
  nonMetro.reduce((sum, r) => sum + r.avgBillionInSample * r.memberCountInSample, 0) /
  nonMetro.reduce((sum, r) => sum + r.memberCountInSample, 0);
const metroGapRatio = metro ? (metro.avgBillionInSample / nonMetroAvg).toFixed(1) : "-";

const chartLabels = JSON.stringify(NADW_REGION_SUMMARY.map((r) => r.region));
const chartValues = JSON.stringify(NADW_REGION_SUMMARY.map((r) => r.avgBillionInSample));
---
```

InfoNotice에는 반드시 `NADW_META.sampleNote` 문구를 그대로 출력 — 다른 문구로 재작성 금지 (기획 문서의 스코프 고지 원칙 유지).

---

## 6. 원본 TOP30 리포트 연동

`national-assembly-wealth-2026.astro`에 상호 링크 카드 1개 추가 필요:

```astro
<!-- national-assembly-wealth-2026.astro 내 적절한 위치에 삽입 -->
<a href="/reports/national-assembly-district-wealth-2026/" class="naw-cross-link-card">
  우리 지역 국회의원 재산은? 지역구·권역별로 다시 보기 →
</a>
```

(이 변경은 본 신규 리포트 구현과 별도 커밋으로 처리 가능하나, 인터널 링크 전략상 반드시 함께 배포)

---

## 7. sitemap.xml 등록

```xml
<url>
  <loc>https://bigyocalc.com/reports/national-assembly-district-wealth-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 8. app.scss 등록

```scss
// src/styles/app.scss 에 추가
@use "scss/pages/national-assembly-district-wealth-2026";
```

---

## 9. 구현 순서

| 단계 | 작업 | 비고 |
|------|------|------|
| 0 | `nationalAssemblyWealth2026.ts` 순위 14번 `district` 이상값 확인·수정 | **선행 필수** — 미수정 시 권역 집계 왜곡 |
| 1 | `nationalAssemblyDistrictWealth2026.ts` 작성 (`classifyRegion`, `NADW_REGION_SUMMARY`, `NADW_ALL_MEMBERS`, `NADW_META`) | 1-5절 참조 |
| 2 | `classifyRegion()` 실행 결과를 1-4절 검산표와 대조 | 불일치 시 원인 파악 후 진행 |
| 3 | `_national-assembly-district-wealth-2026.scss` 작성 | 4절 참조 |
| 4 | `app.scss`에 import 추가 | |
| 5 | `.astro` 페이지 작성 (Hero + InfoNotice + Summary + 권역표 + 검색 테이블) | 5절 참조 |
| 6 | `national-assembly-district-wealth-2026.js` 작성 (검색 필터 + 권역 탭 + Chart.js) | 3절 참조 |
| 7 | `src/data/reports.ts`에 신규 슬러그 등록 | 타이틀·디스크립션은 기획 문서 3절 |
| 8 | `national-assembly-wealth-2026.astro`에 역방향 링크 카드 추가 | 6절 참조 |
| 9 | `sitemap.xml` 등록 | |
| 10 | `npm run build` 확인 | |

---

## 10. QA 포인트

- [ ] `NAW_TOP30` 순위 14번 지역구 이상값이 수정되었는지 확인 (미수정 시 "확인필요" 권역으로 표시되는지, 즉 크래시 없이 안전하게 처리되는지 확인)
- [ ] `classifyRegion()` 결과가 1-4절 검산표(수도권14·비례9·호남6·영남5·충청4·강원제주1)와 일치
- [ ] 검색창에 지역구명 입력 시 실시간 필터링 정상 작동
- [ ] 권역 탭 클릭 시 해당 권역만 표시, "전체" 탭 복귀 시 전체 노출
- [ ] 검색 결과 0건일 때 `.nadw-empty` 안내 문구 노출 (표본 밖 지역구 안내 포함)
- [ ] InfoNotice에 "40명 표본" 고지 문구가 실제로 렌더링되는지 (생략 금지 원칙)
- [ ] Summary 카드 4개 수치가 `NADW_ALL_MEMBERS`/`NADW_REGION_SUMMARY` 파생값과 일치
- [ ] Chart.js 바차트 정상 렌더링 (모바일 포함)
- [ ] 모바일 480px에서 검색 테이블 가로 스크롤 정상 작동
- [ ] 원본 `national-assembly-wealth-2026` 페이지에 역방향 링크 카드 노출 확인
- [ ] `npm run build` 에러 없음
- [ ] sitemap.xml 경로 포함 확인
