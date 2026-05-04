# 개인연금 vs 국민연금 2026 수령액 비교 구현 설계 문서

> 기획 문서: `docs/plan-docs/202604/personal-vs-national-pension-2026.md`
> 작성일: 2026-04-27
> 구현 기준: 이 문서만 보고 `/reports/personal-vs-national-pension-2026/` 리포트 페이지 구현을 시작할 수 있는 수준
> 참고 리포트: `retirement-pension-dc-db-irp-2026`, `pension-irp-comparison-2026`, `national-pension-generational-comparison-2026`

---

## 1. 문서 개요

### 1-1. 대상

- slug: `personal-vs-national-pension-2026`
- URL: `/reports/personal-vs-national-pension-2026/`
- 콘텐츠 유형: 리포트 (`/reports/`)
- 카테고리: 투자·연금·노후
- 목적: 2026년 국민연금 평균 수령액과 개인연금 수령액을 비교하고, 노후 소득 갭·세액공제·수령 전략을 데이터로 정리하는 리포트

### 1-2. 페이지 정의

> 국민연금 평균 수령액을 기준으로 월 생활비 대비 부족액을 계산하고, 개인연금(연금저축·IRP)이 얼마나 필요한지 숫자로 보여주는 노후 소득 갭 분석 리포트.

### 1-3. 구현 원칙

- "국민연금이 좋다 vs 개인연금이 좋다" 대립 구도가 아닌 `기본 안전망 + 보완 장치` 프레임으로 일관한다.
- 모든 수령액·적립액 예시에는 `추정` 또는 `시뮬레이션` 배지를 사용한다.
- 세액공제 안내는 `일반 정보`임을 명시한다. "확정 환급"처럼 보이는 표현은 금지한다.
- 본문 하단에서 `노후자금 고갈 계산기`, `연금저축 vs IRP 비교 리포트`, `퇴직연금 DC·DB·IRP 비교`로 자연스럽게 연결한다.
- 2026년 국민연금 개혁(보험료율 9.5% → 13% 단계 인상)을 별도 박스로 명시한다.

---

## 2. 기준 자료 메모

구현 시 본문이나 데이터 파일에 다음 출처 메모를 남긴다.

| 항목 | 기준 |
| --- | --- |
| 2026년 국민연금 평균 수령액 | KB Think 기준 월 약 69만 8천 원. 2025년 11월 평균 수령액 683,666원에 물가변동률 2.1% 반영한 추정치 |
| 국민연금 보험료율 | 2026년 9.5%. 매년 0.5%p씩 단계 인상, 최종 13% 방향 |
| 세액공제 한도 | 연금저축 연 600만 원, IRP 포함 합산 900만 원 |
| 세액공제율 | 총급여 5,500만 원 이하 16.5%, 초과 13.2% (지방소득세 포함 체감 기준) |
| 연금소득세율 | 55~69세 5.5%, 70~79세 4.4%, 80세 이상 3.3% |
| 국민연금 개혁 고갈 시점 | 2025년 3월 개혁 통과 후 기금 고갈 시점 약 15년 연장, 2071년 전후로 추정 (Reuters) |
| OECD 소득대체율 | 2025년 한국 목표 소득대체율 43%, 평균소득 40년 가입 기준 |

출처 URL (데이터 파일 주석용):

```text
국민연금공단 뉴스레터: https://www.nps.or.kr/...
KB Think: https://kbthink.com/pension/plan/national-pension.html
국민연금 온에어(보험료율): https://www.npsonair.kr/finance/detail.html?strIdx=3758
삼성증권 세액공제: https://www.samsungpop.com/mbw/o2Info/contents.do?boardId=1398
Reuters 연금개혁: https://www.reuters.com/world/asia-pacific/south-korea-approves-reforms-shore-up-830-bln-state-pension-fund-2025-03-20/
OECD Pensions at a Glance 2025: https://www.oecd.org/en/publications/pensions-at-a-glance-2025_e40274c1-en/
```

---

## 3. 파일 구조

```text
src/
  data/
    reports.ts                              ← 기존 파일에 항목 추가
    personalVsNationalPension2026.ts        ← 신규

  pages/
    reports/
      personal-vs-national-pension-2026.astro  ← 신규

src/styles/scss/pages/
  _personal-vs-national-pension-2026.scss  ← 신규

public/
  og/
    reports/
      personal-vs-national-pension-2026.png  ← OG 이미지 (플레이스홀더 허용)
```

### 3-1. 추가 반영 파일

- `src/data/reports.ts` — 리포트 목록에 항목 추가
- `src/styles/app.scss` — `@use` 추가
- `public/sitemap.xml` — URL 추가

---

## 4. 데이터 파일 설계 (`personalVsNationalPension2026.ts`)

### 4-1. 타입 정의

```ts
export type PensionGapRow = {
  label: string;
  monthlyPension: number;
  monthlyGap: number;
  annualGap: number;
  gap20Years: number;
};

export type PersonalPensionSimRow = {
  monthlyContribution: number;
  rate4: number;
  rate6: number;
  rate8: number;
};

export type PersonalPensionPayoutRow = {
  totalAsset: number;
  monthlyGross: number;
  monthlyNet: number;
};

export type GenerationComparisonRow = {
  ageGroup: string;
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  expectedReturn: number;
  nationalPensionRangeLabel: string;
  personalPensionRangeLabel: string;
  combinedRangeLabel: string;
  gapNote: string;
};

export type PensionTaxRow = {
  ageRange: string;
  taxRate: number;
};

export type TaxCreditRow = {
  annualContribution: number;
  creditLowIncome: number;
  creditHighIncome: number;
};

export type WithdrawalStrategyRow = {
  method: string;
  pros: string;
  cons: string;
  bestFor: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  description: string;
};
```

### 4-2. 핵심 지표 데이터

```ts
export const PVNP_NATIONAL_PENSION_2026 = {
  estimatedAverageMonthlyPayout: 698000,
  increaseRate: 2.1,
  contributionRate2026: 9.5,
  futureContributionRateTarget: 13,
  minContributionYears: 10,
  incomeReplacementRate2026: 43,
  fundDepletionYearEstimate: 2071,
  note: "실제 수령액은 가입기간·소득·수령개시연령에 따라 달라짐. 추정치.",
} as const;

export const PVNP_TAX_CREDIT_2026 = {
  pensionSavingsLimit: 6000000,
  combinedIrpLimit: 9000000,
  taxCreditRateLowIncome: 16.5,
  taxCreditRateHighIncome: 13.2,
  maxCreditLowIncome: 1485000,
  maxCreditHighIncome: 1188000,
  incomeThreshold: 55000000,
  eligibleAgeFrom: 55,
} as const;
```

### 4-3. 노후 소득 갭 데이터

월 생활비 300만 원 기준 (월 생활비 300만 원은 기준 예시이며, 실제와 다를 수 있음)

```ts
export const PVNP_GAP_ROWS: PensionGapRow[] = [
  {
    label: "국민연금 단독(평균)",
    monthlyPension: 700000,
    monthlyGap: 2300000,
    annualGap: 27600000,
    gap20Years: 552000000,
  },
  {
    label: "국민연금 + 개인연금 100만 원",
    monthlyPension: 1700000,
    monthlyGap: 1300000,
    annualGap: 15600000,
    gap20Years: 312000000,
  },
  {
    label: "국민연금 + 개인연금 150만 원",
    monthlyPension: 2200000,
    monthlyGap: 800000,
    annualGap: 9600000,
    gap20Years: 192000000,
  },
  {
    label: "국민연금 + 개인연금 230만 원",
    monthlyPension: 3000000,
    monthlyGap: 0,
    annualGap: 0,
    gap20Years: 0,
  },
];
```

### 4-4. 개인연금 시뮬레이션 데이터

35세 → 60세, 25년 납입 가정

```ts
export const PVNP_SIM_ROWS: PersonalPensionSimRow[] = [
  { monthlyContribution: 300000,  rate4: 150000000, rate6: 210000000, rate8: 290000000 },
  { monthlyContribution: 500000,  rate4: 250000000, rate6: 350000000, rate8: 480000000 },
  { monthlyContribution: 750000,  rate4: 380000000, rate6: 520000000, rate8: 720000000 },
  { monthlyContribution: 1000000, rate4: 500000000, rate6: 690000000, rate8: 960000000 },
];

export const PVNP_PAYOUT_ROWS: PersonalPensionPayoutRow[] = [
  { totalAsset: 200000000, monthlyGross: 830000,  monthlyNet: 780000  },
  { totalAsset: 300000000, monthlyGross: 1250000, monthlyNet: 1180000 },
  { totalAsset: 500000000, monthlyGross: 2080000, monthlyNet: 1970000 },
  { totalAsset: 700000000, monthlyGross: 2920000, monthlyNet: 2760000 },
];
// monthlyNet = 세후 (연금소득세 5.5% 가정, 추정)
```

### 4-5. 세대별 비교 데이터

```ts
export const PVNP_GENERATION_ROWS: GenerationComparisonRow[] = [
  {
    ageGroup: "30대",
    currentAge: 35,
    retirementAge: 60,
    monthlyContribution: 500000,
    expectedReturn: 6,
    nationalPensionRangeLabel: "70만~120만 원",
    personalPensionRangeLabel: "130만~160만 원",
    combinedRangeLabel: "200만~280만 원",
    gapNote: "일부 부족 가능",
  },
  {
    ageGroup: "40대",
    currentAge: 45,
    retirementAge: 60,
    monthlyContribution: 700000,
    expectedReturn: 5,
    nationalPensionRangeLabel: "80만~130만 원",
    personalPensionRangeLabel: "70만~100만 원",
    combinedRangeLabel: "150만~230만 원",
    gapNote: "부족 가능성 높음",
  },
  {
    ageGroup: "50대",
    currentAge: 52,
    retirementAge: 60,
    monthlyContribution: 1000000,
    expectedReturn: 4,
    nationalPensionRangeLabel: "90만~150만 원",
    personalPensionRangeLabel: "35만~60만 원",
    combinedRangeLabel: "125만~210만 원",
    gapNote: "추가 자금 필요",
  },
];
```

### 4-6. 연금소득세율 데이터

```ts
export const PVNP_PENSION_TAX_ROWS: PensionTaxRow[] = [
  { ageRange: "55~69세", taxRate: 5.5 },
  { ageRange: "70~79세", taxRate: 4.4 },
  { ageRange: "80세 이상", taxRate: 3.3 },
];
```

### 4-7. 세액공제 환급 예시 데이터

```ts
export const PVNP_TAX_CREDIT_ROWS: TaxCreditRow[] = [
  { annualContribution: 3000000, creditLowIncome: 495000,  creditHighIncome: 396000  },
  { annualContribution: 6000000, creditLowIncome: 990000,  creditHighIncome: 792000  },
  { annualContribution: 9000000, creditLowIncome: 1485000, creditHighIncome: 1188000 },
];
```

### 4-8. 수령 전략 데이터

```ts
export const PVNP_WITHDRAWAL_ROWS: WithdrawalStrategyRow[] = [
  {
    method: "일시금",
    pros: "목돈 확보",
    cons: "세금·소진 리스크",
    bestFor: "대출 상환·주택자금 등 명확한 목적",
  },
  {
    method: "10년 분할",
    pros: "비교적 빠른 회수",
    cons: "장수 리스크",
    bestFor: "은퇴 초반 지출이 큰 경우",
  },
  {
    method: "20년 분할",
    pros: "생활비 안정",
    cons: "월수령액이 낮아짐",
    bestFor: "일반 은퇴자 기본 전략",
  },
  {
    method: "종신형",
    pros: "장수 리스크 방어",
    cons: "초기 수령액이 낮을 수 있음",
    bestFor: "오래 받을 안정성을 중시하는 경우",
  },
];
```

### 4-9. FAQ 데이터

```ts
export const PVNP_FAQ: FaqItem[] = [
  {
    q: "국민연금만으로 노후 생활이 가능한가요?",
    a: "평균 수령액 기준으로는 충분하지 않을 가능성이 큽니다. 월 생활비 250만~300만 원을 기준으로 보면 개인연금, 퇴직연금, 기타 소득이 함께 필요합니다.",
  },
  {
    q: "개인연금은 월 얼마부터 시작하는 게 좋나요?",
    a: "처음에는 월 10만~30만 원도 괜찮습니다. 세액공제 효과를 충분히 활용하려면 연금저축 연 600만 원, IRP 포함 연 900만 원 한도를 목표로 잡을 수 있습니다.",
  },
  {
    q: "연금저축과 IRP 중 무엇을 먼저 해야 하나요?",
    a: "투자 자율성과 편의성은 연금저축이 좋고, 세액공제 한도를 900만 원까지 채우려면 IRP를 함께 활용합니다.",
  },
  {
    q: "국민연금은 고갈되면 못 받나요?",
    a: "고갈은 기금 적립금이 줄어든다는 의미이지 즉시 지급 중단을 뜻하지는 않습니다. 다만 보험료율·수급개시연령·소득대체율 등 제도 변화 가능성은 계속 봐야 합니다.",
  },
  {
    q: "개인연금은 일시금으로 받는 게 좋나요?",
    a: "노후 생활비 목적이라면 분할 수령이 유리한 경우가 많습니다. 일시금은 세금과 소진 리스크가 크므로 대출 상환 등 명확한 목적이 있을 때만 검토하는 것이 좋습니다.",
  },
  {
    q: "30대도 개인연금을 꼭 해야 하나요?",
    a: "30대는 투자기간이 길어 복리 효과가 가장 큽니다. 소액이라도 일찍 시작하면 40~50대에 시작하는 것보다 월 납입 부담이 크게 줄어듭니다.",
  },
];
```

### 4-10. 관련 링크 데이터

```ts
export const PVNP_RELATED_LINKS: RelatedLink[] = [
  {
    label: "노후자금 고갈 계산기",
    href: "/tools/retirement-fund-depletion/",
    description: "자산 고갈 예상 나이와 월 추가 적립 필요액 확인",
  },
  {
    label: "연금저축 vs IRP 비교 2026",
    href: "/reports/pension-irp-comparison-2026/",
    description: "연금저축과 IRP 세액공제·운용·수령 방식 차이 비교",
  },
  {
    label: "퇴직연금 DC·DB·IRP 비교 2026",
    href: "/reports/retirement-pension-dc-db-irp-2026/",
    description: "퇴직연금 제도별 구조·수익률·수수료·수령 전략 비교",
  },
  {
    label: "국민연금 세대별 손익 비교 2026",
    href: "/reports/national-pension-generational-comparison-2026/",
    description: "세대별 납입 총액과 예상 수령액·수익비 비교",
  },
];
```

---

## 5. 페이지 레이아웃

### 5-1. 기본 구조

- `BaseLayout`
- `SiteHeader`
- 리포트 전용 Hero (헤더 영역)
- 본문 섹션 (순서는 6장 참고)
- FAQ
- 관련 계산기 CTA
- `SiteFooter` (BaseLayout 포함)

### 5-2. 권장 pageClass

- `pvnp-page`

### 5-3. 섹션 id

```text
#summary
#national-pension-2026
#personal-pension-structure
#income-gap
#simulation
#generation-comparison
#pension-tax
#withdrawal-strategy
#depletion-risk
#pension-mix
#faq
#related
```

---

## 6. 본문 섹션 설계

### 6-1. Hero

- eyebrow: `연금 비교 리포트`
- title: `개인연금 vs 국민연금 2026 수령액 완전 비교`
- description: `국민연금 평균 수령액, 개인연금 시뮬레이션, 노후 소득 갭, 세액공제, 수령 전략까지 한 번에 정리합니다.`

Hero 안에 핵심 요약 배지 3개:

| 배지 | 내용 |
| --- | --- |
| 2026 국민연금 평균 수령액 | 월 약 70만 원대 추정 |
| 세액공제 최대 | 연 148만 5천 원 (900만 원 납입 시) |
| 국민연금 고갈 시점 조정 | 개혁 후 약 2071년 전후 추정 |

### 6-2. 30초 결론

목적: 검색 유입자가 스크롤 없이 핵심을 파악하도록 한다.

구성:

- 국민연금은 기본 생활비 안전망이며 단독으로는 월 300만 원 생활비를 충당하기 어렵다.
- 개인연금(연금저축·IRP)은 부족분을 메우는 보완 장치다.
- 연금저축 600만 원·IRP 포함 900만 원 세액공제 한도를 먼저 채우는 전략이 기본이다.
- 수령 나이가 늦을수록 연금소득세율이 낮아진다.

### 6-3. 2026 국민연금 현황

카드 4개:

1. 2026년 평균 수령액 추정 — 월 약 69만 8천 원, 물가변동률 2.1% 반영
2. 보험료율 — 2026년 9.5%, 매년 0.5%p씩 단계 인상 → 13% 방향
3. 최소 가입기간 — 10년
4. 소득대체율 — 2026년 43% 방향

박스 하단:

> 실제 수령액은 가입기간·생애 평균소득·수령개시연령에 따라 달라집니다. 위 금액은 추정치입니다.

### 6-4. 개인연금 구조

표: 연금 3층 구조

| 층 | 구성 | 역할 |
| -- | --- | --- |
| 1층 | 국민연금 | 기본 생활비 |
| 2층 | 퇴직연금 DB/DC/IRP | 은퇴 전후 핵심 자산 |
| 3층 | 연금저축·IRP·ISA·ETF | 부족분 보완, 생활 수준 유지 |

세액공제 안내 박스:

- 연금저축 세액공제 한도: 연 600만 원
- 연금저축 + IRP 합산 한도: 연 900만 원
- 총급여 5,500만 원 이하 공제율: 16.5%
- 총급여 5,500만 원 초과 공제율: 13.2%

박스 하단:

> 세액공제는 일반 안내 기준입니다. 실제 신고 전 국세청 안내를 확인하세요.

### 6-5. 국민연금 단독 vs 국민+개인연금 소득 갭

`PVNP_GAP_ROWS` 출력.

표 위 안내:

> 월 생활비 300만 원 기준 참고 예시입니다.

표 항목:

- 구분
- 월 연금수령액
- 월 부족액
- 연간 부족액
- 20년 합산 부족액

부족액 = 0인 행은 다른 색으로 강조.

### 6-6. 개인연금 시뮬레이션

`PVNP_SIM_ROWS` 출력.

표 위 안내:

> 35세 → 60세, 25년 납입 가정. 수익률은 단순 추정이며 실제 운용 성과와 다를 수 있습니다.

표 항목:

- 월 납입액
- 연 4% 적립 추정
- 연 6% 적립 추정
- 연 8% 적립 추정

`PVNP_PAYOUT_ROWS` 출력.

표 위 안내:

> 20년 분할 수령 기준, 연금소득세 5.5% 가정. 참고 시뮬레이션입니다.

표 항목:

- 은퇴 시 적립액
- 세전 월 수령액
- 세후 월 수령액

CTA:

> 내 노후자금 고갈 시점을 계산해보세요 → `/tools/retirement-fund-depletion/`

### 6-7. 세대별 예상 수령액 비교

`PVNP_GENERATION_ROWS` 출력.

표 항목:

- 세대
- 국민연금 예상 월수령액 (범위)
- 개인연금 예상 월수령액 (범위)
- 합산 월수령액 (범위)
- 월 300만 원 대비 평가

세대별 해석 카드 3개 (30대·40대·50대):

- 30대: 시간이 가장 큰 자산. 소액 시작 + 복리 효과.
- 40대: 납입기간 단축 → 월 납입액 높이거나 IRP·DC 병행.
- 50대: 수익률보다 안정성·현금흐름 설계 우선. 수령 시점 전략이 핵심.

### 6-8. 연금 수령 시 세금

`PVNP_PENSION_TAX_ROWS` 출력.

표 항목:

- 수령 나이
- 연금소득세율 (지방세 포함)

설명 박스:

- 납입 시 세액공제 → 수령 시 연금소득세 납부 구조
- 중도해지·일시금 수령 시 세부담 증가 가능
- 국민연금은 공적연금소득으로 종합소득세 과세 대상 (별도 설명 박스)

`PVNP_TAX_CREDIT_ROWS` 출력.

표 항목:

- 연 납입액
- 총급여 5,500만 원 이하 세액공제 예시
- 총급여 5,500만 원 초과 세액공제 예시

표 하단:

> 세액공제는 납입 900만 원 전액을 돌려받는 것이 아닙니다. 한도 내 납입액의 16.5% 또는 13.2%를 세금에서 공제합니다.

### 6-9. 수령 전략

`PVNP_WITHDRAWAL_ROWS` 출력.

표 항목:

- 수령 방식
- 장점
- 단점
- 추천 대상

핵심 메시지 박스:

> 기본 생활비는 국민연금과 분할 수령 연금으로 만들고, 비상자금은 별도 계좌로 분리하는 방식이 안정적입니다.

### 6-10. 국민연금 고갈 리스크

카드 5개 (`PVNP_RISK_ROWS` — 데이터 파일에 직접 정의):

| 시나리오 | 가능성 | 개인 대응 |
| --- | --- | --- |
| 보험료율 추가 인상 | 중간~높음 | 개인연금·퇴직연금 병행 |
| 수급개시연령 조정 | 중간 | 은퇴 전 현금흐름 확보 |
| 소득대체율 조정 | 중간 | 목표 노후 생활비 재계산 |
| 기금운용 수익률 변동 | 상시 | 국민연금 단독 의존도 낮추기 |
| 세대 간 부담 논쟁 지속 | 높음 | 개인 자산 포트폴리오 구축 |

안내 박스:

> 2025년 3월 개혁 이후 기금 고갈 시점은 약 2071년 전후로 추정됩니다. 이는 추정치이며, 향후 제도 변화에 따라 달라질 수 있습니다.

### 6-11. 소득별 연금 믹스 전략

표:

| 월 소득 | 국민연금 | 퇴직연금 | 개인연금·ISA | 전략 |
| --- | --- | --- | --- | --- |
| 300만 원 이하 | 기본 납부 | 회사 제도 활용 | 월 10~30만 원 | 세액공제 우선 |
| 300~500만 원 | 기본 납부 | DC/IRP 점검 | 월 30~50만 원 | 연금저축 600만 원 목표 |
| 500~800만 원 | 기본 납부 | DC 적극 운용 | 월 50~75만 원 | IRP 포함 900만 원 목표 |
| 800만 원 이상 | 기본 납부 | 퇴직연금 최적화 | 월 75만 원 이상 | ISA·일반 ETF 병행 |

### 6-12. FAQ

`PVNP_FAQ` 출력 (단순 Q&A 리스트 또는 아코디언).

### 6-13. CTA 영역

메인 CTA:

- title: `노후자금이 언제까지 버티는지 지금 확인해보세요`
- href: `/tools/retirement-fund-depletion/`

보조 CTA (`PVNP_RELATED_LINKS`):

- 연금저축 vs IRP 비교 2026
- 퇴직연금 DC·DB·IRP 비교 2026
- 국민연금 세대별 손익 비교 2026

---

## 7. 스타일 설계 (`_personal-vs-national-pension-2026.scss`)

### 7-1. prefix

- `pvnp-`

### 7-2. 시각 방향

- 금융 리포트형 UI
- 표와 카드가 주축. 화려한 장식보다 가독성 우선.
- 국민연금과 개인연금을 색으로 구분하되 전체 페이지가 단색으로 보이지 않게 한다.

권장 색상 토큰:

```scss
.pvnp-page {
  --pvnp-national: #1e40af;   // 국민연금 — 파란 계열
  --pvnp-personal: #0f766e;   // 개인연금 — teal 계열
  --pvnp-gap: #dc2626;        // 부족액 강조
  --pvnp-ok: #16a34a;         // 부족 없음
  --pvnp-warning: #b45309;    // 주의 안내
}
```

### 7-3. 주요 스타일 포인트

- 비교표는 모바일 가로 스크롤 허용 (`overflow-x: auto`)
- 세대별 카드 3개: desktop 3열, mobile 1열
- 소득 갭 표에서 부족액 = 0인 행은 `--pvnp-ok` 배경 하이라이트
- 배지: `추정`, `시뮬레이션`, `참고`는 일관된 스타일 사용
- 긴 숫자·금액 줄바꿈 방지: `font-variant-numeric: tabular-nums`, `white-space: nowrap`

### 7-4. 금지

- 세액공제 환급액을 "확정 환급"처럼 강조하는 디자인 금지
- 수령액 예시에서 특정 금융사·상품을 추천하는 표현 금지
- `무조건`, `보장`, `최고` 표현 금지

---

## 8. SEO 설계

### 8-1. 메타

```text
title: "개인연금 vs 국민연금 2026 수령액 완전 비교 | 노후 소득 갭·세액공제 정리"
description: "2026년 국민연금 평균 수령액과 개인연금 연금저축·IRP 수령액을 비교합니다. 세대별 예상 수령액, 세금, 수령 개시 나이, 노후 소득 갭까지 정리했습니다."
```

### 8-2. 주요 키워드

- 개인연금 국민연금 수령액 비교
- 국민연금 평균 수령액 2026
- 개인연금 수령액 계산
- 연금저축 IRP 세액공제
- 노후 생활비 계산
- 국민연금 고갈

### 8-3. 구조화 데이터

- `Article`
- `FAQPage`

### 8-4. reports.ts 등록

```ts
{
  slug: "personal-vs-national-pension-2026",
  title: "개인연금 vs 국민연금 2026 수령액 완전 비교",
  description: "2026년 국민연금 평균 수령액과 개인연금 연금저축·IRP 수령액을 비교합니다. 세대별 예상 수령액, 세금, 수령 개시 나이, 노후 소득 갭까지 정리했습니다.",
  order: 25.9,
  badges: ["국민연금", "개인연금", "IRP", "노후", "2026"],
},
```

---

## 9. QA 체크리스트

### 콘텐츠

- [ ] 국민연금 수령액이 "확정" 수치가 아닌 "추정"으로 표시된다.
- [ ] 세액공제율 16.5%/13.2%와 기준 소득(5,500만 원) 구분이 명확하다.
- [ ] "900만 원을 세액공제 받는다"는 오해를 유발하지 않도록 납입 한도와 공제액 구분이 된다.
- [ ] 연금소득세율(55~69세 5.5% 등) 출처와 변경 가능성 안내가 있다.
- [ ] 시뮬레이션 수치에 `추정` 또는 `시뮬레이션` 배지가 사용된다.
- [ ] 국민연금 고갈 리스크 설명에서 "즉시 지급 중단"과 "기금 고갈"의 차이를 명시한다.

### UI

- [ ] 비교표 모바일 가로 스크롤 확인
- [ ] 세대별 카드 3개 레이아웃 확인 (desktop 3열, mobile 1열)
- [ ] 부족액 = 0 행 색상 강조 확인
- [ ] CTA 링크 정상 이동 확인
- [ ] 긴 금액 줄바꿈으로 레이아웃 깨지지 않는지 확인

### 등록

- [ ] `src/data/reports.ts` 등록
- [ ] `src/styles/app.scss` `@use` 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] OG 이미지 생성 또는 플레이스홀더 확인
- [ ] `npm run build` 통과

---

## 10. 구현 우선순위

### P0

- Hero + 30초 결론
- 2026 국민연금 현황 카드
- 소득 갭 비교표 (`PVNP_GAP_ROWS`)
- 개인연금 시뮬레이션 표 (`PVNP_SIM_ROWS`, `PVNP_PAYOUT_ROWS`)
- 세액공제 안내 박스 + 환급 예시 표
- 관련 계산기 CTA
- FAQ

### P1

- 세대별 비교 카드 (`PVNP_GENERATION_ROWS`)
- 연금소득세율 표 (`PVNP_PENSION_TAX_ROWS`)
- 수령 전략 비교표 (`PVNP_WITHDRAWAL_ROWS`)
- 소득별 연금 믹스 전략 표
- 국민연금 고갈 리스크 카드

### P2

- 연금 3층 구조 시각화 (아이콘 + 카드)
- 주요국 공적연금 소득대체율 비교 섹션
- 연금 믹스 계산기 연결 인터랙션

---

## 11. 최종 구현 메모

이 페이지의 핵심 메시지는 `국민연금은 기본 안전망, 개인연금은 보완 장치`다. 절대 "국민연금보다 개인연금이 낫다"는 구도를 만들지 않는다.

소득 갭 비교표(6-5)와 개인연금 시뮬레이션(6-6)이 이 리포트의 핵심 콘텐츠다. 이 두 섹션에서 사용자가 "내가 얼마나 부족한가"와 "개인연금을 얼마나 넣어야 하는가"를 직관적으로 읽을 수 있어야 한다.

수치가 많은 리포트이므로 표 중심 레이아웃을 유지하되, 각 표 위에 짧은 안내 문장으로 숫자의 맥락을 제공한다. 숫자만 나열하면 사용자가 판단 기준을 잃는다.

세액공제 섹션은 과거 유사 리포트에서 "900만 원을 돌려받는다"는 오해가 발생하기 쉬우므로 납입 한도와 공제액을 명확히 구분해 표시한다.
