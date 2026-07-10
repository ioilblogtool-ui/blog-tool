# 베트남 국제학교 2026 완전 정리 — 설계 문서

> 기획 원본: [`docs/plan/202607/southeast-asia-international-school-content-plan.md`](../../plan/202607/southeast-asia-international-school-content-plan.md) 8번
> 작성일: 2026-07-09 (2026-07-09 리서치 완료 후 업데이트 — 하노이 섹션 복원, 타이틀 원복)
> 유형: 정보형 리포트 (`/reports/`) — 정적 페이지
> 클러스터 5번 페이지
> 데이터 출처: [`southeast-asia-international-school-cost-calculator-2026-design.md`](./southeast-asia-international-school-cost-calculator-2026-design.md)의 `SAC_SCHOOLS` 중 `country === "VN"` 재사용

---

## 0. 하노이 데이터 확보 — 계획서 원안 타이틀·스코프로 복원, AISVN 리스크 사례는 그대로 유지

이전 리비전은 하노이 데이터 부재로 호치민 단독 진행 및 타이틀 축소를 권고했으나, 후속 리서치에서 **하노이 5개교(BIS Hanoi·BVIS Hanoi·Concordia는 공식 확인, UNIS·HIS는 검색 요약)와 생활비를 확보**했다. 계획서 원안 타이틀(`베트남 국제학교 2026 완전 정리 | 호치민·하노이 학비 비교`)로 복원한다.

**AISVN 폐교 리스크 사례는 이전 리비전과 동일하게 유지**한다 — 이 리포트만의 핵심 차별점(4번 참고)이며, 데이터가 보강되었다고 해서 약화시킬 이유가 없다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/vietnamInternationalSchoolGuide2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/vietnam-international-school-guide-2026.astro` |
| 스크립트 | 없음 (정적 비교표, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_vietnam-international-school-guide-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `vis-` (Vietnam International School)

---

## 2. URL 및 메타

```
슬러그: /reports/vietnam-international-school-guide-2026/
타이틀(seoTitle): 베트남 국제학교 2026 완전 정리 | 호치민·하노이 학비 비교
디스크립션: 호치민·하노이 국제학교의 학비를 비교합니다. 학교 선택 시 반드시 확인해야 할 재정 안정성 체크포인트도 정리했습니다.
```

---

## 3. 데이터 파일 설계

**`src/data/vietnamInternationalSchoolGuide2026.ts`**

```ts
import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const VIS_META = {
  slug: "vietnam-international-school-guide-2026",
  title: "베트남 국제학교, 호치민·하노이는 얼마나 들까",
  seoTitle: "베트남 국제학교 2026 완전 정리 | 호치민·하노이 학비 비교",
  seoDescription:
    "호치민·하노이 국제학교의 학비를 비교합니다. 학교 선택 시 반드시 확인해야 할 재정 안정성 체크포인트도 정리했습니다.",
  description: "호치민 4곳·하노이 5곳, 총 9개교의 학비·커리큘럼을 비교하고, 학교 선택 시 확인할 리스크를 안내합니다.",
  updatedAt: "2026-07-09",
  aisvnRiskNote:
    "American International School Vietnam(AISVN)은 학부모 예치금을 둘러싼 재정 스캔들로 2024년 7월부터 운영이 사실상 중단되었고, 2026년 1월 12일 호치민시가 공식 해산을 결정했습니다. 학비가 유난히 저렴하거나 최근 급성장한 학교, 재정 구조가 불투명한 학교는 입학 전 반드시 재정 건전성과 인가 현황을 확인해야 합니다.",
};

// 호치민 + 하노이 필터링해 재사용 — 새 데이터 정의 금지. AISVN은 폐교로 SAC_SCHOOLS에 포함하지 않음(계산기 설계 문서 참고)
export const VIS_HCMC_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "VN" && s.city === "ho_chi_minh");
export const VIS_HANOI_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "VN" && s.city === "hanoi");
export const VIS_HCMC_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "ho_chi_minh")!;
export const VIS_HANOI_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "hanoi")!;
export const VIS_FX_RATE = SAC_FX_RATES.find((f) => f.currency === "VND")!;

export type SchoolProfileNote = { schoolId: string; oneLinerKo: string; bestFor: string };

export const VIS_SCHOOL_NOTES: SchoolProfileNote[] = [
  { schoolId: "ais-hcmc", oneLinerKo: "이 클러스터 전체에서 유일하게 학교 공식 Fee Schedule PDF 원문을 직접 확인한 학교 — 데이터 신뢰도가 가장 높음.", bestFor: "정확한 학비 정보를 우선하는 가정" },
  { schoolId: "bis-hcmc", oneLinerKo: "영국식 명문 Nord Anglia 계열, 다만 중간 학년 데이터는 아직 확인되지 않음.", bestFor: "영국식 커리큘럼을 원하는 가정(중간 학년은 별도 확인 필요)" },
  { schoolId: "ishcmc", oneLinerKo: "호치민에서 오래된 IB 국제학교 중 하나.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "renaissance-saigon", oneLinerKo: "호치민 4개교 중 상대적으로 학비가 낮은 편.", bestFor: "예산을 고려하면서 IB 커리큘럼을 원하는 가정" },
  { schoolId: "bis-hanoi", oneLinerKo: "하노이 5개교 중 학년별 데이터가 가장 촘촘하고 공식 확인됨(두 차례 독립 조사로 교차검증).", bestFor: "영국식 커리큘럼을 원하고 정확한 학비 정보를 우선하는 가정" },
  { schoolId: "bvis-hanoi", oneLinerKo: "BIS Hanoi 자매학교, 상대적으로 학비가 낮은 편.", bestFor: "영국식 커리큘럼을 원하면서 BIS보다 예산을 낮추고 싶은 가정" },
  { schoolId: "concordia-hanoi", oneLinerKo: "하노이 5개교 중 최고가, IB 커리큘럼.", bestFor: "IB 프리미엄 교육을 원하는 가정" },
  { schoolId: "unis-hanoi", oneLinerKo: "하노이의 대표 IB 국제학교 중 하나, 학년별 데이터가 세분화되어 있으나 3자 집계 기준.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "his-hanoi", oneLinerKo: "하노이 5개교 중 상대적으로 저렴한 미국식 학교.", bestFor: "예산을 고려하면서 미국식 커리큘럼을 원하는 가정" },
];

export const VIS_FAQ: FaqItem[] = [
  {
    question: "호치민과 하노이 중 어디가 더 저렴한가요?",
    answer:
      "확보된 데이터 기준으로는 두 도시 모두 프리미엄 학교 위주라 큰 차이는 없지만, 호치민의 Renaissance International School Saigon(약 1억 9,000만 VND부터)과 하노이의 BVIS Hanoi(약 2억 5,170만 VND부터)가 각 도시에서 상대적으로 저렴한 편입니다.",
  },
  {
    question: "베트남 국제학교 학비는 어떤 통화로 확인해야 하나요?",
    answer:
      "베트남 국제학교는 보통 베트남 동(VND)으로 학비를 고지하지만, 계약서나 안내 자료에 미국 달러(USD) 환산액을 함께 표기하는 경우도 많습니다. 이 페이지는 VND 기준으로 정리했으며, 원화 환산은 계산기에서 확인할 수 있습니다.",
  },
  {
    question: "AISVN(American International School Vietnam)은 왜 이 페이지에 없나요?",
    answer:
      "AISVN은 학부모 예치금을 둘러싼 재정 스캔들로 2024년 7월부터 정상 운영이 어려워졌고, 2026년 1월 12일 호치민시가 공식 해산을 결정했습니다. 더 이상 유효한 선택지가 아니어서 데이터에서 제외했습니다. 자세한 내용은 아래 '학교 선택 시 확인할 것' 섹션을 참고하세요.",
  },
  {
    question: "베트남 국제학교를 고를 때 학비 외에 무엇을 확인해야 하나요?",
    answer:
      "학비가 다른 학교보다 유난히 저렴하거나, 학교 역사가 짧거나, 재정 구조가 불투명하다면 입학 전 인가 현황과 재정 건전성을 반드시 확인해야 합니다. AISVN 사례처럼 재정 문제로 갑자기 폐교하면 이미 납부한 학비를 돌려받지 못할 위험이 있습니다.",
  },
  {
    question: "하노이 국제학교 학비 데이터는 얼마나 정확한가요?",
    answer:
      "학교마다 다릅니다. BIS Hanoi·BVIS Hanoi·Concordia International School Hanoi는 학교 공식 페이지 원문으로 확인했지만, UNIS Hanoi·Hanoi International School(HIS)은 3자 집계 사이트를 통해 확보해 재확인이 더 필요합니다. 각 학교 카드의 신뢰도 배지를 확인하세요.",
  },
];

export const VIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "학비를 직접 계산해보세요." },
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국 총비용을 비교합니다." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르·조호바루 국제학교 학비를 정리합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕·치앙마이 국제학교 학비를 정리합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 베트남 국제학교
 └─ title: 베트남 국제학교, 호치민·하노이는 얼마나 들까
 └─ description: 호치민 4개교·하노이 5개교의 학비를 비교하고 선택 시 리스크를 안내합니다

InfoNotice (학비 출처·확인일자 — AIS Vietnam·BIS/BVIS/Concordia Hanoi만 공식 확인, 나머지는 검색 요약임을 명시)

섹션 1 — 호치민 4개교 학비 비교표 (VIS_HCMC_SCHOOLS)
섹션 2 — 하노이 5개교 학비 비교표 (VIS_HANOI_SCHOOLS)
섹션 3 — 학교별 상세 카드 9개 (VIS_SCHOOL_NOTES)
섹션 4 — 주재원 가족 참고사항 (교육수당 포함 여부에 따라 실부담이 달라진다는 InfoNotice — 계획서 8번 명시 항목)
섹션 5 — ⚠ 학교 선택 시 확인할 것 (aisvnRiskNote — AISVN 실제 사례 인용, 가장 신중하게 다룰 섹션)
섹션 6 — 호치민 vs 하노이 생활비 비교 (양쪽 다 수치 확보 — 2열 카드)
섹션 7 — 계산기 CTA
SeoContent (FAQ 5개 + 관련 링크 4개)
```

---

## 5. 컴포넌트 구조

공유 컴포넌트는 국내 클러스터와 동일. 페이지 전용 마크업(`vis-` 프리픽스)은 다른 국가 리포트와 동일 패턴을 재사용하되, 이 리포트만 섹션 5(리스크 경고)가 추가된다.

| 블록 클래스 | 설명 |
|---|---|
| `.vis-page` | 루트 스코프 |
| `.vis-compare-table` | 섹션 1·2 — 학비 비교표 |
| `.vis-confidence-badge` | 공식확인/검색요약 배지 |
| `.vis-school-card-grid` / `.vis-school-card` | 섹션 3 — 학교별 상세 카드 |
| `.vis-expat-note-card` | 섹션 4 — 주재원 참고사항 카드 |
| `.vis-risk-card` | 섹션 5 — AISVN 리스크 경고 카드 (다른 카드보다 시각적으로 강조: 배경색·아이콘) |
| `.vis-living-cost-grid` / `.vis-living-cost-card` | 섹션 6 — 도시별 생활비 카드 2열 |
| `.vis-calc-cta` | 섹션 7 — 계산기 유도 배너 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_vietnam-international-school-guide-2026.scss`

```scss
.vis-page {
  --vis-line: #d8e0ea;
  --vis-accent: #0f6e56;
  --vis-risk-bg: var(--color-warning-tint, rgba(186, 117, 23, 0.12));
  --vis-risk-border: var(--color-warning, #ba7517);

  .vis-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--vis-line);
      padding: 0.55rem 0.7rem;
      text-align: left;
    }
  }

  .vis-confidence-badge {
    display: inline-flex;
    border-radius: var(--radius-chip, 20px);
    padding: 0.15rem 0.55rem;
    font-size: 0.72rem;

    &[data-confidence="official"] { background: var(--color-brand-tint); color: var(--color-brand-primary); }
    &[data-confidence="snippet"] { background: var(--color-warning-tint); color: var(--color-warning); }
  }

  .vis-school-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  .vis-school-card {
    border: 1px solid var(--vis-line);
    border-radius: var(--radius-card, 12px);
    padding: 1.1rem;

    h3 { margin: 0 0 0.4rem; }
  }

  .vis-expat-note-card {
    border: 1px solid var(--vis-line);
    border-left: 4px solid var(--vis-accent);
    border-radius: var(--radius-card, 12px);
    padding: 1.1rem;
  }

  .vis-risk-card {
    background: var(--vis-risk-bg);
    border: 1px solid var(--vis-risk-border);
    border-radius: var(--radius-card, 12px);
    padding: 1.25rem;

    h3 { margin: 0 0 0.5rem; color: var(--vis-risk-border); }
  }

  .vis-living-cost-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .vis-living-cost-card {
    border: 1px solid var(--vis-line);
    border-left: 4px solid var(--vis-accent);
    border-radius: var(--radius-card, 12px);
    padding: 1.1rem;
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
  VIS_META, VIS_HCMC_SCHOOLS, VIS_HANOI_SCHOOLS, VIS_SCHOOL_NOTES,
  VIS_HCMC_LIVING_COST, VIS_HANOI_LIVING_COST, VIS_FAQ, VIS_RELATED_LINKS,
} from "../../data/vietnamInternationalSchoolGuide2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = VIS_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
const badgeAttr = (s: typeof VIS_HCMC_SCHOOLS[number]) => (s.dataConfidence === "official_confirmed" ? "official" : "snippet");
const badgeLabel = (s: typeof VIS_HCMC_SCHOOLS[number]) => (s.dataConfidence === "official_confirmed" ? "공식 확인" : "검색 요약");
---
<BaseLayout title={VIS_META.seoTitle} description={VIS_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page vis-page">
    <CalculatorHero eyebrow="베트남 국제학교" title={VIS_META.title} description={VIS_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[
      "AIS Saigon(호치민)·BIS/BVIS/Concordia(하노이)는 학교 공식 자료로 확인했고, 나머지는 검색 결과 요약 기준입니다.",
      "이 페이지는 특정 학교를 추천하지 않으며 비교 정보만 제공합니다.",
    ]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교 · 호치민</p>
        <h2>호치민 4개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="vis-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비(VND)</th><th>커리큘럼</th><th>확인</th></tr></thead>
          <tbody>
            {VIS_HCMC_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{tier.annualLocal.toLocaleString("en-US")}</td>
                <td>{school.curriculum}</td>
                <td><span class="vis-confidence-badge" data-confidence={badgeAttr(school)}>{badgeLabel(school)}</span></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교 · 하노이</p>
        <h2>하노이 5개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="vis-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비(VND)</th><th>커리큘럼</th><th>확인</th></tr></thead>
          <tbody>
            {VIS_HANOI_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{tier.annualLocal.toLocaleString("en-US")}</td>
                <td>{school.curriculum}</td>
                <td><span class="vis-confidence-badge" data-confidence={badgeAttr(school)}>{badgeLabel(school)}</span></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학교별 상세</p>
        <h2>9개교 한 줄 요약</h2>
      </div>
      <div class="vis-school-card-grid">
        {[...VIS_HCMC_SCHOOLS, ...VIS_HANOI_SCHOOLS].map((school) => {
          const note = VIS_SCHOOL_NOTES.find((n) => n.schoolId === school.id)!;
          return (
            <article class="vis-school-card">
              <h3>{school.name} <small>({school.cityLabel})</small></h3>
              <p>{note.oneLinerKo}</p>
              <p><strong>추천:</strong> {note.bestFor}</p>
              {school.dataNote && <p class="vis-data-note">⚠ {school.dataNote}</p>}
            </article>
          );
        })}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">주재원 가족 참고</p>
        <h2>회사 교육수당이 있다면 실부담은 달라집니다</h2>
      </div>
      <article class="vis-expat-note-card">
        <p>호치민·하노이는 한국 기업 주재원 가족 수요가 많은 지역입니다. 회사에서 자녀 교육수당(학자금)을 지원한다면 실제 가계 부담은 이 페이지의 학비보다 크게 낮아질 수 있습니다. 이 계산기·리포트의 수치는 교육수당을 반영하지 않은 총학비 기준입니다.</p>
      </article>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">⚠ 주의</p>
        <h2>학교 선택 시 확인할 것</h2>
      </div>
      <article class="vis-risk-card">
        <h3>학비가 유난히 저렴하다면 재정 건전성을 꼭 확인하세요</h3>
        <p>{VIS_META.aisvnRiskNote}</p>
      </article>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">생활비</p>
        <h2>호치민 vs 하노이 가족 생활비</h2>
      </div>
      <div class="vis-living-cost-grid">
        <article class="vis-living-cost-card">
          <h3>호치민</h3>
          <p>외국인 4인 가족 기준 월 생활비(주거비 제외) 약 {VIS_HCMC_LIVING_COST.monthlyFamilyExclRentLocal?.toLocaleString("en-US")} VND</p>
          <p>3베드룸 아파트 월세: 외곽 약 {VIS_HCMC_LIVING_COST.monthlyRentLocal.budget?.toLocaleString("en-US")} VND ~ 시내중심 약 {VIS_HCMC_LIVING_COST.monthlyRentLocal.premium?.toLocaleString("en-US")} VND</p>
        </article>
        <article class="vis-living-cost-card">
          <h3>하노이</h3>
          <p>외국인 4인 가족 기준 월 생활비(주거비 제외) 약 {VIS_HANOI_LIVING_COST.monthlyFamilyExclRentLocal?.toLocaleString("en-US")} VND</p>
          <p>3베드룸 아파트 월세: 외곽 약 {VIS_HANOI_LIVING_COST.monthlyRentLocal.budget?.toLocaleString("en-US")} VND ~ 시내중심 약 {VIS_HANOI_LIVING_COST.monthlyRentLocal.premium?.toLocaleString("en-US")} VND</p>
        </article>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="vis-calc-cta">
        <div>
          <h3>우리 가족 조건으로 직접 계산해보세요</h3>
          <p>학교·학년·자녀 수를 입력하면 총비용을 바로 확인할 수 있습니다.</p>
        </div>
        <a class="button button--primary" href={withBase("/tools/southeast-asia-international-school-cost-calculator-2026/")}>계산기 바로가기</a>
      </div>
    </section>

    <SeoContent
      introTitle="베트남 호치민·하노이 국제학교 비교, 이렇게 읽으세요"
      intro={[
        "호치민과 하노이는 한국 기업 주재원 가족이 많아 국제학교 정보 교류가 활발한 두 도시입니다. 이 페이지는 확인된 9개교의 학비를 비교하고, 학교 선택 시 반드시 짚어야 할 리스크를 함께 안내합니다.",
        "이번 조사에서 학비 데이터의 신뢰 수준은 학교마다 다릅니다. Australian International School Vietnam(AIS Saigon, 호치민), British International School Hanoi·British Vietnamese International School Hanoi·Concordia International School Hanoi(하노이)는 학교 공식 자료로 직접 확인했고, 나머지는 검색 결과 요약을 기반으로 합니다.",
        "베트남 국제학교 시장은 성장이 빠른 만큼 재정 부실 리스크도 존재합니다. American International School Vietnam(AISVN)은 재정 스캔들로 실제 폐교했으며, 이는 학비만 보고 학교를 고르면 안 되는 이유를 보여주는 실제 사례입니다.",
        "회사 교육수당을 받는 주재원 가정이라면 이 페이지의 학비 수치보다 실제 부담이 낮을 수 있습니다. 정확한 총비용은 회사 지원 정책을 먼저 확인한 뒤 계산기로 나머지를 계산하는 것을 권장합니다.",
      ]}
      criteria={[
        `학비는 ${VIS_META.updatedAt} 기준이며, 학교별로 확인 수준이 다릅니다(공식 확인/검색 요약 배지 참고).`,
        "AISVN은 폐교(2026-01-12 공식 해산)로 데이터에서 제외했습니다.",
        "이 페이지는 특정 학교를 추천하지 않으며 비교 정보만 제공합니다.",
      ]}
      faq={faqItems}
      related={VIS_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "vietnam-international-school-guide-2026",
  title: "베트남 국제학교 2026 완전 정리 | 호치민·하노이 학비 비교",
  description: "호치민·하노이 국제학교의 학비를 비교합니다. 학교 선택 시 반드시 확인해야 할 재정 안정성 체크포인트도 정리했습니다.",
  order: 74.3,
  badges: ["NEW", "베트남", "국제학교", "학비"],
},
```

카테고리 등록(양쪽): `"vietnam-international-school-guide-2026": { category: "life", isNew: true }`

---

## 9. app.scss import / sitemap.xml

```scss
@use 'scss/pages/vietnam-international-school-guide-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/vietnam-international-school-guide-2026/</loc>
  <lastmod>2026-07-09</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 10. QA 포인트

- [ ] **AISVN 폐교 사실 관계 재확인** — 구현 시점에 VnExpress 등 원 출처 기사를 다시 확인해 날짜·경위 서술이 정확한지 검증 (민감한 실명 사례이므로 국내 클러스터의 "법·제도 서술은 추측 금지" 원칙과 동일하게 취급)
- [ ] `SAC_SCHOOLS`에서 `country === "VN" && city === "ho_chi_minh"` 필터링 결과가 4개교, `city === "hanoi"`가 5개교인지, AISVN이 포함되지 않았는지 확인
- [ ] BIS HCMC·ISHCMC·Renaissance·BVIS Hanoi·Concordia Hanoi처럼 양끝 학년만 있는 학교가 비교표에서 중간 학년 데이터 없음을 명확히 하는지 확인
- [ ] 하노이 UNIS의 등록 예치금·입학금·지원료(달러 표시)가 학비(VND 표시)와 통화가 섞이지 않도록 표기 확인
- [ ] 리스크 카드(섹션 5)가 다른 섹션보다 시각적으로 눈에 띄는지(경고 색상 적용) 확인 — 이 리포트에서 가장 중요한 안전장치이므로 절대 다른 카드처럼 밋밋하게 묻히면 안 됨
- [ ] `npm run build` 통과
- [ ] `CONTENT_GUIDE.md` SeoContent intro 4단락·FAQ 5개 기준 충족
