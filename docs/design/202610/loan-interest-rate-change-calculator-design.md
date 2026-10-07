# 기준금리·대출금리 변동 계산기 2026 — 설계 문서

> 기획 원문: `docs/plan/202610/loan-interest-rate-change-calculator.md`
> 작성일: 2026-10-07
> 문서 상태: **설계·구현 완료 / 배포 미착수**
> 구현 기준: Claude/Codex가 이 문서만 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 배포 목표: 2026-10-22(목) 한국은행 통화정책방향 결정회의 **이전**

---

## 1. 문서 개요

- 구현 대상: `기준금리·대출금리 변동 계산기 2026`
- slug: `loan-interest-rate-change-calculator`
- URL: `/tools/loan-interest-rate-change-calculator/` (트레일링 슬래시 필수)
- 콘텐츠 유형: calculator
- 레이아웃: `SimpleToolShell` (aside 입력 / main 결과)
- 카테고리: `realestate` (홈 분류 라벨 `대출·금융`)
- 핵심 검색 의도: "대출금리가 0.25%p / 0.5%p 바뀌면 내 월 상환액과 총이자가 얼마나 달라지나?"
- 핵심 출력: 현재/변경 후 월 상환액, 월 부담 증감, 남은 기간 총이자, 총이자 증감, ±0.25/0.5/1.0%p 빠른 비교표
- 핵심 CTA: `/tools/loan-refinancing-calculator/`, `/tools/mortgage-prepayment-penalty/`

중요 톤·원칙 (구현 전체에 적용):
- **기준금리 → 대출금리 자동 연동 금지.** 기준금리 값은 정보 카드에만 표시하고 어떤 계산식에도 들어가지 않는다.
- 사용자가 **현재 대출금리**와 **변경 후 예상 대출금리(또는 ±변동폭)**를 직접 입력한다.
- 최근 기준금리 방향이 인상(2026-07-16, 08-27 연속 인상)이므로 "금리 인하 수혜" 톤 금지. 인상·인하 양방향 동일 비중.
- "기준금리 인하 = 내 대출금리 즉시 인하" 오해 방지 문구를 InfoNotice·결과 영역·FAQ 3곳에 배치.
- 배지는 `공식` / `참고` / `시뮬레이션` / `추정` 4종만 사용.
- Title·H1·본문 고정 문구에 특정 회의 날짜를 넣지 않는다. 날짜는 데이터 파일 상수에만 둔다(상시 계산기).

---

## 2. 기존 코드 재사용 방침

| 항목 | 결정 |
|---|---|
| 상환 계산 공식 | `public/scripts/loan-refinancing-calculator.js` 의 `calculateMonthlyPayment` / `calculateTotalInterest` 와 **동일 공식**을 신규 JS 안에 별도 함수로 작성 |
| 공통 유틸 분리 | **이번 범위에서 하지 않음.** 기존 페이지는 IIFE 모듈이라 export가 없고, 분리 시 운영 중인 갈아타기 계산기 회귀 위험이 있음. 신규 JS 상단에 "공식 출처: loan-refinancing-calculator.js와 동일" 주석만 남긴다 |
| 원금균등 총이자 | 기존은 루프 합산, 신규는 닫힌식 `i × P × (n+1) / 2` 사용 — QA에서 루프 결과와 일치 확인(§13) |
| URL 상태 | 기존 페이지와 같은 `URLSearchParams` + `history.replaceState` 패턴 |
| 금액 입력 | 기존 `bindMoneyInput`(focus 시 콤마 제거 / blur 시 콤마 포맷) 패턴 복제 |
| 공용 클래스 | `panel`, `panel-heading`, `panel__title`, `panel-heading__eyebrow` 그대로 사용 |

---

## 3. 구현 파일 구조

```text
src/
  data/
    loanInterestRateChangeCalculator.ts     ← 타입, 메타, 기본값, 프리셋, 기준금리 상수, FAQ, 관련 링크
  pages/
    tools/
      loan-interest-rate-change-calculator.astro

public/
  scripts/
    loan-interest-rate-change-calculator.js
  og/tools/
    loan-interest-rate-change-calculator.png   ← npm run og:generate

src/styles/scss/pages/
  _loan-interest-rate-change-calculator.scss
```

- 코드 식별자 prefix: `LIRC_` (Loan Interest Rate Change), SCSS/DOM prefix: `lirc-`
- JSON 주입 script id: `lircConfig`

추가 등록 필수:
- `src/data/tools.ts` — §12-1
- `src/styles/app.scss` — `@use 'scss/pages/loan-interest-rate-change-calculator';`
- `public/sitemap.xml` — §12-2
- `src/pages/index.astro` 카테고리 매핑 — `"loan-interest-rate-change-calculator": "대출·금융",`

---

## 4. 레이아웃 방향

```astro
<SimpleToolShell
  calculatorId="loan-interest-rate-change-calculator"
  pageClass="lirc-page"
  resultFirst={false}
>
```

- 모바일: 입력(aside) → KPI → 빠른 비교표 → 기준금리 카드 → 금리 구조 설명 → CTA → SeoContent
- PC: 좌측 aside 입력 고정폭, 우측 main 결과
- 가로 스크롤 금지. 비교표는 모바일에서 4열 축약(§9-3)

`InfoNotice` (title: `"금리 변동 시뮬레이션 안내"`) lines:

```text
기준금리가 바뀌어도 내 대출금리가 같은 폭·같은 날 바뀌지는 않습니다. 은행 앱·약정서의 현재 적용금리와 예상 금리를 직접 입력하세요.
결과는 연이율÷12 월 이율과 '변경 금리가 남은 기간 동안 유지된다'는 가정의 시뮬레이션이며, 실제 은행 청구액과 차이가 날 수 있습니다.
기준금리·회의 일정은 한국은행 공시 기준이며, 계산에는 반영되지 않습니다.
```

---

## 5. 데이터 모델

```ts
// src/data/loanInterestRateChangeCalculator.ts

export type RepaymentType = "annuity" | "equalPrincipal" | "bullet";
export type RateInputMode = "delta" | "target";
export type SourceBadge = "공식" | "참고" | "시뮬레이션" | "추정";

export interface LircInput {
  balance: number;          // 대출잔액(원)
  rateNow: number;          // 현재 연이율(%) 예: 4.00
  rateMode: RateInputMode;  // 변동폭 입력 / 변경 후 금리 직접 입력
  rateDelta: number;        // 변동폭(%p) 예: -0.25
  rateNew: number;          // 변경 후 연이율(%) 예: 3.75
  months: number;           // 남은 기간(개월, 정수)
  repay: RepaymentType;
}

export interface LircScheduleSummary {
  monthlyPayment: number;   // 대표 월 상환액: 원리금균등=고정액, 원금균등=첫 달, 만기일시=월 이자
  lastPayment: number;      // 마지막 달 상환액(원금균등 보조 표기, 만기일시는 이자+원금)
  totalInterest: number;    // 남은 기간 총이자
  firstYearInterest: number;// 첫 min(12, n)개월 이자 합계
}

export interface LircResult {
  rateNowApplied: number;   // 클램프 후 현재 금리(%)
  rateNewApplied: number;   // 클램프 후 변경 금리(%)
  clampedToZero: boolean;   // 변경 금리가 0% 미만이라 0%로 보정됨
  now: LircScheduleSummary;
  next: LircScheduleSummary;
  monthlyDiff: number;      // next.monthlyPayment - now.monthlyPayment
  totalInterestDiff: number;// next.totalInterest - now.totalInterest
  annualDiff: number;       // 첫 12개월 부담 차이(§7-6)
}

export interface LircQuickRow {
  delta: number;            // %p
  rate: number;             // 적용 금리(%)
  monthlyPayment: number;
  monthlyDiff: number;
  totalInterestDiff: number;
  clampedToZero: boolean;
  isCurrent: boolean;       // 사용자 입력 변동폭과 같은 행
}

export interface LircPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<LircInput>;
}

export interface LircRateDecision {
  date: string;             // YYYY-MM-DD
  from: number;             // %
  to: number;               // %
  action: "인상" | "인하" | "동결";
}

export interface FaqItem { question: string; answer: string; }
export interface RelatedLink { href: string; label: string; description: string; }
```

---

## 6. 기준 데이터

### 6-1. 메타·기본값

```ts
export const LIRC_META = {
  title: "기준금리 변동 대출이자 계산기 2026 | 월 상환액 바로 계산",
  description:
    "대출잔액·현재 금리·변경 후 금리를 입력하면 월 상환액과 남은 기간 총이자 변화를 바로 계산. 0.25%p·0.5%p·1%p 금리 변동 빠른 비교표 포함.",
  h1: "기준금리·대출금리 변동 계산기 2026",
  updatedAt: "2026년 10월 기준",
} as const;

export const LIRC_DEFAULT_INPUT: LircInput = {
  balance: 300_000_000,
  rateNow: 4.0,
  rateMode: "delta",
  rateDelta: -0.25,
  rateNew: 3.75,
  months: 360,
  repay: "annuity",
};

export const LIRC_QUICK_DELTAS = [-1.0, -0.5, -0.25, 0.25, 0.5, 1.0] as const; // %p

export const LIRC_LIMITS = {
  balance: { min: 10_000, max: 5_000_000_000 },
  rate: { min: 0, max: 20 },
  delta: { min: -5, max: 5 },
  months: { min: 1, max: 600 },
} as const;
```

### 6-2. 기준금리 상수 `공식` (2026-10-07 한국은행 홈페이지 확인)

```ts
export const LIRC_BASE_RATE = {
  current: 3.0,                     // %
  lastChange: { date: "2026-08-27", from: 2.75, to: 3.0, action: "인상" },
  history: [                        // 최근 결정 3건(변경 건)
    { date: "2026-08-27", from: 2.75, to: 3.0, action: "인상" },
    { date: "2026-07-16", from: 2.5, to: 2.75, action: "인상" },
    { date: "2025-05-29", from: 2.75, to: 2.5, action: "인하" },
  ] as LircRateDecision[],
  // 결정회의 일정(2026, 한국은행 공식). 동결 회의 포함 전체 목록
  meetings2026: [
    "2026-01-15", "2026-02-26", "2026-04-10", "2026-05-28",
    "2026-07-16", "2026-08-27", "2026-10-22", "2026-11-26",
  ],
  lastReviewedMeeting: "2026-08-27", // 이 날짜 회의 결과까지 상수에 반영됨
  checkedAt: "2026-10-07",
  sourceLabel: "한국은행 기준금리 추이·통화정책방향",
  sourceUrl: "https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643",
} as const;
```

- `lastReviewedMeeting` 은 **금리 변경 여부와 무관하게** 마지막으로 결과를 확인·반영한 회의일이다(동결이어도 갱신).
- 2027년 일정은 한국은행 발표(통상 연말) 후 `meetings2027` 추가.

### 6-3. 프리셋 (입력 예시, 결과는 `시뮬레이션`)

```ts
export const LIRC_PRESETS: LircPreset[] = [
  {
    id: "mortgage",
    label: "주담대 3억·30년",
    description: "변동형 주택담보대출 원리금균등 예시",
    input: { balance: 300_000_000, rateNow: 4.0, months: 360, repay: "annuity" },
  },
  {
    id: "jeonse",
    label: "전세대출 2억·2년",
    description: "만기일시상환(월 이자만 납부) 예시",
    input: { balance: 200_000_000, rateNow: 3.8, months: 24, repay: "bullet" },
  },
  {
    id: "credit",
    label: "신용대출 5천·1년",
    description: "금융채 연동 신용대출, 만기일시 예시",
    input: { balance: 50_000_000, rateNow: 5.5, months: 12, repay: "bullet" },
  },
];
```

- 프리셋은 `balance/rateNow/months/repay` 만 바꾸고 **변동폭(rateDelta)과 rateMode는 유지**한다. 변경 금리는 현재 모드 규칙(§7-1)으로 재계산.
- 프리셋 금리는 상품 평균 공시값이 아닌 **입력 예시**임을 버튼 하단 note에 표기: "예시 금리이며 실제 상품 금리가 아닙니다."

### 6-4. 금리 구조 설명 카드 `참고`

```ts
export const LIRC_RATE_STRUCTURE = [
  {
    title: "내 대출금리 = 기준지표 + 가산금리 − 우대금리",
    body: "변동금리 대출은 기준지표 금리에 은행이 정한 가산금리를 더하고, 급여이체·카드 실적 등 우대금리를 뺀 값으로 정해집니다.",
  },
  {
    title: "기준지표는 COFIX·금융채가 대표적",
    body: "주택담보대출 변동형은 은행 자금조달비용을 반영한 COFIX(은행연합회 매월 공시), 신용대출은 금융채 금리를 주로 씁니다. 둘 다 기준금리와 같은 폭·같은 날 움직이지 않을 수 있습니다.",
  },
  {
    title: "바뀌는 시점은 약정한 변동주기",
    body: "6개월·12개월 등 약정 주기가 돌아올 때 그 시점 기준지표로 재산정됩니다. 고정금리·혼합형의 고정 기간에는 기준금리가 바뀌어도 금리가 유지됩니다.",
  },
];
```

- 특정 월 COFIX 수치는 **MVP에서 노출하지 않는다**(기획 §남은 확인 사항 결론). 상시 페이지에서 월별 갱신 부담 + 오래된 수치 노출 위험이 크기 때문.

---

## 7. 계산 로직

### 7-1. 입력 정규화

```text
balance = clamp(balance, 10,000, 5,000,000,000)
rateNow = clamp(rateNow, 0, 20)
months  = clamp(round(months), 1, 600)

delta 모드:  rateNewRaw = rateNow + rateDelta
target 모드: rateNewRaw = rateNew;  rateDelta(표시용) = rateNew − rateNow

rateNewApplied = clamp(rateNewRaw, 0, 20)
clampedToZero  = rateNewRaw < 0
```

- 금리 덧셈은 부동소수 오차 방지를 위해 `Math.round(x * 1000) / 1000` 로 소수 셋째 자리 정규화 후 사용.
- 모드 전환 시 값 동기화: delta→target 전환 시 `rateNew = rateNow + rateDelta`, target→delta 전환 시 `rateDelta = rateNew − rateNow`.

### 7-2. 변수

| 기호 | 의미 |
|---|---|
| `P` | 대출잔액 |
| `R` | 연이율(소수) = `rate% / 100` |
| `i` | 월 이율 = `R / 12` |
| `n` | 남은 개월 수 |
| `C` | 원금균등 월 원금 = `P / n` |

### 7-3. 원리금균등 `annuity`

```js
function annuity(P, R, n) {
  const i = R / 12;
  const M = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const m12 = Math.min(12, n);
  // 첫 m12개월 이자 합계: 잔액을 직접 굴려 계산
  let bal = P, firstYearInterest = 0;
  for (let k = 0; k < m12; k += 1) { const it = bal * i; firstYearInterest += it; bal -= (M - it); }
  return { monthlyPayment: M, lastPayment: M, totalInterest: M * n - P, firstYearInterest };
}
```

### 7-4. 원금균등 `equalPrincipal`

```js
function equalPrincipal(P, R, n) {
  const i = R / 12, C = P / n, m12 = Math.min(12, n);
  return {
    monthlyPayment: C + P * i,                       // 첫 달
    lastPayment: C + C * i,                          // 마지막 달
    totalInterest: i * P * (n + 1) / 2,
    firstYearInterest: i * (m12 * P - C * m12 * (m12 - 1) / 2),
  };
}
```

### 7-5. 만기일시 `bullet`

```js
function bullet(P, R, n) {
  const i = R / 12;
  return {
    monthlyPayment: P * i,                           // 월 이자(원금 미포함)
    lastPayment: P * i + P,                          // 만기 달: 이자 + 원금
    totalInterest: P * i * n,
    firstYearInterest: P * i * Math.min(12, n),
  };
}
```

### 7-6. 결과 조합

```text
now  = calc(P, rateNowApplied/100, n, repay)
next = calc(P, rateNewApplied/100, n, repay)
monthlyDiff       = next.monthlyPayment − now.monthlyPayment
totalInterestDiff = next.totalInterest − now.totalInterest
annualDiff        = next.firstYearInterest − now.firstYearInterest
```

- `annualDiff` 는 상환방식 무관하게 "첫 12개월(만기 12개월 미만이면 남은 기간) 동안 더/덜 내는 금액". 원리금균등은 이자 차이 ≠ 납입액 차이이므로, 라벨을 **"첫 1년 납입액 차이"가 아닌 "첫 1년 이자 차이"**로 표기한다. (원리금균등에서 납입액 차이는 `monthlyDiff × min(12,n)` 이고 그 차액 일부는 원금 상환 속도 차이로 흡수됨 — 혼동 방지를 위해 KPI에는 `monthlyDiff`·`totalInterestDiff` 만, `annualDiff`는 보조 줄로만 표시)

### 7-7. 빠른 비교표

```text
for d in LIRC_QUICK_DELTAS:
  rateRaw = rateNowApplied + d
  rate    = clamp(rateRaw, 0, 20)
  r       = calc(P, rate/100, n, repay)
  row = { delta:d, rate, monthlyPayment:r.monthlyPayment,
          monthlyDiff: r.monthlyPayment − now.monthlyPayment,
          totalInterestDiff: r.totalInterest − now.totalInterest,
          clampedToZero: rateRaw < 0,
          isCurrent: |d − (rateNewApplied − rateNowApplied)| < 0.0005 }
```

### 7-8. 표시 규칙

- 내부 계산은 실수, **표시 단계에서만** `Math.round`.
- 원 단위: `1,432,246원`. 1억 이상 총이자는 보조 표기 `약 2억 1,561만원` 병기.
- 증감 부호: `+87,810원` / `−42,899원`(U+2212 아닌 하이픈 `-` 대신 `−` 사용 통일), 0은 `0원`.
- 반올림 후 `-0` 이 나오지 않도록 `Object.is(x, -0) ? 0 : x` 처리.
- 증가 = `data-sign="up"`(빨강 계열), 감소 = `data-sign="down"`(파랑 계열), 0 = `data-sign="zero"`(회색).

---

## 8. 검증 기준값 (구현 후 그대로 일치해야 함)

> 기획 §8 값 재사용. 3억원·360개월. 모두 `시뮬레이션`.

| ID | 케이스 | 방식 | 현재 월 | 변경 후 월 | 월 증감 | 총이자 증감 |
|---|---|---|---:|---:|---:|---:|
| V1 | 4.00→3.75 | 원리금균등 | 1,432,246 | 1,389,347 | −42,899 | −15,443,680 |
| V1 | 〃 | 원금균등(첫 달) | 1,833,333 | 1,770,833 | −62,500 | −11,281,250 |
| V1 | 〃 | 만기일시 | 1,000,000 | 937,500 | −62,500 | −22,500,000 |
| V2 | 4.00→3.50 | 원리금균등 | 1,432,246 | 1,347,134 | −85,112 | −30,640,256 |
| V2 | 〃 | 원금균등 | 1,833,333 | 1,708,333 | −125,000 | −22,562,500 |
| V2 | 〃 | 만기일시 | 1,000,000 | 875,000 | −125,000 | −45,000,000 |
| V3 | 4.00→4.50 | 원리금균등 | 1,432,246 | 1,520,056 | +87,810 | +31,611,616 |
| V3 | 〃 | 원금균등 | 1,833,333 | 1,958,333 | +125,000 | +22,562,500 |
| V3 | 〃 | 만기일시 | 1,000,000 | 1,125,000 | +125,000 | +45,000,000 |

현재 총이자: 원리금균등 215,608,519 / 원금균등 180,500,000 / 만기일시 360,000,000

빠른 비교표(원리금균등, 현재 4.00%): −1.00%p −167,434 / −60,276,163 · −0.50%p −85,112 / −30,640,256 · −0.25%p −42,899 / −15,443,680 · +0.25%p +43,574 / +15,686,563 · +0.50%p +87,810 / +31,611,616 · +1.00%p +178,219 / +64,158,834

경계값 E1~E8 은 기획 §8-5 기대값을 그대로 QA 기준으로 사용한다(§13).

---

## 9. 페이지 IA 및 마크업 스케치

### 9-1. 섹션 순서

| 순서 | 슬롯 | 블록 | 비고 |
|---|---|---|---|
| 1 | hero | `CalculatorHero` | eyebrow `대출이자 계산`, title=H1, badges `["주담대", "전세대출", "신용대출", "금리 변동"]` |
| 2 | hero | `InfoNotice` | §4 문구 3줄 |
| 3 | actions | `ToolActionBar` | `resetId="lircResetBtn"`, `copyId="lircCopyLinkBtn"` |
| 4 | aside | 프리셋 패널 | 3개 버튼 + 예시 금리 note |
| 5 | aside | Step 1 대출 조건 | 잔액, 남은 기간(년+개월), 상환방식 |
| 6 | aside | Step 2 금리 변화 | 현재 금리, 모드 토글, 변동폭 칩 or 변경 후 금리 |
| 7 | main | 오해 방지 배너 | 결과 상단 1줄, `참고` |
| 8 | main | KPI 4개 | §10-1 |
| 9 | main | 상세 비교 표 | 현재 vs 변경 후 2열 |
| 10 | main | 빠른 비교표 | ±6행 |
| 11 | main | 자연어 결과 메시지 | `추정` |
| 12 | main | 최근 기준금리 카드 | `공식` |
| 13 | main | 금리 구조 설명 3카드 | `참고` |
| 14 | main | 다음 행동 CTA 2개 | 갈아타기/중도상환 |
| 15 | seo | `SeoContent` | `<Fragment slot="seo">` 안 필수 |

### 9-2. aside 마크업 핵심

```astro
<article class="panel">
  <div class="panel-heading"><div>
    <p class="panel-heading__eyebrow">Step 2</p>
    <h2 class="panel__title">금리가 얼마나 바뀌나요?</h2>
  </div></div>

  <label class="lirc-field">
    <span>현재 적용 금리</span>
    <input id="lircRateNow" type="number" min="0" max="20" step="0.01" value="4.00" />
    <small>은행 앱·약정서의 현재 연 금리</small>
  </label>

  <div class="lirc-mode-toggle" role="tablist">
    <button type="button" class="lirc-pill-btn is-active" data-rate-mode="delta" aria-pressed="true">변동폭으로 입력</button>
    <button type="button" class="lirc-pill-btn" data-rate-mode="target" aria-pressed="false">바뀔 금리 직접 입력</button>
  </div>

  <div class="lirc-delta-group" data-mode-panel="delta">
    <div class="lirc-chip-row" id="lircDeltaChips">
      {LIRC_QUICK_DELTAS.map((d) => (
        <button type="button" class="lirc-chip" data-delta={d}>{d > 0 ? `+${d}` : d}%p</button>
      ))}
    </div>
    <label class="lirc-field">
      <span>직접 입력(%p)</span>
      <input id="lircRateDelta" type="number" min="-5" max="5" step="0.01" value="-0.25" />
    </label>
  </div>

  <label class="lirc-field" data-mode-panel="target" hidden>
    <span>변경 후 예상 금리</span>
    <input id="lircRateNew" type="number" min="0" max="20" step="0.01" value="3.75" />
  </label>

  <p class="lirc-note" id="lircRatePreview">4.00% → 3.75% (−0.25%p)</p>
</article>
```

- 남은 기간: `#lircYears`(0~50) + `#lircExtraMonths`(0~11) → `months = years*12 + extra`. 둘 다 0이면 오류 상태.
- 상환방식: `.lirc-pill-btn[data-repay]` 3개 세그먼트, 하단 note가 방식별 설명으로 교체:
  - annuity: "매달 같은 금액(원금+이자)을 냅니다."
  - equalPrincipal: "매달 같은 원금 + 줄어드는 이자. 첫 달 기준으로 표시합니다."
  - bullet: "매달 이자만 내고 만기에 원금을 한 번에 갚습니다."

### 9-3. 빠른 비교표

```html
<div class="lirc-quick-table-wrap">
  <table class="lirc-quick-table">
    <thead><tr>
      <th>변동폭</th><th>적용 금리</th>
      <th class="lirc-col-hide-sm">월 상환액</th>
      <th>월 증감</th><th>총이자 증감</th>
    </tr></thead>
    <tbody id="lircQuickBody"></tbody>
  </table>
  <p class="lirc-table-note">현재 금리 ○○% 기준 · 상환방식 ○○ · <span class="lirc-badge" data-badge="시뮬레이션">시뮬레이션</span></p>
</div>
```

- 모바일(≤720px)에서 `월 상환액` 열 숨김 → 4열. `isCurrent` 행은 `.is-current` 하이라이트.
- 0% 클램프 행은 금리 셀에 `0.00%*` + 표 하단 "* 0% 하한 적용".

### 9-4. 데이터 주입

```astro
<script id="lircConfig" type="application/json" set:html={JSON.stringify({
  defaultInput: LIRC_DEFAULT_INPUT,
  quickDeltas: LIRC_QUICK_DELTAS,
  limits: LIRC_LIMITS,
  presets: LIRC_PRESETS,
  baseRate: LIRC_BASE_RATE,
})} />
<script type="module" src={withBase("/scripts/loan-interest-rate-change-calculator.js")}></script>
```

- `jsonLd`: `WebApplication`(applicationCategory `FinanceApplication`) + `FAQPage` — 갈아타기 계산기와 동일 구조.
- `ogImage="/og/tools/loan-interest-rate-change-calculator.png"`

---

## 10. 결과 UI 상세

### 10-1. KPI 카드

| 순서 | 카드 | 값 | 보조 줄 | 배지 |
|---|---|---|---|---|
| 1 (메인, 강조) | 월 부담 변화 | `monthlyDiff` | "현재 1,432,246원 → 1,389,347원" | 시뮬레이션 |
| 2 | 변경 후 월 상환액 | `next.monthlyPayment` | 방식별 라벨: 원금균등 "첫 달 기준 · 마지막 달 ○원" / 만기일시 "월 이자 · 만기 원금 ○원 별도" | 시뮬레이션 |
| 3 | 남은 기간 총이자 변화 | `totalInterestDiff` | "○원 → ○원" | 시뮬레이션 |
| 4 | 첫 1년 이자 차이 | `annualDiff` | "남은 기간이 12개월 미만이면 남은 기간 기준" | 시뮬레이션 |

### 10-2. 상세 비교 표 (현재 / 변경 후)

| 행 | 현재 | 변경 후 | 차이 |
|---|---|---|---|
| 적용 금리 | 4.00% | 3.75% | −0.25%p |
| 월 상환액(대표) | | | |
| 마지막 달 상환액 | 원금균등·만기일시만 노출 | | |
| 남은 기간 총이자 | | | |
| 총 상환액(원금+이자) | `P + totalInterest` | | |

### 10-3. 오해 방지 배너 (결과 최상단, 항상 노출)

```text
기준금리 변화는 내 대출금리에 같은 폭·같은 날 반영되지 않을 수 있습니다. 아래 결과는 입력한 '내 대출금리' 기준입니다.  [참고]
```

### 10-4. 자연어 결과 메시지 `추정`

```text
[감소] 대출잔액 3억원·남은 30년·원리금균등 기준으로 금리가 연 4.00%에서 3.75%로 0.25%p 내려가면,
       월 상환액은 약 4만 2,899원 줄고 남은 기간 총이자는 약 1,544만원 줄어드는 것으로 계산됩니다.
[증가] … 0.5%p 올라가면, 월 상환액은 약 8만 7,810원 늘고 남은 기간 총이자는 약 3,161만원 늘어나는 것으로 계산됩니다.
       부담이 크다면 대출 갈아타기나 일부 중도상환을 함께 비교해 보세요.
[변화 없음] 금리 변화가 없어 월 상환액과 총이자 변화가 없습니다.
공통 꼬리: 실제 변경 시점과 폭은 대출 약정의 기준지표·변동주기·가산금리에 따라 달라집니다.
```

- 기간 표기: `n % 12 === 0` 이면 "남은 ○년", 아니면 "남은 ○년 ○개월", 12 미만이면 "남은 ○개월".
- 금액 한국식 표기 헬퍼 `fmtKoreanWon(n)`: 1만 미만 "○원", 1억 미만 "○만 ○원", 1억 이상 "○억 ○만원"(만원 단위 반올림).

### 10-5. 최근 기준금리 카드 `공식`

```text
한국은행 기준금리  연 3.00%
최근 변경  2026.08.27  2.75% → 3.00% (인상)
다음 결정회의  2026.10.22(목)          ← JS 계산
* 기준금리는 참고 정보이며 위 계산에 자동 반영되지 않습니다.
출처: 한국은행 · 2026-10-07 확인
```

JS 로직 (`renderBaseRateCard`):
```text
today = 오늘(로컬 날짜 YYYY-MM-DD)
next  = meetings2026 중 date >= today 인 첫 항목 (없으면 "다음 일정 발표 전" + 한국은행 링크)
pending = meetings2026 중 lastReviewedMeeting < date < today 인 항목 존재
if pending: 카드 하단에 경고 줄 노출
  "○월 ○일 결정회의 결과가 아직 이 페이지에 반영되지 않았을 수 있습니다. 최신 기준금리는 한국은행에서 확인하세요."
```

- 회의 당일(date == today)은 "오늘 결정회의(오전 발표)"로 표시하고 pending 경고는 띄우지 않는다.
- 빌드 시점 고정 텍스트(SSR)로는 "다음 결정회의" 를 렌더하지 않는다 — 배포 후 시간이 지나면 낡기 때문. SSR에는 현재 기준금리·최근 변경만 출력하고, 다음 회의 줄은 JS가 채운다(봇에는 노출 안 돼도 무방).

### 10-6. CTA

| 조건 | 강조 CTA |
|---|---|
| `monthlyDiff > 0` (부담 증가) | 1순위 "더 낮은 금리로 갈아타면? → 대출 갈아타기 계산기" |
| `monthlyDiff <= 0` | 1순위 "여유자금으로 일부 갚으면? → 중도상환 수수료 계산기" |

두 카드 모두 항상 노출, 순서와 `is-primary` 클래스만 바뀐다.

---

## 11. JavaScript 설계

```js
// public/scripts/loan-interest-rate-change-calculator.js
// 상환 공식: loan-refinancing-calculator.js 의 calculateMonthlyPayment/TotalInterest 와 동일
(() => {
  const CONFIG = JSON.parse(document.getElementById("lircConfig").textContent);
  const state = { ...CONFIG.defaultInput };

  // utils
  function q(id) {}                 // getElementById
  function parseMoney(v) {}         // 콤마 제거 → Number, NaN → null
  function clamp(v, min, max) {}
  function round3(v) {}             // 금리 소수 셋째 자리 정규화
  function fmtWon(n) {}             // "1,432,246원"
  function fmtSignedWon(n) {}       // "+87,810원" / "−42,899원" / "0원"
  function fmtKoreanWon(n) {}       // "약 1,544만원"
  function fmtRate(r) {}            // "3.75%"
  function fmtDelta(d) {}           // "+0.25%p" / "−0.25%p"
  function fmtPeriod(months) {}     // "30년" / "1년 6개월" / "11개월"

  // calc (§7)
  function annuity(P, R, n) {}
  function equalPrincipal(P, R, n) {}
  function bullet(P, R, n) {}
  function calcSchedule(P, R, n, repay) {}
  function normalize(input) {}      // §7-1 → { P, n, repay, rateNowApplied, rateNewApplied, clampedToZero, delta }
  function computeResult(input) {}  // §7-6 → LircResult
  function computeQuickRows(input, result) {} // §7-7

  // render
  function renderRatePreview() {}
  function renderKpis(result) {}
  function renderDetailTable(result) {}
  function renderQuickTable(rows) {}
  function renderMessage(result) {}
  function renderBaseRateCard() {}  // §10-5, 최초 1회
  function renderCtaOrder(result) {}
  function renderInvalid(message) {} // 잔액·기간 비정상 시 결과 영역 "값을 입력하세요" + KPI "-"
  function render() {}

  // input
  function readInputs() {}          // DOM → state (모드별 delta/target 동기화 포함)
  function writeInputs() {}         // state → DOM
  function setRateMode(mode) {}
  function setRepay(repay) {}
  function applyDeltaChip(d) {}     // delta 모드로 전환 + rateDelta 설정
  function applyPreset(id) {}       // §6-3 규칙
  function resetAll() {}
  function syncUrl() {}
  function loadFromUrl() {}
  function copyLink() {}
  function bindMoneyInput(input) {}

  loadFromUrl();
  writeInputs();
  renderBaseRateCard();
  render();
})();
```

### 11-1. 이벤트

| 대상 | 이벤트 | 동작 |
|---|---|---|
| 모든 number/text input | `input` | `readInputs → render → syncUrl` (디바운스 불필요, 계산량 작음) |
| 잔액 input | focus/blur | 콤마 제거/포맷 |
| `[data-rate-mode]` | click | `setRateMode` |
| `.lirc-chip[data-delta]` | click | `applyDeltaChip` — 활성 칩 `is-active` |
| `[data-repay]` | click | `setRepay` |
| `[data-preset-id]` | click | `applyPreset` |
| 비교표 행 | click | 해당 변동폭을 `applyDeltaChip` 로 적용(편의 기능) |
| `#lircResetBtn` | click | `resetAll` + URL 파라미터 제거 |
| `#lircCopyLinkBtn` | click | 현재 URL 클립보드 복사 + "링크를 복사했어요" 토스트 |

### 11-2. URL 파라미터

| 키 | 값 | 예 |
|---|---|---|
| `b` | 잔액(원, 정수) | `300000000` |
| `r0` | 현재 금리 | `4` |
| `mode` | `delta` / `target` | `delta` |
| `d` | 변동폭(delta 모드) | `-0.25` |
| `r1` | 변경 금리(target 모드) | `3.75` |
| `m` | 남은 개월 | `360` |
| `repay` | `annuity` / `equalPrincipal` / `bullet` | `annuity` |

- 기본값과 모두 같으면 쿼리스트링을 비운다.
- `loadFromUrl` 는 숫자 파싱 실패·범위 밖 값을 기본값으로 대체하고, `repay`·`mode` 는 화이트리스트 검사.

### 11-3. 오류 상태

| 조건 | 처리 |
|---|---|
| 잔액 빈 값/0/NaN | 결과 영역 `renderInvalid("대출잔액을 입력하세요")` |
| 기간 0개월 | `renderInvalid("남은 기간을 1개월 이상 입력하세요")` |
| 금리 범위 밖 | 입력값을 clamp 하고 필드 하단 small 문구 "0~20% 범위로 조정했어요" |
| 변경 금리 < 0 | 0%로 계산 + 미리보기 줄에 "0% 하한 적용" |

결과 영역 어디에도 `NaN`, `Infinity`, `-0원` 이 노출되면 안 된다.

---

## 12. 등록 작업

### 12-1. `src/data/tools.ts` (order 14.53 — 갈아타기 14.52와 실손 14.54 사이, 현재 빈 값 확인됨)

```ts
{
  slug: "loan-interest-rate-change-calculator",
  title: "대출금리 변동 계산기 2026",
  description: "대출잔액·현재 금리·변경 후 금리를 입력하면 월 상환액과 총이자 변화를 계산합니다. 0.25%p·0.5%p·1%p 빠른 비교표 제공.",
  order: 14.53,
  eyebrow: "대출이자 계산",
  category: "realestate",
  iframeReady: true,
  badges: ["신규", "대출", "금리"],
  previewStats: [
    { label: "0.25%p 변동", value: "월 약 4.3만원", context: "3억·30년·원리금균등" },
    { label: "결과", value: "월 부담·총이자 증감" },
  ],
},
```

### 12-2. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/loan-interest-rate-change-calculator/</loc>
  <lastmod>{배포일 YYYY-MM-DD}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.85</priority>
</url>
```

### 12-3. 기타

- `src/styles/app.scss`: `@use 'scss/pages/loan-interest-rate-change-calculator';`
- `src/pages/index.astro` 카테고리 맵: `"loan-interest-rate-change-calculator": "대출·금융",`
- `npm run og:generate` 로 OG 이미지 생성 후 `public/og/tools/` 존재 확인
- 기존 갈아타기·중도상환 계산기의 `related` 에 이 계산기 링크 추가는 **이번 범위 외**(별도 소규모 작업으로 처리, 운영 페이지 수정 최소화)

---

## 13. SCSS 설계 (핵심 발췌)

```scss
.lirc-page {
  .lirc-form-grid { display: grid; gap: 12px; }
  .lirc-field {
    display: grid; gap: 6px;
    input { width: 100%; min-height: 44px; }
    small { color: var(--color-text-subtle, #6b7280); font-size: 0.78rem; }
  }

  .lirc-mode-toggle, .lirc-repay-toggle { display: flex; gap: 6px; flex-wrap: wrap; }
  .lirc-pill-btn { min-height: 40px; border-radius: 999px; &.is-active { font-weight: 800; } }

  .lirc-chip-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .lirc-chip { min-height: 40px; border-radius: 10px; &.is-active { outline: 2px solid currentColor; } }

  .lirc-myth-banner {
    border: 1px solid #fde68a; background: #fffbeb; color: #92400e;
    border-radius: 12px; padding: 12px 14px; font-size: 0.86rem;
  }

  .lirc-kpi-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .lirc-kpi--main { grid-column: 1 / -1; }
  [data-sign="up"]   strong { color: #dc2626; }
  [data-sign="down"] strong { color: #1a56db; }
  [data-sign="zero"] strong { color: #6b7280; }

  .lirc-quick-table-wrap { margin-top: 20px; }
  .lirc-quick-table {
    width: 100%; border-collapse: collapse; font-size: 0.84rem; font-variant-numeric: tabular-nums;
    th, td { padding: 10px 8px; border-bottom: 1px solid #e8ede9; text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    tr.is-current { background: #f0f7ff; font-weight: 800; }
    tbody tr { cursor: pointer; }
  }

  .lirc-badge {
    display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 700;
    &[data-badge="공식"]       { background: #e0f2fe; color: #075985; }
    &[data-badge="참고"]       { background: #f3f4f6; color: #374151; }
    &[data-badge="시뮬레이션"] { background: #ede9fe; color: #5b21b6; }
    &[data-badge="추정"]       { background: #fef3c7; color: #92400e; }
  }

  .lirc-structure-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .lirc-cta-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }

  @media (max-width: 720px) {
    .lirc-kpi-grid, .lirc-structure-grid, .lirc-cta-grid { grid-template-columns: 1fr; }
    .lirc-col-hide-sm { display: none; }
    .lirc-quick-table { font-size: 0.8rem; th, td { padding: 8px 6px; } }
  }
}
```

- 색상 하드코딩은 기존 `_loan-refinancing-calculator.scss` 수준과 맞춘다. 토큰이 있으면 `_tokens.scss` 변수 우선.

---

## 14. SEO 설계

```text
title: 기준금리 변동 대출이자 계산기 2026 | 월 상환액 바로 계산   (35자)
description: 대출잔액·현재 금리·변경 후 금리를 입력하면 월 상환액과 남은 기간 총이자 변화를 바로 계산. 0.25%p·0.5%p·1%p 금리 변동 빠른 비교표 포함.   (86자)
H1: 기준금리·대출금리 변동 계산기 2026
canonical: https://bigyocalc.com/tools/loan-interest-rate-change-calculator/
```

키워드: 대출이자 계산기, 금리 0.25 오르면 대출이자, 기준금리 인상 대출이자, 기준금리 인하 대출이자, 변동금리 대출 이자 변화, 원리금균등 원금균등 이자 차이, 주택담보대출 금리 변동 월 상환액

---

## 15. SeoContent 초안

> `docs/GOOGLE_SEO_RULES.md` 기준(intro **5단락·800자 이상**, FAQ 5개·답변 3문장 이상)이 기획 단계의 CONTENT_GUIDE 기준(4단락)보다 엄격하므로 **5단락으로 확장**한다. intro는 SSR 텍스트이므로 날짜 의존 표현은 "2026년 8월 기준 3.00%"처럼 시점을 명시한다.

introTitle: `기준금리·대출금리 변동 계산기 — 결과 읽는 법`

### intro

1. 한국은행 금융통화위원회가 기준금리를 결정하는 날이나 은행에서 "대출금리가 변경됩니다"라는 안내를 받은 날, 가장 먼저 궁금한 것은 내 월 납입액이 얼마나 바뀌는지입니다. 변동금리 주택담보대출을 갚고 있는 직장인, 6개월·12개월마다 금리 재산정을 앞둔 전세자금대출 차주, 만기 연장을 앞둔 신용대출 이용자 모두 같은 질문을 합니다. 이 계산기는 대출잔액·남은 기간·상환방식은 그대로 두고 금리만 바꿨을 때 월 상환액과 남은 기간 총이자가 얼마나 달라지는지 보여줍니다.
2. 계산은 상환방식별 표준 공식을 사용합니다. 원리금균등은 매달 같은 금액을 내는 연금 공식으로, 원금균등은 원금을 남은 개월 수로 나누고 남은 원금에 이자를 붙이는 방식으로, 만기일시상환은 매달 이자만 내고 만기에 원금을 한 번에 갚는 방식으로 계산합니다. 월 이율은 연이율을 12로 나눈 값이며, 바뀐 금리가 남은 기간 동안 그대로 유지된다고 가정해 현재 금리와 나란히 비교합니다.
3. 같은 0.25%p라도 상환방식에 따라 체감이 다릅니다. 대출잔액 3억원·남은 30년·현재 금리 4.00% 기준으로 0.25%p가 내려가면 원리금균등은 월 약 4만 2,899원, 원금균등 첫 달과 만기일시는 월 6만 2,500원이 줄고, 30년 총이자는 원리금균등 기준 약 1,544만원 줄어듭니다. 반대로 0.5%p가 오르면 원리금균등 월 상환액은 약 8만 7,810원 늘어 같은 폭 인하 때 줄어드는 금액(약 8만 5,112원)보다 조금 큽니다.
4. 빠른 비교표에서 ±0.25%p, ±0.5%p, ±1.0%p 결과를 한 번에 보면 금리 변화에 내 대출이 얼마나 민감한지 알 수 있습니다. 1%p만 올라도 3억원·30년 원리금균등 대출은 월 약 17만 8천원, 30년 총이자는 약 6,416만원 늘어납니다. 월 부담 증가가 가계 예산을 압박하는 수준이라면 더 낮은 금리 상품으로 갈아타는 대환대출이나 여유자금으로 원금 일부를 갚는 중도상환을 함께 비교해 보는 것이 좋습니다.
5. 한국은행 기준금리는 2026년 8월 27일 2.75%에서 3.00%로 인상됐지만, 기준금리가 바뀐다고 내 대출금리가 같은 폭·같은 날 바뀌지는 않습니다. 변동금리는 COFIX·금융채 같은 기준지표에 가산금리를 더하고 우대금리를 뺀 구조이며, 약정된 변동주기가 돌아와야 재산정되고 고정금리 기간에는 변하지 않습니다. 이 계산기는 기준금리를 대출금리에 자동 반영하지 않으며, 일할 계산·거치기간·중도 일부상환을 반영하지 않는 참고용 시뮬레이션이므로 정확한 금액은 대출 은행에서 확인하세요.

> 구현 후 5단락 합계 글자 수를 측정해 800자 이상인지 QA에서 확인(현 초안 기준 충족 예상).

### inputPoints

- 금리 변동 전후 월 상환액·남은 기간 총이자를 나란히 비교
- ±0.25%p·0.5%p·1.0%p 빠른 비교표로 금리 민감도 확인
- 원리금균등·원금균등·만기일시 상환방식별 차이 확인

### criteria

- 월 이율 = 연이율 ÷ 12, 변경 금리는 즉시 적용·남은 기간 유지 가정 `시뮬레이션`
- 기준금리는 계산에 자동 반영하지 않음(사용자 입력 금리 기준)
- 기준금리·결정회의 일정: 한국은행 공시(2026-10-07 확인) `공식`
- 거치기간·중도 일부상환·일할 이자 계산 미반영

### FAQ (`LIRC_FAQ`, 7개)

1. **기준금리가 0.25%p 내리면 제 대출금리도 바로 0.25%p 내려가나요?** — 아닙니다. 변동금리 대출은 COFIX나 금융채 금리 같은 기준지표에 가산금리를 더해 정해지며, 기준지표는 기준금리와 같은 폭으로 움직이지 않을 수 있습니다. 또한 약정한 변동주기(예: 6개월)가 돌아와야 금리가 재산정되므로 반영 시점도 사람마다 다릅니다. 은행 앱이나 약정서에서 다음 금리 변경일을 먼저 확인하세요.
2. **고정금리 대출도 기준금리에 따라 이자가 바뀌나요?** — 고정금리 기간 동안에는 약정 금리가 유지되어 기준금리 변화와 무관합니다. 혼합형은 고정 기간이 끝나고 변동금리로 전환되는 시점부터 영향을 받습니다. 전환 시점이 가까운 경우 이 계산기에 예상 변동금리를 넣어 미리 부담을 확인할 수 있습니다.
3. **원리금균등과 원금균등 중 어느 쪽이 금리 변화에 더 민감한가요?** — 첫 달 월 상환액 변화는 남은 원금 전체에 금리 차이가 붙는 원금균등이 더 크게 보입니다. 다만 원금균등은 원금이 빠르게 줄어 남은 기간 총이자 증감은 원리금균등보다 작습니다. 매달 이자만 내는 만기일시상환은 금리 변화가 월 부담과 총이자에 가장 직접적으로 반영됩니다.
4. **금리 인상과 인하의 효과가 같은 크기인가요?** — 원금균등과 만기일시상환은 같은 폭이면 증가액과 감소액이 같습니다. 원리금균등은 같은 폭이라도 인상 시 늘어나는 금액이 인하 시 줄어드는 금액보다 조금 큽니다. 3억원·30년·4% 기준 +0.5%p는 월 약 8만 7,810원 증가, −0.5%p는 약 8만 5,112원 감소로 계산됩니다.
5. **다음 기준금리 결정은 언제인가요?** — 한국은행 공식 일정상 2026년 남은 통화정책방향 결정회의는 10월 22일(목)과 11월 26일(목)입니다. 2026년 8월 27일 결정 기준 현재 기준금리는 연 3.00%입니다. 결정 결과는 회의 당일 오전 한국은행 홈페이지에 공개됩니다.
6. **계산 결과가 은행 안내 금액과 조금 다른 이유는 무엇인가요?** — 은행은 실제 일수 기준으로 이자를 계산하고 원 단위 절사 규칙을 적용하지만, 이 계산기는 연이율을 12로 나눈 월 이율로 계산합니다. 거치기간, 중도 일부상환, 우대금리 변경도 반영하지 않습니다. 따라서 수천 원 단위 차이는 생길 수 있으며 정확한 금액은 대출 은행에서 확인해야 합니다.
7. **금리가 올라 부담이 커지면 어떻게 해야 하나요?** — 더 낮은 금리 상품으로 갈아타는 대환대출, 여유자금으로 원금 일부를 갚는 중도상환을 검토할 수 있습니다. 두 방법 모두 중도상환수수료와 부대비용을 함께 따져야 실제 이득을 알 수 있습니다. 아래 관련 계산기에서 이어서 비교해 보세요.

> FAQ 5번은 날짜 의존 답변이므로 §16 갱신 절차의 대상이다.

---

## 16. 관련 링크 (`LIRC_RELATED_LINKS`, 4개)

| href | label | description |
|---|---|---|
| `/tools/loan-refinancing-calculator/` | 대출 갈아타기 계산기 | 금리 부담이 커졌다면 신규 대출로 바꿀 때 손익분기 확인 |
| `/tools/mortgage-prepayment-penalty/` | 중도상환 수수료 계산기 | 원금 일부 상환 시 수수료 vs 이자 절감 비교 |
| `/tools/income-home-affordability/` | 소득 대비 집값 부담 계산기 | 금리가 DSR·대출 가능액에 미치는 영향 |
| `/reports/2026-salaried-loan-comparison/` | 2026 직장인 대출 완전 비교 | 신용·주담대·전세대출 금리 구조 비교 |

---

## 17. 기준금리 결정 후 갱신 절차 (운영)

결정회의(10/22, 11/26) 당일~익일에 아래만 수정한다. 계산 로직·UI는 건드리지 않는다.

1. 한국은행 통화정책방향 원문에서 결정 내용 확인
2. `LIRC_BASE_RATE` 수정
   - 변경 시: `current`, `lastChange`, `history` 맨 앞에 추가(최대 3건 유지)
   - 동결이어도: `lastReviewedMeeting` 을 해당 회의일로 갱신
   - `checkedAt` 갱신
3. intro 5단락의 "2026년 8월 27일 … 3.00%" 문장, FAQ 5번 문장 갱신(변경 시)
4. `LIRC_META.updatedAt`, sitemap `lastmod` 갱신
5. `npm run build` → 배포 체크리스트

> 갱신을 놓쳐도 §10-5 pending 경고가 자동 노출되어 낡은 정보가 '최신'처럼 보이지 않는다.

---

## 18. 구현 순서

1. `src/data/loanInterestRateChangeCalculator.ts` — 타입·상수·FAQ·링크 (§5, §6, §15, §16)
2. `_loan-interest-rate-change-calculator.scss` + `app.scss` `@use`
3. `loan-interest-rate-change-calculator.astro` — 슬롯 구조·마크업·JSON 주입·jsonLd (§9)
4. `public/scripts/loan-interest-rate-change-calculator.js` — 계산 함수 먼저 작성 후 §8 값으로 콘솔 검증 → 렌더·이벤트·URL (§7, §10, §11)
5. 등록: `tools.ts`, `index.astro` 맵, `sitemap.xml` (§12)
6. `npm run og:generate`
7. `npm run build` → dist 라우트 확인 → QA(§19) → `DEPLOY_CHECKLIST.md`
8. 기획 문서 진행 상태 갱신

---

## 19. QA 체크리스트

계산 정확도
- [ ] §8 V1~V3 9개 셀(3방식×3케이스) 월 상환액·월 증감·총이자 증감이 원 단위로 일치
- [ ] 빠른 비교표 6행 값이 §8 기대값과 일치, 현재 변동폭 행 하이라이트
- [ ] 원금균등 총이자 닫힌식 결과 = 루프 합산 결과(콘솔 검증, 3억·360개월·4%: 180,500,000)
- [ ] E1 금리 변화 없음 → 모든 증감 `0원`, `data-sign="zero"`, "변화 없음" 메시지
- [ ] E2 1개월 → 세 방식 이자 −62,500, 만기일시 "만기 원금 3억원 별도" 표기
- [ ] E3 12개월 → 원리금균등 25,544,971 → 25,510,717, 총이자 −411,048
- [ ] E4 100만원 → 원리금균등 4,774 → 4,631, `-0원`·NaN 없음
- [ ] E5 만기일시 4.0→4.5 → 월 이자 +125,000, 월 상환액에 원금 미포함
- [ ] E6 금리 0% → 원리금균등 월 833,333, 총이자 0, 0 나누기 오류 없음
- [ ] E7 0.50% −1.00%p → 0% 적용 + "0% 하한 적용" 안내
- [ ] E8 잔액 0/기간 0/빈 값 → 오류 상태, NaN·Infinity 미노출

입력·상태
- [ ] delta↔target 모드 전환 시 금리 값 동기화(4.00, −0.25 ↔ 3.75)
- [ ] 변동폭 칩 클릭 → delta 모드 전환 + 값 반영
- [ ] 프리셋 적용 시 변동폭 유지, 잔액·금리·기간·방식만 변경
- [ ] URL 파라미터 복원·공유 링크 복사, 잘못된 파라미터 → 기본값
- [ ] 초기화 버튼 → 기본값 + 쿼리스트링 제거

콘텐츠·정책
- [ ] 기준금리 값이 어떤 계산에도 쓰이지 않음(코드 검색으로 확인)
- [ ] 오해 방지 문구 3곳(InfoNotice, 결과 배너, FAQ 1번) 노출
- [ ] 배지 4종 외 다른 배지 텍스트 없음, KPI·비교표에 `시뮬레이션`, 기준금리 카드 `공식`, 설명 카드 `참고`, 자연어 메시지 `추정`
- [ ] 기준금리 카드: 시스템 날짜를 2026-10-23으로 바꿨을 때 pending 경고 노출, 10-22 당일 "오늘 결정회의" 표시
- [ ] intro 5단락·800자 이상, FAQ 7개·각 3문장 이상, `SeoContent` 가 `<Fragment slot="seo">` 안
- [ ] Title 50자 이하·2026 포함, Description 80~120자

레이아웃
- [ ] 375px에서 가로 스크롤 없음, 비교표 4열 축약
- [ ] 터치 타깃 40px 이상
- [ ] 다크/라이트 기존 페이지와 동일 톤

등록·빌드
- [ ] `tools.ts`(order 14.53), `app.scss`, `sitemap.xml`, `index.astro` 맵 등록
- [ ] OG 이미지 생성
- [ ] `npm run build` 성공, `dist/tools/loan-interest-rate-change-calculator/index.html` 존재

---

## 20. 진행 상태

| 단계 | 상태 |
|---|---|
| 기획 | 완료 (`docs/plan/202610/loan-interest-rate-change-calculator.md`) |
| 설계 | 완료 (본 문서) |
| 구현 | 완료 (2026-10-07, 미커밋). 전용 OG 생성·연결 완료. 최종 배포 점검은 `docs/qa/202610/pre-deploy-three-calculators.md` 참조 |
| 테스트·QA | 로컬 빌드·브라우저 검증 완료 (V1~V3, E1~E8, URL 복원, 기준금리 카드 날짜 분기, 모바일 375px) |
| 배포 | 미착수 — 10/22 결정회의 이전 목표 |
