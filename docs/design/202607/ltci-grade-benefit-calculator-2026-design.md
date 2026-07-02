# 노인 장기요양등급별 혜택·비용 계산기 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/ltci-grade-benefit-calculator-2026-plan.md`](../../plan/202607/ltci-grade-benefit-calculator-2026-plan.md)
> 작성일: 2026-07-02
> 유형: 계산기 (`/tools/`)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/ltciGradeBenefit2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/ltci-grade-benefit-calculator-2026.astro` |
| 스크립트 | `public/scripts/ltci-grade-benefit-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_ltci-grade-benefit-calculator-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

---

## 2. URL 및 메타

```
슬러그: /tools/ltci-grade-benefit-calculator-2026/
타이틀: 장기요양등급 혜택·비용 계산기 2026 | 등급별 본인부담금 바로 계산
디스크립션: 장기요양 1~5등급 입력하면 월 급여 한도·본인부담금·공단 지원액 바로 계산. 재가 vs 시설급여 비교 포함. 감경 대상 여부도 확인 가능.
```

---

## 3. 데이터 파일 설계

**`src/data/ltciGradeBenefit2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type LtciGrade = "1" | "2" | "3" | "4" | "5" | "인지지원";

export type LtciBurdenType = "일반" | "감경40" | "감경60" | "기초";

export type LtciGradeRow = {
  grade: LtciGrade;
  label: string;          // "1등급" | "인지지원등급"
  homeCareLimit: number;  // 월 재가급여 한도 (원)
  facilityRate: number;   // 시설 1일 수가 (원, 2인실 기준)
  eligible: boolean;      // 시설급여 이용 가능 여부
  desc: string;           // 등급 판정 기준 요약
};

export type LtciBurdenRow = {
  type: LtciBurdenType;
  label: string;
  homeCareRatio: number;   // 재가 본인부담률 (0~1)
  facilityRatio: number;   // 시설 본인부담률 (0~1)
};

export type LtciServiceItem = {
  name: string;
  desc: string;
  unit: string;           // "시간" | "회" | "일"
  ratePerUnit: number;    // 단위당 수가 (원, 추정)
  badge: "재가" | "시설";
};

export type LtciFaqItem = {
  q: string;
  a: string;
};

// ── 등급별 데이터 ─────────────────────────────────

export const LTCI_GRADES: LtciGradeRow[] = [
  {
    grade: "1",
    label: "1등급",
    homeCareLimit: 2306040,
    facilityRate: 93010,   // 1일 (2인실 기준, 추정)
    eligible: true,
    desc: "심신 기능 저하로 일상생활 전적 타인 도움 필요 (장기요양인정점수 95점 이상)",
  },
  {
    grade: "2",
    label: "2등급",
    homeCareLimit: 2073120,
    facilityRate: 86360,
    eligible: true,
    desc: "일상생활 대부분 타인 도움 필요 (75점 이상~95점 미만)",
  },
  {
    grade: "3",
    label: "3등급",
    homeCareLimit: 1586880,
    facilityRate: 79650,
    eligible: true,
    desc: "일상생활 일정 부분 타인 도움 필요 (60점 이상~75점 미만)",
  },
  {
    grade: "4",
    label: "4등급",
    homeCareLimit: 1510200,
    facilityRate: 79650,
    eligible: true,
    desc: "일상생활 일부 타인 도움 필요 (51점 이상~60점 미만)",
  },
  {
    grade: "5",
    label: "5등급",
    homeCareLimit: 1303500,
    facilityRate: 0,
    eligible: false,
    desc: "치매 환자 (45점 이상~51점 미만, 치매 진단 필수) — 시설급여 이용 불가",
  },
  {
    grade: "인지지원",
    label: "인지지원등급",
    homeCareLimit: 660700,
    facilityRate: 0,
    eligible: false,
    desc: "경증 치매 (45점 미만, 치매 진단 필수) — 주야간보호·치매전문교육 한정",
  },
];

// ── 본인부담 비율 ─────────────────────────────────

export const LTCI_BURDEN_TYPES: LtciBurdenRow[] = [
  { type: "일반",    label: "일반",          homeCareRatio: 0.15, facilityRatio: 0.20 },
  { type: "감경40",  label: "감경 40% (의료급여 1종 등)", homeCareRatio: 0.09, facilityRatio: 0.12 },
  { type: "감경60",  label: "감경 60% (차상위)",          homeCareRatio: 0.06, facilityRatio: 0.08 },
  { type: "기초",    label: "기초생활수급자", homeCareRatio: 0,    facilityRatio: 0 },
];

// ── 서비스 종류 ───────────────────────────────────

export const LTCI_SERVICES: LtciServiceItem[] = [
  { name: "방문요양",       desc: "요양보호사가 가정 방문, 신체·가사 지원",         unit: "시간", ratePerUnit: 18470,  badge: "재가" },
  { name: "방문목욕",       desc: "목욕 차량 또는 가정 방문 목욕 지원",             unit: "회",   ratePerUnit: 89640,  badge: "재가" },
  { name: "방문간호",       desc: "간호사·물리치료사 등이 방문, 의료·재활 지원",     unit: "회",   ratePerUnit: 70540,  badge: "재가" },
  { name: "주야간보호",     desc: "낮/밤 동안 시설에서 케어 후 귀가",               unit: "일",   ratePerUnit: 64830,  badge: "재가" },
  { name: "단기보호",       desc: "일시적 시설 입소 (최대 연 9회, 1회 9일)",         unit: "일",   ratePerUnit: 79650,  badge: "재가" },
  { name: "노인요양시설",   desc: "24시간 시설 입소 케어 (요양원)",                 unit: "일",   ratePerUnit: 93010,  badge: "시설" },
  { name: "공동생활가정",   desc: "소규모 가정형 시설 (5~9인)",                    unit: "일",   ratePerUnit: 79650,  badge: "시설" },
];

// ── FAQ ───────────────────────────────────────────

export const LTCI_FAQ: LtciFaqItem[] = [
  {
    q: "장기요양등급은 어떻게 신청하나요?",
    a: "국민건강보험공단 지사 방문, 전화(1577-1000), 또는 온라인(노인장기요양보험 홈페이지)으로 신청할 수 있습니다. 신청 후 공단 직원이 가정을 방문해 심신 기능 상태를 조사합니다.",
  },
  {
    q: "등급 판정까지 얼마나 걸리나요?",
    a: "신청일로부터 30일 이내에 결과가 통보됩니다. 의사 소견서 제출이 필요하며, 의사 소견서 발급에 시간이 걸리면 다소 늦어질 수 있습니다.",
  },
  {
    q: "3등급과 4등급의 혜택 차이는 얼마나 되나요?",
    a: "재가급여 한도가 3등급은 월 약 158만원, 4등급은 약 151만원으로 약 7만원 차이가 납니다. 두 등급 모두 시설급여(요양원)를 이용할 수 있습니다.",
  },
  {
    q: "기초생활수급자는 본인부담이 전혀 없나요?",
    a: "재가급여와 시설급여 모두 본인부담금이 면제됩니다. 단, 시설 입소 시 식비·간식비 등 비급여 항목은 별도로 부담할 수 있습니다.",
  },
  {
    q: "재가급여와 시설급여를 동시에 받을 수 있나요?",
    a: "원칙적으로 동시 이용이 불가합니다. 시설급여를 이용하면 재가급여는 중지됩니다. 단, 단기보호는 예외적으로 병행 가능한 경우가 있습니다.",
  },
  {
    q: "가족이 직접 요양보호사가 되어 급여를 받을 수 있나요?",
    a: "가족요양보호사 제도를 통해 가능합니다. 요양보호사 자격증을 취득한 가족이 직접 돌보면 하루 60분 기준으로 급여를 받을 수 있습니다. 다만 배우자 또는 직계혈족만 해당됩니다.",
  },
  {
    q: "인지지원등급은 어떤 경우에 받나요?",
    a: "장기요양인정점수 45점 미만이지만 치매 진단을 받은 경우입니다. 요양원 입소는 불가하고, 주야간보호와 치매 특화 서비스만 이용할 수 있습니다.",
  },
  {
    q: "장기요양 등급과 장애등급은 별개인가요?",
    a: "완전히 별개의 제도입니다. 장기요양등급은 국민건강보험공단이 고령·노인성 질환자를 대상으로 판정하며, 장애등급은 보건복지부가 장애인을 대상으로 합니다. 두 제도의 혜택을 동시에 받을 수 있습니다.",
  },
];

// ── SEO 텍스트 ────────────────────────────────────

export const LTCI_SEO_INTRO = [
  "장기요양보험은 65세 이상 노인 또는 65세 미만이라도 치매·뇌혈관질환 등 노인성 질병으로 6개월 이상 일상생활이 어려운 경우 국가가 케어 비용을 지원하는 제도입니다. 2008년 시행 이후 2026년 현재 수급자 수는 100만 명을 넘어섰습니다.",
  "등급은 1~5등급과 인지지원등급으로 구분되며, 등급이 낮을수록 더 많은 급여 한도와 서비스를 이용할 수 있습니다. 본인부담금은 재가급여 15%, 시설급여 20%가 기본이며, 소득 수준에 따라 감경 혜택을 받을 수 있습니다.",
];

export const LTCI_SEO_CRITERIA = [
  "2026년 장기요양 재가급여 월 한도: 1등급 230만원 / 2등급 207만원 / 3등급 158만원 / 4등급 151만원 / 5등급 130만원",
  "본인부담률: 재가급여 일반 15%, 시설급여 일반 20% (기초수급자 면제)",
  "시설급여(요양원)는 1~4등급만 이용 가능, 5등급·인지지원등급은 재가급여만 이용",
  "가족요양보호사 자격 취득 시 가족이 직접 돌보며 급여 수령 가능",
  "모든 수가·한도는 건강보험공단 고시 기준이며 매년 개정될 수 있습니다",
];
```

---

## 4. tools.ts 등록

```ts
{
  slug: "ltci-grade-benefit-calculator-2026",
  title: "장기요양등급 혜택·비용 계산기 2026",
  description: "1~5등급 입력 시 월 급여 한도·본인부담금·공단지원액 바로 계산. 재가 vs 시설 비교 포함.",
  order: 102,  // 기존 마지막 order + 1
  category: "support",
  badges: ["복지", "노인", "장기요양", "요양원", "재가요양"],
},
```

---

## 5. 계산 로직

```js
// public/scripts/ltci-grade-benefit-calculator-2026.js

// 입력
// - grade: "1" | "2" | "3" | "4" | "5" | "인지지원"
// - burdenType: "일반" | "감경40" | "감경60" | "기초"
// - viewMode: "home" | "facility" | "compare"
// - usageDays: 15~30 (재가 모드)

// 계산 (재가)
const gradeData   = LTCI_GRADES.find(g => g.grade === grade);
const burdenData  = LTCI_BURDEN_TYPES.find(b => b.type === burdenType);

const homeCareLimit   = gradeData.homeCareLimit;
const homeBurden      = Math.round(homeCareLimit * burdenData.homeCareRatio);
const homePublicShare = homeCareLimit - homeBurden;

// 계산 (시설 — 30일 고정)
const facilityMonthly = gradeData.facilityRate * 30;
const facilityBurden  = Math.round(facilityMonthly * burdenData.facilityRatio);
const facilityPublic  = facilityMonthly - facilityBurden;

// 추가 비용 (시설) — 고정 상수
const FACILITY_EXTRA = {
  meal: 180000,
  misc: 40000,
  diaper: 60000,   // 해당자 기준
};
const facilityTotal = facilityBurden + FACILITY_EXTRA.meal + FACILITY_EXTRA.misc;
```

---

## 6. 페이지 IA

```
Hero
 └─ eyebrow: 복지·지원금
 └─ title: 장기요양등급 혜택·비용 계산기 2026
 └─ description: 등급과 소득 조건 입력 → 월 본인부담금·공단지원금 바로 확인

[계산기 영역]
 ├─ 입력 패널
 │   ├─ 등급 선택 (1~5등급 + 인지지원등급)
 │   ├─ 급여 유형 토글 (재가 / 시설 / 비교)
 │   └─ 본인부담 유형 셀렉트 (일반·감경40·감경60·기초)
 └─ 결과 카드 (3개)
     ├─ 월 급여 한도
     ├─ 본인부담금
     └─ 공단 지원액

섹션 1 — 등급별 판정 기준 표
섹션 2 — 재가 서비스 종류 (6종 카드)
섹션 3 — 시설급여 안내
섹션 4 — 내부 CTA → 요양원 vs 재가요양 비용 비교 리포트
섹션 5 — FAQ (8개)
SeoContent
```

---

## 7. 컴포넌트 구조

### 공유 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD |
| `SiteHeader.astro` | 전역 헤더 |
| `CalculatorHero.astro` | Hero 섹션 |
| `InfoNotice.astro` | 면책·안내 배너 |
| `SeoContent.astro` | SEO 텍스트 + FAQ |
| `SiteFooter.astro` | 전역 푸터 |

### 페이지 전용 마크업

| 블록 클래스 | 설명 |
|---|---|
| `.ltci-calculator` | 계산기 전체 래퍼 |
| `.ltci-inputs` | 입력 패널 |
| `.ltci-grade-selector` | 등급 선택 버튼 그룹 (6개) |
| `.ltci-grade-btn` | 개별 등급 버튼 (선택 시 `--active`) |
| `.ltci-mode-toggle` | 재가/시설/비교 토글 |
| `.ltci-burden-select` | 본인부담 유형 셀렉트 |
| `.ltci-results` | 결과 카드 3개 래퍼 |
| `.ltci-result-card` | 개별 결과 카드 |
| `.ltci-result-card--limit` | 월 급여 한도 카드 (파랑) |
| `.ltci-result-card--burden` | 본인부담금 카드 (주황) |
| `.ltci-result-card--public` | 공단지원 카드 (초록) |
| `.ltci-compare-row` | 비교 모드 재가/시설 나란히 표시 |
| `.ltci-grade-table` | 등급별 판정 기준 표 |
| `.ltci-service-grid` | 서비스 종류 카드 그리드 |
| `.ltci-service-card` | 개별 서비스 카드 |
| `.ltci-service-badge--home` | 재가 배지 (청록) |
| `.ltci-service-badge--facility` | 시설 배지 (보라) |
| `.ltci-cta-box` | 내부 CTA 박스 |
| `.ltci-faq` | FAQ details/summary |

---

## 8. SCSS 설계

**파일:** `src/styles/scss/pages/_ltci-grade-benefit-calculator-2026.scss`

### CSS 로컬 토큰

```scss
.ltci-page {
  --ltci-ink:        #14213d;
  --ltci-muted:      #5d6b82;
  --ltci-line:       rgba(20, 33, 61, 0.12);
  --ltci-soft:       #f5f7fb;

  --ltci-primary:    #1a56db;   // 파랑 — 한도 카드, 버튼
  --ltci-primary-bg: #eff4ff;
  --ltci-primary-dk: #1447bf;

  --ltci-teal:       #0891b2;   // 청록 — 재가 배지
  --ltci-teal-bg:    #e0f2fe;

  --ltci-green:      #059669;   // 초록 — 공단지원 카드
  --ltci-green-bg:   #d1fae5;

  --ltci-amber:      #d97706;   // 주황 — 본인부담 카드
  --ltci-amber-bg:   #fef3c7;

  --ltci-purple:     #7c3aed;   // 보라 — 시설 배지
  --ltci-purple-bg:  #ede9fe;
}
```

### 주요 스타일 블록

```scss
// 등급 선택 버튼 그룹
.ltci-grade-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.ltci-grade-btn {
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--ltci-line);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
  &--active {
    border-color: var(--ltci-primary);
    background: var(--ltci-primary-bg);
    color: var(--ltci-primary);
  }
}

// 모드 토글
.ltci-mode-toggle {
  display: flex;
  border: 1.5px solid var(--ltci-line);
  border-radius: 10px;
  overflow: hidden;
  .ltci-mode-btn {
    flex: 1;
    padding: 0.6rem;
    text-align: center;
    cursor: pointer;
    &--active { background: var(--ltci-primary); color: #fff; }
  }
}

// 결과 카드
.ltci-results {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.ltci-result-card {
  padding: 1.25rem;
  border-radius: 14px;
  border: 1.5px solid var(--ltci-line);
  &--limit  { border-top: 3px solid var(--ltci-primary); background: var(--ltci-primary-bg); }
  &--burden { border-top: 3px solid var(--ltci-amber);   background: var(--ltci-amber-bg);   }
  &--public { border-top: 3px solid var(--ltci-green);   background: var(--ltci-green-bg);   }
  .ltci-result-card__label { font-size: 0.8125rem; color: var(--ltci-muted); }
  .ltci-result-card__value { font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
  .ltci-result-card__sub   { font-size: 0.75rem; color: var(--ltci-muted); margin-top: 0.25rem; }
}

// 비교 모드 — 재가/시설 2열
.ltci-compare-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
  .ltci-compare-col__header {
    font-weight: 700;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    &--home     { color: var(--ltci-teal); }
    &--facility { color: var(--ltci-purple); }
  }
}

// 서비스 카드 그리드
.ltci-service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.ltci-service-card {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--ltci-line);
  .ltci-service-card__name { font-weight: 600; font-size: 0.9375rem; }
  .ltci-service-card__desc { font-size: 0.8125rem; color: var(--ltci-muted); margin: 0.25rem 0; }
  .ltci-service-card__rate { font-size: 0.8125rem; font-weight: 500; }
}
.ltci-service-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 99px;
  &--home     { background: var(--ltci-teal-bg);   color: var(--ltci-teal); }
  &--facility { background: var(--ltci-purple-bg); color: var(--ltci-purple); }
}

// 등급 기준 표
.ltci-grade-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--ltci-line);
    text-align: left;
  }
  th { background: var(--ltci-soft); font-weight: 600; }
  tr:last-child td { border-bottom: none; }
}

// 내부 CTA 박스
.ltci-cta-box {
  background: var(--ltci-primary-bg);
  border: 1.5px solid var(--ltci-primary);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  .ltci-cta-box__text { font-weight: 600; color: var(--ltci-ink); }
  .ltci-cta-box__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1.2rem;
    background: var(--ltci-primary);
    color: #fff;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    white-space: nowrap;
  }
}

// FAQ
.ltci-faq details {
  border-bottom: 1px solid var(--ltci-line);
  padding: 0.875rem 0;
}
.ltci-faq summary {
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  &::before { content: "Q. "; color: var(--ltci-primary); }
}
.ltci-faq details[open] summary { color: var(--ltci-primary); }
.ltci-faq .ltci-faq__answer {
  margin-top: 0.625rem;
  color: var(--ltci-muted);
  font-size: 0.9rem;
  line-height: 1.7;
}
```

---

## 9. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import SiteFooter from "../../components/SiteFooter.astro";
import {
  LTCI_GRADES,
  LTCI_BURDEN_TYPES,
  LTCI_SERVICES,
  LTCI_FAQ,
  LTCI_SEO_INTRO,
  LTCI_SEO_CRITERIA,
} from "../../data/ltciGradeBenefit2026";

const title = "장기요양등급 혜택·비용 계산기 2026 | 등급별 본인부담금 바로 계산";
const description = "장기요양 1~5등급 입력하면 월 급여 한도·본인부담금·공단 지원액 바로 계산. 재가 vs 시설급여 비교 포함. 감경 대상 여부도 확인 가능.";
---
<BaseLayout {title} {description} ogType="website">
  <SiteHeader />
  <main class="container page-shell ltci-page">

    <CalculatorHero
      eyebrow="복지·지원금"
      title="장기요양등급 혜택·비용 계산기 2026"
      description="등급과 소득 조건을 입력하면 월 본인부담금과 공단 지원액을 즉시 계산합니다."
    />

    <!-- 계산기 -->
    <section class="ltci-calculator">
      <!-- 등급 선택 -->
      <div class="ltci-inputs">
        <p class="ltci-inputs__label">장기요양등급</p>
        <div class="ltci-grade-selector">
          {LTCI_GRADES.map(g => (
            <button
              class="ltci-grade-btn"
              data-grade={g.grade}
              data-home-limit={g.homeCareLimit}
              data-facility-rate={g.facilityRate}
              data-eligible={g.eligible}
            >
              {g.label}
            </button>
          ))}
        </div>

        <!-- 급여 유형 토글 -->
        <p class="ltci-inputs__label" style="margin-top:1.25rem">급여 유형</p>
        <div class="ltci-mode-toggle">
          <button class="ltci-mode-btn ltci-mode-btn--active" data-mode="home">재가급여</button>
          <button class="ltci-mode-btn" data-mode="facility">시설급여</button>
          <button class="ltci-mode-btn" data-mode="compare">나란히 비교</button>
        </div>

        <!-- 본인부담 유형 -->
        <p class="ltci-inputs__label" style="margin-top:1.25rem">건강보험 유형</p>
        <select class="ltci-burden-select" id="ltci-burden">
          {LTCI_BURDEN_TYPES.map(b => (
            <option value={b.type}
              data-home-ratio={b.homeCareRatio}
              data-facility-ratio={b.facilityRatio}
            >
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <!-- 결과 카드 -->
      <div class="ltci-results" id="ltci-results">
        <div class="ltci-result-card ltci-result-card--limit">
          <p class="ltci-result-card__label">월 급여 한도</p>
          <p class="ltci-result-card__value" id="ltci-limit">—</p>
          <p class="ltci-result-card__sub">공단 인정 한도</p>
        </div>
        <div class="ltci-result-card ltci-result-card--burden">
          <p class="ltci-result-card__label">본인부담금</p>
          <p class="ltci-result-card__value" id="ltci-burden-amount">—</p>
          <p class="ltci-result-card__sub" id="ltci-burden-ratio">재가 15%</p>
        </div>
        <div class="ltci-result-card ltci-result-card--public">
          <p class="ltci-result-card__label">공단 지원액</p>
          <p class="ltci-result-card__value" id="ltci-public">—</p>
          <p class="ltci-result-card__sub">국가 부담분</p>
        </div>
      </div>

      <!-- 비교 모드 전용 (기본 숨김) -->
      <div class="ltci-compare-row" id="ltci-compare" style="display:none">
        <div>
          <p class="ltci-compare-col__header ltci-compare-col__header--home">재가급여</p>
          <div id="ltci-compare-home"></div>
        </div>
        <div>
          <p class="ltci-compare-col__header ltci-compare-col__header--facility">시설급여 (요양원)</p>
          <div id="ltci-compare-facility"></div>
        </div>
      </div>

      <InfoNotice
        title="참고 안내"
        lines={[
          "수가는 건강보험공단 고시(2026년 기준) 추정치이며 지역·시설에 따라 다를 수 있습니다.",
          "시설급여에는 식비·이미용비 등 비급여 항목이 별도로 발생합니다.",
        ]}
      />
    </section>

    <!-- 섹션 1: 등급별 판정 기준 -->
    <section class="content-section">
      <h2 class="section-title">등급별 판정 기준</h2>
      <table class="ltci-grade-table">
        <thead>
          <tr>
            <th>등급</th>
            <th>재가 월 한도</th>
            <th>시설급여</th>
            <th>판정 기준</th>
          </tr>
        </thead>
        <tbody>
          {LTCI_GRADES.map(g => (
            <tr>
              <td><strong>{g.label}</strong></td>
              <td>{g.homeCareLimit.toLocaleString()}원</td>
              <td>{g.eligible ? "가능" : "불가"}</td>
              <td style="font-size:0.8125rem;color:#5d6b82">{g.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <!-- 섹션 2: 재가 서비스 종류 -->
    <section class="content-section">
      <h2 class="section-title">이용 가능한 서비스 종류</h2>
      <div class="ltci-service-grid">
        {LTCI_SERVICES.map(s => (
          <article class="ltci-service-card">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">
              <span class="ltci-service-card__name">{s.name}</span>
              <span class={`ltci-service-badge ltci-service-badge--${s.badge === "재가" ? "home" : "facility"}`}>
                {s.badge}
              </span>
            </div>
            <p class="ltci-service-card__desc">{s.desc}</p>
            <p class="ltci-service-card__rate">
              단위당 약 {s.ratePerUnit.toLocaleString()}원/{s.unit} <span style="font-size:0.75rem;color:#9ca3af">(추정)</span>
            </p>
          </article>
        ))}
      </div>
    </section>

    <!-- 섹션 3: 시설급여 안내 -->
    <section class="content-section">
      <h2 class="section-title">시설급여(요양원) 실제 비용 구조</h2>
      <InfoNotice
        title="시설 입소 시 추가 비용 발생"
        lines={[
          "급여 본인부담금 외에 식비(월 약 18만원), 이미용·간식·행사비(월 약 4만원) 등이 추가됩니다.",
          "기저귀가 필요한 경우 월 5~8만원이 더 발생할 수 있습니다.",
          "상급 침실(1인실) 선택 시 추가 비용이 발생합니다. 비용은 시설마다 다릅니다.",
        ]}
      />
    </section>

    <!-- 섹션 4: 내부 CTA -->
    <section class="content-section">
      <div class="ltci-cta-box">
        <p class="ltci-cta-box__text">요양원 vs 재가요양 월비용, 얼마나 차이 날까?</p>
        <a href="/reports/nursing-home-vs-home-care-cost-2026/" class="ltci-cta-box__btn">
          비교 리포트 보기 →
        </a>
      </div>
    </section>

    <SeoContent
      introTitle="노인 장기요양보험 제도 완전 가이드"
      intro={LTCI_SEO_INTRO}
      criteria={LTCI_SEO_CRITERIA}
      faq={LTCI_FAQ.map(f => ({ question: f.q, answer: f.a }))}
      related={[
        { href: "/reports/nursing-home-vs-home-care-cost-2026/", label: "요양원 vs 재가요양 월비용 비교 리포트" },
        { href: "/tools/basic-pension-eligibility-calculator-2026/", label: "기초연금 수급 가능성 계산기" },
        { href: "/tools/welfare-benefit-eligibility-calculator/", label: "복지급여 수급 자격 계산기" },
        { href: "/tools/livelihood-benefit-income-recognition-2026/", label: "생계급여 소득인정액 계산기" },
        { href: "/reports/national-pension-generation-comparison-2026/", label: "국민연금 세대별 손익 비교 리포트" },
      ]}
    />
  </main>
  <SiteFooter />
</BaseLayout>

<script src="/scripts/ltci-grade-benefit-calculator-2026.js"></script>
```

---

## 10. JS 로직 (`public/scripts/ltci-grade-benefit-calculator-2026.js`)

```js
(function () {
  // 상태
  let selectedGrade = null;
  let selectedMode  = "home";   // "home" | "facility" | "compare"
  let burdenHomeRatio     = 0.15;
  let burdenFacilityRatio = 0.20;

  // DOM
  const gradeBtns      = document.querySelectorAll(".ltci-grade-btn");
  const modeBtns       = document.querySelectorAll(".ltci-mode-btn");
  const burdenSelect   = document.getElementById("ltci-burden");
  const resultsEl      = document.getElementById("ltci-results");
  const compareEl      = document.getElementById("ltci-compare");
  const limitEl        = document.getElementById("ltci-limit");
  const burdenAmountEl = document.getElementById("ltci-burden-amount");
  const burdenRatioEl  = document.getElementById("ltci-burden-ratio");
  const publicEl       = document.getElementById("ltci-public");
  const compareHomeEl  = document.getElementById("ltci-compare-home");
  const compareFacEl   = document.getElementById("ltci-compare-facility");

  // 숫자 포맷
  const fmt = n => n.toLocaleString("ko-KR") + "원";

  // 등급 버튼
  gradeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      gradeBtns.forEach(b => b.classList.remove("ltci-grade-btn--active"));
      btn.classList.add("ltci-grade-btn--active");
      selectedGrade = {
        grade:         btn.dataset.grade,
        homeLimit:     parseInt(btn.dataset.homeLimit),
        facilityRate:  parseInt(btn.dataset.facilityRate),
        eligible:      btn.dataset.eligible === "true",
      };
      render();
    });
  });

  // 모드 토글
  modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modeBtns.forEach(b => b.classList.remove("ltci-mode-btn--active"));
      btn.classList.add("ltci-mode-btn--active");
      selectedMode = btn.dataset.mode;
      render();
    });
  });

  // 본인부담 셀렉트
  burdenSelect.addEventListener("change", () => {
    const opt = burdenSelect.selectedOptions[0];
    burdenHomeRatio     = parseFloat(opt.dataset.homeRatio);
    burdenFacilityRatio = parseFloat(opt.dataset.facilityRatio);
    render();
  });

  function calcHome(grade) {
    const limit   = grade.homeLimit;
    const burden  = Math.round(limit * burdenHomeRatio);
    const pub     = limit - burden;
    return { limit, burden, pub };
  }

  function calcFacility(grade) {
    if (!grade.eligible) return null;
    const monthly = grade.facilityRate * 30;
    const burden  = Math.round(monthly * burdenFacilityRatio);
    const pub     = monthly - burden;
    return { limit: monthly, burden, pub };
  }

  function render() {
    if (!selectedGrade) return;

    const home = calcHome(selectedGrade);
    const fac  = calcFacility(selectedGrade);

    if (selectedMode === "compare") {
      resultsEl.style.display = "none";
      compareEl.style.display = "grid";
      // 재가
      compareHomeEl.innerHTML = `
        <p>한도: <strong>${fmt(home.limit)}</strong></p>
        <p>본인부담: <strong>${fmt(home.burden)}</strong> (${(burdenHomeRatio * 100).toFixed(0)}%)</p>
        <p>공단지원: <strong>${fmt(home.pub)}</strong></p>
      `;
      // 시설
      if (fac) {
        compareFacEl.innerHTML = `
          <p>월 수가: <strong>${fmt(fac.limit)}</strong></p>
          <p>본인부담: <strong>${fmt(fac.burden)}</strong> (${(burdenFacilityRatio * 100).toFixed(0)}%)</p>
          <p>공단지원: <strong>${fmt(fac.pub)}</strong></p>
          <p style="font-size:0.75rem;color:#9ca3af">+ 식비·기타 약 26만원 별도</p>
        `;
      } else {
        compareFacEl.innerHTML = `<p style="color:#9ca3af">이 등급은 시설급여 이용 불가</p>`;
      }
      return;
    }

    // 단일 모드
    resultsEl.style.display = "grid";
    compareEl.style.display = "none";

    const data = selectedMode === "facility" ? fac : home;
    if (!data) {
      limitEl.textContent        = "이용 불가";
      burdenAmountEl.textContent = "—";
      publicEl.textContent       = "—";
      return;
    }

    limitEl.textContent        = fmt(data.limit);
    burdenAmountEl.textContent = fmt(data.burden);
    burdenRatioEl.textContent  = selectedMode === "facility"
      ? `시설 ${(burdenFacilityRatio * 100).toFixed(0)}%`
      : `재가 ${(burdenHomeRatio * 100).toFixed(0)}%`;
    publicEl.textContent = fmt(data.pub);
  }
})();
```

---

## 11. app.scss import

```scss
@use 'scss/pages/ltci-grade-benefit-calculator-2026';
```

---

## 12. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/ltci-grade-benefit-calculator-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 13. 카테고리 등록

- `src/pages/index.astro` → `topicBySlug`: `"ltci-grade-benefit-calculator-2026": "복지·지원금"`
- `npm run check:all` 로 검증

---

## 14. QA 포인트

- [ ] 등급 6개 버튼 선택 → 결과 즉시 업데이트
- [ ] 5등급·인지지원등급에서 시설급여 모드 → "이용 불가" 표시
- [ ] 기초수급자 선택 → 본인부담금 0원 표시
- [ ] 비교 모드 → 재가/시설 2열 나란히 표시
- [ ] 모바일 결과 카드 1열 레이아웃
- [ ] InfoNotice 2곳 노출 확인
- [ ] 내부 CTA → 요양원 vs 재가요양 리포트 링크 정상 작동
- [ ] `추정` 표기 서비스 단가에 표시 확인
- [ ] `npm run check:all` 통과
