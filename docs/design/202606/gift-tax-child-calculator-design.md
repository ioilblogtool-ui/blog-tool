# 자녀 증여세 계산기 — 설계 문서

> 기획 원본: `docs/plan/202606/gift-tax-child-calculator.md`
> 작성일: 2026-06-28
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 파일 작성 가능한 수준

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202606/gift-tax-child-calculator.md`
- 구현 대상: `자녀 증여세 계산기` (미성년 2,000만원 / 성년 5,000만원 / 혼인·출산 추가공제 1억원)
- 참고 페이지: `homePurchaseFund`, `weddingGiftBreakEven` — 결과 카드 + 안내 박스 + FAQ 구조

### 1-2. 전제
- 세율표·공제 한도는 2026년 6월 기준 국세청 공시 수치를 정적으로 내장한다 (실시간 API 없음).
- 모든 계산 결과는 **추정치**이며, 법적 신고 의무 판단이 아닌 참고용임을 `InfoNotice`로 명시한다.
- 혼인공제와 출산공제는 **합산 한도 1억원**으로 처리한다. 별도 중복 한도가 아니다.
- 증여자(부모/조부모) 그룹별 동시 계산은 MVP에서 제외하고, "최근 10년 증여금액" 단일 입력값으로 단순화한다.
- "0원 신고 권장" 안내는 세액 계산과 무관한 **참고 문구**로만 노출하고, 의무사항처럼 표현하지 않는다.

### 1-3. 권장 슬러그 및 파일 구조

```
slug: gift-tax-child-calculator
URL: /tools/gift-tax-child-calculator/

src/data/giftTaxChildCalculator.ts          ← 공제표, 세율표, FAQ, 플랜표 데이터
src/pages/tools/gift-tax-child-calculator.astro
public/scripts/gift-tax-child-calculator.js
src/styles/scss/pages/_gift-tax-child-calculator.scss
public/og/tools/gift-tax-child-calculator.png  ← OG 이미지 (별도 생성)
```

### 1-4. 레이아웃 쉘
- `SimpleToolShell.astro`
- aside(좌): 입력 패널 (자녀 나이 / 증여금액 / 10년 이력 / 혼인·출산 토글)
- main(우): 결과 KPI → 공제 적용 내역 → 결과 문구 → 생애 증여 플랜표(정적) → 계산 기준 안내

---

## 2. 구현 범위 (MVP)

### 2-1. MVP 포함
- 자녀 나이 입력 → 19세 기준 미성년/성년 기본공제 자동 판단
- 이번 증여금액 + 최근 10년 증여금액 입력
- 혼인 여부 + 혼인신고일, 출산 여부 + 출산일 (조건부 노출)
- 혼인·출산 합산 추가공제(최대 1억원) 기사용액 입력
- 과세표준 → 5단계 누진세율 증여세 계산
- 결과 KPI 카드: 적용 공제 합계 / 과세표준 / 예상 증여세
- 결과 문구 자동 생성 (공제 이내 / 일부 과세 케이스 분기)
- 0원 신고 권장 안내 박스 (참고용, 토글 조건 기반)
- 생애 증여 플랜표 (정적 가이드 표, 입력값과 무관)
- URL 파라미터 저장 (공유 가능)
- FAQ + 관련 계산기 CTA + SEO 콘텐츠

### 2-2. MVP 제외
- 증여자(부모/조부모) 그룹별 동시 계산
- 증여세 신고기한 자동 계산
- 동적 생애 플랜 시뮬레이션 (입력값 반영형)
- 세대생략 증여 할증 계산

---

## 3. 데이터 파일 구조 (`src/data/giftTaxChildCalculator.ts`)

### 3-1. 타입 정의

```typescript
export interface GiftTaxBracket {
  maxBase: number | null; // null = 무제한 (30억 초과)
  rate: number;           // 0.1 ~ 0.5
  deduction: number;      // 누진공제액
}

export interface LifetimeGiftPlanStep {
  stage: string;          // "출생~미성년"
  strategy: string;       // "자녀 명의 계좌 증여"
  taxFreeAmount: string;  // "2,000만원"
}

export interface GiftTaxFaqItem {
  question: string;
  answer: string;
}
```

### 3-2. 세율표 (정적)

```typescript
export const GIFT_TAX_BRACKETS: GiftTaxBracket[] = [
  { maxBase: 100_000_000, rate: 0.1, deduction: 0 },
  { maxBase: 500_000_000, rate: 0.2, deduction: 10_000_000 },
  { maxBase: 1_000_000_000, rate: 0.3, deduction: 60_000_000 },
  { maxBase: 3_000_000_000, rate: 0.4, deduction: 160_000_000 },
  { maxBase: null, rate: 0.5, deduction: 460_000_000 },
];

export const MINOR_BASIC_DEDUCTION = 20_000_000;
export const ADULT_BASIC_DEDUCTION = 50_000_000;
export const MARRIAGE_BIRTH_MAX_DEDUCTION = 100_000_000;
export const MINOR_AGE_THRESHOLD = 19;
```

### 3-3. 생애 증여 플랜표 (정적)

```typescript
export const LIFETIME_GIFT_PLAN: LifetimeGiftPlanStep[] = [
  { stage: '출생~미성년', strategy: '자녀 명의 계좌 증여', taxFreeAmount: '2,000만원' },
  { stage: '성년 이후', strategy: '대학·사회초년생 자금', taxFreeAmount: '5,000만원' },
  { stage: '결혼 시', strategy: '혼인 추가공제 활용', taxFreeAmount: '1억원' },
  { stage: '출산 시', strategy: '출산 추가공제 검토', taxFreeAmount: '혼인·출산 합산 1억원' },
  { stage: '주택 구입 시', strategy: '기존 증여 이력 합산 체크', taxFreeAmount: '초과분 과세' },
];
```

### 3-4. FAQ 데이터
`GIFT_TAX_FAQ: GiftTaxFaqItem[]` — 기획서 8번 FAQ 키워드 표 기반 9개 항목 (아기 증여 2천만원 신고, 5천만원 10년 주기, 결혼 1억 비과세 여부, 조부모 손주 증여, 혼인·출산 중복 여부 등)

---

## 4. 계산 로직 (`public/scripts/gift-tax-child-calculator.js`)

### 4-1. 기본공제 판단
```js
function getBasicDeduction(age) {
  return age < MINOR_AGE_THRESHOLD ? MINOR_BASIC_DEDUCTION : ADULT_BASIC_DEDUCTION;
}
```

### 4-2. 혼인·출산 추가공제
```js
function getMarriageBirthDeduction({ isMarriageGift, isBirthGift, usedDeduction }) {
  const remaining = Math.max(0, MARRIAGE_BIRTH_MAX_DEDUCTION - usedDeduction);
  return (isMarriageGift || isBirthGift) ? remaining : 0;
}
```
- 혼인 요건: 혼인신고일 전후 2년 이내 (날짜 입력값으로 클라이언트에서 판정, 범위 밖이면 경고 표시 후 공제 미적용)
- 출산 요건: 출생일부터 2년 이내 (동일 방식)

### 4-3. 과세표준 / 증여세
```js
function calcTaxBase(giftAmount, prior10y, totalDeduction) {
  return Math.max(0, giftAmount + prior10y - totalDeduction);
}

function calcGiftTax(taxBase) {
  const bracket = GIFT_TAX_BRACKETS.find(b => b.maxBase === null || taxBase <= b.maxBase);
  return Math.max(0, taxBase * bracket.rate - bracket.deduction);
}
```

### 4-4. 0원 신고 권장 안내 조건 (참고용 플래그)
```js
function shouldRecommendZeroReport({ giftAmount, isMarriageGift, isBirthGift, purpose }) {
  return giftAmount >= 10_000_000 || isMarriageGift || isBirthGift || purpose === 'house';
}
```

---

## 5. 화면 구조

### 5-1. Hero (`CalculatorHero.astro`)
- eyebrow: `세금 계산기`
- title: `자녀 증여세 계산기`
- description: `미성년 2,000만원 · 성년 5,000만원 · 혼인·출산 추가공제 1억원까지 한 번에 계산`

### 5-2. 입력 패널 (aside)
- 자녀 나이 (number input, `data-age`)
- 이번 증여금액 (number input + 천원 단위 슬라이더, `data-gift-amount`)
- 최근 10년 증여금액 (`data-prior-gift`)
- 혼인 여부 토글 → 체크 시 혼인신고일 date input 노출 (`data-marriage-toggle`, `data-marriage-date`)
- 출산 여부 토글 → 체크 시 출산일 date input 노출 (`data-birth-toggle`, `data-birth-date`)
- 혼인·출산 공제 기사용액 (`data-used-deduction`)
- 증여 목적 select: 투자/결혼/주택/생활비 (`data-purpose`)
- `ToolActionBar.astro` (초기화 + 링크 복사)

### 5-3. 결과 영역 (main)
1. **KPI 카드 3종** (`SummaryCards.astro`): 적용 공제 합계 / 과세표준 / 예상 증여세
2. **공제 적용 내역**: 기본공제 vs 혼인·출산 추가공제(잔여 한도 표시) 분리 카드
3. **결과 문구**: 케이스 분기 텍스트 (공제 이내 / 일부 과세)
4. **0원 신고 권장 안내** (`InfoNotice.astro`, `참고` 라벨 고정)
5. **생애 증여 플랜표**: 정적 5행 테이블, 입력값과 무관하게 항상 노출
6. **계산 기준 안내**: 세율표, 공제 한도 출처(국세청) 표기

### 5-4. SEO / FAQ
`SeoContent.astro`에 아래 H2 구조 반영 (기획서 8번 기준):
```
1. 자녀 증여세 계산기
2. 미성년 자녀 2,000만원 증여세 계산
3. 성년 자녀 5,000만원 증여세 계산
4. 자녀 결혼자금 1억원 추가공제 계산
5. 출산 증여공제 계산
6. 부모·조부모 증여 10년 합산 기준
7. 증여세 0원 신고가 필요한 경우 (참고)
8. 자녀 생애 증여 플랜 예시
9. 자주 묻는 질문
```

---

## 6. 표현/카피 원칙
- "세금 없다", "비과세 확정" 같은 단정 표현 금지 → "요건 충족 시 공제 적용" 식 조건부 표현 사용
- 수증자(자녀) 기준 10년 합산이라는 점을 6번 섹션에서 명확히 안내 — 증여자별로 별도 무한 공제가 아님을 강조
- 모든 계산 결과에 `추정` 라벨 부착, 실제 신고는 홈택스/세무사 확인 권장 문구 하단 고정 노출
- 날짜 기반 요건(혼인·출산 2년 이내) 판정 결과는 화면에 "요건 충족/미충족" 배지로 명시

---

## 7. QA 체크리스트
- 빌드 통과 여부
- 미성년/성년 경계(19세) 공제 전환 정상 동작
- 혼인·출산 토글 ON/OFF 시 입력 필드 노출/숨김 정상 동작
- 혼인신고일/출산일 2년 요건 판정 정확성 (경계값 테스트)
- 혼인·출산 합산 한도(1억원) 초과 시 기사용액 반영해 잔여 공제만 적용되는지 확인
- 과세표준 0원일 때 증여세 0원, 결과 문구 정상 노출
- 누진세율 5단계 경계값(1억/5억/10억/30억) 계산 정확성
- URL 파라미터로 입력값 복원 정상 동작
- 모바일에서 입력 패널/결과 카드 overflow 여부
- `src/data/tools.ts` 등록 및 `/tools/` 목록 노출 여부

---

## 8. 다음 단계
1. `src/data/giftTaxChildCalculator.ts` 데이터 파일 작성
2. `src/pages/tools/gift-tax-child-calculator.astro` 페이지 작성 (`SimpleToolShell` 기반)
3. `public/scripts/gift-tax-child-calculator.js` 계산 로직 구현
4. `src/styles/scss/pages/_gift-tax-child-calculator.scss` 작성 후 `app.scss`에 import
5. `src/data/tools.ts` 등록, `public/sitemap.xml` 라우트 추가
6. `npm run build` 검증 후 `DEPLOY_CHECKLIST.md` 기준 점검
