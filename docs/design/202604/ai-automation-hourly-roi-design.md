# AI 업무 자동화 시급 계산기 — 설계 문서

> 기획 원문: `docs/plan/202604/ai-automation-hourly-roi.md`
> 작성일: 2026-04-18
> 구현 기준: Codex/Claude가 이 문서를 보고 바로 계산기 페이지 구현에 착수할 수 있는 수준
> 참고 계산기: `ai-stack-cost-calculator`, `bonus-simulator`, `fire-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/ai-automation-hourly-roi.md`
- 구현 대상: `AI 업무 자동화 시급 계산기`
- 슬러그: `ai-automation-hourly-roi`
- URL: `/tools/ai-automation-hourly-roi/`
- 콘텐츠 유형: 인터랙티브 계산기 (`/tools/`)
- 카테고리: `AI·생산성`

### 1-2. 페이지 정의

> AI 툴 구독료가 실제로 본전 이상을 만드는지,
> 월급·반복업무 시간·절감 시간을 입력해
> 실질 시급 상승, 월 순효과, 투자 회수 기간을 계산해주는 생산성 계산기

### 1-3. 구현 원칙

- 결과는 `구독료 대비 시간 절감 효과`를 숫자로 보여주는 의사결정형 계산기여야 한다.
- 개인 기준과 팀 기준을 같은 계산기 안에서 처리하되, UI는 복잡해 보이지 않게 유지한다.
- 절감 시간은 과대추정하기 쉽기 때문에, 보수적 입력을 유도하는 안내를 반드시 넣는다.
- 법률·세무 판단이 아니라 `생산성 추정`이라는 점을 상단과 결과 하단에 명확히 고지한다.
- 저장·공유 가능한 URL 파라미터를 제공한다.

---

## 2. 파일 구조

```text
src/
  data/
    aiAutomationHourlyRoi.ts
  pages/
    tools/
      ai-automation-hourly-roi.astro

public/
  scripts/
    ai-automation-hourly-roi.js
  og/
    tools/
      ai-automation-hourly-roi.png

src/styles/scss/pages/
  _ai-automation-hourly-roi.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
- `src/pages/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 레이아웃 및 쉘

### 3-1. 공통 패턴

- `BaseLayout`
- `SiteHeader`
- `SimpleToolShell`
- `SeoContent`

### 3-2. 권장 설정

```astro
<SimpleToolShell
  calculatorId="ai-automation-hourly-roi"
  pageClass="ai-hourly-roi-page"
  resultFirst={true}
>
```

### 3-3. 이유

- 입력보다 결과 관심도가 높은 계산기이므로 `resultFirst={true}`를 기본 적용한다.
- 모바일에서는 `결과 요약 → 입력 → 상세 설명` 흐름이 더 자연스럽다.
- 사이드 패널에는 입력/프리셋/가정 설명을 넣고, 메인 영역에는 KPI와 시각화 결과를 둔다.

---

## 4. 데이터 파일 설계 (`src/data/aiAutomationHourlyRoi.ts`)

### 4-1. 타입 정의

```ts
export type SalaryMode = "gross" | "net";
export type RoiMode = "personal" | "team";
export type ProductivityMultiplier = 1 | 1.2 | 1.5;

export interface RoiPreset {
  id: string;
  label: string;
  description: string;
  monthlySalary: number;
  monthlyWorkHours: number;
  weeklyRepeatHours: number;
  weeklySavedHours: number;
  monthlyToolCost: number;
  users: number;
  multiplier: ProductivityMultiplier;
  annualWorkingMonths: number;
  mode: RoiMode;
}

export interface RoiFaqItem {
  question: string;
  answer: string;
}

export interface RoiRelatedLink {
  href: string;
  label: string;
}
```

### 4-2. 메타 상수

```ts
export const AI_HOURLY_ROI_META = {
  slug: "ai-automation-hourly-roi",
  title: "AI 업무 자동화 시급 계산기",
  subtitle:
    "월급, 반복업무 시간, AI 툴 구독료, 절감 시간을 입력하면 AI 도입 전후 실질 시급, 월 순효과, 투자 회수 기간을 바로 계산합니다.",
  updatedAt: "2026년 4월",
  caution:
    "결과는 사용자가 입력한 절감 시간과 생산성 배수를 바탕으로 한 추정치입니다. 실제 효과는 업무 성격과 사용 습관에 따라 달라질 수 있습니다.",
  defaultMonthlyWorkHours: 209,
  defaultAnnualWorkingMonths: 12,
  weeksPerMonth: 4.345,
};
```

### 4-3. 기본 상태

```ts
export const AI_HOURLY_ROI_DEFAULT_STATE = {
  salaryMode: "gross" as SalaryMode,
  mode: "personal" as RoiMode,
  monthlySalary: 4000000,
  monthlyWorkHours: 209,
  weeklyRepeatHours: 10,
  weeklySavedHours: 4,
  monthlyToolCost: 50000,
  users: 1,
  multiplier: 1.2 as ProductivityMultiplier,
  annualWorkingMonths: 12,
};
```

### 4-4. 프리셋 데이터

최소 4종 제공:

```ts
export const AI_HOURLY_ROI_PRESETS: RoiPreset[] = [
  {
    id: "office-chatgpt",
    label: "직장인 + ChatGPT Plus",
    description: "문서 초안, 회의 요약, 메일 작성 자동화",
    monthlySalary: 4000000,
    monthlyWorkHours: 209,
    weeklyRepeatHours: 8,
    weeklySavedHours: 3,
    monthlyToolCost: 29000,
    users: 1,
    multiplier: 1.2,
    annualWorkingMonths: 12,
    mode: "personal",
  },
  {
    id: "freelancer-stack",
    label: "프리랜서 AI 스택",
    description: "제안서, 리서치, 반복 커뮤니케이션 자동화",
    monthlySalary: 5500000,
    monthlyWorkHours: 180,
    weeklyRepeatHours: 12,
    weeklySavedHours: 5,
    monthlyToolCost: 80000,
    users: 1,
    multiplier: 1.5,
    annualWorkingMonths: 12,
    mode: "personal",
  },
  {
    id: "team-lead",
    label: "스타트업 팀장",
    description: "팀 단위 AI 구독 도입 효과 검토",
    monthlySalary: 4500000,
    monthlyWorkHours: 209,
    weeklyRepeatHours: 6,
    weeklySavedHours: 2,
    monthlyToolCost: 300000,
    users: 5,
    multiplier: 1.2,
    annualWorkingMonths: 12,
    mode: "team",
  },
  {
    id: "ops-zapier",
    label: "운영 자동화 중심",
    description: "Zapier, Notion AI, ChatGPT 조합 검토",
    monthlySalary: 3800000,
    monthlyWorkHours: 209,
    weeklyRepeatHours: 14,
    weeklySavedHours: 6,
    monthlyToolCost: 120000,
    users: 2,
    multiplier: 1.2,
    annualWorkingMonths: 12,
    mode: "team",
  },
];
```

### 4-5. FAQ / 관련 링크

- `AI_HOURLY_ROI_FAQ`
- `AI_HOURLY_ROI_RELATED_LINKS`
- `AI_HOURLY_ROI_NEXT_CONTENT`

관련 링크는 최소 아래를 포함:

- `/tools/ai-stack-cost-calculator/`
- `/tools/fire-calculator/`
- `/tools/retirement/`
- 필요 시 AI 관련 리포트

---

## 5. 계산 로직

### 5-1. 기본 공식

#### 1) 현재 기본 시급

```text
currentHourlyRate = monthlySalary / monthlyWorkHours
```

#### 2) 월 반복업무 시간

```text
monthlyRepeatHours = weeklyRepeatHours × 4.345
```

#### 3) 월 절감 시간

```text
monthlySavedHours = weeklySavedHours × 4.345
```

#### 4) 개인 월 절감 환산 금액

```text
personalMonthlySavedValue = currentHourlyRate × monthlySavedHours × multiplier
```

#### 5) 팀 월 절감 환산 금액

```text
totalMonthlySavedValue = personalMonthlySavedValue × users
```

#### 6) 월 순효과 금액

```text
monthlyNetEffect = totalMonthlySavedValue - monthlyToolCost
```

#### 7) 투자 회수 기간

```text
paybackMonths = monthlyToolCost / totalMonthlySavedValue
```

주의:

- `totalMonthlySavedValue <= 0` 이면 `회수 불가`
- `monthlyToolCost = 0` 이면 `즉시 회수` 또는 `0개월`

#### 8) 연간 생산성 이득 금액

```text
annualNetEffect = monthlyNetEffect × annualWorkingMonths
```

#### 9) AI 도입 후 실질 시급

```text
effectiveHourlyAfterAi = (monthlySalary × users + monthlyNetEffect) / (monthlyWorkHours × users)
```

개인 모드에서는 `users = 1`로 계산한다.

#### 10) 시급 상승액 / 상승률

```text
hourlyIncrease = effectiveHourlyAfterAi - currentHourlyRate
hourlyIncreaseRate = hourlyIncrease / currentHourlyRate
```

### 5-2. 해석 기준

| 조건 | 상태 라벨 | 해석 |
| --- | --- | --- |
| `monthlyNetEffect > 0` and `paybackMonths < 1` | 매우 효율적 | 현재 입력 기준으로 구독료 회수 속도가 매우 빠름 |
| `monthlyNetEffect > 0` and `1 <= paybackMonths <= 3` | 검토 가치 높음 | 비용 대비 생산성 이득이 의미 있음 |
| `monthlyNetEffect > 0` and `paybackMonths > 3` | 보수적 검토 | 효과는 있으나 절감 시간 가정 재점검 필요 |
| `monthlyNetEffect <= 0` | 본전 미달 | 현재 입력 기준으로는 비용 대비 효과가 부족 |

### 5-3. Validation 규칙

- `monthlySalary >= 0`
- `monthlyWorkHours >= 1`
- `weeklyRepeatHours >= 0`
- `weeklySavedHours >= 0`
- `weeklySavedHours <= weeklyRepeatHours`
- `monthlyToolCost >= 0`
- `users >= 1`
- `annualWorkingMonths`는 `1~12`

에러 문구 예시:

- `절감 시간은 반복업무 시간보다 클 수 없습니다.`
- `월 근무시간은 1시간 이상이어야 합니다.`

---

## 6. 페이지 구성 (`src/pages/tools/ai-automation-hourly-roi.astro`)

### 6-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. 입력 패널
4. 결과 KPI 카드
5. 전후 비교 바 차트
6. 회수 기간 / 누적 효과 시각화
7. 결과 해석 카드
8. 프리셋 시나리오 카드
9. 계산 기준 설명
10. FAQ
11. `SeoContent`

### 6-2. Hero

- eyebrow: `AI 생산성 계산기`
- title: `AI 업무 자동화 시급 계산기`
- description: `ChatGPT, Notion AI, Zapier 같은 툴이 내 시간을 실제로 얼마나 돈으로 바꾸는지 계산합니다.`
- badges:
  - `시급 상승`
  - `ROI`
  - `투자 회수 기간`
  - `팀 도입 검토`

### 6-3. InfoNotice

필수 안내 3줄:

- 절감 시간과 생산성 배수는 사용자가 입력한 추정값 기반
- 세전/세후 월급은 참고용 기준값이며 실수령 계산기가 아님
- 비정량 효과는 별도이며, 이 계산기는 시간 가치 환산 중심

### 6-4. SimpleToolShell 슬롯 권장 구조

#### `slot="hero"`

- Hero
- 요약 칩 3개

#### `slot="actions"`

- 입력 폼 전체
- 프리셋 버튼
- 팀/개인 모드 토글

#### `slot="results"`

- KPI 6장
- 바 차트 1개
- 누적 효과 차트 1개
- 해석 카드

#### `slot="aside"`

- 계산 기준 요약
- 사용 팁
- 관련 링크 CTA

---

## 7. 입력 UI 설계

### 7-1. 필수 입력 항목

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| 현재 월급 | number | 4,000,000 | 세전/세후 모드 선택 |
| 월 근무시간 | number | 209 | 주 40시간 기준 기본값 |
| 주간 반복업무 시간 | number | 10 | 수작업 기준 |
| AI 도입 후 주간 절감 시간 | number | 4 | 줄어드는 예상 시간 |
| AI 툴 월 구독료 합계 | number | 50,000 | 합산값 직접 입력 |
| 사용자 수 | number | 1 | 팀 모드용 |
| 생산성 환산 배수 | segmented | 120% | `100%`, `120%`, `150%` |
| 연간 근무 개월 수 | number | 12 | 연간 효과 계산용 |

### 7-2. 보조 UI

- `세전 / 세후` 토글
- `개인 기준 / 팀 기준` 토글
- 프리셋 칩 버튼 4개
- 절감 시간 입력 아래 helper text:
  - `처음에는 기대값보다 낮게 넣는 편이 현실적입니다.`

### 7-3. 입력 UX

- 숫자 input + 빠른 증감 버튼
- 모바일에서는 입력 패널을 아코디언처럼 접을 수 있어도 좋지만 MVP에서는 고정 표시
- URL 쿼리 반영:
  - `salary`
  - `hours`
  - `repeat`
  - `saved`
  - `cost`
  - `users`
  - `multiplier`
  - `mode`
  - `salaryMode`
  - `months`

---

## 8. 결과 영역 설계

### 8-1. KPI 카드 6개

1. 현재 시급
2. AI 도입 후 실질 시급
3. 월 절감 환산 금액
4. 월 순효과 금액
5. 투자 회수 기간
6. 연간 생산성 이득 금액

### 8-2. 결과 문구 템플릿

#### 긍정적 결과

```text
현재 입력 기준으로 월 {monthlyNetEffect}원의 순효과가 발생합니다.
구독료는 약 {paybackMonths}개월이면 회수 가능하며, 연간 기준 {annualNetEffect}원의 생산성 이득이 예상됩니다.
```

#### 보수적 결과

```text
현재 입력 기준으로는 구독료 대비 효과가 크지 않습니다.
절감 시간을 더 보수적으로 조정하거나, 실제 자동화 대상 업무를 다시 좁혀보는 편이 좋습니다.
```

### 8-3. 차트 구성

#### 차트 A: 전후 시급 비교

- 형태: bar
- 데이터:
  - 현재 시급
  - AI 도입 후 실질 시급

#### 차트 B: 누적 회수 효과

- 형태: line 또는 bar
- X축:
  - 1개월
  - 3개월
  - 6개월
  - 12개월
- Y축:
  - 누적 순효과 금액

### 8-4. 해석 카드

카드 3종:

- `ROI 상태`
- `주의할 입력값`
- `다음 액션`

예시:

- `절감 시간 2시간만 줄어도 회수 기간이 크게 달라집니다.`
- `팀 단위 도입이면 실제 사용률이 동일한지 별도 확인이 필요합니다.`

---

## 9. JavaScript 설계 (`public/scripts/ai-automation-hourly-roi.js`)

### 9-1. 역할

- 입력값 읽기
- validation 수행
- 계산 결과 산출
- DOM 렌더링
- URL 쿼리 동기화
- Chart.js 인스턴스 생성/갱신
- 프리셋 적용

### 9-2. 권장 함수 구조

```js
function clampNumber(value, min, max) {}
function readState() {}
function validateState(state) {}
function calculateRoi(state) {}
function formatWon(value) {}
function formatHours(value) {}
function formatMonths(value) {}
function getInterpretation(result) {}
function renderKpis(result) {}
function renderNarrative(result) {}
function renderCharts(result) {}
function syncQuery(state) {}
function applyPreset(presetId) {}
function boot() {}
```

### 9-3. 계산 결과 객체 예시

```js
{
  currentHourlyRate: 19138,
  monthlyRepeatHours: 43.45,
  monthlySavedHours: 17.38,
  totalMonthlySavedValue: 398000,
  monthlyNetEffect: 348000,
  paybackMonths: 0.13,
  annualNetEffect: 4176000,
  effectiveHourlyAfterAi: 20800,
  hourlyIncrease: 1662,
  hourlyIncreaseRate: 0.0868,
  interpretation: "very-effective"
}
```

---

## 10. 스타일 설계 (`_ai-automation-hourly-roi.scss`)

### 10-1. prefix

- `aihroi-`

### 10-2. 시각 톤

- AI/생산성 계산기답게 `차분한 청록 + 크림 배경` 계열
- 숫자 KPI는 강하게, 입력 패널은 편안하게
- ROI 상태 카드에는 `좋음/보수적/주의` 톤 차이를 준다

### 10-3. 핵심 스타일 포인트

- KPI 카드 6칸 그리드
- 결과 요약 카드 상단 강조
- 프리셋 칩 버튼
- 모바일에서 입력 폼과 결과 카드가 자연스럽게 스택되는 구조

---

## 11. SEO / 하단 콘텐츠

### 11-1. SeoContent 권장 구조

- `introTitle`: `AI 자동화 ROI 계산기를 어떻게 읽어야 하나`
- `intro`: 왜 시간절감 환산이 필요한지
- `inputPoints`: 어떤 입력값이 결과를 좌우하는지
- `criteria`: 절감 시간 과대추정 주의, 팀 사용률 차이, 비정량 효과 분리
- `faq`: `AI_HOURLY_ROI_FAQ`
- `related`: `AI_HOURLY_ROI_RELATED_LINKS`

### 11-2. 내부 링크 전략

- `AI 스택 비용 계산기`
- `FIRE 계산기`
- `은퇴 계산기`
- 추후 AI 관련 리포트가 늘어나면 허브 역할 강화

---

## 12. QA 체크리스트

- [ ] `weeklySavedHours > weeklyRepeatHours` 시 에러가 표시된다
- [ ] `monthlyToolCost = 0`일 때 회수 기간이 `0개월` 또는 `즉시 회수`로 안전하게 처리된다
- [ ] `monthlySavedHours = 0`일 때 분모 0 오류 없이 `회수 불가` 처리된다
- [ ] 개인/팀 모드 전환 시 문구와 계산이 함께 바뀐다
- [ ] 프리셋 클릭 시 모든 입력값이 갱신된다
- [ ] URL 쿼리로 상태 복원이 된다
- [ ] 모바일 360px에서도 입력과 KPI가 깨지지 않는다
- [ ] `npm run build`가 통과한다

---

## 13. 구현 우선순위

### 13-1. MVP 필수

1. 입력 폼
2. 계산 로직
3. KPI 카드
4. URL 상태 저장
5. FAQ / 관련 링크

### 13-2. 있으면 좋은 요소

1. 누적 효과 차트
2. 프리셋 카드 설명 강화
3. 결과 해석 배지

### 13-3. 확장 후보

- AI 툴별 월 구독료 선택형 체크리스트
- `ChatGPT / Claude / Zapier / Notion AI` 템플릿 가격 프리셋
- 팀별 직군 혼합 시나리오
- 절감 시간 민감도 비교 슬라이더

