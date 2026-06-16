# 유통·식품 성과급 비교 2026 설계 문서

> 작성일: 2026-06-16  
> 구현 대상: `/reports/retail-food-bonus-comparison-2026/`  
> 콘텐츠 유형: 리포트형 비교 콘텐츠 + 직군별 간이 시뮬레이션  
> 선행 기획: `docs/plan/202606/retail-food-bonus-comparison-2026-plan.md`

---

## 1. 설계 요약

이 페이지는 `쿠팡 성과급`, `이마트 성과급`, `CJ 성과급`, `유통업 성과급`, `식품회사 성과급` 검색 의도를 받는 신규 리포트다. 기존 성과급 클러스터가 반도체·자동차·조선·공기업 중심이라면, 이 페이지는 **비제조/소비재/생활밀착 브랜드 성과급 비교**를 담당한다.

사용자가 기대하는 첫 답은 다음 3가지다.

1. 쿠팡·이마트·CJ 같은 대중 브랜드 기업의 성과급 구조가 어떻게 다른가
2. 내 기준 연봉과 직군으로 환산하면 성과급 세전/세후 추정액이 얼마인가
3. 유통·식품 업종은 반도체/자동차 같은 제조 대기업 성과급과 무엇이 다른가

단, 유통·식품 업종은 기업별 성과급 공개 기준이 균일하지 않다. 따라서 실제 지급액처럼 보이는 숫자 단정은 금지하고, 페이지 전체에서 `입력 연봉 기준 추정`, `후기 기반 참고`, `확인 필요` 배지를 강제한다.

---

## 2. 최종 페이지 방향

### 2.1 URL

```text
/reports/retail-food-bonus-comparison-2026/
```

### 2.2 최종 제목

```text
유통·식품 성과급 비교 2026｜쿠팡·이마트·CJ는 얼마나 받을까
```

### 2.3 콘텐츠 포맷

- 리포트형 페이지
- 기준 연봉 + 직군 선택 시뮬레이션 포함
- 표/막대 차트/기업 카드/직군별 차이/FAQ 구성
- 계산기는 아니지만 `public/scripts/`에서 클라이언트 사이드 결과 갱신

### 2.4 핵심 고지

상단 InfoNotice와 비교표 주변에 아래 문구를 반복 노출한다.

```text
이 페이지의 금액은 공개자료와 후기 기반 참고, 입력 연봉 기준 추정값을 함께 사용하는 비교용 수치입니다.
개인별 실제 성과급은 회사 실적, 조직, 직군, 평가, 근무 형태에 따라 달라질 수 있습니다.
```

---

## 3. 구현 파일 구조

```text
src/
  data/
    retailFoodBonusComparison2026.ts
      - 페이지 메타
      - 기업별 비교 데이터
      - 업종/직군/데이터 신뢰도 라벨
      - FAQ
      - SEO 본문
      - 관련 링크

  pages/
    reports/
      retail-food-bonus-comparison-2026.astro
      - BaseLayout 기반 리포트 페이지
      - Hero, InfoNotice, 입력 패널, KPI, 차트, 표, 기업 카드, SeoContent

public/
  scripts/
    retail-food-bonus-comparison-2026.js
      - 기준 연봉 입력 상태
      - 직군 선택
      - 세전/세후 토글
      - 업종 필터
      - 정렬
      - URL state
      - DOM 렌더링

src/styles/scss/pages/
  _retail-food-bonus-comparison-2026.scss
      - prefix: rfbc-

등록 파일:
  src/data/reports.ts
  src/styles/app.scss
  public/sitemap.xml
```

---

## 4. 라우팅 및 등록 설계

### 4.1 `reports.ts` 등록

현재 `ReportMeta`는 `slug`, `title`, `description`, `order`, `badges` 구조다. 이 패턴에 맞춘다.

```ts
{
  slug: "retail-food-bonus-comparison-2026",
  title: "유통·식품 성과급 비교 2026｜쿠팡·이마트·CJ는 얼마나 받을까",
  description: "쿠팡, 이마트, CJ제일제당, CJ올리브영 등 주요 유통·식품 기업의 성과급 구조와 입력 연봉 기준 추정 성과급을 비교하는 리포트입니다.",
  order: 3.54,
  badges: ["유통", "식품", "성과급", "쿠팡", "CJ"],
}
```

### 4.2 `app.scss` 등록

```scss
@use 'scss/pages/retail-food-bonus-comparison-2026';
```

성과급 리포트 import 주변, `public-enterprise-bonus-comparison-2026` 근처에 배치한다.

### 4.3 `sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/retail-food-bonus-comparison-2026/</loc>
  <lastmod>2026-06-16</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.85</priority>
</url>
```

---

## 5. 데이터 설계

### 5.1 타입

파일: `src/data/retailFoodBonusComparison2026.ts`

```ts
export type RetailFoodIndustry =
  | "commerce"
  | "offlineRetail"
  | "foodManufacturing"
  | "hnb"
  | "logisticsRetail";

export type RetailFoodJobType =
  | "office"
  | "tech"
  | "logistics"
  | "storeSales"
  | "production";

export type RetailFoodDataConfidence =
  | "publicReference"
  | "reviewBased"
  | "simulated"
  | "needsReview";

export interface RetailFoodBonusEntry {
  id: string;
  name: string;
  shortName: string;
  groupName?: string;
  industry: RetailFoodIndustry;
  representativeJobTypes: RetailFoodJobType[];
  defaultSalaryPercent: number;
  jobTypeAdjustments: Partial<Record<RetailFoodJobType, number>>;
  dataConfidence: RetailFoodDataConfidence;
  summary: string;
  jobTypeNote: string;
  caution: string;
  sourceNote: string;
  relatedKeywords: string[];
}

export interface RetailFoodJobTypeConfig {
  id: RetailFoodJobType;
  label: string;
  shortLabel: string;
  adjustmentDescription: string;
  caution: string;
}

export interface RetailFoodBonusFaq {
  question: string;
  answer: string;
}

export interface RetailFoodRelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface RetailFoodSeoContent {
  introTitle: string;
  intro: string[];
  inputPoints: string[];
  criteria: string[];
}
```

### 5.2 메타 상수

```ts
export const RFBC_META = {
  slug: "retail-food-bonus-comparison-2026",
  title: "유통·식품 성과급 비교 2026",
  seoTitle: "유통·식품 성과급 비교 2026｜쿠팡·이마트·CJ는 얼마나 받을까",
  seoDescription:
    "쿠팡, 이마트, CJ제일제당, CJ올리브영 등 주요 유통·식품 기업의 성과급 구조와 입력 연봉 기준 추정 성과급을 비교합니다. 직군별 차이와 공개 데이터 한계도 함께 확인하세요.",
  updatedAt: "2026-06-16",
  dataNote:
    "공개자료와 후기 기반 참고, 입력 연봉 기준 추정값을 함께 사용하는 비교 콘텐츠입니다. 개인별 실제 지급액은 회사 실적, 직군, 평가에 따라 달라질 수 있습니다.",
};
```

### 5.3 기준 상수

```ts
export const RFBC_BASE_SALARY = 50_000_000;
export const RFBC_SIMPLE_TAX_RATE = 0.22;
export const RFBC_MIN_SALARY = 20_000_000;
export const RFBC_MAX_SALARY = 200_000_000;
```

### 5.4 라벨

```ts
export const RFBC_INDUSTRY_LABELS: Record<RetailFoodIndustry, string> = {
  commerce: "커머스",
  offlineRetail: "오프라인 유통",
  foodManufacturing: "식품 제조",
  hnb: "헬스앤뷰티",
  logisticsRetail: "물류·리테일",
};

export const RFBC_JOB_TYPE_LABELS: Record<RetailFoodJobType, string> = {
  office: "본사 사무직",
  tech: "개발·테크",
  logistics: "물류·현장",
  storeSales: "매장·영업",
  production: "생산·공장",
};

export const RFBC_CONFIDENCE_LABELS: Record<RetailFoodDataConfidence, string> = {
  publicReference: "공개자료 참고",
  reviewBased: "후기 기반 참고",
  simulated: "입력 연봉 기준 추정",
  needsReview: "확인 필요",
};
```

### 5.5 직군 config

직군 보정은 공식 보정값이 아니다. UI 설명에는 반드시 `체감 차이 반영용 보정`이라고 쓴다.

```ts
export const RFBC_JOB_TYPES: RetailFoodJobTypeConfig[] = [
  {
    id: "office",
    label: "본사 사무직",
    shortLabel: "본사",
    adjustmentDescription: "기본 성과급률을 그대로 적용합니다.",
    caution: "회사와 사업부 평가에 따라 실제 지급률은 달라질 수 있습니다.",
  },
  {
    id: "tech",
    label: "개발·테크",
    shortLabel: "테크",
    adjustmentDescription: "테크 직군의 보상 체감 차이를 반영해 기본값보다 높게 시뮬레이션합니다.",
    caution: "스톡옵션, 사이닝, 별도 인센티브는 포함하지 않습니다.",
  },
  {
    id: "logistics",
    label: "물류·현장",
    shortLabel: "물류",
    adjustmentDescription: "수당과 근무 형태 영향이 커 성과급률은 보수적으로 반영합니다.",
    caution: "교대, 야간, 수당, 계약 형태에 따라 실제 총보상이 크게 달라질 수 있습니다.",
  },
  {
    id: "storeSales",
    label: "매장·영업",
    shortLabel: "매장",
    adjustmentDescription: "매장 실적과 직급 영향을 고려해 기본값보다 낮게 반영합니다.",
    caution: "매장, 직급, 근속에 따라 체감 차이가 큽니다.",
  },
  {
    id: "production",
    label: "생산·공장",
    shortLabel: "생산",
    adjustmentDescription: "생산직/공장직은 회사별 기준이 달라 보수적으로 반영합니다.",
    caution: "수당, 교대, 근속, 노사 기준을 함께 확인해야 합니다.",
  },
];
```

### 5.6 1차 데이터 초안

초기 MVP는 6개 기업/계열사를 사용한다. `defaultSalaryPercent`는 시뮬레이션용 기본값이고 공식 지급률이 아니다.

```ts
export const RFBC_ENTRIES: RetailFoodBonusEntry[] = [
  {
    id: "coupang",
    name: "쿠팡",
    shortName: "쿠팡",
    industry: "commerce",
    representativeJobTypes: ["office", "tech", "logistics"],
    defaultSalaryPercent: 8,
    jobTypeAdjustments: { office: 1, tech: 1.1, logistics: 0.75 },
    dataConfidence: "needsReview",
    summary: "커머스·물류 플랫폼으로 본사, 개발, 물류 직군의 보상 구조가 다르게 체감될 수 있습니다.",
    jobTypeNote: "개발/테크와 물류/현장 직군의 기준 연봉과 인센티브 구조를 분리해 보는 것이 좋습니다.",
    caution: "성과급은 조직, 직군, 평가, 회사 실적에 따라 달라질 수 있습니다.",
    sourceNote: "공개자료 및 후기 기반 확인 필요",
    relatedKeywords: ["쿠팡 성과급", "쿠팡 연봉 성과급"],
  },
  {
    id: "emart",
    name: "이마트",
    shortName: "이마트",
    industry: "offlineRetail",
    representativeJobTypes: ["office", "storeSales"],
    defaultSalaryPercent: 6,
    jobTypeAdjustments: { office: 1, storeSales: 0.85 },
    dataConfidence: "needsReview",
    summary: "오프라인 유통 대표 기업으로 점포, 본사, 사업부 실적에 따른 차이를 함께 봐야 합니다.",
    jobTypeNote: "매장/영업 직군은 근무 형태와 직급에 따른 체감 차이가 있을 수 있습니다.",
    caution: "단일 성과급률로 전체 직군을 설명하기 어렵습니다.",
    sourceNote: "공개자료 및 후기 기반 확인 필요",
    relatedKeywords: ["이마트 성과급", "신세계 이마트 성과급"],
  },
  {
    id: "cjCheiljedang",
    name: "CJ제일제당",
    shortName: "CJ제일제당",
    groupName: "CJ",
    industry: "foodManufacturing",
    representativeJobTypes: ["office", "production"],
    defaultSalaryPercent: 7,
    jobTypeAdjustments: { office: 1, production: 0.9 },
    dataConfidence: "needsReview",
    summary: "식품 대기업 대표 계열사로, CJ그룹 전체가 아니라 제일제당 기준으로 분리해서 봐야 합니다.",
    jobTypeNote: "사무직과 생산/공장 직군의 보상 구조가 다를 수 있습니다.",
    caution: "CJ 계열사별 성과급을 동일하게 단정하면 안 됩니다.",
    sourceNote: "공개자료 및 후기 기반 확인 필요",
    relatedKeywords: ["CJ 성과급", "CJ제일제당 성과급"],
  },
  {
    id: "cjOliveyoung",
    name: "CJ올리브영",
    shortName: "올리브영",
    groupName: "CJ",
    industry: "hnb",
    representativeJobTypes: ["office", "storeSales"],
    defaultSalaryPercent: 7,
    jobTypeAdjustments: { office: 1, storeSales: 0.85 },
    dataConfidence: "needsReview",
    summary: "헬스앤뷰티 리테일 대표 기업으로 성장성과 매장/본사 직군 차이를 함께 봐야 합니다.",
    jobTypeNote: "본사와 매장 직군의 보상 구조가 다를 수 있습니다.",
    caution: "CJ 계열사라도 제일제당, 대한통운, ENM과 동일하게 보면 안 됩니다.",
    sourceNote: "공개자료 및 후기 기반 확인 필요",
    relatedKeywords: ["올리브영 성과급", "CJ올리브영 성과급"],
  },
  {
    id: "lotteShopping",
    name: "롯데쇼핑",
    shortName: "롯데쇼핑",
    industry: "offlineRetail",
    representativeJobTypes: ["office", "storeSales"],
    defaultSalaryPercent: 6,
    jobTypeAdjustments: { office: 1, storeSales: 0.85 },
    dataConfidence: "needsReview",
    summary: "백화점·마트·슈퍼 등 사업부가 넓은 종합 유통 기업입니다.",
    jobTypeNote: "사업부와 매장/본사 구분에 따라 성과급 체감이 달라질 수 있습니다.",
    caution: "롯데그룹 전체 성과급으로 단정하지 않고 롯데쇼핑 중심으로 봐야 합니다.",
    sourceNote: "공개자료 및 후기 기반 확인 필요",
    relatedKeywords: ["롯데쇼핑 성과급", "롯데백화점 성과급"],
  },
  {
    id: "dongwonFnb",
    name: "동원F&B",
    shortName: "동원F&B",
    industry: "foodManufacturing",
    representativeJobTypes: ["office", "production"],
    defaultSalaryPercent: 5,
    jobTypeAdjustments: { office: 1, production: 0.9 },
    dataConfidence: "needsReview",
    summary: "식품 제조 비교군으로 CJ제일제당과 함께 볼 수 있는 기업입니다.",
    jobTypeNote: "사무직, 영업직, 생산직의 수당과 성과급 구조가 다를 수 있습니다.",
    caution: "공개자료가 제한적이므로 추정값으로만 해석해야 합니다.",
    sourceNote: "공개자료 및 후기 기반 확인 필요",
    relatedKeywords: ["동원F&B 성과급", "동원 성과급"],
  },
];
```

---

## 6. 계산 설계

### 6.1 입력 상태

```ts
export interface RfbcInputState {
  salary: number;
  jobType: RetailFoodJobType;
  viewMode: "gross" | "net";
  industryFilter: "all" | RetailFoodIndustry;
  sortBy: "grossBonus" | "netBonus" | "adjustedPercent" | "name";
}
```

### 6.2 직군 보정

```ts
adjustment = entry.jobTypeAdjustments[state.jobType] ?? 1;
adjustedPercent = entry.defaultSalaryPercent * adjustment;
grossBonus = salary * (adjustedPercent / 100);
netBonus = grossBonus * (1 - simpleTaxRate);
monthlyEquivalent = grossBonus / 12;
```

### 6.3 직군 미지원 처리

일부 기업은 특정 직군이 대표 직군이 아닐 수 있다. 그래도 계산은 보여주되, 표와 카드에 `대표 직군 아님` 표시를 붙인다.

```ts
isRepresentativeJob = entry.representativeJobTypes.includes(state.jobType);
jobSupportLabel = isRepresentativeJob ? "대표 직군" : "참고 직군";
```

### 6.4 KPI 계산

```ts
visibleRows = entries filtered by industry
topEntry = maxBy(visibleRows, displayBonus)
averagePercent = average(visibleRows.adjustedPercent)
averageBonus = average(visibleRows.displayBonus)
jobMismatchCount = visibleRows.filter(!isRepresentativeJob).length
```

### 6.5 결과 문구

예시:

```text
기준 연봉 5,000만 원, 본사 사무직 기준으로 단순 환산하면 현재 비교 기업의 평균 성과급률은 6.5%입니다. 이 값은 개인별 실제 지급액이 아니라 입력 연봉과 직군 보정값을 적용한 추정입니다.
```

### 6.6 숫자 표시 규칙

- 금액: `000만 원`
- 큰 금액: `0.0억 원`
- 비율: 소수점 1자리
- 표는 세전/세후 둘 다 노출
- KPI는 현재 viewMode에 맞춰 세전 또는 세후 강조

---

## 7. 페이지 컴포넌트 설계

### 7.1 Astro frontmatter

```ts
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import CompareCta from "../../components/CompareCta.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  RFBC_CONFIG,
  RFBC_ENTRIES,
  RFBC_FAQ,
  RFBC_INDUSTRY_LABELS,
  RFBC_JOB_TYPES,
  RFBC_JOB_TYPE_LABELS,
  RFBC_META,
  RFBC_RELATED_LINKS,
  RFBC_SEO_CONTENT,
  formatRfbcWon,
} from "../../data/retailFoodBonusComparison2026";
```

### 7.2 BaseLayout

```astro
<BaseLayout
  title={RFBC_META.seoTitle}
  description={RFBC_META.seoDescription}
  ogImage="/og/og-home.png"
  jsonLd={[articleJsonLd, faqJsonLd]}
>
```

JSON-LD는 `Article` + `FAQPage` 조합이 적합하다.

### 7.3 Hero

```astro
<CalculatorHero
  eyebrow="유통·식품 성과급 비교"
  title="유통·식품 성과급 비교 2026"
  description="쿠팡·이마트·CJ제일제당·CJ올리브영 등 주요 유통·식품 기업의 성과급 구조와 입력 연봉 기준 추정 성과급을 비교합니다."
  badges={["쿠팡", "이마트", "CJ", "성과급", "추정"]}
/>
```

### 7.4 InfoNotice

```astro
<InfoNotice
  title="비교 전 확인"
  lines={[
    RFBC_META.dataNote,
    "유통·식품 업종은 회사별 성과급 공개 기준이 균일하지 않아, 이 페이지의 금액은 입력 연봉 기준 추정값입니다.",
    "본사, 물류, 매장, 생산, 개발 직군에 따라 실제 지급 구조와 체감액이 크게 달라질 수 있습니다.",
    "CJ는 계열사별 보상 체계가 다르므로 CJ그룹 전체 성과급으로 단정하지 않습니다.",
  ]}
/>
```

### 7.5 요약 카드

초기 요약 카드 4개.

1. 비교 기업 수
2. 대표 검색어
3. 핵심 변수
4. 데이터 성격

각 카드에 `추정`, `확인 필요` 배지를 노출한다.

### 7.6 입력 패널

클래스 prefix: `rfbc-control`

구성:

- 기준 연봉 input
- 직군 select
- 세전/세후 segmented radio
- 업종 select
- 정렬 select
- 초기화 버튼
- 링크 복사 버튼

```astro
<section class="rfbc-section rfbc-control-section" id="simulator">
  <label class="rfbc-field">
    <span>기준 연봉</span>
    <input data-rfbc="salary" type="text" inputmode="numeric" value="50,000,000" />
  </label>

  <label class="rfbc-field">
    <span>직군</span>
    <select data-rfbc="jobType">
      {RFBC_JOB_TYPES.map((item) => <option value={item.id}>{item.label}</option>)}
    </select>
  </label>

  <fieldset class="rfbc-segment">
    <legend>보기 기준</legend>
    <label><input type="radio" name="rfbcViewMode" value="gross" checked /><span>세전</span></label>
    <label><input type="radio" name="rfbcViewMode" value="net" /><span>세후 추정</span></label>
  </fieldset>

  <label class="rfbc-field">
    <span>업종</span>
    <select data-rfbc="industryFilter">...</select>
  </label>

  <label class="rfbc-field">
    <span>정렬</span>
    <select data-rfbc="sortBy">...</select>
  </label>
</section>
```

### 7.7 KPI 섹션

```astro
<section class="rfbc-section rfbc-kpi-section" aria-live="polite">
  <article class="rfbc-kpi rfbc-kpi--main">
    <span>추정 1위</span>
    <strong data-rfbc-result="topName">-</strong>
    <small data-rfbc-result="topBonus">-</small>
  </article>
  <article class="rfbc-kpi">
    <span>평균 성과급률</span>
    <strong data-rfbc-result="averagePercent">-</strong>
    <small data-rfbc-result="averageBonus">-</small>
  </article>
  <article class="rfbc-kpi">
    <span>비교 기업</span>
    <strong data-rfbc-result="count">-</strong>
    <small>필터 기준</small>
  </article>
  <article class="rfbc-kpi">
    <span>참고 직군 포함</span>
    <strong data-rfbc-result="jobMismatch">-</strong>
    <small>대표 직군이 아닌 계산 포함</small>
  </article>
</section>
```

### 7.8 차트 섹션

DOM 기반 막대 차트.

```html
<div class="rfbc-chart" data-rfbc-chart></div>
```

row:

```html
<article class="rfbc-chart-row">
  <div>
    <strong>CJ제일제당</strong>
    <span>식품 제조 · 본사 사무직</span>
  </div>
  <span class="rfbc-chart-row__bar"><i style="width: 88%"></i></span>
  <em>350만 원</em>
</article>
```

### 7.9 비교 테이블

모바일에서 가로 스크롤.

컬럼:

1. 순위
2. 기업
3. 업종
4. 직군 적용
5. 기본 성과급률
6. 보정 성과급률
7. 세전 추정
8. 세후 추정
9. 데이터 성격
10. 핵심 변수
11. 주의

```astro
<div class="rfbc-table-wrap">
  <table class="rfbc-table">
    <caption>유통·식품 성과급 비교 2026 입력 연봉 및 직군 기준 추정표</caption>
    <thead>...</thead>
    <tbody data-rfbc-table-body></tbody>
  </table>
</div>
```

### 7.10 기업별 카드

정적 렌더링. 카드마다 대표 검색어를 넣어 롱테일 키워드와 연결한다.

```astro
<div class="rfbc-card-grid">
  {RFBC_ENTRIES.map((entry) => (
    <article class="rfbc-company-card">
      <span class="rfbc-badge rfbc-badge--check">{RFBC_CONFIDENCE_LABELS[entry.dataConfidence]}</span>
      <h3>{entry.shortName}</h3>
      <p>{entry.summary}</p>
      <small>{entry.jobTypeNote}</small>
      <p class="rfbc-keywords">{entry.relatedKeywords.join(" · ")}</p>
    </article>
  ))}
</div>
```

### 7.11 직군별 차이 섹션

`RFBC_JOB_TYPES`를 그대로 렌더링한다.

```astro
<section class="rfbc-section" id="job-types">
  <div class="section-header">
    <p class="section-header__eyebrow">직군별 차이</p>
    <h2>유통·식품 성과급은 직군부터 나눠 봐야 합니다</h2>
  </div>
  <div class="rfbc-job-grid">
    {RFBC_JOB_TYPES.map((job) => (
      <article>
        <strong>{job.label}</strong>
        <p>{job.adjustmentDescription}</p>
        <small>{job.caution}</small>
      </article>
    ))}
  </div>
</section>
```

### 7.12 제조 대기업과 차이

2열 비교 카드.

- 반도체·자동차 제조 대기업
- 유통·식품·커머스

CTA는 `CompareCta` 사용.

---

## 8. 스크립트 설계

파일: `public/scripts/retail-food-bonus-comparison-2026.js`

### 8.1 데이터 주입

```astro
<script id="rfbc-data" type="application/json" set:html={JSON.stringify(RFBC_CONFIG)} />
<script type="module" src={withBase("/scripts/retail-food-bonus-comparison-2026.js")}></script>
```

`RFBC_CONFIG`:

```ts
export const RFBC_CONFIG = {
  baseSalary: RFBC_BASE_SALARY,
  taxRate: RFBC_SIMPLE_TAX_RATE,
  minSalary: RFBC_MIN_SALARY,
  maxSalary: RFBC_MAX_SALARY,
  entries: RFBC_ENTRIES,
  jobTypes: RFBC_JOB_TYPES,
  industryLabels: RFBC_INDUSTRY_LABELS,
  jobTypeLabels: RFBC_JOB_TYPE_LABELS,
  confidenceLabels: RFBC_CONFIDENCE_LABELS,
};
```

### 8.2 상태

```js
const initialState = {
  salary: 50000000,
  jobType: "office",
  viewMode: "gross",
  industryFilter: "all",
  sortBy: "grossBonus",
};
```

### 8.3 주요 함수

```js
function num(value, fallback = 0) {}
function clampSalary(value) {}
function manwon(value) {}
function percent(value) {}
function readState() {}
function setControls() {}
function calcEntry(entry, state) {}
function visibleRows() {}
function summary(rows) {}
function renderKpis(rows) {}
function renderChart(rows) {}
function renderTable(rows) {}
function updateUrl() {}
function restoreFromUrl() {}
function refresh() {}
```

### 8.4 `calcEntry` 핵심

```js
function calcEntry(entry) {
  const adjustment = Number(entry.jobTypeAdjustments?.[state.jobType] || 1);
  const adjustedPercent = entry.defaultSalaryPercent * adjustment;
  const grossBonus = state.salary * (adjustedPercent / 100);
  const netBonus = grossBonus * (1 - cfg.taxRate);
  const isRepresentativeJob = entry.representativeJobTypes.includes(state.jobType);

  return {
    ...entry,
    adjustment,
    adjustedPercent,
    grossBonus,
    netBonus,
    displayBonus: state.viewMode === "net" ? netBonus : grossBonus,
    isRepresentativeJob,
  };
}
```

### 8.5 URL state

| Param | 의미 |
|---|---|
| `salary` | 기준 연봉 |
| `job` | 직군 |
| `view` | `gross`/`net` |
| `ind` | 업종 |
| `sort` | 정렬 기준 |

예시:

```text
/reports/retail-food-bonus-comparison-2026/?salary=60000000&job=tech&view=net&ind=commerce
```

### 8.6 복사 버튼

버튼 ID:

- `rfbcResetBtn`
- `rfbcCopyBtn`

복사 성공 시 1.6초 동안 `링크 복사 완료` 표시.

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_retail-food-bonus-comparison-2026.scss`

### 9.1 Prefix

모든 신규 클래스는 `rfbc-` prefix 사용.

### 9.2 주요 클래스

```scss
.rfbc-page
.rfbc-section
.rfbc-summary-grid
.rfbc-summary-card
.rfbc-control-panel
.rfbc-field
.rfbc-segment
.rfbc-button-row
.rfbc-kpi-grid
.rfbc-kpi
.rfbc-dynamic-summary
.rfbc-chart
.rfbc-chart-row
.rfbc-table-wrap
.rfbc-table
.rfbc-badge
.rfbc-card-grid
.rfbc-company-card
.rfbc-job-grid
.rfbc-compare-grid
.rfbc-keywords
```

### 9.3 디자인 톤

- 유통·식품은 생활밀착 브랜드지만, 페이지는 취업/보상 리포트이므로 너무 밝은 쇼핑몰 느낌은 피한다.
- 주색:
  - green/teal: 식품·리테일 느낌
  - blue: 데이터/비교 리포트 느낌
  - amber: 확인 필요/후기 기반 참고 배지
- 카드 radius는 8px 이하
- 표는 고밀도, 행간은 충분히
- CTA는 기존 `CompareCta` 스타일 재사용

### 9.4 반응형

```scss
.rfbc-kpi-grid,
.rfbc-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 1020px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.rfbc-control-panel {
  display: grid;
  gap: 12px;

  @media (min-width: 960px) {
    grid-template-columns: 1.1fr 1fr 1.1fr 1fr 1fr auto;
  }
}

.rfbc-table {
  min-width: 1040px;
}
```

### 9.5 텍스트 오버플로 방지

- KPI `strong`: `overflow-wrap: anywhere`
- 표: `white-space: nowrap`, 주의 컬럼만 `white-space: normal`
- 기업 카드: `line-height: 1.55`
- 버튼: `min-height` 고정
- 모바일 차트 row는 1열 전환

---

## 10. SEO 콘텐츠 설계

### 10.1 `SeoContent`

```ts
export const RFBC_SEO_CONTENT: RetailFoodSeoContent = {
  introTitle: "유통·식품 성과급은 왜 회사보다 직군을 먼저 봐야 할까",
  intro: [
    "유통·식품 업종 성과급은 반도체나 자동차 대기업처럼 제도명이 명확하게 공개되는 경우가 상대적으로 적습니다...",
    "쿠팡, 이마트, CJ제일제당, CJ올리브영은 모두 대중에게 익숙한 기업이지만 보상 구조는 서로 다릅니다...",
    "이 페이지는 기준 연봉과 직군을 입력해 회사별 성과급 추정액을 같은 방식으로 비교합니다...",
  ],
  inputPoints: [
    "기준 연봉을 입력하면 기업별 기본 성과급률과 직군 보정값을 반영해 추정액을 계산합니다.",
    "직군 선택으로 본사, 개발, 물류, 매장, 생산 직군의 체감 차이를 비교할 수 있습니다.",
    "세후 보기에서는 간이 세율을 적용한 실수령 추정액을 표시합니다.",
  ],
  criteria: [
    "모든 금액은 개인별 실제 지급액이 아니라 공개자료, 후기 기반 참고, 입력 연봉 기준 추정값입니다.",
    "회사 실적, 조직, 직군, 평가, 근무 형태에 따라 실제 성과급은 달라질 수 있습니다.",
    "CJ는 계열사별 보상 체계가 다르므로 CJ그룹 전체 성과급으로 단정하지 않습니다.",
  ],
};
```

### 10.2 FAQ

```ts
export const RFBC_FAQ: RetailFoodBonusFaq[] = [
  {
    question: "쿠팡 성과급은 얼마나 나오나요?",
    answer: "쿠팡 성과급은 조직, 직군, 평가, 회사 실적에 따라 달라질 수 있습니다. 이 페이지의 금액은 개인별 실제 지급액이 아니라 입력 연봉과 직군 보정값을 적용한 추정입니다.",
  },
  {
    question: "이마트도 성과급이 있나요?",
    answer: "성과급이나 격려금 등 변동 보상은 연도, 실적, 직급, 사업부에 따라 달라질 수 있습니다. 단일 금액으로 보기보다 공개자료와 후기 기반 범위를 참고하는 것이 안전합니다.",
  },
  {
    question: "CJ 성과급은 계열사마다 다른가요?",
    answer: "네. CJ제일제당, CJ올리브영, CJ대한통운, CJ ENM 등은 사업 구조와 보상 체계가 다를 수 있습니다. 이 페이지는 대표 계열사를 분리해 비교합니다.",
  },
  {
    question: "유통업 성과급은 제조 대기업보다 적은가요?",
    answer: "업종 평균만으로 단정하기 어렵습니다. 반도체·자동차는 성과급 제도가 명확한 경우가 많지만, 유통·식품은 직군, 수당, 근무 형태, 복지를 함께 봐야 합니다.",
  },
  {
    question: "물류/현장직과 본사직 성과급은 같은가요?",
    answer: "같다고 보기 어렵습니다. 물류/현장직은 교대, 야간, 수당, 계약 형태가 총보상에 큰 영향을 줄 수 있고 본사직은 평가와 조직 성과 영향이 더 클 수 있습니다.",
  },
  {
    question: "식품회사 성과급은 매년 나오나요?",
    answer: "회사 실적과 내부 지급 기준에 따라 달라질 수 있습니다. 매년 동일하게 나온다고 단정하기 어렵고, 직군과 근속에 따라 체감액도 달라질 수 있습니다.",
  },
  {
    question: "성과급은 세금을 얼마나 떼나요?",
    answer: "성과급도 근로소득으로 과세될 수 있습니다. 실제 세후 금액은 연봉, 공제, 지급월 원천징수 방식에 따라 달라지므로 이 페이지의 세후 금액은 간이 추정입니다.",
  },
  {
    question: "이 페이지의 순위는 실제 지급 순위인가요?",
    answer: "아닙니다. 순위는 입력 연봉과 기본 성과급률, 직군 보정값을 적용한 시뮬레이션 기준입니다. 실제 회사별 지급 순위로 해석하면 안 됩니다.",
  },
];
```

### 10.3 관련 링크

```ts
export const RFBC_RELATED_LINKS = [
  {
    href: "/reports/corporate-bonus-comparison-2026/",
    label: "대기업 성과급 비교",
    description: "삼성전자, SK하이닉스, 현대차 등 제조 대기업 성과급 구조를 비교합니다.",
  },
  {
    href: "/compare/bonus/",
    label: "성과급 계산기 모아보기",
    description: "회사별 성과급 계산기와 업종별 비교 콘텐츠를 한 번에 봅니다.",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 계산기",
    description: "성과급을 받았을 때 세후 실수령액을 계산합니다.",
  },
  {
    href: "/reports/new-employee-salary-2026/",
    label: "신입사원 연봉 비교",
    description: "대기업·IT·공기업 신입 초봉과 총보상을 비교합니다.",
  },
];
```

---

## 11. 접근성 및 UX

- 입력 변경 결과 영역은 `aria-live="polite"` 적용
- 차트와 동일한 내용을 표로 제공
- 표 caption 포함
- 모든 select/input에 label 제공
- 세전/세후 토글은 radio 기반 segmented control
- `데이터 성격` 배지는 색상 + 텍스트 병행
- 링크 복사 실패 시 `복사 실패` 표시
- 직군이 대표 직군이 아닌 경우 `참고 직군` 텍스트 표시

---

## 12. 콘텐츠 안전장치

### 12.1 표현 금지

```text
쿠팡 성과급은 000만 원입니다.
이마트는 성과급이 없습니다.
CJ 성과급은 계열사 모두 동일합니다.
유통업 성과급 순위 확정판
물류직은 본사직보다 반드시 적게 받습니다.
```

### 12.2 권장 표현

```text
입력 연봉 기준 추정
후기 기반 참고
공개자료 확인 필요
직군과 조직에 따라 달라질 수 있음
계열사별 보상 체계가 다를 수 있음
```

### 12.3 데이터 검토 자료

구현 전 또는 출시 후 보완 시 확인할 자료:

- 기업 사업보고서/분기보고서
- 채용공고 보상 문구
- 회사 공식 채용 페이지
- 공개 인터뷰/보도자료
- 후기 기반 자료는 정성 설명으로만 사용

---

## 13. QA 체크리스트

### 13.1 빌드

- [ ] `npm run build` 통과
- [ ] 신규 리포트 HTML 생성 확인
- [ ] sitemap 등록 확인
- [ ] `reports.ts` 목록 노출 확인

### 13.2 계산

- [ ] 기준 연봉 5,000만 원에서 세전 추정액 계산 정확
- [ ] 직군 보정값 적용 정상
- [ ] 세후 보기에서 간이 세율 적용
- [ ] 업종 필터 정상
- [ ] 정렬 기준 정상
- [ ] 대표 직군/참고 직군 표시 정상
- [ ] URL state 복원 정상
- [ ] 링크 복사 정상

### 13.3 콘텐츠

- [ ] 모든 금액에 `추정`, `후기 기반 참고`, `확인 필요` 중 하나가 표시됨
- [ ] 쿠팡·이마트·CJ 성과급을 실제 지급액처럼 단정하지 않음
- [ ] CJ그룹 전체와 계열사 차이를 설명함
- [ ] 직군별 차이를 충분히 고지함
- [ ] 제조 대기업 성과급과 차이 설명이 있음
- [ ] FAQ 7개 이상

### 13.4 모바일

- [ ] KPI 카드 1열 전환
- [ ] 입력 패널 세로 배치
- [ ] 표 가로 스크롤
- [ ] 차트 row 텍스트 줄바꿈 안전
- [ ] CTA 버튼 텍스트 넘침 없음

---

## 14. 구현 순서

1. `retailFoodBonusComparison2026.ts` 작성
2. `retail-food-bonus-comparison-2026.astro` 작성
3. JSON config script 주입
4. `retail-food-bonus-comparison-2026.js` 작성
5. `_retail-food-bonus-comparison-2026.scss` 작성
6. `reports.ts` 등록
7. `app.scss` 등록
8. `sitemap.xml` 등록
9. `npm run build`
10. preview 또는 dev 서버에서 desktop/mobile 확인

---

## 15. 출시 후 보완 계획

1. 네이버 서치어드바이저에서 `쿠팡 성과급`, `이마트 성과급`, `CJ 성과급` 노출 여부 확인
2. 특정 기업 키워드가 잡히면 단독 페이지 확장
3. `CJ 계열사 연봉·성과급 비교` 별도 리포트 확장
4. `식품회사 성과급 비교` 별도 리포트로 분리 가능
5. 공개자료가 확인되는 기업부터 `dataConfidence`를 `publicReference`로 조정

---

## 16. 최종 구현 판단

MVP는 `정확한 기업별 성과급 계산기`가 아니라 `리포트형 비교 + 직군별 추정 시뮬레이션`으로 출시해야 한다. 이 구조는 검색 클릭 가능성을 확보하면서도 공개 수치 부족에 따른 리스크를 줄인다.

특히 쿠팡·이마트·CJ는 대중 인지도가 높아 제목 클릭률을 기대할 수 있다. 다만 유통·식품 업종은 직군과 계열사 차이가 크므로, 구현 시 표와 카드에서 `대표 직군`, `참고 직군`, `확인 필요` 배지를 명확히 노출해야 한다.
