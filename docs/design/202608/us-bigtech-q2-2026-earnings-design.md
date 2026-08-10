# 미국 빅테크 2분기 실적 2026 리포트 — 설계 문서

> 기획 원문: `docs/plan/202608/us-bigtech-q2-2026-earnings-plan.md`
> 작성일: 2026-08-07
> 참고 리포트: `us-rich-top10-patterns`(선택형 프로필 카드 패턴 재사용), `hbm4-vs-hbm5-beneficiary-comparison`(상태 배지·타임라인 패턴)

---

## 1. 대상

- slug: `us-bigtech-q2-2026-earnings`
- URL: `/reports/us-bigtech-q2-2026-earnings/`
- 페이지 성격: 선택형 프로필 리포트(9개사 선택 → 상세 실적 카드) + 비교 막대바 + 패턴 해석

---

## 2. 파일 구조

```text
src/data/usBigTechQ2Earnings2026.ts
src/pages/reports/us-bigtech-q2-2026-earnings.astro
public/scripts/us-bigtech-q2-2026-earnings.js
src/styles/scss/pages/_us-bigtech-q2-2026-earnings.scss
```

등록: `src/data/reports.ts`, `src/pages/reports/index.astro`(자동 노출), `src/pages/index.astro`(`reportMetaBySlug`, category: `asset`), `src/styles/app.scss`, `public/sitemap.xml`

레이아웃: `SimpleToolShell` + `CalculatorHero` + `InfoNotice` + `ToolActionBar` + `SeoContent` (us-rich-top10-patterns.astro와 동일 조합)

---

## 3. 데이터 구조 (`src/data/usBigTechQ2Earnings2026.ts`)

```ts
export type BeatMiss = "beat" | "miss" | "mixed" | "pending";

export type EarningsMetric = {
  id: string;
  ticker: string;
  name: string;
  nameKr: string;
  rank: number;                 // 표시 순서(매출 규모 순, 미발표사는 마지막)
  reported: boolean;            // false = 엔비디아(미발표)
  reportDateDisplay: string;    // "2026년 7월 30일" / "2026년 8월 26일 예정"
  fiscalLabel: string;          // "FY2026 3분기(4~6월)" 등 회사별 분기 표기
  revenueUsdB: number | null;
  revenueYoyPct: number | null;
  revenueVsConsensus: BeatMiss;
  epsDisplay: string | null;    // "$2.02" 등 표시용
  epsVsConsensus: BeatMiss;
  epsCaveat?: string;           // 아마존/알파벳 일회성 이익 주의문
  stockReactionPct: number | null; // 음수=하락, 발표 후 시간외/익일 반응
  stockReactionNote: string;
  capexNote: string;            // capex 가이던스 요약 텍스트
  summary: string;              // 2~3문장 해석
  highlights: string[];         // 3개 내외 핵심 포인트
  tags: string[];               // "실적beat·주가하락" 같은 패턴 태그
  sourceName: string;
  sourceUrl: string;
};

export type EarningsPattern = {
  title: string;
  body: string;
};

export type EarningsFaq = {
  question: string;
  answer: string;
};

export const reportMeta = {
  slug: "us-bigtech-q2-2026-earnings",
  title: "미국 빅테크 2분기 실적 2026 완전 정리 | 누가 오르고 누가 내렸나",
  description:
    "애플·MS·구글·아마존·메타·테슬라·넷플릭스·AMD 2026년 2분기 실적을 매출·EPS·주가 반응·AI 투자로 비교. 실적은 좋은데 주가가 떨어진 이유까지 정리."
};

export const dataMeta = {
  asOfDate: "2026-08-07",
  asOfDateDisplay: "2026년 8월 7일",
  periodLabel: "2026년 2분기(4~6월, 각 사 회계분기 기준)",
  sourceNote: "각 사 공식 IR·SEC 공시, Reuters·CNBC·Bloomberg 등 보도 종합"
};

export const cautionNotes = [
  "이 리포트는 투자 권유가 아니며, 투자 판단과 책임은 본인에게 있습니다.",
  "아마존·알파벳의 EPS는 지분 투자 평가이익 등 일회성 요인이 크게 반영되어 있어 카드 내 주의문을 함께 확인하세요.",
  "엔비디아는 2026-08-07 기준 미발표이며, 실적 발표(2026-08-26 예정) 후 갱신됩니다.",
  "컨센서스 대비 beat/miss는 조사 시점 기준 보도 수치이며 이후 소급 수정될 수 있습니다."
];

export const earningsList: EarningsMetric[] = [ /* 9개사, 4번 섹션 표 참고 */ ];

export const earningsPatterns: EarningsPattern[] = [ /* 5-6 섹션 참고 */ ];

export const earningsFaq: EarningsFaq[] = [ /* 8 섹션 참고 */ ];
```

---

## 4. 9개사 데이터 값 (조사 완료, 그대로 반영)

| id | ticker | rank | reported | reportDateDisplay | revenueUsdB(YoY%) | revenueVsConsensus | epsDisplay(vsConsensus) | stockReactionPct | capexNote 요약 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| apple | AAPL | 1 | true | 2026년 7월 30일 | 109.4 (+16%) | beat | $2.02 (beat) | -6.65 | AI/PCC 투자 대폭 확대 시사(구체 수치 미공개) |
| microsoft | MSFT | 2 | true | 2026년 7월 29일 | 90.01 (+18%) | beat | $4.74 non-GAAP (beat) | +8.5 | FY2027 $255~260B(+35%) |
| alphabet | GOOGL | 3 | true | 2026년 7월 22일 | 119.8 (+24%) | beat | GAAP $9.11 / 조정 $2.85 | mixed | -6.0 | 2026년 $195~205B로 상향 |
| amazon | AMZN | 4 | true | 2026년 7월 30일 | 200.6 (+20%) | beat | $5.75 (beat, 일회성 반영) | +9.0 | 2026년 ~$220B로 상향 |
| meta | META | 5 | true | 2026년 7월 29일 | 60.8 (+28%) | beat | $6.18 (miss) | -9.64 | 2026년 $130~145B로 상향 |
| nvidia | NVDA | 6 | false | 2026년 8월 26일 예정 | null | pending | null | null | 미발표 |
| tesla | TSLA | 7 | true | 2026년 7월 22일 | 28.24 (+26%) | beat | $0.33 (miss) | -3.92 | 분기 약 $25B, 향후 2~3년 지속 증가 |
| netflix | NFLX | 8 | true | 2026년 7월 16일 | 12.56 (+13%) | mixed(근소 미달) | $0.80 (근소 beat) | -9.0 | 별도 공시 없음 |
| amd | AMD | 9 | true | 2026년 8월 4일 | 11.5 (+50%, 역대 최고) | beat | $1.66 non-GAAP (beat) | -8.94 (시간외, 정규장 +7%) | 데이터센터 매출 +107%, 별도 capex 수치 없음 |

각 항목의 `epsCaveat`(아마존: "GAAP 순이익에는 Anthropic 지분 투자 평가이익 $534억이 포함되어 있어, 영업 실적만으로 본 서프라이즈보다 훨씬 부풀려진 수치입니다." / 알파벳: "GAAP EPS $9.11에는 지분증권 평가이익 $990억(주당 +$6.26 효과)이 포함되어 있습니다. 영업 실적과 더 가까운 조정 EPS는 $2.85로 컨센서스에 소폭 못 미쳤습니다."), `summary`, `highlights`, `sourceUrl`은 기획서 3번 섹션 표와 리서치 원본(에이전트 리포트)의 문장을 한국어로 다듬어 채운다.

Nvidia 카드는 `reported: false`로 두고 페이지에서 "실적 발표 예정" 비활성 스타일(회색 배지 + 수치 자리에 "—")로 렌더링한다.

---

## 5. 페이지 IA

1. Hero — "미국 빅테크 2분기 실적 2026, 누가 오르고 누가 내렸나"
2. InfoNotice — `cautionNotes` (투자 권유 아님, 일회성 이익 주의, 엔비디아 미발표, 컨센서스 소급수정 가능)
3. 핵심 수치 KPI 카드 4개: 발표 완료 기업 수(8/9), beat 기업 수, 주가 상승/하락 기업 수, capex 가이던스 상향 기업 수
4. 기업 선택(select) + 빠른 비교 카드 그리드(9개, 클릭 시 선택 전환) — `us-rich-top10-patterns` aside 패턴 재사용
5. 선택 기업 상세 카드 — 발표일/분기, 매출·YoY·컨센서스 배지, EPS·컨센서스 배지(+ epsCaveat 있으면 경고 박스), 주가 반응, capex 메모, summary, highlights
6. 종합 비교 막대바 2종: ① 매출 YoY 성장률 순, ② 실적 발표 후 주가 반응률 순(양/음 색 구분)
7. 패턴 분석 카드 3~4개(`earningsPatterns`): "beat해도 떨어진 이유", "MS만 오른 이유", "일회성 이익 주의", "매그니피센트7 vs S&P500 성적표"
8. SeoContent(FAQ 포함) + 관련 리포트 링크

---

## 6. 섹션 상세

### 6-1. 빠른 비교 카드 그리드
- `us-rich-top10-patterns`의 `.usr-overview-card` 패턴 재사용, `data-profile-trigger` → `data-earnings-trigger`로 명명
- 카드 표기: 티커, 회사명(한글), 매출 YoY, 주가 반응(%, 화살표 아이콘 색상 구분), `reported: false`인 카드는 `is-pending` 클래스로 회색 처리 및 클릭 비활성화하지 않고 "발표 예정" 상세만 보여줌

### 6-2. 상세 카드
- 배지 컴포넌트 재사용: `beat`(초록) / `miss`(빨강) / `mixed`(주황) / `pending`(회색)
- `epsCaveat` 존재 시 카드 내부에 노란 경고 박스(`.beg-caveat-box`)로 별도 표시
- capex 텍스트는 굵게 강조된 라인 하나로 표시

### 6-3. 비교 막대바
- Chart.js 없이 CSS bar row 사용(REPORT_CONTENT_GUIDE 6번 원칙 — "차트는 라이브러리보다 CSS bar 우선")
- 막대 길이는 절대값 기준 정규화, 방향(+/-)에 따라 색상만 분기(양수: 초록, 음수: 빨강)
- `reported: false`(엔비디아)는 막대바 목록에서 제외하고 "실적 발표 예정" 별도 행으로 하단에 고정 표기

### 6-4. 패턴 분석 카드 (`earningsPatterns`, 4개)
1. "beat해도 주가는 떨어졌다" — 알파벳·메타 사례, capex 가이던스 상향이 원인
2. "MS는 왜 반대로 급등했나" — capex 가이던스를 상향이 아닌 '재확인'만 한 것이 시장에 안도감을 준 사례
3. "헤드라인 EPS를 그대로 믿으면 안 되는 이유" — 아마존/알파벳 일회성 지분평가이익 설명
4. "매그니피센트7, 사실 S&P500보다 못 올랐다" — 시장 전체 맥락(3-1절)

### 6-5. FAQ (`earningsFaq`, 5~6개)
- 엔비디아 실적은 언제 발표되나요?
- 실적이 좋은데 왜 주가가 떨어지나요?
- 아마존·알파벳 EPS가 컨센서스를 크게 넘긴 이유는 무엇인가요?
- 매그니피센트7 실적이 나스닥 전체에 미치는 영향은?
- 이 리포트의 컨센서스·주가 반응 수치는 얼마나 신뢰할 수 있나요?

---

## 7. JavaScript 설계 (`public/scripts/us-bigtech-q2-2026-earnings.js`)

`us-rich-top10-report.js`와 동일한 구조로 작성(Chart.js 미사용 — CSS bar이므로 렌더 함수만 재사용, `renderOverviewChart` 해당 부분 제거):

- `script#earningsData`(JSON) → `JSON.parse`
- select 변경 / 카드 클릭 시 `renderCompany(company)` 호출
- `renderCompany`: 상세 카드 텍스트·배지 클래스·`epsCaveat` 박스 표시 여부·capex 텍스트 갱신
- URL 파라미터(`?company=amd`) 반영 (`updateUrl`, 초기 로드시 파라미터 우선)
- 리셋 버튼(`resetEarningsBtn`) → 기본값(apple, rank 1) 복귀
- 복사 버튼(`copyEarningsLinkBtn`) → 현재 URL 클립보드 복사
- 비교 막대바는 정적 마크업(Astro에서 서버사이드 렌더링)이므로 JS 갱신 불필요 — 선택 변경 시 해당 기업 막대만 강조(`is-active` 클래스 토글)

---

## 8. SCSS 설계 (`_us-bigtech-q2-2026-earnings.scss`, 핵심 발췌)

```scss
.beg-page {
  .beg-badge {
    display: inline-flex;
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 0.72rem;
    font-weight: 800;

    &--beat { background: #dcfce7; color: #166534; }
    &--miss { background: #fee2e2; color: #991b1b; }
    &--mixed { background: #fef3c7; color: #92400e; }
    &--pending { background: #f3f4f6; color: #6b7280; }
  }

  .beg-overview-card.is-pending {
    opacity: 0.6;
  }

  .beg-caveat-box {
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    font-size: 0.82rem;
    color: #92400e;
  }

  .beg-bar-row {
    display: grid;
    grid-template-columns: 96px 1fr 64px;
    align-items: center;
    gap: 10px;
    padding: 6px 0;

    &.is-active .beg-bar-track span { outline: 2px solid #0f6e56; }
  }

  .beg-bar-track {
    height: 10px;
    border-radius: 999px;
    background: #f1f5f9;
    position: relative;
    overflow: hidden;

    span {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 999px;
    }
  }

  .beg-bar-track--positive span { background: #16a34a; left: 50%; }
  .beg-bar-track--negative span { background: #dc2626; right: 50%; }

  .beg-pattern-grid {
    display: grid;
    gap: 12px;
    margin-top: 20px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
```

---

## 9. SEO 설계

```text
title: 미국 빅테크 2분기 실적 2026 완전 정리 | 누가 오르고 누가 내렸나
description: 애플·MS·구글·아마존·메타·테슬라·넷플릭스·AMD 2026년 2분기 실적을 매출·EPS·주가 반응·AI 투자로 비교. 실적은 좋은데 주가가 떨어진 이유까지 정리.
H1: 미국 빅테크 2분기 실적 2026, 누가 오르고 누가 내렸나
```

키워드: 빅테크 실적, 매그니피센트7 실적, 애플 실적 주가, 구글 실적 주가, 아마존 실적, 메타 실적, AMD 실적, 나스닥 실적 시즌 2026

JSON-LD: `Article` + `FAQPage` (BaseLayout 공통 처리 확인)

---

## 10. SeoContent 초안

### intro (요지)
1. 2026년 2분기(4~6월) 실적 시즌 개요 — 8개사 발표 완료, 엔비디아만 8/26 예정
2. beat해도 주가가 떨어진 알파벳·메타·애플 사례와 capex 가이던스 상향의 관계
3. 마이크로소프트만 급등한 이유(가이던스 재확인 vs 상향의 차이)
4. 아마존·알파벳 헤드라인 EPS의 일회성 요인 경고
5. 매그니피센트7 전체가 S&P500 대비 부진했다는 시장 맥락

### criteria
- 각 사 공식 IR·SEC 공시, Reuters/CNBC/Bloomberg 등 보도 기준, 조사 시점(2026-08-07) 기준 정리
- 컨센서스·주가 반응은 보도 시점 수치로 추후 소급 수정 가능
- 투자 권유 아님, 판단과 책임은 본인에게 있음

### FAQ
`earningsFaq` 데이터 그대로 사용

---

## 11. 관련 링크

- `/reports/semiconductor-etf-2026/`
- `/reports/ai-stocks-h1-2026/`
- `/reports/semiconductor-stocks-h1-2026/`
- `/reports/bitcoin-gold-sp500-10year-comparison-2026/`
- `/tools/dca-investment-calculator/`

---

## 12. QA 체크리스트

- [ ] 엔비디아 카드에 수치 대신 "—"와 "발표 예정" 배지만 표기, 실제 수치 미기재 확인
- [ ] 아마존·알파벳 카드에 `epsCaveat` 경고 박스 노출
- [ ] beat/miss/mixed/pending 배지 색상·라벨 일관성
- [ ] 비교 막대바 양수/음수 색상 방향 정확(하락은 왼쪽/빨강, 상승은 오른쪽/초록 등 일관 규칙)
- [ ] 모바일에서 카드 그리드 2열 이하로 자연스럽게 쌓임, 표는 가로 스크롤 처리
- [ ] URL 파라미터(`?company=`)로 진입 시 해당 기업이 기본 선택됨
- [ ] InfoNotice에 투자 권유 아님 문구 노출
- [ ] `reports.ts`, `reports/index.astro`, `index.astro`(reportMetaBySlug, category: asset), `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
