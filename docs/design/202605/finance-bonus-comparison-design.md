# 금융권 성과급 비교 계산기 설계 문서

> 기획 원문: `docs/plan/202605/finance-bonus-comparison.md`
> 작성일: 2026-05-25
> 구현 대상: `/tools/finance-bonus-comparison/`
> 구현 기준: KB국민은행·신한은행·하나은행·우리은행·NH농협은행·미래에셋증권·한국투자증권·삼성증권 8개사 성과급 구조를 업권(은행/증권/보험)별로 분리해 비교하는 계산기형 도구

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `금융권 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기형 도구
- slug: `finance-bonus-comparison`
- URL: `/tools/finance-bonus-comparison/`
- 카테고리: 성과급 비교

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 페이지, 데이터, 스크립트, 스타일, 등록 파일을 추가한다.

핵심 구현 목표:

- 금융권 성과급을 **업권별(은행·증권·보험)** 로 분리해 구조 차이를 독자가 이해하도록 돕는다.
- 사용자가 연봉을 입력하면 시중은행 5개사 예상 성과급을 즉시 바 차트로 비교한다.
- 증권사 부문별 편차, 보험사 내근직·설계사 구분을 별도 섹션으로 안내한다.
- 모든 결과에 `시뮬레이션`·`추정`·`참고` 배지를 반복 노출한다.
- IT 플랫폼·반도체 성과급 계산기와 내부 링크로 연결한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    financeBonusComparison2026.ts
  pages/
    tools/
      finance-bonus-comparison.astro

public/
  scripts/
    finance-bonus-comparison.js

src/styles/scss/pages/
  _finance-bonus-comparison.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/finance-bonus-comparison';`
- `public/sitemap.xml`

선택 등록:

- `/tools/bonus-simulator/` 하단 역링크
- `/tools/it-platform-bonus-comparison/` 하단 역링크
- `public/og/tools/finance-bonus-comparison.png`

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "금융권 성과급 비교 2026｜은행·증권·보험사 성과급 구조와 산식"
description: "2026년 KB국민은행, 신한은행, 하나은행, 우리은행, 미래에셋증권 등 금융권 주요 기업의 성과급 구조를 비교합니다. 업권별 산식 차이와 내 연봉 기준 예상 성과급을 확인하세요."
canonical: "/tools/finance-bonus-comparison/"
ogImage: "/og/og-home.png"
```

### 3-2. 페이지 텍스트

H1:
```text
금융권 성과급 비교 2026: 은행·증권·보험사 한눈에
```

Hero sub:
```text
KB국민은행, 신한은행, 하나은행, 우리은행, 미래에셋증권 등 금융권 주요 기업의 성과급 구조를 업권별로 비교합니다. 은행 임협 상여, 증권사 부문 인센티브, 보험사 내근직 보상의 차이를 이해하고 내 연봉 기준 예상 성과급을 계산해보세요.
```

주요 배지:
- `시뮬레이션`
- `추정`
- `참고`
- `확정` (임협 확정 상여율에 한해)

### 3-3. 키워드 매핑

| 키워드 | 반영 위치 |
| --- | --- |
| 금융권 성과급 비교 | H1, hero, title, FAQ |
| 은행 성과급 | 은행 섹션 H2, FAQ, description |
| KB국민은행 성과급 | KB 카드, FAQ |
| 신한은행 성과급 | 신한 카드, FAQ |
| 증권사 성과급 | 증권사 섹션, FAQ |
| 미래에셋증권 성과급 | 미래에셋 카드, FAQ |
| 금융사 연봉 비교 | 총보상 비교 섹션 |

### 3-4. tools.ts 등록

```ts
{
  slug: "finance-bonus-comparison",
  title: "금융권 성과급 비교 2026",
  description: "KB국민은행·신한은행·하나은행·우리은행·미래에셋증권 등 금융권 성과급 구조를 업권별로 비교합니다. 내 연봉 기준 예상 성과급을 즉시 계산하세요.",
  order: 10.5,
  eyebrow: "금융권 성과급",
  category: "simulator",
  iframeReady: true,
  badges: ["신규", "추정"],
  previewStats: [
    { label: "비교 대상", value: "8개사" },
    { label: "업권", value: "은행·증권·보험" },
  ],
}
```

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `fbc-`
- pageClass: `fbc-page`
- 연봉 슬라이더 입력 → 은행 5개사 바 차트 → 8개사 결과 카드 → 업권별 구조 해설 → 증권 부문 안내 → 보험 내근직 안내 → 세후 → CTA → FAQ 순으로 배치한다.
- 모바일에서 바 차트는 수평 막대 유지, 결과 카드는 단열 스택.

권장 페이지 셸:

```astro
<SimpleToolShell
  calculatorId="finance-bonus-comparison"
  pageClass="fbc-page"
  resultFirst={false}
>
```

권장 IA:

1. Hero + 업권별 차이 핵심 메시지
2. 추정·시뮬레이션 안내 박스
3. 연봉 슬라이더 + 은행 5개사 바 차트
4. KPI 카드 (최고 예상·적용 세율)
5. 8개사 결과 카드 (은행 5 + 증권 3)
6. 업권별 성과급 구조 비교표
7. 은행 5개사 해설 카드
8. 증권사 부문별 편차 안내
9. 보험사 내근직 기준 안내
10. 세후 체감 안내
11. 관련 계산기 CTA
12. FAQ
13. SeoContent (intro 4단락)

---

## 5. 데이터 모델

파일: `src/data/financeBonusComparison2026.ts`

```ts
export type FinanceCompanyId =
  | "kb"
  | "shinhan"
  | "hana"
  | "woori"
  | "nh"
  | "mirae"
  | "koreainv"
  | "samsung_sec";

export type FinanceSector = "bank" | "securities" | "insurance";

export type BonusCalculationBasis =
  | "annualSalaryPercent"   // 연봉 n%
  | "basicSalaryPercent"    // 기본급 n%
  | "monthlyMultiple";      // 월급 n개월

export type EvidenceBadge = "확정" | "잠정합의" | "참고" | "추정" | "시뮬레이션";

export interface FinanceCompanyConfig {
  id: FinanceCompanyId;
  name: string;
  shortName: string;
  sector: FinanceSector;
  sectorLabel: string;
  parentGroup: string;

  /** 시뮬레이션 기본값 — 공식 지급률 아님 */
  defaultBasis: BonusCalculationBasis;
  defaultPercent: number;            // 연봉 대비 % (예시)
  bonusPercentRange: { min: number; max: number };
  badge: EvidenceBadge;

  bonusTypes: string[];              // ["임협 상여", "경영성과급"]
  structureSummary: string;
  keyRisks: string[];
  specialNote: string;
  caution: string;
}

export interface FinanceBonusSectorInfo {
  sector: FinanceSector;
  label: string;
  basisDescription: string;
  variabilityNote: string;
  keyDifference: string;
}

export interface TaxRateBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  estimatedDeductionRate: number;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}
```

---

## 6. 기준 데이터

파일: `src/data/financeBonusComparison2026.ts`

### 6-1. 회사 데이터

```ts
export const FINANCE_BONUS_COMPANIES: FinanceCompanyConfig[] = [
  // ── 은행 ──────────────────────────────────
  {
    id: "kb",
    name: "KB국민은행",
    shortName: "KB국민",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "KB금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 15,
    bonusPercentRange: { min: 10, max: 20 },
    badge: "추정",
    bonusTypes: ["임협 상여", "경영성과급"],
    structureSummary:
      "KB금융지주 노사협약 기반 임협 상여 + 금융지주 실적 연동 경영성과급 구조. 기본급 기반 상여가 핵심",
    keyRisks: [
      "임협 결과에 따라 상여율 변동",
      "KB증권·KB손해보험 등 계열사별 상여 구조 상이",
      "경영성과급은 KB금융 연간 실적 연동",
    ],
    specialNote: "KB금융지주 본사 기준. KB증권·KB손해보험은 별도 성과급 체계 적용",
    caution: "직급·근속연수·지점 유형에 따라 실제 지급액이 달라질 수 있습니다.",
  },
  {
    id: "shinhan",
    name: "신한은행",
    shortName: "신한",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "신한금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 15,
    bonusPercentRange: { min: 10, max: 20 },
    badge: "추정",
    bonusTypes: ["임협 상여", "PS(이익분배금)", "특별격려금"],
    structureSummary:
      "신한금융지주 임협 상여 + PS(이익분배금) 구조. 특별격려금이 별도로 지급되는 해가 있음",
    keyRisks: [
      "PS 규모가 신한금융 연간 순이익에 연동",
      "신한투자증권·신한라이프 계열사 성과급 별도",
      "특별격려금은 비정기적",
    ],
    specialNote: "신한은행 본사 기준. 신한투자증권은 증권사 구조 별도 적용",
    caution: "PS 지급 여부와 규모는 연도별 실적에 따라 달라집니다.",
  },
  {
    id: "hana",
    name: "하나은행",
    shortName: "하나",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "하나금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 14,
    bonusPercentRange: { min: 8, max: 18 },
    badge: "추정",
    bonusTypes: ["임협 상여", "경영성과급"],
    structureSummary:
      "하나금융지주 임협 기반 상여 + 경영성과급. 4대 은행 중 임협 타결 속도가 빠른 편",
    keyRisks: [
      "하나금융 연간 실적에 경영성과급 연동",
      "하나증권 계열사 별도 구조",
      "임협 타결 지연 시 성과급 지급 시기 변동",
    ],
    specialNote: "하나은행 본사 기준. 하나증권·하나생명은 별도 보상 구조 적용",
    caution: "직급·평가 등급에 따라 실제 지급액 차이가 있습니다.",
  },
  {
    id: "woori",
    name: "우리은행",
    shortName: "우리",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "우리금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 12,
    bonusPercentRange: { min: 8, max: 16 },
    badge: "추정",
    bonusTypes: ["임협 상여", "경영성과급", "우리사주"],
    structureSummary:
      "우리금융지주 임협 기반 상여. 과거 국책은행 분위기가 남아 타 시중은행 대비 성과급 구조가 다소 보수적인 편",
    keyRisks: [
      "우리금융 민영화 이후에도 보수적 성과급 관행 잔존",
      "우리카드·우리종합금융 계열사 별도",
      "우리사주 연동 보상 규모 변동",
    ],
    specialNote: "우리은행 본사 기준. 재직자 커뮤니티 기반 추정값 포함",
    caution: "실제 성과급은 직급·평가·임협 결과에 따라 달라집니다.",
  },
  {
    id: "nh",
    name: "NH농협은행",
    shortName: "NH농협",
    sector: "bank",
    sectorLabel: "특수은행",
    parentGroup: "NH농협금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 10,
    bonusPercentRange: { min: 5, max: 14 },
    badge: "추정",
    bonusTypes: ["임협 상여", "복리후생 비중 높음"],
    structureSummary:
      "농협중앙회 연계 특수 구조. 현금 성과급보다 복리후생(주택·자녀 교육 등) 비중이 상대적으로 높음",
    keyRisks: [
      "농협중앙회 전체 실적 연동 구조",
      "지역 농축협 vs 농협은행 본사 성과급 체계 완전히 다름",
      "현금 성과급 규모는 시중은행 대비 낮을 수 있음",
    ],
    specialNote: "NH농협은행 본사 기준. 지역 농축협(단위농협)은 완전히 다른 구조",
    caution: "농협은행과 지역 농축협은 별개 법인으로 보상 구조가 다릅니다.",
  },
  // ── 증권사 ─────────────────────────────────
  {
    id: "mirae",
    name: "미래에셋증권",
    shortName: "미래에셋",
    sector: "securities",
    sectorLabel: "대형 증권사",
    parentGroup: "미래에셋그룹",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 20,
    bonusPercentRange: { min: 0, max: 100 },
    badge: "추정",
    bonusTypes: ["부문별 성과 인센티브", "IB 딜 수수료 연동"],
    structureSummary:
      "IB·리테일·WM·트레이딩 부문별 성과 연동 인센티브. 부문별 편차가 매우 크며 IB 고성과자는 억대 인센티브 가능",
    keyRisks: [
      "부문별 편차 극단적 (IB vs 리테일 지원 부서)",
      "시장 상황(주식 거래량·IB 딜 수)에 따라 변동성 큼",
      "평균값으로 개인 성과급 추정 불가",
    ],
    specialNote:
      "IB·트레이딩·PB 등 고성과 부문과 일반 리테일·지원 부서의 성과급 차이가 수배~수십 배. 이 계산기는 일반 직원 기준 추정값 제공",
    caution:
      "증권사는 부문·직군·개인 성과에 따라 실제 지급액이 극단적으로 달라집니다. 이 계산기의 추정값은 일반 직원 참고용입니다.",
  },
  {
    id: "koreainv",
    name: "한국투자증권",
    shortName: "한투",
    sector: "securities",
    sectorLabel: "대형 증권사",
    parentGroup: "한국금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 25,
    bonusPercentRange: { min: 0, max: 120 },
    badge: "추정",
    bonusTypes: ["부문별 성과 인센티브", "딜 수수료 연동"],
    structureSummary:
      "한국금융지주 비상장 자회사. 업계 상위권 성과급으로 알려져 있으며 IB 부문 인센티브가 특히 높은 편",
    keyRisks: [
      "비상장사로 공시 기반 데이터 제한",
      "IB 딜 실적에 따른 연도별 변동성 큼",
      "부문별 편차 극단적",
    ],
    specialNote:
      "비상장사(한국금융지주 자회사). 재직자 후기 및 언론 보도 기반 추정값. IB 부문은 업계 최고 수준으로 알려짐",
    caution: "비상장사로 공식 공시가 제한적입니다. 추정값의 신뢰도가 낮습니다.",
  },
  {
    id: "samsung_sec",
    name: "삼성증권",
    shortName: "삼성증권",
    sector: "securities",
    sectorLabel: "대형 증권사",
    parentGroup: "삼성그룹",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 18,
    bonusPercentRange: { min: 0, max: 80 },
    badge: "추정",
    bonusTypes: ["부문별 성과 인센티브", "삼성그룹 기준 일부 적용"],
    structureSummary:
      "삼성그룹 계열 증권사. 삼성전자 등 그룹사 기준이 일부 적용되지만 증권업 특성상 부문별 성과 연동 인센티브가 핵심",
    keyRisks: [
      "삼성그룹 계열이지만 증권업 특성으로 부문 편차 존재",
      "WM(자산관리) 강점으로 WM 부문 인센티브 상대적으로 높은 편",
      "시장 상황에 따른 변동성",
    ],
    specialNote: "삼성그룹 계열이나 성과급 구조는 삼성전자(반도체)와 상이. 증권업 특성 적용",
    caution: "삼성증권 성과급은 삼성전자와 다른 구조입니다. 부문별 실제 지급액과 다를 수 있습니다.",
  },
];
```

### 6-2. 업권별 구조 정보

```ts
export const FINANCE_SECTOR_INFO: FinanceBonusSectorInfo[] = [
  {
    sector: "bank",
    label: "은행 (시중·특수)",
    basisDescription: "노동조합 임금협약으로 확정되는 기본급 기반 상여 + 금융지주 실적 연동 경영성과급",
    variabilityNote: "임협 타결 상여율은 비슷하나 경영성과급은 금융지주 연간 실적에 따라 변동",
    keyDifference: "임협으로 확정되는 구조 → 성과급 수준이 비교적 예측 가능. 직급·평가 편차보다 임협 결과가 우선",
  },
  {
    sector: "securities",
    label: "증권사",
    basisDescription: "부문별(IB·리테일·WM·트레이딩) 실적 연동 인센티브. 딜 수수료·거래량 직접 연동",
    variabilityNote: "부문·직군·개인 성과에 따라 0원에서 수억 원까지 편차 극단적",
    keyDifference: "같은 회사 내에서도 IB 딜러와 리테일 지원 부서 성과급이 수십 배 차이 날 수 있음",
  },
  {
    sector: "insurance",
    label: "보험사 (내근직 기준)",
    basisDescription: "내근직: 그룹사 기준 상여 + 경영성과급 / 설계사: 수수료 구조 (이 계산기 적용 제외)",
    variabilityNote: "내근직은 은행과 유사한 구조. 설계사는 수수료로 비교 불가",
    keyDifference: "설계사 성과급은 수수료 구조로 이 도구 적용 범위 제외. 내근직 기준만 비교 가능",
  },
];
```

### 6-3. 세후 추정 구간

```ts
export const FBC_TAX_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0,           maxAnnualSalary: 50_000_000,  estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001,  maxAnnualSalary: 80_000_000,  estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001,  maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null,         estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];
```

### 6-4. FAQ 데이터

```ts
export const FBC_FAQ: FaqItem[] = [
  {
    question: "4대 은행 중 성과급이 가장 많은 곳은 어디인가요?",
    answer:
      "임협 기준 상여율은 4대 은행이 비슷한 수준입니다. 경영성과급이 금융지주 연간 실적에 따라 차이가 나며, 단순 순위보다 기준급·임협 상태·경영성과급 조건을 함께 확인해야 합니다.",
  },
  {
    question: "증권사 성과급이 수억이라는 게 사실인가요?",
    answer:
      "사실이지만 IB 딜러, PB 고성과자 등 특정 부문·직군에 해당하는 이야기입니다. 일반 리테일 영업이나 지원 부서와 같은 기준으로 볼 수 없으며, 부문·개인 실적에 따라 편차가 극단적입니다.",
  },
  {
    question: "은행 노조 상여금과 경영성과급은 어떻게 다른가요?",
    answer:
      "노조 상여금은 임금협약으로 확정되는 정기 보너스로 기준급 기반입니다. 경영성과급은 금융지주의 연간 영업이익·순이익 실적을 기반으로 별도 지급되는 변동 보상입니다.",
  },
  {
    question: "NH농협은행 성과급은 시중은행보다 적은가요?",
    answer:
      "현금 성과급만 보면 시중은행 대비 낮을 수 있습니다. 다만 농협은행은 주택 지원, 자녀 교육비 등 복리후생 비중이 상대적으로 높으므로 총보상 관점에서 함께 고려해야 합니다.",
  },
  {
    question: "보험사 설계사도 성과급이 있나요?",
    answer:
      "설계사는 수수료 구조로 운영되므로 이 계산기 적용 범위에서 제외합니다. 이 도구는 보험사 내근직(본사·지점 사무직) 기준만 다룹니다.",
  },
  {
    question: "은행에서 증권사로 이직하면 성과급이 늘어나나요?",
    answer:
      "이직 후 배치 부문(IB·리테일·WM 등)에 따라 크게 다릅니다. 증권사 고성과 부문은 은행 대비 높을 수 있지만 변동성이 커지는 구조임을 인지해야 합니다. 안정성 vs 성과 연동 중 어떤 가치를 우선하는지 고려하세요.",
  },
  {
    question: "금융권 성과급은 세금을 얼마나 내나요?",
    answer:
      "근로소득으로 과세됩니다. 고액 성과급은 누진세율 적용으로 세후 체감이 크게 줄 수 있습니다. 정확한 세액은 지급 시점 원천징수 후 연말정산에서 확정됩니다.",
  },
  {
    question: "이 계산기 결과로 실제 성과급을 예측할 수 있나요?",
    answer:
      "추정·시뮬레이션 기준이며 공식 지급 데이터가 아닙니다. 실제 지급액은 임협 결과, 경영성과급 규모, 부문, 직급, 개인 평가에 따라 달라집니다. 실제 연봉 협상 시에는 채용 담당자에게 직접 확인하세요.",
  },
];
```

### 6-5. 관련 링크

```ts
export const FBC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/bonus-simulator/",
    label: "대기업 성과급 시뮬레이터",
    description: "삼성전자·SK하이닉스·현대차와 함께 비교",
  },
  {
    href: "/tools/it-platform-bonus-comparison/",
    label: "IT 플랫폼 성과급 비교",
    description: "카카오·네이버·쿠팡·크래프톤·라인·토스",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 실수령 계산기",
    description: "성과급에서 세금·4대보험 빼면 실제 입금액은?",
  },
  {
    href: "/tools/semiconductor-bonus-comparison/",
    label: "반도체 성과급 비교",
    description: "삼성전자·SK하이닉스·DB하이텍 비교",
  },
];
```

### 6-6. SeoContent 텍스트

```ts
export const FBC_SEO_INTRO: string[] = [
  "금융권 성과급은 업권(은행·증권·보험)에 따라 산식과 성격이 완전히 다르다. 은행은 노동조합 임금협약으로 확정되는 기본급 기반 상여가 핵심이고, 증권사는 IB·리테일·WM·트레이딩 부문별 실적 연동 인센티브로 같은 회사 내에서도 수십 배 편차가 날 수 있다. 이 차이를 구분하지 않고 '금융권 성과급 순위'를 나열하면 독자를 혼란에 빠뜨리는 결과가 된다.",
  "시중은행 4개사(KB국민·신한·하나·우리)와 NH농협은행은 노사 임협을 통해 매년 상여율이 확정된다. 여기에 금융지주 연간 실적 기반의 경영성과급이 더해지는 구조다. 반면 미래에셋증권·한국투자증권·삼성증권 같은 대형 증권사는 부문별 딜 수수료와 거래량에 직접 연동되는 인센티브 구조이므로, 동일 회사 내에서도 IB 딜러와 리테일 지원 직원의 성과급은 극단적으로 다를 수 있다.",
  "이 도구는 사용자가 입력한 연봉을 기준으로 시중은행 5개사 예상 성과급을 비교하는 시뮬레이션을 제공한다. 증권사는 부문별 편차가 극단적이므로 계산기 기본값은 일반 직원 기준 추정값임을 명시한다. 보험사는 내근직 기준으로만 제공하며, 설계사 수수료 구조는 이 계산기 적용 범위에서 제외한다.",
  "금융권 성과급을 판단할 때는 현금 상여 규모만이 아니라 임협 확정 상태, 경영성과급 지급 조건, 업권별 변동성을 함께 고려해야 한다. 이 도구의 결과는 참고용 시뮬레이션이며 공식 지급 데이터가 아니다. 실제 연봉 협상 시에는 임협 타결 내용이나 채용 담당자에게 직접 확인하길 권장한다.",
];

export const FBC_INPUT_POINTS: string[] = [
  "현재 연봉을 입력하면 시중은행 5개사 예상 성과급을 즉시 비교합니다",
  "증권사는 부문별 편차가 커서 별도 해설 카드로 안내합니다",
  "보험사 설계사 성과급은 수수료 구조로 이 계산기 적용 범위에서 제외합니다",
];

export const FBC_CRITERIA: string[] = [
  "은행 성과급 추정값: 재직자 후기·공시·임협 보도 기반 시뮬레이션",
  "증권사 성과급: 일반 직원 기준 추정값 (IB·트레이딩 고성과자와 다름)",
  "세후 추정: 연봉 구간별 간이 공제율 적용 (실제 세금과 다를 수 있음)",
];

export const FBC_META = {
  title: "금융권 성과급 비교 2026: 은행·증권·보험사 한눈에",
  seoTitle: "금융권 성과급 비교 2026｜은행·증권·보험사 성과급 구조와 산식",
  seoDescription:
    "2026년 KB국민은행, 신한은행, 하나은행, 우리은행, 미래에셋증권 등 금융권 주요 기업의 성과급 구조를 비교합니다. 업권별 산식 차이와 내 연봉 기준 예상 성과급을 확인하세요.",
  dataNote:
    "성과급 추정값은 재직자 후기·임협 보도·공시 기반 시뮬레이션입니다. 실제 지급액은 임협 결과, 부문, 직급, 개인 평가에 따라 달라질 수 있습니다.",
};
```

---

## 7. 클라이언트 스크립트 설계

파일: `public/scripts/finance-bonus-comparison.js`

### 7-1. DOM 계약

루트:
```html
<section data-fbc-calculator>
```

입력:
```html
<input type="range" id="fbcSalarySlider" />
<input type="text" id="fbcSalaryInput" data-fbc-salary />
<span id="fbcSliderVal"></span>
```

출력 KPI:
```html
<output id="fbcSalaryLabel"></output>
<strong id="fbcBestGross"></strong>
<strong id="fbcBestNet"></strong>
<strong id="fbcBestCompany"></strong>
<strong id="fbcTaxRate"></strong>
```

출력 바 차트 (은행 5개사):
```html
<div id="fbcBankBarChart">
  <div class="fbc-bar-row" data-company="kb"> ... </div>
  <!-- ... 5개사 -->
</div>
```

출력 결과 카드 (8개사):
```html
<div id="fbcResultCards">
  <article class="fbc-result-card" data-card="kb"> ... </article>
  <!-- ... 8개사 -->
</div>
```

### 7-2. 상태

```js
const state = {
  annualSalary: 60_000_000,  // 금융권 특성상 기본값 6천만 원
};
```

### 7-3. 계산 함수

```js
function getTaxRate(salary) {
  const bracket = taxBrackets.find(
    (b) => salary >= b.minAnnualSalary &&
           (b.maxAnnualSalary === null || salary <= b.maxAnnualSalary)
  );
  return bracket ? bracket.estimatedDeductionRate : 0.24;
}

function calcCompany(company, salary) {
  const gross = salary * (company.defaultPercent / 100);
  const taxRate = getTaxRate(salary);
  const net = gross * (1 - taxRate);
  return {
    id: company.id,
    name: company.name,
    shortName: company.shortName,
    sector: company.sector,
    gross,
    net,
    taxRate,
    piPercent: company.defaultPercent,
    badge: company.badge,
  };
}
```

### 7-4. 렌더 전략

- 바 차트: **은행 5개사만** 표시 (증권사 제외 — 부문 편차로 직접 비교 부적절)
- 결과 카드: 8개사 전체 표시. 섹터별로 그룹핑 (bank → securities 순)
- 바 차트 정렬: gross 내림차순으로 실시간 재정렬
- 증권사 카드: 상단에 "부문별 편차 큼" 경고 라벨 표시

```js
function renderBankBarChart(results) {
  // bank 섹터만 필터링
  const bankResults = results.filter(r => {
    const co = companies.find(c => c.id === r.id);
    return co && co.sector === 'bank';
  });
  const sorted = [...bankResults].sort((a, b) => b.gross - a.gross);
  const maxGross = sorted[0]?.gross || 1;
  const bestId = sorted[0]?.id;
  // 바 너비 업데이트 + 정렬
}

function renderAllResultCards(results) {
  const sorted = [...results].sort((a, b) => b.gross - a.gross);
  // 카드 업데이트 + bank → securities 순으로 DOM 재배열
}
```

### 7-5. 슬라이더 범위

- min: 30,000,000 (3천만)
- max: 300,000,000 (3억)
- step: 1,000,000 (100만)
- 기본값: 60,000,000 (6천만 — 금융권 중간 연봉대 반영)

### 7-6. URL 파라미터 동기화

```js
// 초기 로드: ?salary=60000000 파라미터로 슬라이더 초기화
// 슬라이더 변경 시 replaceState로 URL 업데이트 (디바운스 400ms)
```

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/finance-bonus-comparison.astro`

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import {
  FINANCE_BONUS_COMPANIES,
  FINANCE_SECTOR_INFO,
  FBC_TAX_BRACKETS,
  FBC_FAQ,
  FBC_RELATED_LINKS,
  FBC_SEO_INTRO,
  FBC_INPUT_POINTS,
  FBC_CRITERIA,
  FBC_META,
} from "../../data/financeBonusComparison2026";
---
```

주요 섹션 마크업 구조:

```astro
<SimpleToolShell calculatorId="finance-bonus-comparison" pageClass="fbc-page">

  <!-- Hero + 안내 -->
  <Fragment slot="hero">
    <CalculatorHero eyebrow="금융권 성과급" title="..." badges={["추정", "시뮬레이션", "임협 기반"]} />
    <InfoNotice lines={[FBC_META.dataNote, "증권사 성과급은 부문별 편차가 극단적합니다...", "보험사 설계사는 이 계산기 적용 범위에서 제외합니다."]} />
  </Fragment>

  <Fragment slot="actions">
    <ToolActionBar resetId="fbcResetBtn" copyId="fbcCopyBtn" />
  </Fragment>

  <!-- Aside: 슬라이더 + 세금 구간 -->
  <Fragment slot="aside">
    <article class="panel">
      <!-- 연봉 슬라이더 -->
      <div class="fbc-salary-field">
        <label class="field">
          <span>현재 연봉</span>
          <input id="fbcSalaryInput" type="text" inputmode="numeric" class="input-number" />
        </label>
        <div class="calc-slider-row">
          <input type="range" id="fbcSalarySlider" class="calc-slider"
            min="30000000" max="300000000" step="1000000" value="60000000" />
          <span id="fbcSliderVal" class="calc-slider-val">6,000만원</span>
        </div>
      </div>
      <p class="fbc-sim-badge">시뮬레이션 · 추정 기준</p>
    </article>

    <article class="panel">
      <!-- 세금 구간 표 -->
      <table class="fbc-bracket-table">...</table>
    </article>
  </Fragment>

  <!-- 메인: 바 차트 (은행 5개사) -->
  <section class="fbc-bank-chart panel">
    <div class="panel-heading">
      <p class="panel-heading__eyebrow">시중은행 비교</p>
      <h2>시중은행 5개사 예상 성과급</h2>
      <p>※ 증권사는 부문별 편차가 커서 별도 안내로 제공합니다</p>
    </div>
    <!-- KPI -->
    <div class="fbc-kpi-grid">...</div>
    <!-- 바 차트 -->
    <div id="fbcBankBarChart" class="fbc-bar-chart">
      {FINANCE_BONUS_COMPANIES.filter(c => c.sector === 'bank').map(c => (
        <div class="fbc-bar-row" data-company={c.id}>
          <span class="fbc-bar-label">{c.shortName}</span>
          <div class="fbc-bar-track">
            <div class="fbc-bar-fill" data-bar={c.id} style="width:0%"></div>
          </div>
          <span class="fbc-bar-value" data-gross={c.id}>-</span>
        </div>
      ))}
    </div>
  </section>

  <!-- 8개사 결과 카드 -->
  <section class="fbc-cards-section panel">
    <div class="panel-heading">
      <p class="panel-heading__eyebrow">전체 결과</p>
      <h2>은행·증권사 예상 성과급</h2>
    </div>
    <div class="fbc-result-cards" id="fbcResultCards">
      {FINANCE_BONUS_COMPANIES.map(c => (
        <article class="fbc-result-card" data-card={c.id} data-sector={c.sector}>
          <div class="fbc-result-card__header">
            <strong>{c.name}</strong>
            <span class={`fbc-sector-badge fbc-sector-badge--${c.sector}`}>{c.sectorLabel}</span>
          </div>
          <div class="fbc-result-card__numbers">
            <div><span>세전 예상</span><strong data-gross-card={c.id}>-</strong></div>
            <div><span>세후 추정</span><strong data-net-card={c.id}>-</strong></div>
            <div><span>연봉 대비</span><strong>{c.defaultPercent}%</strong></div>
          </div>
          {c.sector === 'securities' && (
            <p class="fbc-result-card__warn">⚠ 부문별 편차 극단적 — 참고용</p>
          )}
          <p class="fbc-result-card__badge">
            <span class="fbc-sim-tag">시뮬레이션</span>
            {c.badge}
          </p>
        </article>
      ))}
    </div>
  </section>

  <!-- 업권별 구조 비교표 -->
  <section class="fbc-sector-table panel">
    <h2>업권별 성과급 구조 비교</h2>
    <div class="fbc-table-wrap">
      <table class="fbc-structure-table">
        <thead><tr><th>업권</th><th>산식 기반</th><th>변동성</th><th>핵심 특징</th></tr></thead>
        <tbody>
          {FINANCE_SECTOR_INFO.map(s => (
            <tr>
              <td>{s.label}</td>
              <td>{s.basisDescription}</td>
              <td>{s.variabilityNote}</td>
              <td>{s.keyDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>

  <!-- 은행별 해설 카드 -->
  <section class="fbc-bank-guide panel">
    <h2>은행별 성과급 구조 해설</h2>
    <div class="fbc-guide-cards">
      {FINANCE_BONUS_COMPANIES.filter(c => c.sector === 'bank').map(c => (
        <article class="fbc-guide-card">
          <h3>{c.name}</h3>
          <p>{c.structureSummary}</p>
          <ul>{c.keyRisks.map(r => <li>{r}</li>)}</ul>
          <p class="fbc-guide-card__caution">⚠ {c.caution}</p>
        </article>
      ))}
    </div>
  </section>

  <!-- 증권사 부문 편차 안내 -->
  <section class="fbc-sec-guide panel">
    <h2>증권사 성과급 — 부문별 편차 안내</h2>
    <div class="fbc-sec-dept-table-wrap">
      <table class="fbc-sec-dept-table">
        <thead><tr><th>부문</th><th>성과급 수준</th><th>변동성</th></tr></thead>
        <tbody>
          <tr><td>IB (투자은행)</td><td>매우 높음 (억대 가능)</td><td>딜 수수료 직접 연동</td></tr>
          <tr><td>트레이딩/딜링</td><td>높음</td><td>시장 수익률 연동</td></tr>
          <tr><td>WM (자산관리)</td><td>중~높음</td><td>AUM·고객 수익 연동</td></tr>
          <tr><td>리테일 영업</td><td>중</td><td>지점 실적 연동</td></tr>
          <tr><td>지원 부서</td><td>낮음~중</td><td>회사 전체 성과 기반</td></tr>
        </tbody>
      </table>
    </div>
    {FINANCE_BONUS_COMPANIES.filter(c => c.sector === 'securities').map(c => (
      <article class="fbc-guide-card fbc-guide-card--sec">
        <h3>{c.name}</h3>
        <p>{c.structureSummary}</p>
        <p class="fbc-guide-card__special">{c.specialNote}</p>
        <p class="fbc-guide-card__caution">⚠ {c.caution}</p>
      </article>
    ))}
  </section>

  <!-- 보험사 내근직 안내 -->
  <section class="fbc-ins-guide panel">
    <h2>보험사 성과급 — 내근직 기준 안내</h2>
    <p>보험사 설계사는 수수료 구조로 이 계산기 적용 범위에서 제외합니다. 내근직(본사·지점 사무직) 기준으로만 설명합니다.</p>
    <div class="fbc-ins-cards">
      <article class="fbc-ins-card">
        <h3>삼성생명·삼성화재</h3>
        <p>삼성그룹 계열. 내근직 기준 그룹사 유사 성과급 구조. 삼성전자 등 그룹사 임협 방향과 연동되는 경우 있음. 설계사 성과는 별도 수수료 구조.</p>
      </article>
      <article class="fbc-ins-card">
        <h3>한화생명·현대해상 등</h3>
        <p>각 그룹사 기준 적용. 내근직은 은행과 유사한 임협 상여 구조. 설계사 성과는 별도 수수료 구조로 이 도구 적용 불가.</p>
      </article>
    </div>
  </section>

  <!-- 관련 CTA -->
  <section class="fbc-related-section panel">
    <h2>함께 확인하면 좋은 계산기</h2>
    <div class="fbc-related-grid">
      {FBC_RELATED_LINKS.map(link => (
        <a href={withBase(link.href)} class="fbc-related-card">
          <strong>{link.label}</strong>
          {link.description && <span>{link.description}</span>}
        </a>
      ))}
    </div>
  </section>

  <!-- SeoContent -->
  <Fragment slot="seo">
    <SeoContent
      introTitle="금융권 성과급, 은행·증권·보험이 왜 다른가"
      intro={FBC_SEO_INTRO}
      inputPoints={FBC_INPUT_POINTS}
      criteria={FBC_CRITERIA}
      faq={FBC_FAQ}
      related={FBC_RELATED_LINKS}
    />
  </Fragment>

</SimpleToolShell>

<script id="fbcConfig" type="application/json" set:html={JSON.stringify(config)} />
<script type="module" src={withBase("/scripts/finance-bonus-comparison.js")}></script>
```

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_finance-bonus-comparison.scss`

### 9-1. 클래스 prefix

모든 전용 스타일은 `fbc-` prefix를 사용한다.

```text
fbc-page
fbc-sim-badge / fbc-sim-tag
fbc-salary-field
fbc-bracket-table-wrap / fbc-bracket-table
fbc-kpi-grid / fbc-kpi-card / fbc-kpi-card--main
fbc-bank-chart
fbc-bar-chart / fbc-bar-row / fbc-bar-row--best
fbc-bar-label / fbc-bar-track / fbc-bar-fill / fbc-bar-fill--best / fbc-bar-value
fbc-result-cards / fbc-result-card / fbc-result-card--best / fbc-result-card--sec
fbc-result-card__header / fbc-result-card__numbers / fbc-result-card__warn / fbc-result-card__badge
fbc-sector-badge / fbc-sector-badge--bank / fbc-sector-badge--securities / fbc-sector-badge--insurance
fbc-table-wrap / fbc-structure-table
fbc-guide-cards / fbc-guide-card / fbc-guide-card--sec / fbc-guide-card__caution / fbc-guide-card__special
fbc-sec-dept-table-wrap / fbc-sec-dept-table
fbc-ins-cards / fbc-ins-card
fbc-related-section / fbc-related-grid / fbc-related-card
fbc-chart-note
```

### 9-2. 업권 배지 색상

```scss
.fbc-sector-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;

  &--bank {
    background: #e8f4fd;
    color: #1557b0;        // 은행 — 파랑
  }

  &--securities {
    background: #fef3c7;
    color: #92400e;        // 증권 — 노랑/주황
  }

  &--insurance {
    background: #f0fdf4;
    color: #166534;        // 보험 — 초록
  }
}
```

### 9-3. 바 차트 (은행 전용)

```scss
.fbc-bank-chart {
  // 은행 차트임을 구분하는 헤더 스타일
}

.fbc-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 4px 0 12px;
}

.fbc-bar-row {
  display: grid;
  grid-template-columns: 68px 1fr 90px;
  align-items: center;
  gap: 8px;

  @media (min-width: 480px) {
    grid-template-columns: 80px 1fr 100px;
  }
}

.fbc-bar-track {
  height: 28px;
  background: #f3f4f6;
  border-radius: 6px;
  overflow: hidden;
}

.fbc-bar-fill {
  height: 100%;
  background: #93c5fd;
  border-radius: 6px;
  transition: width 0.35s ease;

  &--best {
    background: #1d4ed8;
  }
}
```

### 9-4. 결과 카드 — 증권사 경고

```scss
.fbc-result-card {
  &--sec {
    border-style: dashed;   // 증권사: 점선으로 불확실성 표현
    border-color: #d97706;
  }

  &__warn {
    font-size: 11px;
    color: #b45309;
    background: #fffbeb;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 0;
  }
}
```

### 9-5. 증권사 부문 편차 표

```scss
.fbc-sec-dept-table {
  width: 100%;
  min-width: 480px;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 9px 10px;
    border-bottom: 1px solid #ece9df;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #fef3c7;
    font-size: 12px;
    font-weight: 800;
    color: #92400e;
  }

  tr:first-child td { font-weight: 800; color: #1d4ed8; }
}
```

### 9-6. 반응형

- 결과 카드: 모바일 1열, 480px+ 2열, 768px+ 3열
- 구조 비교표: `overflow-x: auto` 가로 스크롤
- 증권사 부문 편차 표: `min-width: 480px` + 가로 스크롤

---

## 10. 접근성·사용성 기준

- 슬라이더: `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- 업권 배지는 색상 + 텍스트로 의미 전달 (색상만 의존 금지)
- 증권사 카드의 "부문별 편차 극단적" 경고 문구는 시각적으로 구분
- 바 차트 제목에 "은행 5개사 기준, 증권사 제외" 명시
- 보험사 섹션 상단에 "설계사 제외, 내근직 기준" 명시

---

## 11. 안전 문구

상단 안내 박스:
```text
이 계산기는 재직자 후기·임협 보도·공시 기반의 추정값을 사용한 비교용 시뮬레이션입니다.
실제 성과급은 임협 결과, 경영성과급 규모, 부문, 직급, 개인 평가에 따라 크게 달라질 수 있습니다.
```

증권사 섹션 상단:
```text
증권사 성과급은 부문(IB·리테일·WM·트레이딩)과 개인 실적에 따라 0원에서 수억 원까지 차이가 납니다.
이 계산기의 추정값은 일반 직원 기준 참고용이며 고성과 부문과 직접 비교할 수 없습니다.
```

보험사 섹션 상단:
```text
보험사 설계사는 수수료 구조로 이 계산기 적용 범위에서 제외합니다. 내근직(본사·지점 사무직) 기준만 제공합니다.
```

---

## 12. 내부 링크 설계

### 12-1. 페이지 내 CTA

| 위치 | CTA 문구 | 이동 경로 |
| --- | --- | --- |
| 결과 하단 | 대기업 성과급 전체 비교 | `/tools/bonus-simulator/` |
| 결과 하단 | IT 플랫폼 성과급 비교 | `/tools/it-platform-bonus-comparison/` |
| 세후 안내 | 성과급 세후 실수령 계산 | `/tools/bonus-after-tax-calculator/` |
| 해설 본문 | 반도체 성과급 비교 | `/tools/semiconductor-bonus-comparison/` |

### 12-2. 역링크 추가 대상

`/tools/bonus-simulator/` 하단:
```text
금융권(은행·증권·보험) 성과급 구조도 비교해보세요.
```

`/tools/it-platform-bonus-comparison/` 하단:
```text
금융권 성과급(은행 임협 상여·증권사 인센티브)과도 비교해보세요.
```

---

## 13. QA 체크리스트

- [ ] 연봉 슬라이더 변경 시 바 차트와 카드가 즉시 갱신된다
- [ ] 바 차트에는 은행 5개사만 표시된다 (증권사 제외)
- [ ] 증권사 결과 카드에 "부문별 편차 극단적 — 참고용" 경고가 보인다
- [ ] 보험사 섹션 상단에 "설계사 제외, 내근직 기준" 안내가 있다
- [ ] 모든 계산 결과에 `추정` 또는 `시뮬레이션` 배지가 보인다
- [ ] 업권별 구조 비교표가 모바일에서 가로 스크롤로 확인 가능하다
- [ ] 증권사 부문 편차 표가 모바일에서 가로 스크롤로 확인 가능하다
- [ ] 관련 계산기 4개 링크가 정상 이동한다
- [ ] FAQ 8개가 모두 표시된다
- [ ] URL 파라미터(`?salary=60000000`)로 슬라이더 초기값이 복원된다
- [ ] 농협은행 카드에 "지역 농축협과 별개" 안내가 있다
- [ ] SeoContent intro 4단락 각 150자 이상 충족한다
- [ ] `npm run build`가 성공한다

---

## 14. 구현 순서

1. `src/data/financeBonusComparison2026.ts` — 타입, 회사 데이터(8개), 섹터 정보, FAQ, 관련 링크, SEO 텍스트 생성
2. `src/pages/tools/finance-bonus-comparison.astro` — 정적 구조 구현 (슬라이더, 은행 바 차트, 8개사 카드, 비교표, 해설, 증권·보험 안내)
3. `public/scripts/finance-bonus-comparison.js` — 슬라이더 연동, 바 차트 렌더(은행 전용), 카드 렌더(전체), URL 파라미터, 리셋/복사
4. `src/styles/scss/pages/_finance-bonus-comparison.scss` — `fbc-` prefix 스타일 전체
5. `src/data/tools.ts` 등록 (order: 10.5)
6. `src/styles/app.scss` import 추가
7. `public/sitemap.xml` URL 추가
8. `/tools/bonus-simulator/`, `/tools/it-platform-bonus-comparison/` 역링크 추가
9. 모바일 UI 확인 (바 차트·구조 비교표·증권사 부문 표 가로 스크롤)
10. `npm run build` 확인
