# 삼성전자 DS 성과급 계산 기준 리포트 설계 문서

> 기획 원문: `docs/plan/202605/samsung-ds-bonus-calculation-guide.md`  
> 작성일: 2026-05-24  
> 구현 기준: Codex/Claude가 이 문서만 보고 `/reports/` 리포트 페이지를 구현할 수 있는 수준  
> 참고 페이지: `samsung-bonus`, `bonus-after-tax-calculator`, `corporate-bonus-comparison-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `삼성전자 DS 성과급 계산 기준 리포트`
- 콘텐츠 유형: 검색 유입형 해설 리포트
- 권장 slug: `samsung-ds-bonus-calculation-guide`
- URL: `/reports/samsung-ds-bonus-calculation-guide/`

### 1-2. 페이지 역할

- `/tools/samsung-bonus/` 계산기 상위 검색어를 보조하는 설명형 랜딩 페이지다.
- 사용자가 TAI/OPI, DS·DX·MX 차이, 협의안·복지 변화 의미를 이해한 뒤 삼성 성과급 계산기로 이동하도록 만든다.
- 계산 자체는 리포트에서 수행하지 않고, 모든 개인화 계산은 기존 삼성 성과급 계산기로 넘긴다.

### 1-3. 권장 파일 구조

```txt
src/
  data/
    samsungDsBonusGuide.ts
  pages/
    reports/
      samsung-ds-bonus-calculation-guide.astro

src/styles/scss/pages/
  _samsung-ds-bonus-calculation-guide.scss
```

필수 등록 파일:

- `src/data/reports.ts`
- `src/pages/index.astro`
- `src/pages/reports/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const SAMSUNG_DS_BONUS_GUIDE_META = {
  slug: "samsung-ds-bonus-calculation-guide",
  title: "삼성전자 DS 성과급 계산 기준 | TAI·OPI 차이와 지급 방식",
  description:
    "삼성전자 DS 성과급 계산 기준을 TAI·OPI 차이, DS·DX·MX 사업부별 지급 구조, 연봉 대비 성과급 비율, 협의안·복지 변화 FAQ로 정리합니다.",
  h1: "삼성전자 DS 성과급 계산 기준",
  eyebrow: "삼성전자 성과급 기준",
  dateModified: "2026-05-24",
};
```

### 2-2. 키워드 매핑

| 영역 | 주요 키워드 | 반영 위치 |
|---|---|---|
| 메인 | ds 성과급 계산기 | title, hero, CTA, FAQ |
| 메인 | 삼성전자 성과급 지급 기준 | title, intro, TAI/OPI 섹션 |
| 메인 | 삼성전자 성과급 계산 방법 | H1, 연봉 대비 표, CTA |
| 보조 | 삼성전자 OPI TAI 차이 | TAI/OPI 비교표 |
| 보조 | DS DX MX 성과급 차이 | 사업부별 비교표 |
| 보조 | 삼성전자 협의안 | 협의안 FAQ |
| 보조 | 삼성전자 복지 변화 | 협의안/복지 FAQ |

### 2-3. 구조화 데이터

페이지는 `Article` JSON-LD와 `FAQPage` JSON-LD를 포함한다.

FAQPage 우선 문항:

1. 삼성전자 TAI와 OPI는 무엇이 다른가요?
2. 삼성전자 DS 성과급은 어떻게 계산하나요?
3. DS·DX·MX 사업부별 성과급은 왜 다른가요?
4. 삼성전자 성과급은 연봉의 몇 퍼센트로 보면 되나요?
5. 협의안과 복지 변화는 계산기에 어떻게 반영하나요?

---

## 3. 데이터 스키마

### 3-1. `src/data/samsungDsBonusGuide.ts`

```ts
export type GuideTone = "neutral" | "accent" | "warning";

export type HeroKpi = {
  label: string;
  value: string;
  description: string;
};

export type ComparisonRow = {
  label: string;
  tai: string;
  opi: string;
};

export type DivisionGuideRow = {
  division: string;
  area: string;
  interpretation: string;
  calculatorPreset: string;
};

export type SalaryPercentageRow = {
  salary: number;
  opi10: number;
  opi30: number;
  opi50: number;
  interpretation: string;
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};
```

### 3-2. Export 목록

```ts
export const SAMSUNG_DS_BONUS_GUIDE_META = { ... };
export const HERO_KPIS: HeroKpi[] = [ ... ];
export const TAI_OPI_ROWS: ComparisonRow[] = [ ... ];
export const DIVISION_ROWS: DivisionGuideRow[] = [ ... ];
export const SALARY_PERCENTAGE_ROWS: SalaryPercentageRow[] = [ ... ];
export const AGREEMENT_FAQ: GuideFaq[] = [ ... ];
export const SEO_INTRO: string[] = [ ... ];
export const SEO_CRITERIA: string[] = [ ... ];
export const RELATED_LINKS: RelatedLink[] = [ ... ];
export const formatWon = (value: number) => string;
```

### 3-3. 기존 데이터 재사용

`src/data/samsungCompensation.ts`의 다음 데이터를 참고할 수 있다.

- `divisions`
- `opiModes`
- `factAnchors`
- `unionDemandScenarios`
- `SAMSUNG_RELATED_CALCULATORS`
- `SAMSUNG_EXTERNAL_REFERENCE_LINKS`

주의:

- 협의안 관련 수치는 구현 시점 최신 상태를 반드시 다시 확인한다.
- 확정되지 않은 값은 `추정`, `시뮬레이션`, `보도 기준`, `가정`으로 표시한다.

---

## 4. 페이지 컴포넌트 구조

### 4-1. Astro 기본 구조

파일: `src/pages/reports/samsung-ds-bonus-calculation-guide.astro`

사용 컴포넌트:

```ts
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
```

권장 main class:

```astro
<main class="container page-shell report-page sdbg-page" data-report="samsung-ds-bonus-calculation-guide">
```

스타일 prefix:

- `sdbg-`
- 페이지 루트: `.sdbg-page`

---

## 5. 섹션 설계

### 5-1. Hero

목표:

- “DS 성과급”, “TAI/OPI”, “계산 기준”, “삼성 성과급 계산기”를 첫 화면에서 확인하게 한다.
- 바로 계산하려는 사용자를 `/tools/samsung-bonus/`로 보낸다.

구성:

- `CalculatorHero`
  - eyebrow: `삼성전자 성과급 기준`
  - title: `삼성전자 DS 성과급 계산 기준`
  - description: `TAI·OPI 차이, DS·DX·MX 사업부별 지급 구조, 연봉 대비 성과급 비율, 협의안·복지 변화까지 한 번에 정리합니다.`

Hero board:

- 좌측: 핵심 설명 + CTA 2개
- 우측: KPI 카드 3개

KPI 예시:

```ts
[
  { label: "핵심 구분", value: "TAI / OPI", description: "반기 성과급과 연간 성과급을 분리" },
  { label: "사업부 변수", value: "DS·DX·MX", description: "같은 회사라도 지급률과 체감액 차이" },
  { label: "다음 행동", value: "계산기로 확인", description: "내 연봉과 사업부 기준으로 재계산" },
]
```

CTA:

- `/tools/samsung-bonus/` — `내 연봉으로 삼성 성과급 계산하기`
- `/tools/bonus-after-tax-calculator/?company=samsung` — `세후 실수령액 계산하기`

### 5-2. 안내 박스

컴포넌트: `InfoNotice`

문구:

- 이 페이지는 삼성전자 성과급의 구조와 계산 기준을 설명하는 해설 리포트입니다.
- 실제 지급액은 회사 공지, 사업부, 직급, 기준급, 협의안 확정 여부에 따라 달라질 수 있습니다.
- 확정되지 않은 금액은 추정·시뮬레이션·보도 기준으로만 표시해야 합니다.

### 5-3. TAI / OPI 차이

섹션 id: `tai-opi`

UI:

- 2열 비교표
- 모바일에서는 카드형 row로 전환

데이터:

```ts
export const TAI_OPI_ROWS = [
  { label: "성격", tai: "반기 단위 목표달성장려금", opi: "연간 초과이익성과급" },
  { label: "지급 주기", tai: "통상 상·하반기", opi: "통상 연 1회" },
  { label: "기준", tai: "사업부·조직 목표 달성도", opi: "사업부 연간 실적과 이익" },
  { label: "체감 포인트", tai: "짧은 주기로 변동", opi: "한 해 총보상에 큰 영향" },
  { label: "계산기 반영", tai: "직접 입력 또는 프리셋", opi: "사업부별 OPI 비율 선택" },
];
```

CTA:

- `TAI·OPI를 나눠서 계산하기` → `/tools/samsung-bonus/`

### 5-4. DS·DX·MX 사업부별 차이

섹션 id: `division-difference`

UI:

- 4개 카드 또는 표
- DS는 강조 카드로 처리 가능

데이터:

```ts
export const DIVISION_ROWS = [
  {
    division: "DS",
    area: "반도체·메모리·파운드리",
    interpretation: "반도체 업황과 영업이익 변동성이 큽니다.",
    calculatorPreset: "DS 프리셋",
  },
  {
    division: "DX",
    area: "TV·가전·생활가전",
    interpretation: "제품군별 수익성 차이를 함께 봐야 합니다.",
    calculatorPreset: "DX 프리셋",
  },
  {
    division: "MX",
    area: "모바일·스마트폰",
    interpretation: "판매량, 마진, 플래그십 성과 영향을 받습니다.",
    calculatorPreset: "MX 프리셋",
  },
  {
    division: "지원/공통",
    area: "지원 조직",
    interpretation: "공통 또는 별도 기준이 적용될 수 있습니다.",
    calculatorPreset: "직접 입력",
  },
];
```

CTA:

- `DS·DX·MX 사업부 선택해서 계산하기` → `/tools/samsung-bonus/`

### 5-5. 연봉 대비 성과급 예시

섹션 id: `salary-ratio`

목표:

- 검색자가 “연봉 대비 몇 %” 감각을 빠르게 잡도록 한다.
- 실제 기준급 산식과 다를 수 있음을 명확히 알린다.

데이터:

```ts
export const SALARY_PERCENTAGE_ROWS = [
  { salary: 60000000, opi10: 6000000, opi30: 18000000, opi50: 30000000, interpretation: "초·중년차 체감 구간" },
  { salary: 80000000, opi10: 8000000, opi30: 24000000, opi50: 40000000, interpretation: "DS·MX 주요 검색 수요 구간" },
  { salary: 100000000, opi10: 10000000, opi30: 30000000, opi50: 50000000, interpretation: "총보상 비교가 필요한 구간" },
  { salary: 120000000, opi10: 12000000, opi30: 36000000, opi50: 60000000, interpretation: "세후 계산 필수 구간" },
];
```

UI:

- PC: 테이블
- Mobile: 가로 스크롤 테이블
- 기준 열 `OPI 30%` 또는 `OPI 50%`는 강조 가능

주의 문구:

`위 표는 연봉 대비 감각을 잡기 위한 단순 예시입니다. 실제 지급 기준은 기준급, 사업부별 지급률, TAI, 특별성과급, 복지성 항목에 따라 달라질 수 있습니다.`

CTA:

- `내 연봉 기준 예상 성과급 확인하기` → `/tools/samsung-bonus/`
- `세후 실수령액 보기` → `/tools/bonus-after-tax-calculator/?company=samsung`

### 5-6. 협의안/복지 변화 FAQ

섹션 id: `agreement-faq`

UI:

- FAQ 카드 또는 `details` 리스트
- 첫 번째 항목만 open

FAQ:

```ts
export const AGREEMENT_FAQ = [
  {
    question: "삼성전자 협의안은 성과급에 바로 반영되나요?",
    answer: "협의안, 잠정합의안, 최종 타결은 단계가 다릅니다. 실제 반영 시점과 대상은 회사 공지 기준을 확인해야 합니다.",
  },
  {
    question: "DS 특별성과급은 OPI와 같은 건가요?",
    answer: "OPI와 별도 항목으로 보도되거나 설명될 수 있습니다. 계산기에서는 OPI, 특별성과급, 복지성 항목을 분리해서 보는 것이 안전합니다.",
  },
  {
    question: "복지 변화는 연봉에 포함해서 봐도 되나요?",
    answer: "현금성 지급, 자사주, 포인트, 복지혜택은 체감 가치가 다릅니다. 총보상에는 참고로 넣되 현금 성과급과 구분해야 합니다.",
  },
  {
    question: "DS와 DX가 같은 협의안을 적용받나요?",
    answer: "공통 적용 항목과 사업부별 별도 항목이 나뉠 수 있습니다. 최종 공지와 적용 대상을 확인해야 합니다.",
  },
  {
    question: "삼성 성과급 계산기에서는 협의안을 어떻게 반영하나요?",
    answer: "계산기는 잠정합의안, 특별성과급, 사업부별 OPI 시나리오를 분리해 입력하도록 구성합니다.",
  },
];
```

### 5-7. 다음 행동 CTA

섹션 id: `next-action`

카드 3개:

1. `삼성전자 성과급 계산`
   - 설명: 사업부, 연봉, OPI, TAI를 넣어 예상 총보상 확인
   - href: `/tools/samsung-bonus/`

2. `세후 실수령액 확인`
   - 설명: 세전 성과급이 실제 통장에 얼마나 남는지 확인
   - href: `/tools/bonus-after-tax-calculator/?company=samsung`

3. `대기업 성과급 비교`
   - 설명: 삼성전자, SK하이닉스, 현대차 성과급 구조 비교
   - href: `/reports/corporate-bonus-comparison-2026/`

### 5-8. SeoContent

마지막에 `SeoContent`를 배치한다.

```astro
<SeoContent
  introTitle="삼성전자 DS 성과급 계산 기준을 볼 때 중요한 점"
  intro={SEO_INTRO}
  criteria={SEO_CRITERIA}
  faq={AGREEMENT_FAQ}
  related={RELATED_LINKS}
/>
```

SEO intro:

```ts
export const SEO_INTRO = [
  "삼성전자 성과급은 단일 금액으로 보기보다 TAI, OPI, 특별성과급, 복지성 항목을 나눠 봐야 합니다.",
  "특히 DS, DX, MX는 같은 삼성전자 안에서도 사업부 실적과 지급 기준이 달라 연봉이 같아도 총보상 체감액이 달라질 수 있습니다.",
  "이 페이지는 검색에서 바로 들어온 사용자가 계산 기준을 이해하고, 삼성 성과급 계산기에서 본인 조건으로 이어가도록 구성했습니다.",
];
```

SEO criteria:

```ts
export const SEO_CRITERIA = [
  "공식 확정 지급액이 아닌 수치는 추정·시뮬레이션·보도 기준으로 표시합니다.",
  "TAI, OPI, 특별성과급, 복지성 항목은 서로 다른 성격의 보상입니다.",
  "연봉 대비 % 표는 이해를 돕기 위한 단순 예시이며 실제 기준급 산식과 다를 수 있습니다.",
  "세후 실수령액은 연봉, 공제, 4대보험, 연말정산 조건에 따라 달라집니다.",
];
```

Related:

```ts
export const RELATED_LINKS = [
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기", description: "사업부와 연봉 기준으로 예상 성과급 계산" },
  { href: "/tools/bonus-after-tax-calculator/?company=samsung", label: "성과급 세후 실수령액 계산기", description: "세전 성과급의 실제 체감액 확인" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 회사 성과급 구조 비교" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 비교", description: "삼성전자·SK하이닉스·현대차 비교" },
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기", description: "반도체 성과급 구조 비교" },
];
```

---

## 6. 스타일 설계

파일: `src/styles/scss/pages/_samsung-ds-bonus-calculation-guide.scss`

### 6-1. Prefix

- `.sdbg-page`
- `.sdbg-hero-board`
- `.sdbg-kpi-grid`
- `.sdbg-comparison-table`
- `.sdbg-division-grid`
- `.sdbg-salary-table`
- `.sdbg-inline-cta`
- `.sdbg-next-grid`

### 6-2. 톤

- 성과급/삼성 클러스터와 맞게 차분한 업무형 UI
- 과한 브랜드 블루 단색 지배는 피한다.
- 추천 색:
  - ink: `#17202a`
  - muted: `#5f6c7b`
  - line: `rgba(31, 42, 55, 0.12)`
  - accent: `#2457a6`
  - accent-strong: `#173b75`
  - soft: `#f5f7fb`
  - warning: `#b26b00`

### 6-3. 반응형

- 900px 이하:
  - hero board 1열
  - 사업부 카드 1열
  - next action 1열
- 640px 이하:
  - CTA 버튼 full width
  - 표는 horizontal scroll
  - 카드 내부 제목은 1.1rem 안팎 유지

---

## 7. 리포트 등록

### 7-1. `src/data/reports.ts`

`corporate-bonus-comparison-2026` 직후 또는 `sk-hynix-bonus-2027` 근처에 추가한다.

```ts
{
  slug: "samsung-ds-bonus-calculation-guide",
  title: "삼성전자 DS 성과급 계산 기준 | TAI·OPI 차이와 지급 방식",
  description: "삼성전자 DS 성과급 계산 기준을 TAI·OPI 차이, DS·DX·MX 사업부별 지급 구조, 연봉 대비 성과급 비율, 협의안·복지 변화 FAQ로 정리합니다.",
  order: 3.55,
  badges: ["삼성전자", "DS", "성과급"],
}
```

### 7-2. `src/pages/index.astro`

```ts
"samsung-ds-bonus-calculation-guide": { category: "bonus", isNew: true },
```

### 7-3. `src/pages/reports/index.astro`

```ts
"samsung-ds-bonus-calculation-guide": {
  eyebrow: "삼성전자 성과급",
  tags: [
    { label: "삼성전자", mod: "salary" },
    { label: "DS", mod: "salary" },
    { label: "TAI·OPI", mod: "salary" },
  ],
  category: "bonus",
  isNew: true,
},
```

### 7-4. `src/styles/app.scss`

```scss
@use 'scss/pages/samsung-ds-bonus-calculation-guide';
```

### 7-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/samsung-ds-bonus-calculation-guide/</loc>
  <lastmod>2026-05-24</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.90</priority>
</url>
```

---

## 8. 구현 순서

1. `src/data/samsungDsBonusGuide.ts` 작성
2. `src/pages/reports/samsung-ds-bonus-calculation-guide.astro` 작성
3. `_samsung-ds-bonus-calculation-guide.scss` 작성 및 `app.scss` 등록
4. `src/data/reports.ts`, 홈, 리포트 인덱스 등록
5. `public/sitemap.xml` 등록
6. `npm run build` 실행
7. 생성 라우트 확인: `dist/reports/samsung-ds-bonus-calculation-guide/index.html`

---

## 9. QA 체크리스트

- [ ] `/reports/samsung-ds-bonus-calculation-guide/` 라우트 생성
- [ ] title, description, canonical 정상 출력
- [ ] Article JSON-LD 포함
- [ ] FAQPage JSON-LD 포함
- [ ] TAI/OPI 비교표 표시
- [ ] DS·DX·MX 비교 카드 또는 표 표시
- [ ] 연봉 대비 성과급 예시표 표시
- [ ] 협의안/복지 FAQ 표시
- [ ] `/tools/samsung-bonus/` CTA가 상단·중간·하단에 배치됨
- [ ] `/tools/bonus-after-tax-calculator/?company=samsung` CTA 연결
- [ ] 홈 리포트 목록 노출
- [ ] 리포트 인덱스 노출
- [ ] 사이트맵 등록
- [ ] `npm run build` 성공

---

## 10. 주의사항

- 삼성전자 성과급 지급률을 공식 확정값처럼 표현하지 않는다.
- 협의안, 잠정합의안, 최종 타결은 단계가 다르므로 반드시 구분한다.
- TAI, OPI, 특별성과급, 복지성 항목을 하나의 성과급 금액으로 뭉뚱그리지 않는다.
- 연봉 대비 %는 단순 예시이며 실제 기준급·내부 산식과 다를 수 있음을 명시한다.
- 사용자 facing 텍스트는 한국어로 작성한다.
- 구현 후 빌드 실패 상태로 커밋·push하지 않는다.
