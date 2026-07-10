# 한국 vs 동남아 국제학교 2026 — 설계 문서 (메인 후킹 허브)

> 기획 원본: [`docs/plan/202607/southeast-asia-international-school-content-plan.md`](../../plan/202607/southeast-asia-international-school-content-plan.md) 5번
> 작성일: 2026-07-09
> 유형: 비교 리포트 (`/reports/`) — 정적 페이지 + 계산기 CTA
> 클러스터 2번 페이지 (메인 후킹)
> 선행 문서: [`southeast-asia-international-school-cost-calculator-2026-design.md`](./southeast-asia-international-school-cost-calculator-2026-design.md) — 이 페이지는 그 계산기의 데이터를 그대로 재사용한다

---

## 0. 이 페이지의 역할과 데이터 제약

이 페이지는 클러스터의 메인 후킹으로, "학비만 보면 동남아가 싸 보이지만 생활비까지 더하면 다르다"는 핵심 포인트를 국가별 비교 카드로 보여준다. **계산기 설계 문서 0번에서 확인했듯 생활비 데이터가 3개 도시 모두 미확보 상태이므로, 이 허브 페이지도 계산기가 준비되기 전까지는 "학비 비교"만 가능하고 "총비용 비교"는 보여줄 수 없다.** 이 페이지는 계산기와 동시에 배포하는 것을 전제로 설계하며, 계산기의 생활비 데이터가 채워지기 전에 이 페이지를 먼저 배포하지 않는다 — 그렇지 않으면 "학비만 비교하면 안 되는 이유"를 핵심 메시지로 내세우면서 정작 생활비를 못 보여주는 모순이 생긴다.

한국 쪽 데이터는 이미 배포된 국내 클러스터의 `IST_SCHOOLS`(`src/data/internationalSchoolTuitionCalculator2026.ts`)를 그대로 재사용하고, 동남아 쪽은 `SAC_SCHOOLS`(`southeastAsiaInternationalSchoolCostCalculator2026.ts`)를 재사용한다 — 국내 클러스터의 "새 데이터 정의 금지, 재사용" 원칙을 그대로 따른다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/koreaVsSoutheastAsiaInternationalSchool2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/korea-vs-southeast-asia-international-school-2026.astro` |
| 스크립트 | `public/scripts/korea-vs-southeast-asia-international-school-2026.js` (국가 탭 전환만 — 계산 로직 없음) |
| 스타일 | `src/styles/scss/pages/_korea-vs-southeast-asia-international-school-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `kvsa-` (Korea vs Southeast Asia)

---

## 2. URL 및 메타

```
슬러그: /reports/korea-vs-southeast-asia-international-school-2026/
타이틀(seoTitle): 한국 vs 동남아 국제학교 2026 | 1년 총비용 한눈에 비교
디스크립션: 한국과 말레이시아·태국·베트남 국제학교의 학비, 생활비, 5년 누적 비용을 비교합니다. 계산기로 우리 가족 비용도 바로 확인하세요.
```

---

## 3. 데이터 파일 설계

**`src/data/koreaVsSoutheastAsiaInternationalSchool2026.ts`**

```ts
import { IST_SCHOOLS, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";
import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const KVSA_META = {
  slug: "korea-vs-southeast-asia-international-school-2026",
  title: "한국 국제학교, 동남아로 옮기면 정말 저렴할까",
  seoTitle: "한국 vs 동남아 국제학교 2026 | 1년 총비용 한눈에 비교",
  seoDescription:
    "한국과 말레이시아·태국·베트남 국제학교의 학비, 생활비, 5년 누적 비용을 비교합니다. 계산기로 우리 가족 비용도 바로 확인하세요.",
  description: "한국과 동남아 3개국 국제학교의 학비와 생활비를 더한 총비용을 비교합니다.",
  updatedAt: "2026-07-09",
};

// 한국 쪽 대표값 — 국내 클러스터 7개교 중 지역별 대표 1곳씩 선정(허브 페이지와 동일한 방식)
export const KVSA_KR_REPRESENTATIVE_IDS = ["dulwich-seoul", "chadwick-songdo", "nlcs-jeju"] as const;
export const KVSA_KR_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS.filter((s) =>
  (KVSA_KR_REPRESENTATIVE_IDS as readonly string[]).includes(s.id)
);

// 동남아 쪽 — 6개 도시 대표 1곳씩만 선정 (전체 28개교를 다 나열하면 허브 페이지 비교표가 지나치게 길어짐)
export const KVSA_SEA_REPRESENTATIVE_IDS = [
  "sri-kdu-kl", "real-schools-jb", "kis-bangkok", "cmis-chiangmai", "renaissance-saigon", "bis-hanoi",
] as const;
export const KVSA_SEA_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) =>
  (KVSA_SEA_REPRESENTATIVE_IDS as readonly string[]).includes(s.id)
);
export const KVSA_SEA_LIVING_COSTS = SAC_LIVING_COSTS;
export const KVSA_SEA_FX_RATES = SAC_FX_RATES;

export type CountrySummaryCard = {
  countryKey: "MY" | "TH" | "VN";
  countryLabel: string;
  cityLabel: string;
  representativeSchoolId: string;
  prosNote: string;   // 장점 한 줄
  consNote: string;   // 단점/주의 한 줄
  bestFor: string;    // "이런 가족에게 맞음"
};

// 원안 초안의 "나라별 추천 대상" 표를 이 사이트 톤으로 재정리
export const KVSA_COUNTRY_SUMMARY: CountrySummaryCard[] = [
  {
    countryKey: "MY",
    countryLabel: "말레이시아",
    cityLabel: "쿠알라룸푸르",
    representativeSchoolId: "sri-kdu-kl",
    prosNote: "5개국 중 학교 선택지가 가장 많고, 학비 스펙트럼도 넓어 예산에 맞춰 고르기 쉽습니다.",
    consNote: "학교 등급별 학비 편차가 커서, 등급을 잘못 고르면 한국과 비슷하거나 더 비쌀 수 있습니다.",
    bestFor: "예산에 맞춰 학교를 직접 비교해보고 싶은 가족",
  },
  {
    countryKey: "TH",
    countryLabel: "태국",
    cityLabel: "방콕",
    representativeSchoolId: "kis-bangkok",
    prosNote: "국제학교 수가 많고 생활 인프라(병원·쇼핑·교통)가 잘 갖춰져 있습니다.",
    consNote: "프리미엄 학교(ISB·Harrow 등)는 학비만으로도 한국 상위권 학교에 근접하거나 더 비쌉니다.",
    bestFor: "학비보다 생활 인프라·편의성을 중시하는 가족",
  },
  {
    countryKey: "VN",
    countryLabel: "베트남",
    cityLabel: "호치민",
    representativeSchoolId: "renaissance-saigon",
    prosNote: "한국 기업 주재원이 많아 한인 커뮤니티·정보 교류가 활발합니다.",
    consNote: "일부 학교의 재정 안정성 이슈(폐교 사례 존재)가 있어 학교 선택 시 재정 건전성 확인이 특히 중요합니다.",
    bestFor: "주재원 발령 등으로 이미 호치민 이주가 예정된 가족",
  },
];

export const KVSA_FAQ: FaqItem[] = [
  {
    question: "동남아 국제학교가 한국보다 확실히 저렴한가요?",
    answer:
      "학비만 보면 대체로 그렇습니다. 하지만 부모가 동반해 거주할 경우 주거비·생활비가 추가되므로, 총비용은 학교 등급과 거주 형태에 따라 한국과 비슷해지거나 오히려 더 비싸질 수 있습니다. 계산기에서 조건을 입력해 직접 비교해보는 것이 정확합니다.",
  },
  {
    question: "한국과 동남아 중 어느 쪽이 커리큘럼 선택지가 더 많나요?",
    answer:
      "양쪽 모두 IB·영국식(A-Level)·미국식(AP) 커리큘럼을 제공하는 학교가 있습니다. 특정 대학 진학을 목표로 한다면 목표 국가의 대입 제도와 맞는 커리큘럼을 우선 확인하는 것이 좋습니다.",
  },
  {
    question: "자녀 1명을 한국 국제학교에 보내는 비용으로 동남아 가족 이주가 가능한가요?",
    answer:
      "학교와 거주 형태에 따라 다릅니다. 한국의 프리미엄 학교(예: 서울권 원화 전액 학교) 학비 수준이면 동남아 중간~프리미엄 등급 학교의 학비+생활비를 감당할 수 있는 경우가 있지만, 정확한 비교는 계산기로 직접 확인해야 합니다.",
  },
  {
    question: "왜 조호바루·치앙마이·하노이는 이 비교에 없나요?",
    answer:
      "이 세 도시는 아직 학비·생활비 데이터를 충분히 확보하지 못해 1차 비교에서 제외했습니다. 데이터 확보 후 추가할 예정입니다.",
  },
  {
    question: "베트남 국제학교는 안전한가요?",
    answer:
      "대부분 안정적으로 운영되지만, 일부 학교는 재정 문제로 폐교한 사례가 실제로 있었습니다(AISVN, 2026년 1월 해산). 학비가 유난히 저렴하거나 최근 설립된 학교라면 재정 건전성과 학력 인정 여부를 반드시 확인하세요.",
  },
];

export const KVSA_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "우리 가족 조건으로 직접 계산해보세요." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리", description: "국내 국제학교 학비와 입학조건을 비교합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 한국 vs 동남아
 └─ title: 한국 국제학교, 동남아로 옮기면 정말 저렴할까
 └─ description: 학비만 보지 말고 생활비까지 더한 총비용으로 비교합니다

InfoNotice (데이터 신뢰도 + "학교별 확인 수준이 다릅니다" 안내)

섹션 1 — 한국 국제학교 평균 비용 요약 (KVSA_KR_SCHOOLS 3개교 카드)
섹션 2 — 동남아 국가별 비용 요약 (KVSA_COUNTRY_SUMMARY 3개 카드: 장점/단점/추천대상)
섹션 3 — "학비만 비교하면 안 되는 이유" (개념 설명 카드 — 생활비 미포함 시 오해 소지 강조)
섹션 4 — 한국 vs 국가별 대표 학교 비교표 (KVSA_KR_SCHOOLS + KVSA_SEA_SCHOOLS 대표 학년 매칭)
섹션 5 — 계산기 CTA 배너 ("우리 가족 조건으로 계산해보기")
섹션 6 — 국가별 리포트 링크 카드 3개
SeoContent (FAQ 5개 + 관련 링크 5개)
```

---

## 5. 컴포넌트 구조

공유 컴포넌트는 국내 클러스터와 동일(`BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`).

### 페이지 전용 마크업 (`kvsa-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.kvsa-page` | 루트 스코프 |
| `.kvsa-kr-card-grid` / `.kvsa-kr-card` | 섹션 1 — 한국 대표 학교 3개 카드 |
| `.kvsa-country-card-grid` / `.kvsa-country-card` | 섹션 2 — 국가별 장단점 카드 |
| `.kvsa-concept-card` | 섹션 3 — "학비만 비교하면 안 되는 이유" 설명 카드 |
| `.kvsa-compare-table` | 섹션 4 — 한국 vs 국가별 비교표 |
| `.kvsa-calc-cta` | 섹션 5 — 계산기 유도 배너 |
| `.kvsa-report-link-grid` / `.kvsa-report-link-card` | 섹션 6 — 국가별 리포트 링크 카드 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_korea-vs-southeast-asia-international-school-2026.scss`

```scss
.kvsa-page {
  --kvsa-line: #d8e0ea;
  --kvsa-accent: var(--color-accent, #534ab7);

  .kvsa-kr-card-grid, .kvsa-country-card-grid, .kvsa-report-link-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 900px) { grid-template-columns: 1fr; }
  }

  .kvsa-kr-card, .kvsa-country-card, .kvsa-report-link-card {
    border: 1px solid var(--kvsa-line);
    border-radius: var(--radius-card, 12px);
    padding: 1.1rem;

    h3 { margin: 0 0 0.4rem; }
  }

  .kvsa-country-card {
    &__pros::before { content: "✓ "; color: var(--color-brand-primary, #0f6e56); }
    &__cons::before { content: "⚠ "; color: var(--color-warning, #ba7517); }
  }

  .kvsa-concept-card {
    border: 1px solid var(--kvsa-line);
    border-left: 4px solid var(--kvsa-accent);
    border-radius: var(--radius-card, 12px);
    padding: 1.25rem;
  }

  .kvsa-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--kvsa-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
      vertical-align: top;
    }
  }

  .kvsa-calc-cta {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    align-items: flex-start;
    border-radius: var(--radius-card, 12px);
    padding: 1.5rem;
    background: var(--color-brand-tint, rgba(15, 110, 86, 0.06));
    border: 1px solid var(--kvsa-line);

    @media (min-width: 640px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
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
  KVSA_META, KVSA_KR_SCHOOLS, KVSA_SEA_SCHOOLS, KVSA_COUNTRY_SUMMARY, KVSA_FAQ, KVSA_RELATED_LINKS,
} from "../../data/koreaVsSoutheastAsiaInternationalSchool2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = KVSA_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
---
<BaseLayout title={KVSA_META.seoTitle} description={KVSA_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page kvsa-page">
    <CalculatorHero eyebrow="한국 vs 동남아" title={KVSA_META.title} description={KVSA_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[
      "학비·생활비는 학교 공식 페이지 또는 검색 결과 기준이며, 국가·학교별로 확인 수준이 다릅니다.",
      "이 페이지는 특정 국가나 학교를 추천하지 않으며 비교 정보만 제공합니다.",
    ]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">한국</p>
        <h2>한국 국제학교 대표 학비</h2>
      </div>
      <div class="kvsa-kr-card-grid">
        {KVSA_KR_SCHOOLS.map((school) => (
          <article class="kvsa-kr-card">
            <h3>{school.name}</h3>
            <p>{school.regionLabel} · {school.tuitionTiers[0].tierLabel}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">동남아 3개국</p>
        <h2>나라별 장단점과 추천 대상</h2>
      </div>
      <div class="kvsa-country-card-grid">
        {KVSA_COUNTRY_SUMMARY.map((c) => (
          <article class="kvsa-country-card">
            <h3>{c.countryLabel} ({c.cityLabel})</h3>
            <p class="kvsa-country-card__pros">{c.prosNote}</p>
            <p class="kvsa-country-card__cons">{c.consNote}</p>
            <p><strong>추천:</strong> {c.bestFor}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">핵심 포인트</p>
        <h2>학비만 비교하면 안 되는 이유</h2>
      </div>
      <article class="kvsa-concept-card">
        <p>동남아 국제학교의 학비만 놓고 보면 한국보다 저렴한 경우가 많습니다. 하지만 부모가 자녀와 함께 거주한다면 주거비·식비·교통비 같은 생활비가 새로 발생합니다. 반대로 자녀만 기숙사에 보낸다면 학비 외 추가 비용이 크지 않을 수 있습니다. 즉 "동남아가 무조건 싸다"가 아니라 "가족의 동반 형태에 따라 다르다"가 정확한 결론입니다.</p>
      </article>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">비교표</p>
        <h2>한국 vs 동남아 대표 학교 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="kvsa-compare-table">
          <thead><tr><th>국가</th><th>학교</th><th>대표 학년</th><th>연간 학비</th></tr></thead>
          <tbody>
            {KVSA_KR_SCHOOLS.map((s) => (
              <tr><td>한국 ({s.regionLabel})</td><td>{s.name}</td><td>{s.tuitionTiers[0].tierLabel}</td>
                <td>{s.tuitionTiers[0].krwPortion > 0 ? `${(s.tuitionTiers[0].krwPortion/10000).toLocaleString("ko-KR")}만원~` : `$${s.tuitionTiers[0].usdPortion.toLocaleString("en-US")}~`}</td></tr>
            ))}
            {KVSA_SEA_SCHOOLS.map((s) => (
              <tr><td>{s.cityLabel}</td><td>{s.name}</td><td>{s.tuitionTiers[0].tierLabel}</td>
                <td>{s.tuitionTiers[0].annualLocal.toLocaleString("en-US")} {s.currency}~</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="op-message">원화 환산·생활비 포함 총비용은 <a href={withBase("/tools/southeast-asia-international-school-cost-calculator-2026/")}>계산기</a>에서 확인하세요.</p>
    </section>

    <section class="content-section op-section">
      <div class="kvsa-calc-cta">
        <div>
          <h3>우리 가족 조건으로 직접 계산해보세요</h3>
          <p>국가·도시·학년·자녀 수·동반 형태를 입력하면 총비용을 바로 확인할 수 있습니다.</p>
        </div>
        <a class="button button--primary" href={withBase("/tools/southeast-asia-international-school-cost-calculator-2026/")}>계산기 바로가기</a>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">국가별 상세</p>
        <h2>나라별 자세히 보기</h2>
      </div>
      <div class="kvsa-report-link-grid">
        <a class="kvsa-report-link-card" href={withBase("/reports/malaysia-international-school-guide-2026/")}><h3>말레이시아</h3><p>쿠알라룸푸르 학비·생활비 총정리</p></a>
        <a class="kvsa-report-link-card" href={withBase("/reports/thailand-international-school-guide-2026/")}><h3>태국</h3><p>방콕 학비·생활비 총정리</p></a>
        <a class="kvsa-report-link-card" href={withBase("/reports/vietnam-international-school-guide-2026/")}><h3>베트남</h3><p>호치민 학비·생활비 총정리</p></a>
      </div>
    </section>

    <SeoContent
      introTitle="한국 vs 동남아 국제학교, 이렇게 비교하세요"
      intro={[
        "국제학교 학비 부담 때문에 동남아 이주를 검토하는 학부모가 많습니다. 하지만 대부분의 비교 콘텐츠는 학비만 보여줄 뿐 생활비를 빠뜨려 실제보다 낙관적인 인상을 줍니다. 이 페이지는 학비와 생활비를 함께 놓고 비교합니다.",
        "말레이시아·태국·베트남은 각각 학교 선택지, 생활 인프라, 커뮤니티 환경이 다릅니다. 단순히 '가장 싼 나라'를 찾기보다 가족의 우선순위(예산, 편의성, 기존 네트워크)에 맞는 나라를 고르는 것이 중요합니다.",
        "동반 형태(부모 전체 동반, 엄마만 동반, 자녀만 기숙)에 따라 총비용이 크게 달라집니다. 학비만 보고 결정하면 실제 이주 후 생활비 부담을 과소평가하기 쉽습니다.",
        "이 페이지의 학비 데이터는 학교 공식 페이지 또는 검색 결과 기준이며 확인 수준이 학교마다 다릅니다. 실제 지원 전에는 반드시 각 학교 공식 입학처에서 최신 정보를 재확인하세요.",
      ]}
      criteria={[
        `학비 데이터는 ${KVSA_META.updatedAt} 기준이며 학교별 확인 수준이 다릅니다.`,
        "생활비 데이터가 없는 도시는 학비만 비교 대상에 포함됩니다.",
        "이 페이지는 특정 국가·학교를 추천하지 않으며 비교 정보만 제공합니다.",
      ]}
      faq={faqItems}
      related={KVSA_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "korea-vs-southeast-asia-international-school-2026",
  title: "한국 vs 동남아 국제학교 2026 | 1년 총비용 한눈에 비교",
  description: "한국과 말레이시아·태국·베트남 국제학교의 학비, 생활비, 5년 누적 비용을 비교합니다. 계산기로 우리 가족 비용도 바로 확인하세요.",
  order: 74,
  badges: ["NEW", "국제학교", "동남아", "비교"],
},
```

카테고리 등록(양쪽): `"korea-vs-southeast-asia-international-school-2026": { category: "life", isNew: true }`

---

## 9. app.scss import / sitemap.xml

```scss
@use 'scss/pages/korea-vs-southeast-asia-international-school-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/korea-vs-southeast-asia-international-school-2026/</loc>
  <lastmod>2026-07-09</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 10. QA 포인트

- [ ] **계산기 배포와 동시 배포 확인** — 계산기 없이 이 페이지만 먼저 배포하지 않는다(0번 원칙)
- [ ] `KVSA_KR_REPRESENTATIVE_IDS`로 필터링한 결과가 정확히 3개교인지, `KVSA_SEA_REPRESENTATIVE_IDS`가 6개 도시 대표 1곳씩 정확히 6개교인지 확인
- [ ] 한국(원화/달러 혼합)과 동남아(현지 통화) 표기 방식이 비교표에서 헷갈리지 않는지 확인 — 원화 환산 없이 병기하는 이유를 표 상단에 명시
- [ ] AISVN 폐교 사실이 FAQ에 정확히 반영되어 있는지, 다른 베트남 학교와 혼동되지 않는지 확인
- [ ] `npm run build` 통과
- [ ] 계산기·3개 국가 리포트로의 내부링크가 모두 정상 동작하는지 확인
