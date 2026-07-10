# 말레이시아 국제학교 2026 완전 정리 — 설계 문서

> 기획 원본: [`docs/plan/202607/southeast-asia-international-school-content-plan.md`](../../plan/202607/southeast-asia-international-school-content-plan.md) 6번
> 작성일: 2026-07-09 (2026-07-09 리서치 완료 후 업데이트 — 조호바루 섹션 복원)
> 유형: 정보형 리포트 (`/reports/`) — 정적 페이지
> 클러스터 3번 페이지
> 데이터 출처: [`southeast-asia-international-school-cost-calculator-2026-design.md`](./southeast-asia-international-school-cost-calculator-2026-design.md)의 `SAC_SCHOOLS` 중 `country === "MY"` 재사용

---

## 0. 조호바루 데이터 확보 — 계획서 원안대로 2개 도시 풀 스코프

이전 리비전은 조호바루 학교 데이터 부족으로 쿠알라룸푸르 단독 진행을 권고했으나, 후속 리서치에서 **조호바루 3개교(Marlborough College Malaysia, R.E.A.L Schools JB, Crescendo-HELP International School)를 전부 공식 페이지 원문으로 확인**했다. 계획서 원안대로 쿠알라룸푸르+조호바루 2개 도시 비교로 진행한다.

**남은 유일한 격차**: 조호바루의 가족 생활비 데이터는 아직 확보되지 않았다. 이 페이지는 조호바루 학비 비교표는 정식으로 제공하되, 생활비는 "확인 필요"로 명시한다 — 계산기에서 조호바루를 선택하면 총비용 대신 학비만 표시된다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/malaysiaInternationalSchoolGuide2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/malaysia-international-school-guide-2026.astro` |
| 스크립트 | 없음 (정적 비교표, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_malaysia-international-school-guide-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `mis-` (Malaysia International School)

---

## 2. URL 및 메타

```
슬러그: /reports/malaysia-international-school-guide-2026/
타이틀(seoTitle): 말레이시아 국제학교 2026 완전 정리 | 학비·생활비 총정리
디스크립션: 쿠알라룸푸르·조호바루 국제학교의 학비와 생활비를 비교합니다. 한국 국제학교 대비 비용 차이까지 확인하세요.
```

---

## 3. 데이터 파일 설계

**`src/data/malaysiaInternationalSchoolGuide2026.ts`**

```ts
import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const MIS_META = {
  slug: "malaysia-international-school-guide-2026",
  title: "말레이시아 국제학교, 뭐가 다를까",
  seoTitle: "말레이시아 국제학교 2026 완전 정리 | 학비·생활비 총정리",
  seoDescription:
    "쿠알라룸푸르·조호바루 국제학교의 학비와 생활비를 비교합니다. 한국 국제학교 대비 비용 차이까지 확인하세요.",
  description: "쿠알라룸푸르 5곳·조호바루 3곳, 총 8개교의 학비·커리큘럼·생활비를 비교합니다.",
  updatedAt: "2026-07-09",
};

// 쿠알라룸푸르 + 조호바루 필터링해 재사용 — 새 데이터 정의 금지
export const MIS_KL_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "MY" && s.city === "kuala_lumpur");
export const MIS_JB_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "MY" && s.city === "johor_bahru");
export const MIS_KL_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "kuala_lumpur")!;
export const MIS_JB_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "johor_bahru")!; // monthlyFamilyExclRentLocal: null 상태
export const MIS_FX_RATE = SAC_FX_RATES.find((f) => f.currency === "MYR")!;

export type SchoolProfileNote = {
  schoolId: string;
  oneLinerKo: string;      // 한 줄 요약 (학교별 상세 카드용)
  bestFor: string;         // 어떤 가정에 잘 맞는지
};

export const MIS_SCHOOL_NOTES: SchoolProfileNote[] = [
  { schoolId: "gis-kl", oneLinerKo: "쿠알라룸푸르에서 가장 오래된 영국식 국제학교 중 하나로 학년 전 구간 데이터가 가장 촘촘하게 확인됨.", bestFor: "영국식 커리큘럼(GCSE·A-Level)을 원하는 가정" },
  { schoolId: "mkis-kl", oneLinerKo: "5개교 중 중간 가격대, 미국식 커리큘럼.", bestFor: "미국 대학 진학을 염두에 둔 가정" },
  { schoolId: "alice-smith-kl", oneLinerKo: "전통 있는 영국식 학교, 고학년 학비가 5개교 중 상위권.", bestFor: "안정적인 영국식 명문교를 찾는 가정" },
  { schoolId: "nexus-kl", oneLinerKo: "IB 커리큘럼 전 학년 데이터가 가장 세분화되어 확인됨.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "sri-kdu-kl", oneLinerKo: "5개교 중 가장 학비가 낮은 편, 다만 데이터 확보 학년이 초등 구간뿐.", bestFor: "예산을 최우선으로 고려하는 가정(단, 중·고등 학비는 별도 확인 필요)" },
  { schoolId: "marlborough-jb", oneLinerKo: "조호바루 3개교 중 가장 비싸지만 학년 전 구간 데이터가 가장 촘촘하고 공식 확인됨. 기숙 옵션도 있음.", bestFor: "영국 명문 사립교 브랜드를 중시하는 가정" },
  { schoolId: "real-schools-jb", oneLinerKo: "조호바루에서 가장 저렴한 국제학교 — 같은 학교 안에 국제부(영국식)와 말레이시아 국가과정을 함께 운영.", bestFor: "예산을 최우선으로 고려하는 가정" },
  { schoolId: "crescendo-help-jb", oneLinerKo: "Marlborough와 R.E.A.L 사이 중간 가격대, 영국식 IPC·Cambridge 커리큘럼.", bestFor: "중간 가격대에서 영국식 커리큘럼을 원하는 가정" },
];

export const MIS_FAQ: FaqItem[] = [
  {
    question: "쿠알라룸푸르·조호바루 국제학교 중 가장 저렴한 곳은 어디인가요?",
    answer:
      "확보된 데이터 기준으로는 조호바루의 R.E.A.L Schools JB(국제부 기준, Early Years 연간 약 1만3,760 MYR)가 8개교 중 가장 낮습니다. 쿠알라룸푸르에서는 Sri KDU Kota Damansara의 초등 구간이 상대적으로 낮은 편입니다.",
  },
  {
    question: "말레이시아 국제학교 학비에 세금이 포함되어 있나요?",
    answer:
      "2025년 7월부터 연 수업료가 6만 MYR를 초과하는 부분에 6% 서비스세(SST)가 부과됩니다. Marlborough College Malaysia는 공식 페이지에 SST 별도 부과가 명시되어 있으며, 다른 학교도 실제 지원 전 세금 포함 여부를 확인하는 것이 안전합니다.",
  },
  {
    question: "쿠알라룸푸르에서 국제학교를 보내면 생활비는 얼마나 드나요?",
    answer:
      "외국인 4인 가족 기준 월 생활비(주거비 제외)는 약 9,042 MYR입니다. 콘도 월세는 3베드룸 기준 외곽 약 2,492 MYR, 시내중심 약 4,943 MYR로 조사되었습니다. 정확한 총비용은 계산기에서 학교·거주 형태를 선택해 확인할 수 있습니다.",
  },
  {
    question: "조호바루 국제학교는 왜 총비용을 계산할 수 없나요?",
    answer:
      "조호바루의 학교 학비는 확인했지만, 가족 생활비 데이터는 아직 조사하지 못했습니다. 계산기에서 조호바루를 선택하면 총비용 대신 학비만 표시됩니다. 생활비 데이터가 보강되는 대로 다른 도시와 동일하게 총비용을 계산할 수 있도록 업데이트할 예정입니다.",
  },
  {
    question: "조호바루 R.E.A.L Schools는 왜 다른 학교보다 훨씬 저렴한가요?",
    answer:
      "R.E.A.L Schools Johor Bahru는 국제부(영국 커리큘럼)와 말레이시아 국가교육과정 트랙을 함께 운영합니다. 이 페이지의 학비는 국제부 기준만 사용했습니다 — 국가교육과정 트랙은 이보다 더 저렴하지만 국제학교로 분류하기 어려워 제외했습니다.",
  },
  {
    question: "말레이시아 국제학교는 한국 국제학교보다 저렴한가요?",
    answer:
      "학비만 비교하면 대체로 낮은 편입니다. 하지만 부모가 동반 거주할 경우 생활비가 추가되므로, 정확한 비교는 학비와 생활비를 함께 계산하는 것이 중요합니다. 한국과의 총비용 비교는 관련 리포트와 계산기를 참고하세요.",
  },
];

export const MIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "학비와 생활비를 합산해 직접 계산해보세요." },
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국 총비용을 비교합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕·치앙마이 국제학교 학비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민·하노이 국제학교 학비를 정리합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 말레이시아 국제학교
 └─ title: 말레이시아 국제학교, 뭐가 다를까
 └─ description: 쿠알라룸푸르·조호바루 8개교의 학비와 생활비를 비교합니다

InfoNotice (학비 출처·확인일자 + "학교별 확인 수준이 다름" + "조호바루 생활비는 준비 중" 명시)

섹션 1 — 쿠알라룸푸르 5개교 학비 비교표 (MIS_KL_SCHOOLS)
섹션 2 — 조호바루 3개교 학비 비교표 (MIS_JB_SCHOOLS — 전부 공식 확인 배지)
섹션 3 — 학교별 상세 카드 8개 (MIS_SCHOOL_NOTES)
섹션 4 — 쿠알라룸푸르 vs 조호바루 생활비 비교 (쿠알라룸푸르는 수치 제공, 조호바루는 "확인 필요" 카드)
섹션 5 — 계산기 CTA
SeoContent (FAQ 6개 + 관련 링크 4개)
```

---

## 5. 컴포넌트 구조

공유 컴포넌트는 국내 클러스터와 동일(`BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`).

### 페이지 전용 마크업 (`mis-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.mis-page` | 루트 스코프 |
| `.mis-compare-table` | 섹션 1·2 — 학비 비교표 (도시별 재사용) |
| `.mis-confidence-badge` | `data-confidence` 속성으로 공식확인/검색요약 구분 (계산기와 동일 패턴) |
| `.mis-school-card-grid` / `.mis-school-card` | 섹션 3 — 학교별 상세 카드 |
| `.mis-living-cost-grid` / `.mis-living-cost-card` | 섹션 4 — 도시별 생활비 카드 2열 |
| `.mis-living-cost-card--pending` | 조호바루처럼 생활비 미확보 도시에 적용되는 변형(점선 테두리) |
| `.mis-calc-cta` | 섹션 5 — 계산기 유도 배너 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_malaysia-international-school-guide-2026.scss`

```scss
.mis-page {
  --mis-line: #d8e0ea;
  --mis-accent: #0f6e56;

  .mis-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--mis-line);
      padding: 0.55rem 0.7rem;
      text-align: left;
    }
  }

  .mis-confidence-badge {
    display: inline-flex;
    border-radius: var(--radius-chip, 20px);
    padding: 0.15rem 0.55rem;
    font-size: 0.72rem;

    &[data-confidence="official"] { background: var(--color-brand-tint); color: var(--color-brand-primary); }
    &[data-confidence="snippet"] { background: var(--color-warning-tint); color: var(--color-warning); }
  }

  .mis-school-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  .mis-school-card {
    border: 1px solid var(--mis-line);
    border-radius: var(--radius-card, 12px);
    padding: 1.1rem;

    h3 { margin: 0 0 0.4rem; }
  }

  .mis-living-cost-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .mis-living-cost-card {
    border: 1px solid var(--mis-line);
    border-left: 4px solid var(--mis-accent);
    border-radius: var(--radius-card, 12px);
    padding: 1.1rem;

    &--pending {
      border-left-style: dashed;
      border-left-color: var(--mis-line);
      color: #6b7280;
    }
  }

  .table-wrap { overflow-x: auto; }
}
```

---

## 7. Astro 페이지 구조 (핵심 스니펫)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  MIS_META, MIS_KL_SCHOOLS, MIS_JB_SCHOOLS, MIS_SCHOOL_NOTES, MIS_KL_LIVING_COST, MIS_JB_LIVING_COST, MIS_FAQ, MIS_RELATED_LINKS,
} from "../../data/malaysiaInternationalSchoolGuide2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = MIS_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
const badgeAttr = (s: typeof MIS_KL_SCHOOLS[number]) => (s.dataConfidence === "official_confirmed" ? "official" : "snippet");
const badgeLabel = (s: typeof MIS_KL_SCHOOLS[number]) => (s.dataConfidence === "official_confirmed" ? "공식 확인" : "검색 요약");
---
<BaseLayout title={MIS_META.seoTitle} description={MIS_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page mis-page">
    <CalculatorHero eyebrow="말레이시아 국제학교" title={MIS_META.title} description={MIS_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[
      "학비는 학교 공식 페이지 또는 검색 결과 기준(2026-07-09)이며, 학교별로 확인 수준이 다릅니다.",
      "조호바루는 학교 학비만 확인되었고 생활비는 아직 준비 중입니다.",
    ]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교 · 쿠알라룸푸르</p>
        <h2>쿠알라룸푸르 5개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="mis-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비(MYR)</th><th>커리큘럼</th><th>확인</th></tr></thead>
          <tbody>
            {MIS_KL_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{tier.annualLocal.toLocaleString("en-US")}</td>
                <td>{school.curriculum}</td>
                <td><span class="mis-confidence-badge" data-confidence={badgeAttr(school)}>{badgeLabel(school)}</span></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교 · 조호바루</p>
        <h2>조호바루 3개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="mis-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비(MYR)</th><th>커리큘럼</th><th>확인</th></tr></thead>
          <tbody>
            {MIS_JB_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{tier.annualLocal.toLocaleString("en-US")}</td>
                <td>{school.curriculum}</td>
                <td><span class="mis-confidence-badge" data-confidence={badgeAttr(school)}>{badgeLabel(school)}</span></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <p class="op-message">조호바루 3개교는 전부 학교 공식 페이지 원문으로 확인했습니다.</p>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학교별 상세</p>
        <h2>8개교 한 줄 요약</h2>
      </div>
      <div class="mis-school-card-grid">
        {[...MIS_KL_SCHOOLS, ...MIS_JB_SCHOOLS].map((school) => {
          const note = MIS_SCHOOL_NOTES.find((n) => n.schoolId === school.id)!;
          return (
            <article class="mis-school-card">
              <h3>{school.name} <small>({school.cityLabel})</small></h3>
              <p>{note.oneLinerKo}</p>
              <p><strong>추천:</strong> {note.bestFor}</p>
              {school.dataNote && <p class="mis-data-note">⚠ {school.dataNote}</p>}
            </article>
          );
        })}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">생활비</p>
        <h2>쿠알라룸푸르 vs 조호바루 가족 생활비</h2>
      </div>
      <div class="mis-living-cost-grid">
        <article class="mis-living-cost-card">
          <h3>쿠알라룸푸르</h3>
          <p>외국인 4인 가족 기준 월 생활비(주거비 제외) 약 {MIS_KL_LIVING_COST.monthlyFamilyExclRentLocal?.toLocaleString("en-US")} MYR</p>
          <p>3베드룸 콘도 월세: 외곽 약 {MIS_KL_LIVING_COST.monthlyRentLocal.budget?.toLocaleString("en-US")} MYR ~ 시내중심 약 {MIS_KL_LIVING_COST.monthlyRentLocal.premium?.toLocaleString("en-US")} MYR</p>
        </article>
        <article class="mis-living-cost-card mis-living-cost-card--pending">
          <h3>조호바루</h3>
          <p>생활비 데이터는 아직 준비 중입니다. 데이터가 확보되면 쿠알라룸푸르와 동일한 형식으로 업데이트합니다.</p>
        </article>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="mis-calc-cta">
        <div>
          <h3>우리 가족 조건으로 직접 계산해보세요</h3>
          <p>학교·학년·자녀 수·동반 형태를 입력하면 총비용을 바로 확인할 수 있습니다.</p>
        </div>
        <a class="button button--primary" href={withBase("/tools/southeast-asia-international-school-cost-calculator-2026/")}>계산기 바로가기</a>
      </div>
    </section>

    <SeoContent
      introTitle="말레이시아 국제학교 비교, 이렇게 읽으세요"
      intro={[
        "말레이시아는 동남아 국제학교 중 학교 선택지가 가장 많고 학비 스펙트럼도 넓습니다. 쿠알라룸푸르는 영국식·미국식·IB 커리큘럼을 모두 갖춘 학교가 있고, 싱가포르와 가까운 조호바루는 상대적으로 저렴한 선택지로 꼽힙니다.",
        "실제로 조호바루 3개교의 학비를 확인해보면, 같은 도시 안에서도 R.E.A.L Schools(약 1만3,760 MYR부터)와 Marlborough College(약 6만3,000 MYR부터)의 격차가 4배 이상 납니다. '조호바루=저렴하다'는 인식은 학교를 특정하지 않으면 정확하지 않을 수 있습니다.",
        "이 페이지의 학비 데이터는 학교마다 확인 수준이 다릅니다. 조호바루 3개교는 전부 공식 페이지 원문으로 확인했지만, 쿠알라룸푸르 5개교는 대부분 검색 결과 요약을 기반으로 합니다. 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 학비를 재확인하세요.",
        "생활비는 쿠알라룸푸르만 확인되었습니다. 조호바루 생활비 데이터가 보강되면 두 도시의 총비용을 나란히 비교할 수 있도록 업데이트할 예정입니다. 정확한 총비용은 계산기에서 확인하세요.",
      ]}
      criteria={[
        `학비는 학교 공식 페이지 또는 검색 결과 기준 ${MIS_META.updatedAt} 확인입니다.`,
        "조호바루 3개교는 공식 페이지 원문으로 확인했고, 쿠알라룸푸르는 대부분 검색 요약 기준입니다.",
        "조호바루 생활비는 미확보 상태로, 총비용 비교는 데이터 보강 후 가능합니다.",
        "이 페이지는 특정 학교를 추천하지 않으며 비교 정보만 제공합니다.",
      ]}
      faq={faqItems}
      related={MIS_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "malaysia-international-school-guide-2026",
  title: "말레이시아 국제학교 2026 완전 정리 | 학비·생활비 총정리",
  description: "쿠알라룸푸르·조호바루 국제학교의 학비와 생활비를 비교합니다. 한국 국제학교 대비 비용 차이까지 확인하세요.",
  order: 74.1,
  badges: ["NEW", "말레이시아", "국제학교", "학비"],
},
```

카테고리 등록(양쪽): `"malaysia-international-school-guide-2026": { category: "life", isNew: true }`

---

## 9. app.scss import / sitemap.xml

```scss
@use 'scss/pages/malaysia-international-school-guide-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/malaysia-international-school-guide-2026/</loc>
  <lastmod>2026-07-09</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 10. QA 포인트

- [ ] `SAC_SCHOOLS`에서 `country === "MY" && city === "kuala_lumpur"` 필터링 결과가 5개교, `city === "johor_bahru"`가 3개교인지 확인
- [ ] Sri KDU처럼 일부 학년 데이터만 있는 학교가 표에서 나머지 학년을 "확인 필요"로 명확히 표시하는지 확인
- [ ] R.E.A.L Schools JB가 국제부 트랙 학비만 사용하고 있는지(국가과정 트랙 수치가 섞여 들어가지 않았는지) 확인
- [ ] 2025년 7월 SST(서비스세) 관련 안내가 학비 표 상단이나 InfoNotice에 실제로 노출되는지 확인
- [ ] 조호바루 생활비 카드가 "준비 중"으로 명확히 인식되는 디자인인지(실수로 데이터 누락처럼 보이지 않게) 확인
- [ ] 신뢰도 배지(공식 확인/검색 요약)가 학교별로 정확히 매핑되는지 확인 — 특히 조호바루 3개교가 전부 "공식 확인"으로 뜨는지
- [ ] `npm run build` 통과
- [ ] `CONTENT_GUIDE.md` SeoContent intro 4단락·FAQ 5개 기준 충족
