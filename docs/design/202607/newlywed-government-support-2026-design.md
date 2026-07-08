# 2026 신혼부부 정부지원 완전정리 — 설계 문서

> 기획 원본: [`docs/plan/202607/newlywed-government-support-2026.md`](../../plan/202607/newlywed-government-support-2026.md)
> 작성일: 2026-07-08
> 유형: 정보성 리포트 (`/reports/`) + 상황 선택형 가이드
> 구현 기준: Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202607/newlywed-government-support-2026.md`
- 구현 대상: `2026 신혼부부 정부지원 완전정리`
- 콘텐츠 유형: 정책형 메인 허브 리포트
- 권장 URL: `/reports/newlywed-government-support-2026/`

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한다.
- 화면 IA, 데이터 스키마, 인터랙션 상태, SCSS prefix, 등록 파일, QA 기준을 고정한다.
- 정책 기준이 바뀌는 주제이므로, 구현 시점의 공식 출처 재확인 포인트와 배지 규칙을 명확히 남긴다.

### 1-3. 페이지 성격

- **메인 허브형 리포트**: 신혼부부가 받을 수 있는 지원을 세금·대출·청약·출산·지역지원으로 나눈다.
- **상황 선택형 가이드**: 사용자가 `혼인신고 예정`, `전세 예정`, `첫 집 매수`, `청약 준비`, `임신·출산`, `지역지원 탐색` 중 하나를 고르면 우선 확인할 제도 3개를 보여준다.
- **계산기 연결형 페이지**: 금액 계산 자체는 별도 계산기로 넘기고, 이 페이지에서는 판단 순서와 공식 확인 경로를 제공한다.
- **정책 안전성 우선**: 수치 단정보다 기준일, 공식 출처, 신청 전 확인 문구를 강조한다.

### 1-4. 권장 slug와 파일 구조

```text
slug: newlywed-government-support-2026
URL: /reports/newlywed-government-support-2026/

src/
  data/
    newlywedGovernmentSupport2026.ts
  pages/
    reports/
      newlywed-government-support-2026.astro

public/
  scripts/
    newlywed-government-support-2026.js

src/styles/scss/pages/
  _newlywed-government-support-2026.scss
```

**클래스 프리픽스:** `ngs-` (Newlywed Government Support)

---

## 2. 구현 범위

### 2-1. MVP 포함

- Hero + 정책 기준일 안내
- Hero KPI 또는 요약 카드 5개
- `내 상황 선택` 인터랙션
- 추천 지원 3개 카드 자동 갱신
- 지원제도 5대 카테고리 카드
- 전세대출 비교표
- 구입대출 비교표
- 취득세·세액공제 체크 섹션
- 특별공급 비교 섹션
- 출산·육아 지원 묶음
- 지역별 지원 확인법
- 중복 가능성 체크 매트릭스
- 신청 시기별 체크리스트
- FAQ visible
- 관련 계산기·리포트 CTA
- `SeoContent` 하단 배치

### 2-2. MVP 제외

- 실시간 정책 API 연동
- 사용자의 소득·자산 입력을 받아 자격 판정하는 계산기
- 시군구 전체 지원금 DB
- 대출 한도·금리 자동 계산
- 청약 당첨 가능성 예측
- 신청서 자동 작성

### 2-3. 후속 확장 후보

- `/tools/newlywed-loan-eligibility/` 신혼부부 정책대출 자격 체크
- `/tools/newlywed-special-supply-checklist/` 신혼부부 특별공급 체크리스트
- `/tools/newlywed-support-finder/` 신혼부부 지원금 찾기
- 지역별 결혼축하금·출산지원금 데이터 확장

---

## 3. 페이지 IA

```text
Hero
 ├─ eyebrow: 신혼부부 정책 가이드
 ├─ title: 2026 신혼부부 정부지원 완전정리
 ├─ description: 혼인세액공제·정책대출·특별공급·출산지원금·지역지원
 └─ badge: 2026 / 신혼부부 / 대출 / 청약 / 출산지원

InfoNotice
 └─ 정책 기준일, 공식 확인 필요, 추정/참고 배지 안내

Section 1. 한눈에 보는 5대 지원
 └─ 세금 / 전세 / 매매 / 청약 / 출산·지역 카드

Section 2. 내 상황별 먼저 볼 지원 ★ 핵심 인터랙션
 ├─ scenario select 또는 chips
 ├─ 추천 지원 3개 카드
 └─ 바로가기 CTA

Section 3. 혼인세액공제와 연말정산 체크
Section 4. 전세대출 비교 — 신혼부부전용 vs 신생아 특례 버팀목
Section 5. 구입대출 비교 — 신혼부부전용 vs 신생아 특례 디딤돌
Section 6. 생애최초·출산가구 취득세 감면
Section 7. 특별공급 비교 — 신혼부부 vs 생애최초 vs 신생아
Section 8. 출산·육아 지원금 핵심 묶음
Section 9. 지역별 특이 지원 확인법
Section 10. 중복 가능성 체크
Section 11. 신청 시기별 체크리스트
Section 12. 놓치기 쉬운 실수 TOP 7
Section 13. 관련 계산기와 리포트 CTA
SeoContent
 ├─ 기준/주의
 ├─ FAQ
 └─ 관련 링크
```

---

## 4. 데이터 파일 설계

**파일:** `src/data/newlywedGovernmentSupport2026.ts`

### 4-1. 타입 정의

```ts
export type SupportBadge =
  | "official"
  | "official-check"
  | "local-check"
  | "estimate"
  | "reference";

export type SupportCategory =
  | "tax"
  | "rentLoan"
  | "purchaseLoan"
  | "subscription"
  | "birthChildcare"
  | "local";

export type ScenarioId =
  | "marriageRegistration"
  | "rentHome"
  | "buyFirstHome"
  | "subscription"
  | "pregnancyBirth"
  | "localSupport";

export type SupportItem = {
  id: string;
  category: SupportCategory;
  title: string;
  shortTitle: string;
  summary: string;
  target: string;
  benefit: string;
  timing: string;
  keyConditions: string[];
  applyWhere: string[];
  badge: SupportBadge;
  sourceName: string;
  sourceUrl: string;
  updatedAt: string;
  caution?: string;
  relatedLinks?: {
    label: string;
    href: string;
  }[];
};

export type ScenarioGuide = {
  id: ScenarioId;
  label: string;
  shortLabel: string;
  description: string;
  recommendedSupportIds: string[];
  ctaLabel: string;
  ctaHref: string;
  caution: string;
};

export type ComparisonColumn = {
  label: string;
  value: string;
  badge?: SupportBadge;
};

export type ComparisonRow = {
  label: string;
  columns: ComparisonColumn[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};
```

### 4-2. 메타

```ts
export const NGS_META = {
  slug: "newlywed-government-support-2026",
  title: "2026 신혼부부 정부지원 완전정리",
  seoTitle:
    "2026 신혼부부 정부지원 총정리 - 혼인세액공제·전세대출·특별공급·출산지원금",
  seoDescription:
    "2026년 신혼부부가 확인해야 할 정부지원을 한눈에 정리했습니다. 혼인세액공제, 신혼부부 전세대출, 신생아 특례대출, 신혼부부 특별공급, 생애최초 취득세 감면, 출산·육아 지원금과 지역별 지원 확인법까지 비교하세요.",
  description:
    "결혼신고부터 신혼집, 출산, 청약, 세금까지 신혼부부가 먼저 확인해야 할 정부지원을 한 페이지에서 비교합니다.",
  updatedAt: "2026-07-08",
  기준일: "2026년 7월 기준",
  dataNote:
    "정책대출 금리, 소득 기준, 특별공급 요건, 지자체 지원금은 신청 시점과 공고에 따라 달라질 수 있습니다. 이 리포트는 2026년 기준 확인용 가이드이며 신청 전 공식 기관 공고를 반드시 확인해야 합니다.",
};
```

### 4-3. 배지 라벨

```ts
export const NGS_BADGE_LABEL: Record<SupportBadge, string> = {
  official: "공식",
  "official-check": "공식 확인",
  "local-check": "지역별 확인",
  estimate: "추정",
  reference: "참고",
};
```

### 4-4. Hero 요약 카드

```ts
export const NGS_OVERVIEW_CARDS = [
  {
    category: "tax",
    title: "세금",
    summary: "혼인세액공제, 생애최초·출산가구 취득세 감면",
    target: "혼인신고·첫 집 구입 예정",
  },
  {
    category: "rentLoan",
    title: "전세",
    summary: "신혼부부전용 전세자금, 신생아 특례 버팀목",
    target: "전세 계약 예정",
  },
  {
    category: "purchaseLoan",
    title: "매매",
    summary: "신혼부부 구입자금, 신생아 특례 디딤돌",
    target: "주택 매수 예정",
  },
  {
    category: "subscription",
    title: "청약",
    summary: "신혼부부·생애최초·신생아 공급",
    target: "분양 청약 준비",
  },
  {
    category: "birthChildcare",
    title: "출산·지역",
    summary: "첫만남이용권, 부모급여, 지자체 지원금",
    target: "임신·출산 예정",
  },
];
```

### 4-5. 지원 제도 데이터

```ts
export const NGS_SUPPORT_ITEMS: SupportItem[] = [
  {
    id: "marriage-tax-credit",
    category: "tax",
    title: "혼인세액공제",
    shortTitle: "혼인세액공제",
    summary: "혼인신고 후 연말정산에서 확인할 수 있는 세액공제 항목입니다.",
    target: "혼인신고를 한 부부",
    benefit: "연말정산 세액공제",
    timing: "혼인신고 연도와 연말정산 시점 확인",
    keyConditions: ["혼인신고 여부", "적용 연도", "부부 각각 적용 여부"],
    applyWhere: ["국세청 홈택스", "연말정산 간소화", "회사 연말정산 담당"],
    badge: "official-check",
    sourceName: "국세청",
    sourceUrl: "https://www.nts.go.kr",
    updatedAt: "2026-07-08",
    caution: "구현 시점에 국세청 최신 연말정산 안내로 금액과 적용 조건을 재확인해야 합니다.",
  },
  {
    id: "newlywed-rent-loan",
    category: "rentLoan",
    title: "신혼부부전용 전세자금",
    shortTitle: "신혼 전세대출",
    summary: "무주택 신혼부부의 전세보증금 마련을 돕는 주택도시기금 상품입니다.",
    target: "혼인 기간 요건을 충족한 무주택 신혼부부",
    benefit: "전세자금 대출",
    timing: "임대차계약 후 대출 신청 기한 확인",
    keyConditions: ["혼인 기간", "부부합산 소득", "순자산", "임차보증금", "전용면적"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "newborn-rent-loan",
    category: "rentLoan",
    title: "신생아 특례 버팀목대출",
    shortTitle: "신생아 전세대출",
    summary: "출산가구의 전세자금을 지원하는 주택도시기금 특례 상품입니다.",
    target: "일정 기간 내 출산한 무주택 가구",
    benefit: "전세자금 특례대출",
    timing: "대출 신청일과 출산일 기준 확인",
    keyConditions: ["출산 요건", "부부합산 소득", "순자산", "임차보증금", "우대금리"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "newlywed-purchase-loan",
    category: "purchaseLoan",
    title: "신혼부부전용 구입자금",
    shortTitle: "신혼 구입대출",
    summary: "무주택 신혼부부의 주택 구입을 지원하는 정책대출입니다.",
    target: "주택 매수를 준비하는 무주택 신혼부부",
    benefit: "주택구입자금 대출",
    timing: "매매계약과 소유권 이전 전후 신청 기한 확인",
    keyConditions: ["혼인 기간", "소득", "순자산", "주택가격", "대출한도"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "newborn-didimdol-loan",
    category: "purchaseLoan",
    title: "신생아 특례 디딤돌대출",
    shortTitle: "신생아 구입대출",
    summary: "출산가구의 주택 구입을 지원하는 특례 디딤돌대출입니다.",
    target: "일정 기간 내 출산한 무주택 가구",
    benefit: "주택구입자금 특례대출",
    timing: "대출 신청일과 출산일 기준 확인",
    keyConditions: ["출산 요건", "소득", "순자산", "주택가격", "특례금리"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "first-home-acquisition-tax",
    category: "tax",
    title: "생애최초 주택 취득세 감면",
    shortTitle: "생애최초 취득세",
    summary: "첫 주택 구입 시 취득세 부담을 줄일 수 있는 지방세 감면 제도입니다.",
    target: "본인·배우자 기준 첫 주택 구입자",
    benefit: "취득세 감면",
    timing: "주택 취득일과 감면 신청 시점 확인",
    keyConditions: ["생애최초 여부", "주택가격", "세대 기준", "실거주", "추징 요건"],
    applyWhere: ["위택스", "시군구 세무부서"],
    badge: "official-check",
    sourceName: "위택스·행정안전부",
    sourceUrl: "https://www.wetax.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "newlywed-special-supply",
    category: "subscription",
    title: "신혼부부 특별공급",
    shortTitle: "신혼부부 특공",
    summary: "신혼부부에게 별도 물량을 배정하는 청약 특별공급 유형입니다.",
    target: "혼인 기간·무주택·소득·자산 요건을 충족한 신혼부부",
    benefit: "청약 특별공급 기회",
    timing: "모집공고일 기준 자격 확인",
    keyConditions: ["혼인 기간", "무주택", "청약통장", "소득", "자산", "자녀"],
    applyWhere: ["청약홈", "LH", "마이홈"],
    badge: "official-check",
    sourceName: "청약홈·마이홈",
    sourceUrl: "https://www.applyhome.co.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "birth-childcare-support",
    category: "birthChildcare",
    title: "출산·육아 지원금",
    shortTitle: "출산·육아 지원",
    summary: "첫만남이용권, 부모급여, 아동수당 등 출산 후 바로 확인할 지원입니다.",
    target: "임신·출산 예정 또는 영유아 양육 가구",
    benefit: "바우처·현금성 양육 지원",
    timing: "임신 확인, 출생신고, 출생 후 신청 기한 확인",
    keyConditions: ["출생아 기준", "아동 연령", "신청 기한", "사용처"],
    applyWhere: ["복지로", "정부24", "주민센터"],
    badge: "official-check",
    sourceName: "복지로·정부24",
    sourceUrl: "https://www.bokjiro.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "local-newlywed-support",
    category: "local",
    title: "지역별 결혼·출산·주거 지원",
    shortTitle: "지역별 지원",
    summary: "결혼축하금, 임차보증금 이자지원, 출산지원금처럼 지자체별로 다른 지원입니다.",
    target: "거주지 지자체 요건을 충족한 신혼·출산 가구",
    benefit: "지역별 현금·이자·바우처 지원",
    timing: "혼인신고일, 전입일, 출생신고일, 공고 기간 확인",
    keyConditions: ["주소지", "거주 기간", "혼인신고일", "출생신고일", "예산 소진 여부"],
    applyWhere: ["정부24 보조금24", "지자체 홈페이지", "주민센터"],
    badge: "local-check",
    sourceName: "정부24·지자체",
    sourceUrl: "https://www.gov.kr",
    updatedAt: "2026-07-08",
  },
];
```

### 4-6. 시나리오 데이터

```ts
export const NGS_SCENARIOS: ScenarioGuide[] = [
  {
    id: "marriageRegistration",
    label: "혼인신고 예정",
    shortLabel: "혼인신고",
    description: "혼인신고일 기준으로 받을 수 있는 세금·지역 지원을 먼저 확인합니다.",
    recommendedSupportIds: ["marriage-tax-credit", "local-newlywed-support", "birth-childcare-support"],
    ctaLabel: "연말정산 환급액 계산하기",
    ctaHref: "/tools/year-end-tax-refund-calculator/",
    caution: "결혼식 날짜가 아니라 가족관계등록부상 혼인신고일이 기준이 되는 경우가 많습니다.",
  },
  {
    id: "rentHome",
    label: "전세집 계약 예정",
    shortLabel: "전세 예정",
    description: "전세보증금, 소득, 자녀 유무에 따라 신혼 전세대출과 신생아 특례를 비교합니다.",
    recommendedSupportIds: ["newlywed-rent-loan", "newborn-rent-loan", "local-newlywed-support"],
    ctaLabel: "전세와 월세 비용 비교하기",
    ctaHref: "/tools/jeonse-vs-wolse-calculator/",
    caution: "대출 금리보다 대출 한도, 보증금 기준, 신청 기한을 함께 봐야 합니다.",
  },
  {
    id: "buyFirstHome",
    label: "첫 집 매수 예정",
    shortLabel: "첫 집 매수",
    description: "정책대출, 취득세 감면, 생애최초 요건을 한 번에 확인합니다.",
    recommendedSupportIds: ["newlywed-purchase-loan", "newborn-didimdol-loan", "first-home-acquisition-tax"],
    ctaLabel: "취득세 감면 전후 계산하기",
    ctaHref: "/tools/real-estate-acquisition-tax/",
    caution: "생애최초 여부는 본인뿐 아니라 배우자와 세대 기준까지 확인해야 합니다.",
  },
  {
    id: "subscription",
    label: "청약 준비 중",
    shortLabel: "청약",
    description: "신혼부부·생애최초·신생아 공급 중 공고별로 유리한 유형을 확인합니다.",
    recommendedSupportIds: ["newlywed-special-supply", "first-home-acquisition-tax", "birth-childcare-support"],
    ctaLabel: "청약 가점 계산하기",
    ctaHref: "/tools/apt-cheonyak-gajum-calculator/",
    caution: "특별공급은 모집공고일 기준 요건과 중복 청약 제한을 반드시 확인해야 합니다.",
  },
  {
    id: "pregnancyBirth",
    label: "임신·출산 예정",
    shortLabel: "출산 예정",
    description: "출산 이후 바로 신청해야 하는 중앙정부·지자체 지원을 정리합니다.",
    recommendedSupportIds: ["birth-childcare-support", "newborn-rent-loan", "newborn-didimdol-loan"],
    ctaLabel: "지역별 출산지원금 보기",
    ctaHref: "/reports/birth-support-by-region-2026/",
    caution: "출생신고 후 신청 기한이 짧은 지자체 지원이 있을 수 있습니다.",
  },
  {
    id: "localSupport",
    label: "지역 지원금 찾는 중",
    shortLabel: "지역지원",
    description: "결혼축하금, 임차보증금 이자지원, 산후조리비 등 지역별 지원 확인 경로를 봅니다.",
    recommendedSupportIds: ["local-newlywed-support", "birth-childcare-support", "newlywed-rent-loan"],
    ctaLabel: "보조금24에서 확인하기",
    ctaHref: "https://www.gov.kr",
    caution: "지자체 지원은 전입 기간, 거주 기간, 예산 소진 여부가 특히 중요합니다.",
  },
];
```

### 4-7. 비교표 데이터

```ts
export const NGS_RENT_LOAN_COMPARE: ComparisonRow[] = [
  {
    label: "핵심 대상",
    columns: [
      { label: "신혼부부전용 전세자금", value: "혼인 기간 요건을 충족한 무주택 신혼부부", badge: "official" },
      { label: "신생아 특례 버팀목", value: "일정 기간 내 출산한 무주택 출산가구", badge: "official" },
    ],
  },
  {
    label: "자녀 요건",
    columns: [
      { label: "신혼부부전용 전세자금", value: "자녀 없음도 가능" },
      { label: "신생아 특례 버팀목", value: "출산 요건 핵심" },
    ],
  },
  {
    label: "주의",
    columns: [
      { label: "신혼부부전용 전세자금", value: "부부합산 소득·임차보증금·신청 기한 확인" },
      { label: "신생아 특례 버팀목", value: "출산일과 대출 신청일 기준 확인" },
    ],
  },
];

export const NGS_PURCHASE_LOAN_COMPARE: ComparisonRow[] = [
  {
    label: "핵심 대상",
    columns: [
      { label: "신혼부부전용 구입자금", value: "주택 매수를 준비하는 무주택 신혼부부", badge: "official" },
      { label: "신생아 특례 디딤돌", value: "일정 기간 내 출산한 무주택 가구", badge: "official" },
    ],
  },
  {
    label: "확인 항목",
    columns: [
      { label: "신혼부부전용 구입자금", value: "소득, 순자산, 주택가격, 대출한도" },
      { label: "신생아 특례 디딤돌", value: "출산 요건, 맞벌이 기준, 특례금리, 우대금리" },
    ],
  },
  {
    label: "주의",
    columns: [
      { label: "신혼부부전용 구입자금", value: "금리만 보지 말고 필요 현금까지 계산" },
      { label: "신생아 특례 디딤돌", value: "출산가구라도 주택가격·소득 기준 초과 시 제한" },
    ],
  },
];
```

### 4-8. FAQ와 관련 링크

```ts
export const NGS_FAQ: FaqItem[] = [
  {
    question: "신혼부부 정부지원은 혼인신고를 해야 받을 수 있나요?",
    answer:
      "대부분의 신혼부부 지원은 혼인신고일을 기준으로 판단합니다. 결혼식 날짜가 아니라 가족관계등록부상 혼인신고일, 모집공고일, 대출 신청일을 기준으로 보는 경우가 많으므로 신청 전 기준일을 확인해야 합니다.",
  },
  {
    question: "결혼식만 하고 혼인신고를 안 하면 혼인세액공제를 받을 수 있나요?",
    answer:
      "혼인세액공제는 혼인신고 여부와 적용 연도를 확인해야 하는 세금 혜택입니다. 실제 적용 여부와 공제 금액은 국세청 최신 연말정산 안내를 기준으로 확인해야 합니다.",
  },
  {
    question: "신혼부부 전세대출과 신생아 특례 버팀목대출은 무엇이 다른가요?",
    answer:
      "신혼부부전용 전세자금은 혼인 기간 요건을 중심으로 보고, 신생아 특례 버팀목대출은 출산 요건이 핵심입니다. 실제 유불리는 소득, 보증금, 대출 한도, 금리, 우대금리에 따라 달라집니다.",
  },
  {
    question: "신혼부부 특별공급은 자녀가 없어도 신청할 수 있나요?",
    answer:
      "공급 유형과 공고에 따라 자녀 여부, 혼인 기간, 소득, 자산, 청약통장 요건이 달라집니다. 자녀가 없더라도 가능한 유형이 있을 수 있지만 모집공고문 확인이 필수입니다.",
  },
  {
    question: "지역별 결혼축하금은 어디서 확인하나요?",
    answer:
      "정부24 보조금24, 거주 지자체 홈페이지, 읍면동 주민센터, 지자체 청년·인구정책 페이지에서 확인하는 것이 가장 정확합니다.",
  },
  {
    question: "출산지원금은 중앙정부 지원과 지자체 지원을 둘 다 받을 수 있나요?",
    answer:
      "첫만남이용권, 부모급여, 아동수당 같은 중앙정부 지원과 지자체 출산지원금은 성격이 달라 함께 받을 수 있는 경우가 많습니다. 다만 지자체 지원은 거주 기간과 신청 기한을 확인해야 합니다.",
  },
];

export const NGS_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/newlywed-cost-2026/",
    label: "신혼부부 결혼·신혼집 비용 완전 분석",
    description: "신혼집, 혼수, 초기 생활비를 먼저 파악합니다.",
  },
  {
    href: "/reports/first-home-buyer-benefits-2026/",
    label: "생애최초 주택 구입 혜택 완전 분석",
    description: "취득세 감면, 정책대출, 특별공급을 더 자세히 봅니다.",
  },
  {
    href: "/reports/birth-support-by-region-2026/",
    label: "지역별 출산지원금 비교",
    description: "출산 후 받을 수 있는 지역별 지원금을 비교합니다.",
  },
  {
    href: "/tools/jeonse-vs-wolse-calculator/",
    label: "전세 vs 월세 비용 비교 계산기",
    description: "전세대출 전 실제 비용 차이를 계산합니다.",
  },
];
```

---

## 5. Astro 페이지 설계

**파일:** `src/pages/reports/newlywed-government-support-2026.astro`

### 5-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  NGS_META,
  NGS_BADGE_LABEL,
  NGS_OVERVIEW_CARDS,
  NGS_SUPPORT_ITEMS,
  NGS_SCENARIOS,
  NGS_RENT_LOAN_COMPARE,
  NGS_PURCHASE_LOAN_COMPARE,
  NGS_FAQ,
  NGS_RELATED_LINKS,
} from "../../data/newlywedGovernmentSupport2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${NGS_META.slug}/`;

const supportById = Object.fromEntries(NGS_SUPPORT_ITEMS.map((item) => [item.id, item]));
const defaultScenario = NGS_SCENARIOS[0];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: NGS_META.title,
    description: NGS_META.seoDescription,
    dateModified: NGS_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: NGS_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteBase },
      { "@type": "ListItem", position: 2, name: "리포트", item: `${siteBase}/reports/` },
      { "@type": "ListItem", position: 3, name: NGS_META.title, item: reportUrl },
    ],
  },
];
---
```

### 5-2. Hero와 안내

```astro
<BaseLayout title={NGS_META.seoTitle} description={NGS_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page op-page ngs-page" data-report="newlywed-government-support-2026">
    <CalculatorHero
      eyebrow="신혼부부 정책 가이드"
      title={NGS_META.title}
      description={NGS_META.description}
      badges={["2026", "신혼부부", "대출", "청약", "출산지원"]}
    />

    <InfoNotice
      title="읽기 전 꼭 확인하세요"
      lines={[
        NGS_META.dataNote,
        "금액 계산값이 들어가는 경우에는 공식 수치가 아니라 추정 또는 참고로 표시합니다.",
      ]}
    />
```

### 5-3. overview 카드

```astro
<section class="op-section ngs-overview-section">
  <h2>신혼부부 정부지원 한눈에 보기</h2>
  <p class="op-message">결혼신고, 전세, 매매, 청약, 출산 단계마다 먼저 확인할 제도가 다릅니다.</p>
  <div class="ngs-overview-grid">
    {NGS_OVERVIEW_CARDS.map((card) => (
      <article class={`ngs-overview-card ngs-overview-card--${card.category}`}>
        <strong>{card.title}</strong>
        <p>{card.summary}</p>
        <small>{card.target}</small>
      </article>
    ))}
  </div>
</section>
```

### 5-4. 핵심 인터랙션

```astro
<section class="op-section ngs-scenario-section" id="scenario-guide">
  <h2>내 상황별 먼저 볼 지원</h2>
  <p class="op-message">가장 가까운 상황을 선택하면 우선 확인할 지원 3개와 바로가기 CTA가 바뀝니다.</p>

  <div class="ngs-scenario-tabs" role="tablist" aria-label="신혼부부 상황 선택">
    {NGS_SCENARIOS.map((scenario, index) => (
      <button
        class={`ngs-scenario-tab${index === 0 ? " is-active" : ""}`}
        type="button"
        role="tab"
        aria-selected={index === 0 ? "true" : "false"}
        data-scenario-id={scenario.id}
      >
        {scenario.shortLabel}
      </button>
    ))}
  </div>

  <div
    class="ngs-scenario-result"
    id="ngs-scenario-result"
    data-scenarios={JSON.stringify(NGS_SCENARIOS)}
    data-supports={JSON.stringify(NGS_SUPPORT_ITEMS)}
    data-badge-labels={JSON.stringify(NGS_BADGE_LABEL)}
  >
    <div class="ngs-scenario-copy">
      <strong id="ngs-scenario-title">{defaultScenario.label}</strong>
      <p id="ngs-scenario-description">{defaultScenario.description}</p>
      <small id="ngs-scenario-caution">{defaultScenario.caution}</small>
    </div>

    <div class="ngs-recommend-grid" id="ngs-recommend-grid">
      {defaultScenario.recommendedSupportIds.map((supportId) => {
        const item = supportById[supportId];
        return (
          <article class="ngs-recommend-card">
            <span class={`ngs-badge ngs-badge--${item.badge}`}>{NGS_BADGE_LABEL[item.badge]}</span>
            <strong>{item.shortTitle}</strong>
            <p>{item.summary}</p>
            <small>{item.timing}</small>
          </article>
        );
      })}
    </div>

    <a class="ngs-scenario-cta" id="ngs-scenario-cta" href={defaultScenario.ctaHref}>
      {defaultScenario.ctaLabel}
    </a>
  </div>
</section>
```

### 5-5. 지원 제도 카드 목록

```astro
<section class="op-section">
  <h2>주요 지원제도 상세</h2>
  <div class="ngs-support-grid">
    {NGS_SUPPORT_ITEMS.map((item) => (
      <article class={`ngs-support-card ngs-support-card--${item.category}`} id={item.id}>
        <div class="ngs-support-card__head">
          <span class={`ngs-badge ngs-badge--${item.badge}`}>{NGS_BADGE_LABEL[item.badge]}</span>
          <strong>{item.title}</strong>
        </div>
        <p>{item.summary}</p>
        <dl class="ngs-mini-defs">
          <div><dt>대상</dt><dd>{item.target}</dd></div>
          <div><dt>혜택</dt><dd>{item.benefit}</dd></div>
          <div><dt>신청·확인</dt><dd>{item.applyWhere.join(", ")}</dd></div>
        </dl>
        <ul class="ngs-condition-list">
          {item.keyConditions.map((condition) => <li>{condition}</li>)}
        </ul>
        {item.caution && <p class="ngs-card-caution">{item.caution}</p>}
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">공식 출처 확인</a>
      </article>
    ))}
  </div>
</section>
```

### 5-6. 비교표 컴포넌트형 마크업

페이지 내부에서 반복 사용한다. 별도 컴포넌트 분리는 선택사항.

```astro
<section class="op-section">
  <h2>신혼부부 전세대출 vs 신생아 특례 버팀목</h2>
  <div class="ngs-compare-table-wrap">
    <table class="ngs-compare-table">
      <thead>
        <tr>
          <th>비교 항목</th>
          <th>신혼부부전용 전세자금</th>
          <th>신생아 특례 버팀목대출</th>
        </tr>
      </thead>
      <tbody>
        {NGS_RENT_LOAN_COMPARE.map((row) => (
          <tr>
            <th>{row.label}</th>
            {row.columns.map((column) => (
              <td>
                {column.badge && <span class={`ngs-badge ngs-badge--${column.badge}`}>{NGS_BADGE_LABEL[column.badge]}</span>}
                <p>{column.value}</p>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="op-message">출산가구라면 신혼부부 전용 상품과 신생아 특례 상품을 함께 비교하세요. 실제 금리와 한도는 신청 시점 기준으로 확인해야 합니다.</p>
</section>
```

### 5-7. 하단 SeoContent

```astro
<SeoContent
  introTitle="2026 신혼부부 정부지원 핵심 정리"
  intro={[NGS_META.description, NGS_META.dataNote]}
  criteria={[
    "정책대출 금리와 한도는 신청 시점과 우대금리에 따라 달라질 수 있습니다.",
    "청약 특별공급은 모집공고별 기준이 중요하므로 공고문 확인이 필수입니다.",
    "지자체 지원금은 전입 기간, 거주 기간, 신청 기한, 예산 소진 여부를 함께 확인해야 합니다.",
    "추정 계산값은 공식 지급액이나 대출 승인 결과가 아닙니다.",
  ]}
  faq={NGS_FAQ}
  related={NGS_RELATED_LINKS.map((link) => ({ href: link.href, label: link.label }))}
/>
```

---

## 6. 클라이언트 스크립트 설계

**파일:** `public/scripts/newlywed-government-support-2026.js`

### 6-1. 역할

- 상황 탭 클릭 시 추천 지원 카드 3개를 갱신한다.
- CTA 문구와 링크를 갱신한다.
- URL hash 또는 query 없이도 동작하는 가벼운 인터랙션으로 유지한다.
- 외부 링크 CTA는 새 창이 필요한지 페이지 마크업에서 처리한다. JS는 href만 갱신한다.

### 6-2. 함수 목록

| 함수 | 역할 |
|---|---|
| `parseData()` | `data-scenarios`, `data-supports`, `data-badge-labels` 파싱 |
| `findScenario(id)` | 시나리오 찾기 |
| `findSupport(id)` | 지원 제도 찾기 |
| `renderRecommendedCards(scenario)` | 추천 카드 3개 렌더링 |
| `updateScenario(id)` | 제목, 설명, 주의, 카드, CTA 전체 갱신 |
| `initScenarioTabs()` | 탭 클릭 이벤트 바인딩 |
| `escapeHtml(value)` | JS 템플릿 문자열 XSS 방지 |

### 6-3. 구현 예시

```js
(function () {
  const root = document.getElementById("ngs-scenario-result");
  if (!root) return;

  let scenarios = [];
  let supports = [];
  let badgeLabels = {};

  function parseJson(value, fallback) {
    try {
      return JSON.parse(value || "");
    } catch (_error) {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseData() {
    scenarios = parseJson(root.dataset.scenarios, []);
    supports = parseJson(root.dataset.supports, []);
    badgeLabels = parseJson(root.dataset.badgeLabels, {});
  }

  function findScenario(id) {
    return scenarios.find((scenario) => scenario.id === id) || scenarios[0];
  }

  function findSupport(id) {
    return supports.find((support) => support.id === id);
  }

  function renderRecommendedCards(scenario) {
    const grid = document.getElementById("ngs-recommend-grid");
    if (!grid || !scenario) return;

    const html = scenario.recommendedSupportIds
      .map(findSupport)
      .filter(Boolean)
      .map((item) => {
        const badgeLabel = badgeLabels[item.badge] || item.badge;
        return `
          <article class="ngs-recommend-card">
            <span class="ngs-badge ngs-badge--${escapeHtml(item.badge)}">${escapeHtml(badgeLabel)}</span>
            <strong>${escapeHtml(item.shortTitle)}</strong>
            <p>${escapeHtml(item.summary)}</p>
            <small>${escapeHtml(item.timing)}</small>
          </article>
        `;
      })
      .join("");

    grid.innerHTML = html;
  }

  function updateScenario(id) {
    const scenario = findScenario(id);
    if (!scenario) return;

    const title = document.getElementById("ngs-scenario-title");
    const description = document.getElementById("ngs-scenario-description");
    const caution = document.getElementById("ngs-scenario-caution");
    const cta = document.getElementById("ngs-scenario-cta");

    if (title) title.textContent = scenario.label;
    if (description) description.textContent = scenario.description;
    if (caution) caution.textContent = scenario.caution;
    if (cta) {
      cta.textContent = scenario.ctaLabel;
      cta.setAttribute("href", scenario.ctaHref);
      if (scenario.ctaHref.startsWith("http")) {
        cta.setAttribute("target", "_blank");
        cta.setAttribute("rel", "noopener noreferrer");
      } else {
        cta.removeAttribute("target");
        cta.removeAttribute("rel");
      }
    }

    renderRecommendedCards(scenario);

    document.querySelectorAll(".ngs-scenario-tab").forEach((tab) => {
      const isActive = tab.dataset.scenarioId === scenario.id;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function initScenarioTabs() {
    document.querySelectorAll(".ngs-scenario-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        updateScenario(tab.dataset.scenarioId);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    parseData();
    initScenarioTabs();
  });
})();
```

### 6-4. 보안 주의

- 사용자 입력은 없지만 JSON 데이터가 `innerHTML`로 렌더링되므로 `escapeHtml`을 반드시 적용한다.
- 외부 링크에는 `target="_blank"`와 `rel="noopener noreferrer"`를 적용한다.
- `eval` 사용 금지.

---

## 7. SCSS 설계

**파일:** `src/styles/scss/pages/_newlywed-government-support-2026.scss`

### 7-1. 원칙

- 모든 페이지 전용 클래스는 `ngs-` prefix 사용.
- 기존 `.op-page`, `.op-section`, `.op-message`, `.op-card-grid` 공유 스타일을 베이스로 사용한다.
- 정책 리포트이므로 과한 장식보다 표·카드 가독성을 우선한다.
- 모바일에서는 표를 카드형 또는 가로 스크롤로 안전하게 처리한다.

### 7-2. 색상 톤

```scss
.ngs-page {
  --ngs-line: #dfe7ef;
  --ngs-tax: #2f80ed;
  --ngs-rent: #00a884;
  --ngs-purchase: #7b61ff;
  --ngs-subscription: #f2994a;
  --ngs-birth: #eb5757;
  --ngs-local: #6f7782;
  --ngs-soft: #f7fafc;
}
```

### 7-3. 주요 스타일

```scss
.ngs-page {
  .ngs-overview-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.875rem;

    @media (max-width: 960px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
  }

  .ngs-overview-card,
  .ngs-support-card,
  .ngs-recommend-card {
    border: 1px solid var(--ngs-line);
    border-radius: 10px;
    background: #fff;
    padding: 1rem;
  }

  .ngs-overview-card {
    border-top: 4px solid var(--ngs-local);

    &--tax { border-top-color: var(--ngs-tax); }
    &--rentLoan { border-top-color: var(--ngs-rent); }
    &--purchaseLoan { border-top-color: var(--ngs-purchase); }
    &--subscription { border-top-color: var(--ngs-subscription); }
    &--birthChildcare { border-top-color: var(--ngs-birth); }

    strong {
      display: block;
      font-size: 1rem;
      margin-bottom: 0.35rem;
    }

    p {
      margin: 0 0 0.5rem;
      color: var(--color-text-secondary);
      line-height: 1.55;
    }

    small {
      color: var(--color-text-muted);
    }
  }

  .ngs-scenario-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .ngs-scenario-tab {
    border: 1px solid var(--ngs-line);
    border-radius: 999px;
    background: #fff;
    color: var(--color-text);
    padding: 0.5rem 0.9rem;
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;

    &.is-active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
      font-weight: 700;
    }
  }

  .ngs-scenario-result {
    border: 1px solid var(--ngs-line);
    border-radius: 12px;
    background: var(--ngs-soft);
    padding: 1.25rem;
  }

  .ngs-scenario-copy {
    margin-bottom: 1rem;

    strong {
      display: block;
      font-size: 1.15rem;
      margin-bottom: 0.35rem;
    }

    p {
      margin: 0 0 0.35rem;
      line-height: 1.65;
    }

    small {
      color: var(--color-text-secondary);
    }
  }

  .ngs-recommend-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;

    @media (max-width: 760px) {
      grid-template-columns: 1fr;
    }
  }

  .ngs-recommend-card {
    strong {
      display: block;
      margin: 0.45rem 0 0.3rem;
    }

    p {
      margin: 0 0 0.5rem;
      line-height: 1.55;
      color: var(--color-text-secondary);
    }

    small {
      color: var(--color-text-muted);
    }
  }

  .ngs-scenario-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    min-height: 42px;
    border-radius: 8px;
    padding: 0.6rem 1rem;
    background: var(--color-primary);
    color: #fff;
    font-weight: 700;
    text-decoration: none;
  }

  .ngs-support-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;

    @media (max-width: 760px) {
      grid-template-columns: 1fr;
    }
  }

  .ngs-support-card__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.65rem;
  }

  .ngs-mini-defs {
    display: grid;
    gap: 0.45rem;
    margin: 0.75rem 0;

    div {
      display: grid;
      grid-template-columns: 5rem 1fr;
      gap: 0.5rem;
    }

    dt {
      color: var(--color-text-muted);
      font-weight: 700;
    }

    dd {
      margin: 0;
      color: var(--color-text-secondary);
    }
  }

  .ngs-condition-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    list-style: none;
    margin: 0.75rem 0;
    padding: 0;

    li {
      border-radius: 999px;
      background: #eef5fb;
      color: #31536a;
      padding: 0.25rem 0.55rem;
      font-size: 0.78rem;
      font-weight: 700;
    }
  }

  .ngs-card-caution {
    border-left: 3px solid var(--ngs-subscription);
    background: #fff8ed;
    margin: 0.75rem 0;
    padding: 0.65rem 0.75rem;
    color: #70420e;
    font-size: 0.88rem;
    line-height: 1.6;
  }

  .ngs-badge {
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
    font-size: 0.74rem;
    font-weight: 800;
    line-height: 1;

    &--official {
      background: #e7f6ef;
      color: #137a4f;
    }

    &--official-check {
      background: #eaf2ff;
      color: #225aa7;
    }

    &--local-check {
      background: #f2f4f7;
      color: #475467;
    }

    &--estimate {
      background: #fff3df;
      color: #9a5b00;
    }

    &--reference {
      background: #f3ecff;
      color: #6840a8;
    }
  }

  .ngs-compare-table-wrap {
    width: 100%;
    overflow-x: auto;
    border: 1px solid var(--ngs-line);
    border-radius: 10px;
  }

  .ngs-compare-table {
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
    font-size: 0.9rem;

    th,
    td {
      border-bottom: 1px solid var(--ngs-line);
      padding: 0.75rem;
      text-align: left;
      vertical-align: top;
    }

    thead th {
      background: var(--ngs-soft);
      font-weight: 800;
    }

    tbody th {
      width: 9rem;
      background: #fbfdff;
    }

    p {
      margin: 0.35rem 0 0;
      line-height: 1.55;
    }
  }

  .ngs-check-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (max-width: 760px) {
      grid-template-columns: 1fr;
    }
  }

  .ngs-check-card {
    border: 1px solid var(--ngs-line);
    border-radius: 10px;
    padding: 0.9rem;
    background: #fff;
  }

  .ngs-step-list {
    display: grid;
    gap: 0.65rem;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      border: 1px solid var(--ngs-line);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      background: #fff;
    }
  }
}
```

---

## 8. 사이트 등록 작업

### 8-1. `src/data/reports.ts`

```ts
{
  slug: "newlywed-government-support-2026",
  title: "2026 신혼부부 정부지원 완전정리",
  description: "혼인세액공제, 신혼부부 전세대출, 신생아 특례대출, 특별공급, 생애최초 취득세 감면, 출산·육아 지원금과 지역별 지원 확인법까지 한눈에 비교합니다.",
  order: 76,
  badges: ["신혼부부", "정부지원", "대출", "청약", "출산지원"],
},
```

### 8-2. `src/pages/index.astro`

```ts
"newlywed-government-support-2026": { category: "support", isNew: true },
```

### 8-3. `src/pages/reports/index.astro`

```ts
"newlywed-government-support-2026": {
  eyebrow: "신혼부부 정부지원",
  tags: [
    { label: "신혼부부", mod: "support" },
    { label: "정부지원", mod: "support" },
    { label: "대출", mod: "estate" },
    { label: "청약", mod: "estate" },
    { label: "출산지원", mod: "life" },
  ],
  category: "support",
  isNew: true,
},
```

### 8-4. `src/styles/app.scss`

```scss
@use 'scss/pages/newlywed-government-support-2026';
```

### 8-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/newlywed-government-support-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 9. SEO 설계

### 9-1. 메타

```text
title: 2026 신혼부부 정부지원 총정리 - 혼인세액공제·전세대출·특별공급·출산지원금 | 비교계산소
description: 2026년 신혼부부가 확인해야 할 정부지원을 한눈에 정리했습니다. 혼인세액공제, 신혼부부 전세대출, 신생아 특례대출, 신혼부부 특별공급, 생애최초 취득세 감면, 출산·육아 지원금과 지역별 지원 확인법까지 비교하세요.
```

### 9-2. H 구조

- H1: 2026 신혼부부 정부지원 완전정리
- H2: 신혼부부 정부지원 한눈에 보기
- H2: 내 상황별 먼저 볼 지원
- H2: 혼인세액공제와 연말정산 체크
- H2: 신혼부부 전세대출 vs 신생아 특례 버팀목
- H2: 신혼부부 구입자금 vs 신생아 특례 디딤돌
- H2: 생애최초·출산가구 취득세 감면
- H2: 신혼부부 특별공급 vs 생애최초 특별공급 vs 신생아 공급
- H2: 출산·육아 지원금 핵심 묶음
- H2: 지역별 특이 지원 확인법
- H2: 중복 가능성 체크
- H2: 신청 시기별 체크리스트
- H2: 놓치기 쉬운 실수 TOP 7
- H2: 신혼부부 정부지원 FAQ

### 9-3. 타깃 키워드

| 키워드 | 반영 위치 |
|---|---|
| 신혼부부 정부지원 2026 | title, H1, Hero |
| 신혼부부 정부지원금 | Hero description, FAQ |
| 혼인세액공제 | 섹션 3, title |
| 신혼부부 전세대출 조건 | 섹션 4 |
| 신생아 특례대출 조건 | 섹션 4, 5 |
| 신혼부부 특별공급 조건 | 섹션 7 |
| 생애최초 취득세 감면 | 섹션 6 |
| 지역별 출산지원금 | 섹션 8, 9 |
| 결혼축하금 지자체 | 섹션 9, FAQ |

---

## 10. QA 체크리스트

### 10-1. 데이터와 콘텐츠

- [ ] 구현 시점에 주택도시기금 대출 조건 최신 확인
- [ ] 혼인세액공제 금액과 적용 조건을 국세청 기준으로 최신 확인
- [ ] 생애최초·출산가구 취득세 감면을 위택스·행안부 기준으로 최신 확인
- [ ] 특별공급 내용은 청약홈·마이홈·모집공고 확인 문구 포함
- [ ] 지자체 지원금은 특정 금액 단정 대신 확인 경로 중심으로 작성
- [ ] 모든 제도에 `공식` / `공식 확인` / `지역별 확인` / `추정` / `참고` 배지 적용
- [ ] "무조건 가능", "반드시 받을 수 있음", "가장 유리함" 같은 단정 표현 없음

### 10-2. UI와 인터랙션

- [ ] 상황 탭 클릭 시 active 상태가 바뀜
- [ ] 추천 지원 3개 카드가 바뀜
- [ ] CTA 문구와 href가 바뀜
- [ ] 외부 CTA는 새 창 + `noopener noreferrer` 적용
- [ ] 375px 모바일에서 카드와 표가 넘치지 않음
- [ ] 비교표는 모바일에서 가로 스크롤 또는 안정적인 카드형으로 표시
- [ ] 배지 색상이 과하게 튀지 않고 의미가 구분됨

### 10-3. 사이트 등록

- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/index.astro` `reportMetaBySlug` 등록
- [ ] `src/pages/reports/index.astro` `reportMetaBySlug` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `/reports/newlywed-government-support-2026/` 라우트 생성 확인

### 10-4. 빌드

- [ ] `npm run build` 성공
- [ ] 빌드 결과에 신규 route HTML 존재
- [ ] 리포트 목록에서 `복지·지원금` 카테고리로 노출
- [ ] 홈에서 `복지·지원금` 카테고리로 노출

---

## 11. 구현 메모

- 이 페이지는 대출·세금·청약·복지 제도가 모두 섞인 허브다. 그래서 표 하나에 모든 수치를 넣으려 하기보다 `내 상황 선택 → 추천 3개 → 관련 상세 섹션` 흐름이 핵심이다.
- 금액이 확정되지 않은 제도는 숫자를 비워두더라도 신뢰도가 떨어지지 않는다. 대신 "어디서 확인해야 하는지"가 선명해야 한다.
- 정책형 콘텐츠는 stale risk가 높으므로 `NGS_META.updatedAt`, `기준일`, 각 `SupportItem.updatedAt`을 데이터에 둔다.
- 후속 계산기는 `newlywed-loan-eligibility`보다 먼저 `newlywed-special-supply-checklist`가 만들기 쉽다. 청약은 자격 체크 흐름이 명확하고 개인정보 입력 없이도 구현 가능하다.
