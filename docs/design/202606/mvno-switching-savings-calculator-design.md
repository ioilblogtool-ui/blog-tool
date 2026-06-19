# 알뜰폰 갈아타기 절약 계산기 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 배경: 이통3사 고정 통신비에 대한 절감 수요는 연령·소득에 관계없이 일정하게 발생한다. "알뜰폰으로 갈아타면 얼마 아낄까?"를 숫자로 즉시 확인하게 해주는 생활 절약 계산기.
- 구현 대상: 현재 요금제 정보(기본료, 가족결합 할인, 선택약정 할인, 위약금)와 알뜰폰 예상 요금을 입력하면 월·1년·2년 누적 절감액, 위약금 손익분기점, 누적 절감액 그래프를 보여주는 계산기.
- 페이지 성격: `계산기형` — `SimpleToolShell` 기반, `resultFirst={true}`

### 1-2. 문서 역할
- 실제 구현 직전 수준까지 화면/데이터/계산식/구현 순서를 고정한다.
- Claude/Codex가 바로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 권장 slug
- `mvno-switching-savings-calculator`
- URL: `/tools/mvno-switching-savings-calculator/`
- 페이지 제목: `알뜰폰 갈아타기 절약 계산기 2026 | 월·1년·2년 통신비 절감액 계산`

### 1-4. 권장 파일 구조
- `src/data/mvnoSwitchingSavingsCalculator.ts`
- `src/pages/tools/mvno-switching-savings-calculator.astro`
- `public/scripts/mvno-switching-savings-calculator.js`
- `src/styles/scss/pages/_mvno-switching-savings-calculator.scss`
- `public/og/tools/mvno-switching-savings-calculator.png`

---

## 2. 구현 범위

### 2-1. MVP 범위
- 입력
  - 현재 기본료(이통3사), 가족결합 할인, 선택약정 할인, 잔여 위약금
  - 알뜰폰 월 요금, 가족결합 상실 추가 부담(토글)
  - 비교 기간(12/24/36개월 탭)
- 핵심 출력
  - 월 절감액, 1년 절감액, 2년 절감액(메인 accent 강조)
  - 위약금 손익분기점(개월)
  - 누적 절감액 라인 그래프(월별, 위약금 회수선 표시)
  - 현재 vs 알뜰폰 실납부액 비교 카드
- 알뜰폰 예시 요금제 버튼(클릭 시 입력값 자동 채우기)
- 알뜰폰 단점 체크리스트 섹션
- URL 파라미터로 상태 공유
- SEO: `SeoContent`(소개 2문단 이상, 기준 설명, FAQ 5개, 관련 링크 3개)

### 2-2. MVP 제외 범위
- 실제 알뜰폰 통신사별 요금제 실시간 조회(외부 API)
- 가족 구성원 수별 가족결합 해지 총 손익 계산 (2차 검토)
- 자동완성 약정 해지 위약금 공식 계산 (입력 항목이 너무 복잡 — 사용자 직접 입력으로 처리)
- 단말기 할부 잔액 고려

---

## 3. 페이지 목적

- "알뜰폰으로 갈아타면 얼마 아낄까?"를 월 단위가 아니라 **2년 누적 절감액으로 체감**시킨다. 월 2만원이라는 숫자보다 "2년 이면 48만원"이 행동을 유발한다.
- 가족결합·선택약정 할인을 함께 입력받아 **단순 요금 비교가 아닌 실납부 기준 비교**를 제공한다.
- 위약금 손익분기점을 보여줘 "지금 갈아타도 되는가?"라는 실행 직전 질문에 답한다.
- 알뜰폰 단점 체크리스트로 망설임을 해소해 **결정 보조 도구**로 기능한다.

---

## 4. 핵심 사용자 시나리오

### 4-1. "지금 갈아타면 얼마 아낄까?" 즉시 확인형
- 현재 통신비와 알뜰폰 예상 요금 입력 → 2년 절감액 확인 → 링크 복사해 공유

### 4-2. "가족결합 해지하면 손해 아닌가?" 검토형
- 가족결합 할인 금액 입력, 가족결합 상실 토글 ON → 상실 추가 부담 입력 → "결합 해지하더라도 알뜰폰 전환이 유리한지" 비교

### 4-3. "위약금 때문에 지금은 못 갈아타" 시점 계산형
- 위약금 입력 → 손익분기점(N개월 후) 확인 → 실제 전환 적기 파악

### 4-4. "어떤 요금제 선택해야 하나" 탐색형
- 알뜰폰 예시 요금제 버튼 클릭 → 자동 입력 → 즉시 절감액 비교 → 요금제 선택 기준 확인

---

## 5. 입력값 / 출력값 정의

### 5-1. 입력값

#### 현재 요금제 (이통3사)

| 입력 항목 | 유형 | 기본값 | 범위 |
|----------|------|--------|------|
| 현재 기본료 | 숫자 입력 + 슬라이더 | 65,000원 | 10,000~150,000원 / step 1,000 |
| 가족결합 할인 | 숫자 입력 | 0원 | 0~30,000원 |
| 선택약정 할인 | 숫자 입력 | 0원 | 0~20,000원 |
| 잔여 위약금 | 숫자 입력 | 0원 | 0~300,000원 |

> 현재 실납부액 = 기본료 − 가족결합 할인 − 선택약정 할인

#### 알뜰폰 예상 요금

| 입력 항목 | 유형 | 기본값 | 범위 |
|----------|------|--------|------|
| 알뜰폰 월 요금 | 숫자 입력 + 슬라이더 | 25,000원 | 5,000~80,000원 / step 1,000 |
| 가족결합 상실 여부 | 토글 버튼 | OFF | ON/OFF |
| 가족결합 상실 추가 부담 | 숫자 입력 (토글 ON 시 활성화) | 0원 | 0~30,000원 |

> 알뜰폰 실질 월 비용 = 알뜰폰 월 요금 + (가족결합 상실 ON ? 추가 부담 : 0)

#### 비교 기간

| 입력 항목 | 유형 | 기본값 |
|----------|------|--------|
| 비교 기간 | 탭 버튼 (12개월 / 24개월 / 36개월) | 24개월 |

### 5-2. 출력값

#### 핵심 KPI 카드 4개 (결과 우선 panel)

| 카드 | 내용 | 강조 |
|------|------|------|
| 2년 절감액 (또는 선택 기간 절감액) | 월 절감액 × 선택 기간 | **메인 accent** |
| 월 절감액 | 현재 실납부 − 알뜰폰 실질 비용 | 보조 |
| 1년 절감액 | 월 절감액 × 12 | 보조 |
| 위약금 회수 기간 | 위약금 ÷ 월 절감액 (개월) | 보조 |

> 위약금 = 0이면 "위약금 없음 · 즉시 전환 가능"  
> 월 절감액 ≤ 0이면 "현재 요금제가 더 유리합니다" 경고 배너 표시 (결과 패널 상단)

#### 누적 절감액 라인 그래프

- X축: 월(1 ~ 선택 기간 개월)
- Y축: 누적 절감액 (원, 위약금 차감 후 실질 누적)
- 위약금 회수 시점(누적 절감액 = 0 교차점)에 수직 점선 + 라벨
- 0 이하 구간은 음수로 표시 (위약금 미회수 기간 시각화)

#### 현재 vs 알뜰폰 비교 카드

```
[현재 요금제]           [알뜰폰]
기본료:   65,000원       월 요금:  25,000원
가족결합: -5,000원       결합상실:  +3,000원
선택약정: -10,000원
────────────────       ──────────────────
실납부:   50,000원      실질 비용: 28,000원

절감: 월 22,000원 · 2년 528,000원
```

---

## 6. 섹션 구조 (IA)

### 6-1. 전체 IA

```
[1] CalculatorHero
[2] 입력 패널 (aside)
    ├─ 현재 요금제 입력 그룹
    └─ 알뜰폰 요금 입력 그룹
[3] 결과 우선 panel (resultFirst)
    ├─ 경고 배너 (절감액 ≤ 0 시)
    ├─ KPI 카드 4개
    └─ 결과 하단 액션 링크
[4] 누적 절감액 그래프 섹션
[5] 현재 vs 알뜰폰 비교 카드 섹션
[6] 비교 기간 탭 (12/24/36개월)
[7] 알뜰폰 예시 요금제 버튼 섹션
[8] 알뜰폰 단점 체크리스트 섹션
[9] 계산 기준 요약 패널 (logic-grid)
[10] InfoNotice
[11] SeoContent + FAQ
```

### 6-2. 모바일 우선 화면 순서

Hero → 입력(현재 요금제) → 입력(알뜰폰 요금) → 비교 기간 탭 → 결과 KPI → 그래프 → 현재 vs 알뜰폰 비교 카드 → 예시 요금제 버튼 → 단점 체크리스트 → 계산 기준 → InfoNotice → SEO

### 6-3. PC 레이아웃 (SimpleToolShell)

- aside(입력): 왼쪽 칸 — 현재 요금제 + 알뜰폰 요금 + 비교 기간 탭
- main(결과): 오른쪽 칸 — 결과 우선 panel → 그래프 → 비교 카드 → 예시 요금제 → 단점 체크리스트 → 계산 기준 → InfoNotice → SEO

### 6-4. 섹션별 역할

#### CalculatorHero
- eyebrow: `통신비 절약`
- H1: `알뜰폰 갈아타기 절약 계산기`
- description: `현재 요금제와 알뜰폰 예상 요금을 입력하면 월·1년·2년 절감액과 위약금 회수 기간을 바로 계산합니다.`

#### 입력 패널 — 현재 요금제 그룹
- 패널 제목: "현재 이통3사 요금제"
- 기본료 슬라이더 + 숫자 입력
- 가족결합 할인 숫자 입력
- 선택약정 할인 숫자 입력
- 잔여 위약금 숫자 입력
- 하단에 실납부액 실시간 표시: `실납부액: 50,000원`

#### 입력 패널 — 알뜰폰 요금 그룹
- 패널 제목: "알뜰폰 예상 요금"
- 알뜰폰 월 요금 슬라이더 + 숫자 입력
- 가족결합 상실 여부 토글 (ON/OFF)
- 가족결합 상실 추가 부담 입력 (토글 ON 시 animate-in 표시)
- 하단에 알뜰폰 실질 비용 실시간 표시: `알뜰폰 실질 비용: 28,000원`

#### 비교 기간 탭
- 12개월 / 24개월 / 36개월 탭 버튼 (aria-pressed 패턴)
- 탭 변경 시 KPI 카드 + 그래프 즉시 갱신

#### 결과 우선 panel
- 경고 배너: `월 절감액이 0 이하입니다. 현재 요금제가 더 유리할 수 있습니다.` (음수 시 노출)
- KPI 카드 4개 (2×2 그리드 → PC에서 4열)
- 하단 링크: "입력값 수정" → aside 앵커, "알뜰폰 요금제 예시 보기" → #mvss-presets 앵커

#### 누적 절감액 그래프
- 섹션 eyebrow: `누적 절감`
- H2: `갈아타면 시간이 지날수록 이만큼 쌓입니다`
- line chart: 월별 누적 절감액 (위약금 차감 후), 0 교차선 수직 점선
- 하단 설명: "X개월째부터 위약금 회수 완료"

#### 현재 vs 알뜰폰 비교 카드
- 섹션 eyebrow: `요금 비교`
- H2: `현재 요금제와 알뜰폰, 실제 납부액 차이`
- 2열 카드: 현재 요금제 명세 / 알뜰폰 명세 (항목별 나열, 합계 강조)

#### 알뜰폰 예시 요금제 버튼 섹션
- 섹션 eyebrow: `요금제 예시`
- H2: `어떤 알뜰폰 요금제가 나한테 맞을까?`
- 버튼 5개 (클릭 시 알뜰폰 월 요금 입력값 자동 채우기 + 즉시 재계산)
  - `초저가 7,700원 · 1GB+속도제한`
  - `중간 15,000원 · 10GB+속도제한`
  - `데이터 많이 25,000원 · 30GB+속도제한`
  - `무제한 39,000원 · 완전무제한`
  - `서브폰 12,000원 · 데이터 쉐어링`
- 하단 참고 문구: "2026년 6월 기준 공개 요금제 예시. 실제 요금은 통신사·프로모션에 따라 다릅니다."

#### 알뜰폰 단점 체크리스트
- 섹션 eyebrow: `갈아타기 전 확인`
- H2: `이 항목들이 괜찮으면 갈아타도 됩니다`
- 체크리스트 8개 항목 (카드 형태, 각 항목에 중요도 배지)
- 하단 결론 카드: 주요 항목별 판단 기준 요약

#### 계산 기준 요약 패널 (logic-grid)
- logic-card 4개
  - 현재 실납부액 계산 방식
  - 알뜰폰 실질 비용 계산 방식
  - 누적 절감액 계산 방식
  - 위약금 손익분기점 계산 방식

#### InfoNotice
- "실제 위약금·해지 조건은 현재 계약서와 해당 통신사 고객센터에서 확인하세요."
- "알뜰폰 요금 예시는 참고용 추정이며, 프로모션 종료·변경에 따라 달라질 수 있습니다."
- "가족결합 상실 여부 및 금액은 현재 계약 조건에 따라 다릅니다."

---

## 7. 컴포넌트 구조

### 7-1. 공용 컴포넌트
- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`, `ToolActionBar`
- `SimpleToolShell` (`resultFirst={true}`)
- `chart-config.js`: `CHART_COLORS`, `buildDefaultOptions`, `makeLabelPlugin`
- `url-state.js`: `readParam`, `writeParams`

### 7-2. 페이지 전용 블록 (prefix: `mvss-`)

| 클래스 | 역할 |
|--------|------|
| `mvss-input-group` | 현재/알뜰폰 입력 그룹 패널 |
| `mvss-realtime-label` | 실납부액/실질비용 실시간 표시 줄 |
| `mvss-toggle-row` | 가족결합 상실 토글 행 |
| `mvss-period-tabs` | 비교 기간 탭 버튼 행 |
| `mvss-kpi-grid` | KPI 카드 4개 그리드 |
| `mvss-warning-banner` | 절감액 음수 시 경고 배너 |
| `mvss-chart-wrap` | 누적 절감액 라인 그래프 캔버스 래퍼 |
| `mvss-compare-grid` | 현재 vs 알뜰폰 2열 비교 카드 |
| `mvss-compare-card` | 개별 비교 명세 카드 |
| `mvss-preset-grid` | 알뜰폰 예시 요금제 버튼 그리드 |
| `mvss-preset-btn` | 개별 예시 요금제 버튼 |
| `mvss-checklist` | 단점 체크리스트 그리드 |
| `mvss-checklist-item` | 개별 체크리스트 카드 |
| `mvss-conclusion-card` | 단점 섹션 결론 카드 |

### 7-3. Astro 페이지 구성 방식
- `.astro`에서 예시 요금제 배열 및 체크리스트 배열을 서버사이드에서 렌더 (정적 HTML)
- `<script id="mvssConfig" type="application/json">` 으로 예시 요금제 데이터 전달 (클릭 시 자동 입력용)
- `public/scripts/mvno-switching-savings-calculator.js`에서 입력 변경 → 계산 → 렌더 → URL 동기화
- Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 구현 (기존 패턴과 동일)

---

## 8. 상태 관리

### 8-1. 클라이언트 상태
```ts
type ViewState = {
  baseFee: number;           // 현재 기본료 (원)
  familyDiscount: number;    // 가족결합 할인 (원)
  contractDiscount: number;  // 선택약정 할인 (원)
  earlyTermFee: number;      // 잔여 위약금 (원)
  mvnoFee: number;           // 알뜰폰 월 요금 (원)
  familyLost: boolean;       // 가족결합 상실 여부
  familyLossAmount: number;  // 가족결합 상실 추가 부담 (원)
  period: 12 | 24 | 36;     // 비교 기간 (개월)
};
```

### 8-2. 초기값
```ts
{
  baseFee: 65000,
  familyDiscount: 0,
  contractDiscount: 0,
  earlyTermFee: 0,
  mvnoFee: 25000,
  familyLost: false,
  familyLossAmount: 0,
  period: 24,
}
```

### 8-3. 동작 규칙
- 모든 입력 변경 시 → 즉시 `render()` 호출 (debounce 없음, 숫자 입력은 `input` 이벤트)
- 가족결합 상실 토글 OFF → `familyLossAmount` 계산에서 제외 (입력 필드 비활성화 + `mvss-toggle-row__input` 숨김)
- 비교 기간 탭 변경 시 → KPI 카드 (선택 기간 절감액) + 그래프 X축 범위 함께 갱신
- 슬라이더 ↔ 숫자 입력 양방향 동기화

---

## 9. 계산 로직

### 9-1. 현재 실납부액 (월)
```js
const currentMonthly = baseFee - familyDiscount - contractDiscount;
// 음수 방지 처리: Math.max(0, ...)
```

### 9-2. 알뜰폰 실질 월 비용
```js
const mvnoMonthly = mvnoFee + (familyLost ? familyLossAmount : 0);
```

### 9-3. 월 절감액
```js
const monthlySaving = currentMonthly - mvnoMonthly;
// 음수 가능 (현재가 더 저렴한 경우)
```

### 9-4. 기간별 절감액 (위약금 무관, 순수 요금 절감)
```js
const saving12 = monthlySaving * 12;
const saving24 = monthlySaving * 24;
const saving36 = monthlySaving * 36;
const savingPeriod = monthlySaving * period; // 선택 기간
```

### 9-5. 누적 절감액 그래프 데이터 (위약금 차감 후 실질)
```js
const chartData = Array.from({ length: period }, (_, i) => {
  const month = i + 1;
  return {
    month,
    cumulative: monthlySaving * month - earlyTermFee,
  };
});
// cumulative 값은 음수 가능 (위약금 미회수 구간)
```

### 9-6. 위약금 손익분기점 (개월)
```js
const breakEvenMonths = (earlyTermFee > 0 && monthlySaving > 0)
  ? Math.ceil(earlyTermFee / monthlySaving)
  : 0;
// monthlySaving <= 0이면 손익분기 없음 (전환 비추천)
```

### 9-7. 경고 조건
```js
const isWarning = monthlySaving <= 0;
// → 결과 패널 상단 경고 배너 표시
// → KPI 카드 절감액을 음수로 표시하되 "현재 요금제가 더 유리합니다" 안내 병기
```

---

## 10. 데이터 파일 구조

### 10-1. `src/data/mvnoSwitchingSavingsCalculator.ts`

```ts
export interface MvnoPreset {
  id: string;
  label: string;      // "초저가 7,700원"
  fee: number;        // 7700
  dataDesc: string;   // "1GB+속도제한"
  callDesc: string;   // "기본 통화"
  note: string;       // "어르신·단순 통화용"
}

export interface ChecklistItem {
  id: string;
  title: string;      // "망 품질"
  detail: string;     // "SKT·KT·LGU+ 망 임차해 사용..."
  importance: "high" | "medium" | "low";
  conclusion: string; // "체감 차이 없는 경우 많음"
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export const MVSS_META = {
  slug: "mvno-switching-savings-calculator",
  title: "알뜰폰 갈아타기 절약 계산기 2026 | 월·1년·2년 통신비 절감액 계산",
  description:
    "현재 요금제와 알뜰폰 예상 요금 입력하면 월·1년·2년 절감액 즉시 계산. 가족결합·선택약정 해지 시 손익분기점까지 한눈에 비교.",
  updatedAt: "2026년 6월 기준",
  caution:
    "실제 위약금·해지 조건은 현재 계약서와 해당 통신사 고객센터에서 확인하세요. 요금제 예시는 참고용입니다.",
};

export const MVSS_DEFAULT = {
  baseFee: 65000,
  familyDiscount: 0,
  contractDiscount: 0,
  earlyTermFee: 0,
  mvnoFee: 25000,
  familyLost: false,
  familyLossAmount: 0,
  period: 24,
};

export const MVSS_PRESETS: MvnoPreset[] = [
  { id: "ultra-cheap", label: "초저가", fee: 7700, dataDesc: "1GB+속도제한", callDesc: "기본 통화", note: "어르신·단순 통화용" },
  { id: "mid",        label: "중간",   fee: 15000, dataDesc: "10GB+속도제한", callDesc: "무제한", note: "가성비 추천" },
  { id: "data-heavy", label: "데이터 많이", fee: 25000, dataDesc: "30GB+속도제한", callDesc: "무제한", note: "유튜브·SNS 많이" },
  { id: "unlimited",  label: "무제한", fee: 39000, dataDesc: "완전 무제한", callDesc: "무제한", note: "헤비유저용" },
  { id: "sub-phone",  label: "서브폰", fee: 12000, dataDesc: "데이터 쉐어링", callDesc: "기본 통화", note: "자녀폰·보조폰용" },
];

export const MVSS_CHECKLIST: ChecklistItem[] = [
  { id: "network",   title: "망 품질",        detail: "이통3사 망 임차해 사용. 같은 망이라 체감 차이 거의 없음.", importance: "high",   conclusion: "일반 사용자에게 체감 차이 없는 경우 多" },
  { id: "cs",        title: "고객센터",        detail: "대형 이통사보다 불편. 챗봇·앱 위주, 전화 상담 제한적.", importance: "medium", conclusion: "앱·챗봇에 익숙하면 큰 문제 없음" },
  { id: "handset",   title: "단말기 지원금",   detail: "단말기 지원금 없거나 미미. 자급제 폰 구매가 유리.", importance: "high",   conclusion: "자급제 폰 보유 or 구매 예정이면 문제없음" },
  { id: "family",    title: "가족결합 불가",   detail: "이통3사 가족결합 플랜 불가. 알뜰폰끼리는 일부 가능.", importance: "high",   conclusion: "가족결합 할인이 크지 않으면 전환 유리" },
  { id: "5g",        title: "5G 지원",         detail: "LTE 전용 요금제 많음. 5G 요금제는 일부 MVNO만 제공.", importance: "medium", conclusion: "5G 필요 없으면 LTE로도 충분" },
  { id: "roaming",   title: "로밍 서비스",     detail: "국제로밍 서비스 제한적. 해외 여행 잦은 사람은 주의.", importance: "low",    conclusion: "해외 여행 잦으면 유심 대여 or 현지 유심 활용" },
  { id: "membership",title: "멤버십 혜택",     detail: "SKT T멤버십·KT 멤버십 혜택 상실.", importance: "medium", conclusion: "멤버십 적극 사용자는 혜택 가치 먼저 계산" },
  { id: "mnp",       title: "번호이동 절차",   detail: "온라인 신청 가능, 10~30분 내 처리. 실제로 매우 간단.", importance: "low",    conclusion: "절차 복잡함 걱정은 기우. 30분이면 완료" },
];

export const MVSS_FAQ: PageFaqItem[] = [
  {
    question: "알뜰폰으로 갈아타면 가족결합 할인은 어떻게 되나요?",
    answer:
      "이통3사(SKT·KT·LGU+)의 가족결합 플랜은 알뜰폰 전환 시 해지됩니다. 가족 구성원 전체의 결합 할인이 사라지므로, 가족결합 할인 총액과 알뜰폰 전환으로 절약되는 금액을 비교해 결정해야 합니다. 이 계산기의 '가족결합 상실 추가 부담' 항목에 상실되는 할인금액을 입력하면 실질 절감액을 함께 계산할 수 있습니다.",
  },
  {
    question: "선택약정 24개월 약정 중 해지하면 위약금이 얼마나 나오나요?",
    answer:
      "선택약정 위약금은 잔여 약정 기간과 할인받은 금액을 기준으로 계산됩니다. 통신사·요금제·잔여 개월수에 따라 다르므로, 해당 통신사 고객센터(114) 또는 공식 앱에서 '위약금 조회'로 정확한 금액을 확인한 뒤 이 계산기의 '잔여 위약금' 항목에 입력하면 됩니다.",
  },
  {
    question: "알뜰폰이 이통3사보다 통화·데이터 품질이 나쁜가요?",
    answer:
      "알뜰폰은 이통3사(SKT·KT·LGU+)의 망을 임차해 서비스합니다. 같은 물리적 기지국을 쓰기 때문에 일반적인 통화·데이터 품질은 크게 다르지 않습니다. 다만 네트워크 혼잡 시 우선순위가 낮을 수 있고, 일부 알뜰폰은 5G 대신 LTE 망만 제공합니다.",
  },
  {
    question: "번호이동은 어떻게 하나요? 절차가 복잡한가요?",
    answer:
      "알뜰폰 통신사 홈페이지 또는 앱에서 온라인으로 신청할 수 있습니다. 기존 통신사에 개통된 유심을 새 알뜰폰 유심으로 교체하거나, 기존 번호를 이동(MNP)하는 방식입니다. 보통 신청 후 10~30분 내 개통이 완료되며, 서류 준비·방문 없이 온라인으로 처리가 가능합니다.",
  },
  {
    question: "알뜰폰에서도 5G를 쓸 수 있나요?",
    answer:
      "일부 알뜰폰 통신사는 5G 요금제를 제공합니다. 단, 모든 알뜰폰이 5G를 지원하는 건 아니며 LTE 전용 요금제가 더 많습니다. 5G가 반드시 필요한 사용자라면 가입 전 해당 알뜰폰 통신사의 5G 지원 여부를 확인하세요.",
  },
];

export const MVSS_RELATED_LINKS = [
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기 — 통신비 절약이 연봉에서 차지하는 비중 확인" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기" },
  { href: "/tools/couple-salary-rank-calculator/", label: "맞벌이 가구소득 계산기" },
];
```

### 10-2. 등록 파일
- `src/data/tools.ts` — 카테고리 `생활·유틸리티`
- `public/sitemap.xml`

---

## 11. 구현 순서

### 11-1. 1단계: 데이터 파일 작성
- `src/data/mvnoSwitchingSavingsCalculator.ts` 생성
- `MVSS_META`, `MVSS_DEFAULT`, `MVSS_PRESETS`, `MVSS_CHECKLIST`, `MVSS_FAQ`, `MVSS_RELATED_LINKS` 작성

### 11-2. 2단계: Astro 페이지 생성
- `src/pages/tools/mvno-switching-savings-calculator.astro`
- `SimpleToolShell resultFirst={true}` 기반
- aside 슬롯: 현재 요금제 입력 그룹 + 알뜰폰 요금 입력 그룹 + 비교 기간 탭 + 계산 버튼
- main 슬롯: 결과 panel → 그래프 → 비교 카드 → 예시 요금제 → 단점 체크리스트 → logic-grid → InfoNotice
- seo 슬롯: SeoContent
- `<script id="mvssConfig" type="application/json">` 으로 MVSS_PRESETS 전달

### 11-3. 3단계: 스크립트 구현
- `public/scripts/mvno-switching-savings-calculator.js`
- 입력 이벤트 바인딩 (input/change), 슬라이더 양방향 동기화
- 가족결합 상실 토글 ON/OFF 핸들링 (추가 입력 필드 show/hide)
- 비교 기간 탭 핸들링 (period 변경 → KPI + 그래프 갱신)
- 계산 로직(9장), 결과 렌더, 경고 배너 토글
- 라인 그래프 렌더 (Chart.js), 위약금 회수선 어노테이션
- 예시 요금제 버튼 클릭 핸들러 (mvnoFee 자동 입력 + render 호출)
- URL 파라미터 동기화 (`readParam`, `writeParams`)
- 초기화·링크복사 버튼

### 11-4. 4단계: SCSS 작성
- `src/styles/scss/pages/_mvno-switching-savings-calculator.scss` 생성
- `src/styles/app.scss`에 import 추가
- 가족결합 상실 토글 행 show/hide 애니메이션 (`max-height` transition)
- 예시 요금제 버튼 그리드 (모바일 2열 / PC 5열)
- 단점 체크리스트 그리드 (모바일 1열 / PC 2열)
- 경고 배너 (amber/warning 색조)

### 11-5. 5단계: 등록 및 SEO 마무리
- `src/data/tools.ts` 등록 (카테고리: `생활·유틸리티`)
- `public/sitemap.xml` 추가
- `SeoContent` props: intro 3문단, inputPoints 3개, criteria 4개, faq 5개, related 3개
- OG 이미지 생성 (`npm run og:generate`)

### 11-6. 6단계: 빌드/배포 점검
- `npm run build` 통과 확인
- `DEPLOY_CHECKLIST.md` 기준 점검

---

## 12. URL 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `base` | number | 65000 | 현재 기본료 |
| `fam` | number | 0 | 가족결합 할인 |
| `sel` | number | 0 | 선택약정 할인 |
| `etf` | number | 0 | 위약금 |
| `mvno` | number | 25000 | 알뜰폰 월 요금 |
| `fl` | number | 0 | 가족결합 상실 추가 부담 (0이면 토글 OFF) |
| `period` | 12/24/36 | 24 | 비교 기간(개월) |

예시:
```
/tools/mvno-switching-savings-calculator/?base=65000&fam=5000&sel=10000&etf=0&mvno=25000&fl=0&period=24
```

---

## 13. QA 체크포인트

### 13-1. 계산 정확성
- [ ] 현재 실납부액 = 기본료 − 가족결합 할인 − 선택약정 할인 (음수 방지)
- [ ] 알뜰폰 실질 비용 = 알뜰폰 월 요금 + (가족결합 상실 ON ? 추가 부담 : 0)
- [ ] 월 절감액이 음수일 때 경고 배너 표시, KPI 카드에 음수 값 올바르게 표시
- [ ] 위약금 0일 때 손익분기점 카드 "즉시 전환 가능" 표시
- [ ] 비교 기간 변경 시 KPI "선택 기간 절감액"과 그래프 X축 범위가 함께 바뀌는지 확인

### 13-2. 입력 인터랙션
- [ ] 슬라이더 ↔ 숫자 입력 양방향 동기화
- [ ] 가족결합 상실 토글 ON → 추가 입력 필드 animate-in, OFF → animate-out (계산에서 0으로 처리)
- [ ] 예시 요금제 버튼 클릭 → 알뜰폰 월 요금 입력값 자동 채우기 + 즉시 재계산
- [ ] 비교 기간 탭: 1개만 active 상태, aria-pressed 적용

### 13-3. 그래프
- [ ] 위약금 > 0이고 monthlySaving > 0일 때 수직 회수선이 올바른 X 위치에 표시되는지
- [ ] 위약금 = 0이면 회수선 미표시
- [ ] monthlySaving ≤ 0이면 그래프 전 구간 0 이하 (음수 누적) 표시

### 13-4. SEO / 운영
- [ ] `tools.ts` 등록 및 `/tools/` 목록 노출 (카테고리: 생활·유틸리티)
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` FAQ 5개 + related 3개
- [ ] InfoNotice에 참고·추정 문구 및 "고객센터 확인" 안내 포함
- [ ] `npm run build` 통과, route `dist/tools/mvno-switching-savings-calculator/index.html` 생성 확인

---

## 14. 구현 메모

### 14-1. 그래프 라이브러리 처리
- Chart.js Line chart 사용 (`type: "line"`)
- 위약금 회수 시점 수직선: `annotation` 플러그인 없이 `afterDraw` 훅으로 직접 ctx 렌더 (외부 플러그인 미사용 원칙)
- 음수 구간 색 강조: `fill: true`, `backgroundColor`를 조건부로 음수 구간 red-alpha / 양수 구간 brand-alpha 처리는 1차 단순화 버전에서 단색으로 처리

### 14-2. 가족결합 상실 토글 UX
- 토글 OFF 상태에서 `familyLossAmount` 입력 필드를 `display:none`이 아닌 `max-height: 0; overflow: hidden` 트랜지션으로 처리 → 자연스러운 접힘 효과
- 토글 ON 시 `max-height: 200px`로 애니메이션 확장

### 14-3. tools.ts 등록 previewStats
```ts
previewStats: [
  { label: "월 절감액 예시", value: "약 3.7만원" },
  { label: "2년 절감액 예시", value: "약 88만원" },
]
```
(기본값 기준: 실납부 50,000원 − 알뜰폰 12,500원 = 월 37,500원 절약 가정)

> 실제 기본값(baseFee 65,000 / mvnoFee 25,000)으로 계산 시: 월 40,000원 · 2년 960,000원 → previewStats는 반올림 표기로 "약 4만원 / 약 96만원"으로 조정

### 14-4. SeoContent 작성 가이드
- intro: ① 알뜰폰 갈아타기 계산기란 무엇인가 ② 가족결합·선택약정을 함께 고려해야 하는 이유 ③ 위약금 손익분기 확인법
- inputPoints: ① 현재 실납부액 자동 계산 ② 가족결합 상실 옵션 ③ 비교 기간 선택(12/24/36개월)
- criteria: ① 실납부액 계산 방식 ② 알뜰폰 실질 비용 계산 방식 ③ 누적 절감액(위약금 차감 후) ④ 요금제 예시는 참고용 추정값
