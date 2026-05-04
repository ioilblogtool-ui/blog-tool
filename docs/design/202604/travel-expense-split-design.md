# 여행 경비 분담 계산기 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/travel-expense-split.md`  
> 작성일: 2026-04-27  
> 구현 기준: Codex/Claude가 이 문서를 보고 바로 Astro 계산기 페이지 구현을 시작할 수 있는 수준  
> 참고 계산기: `overseas-travel-cost`, `wedding-budget-calculator`, `bonus-simulator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `여행 경비 분담 계산기`
- 슬러그: `travel-expense-split`
- URL: `/tools/travel-expense-split/`
- 콘텐츠 유형: 인터랙티브 계산기 (`/tools/`)
- 카테고리: `여행·항공·숙박비`
- 핵심 검색 의도: `여행 경비 분담 계산기`, `여행 정산`, `더치페이 계산기`, `누가 누구에게 얼마`

### 1-2. 페이지 정의

> 여행 참여자와 비용 항목을 입력하면
> 항목별 참여 여부, 선결제자, 더치페이 또는 비율 분담을 반영해
> 개인별 실제 부담액과 최종 송금 내역을 자동 계산하는 여행 정산 계산기

### 1-3. 구현 원칙

- 핵심 결과는 `총액`이 아니라 `누가 누구에게 얼마 보내면 끝나는지`다.
- 모바일에서 여행 중 바로 입력할 수 있어야 하므로 입력은 짧고 반복 가능한 행 단위로 설계한다.
- v1은 저장/로그인 없이 클라이언트 계산만 제공한다.
- 개인정보 부담을 줄이기 위해 참여자 이름은 브라우저 상태와 URL 공유 외 서버 저장을 하지 않는다.
- 정산 결과 복사 기능은 필수다. 단톡방에 바로 붙여넣을 수 있는 문구를 생성한다.
- 금액 반올림으로 생기는 1~몇 원 차이는 `정산 오차`로 표시하고 마지막 송금액에 보정한다.

---

## 2. 파일 구조

```text
src/
  data/
    travelExpenseSplit.ts
  pages/
    tools/
      travel-expense-split.astro

public/
  scripts/
    travel-expense-split.js
  og/
    tools/
      travel-expense-split.png

src/styles/scss/pages/
  _travel-expense-split.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
- `src/pages/index.astro`
- `src/pages/tools/index.astro`가 별도 카테고리 매핑을 요구하면 함께 확인
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 레이아웃 및 쉘

### 3-1. 공통 컴포넌트

- `BaseLayout`
- `SiteHeader`
- `SimpleToolShell`
- `CalculatorHero`
- `ToolActionBar`
- `InfoNotice`
- `SeoContent`

### 3-2. 권장 설정

```astro
<SimpleToolShell
  calculatorId="travel-expense-split"
  pageClass="tes-page"
  resultFirst={false}
>
```

### 3-3. 이유

- 사용자가 먼저 참여자와 비용 항목을 입력해야 의미 있는 결과가 나온다.
- 모바일에서는 입력 → 결과 흐름이 자연스럽지만, 결과 요약 sticky anchor를 제공하면 좋다.
- 계산 결과가 길 수 있으므로 PC에서는 입력과 결과를 나란히 보여주는 구조가 적합하다.

---

## 4. 데이터 파일 설계 (`src/data/travelExpenseSplit.ts`)

### 4-1. 타입 정의

```ts
export type SplitMode = "equal" | "ratio";
export type CurrencyCode = "KRW" | "JPY" | "USD" | "EUR";
export type RoundingUnit = 1 | 10 | 100 | 1000;

export type ExpenseCategory =
  | "flight"
  | "hotel"
  | "food"
  | "transport"
  | "ticket"
  | "shopping"
  | "insurance"
  | "etc";

export interface Participant {
  id: string;
  name: string;
  ratio: number;
}

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  currency: CurrencyCode;
  exchangeRate: number;
  paidBy: string;
  includedParticipantIds: string[];
  splitMode?: SplitMode;
}

export interface ParticipantSettlement {
  participantId: string;
  name: string;
  paidAmount: number;
  owedAmount: number;
  balance: number;
  status: "receive" | "send" | "settled";
}

export interface SettlementTransfer {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
}

export interface ExpenseSplitResult {
  totalCost: number;
  averagePerPerson: number;
  participantSettlements: ParticipantSettlement[];
  transfers: SettlementTransfer[];
  roundingDiff: number;
  copyText: string;
}

export interface TravelSplitPreset {
  id: string;
  label: string;
  description: string;
  splitMode: SplitMode;
  participants: Participant[];
  expenses: Omit<ExpenseItem, "id">[];
}

export interface TravelSplitFaqItem {
  q: string;
  a: string;
}
```

### 4-2. 메타 상수

```ts
export const TES_META = {
  slug: "travel-expense-split",
  title: "여행 경비 분담 계산기",
  subtitle:
    "친구 여행, 커플 여행, 가족 여행 후 누가 누구에게 얼마 보내야 하는지 선결제자와 불참 항목까지 반영해 계산합니다.",
  updatedAt: "2026년 4월",
  defaultCurrency: "KRW",
  defaultRoundingUnit: 100,
  maxParticipants: 10,
  minParticipants: 2,
} as const;
```

### 4-3. 카테고리 레이블

```ts
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  flight: "항공권",
  hotel: "숙박",
  food: "식비",
  transport: "교통",
  ticket: "입장료",
  shopping: "쇼핑",
  insurance: "보험",
  etc: "기타",
};

export const CURRENCY_OPTIONS = [
  { code: "KRW", label: "원화", unit: "원", exchangeRate: 1 },
  { code: "JPY", label: "엔화", unit: "엔", exchangeRate: 9.5 },
  { code: "USD", label: "달러", unit: "달러", exchangeRate: 1400 },
  { code: "EUR", label: "유로", unit: "유로", exchangeRate: 1500 },
];
```

### 4-4. 기본 상태

```ts
export const TES_DEFAULT_PARTICIPANTS: Participant[] = [
  { id: "p1", name: "승스", ratio: 25 },
  { id: "p2", name: "민수", ratio: 25 },
  { id: "p3", name: "지훈", ratio: 25 },
  { id: "p4", name: "현우", ratio: 25 },
];

export const TES_DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: "e1",
    category: "hotel",
    title: "숙박",
    amount: 400000,
    currency: "KRW",
    exchangeRate: 1,
    paidBy: "p1",
    includedParticipantIds: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "e2",
    category: "food",
    title: "식비",
    amount: 120000,
    currency: "KRW",
    exchangeRate: 1,
    paidBy: "p2",
    includedParticipantIds: ["p1", "p2", "p3", "p4"],
  },
];
```

### 4-5. 프리셋

```ts
export const TES_PRESETS: TravelSplitPreset[] = [
  {
    id: "friends",
    label: "친구 4인 여행",
    description: "숙박, 식비, 교통, 입장료를 더치페이로 정산",
    splitMode: "equal",
    participants: [
      { id: "p1", name: "승스", ratio: 25 },
      { id: "p2", name: "민수", ratio: 25 },
      { id: "p3", name: "지훈", ratio: 25 },
      { id: "p4", name: "현우", ratio: 25 },
    ],
    expenses: [
      { category: "hotel", title: "숙박", amount: 600000, currency: "KRW", exchangeRate: 1, paidBy: "p1", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
      { category: "food", title: "식비", amount: 240000, currency: "KRW", exchangeRate: 1, paidBy: "p2", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
      { category: "ticket", title: "입장료", amount: 90000, currency: "KRW", exchangeRate: 1, paidBy: "p3", includedParticipantIds: ["p1", "p2", "p4"] },
    ],
  },
  {
    id: "couple",
    label: "커플 2인 여행",
    description: "5:5 또는 6:4 분담으로 숙소와 식비 정산",
    splitMode: "ratio",
    participants: [
      { id: "p1", name: "A", ratio: 50 },
      { id: "p2", name: "B", ratio: 50 },
    ],
    expenses: [
      { category: "hotel", title: "숙박·렌터카", amount: 600000, currency: "KRW", exchangeRate: 1, paidBy: "p1", includedParticipantIds: ["p1", "p2"] },
      { category: "food", title: "식비·카페", amount: 220000, currency: "KRW", exchangeRate: 1, paidBy: "p2", includedParticipantIds: ["p1", "p2"] },
    ],
  },
  {
    id: "family",
    label: "가족 여행",
    description: "부모와 자녀의 분담 비율이 다른 가족 여행 정산",
    splitMode: "ratio",
    participants: [
      { id: "p1", name: "아빠", ratio: 50 },
      { id: "p2", name: "엄마", ratio: 30 },
      { id: "p3", name: "자녀1", ratio: 10 },
      { id: "p4", name: "자녀2", ratio: 10 },
    ],
    expenses: [
      { category: "hotel", title: "숙박", amount: 700000, currency: "KRW", exchangeRate: 1, paidBy: "p1", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
      { category: "transport", title: "교통·렌터카", amount: 250000, currency: "KRW", exchangeRate: 1, paidBy: "p2", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
    ],
  },
];
```

### 4-6. FAQ / 관련 링크

```ts
export const TES_FAQ: TravelSplitFaqItem[] = [
  {
    q: "여행 경비는 총액을 인원수로 나누면 되나요?",
    a: "가장 단순한 방식은 총액을 인원수로 나누는 것입니다. 다만 일부 인원만 참여한 액티비티, 선결제자, 항공권 개별 결제, 가족 분담률 등이 있으면 항목별로 따로 계산하는 것이 정확합니다.",
  },
  {
    q: "선결제자가 여러 명이면 어떻게 계산하나요?",
    a: "각 비용 항목마다 선결제자를 지정하면 됩니다. 계산기는 각 사람이 먼저 낸 금액과 실제 부담해야 할 금액을 비교해 최종 송금 내역을 생성합니다.",
  },
  {
    q: "특정 사람이 어떤 일정에 참여하지 않았으면 어떻게 하나요?",
    a: "해당 비용 항목에서 그 사람을 제외하면 됩니다. 예를 들어 4명 여행 중 3명만 놀이공원에 갔다면 입장료는 3명에게만 나눠 계산합니다.",
  },
  {
    q: "커플 여행은 무조건 5:5로 나누는 게 좋나요?",
    a: "정답은 없습니다. 둘이 합의했다면 5:5, 6:4, 7:3처럼 비율 분담도 가능합니다. 계산기에서는 더치페이와 비율 분담을 모두 지원합니다.",
  },
  {
    q: "해외여행 경비도 계산할 수 있나요?",
    a: "원화 입력을 기본으로 하되 엔화, 달러, 유로 입력과 환율 변환을 지원하면 해외여행 정산에도 사용할 수 있습니다.",
  },
  {
    q: "정산 금액이 100원 단위로 딱 맞지 않으면 어떻게 하나요?",
    a: "반올림 단위를 선택하면 계산기가 마지막 송금 내역에 차액을 보정합니다. 1원 단위가 불편하면 100원 또는 1,000원 단위 정산을 권장합니다.",
  },
];

export const TES_RELATED_LINKS = [
  { label: "해외여행 총비용 계산기", href: "/tools/overseas-travel-cost/" },
  { label: "항공권 최저가 시기 계산기", href: "/tools/flight-cheapest-timing-calculator/" },
  { label: "2026 한국인 해외여행 항공권 가격 비교", href: "/reports/korea-flight-price-comparison-2026/" },
  { label: "일본·동남아·유럽 여행 실비용 비교", href: "/reports/overseas-travel-cost-compare-2026/" },
];
```

---

## 5. 계산 로직

### 5-1. 입력 정규화

```js
function normalizeParticipants(participants) {
  return participants
    .map((participant, index) => ({
      id: participant.id || `p${index + 1}`,
      name: String(participant.name || `참여자${index + 1}`).trim(),
      ratio: Math.max(0, Number(participant.ratio) || 0),
    }))
    .slice(0, 10);
}

function normalizeExpenses(expenses, participants) {
  const participantIds = new Set(participants.map((p) => p.id));

  return expenses
    .map((expense, index) => {
      const included = (expense.includedParticipantIds || []).filter((id) => participantIds.has(id));
      return {
        id: expense.id || `e${index + 1}`,
        category: expense.category || "etc",
        title: String(expense.title || "기타").trim(),
        amount: Math.max(0, Number(expense.amount) || 0),
        currency: expense.currency || "KRW",
        exchangeRate: Math.max(0, Number(expense.exchangeRate) || 1),
        paidBy: participantIds.has(expense.paidBy) ? expense.paidBy : participants[0]?.id,
        includedParticipantIds: included.length ? included : participants.map((p) => p.id),
        splitMode: expense.splitMode || undefined,
      };
    })
    .filter((expense) => expense.amount > 0 && expense.paidBy);
}
```

### 5-2. 원화 환산

```js
function toKrwAmount(expense) {
  if (expense.currency === "KRW") return expense.amount;
  return expense.amount * expense.exchangeRate;
}
```

### 5-3. 항목별 더치페이 부담액

```js
function applyEqualShare(balanceMap, expense) {
  const amount = toKrwAmount(expense);
  const includedIds = expense.includedParticipantIds;
  const share = amount / Math.max(1, includedIds.length);

  balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + amount);

  includedIds.forEach((participantId) => {
    balanceMap.set(participantId, (balanceMap.get(participantId) || 0) - share);
  });
}
```

### 5-4. 항목별 비율 분담

비율 분담은 해당 항목 참여자들의 비율 합계를 기준으로 다시 정규화한다. 예를 들어 전체 비율은 50/30/10/10이지만 자녀 1명이 불참한 항목은 참여자 비율 합계 90을 기준으로 나눈다.

```js
function applyRatioShare(balanceMap, expense, participants) {
  const amount = toKrwAmount(expense);
  const includedIds = new Set(expense.includedParticipantIds);
  const includedParticipants = participants.filter((p) => includedIds.has(p.id));
  const ratioTotal = includedParticipants.reduce((sum, p) => sum + p.ratio, 0);
  const fallbackShare = amount / Math.max(1, includedParticipants.length);

  balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + amount);

  includedParticipants.forEach((participant) => {
    const owed = ratioTotal > 0 ? amount * (participant.ratio / ratioTotal) : fallbackShare;
    balanceMap.set(participant.id, (balanceMap.get(participant.id) || 0) - owed);
  });
}
```

### 5-5. 전체 balance 계산

```js
function calculateBalance({ participants, expenses, splitMode }) {
  const balanceMap = new Map();
  participants.forEach((participant) => balanceMap.set(participant.id, 0));

  expenses.forEach((expense) => {
    const mode = expense.splitMode || splitMode;
    if (mode === "ratio") {
      applyRatioShare(balanceMap, expense, participants);
    } else {
      applyEqualShare(balanceMap, expense);
    }
  });

  return balanceMap;
}
```

balance 의미:

- `balance > 0`: 받아야 할 금액
- `balance < 0`: 보내야 할 금액
- `balance = 0`: 정산 완료

### 5-6. 반올림

```js
function roundAmount(amount, unit) {
  if (!unit || unit <= 1) return Math.round(amount);
  return Math.round(amount / unit) * unit;
}
```

참여자별 balance를 먼저 반올림하면 전체 합이 0이 아닐 수 있다. v1에서는 `generateSettlements` 단계에서 금액을 반올림하고 마지막 송금액에 차액을 보정한다.

### 5-7. 송금 내역 생성

```js
function generateSettlements(balanceMap, participants, roundingUnit = 100) {
  const nameById = Object.fromEntries(participants.map((p) => [p.id, p.name]));
  const debtors = Array.from(balanceMap.entries())
    .filter(([, amount]) => amount < -0.5)
    .map(([id, amount]) => ({ id, amount: Math.abs(amount) }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Array.from(balanceMap.entries())
    .filter(([, amount]) => amount > 0.5)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const rawAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = roundAmount(rawAmount, roundingUnit);

    if (roundedAmount > 0) {
      transfers.push({
        fromId: debtor.id,
        fromName: nameById[debtor.id],
        toId: creditor.id,
        toName: nameById[creditor.id],
        amount: roundedAmount,
      });
    }

    debtor.amount -= rawAmount;
    creditor.amount -= rawAmount;

    if (debtor.amount <= 0.5) i += 1;
    if (creditor.amount <= 0.5) j += 1;
  }

  return transfers;
}
```

### 5-8. 결과 생성

```js
function calculateTravelExpenseSplit({ participants, expenses, splitMode, roundingUnit }) {
  const balanceMap = calculateBalance({ participants, expenses, splitMode });
  const totalCost = expenses.reduce((sum, expense) => sum + toKrwAmount(expense), 0);
  const paidMap = new Map(participants.map((p) => [p.id, 0]));
  const owedMap = new Map(participants.map((p) => [p.id, 0]));

  expenses.forEach((expense) => {
    const amount = toKrwAmount(expense);
    paidMap.set(expense.paidBy, (paidMap.get(expense.paidBy) || 0) + amount);
  });

  participants.forEach((participant) => {
    const paid = paidMap.get(participant.id) || 0;
    const balance = balanceMap.get(participant.id) || 0;
    owedMap.set(participant.id, paid - balance);
  });

  const participantSettlements = participants.map((participant) => {
    const balance = balanceMap.get(participant.id) || 0;
    return {
      participantId: participant.id,
      name: participant.name,
      paidAmount: Math.round(paidMap.get(participant.id) || 0),
      owedAmount: Math.round(owedMap.get(participant.id) || 0),
      balance: Math.round(balance),
      status: balance > 0 ? "receive" : balance < 0 ? "send" : "settled",
    };
  });

  const transfers = generateSettlements(balanceMap, participants, roundingUnit);
  const transferTotal = transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
  const debtorTotal = participantSettlements
    .filter((item) => item.balance < 0)
    .reduce((sum, item) => sum + Math.abs(item.balance), 0);

  return {
    totalCost: Math.round(totalCost),
    averagePerPerson: Math.round(totalCost / Math.max(1, participants.length)),
    participantSettlements,
    transfers,
    roundingDiff: Math.round(transferTotal - debtorTotal),
  };
}
```

---

## 6. 페이지 구성 (`src/pages/tools/travel-expense-split.astro`)

### 6-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. 참여자 입력
4. 정산 방식/통화/반올림 옵션
5. 비용 항목 입력
6. 최종 송금 내역
7. 개인별 정산표
8. 결과 복사 박스
9. 여행 유형별 프리셋
10. 정산 전 체크리스트
11. FAQ
12. `SeoContent`

### 6-2. Hero

- eyebrow: `여행 정산 계산기`
- title: `여행 경비 분담 계산기`
- description: `친구 여행, 커플 여행, 가족 여행 후 누가 누구에게 얼마 보내야 하는지 선결제자와 불참 항목까지 반영해 계산합니다.`
- badges:
  - `더치페이`
  - `선결제자`
  - `불참 제외`
  - `송금 내역`

### 6-3. InfoNotice

필수 안내:

- 이 계산기는 입력한 비용과 참여자 기준으로 정산 금액을 계산한다.
- 실제 송금 전에는 여행 구성원과 비용 포함 기준을 한 번 더 확인해야 한다.
- 반올림 단위를 사용하면 1원 단위 결과와 차이가 날 수 있다.

### 6-4. 입력 영역

#### A. 여행 기본 정보

- 여행 이름
- 정산 방식: `더치페이`, `비율 분담`
- 기본 통화: `원화`, `엔화`, `달러`, `유로`
- 반올림 단위: `1원`, `10원`, `100원`, `1,000원`

#### B. 참여자

```html
<div class="tes-participant-list" id="tesParticipantList">
  <div class="tes-participant-row" data-participant-id="p1">
    <input type="text" value="승스" aria-label="참여자 이름" />
    <input type="number" value="25" min="0" max="100" aria-label="분담 비율" />
    <button type="button" data-tes-remove-participant="p1">삭제</button>
  </div>
</div>
<button type="button" id="tesAddParticipant">참여자 추가</button>
```

비율 입력은 `정산 방식 = 비율 분담`일 때만 강조한다. 더치페이 모드에서도 값을 유지하되 계산에는 쓰지 않는다.

#### C. 비용 항목

```html
<div class="tes-expense-list" id="tesExpenseList">
  <article class="tes-expense-row" data-expense-id="e1">
    <select data-tes-expense-category>
      <option value="hotel">숙박</option>
      <option value="food">식비</option>
      <option value="transport">교통</option>
      <option value="ticket">입장료</option>
      <option value="etc">기타</option>
    </select>
    <input type="text" data-tes-expense-title value="숙박" />
    <input type="number" data-tes-expense-amount value="400000" />
    <select data-tes-expense-paid-by></select>
    <div class="tes-included-checks" data-tes-included-checks></div>
    <button type="button" data-tes-remove-expense="e1">삭제</button>
  </article>
</div>
<button type="button" id="tesAddExpense">비용 항목 추가</button>
```

#### D. 빠른 항목 추가 버튼

- `숙박`
- `식비`
- `교통`
- `입장료`
- `카페`
- `기타`

---

## 7. 결과 UI 설계

### 7-1. KPI 카드

```html
<section class="tes-kpi-grid">
  <article class="tes-kpi-card tes-kpi-card--main">
    <p>총 여행 경비</p>
    <strong id="tesTotalCost">0원</strong>
    <span id="tesTripNameSummary">입력한 항목 합계</span>
  </article>
  <article class="tes-kpi-card">
    <p>1인 평균 부담액</p>
    <strong id="tesAverageCost">0원</strong>
    <span>단순 평균 기준</span>
  </article>
  <article class="tes-kpi-card">
    <p>송금 건수</p>
    <strong id="tesTransferCount">0건</strong>
    <span>정산 완료에 필요한 송금</span>
  </article>
  <article class="tes-kpi-card">
    <p>반올림 차액</p>
    <strong id="tesRoundingDiff">0원</strong>
    <span>선택한 반올림 단위 기준</span>
  </article>
</section>
```

### 7-2. 최종 송금 내역

```html
<section class="tes-transfer-section">
  <div class="section-header--compact">
    <p class="section-header__eyebrow">최종 정산</p>
    <h2>아래대로 송금하면 정산이 끝납니다</h2>
  </div>
  <ol id="tesTransferList" class="tes-transfer-list"></ol>
  <button type="button" id="tesCopyResult">정산 결과 복사</button>
</section>
```

빈 상태:

```text
현재 입력값에서는 추가 송금 없이 정산이 완료된 상태입니다.
```

### 7-3. 개인별 정산표

| 참여자 | 선결제 | 실제 부담 | 받을 돈/보낼 돈 |
| --- | ---: | ---: | ---: |
| 승스 | 400,000원 | 250,000원 | 받을 돈 150,000원 |

### 7-4. 복사용 문구

```text
[오사카 3박 4일 여행 정산]
총 경비: 1,200,000원
1인 평균: 300,000원

송금 내역
민수 → 승스 85,000원
지훈 → 승스 40,000원
현우 → 승스 25,000원

※ 선결제자와 불참 항목을 반영한 계산 결과입니다.
```

---

## 8. JavaScript 설계 (`public/scripts/travel-expense-split.js`)

### 8-1. 로드 규칙

```astro
<script
  id="travelExpenseSplitData"
  type="application/json"
  set:html={JSON.stringify(seed)}
/>
<script type="module" src={withBase("/scripts/travel-expense-split.js")}></script>
```

Chart.js는 v1에서 필수가 아니다. 시각화보다 정산 입력과 결과 복사가 중요하다.

### 8-2. 상태 객체

```js
const state = {
  tripName: "오사카 3박 4일",
  splitMode: "equal",
  defaultCurrency: "KRW",
  defaultExchangeRate: 1,
  roundingUnit: 100,
  participants: [],
  expenses: [],
};
```

### 8-3. 함수 목록

| 함수 | 역할 |
| --- | --- |
| `loadSeed()` | JSON seed 파싱 |
| `restoreFromUrl()` | 공유 URL 상태 복원 |
| `syncUrl()` | 주요 상태를 query string에 반영 |
| `renderParticipants()` | 참여자 행 렌더링 |
| `renderExpenses()` | 비용 항목 행 렌더링 |
| `renderIncludedChecks()` | 항목별 참여자 체크박스 렌더링 |
| `bindGlobalControls()` | 여행명, 모드, 통화, 반올림 이벤트 |
| `bindParticipantEvents()` | 참여자 추가/삭제/이름/비율 변경 |
| `bindExpenseEvents()` | 비용 추가/삭제/금액/선결제자/참여자 변경 |
| `applyPreset()` | 프리셋 적용 |
| `calculate()` | 정산 계산 |
| `renderResults()` | KPI, 송금 내역, 개인별 표 갱신 |
| `buildCopyText()` | 단톡방 복사용 문구 생성 |
| `copyResult()` | 클립보드 복사 |
| `resetState()` | 기본값 복원 |

### 8-4. URL 파라미터

상태가 길어질 수 있으므로 v1에서는 URL에 전체 비용 항목을 모두 담지 않는다.

| 파라미터 | 의미 |
| --- | --- |
| `preset` | 적용 프리셋 |
| `mode` | `equal` / `ratio` |
| `round` | 반올림 단위 |
| `names` | 참여자 이름 콤마 연결 |

비용 항목까지 공유하는 고급 공유 링크는 v2에서 `state` 압축 문자열로 확장한다.

---

## 9. SCSS 설계 (`_travel-expense-split.scss`)

### 9-1. 범위

- 페이지 루트: `.tes-page`
- 내부 prefix: `tes-`
- 전역 테이블/버튼 스타일 오염 금지
- 모바일 입력 편의성을 우선한다.

### 9-2. 주요 블록

```scss
.tes-page {
  display: grid;
  gap: 24px;

  .tes-kpi-grid { ... }
  .tes-kpi-card { ... }
  .tes-form-panel { ... }
  .tes-participant-list { ... }
  .tes-participant-row { ... }
  .tes-expense-list { ... }
  .tes-expense-row { ... }
  .tes-included-checks { ... }
  .tes-transfer-list { ... }
  .tes-copy-box { ... }
}
```

### 9-3. 반응형

- `980px` 이하: 입력/결과 2열 → 1열
- `720px` 이하: 비용 항목 행을 카드형 1열로 변경
- `560px` 이하: 참여자 행의 이름/비율/삭제 버튼을 2열 + 버튼 하단 배치
- `360px` 이하: 금액 입력과 select는 width 100%

### 9-4. 입력 안정성

- 비용 항목 카드에는 최소 높이를 주지 않는다. 항목이 많아질수록 자연스럽게 세로로 쌓는다.
- 참여자 체크박스는 작은 pill 형태보다 표준 checkbox + 이름 라벨을 우선한다.
- `삭제` 버튼은 실수 방지를 위해 작은 텍스트 버튼으로 두되, 터치 영역은 36px 이상 확보한다.

---

## 10. 콘텐츠/SEO 구성

### 10-1. SEO 섹션 제목

1. 여행 경비 분담 계산기가 필요한 이유
2. 여행 정산 기본 공식
3. 선결제자가 있을 때 계산하는 법
4. 친구 여행 더치페이 계산 예시
5. 커플 여행 비용 분담 예시
6. 가족 여행 비용 분담 예시
7. 불참 항목 제외 계산법
8. 해외여행 환율 반영 정산법
9. 여행 정산할 때 자주 싸우는 포인트
10. 여행 전 미리 정하면 좋은 정산 기준

### 10-2. SeoContent 예시

```astro
<SeoContent
  introTitle="여행 경비 분담 계산기 이용 안내"
  intro={[
    "여행 경비는 총액을 인원수로 나누면 끝나는 경우도 있지만, 실제로는 선결제자, 불참 일정, 가족·커플 분담률 때문에 정산이 복잡해질 수 있습니다.",
    "이 계산기는 항목별로 누가 결제했는지, 누가 해당 비용을 함께 부담하는지 입력해 개인별 부담액과 최종 송금 내역을 계산합니다.",
    "결과 복사 문구를 사용하면 카카오톡 단톡방에 정산 결과를 바로 공유할 수 있습니다.",
  ]}
  criteria={[
    "더치페이는 항목별 참여자 수 기준으로 N분의 1 계산",
    "비율 분담은 해당 항목 참여자의 분담률 합계를 기준으로 재계산",
    "반올림 단위를 적용하면 1원 단위 결과와 일부 차이가 날 수 있음",
  ]}
  faq={faq}
  related={TES_RELATED_LINKS}
/>
```

### 10-3. 여행 전 체크리스트

```text
여행 가기 전 미리 정하면 좋은 것

□ 숙박비는 누가 먼저 결제할지 정하기
□ 식비는 매번 더치페이할지, 마지막에 한 번에 정산할지 정하기
□ 술값·카페비를 전체 경비에 포함할지 정하기
□ 불참 액티비티 비용은 제외할지 정하기
□ 렌터카·주유비·주차비 부담 기준 정하기
□ 커플/가족 여행은 분담 비율 미리 정하기
□ 해외여행은 환율 기준일 정하기
```

---

## 11. 등록 체크리스트

- [ ] `src/data/travelExpenseSplit.ts` 작성
- [ ] `src/pages/tools/travel-expense-split.astro` 작성
- [ ] `public/scripts/travel-expense-split.js` 작성
- [ ] `src/styles/scss/pages/_travel-expense-split.scss` 작성
- [ ] `src/data/tools.ts`에 `travel-expense-split` 등록
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/travel-expense-split';` 추가
- [ ] `public/sitemap.xml`에 `/tools/travel-expense-split/` 추가
- [ ] OG 이미지 `public/og/tools/travel-expense-split.png` 생성
- [ ] `npm run build` 성공 확인

---

## 12. QA 체크리스트

### 12-1. 계산 QA

- [ ] 참여자 2명 미만이면 계산하지 않고 안내 표시
- [ ] 비용 항목의 참여자가 0명인 경우 전체 참여자로 자동 보정
- [ ] 선결제자 삭제 시 남은 첫 번째 참여자로 자동 변경
- [ ] 더치페이 모드에서 일부 불참 항목이 해당 참여자에게 부과되지 않음
- [ ] 비율 분담 모드에서 불참자를 제외한 비율 합계로 재분배됨
- [ ] 외화 금액이 환율 기준으로 원화 환산됨
- [ ] 반올림 단위가 송금 내역에 적용됨
- [ ] 모든 balance 합계가 0에 가깝게 유지됨

### 12-2. 인터랙션 QA

- [ ] 참여자 추가/삭제 후 비용 항목의 선결제자 select와 참여자 체크박스가 갱신됨
- [ ] 비용 항목 추가 버튼이 기본 카테고리/금액/참여자를 올바르게 채움
- [ ] 프리셋 적용 후 결과가 즉시 갱신됨
- [ ] 결과 복사 버튼이 복사용 문구를 클립보드에 복사함
- [ ] reset 버튼이 기본값으로 복원됨
- [ ] 모바일에서 비용 항목 5개 이상 입력해도 조작이 가능함

### 12-3. 콘텐츠 QA

- [ ] 정산 결과가 송금 지시처럼 보이되, 실제 송금 전 확인 안내가 있음
- [ ] 영어 사용자 facing 문구 없음
- [ ] FAQ 5개 이상 노출
- [ ] 관련 링크가 실제 존재하는 페이지 위주로 연결됨
- [ ] 개인정보 저장으로 오해될 문구 없음

### 12-4. 반응형 QA

- [ ] 320px에서 참여자 이름 입력과 삭제 버튼이 겹치지 않음
- [ ] 비용 항목 카드의 select/input이 화면 밖으로 넘치지 않음
- [ ] 송금 내역 긴 이름이 줄바꿈되어도 금액을 가리지 않음
- [ ] 복사용 문구 영역이 모바일에서 가로 스크롤 없이 읽힘

---

## 13. 구현 순서

1. `src/data/travelExpenseSplit.ts`에 타입, 기본값, 프리셋, FAQ, 관련 링크 작성
2. `src/pages/tools/travel-expense-split.astro`에서 `SimpleToolShell` 기반 페이지 골격 작성
3. 참여자/비용 항목/결과 영역 정적 마크업 완성
4. `public/scripts/travel-expense-split.js`에서 상태, 렌더링, 계산, 복사 기능 구현
5. `_travel-expense-split.scss` 작성 후 `app.scss`에 import
6. `tools.ts`, `sitemap.xml`, 홈/목록 노출 여부 확인
7. `npm run build`

---

## 14. 최종 요약

| 항목 | 설계 방향 |
| --- | --- |
| 핵심 목적 | 여행 후 복잡한 경비 정산 자동화 |
| 핵심 기능 | 선결제자, 불참 항목, 더치페이, 비율 분담, 송금 내역 |
| 주요 타깃 | 친구 여행, 커플 여행, 가족 여행, 단체 여행 |
| 결과 핵심 | 개인별 부담액과 최종 송금 내역 |
| UX 방향 | 모바일 입력 최우선, 결과 복사 필수 |
| 확장성 | 외화 입력, 공유 링크, 정산 이미지 저장, 히스토리 저장 |
