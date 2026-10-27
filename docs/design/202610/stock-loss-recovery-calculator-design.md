# 주식 손실 복구율 계산기 — 설계 문서

> 기획 원문: [stock-loss-recovery-calculator.md](../../plan/202610/stock-loss-recovery-calculator.md)
> 작성일: 2026-10-27 (한국시간)
> 문서 상태: **설계 작성 완료 / 구현·검증·배포 미착수**
> 외부 데이터 의존 없음. 산식·반올림·테스트 케이스는 기획서에서 확정·검산한 값을 따른다.

## 1. 개요와 구현 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `stock-loss-recovery-calculator` / `/tools/stock-loss-recovery-calculator/` |
| 유형 / 카테고리 | calculator / `topicBySlug: "투자·재테크"`, `tools.ts category: "investment"`(기존 손익분기점 계산기와 동일 값) |
| 레이아웃 | `SimpleToolShell` (`calculatorId`, `pageClass="slr-page"`, `resultFirst={true}`) — 손익분기점 계산기와 동일 구조 |
| 코드·스타일 prefix | `SLR_` / `slr-` / DOM id `slr*` |
| 데이터 파일 | `src/data/stockLossRecoveryCalculator.ts` |
| 클라이언트 JS | `public/scripts/stock-loss-recovery-calculator.js` (module, `url-state.js` import) |
| 차트 | Chart.js 라인 1개(손실률→필요 상승률 곡선 + 사용자 위치 점). fallback 기준표 |
| 수수료·세금 | 미반영(명시). 손익분기점 계산기로 연결 |
| 배지 | 결과 카드 `시뮬레이션`, 기준표는 "계산식" 라벨 |
| Title | `주식 손실 복구율 계산기 2026 \| 몇 % 올라야 본전일까` |
| Description | 기획서 문구 |
| OG | `public/og/tools/stock-loss-recovery-calculator.png` (TOOLS 배열 추가) |

### 코드 확인으로 정리한 사항

- `stock-breakeven-calculator.astro`는 `SimpleToolShell` 슬롯 `hero`·`actions`·`aside`(입력)·기본 슬롯(결과)을 사용하고, `ToolActionBar resetId/copyId`로 초기화·링크 복사 버튼을 만든다. 같은 구조를 따른다.
- 손익분기점 계산기 JSON-LD는 `WebApplication` + `mainEntity: FAQPage`. 동일 패턴.
- 금액 입력은 `type="text" inputmode="numeric" class="input-number"`로 콤마 표시(손익분기점 계산기 `sbcBuyPrice` 패턴). 수량은 `type="number" step="1"`.
- 레버리지 계산기의 설정 주입 패턴(`<script id="...Config" type="application/json">`)을 사용한다.

## 2. 파일 구조와 책임

| 파일 | 작업 | 책임 |
|---|---|---|
| `src/data/stockLossRecoveryCalculator.ts` | 신규 | 메타, 기본값, 프리셋, 기준표 손실률 목록, 반등률 목록, FAQ, intro, 관련 링크 |
| `src/pages/tools/stock-loss-recovery-calculator.astro` | 신규 | 마크업, SSR 초기 결과(기본값), JSON-LD, config 주입 |
| `public/scripts/stock-loss-recovery-calculator.js` | 신규 | 입력 파싱, 계산, 렌더, URL 상태, 차트 |
| `src/styles/scss/pages/_stock-loss-recovery-calculator.scss` | 신규 | `slr-` 스타일 |
| `src/styles/app.scss` | 수정 | `@use` 추가 |
| `src/data/tools.ts` | 수정 | 등록 |
| `src/pages/index.astro` | 수정 | `topicBySlug` |
| `public/sitemap.xml` | 수정 | URL |
| `src/data/stockBreakevenCalculator.ts` | 수정 | `SBC_RELATED_LINKS`에 역링크 1개 추가 |
| `scripts/generate-og-tools.py` | 수정 | TOOLS 항목 |

## 3. 데이터 설계

```ts
export type SlrMode = "price" | "rate";

export const SLR_META = {
  slug: "stock-loss-recovery-calculator",
  eyebrow: "주식 계산기",
  h1: "주식 손실, 몇 % 올라야 본전일까",
  seoTitle: "주식 손실 복구율 계산기 2026 | 몇 % 올라야 본전일까",
  seoDescription: "매수가와 현재가를 입력하면 손실률과 본전까지 필요한 상승률을 바로 계산합니다. 추가매수(물타기) 후 평균단가와 반등률별 손익 시뮬레이션도 함께 확인하세요.",
  updatedAt: "배포일",
};

export const SLR_DEFAULT_INPUT = {
  mode: "price" as SlrMode,
  buyPrice: 100_000,
  currentPrice: 70_000,
  quantity: 100,
  lossRate: 30,          // % (rate 모드)
  addAmount: 0,
  addPrice: null as number | null,   // null = 현재가 연동
};

export const SLR_LOSS_PRESETS = [10, 20, 30, 50];          // 매수가 100,000 기준 현재가 자동
export const SLR_REBOUND_STEPS = [0.05, 0.1, 0.2, 0.3];
export const SLR_REFERENCE_LOSSES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];
export const SLR_CHART_LOSS_RANGE = { min: 5, max: 90, step: 5 };
```

- `SLR_FAQ`: 기획서 6개 질문, 답변 2~3문장, `{ question, answer }`. 예시 수치(−30% → +42.9%)는 기준표와 같은 반올림(1자리).
- `SLR_SEO_INTRO`: 기획서 7장 4단락(각 150자 이상).
- `SLR_RELATED_LINKS`: 손익분기점 계산기, 레버리지 ETF 계산기, 적립식 투자 계산기, 코스피 10월 급락 리포트(`requiresPage` 조건부).

## 4. 상태와 URL

| 상태 키 | URL 파라미터 | 비고 |
|---|---|---|
| mode | `m` (`price`/`rate`) | |
| buyPrice | `bp` | 원 |
| currentPrice | `cp` | 원 |
| quantity | `q` | 주 |
| lossRate | `lr` | %, rate 모드만 |
| addAmount | `aa` | 원, 0이면 생략 |
| addPrice | `ap` | 현재가 연동이면 생략 |

- 기본값과 같은 키·모드에 해당하지 않는 키(`price` 모드의 `lr` 등)는 URL에서 제거한다. `writeParams`는 키 삭제를 지원하지 않으므로 레버리지 계산기 설계서에서 추가하는 `url-state.js`의 `deleteParams(keys)`를 함께 쓴다(먼저 구현되는 쪽이 헬퍼를 추가).
- `addPrice` 연동 규칙: 사용자가 추가매수 가격 필드를 직접 수정하기 전까지 현재가 변경 시 자동 동기화(`data-linked="true"`). 직접 수정하면 연동 해제, "현재가와 같게" 링크 버튼으로 재연동.
- rate 모드: 매수가 100,000·수량 100 가상값으로 계산하되 금액 카드는 숨기고 % 결과만 표시. 추가매수 패널 비활성(가격 정보 없음 안내).

## 5. 계산 계약

### 5-1. 순수 함수 (JS 모듈 내부, export 없음)

```js
function calcBase({ buyPrice, currentPrice, quantity }) {
  const cost = buyPrice * quantity;
  const value = currentPrice * quantity;
  const pnl = value - cost;
  const lossRate = 1 - currentPrice / buyPrice;          // 손실이면 양수
  const recoveryNeeded = currentPrice > 0 ? buyPrice / currentPrice - 1 : null;
  return { cost, value, pnl, lossRate, recoveryNeeded, breakevenPrice: buyPrice };
}

function calcAveraging({ buyPrice, currentPrice, quantity, addAmount, addPrice }) {
  const addQty = addPrice > 0 ? Math.floor(addAmount / addPrice) : 0;
  const spent = addQty * addPrice;
  const leftover = addAmount - spent;
  const totalQty = quantity + addQty;
  const totalCost = buyPrice * quantity + spent;
  const avgPrice = totalCost / totalQty;
  const recoveryNeeded = currentPrice > 0 ? avgPrice / currentPrice - 1 : null;
  return { addQty, spent, leftover, totalQty, totalCost, avgPrice, recoveryNeeded,
           costIncreaseRate: spent / (buyPrice * quantity) };
}

function calcRebound(currentPrice, qty, cost, g) {
  const value = currentPrice * (1 + g) * qty;
  return { value, pnl: value - cost, returnRate: value / cost - 1 };
}

const recoveryFromLoss = (L) => (L < 1 ? L / (1 - L) : null);   // 기준표·차트
```

- 부동소수 오차 방지: `Math.floor(addAmount / addPrice + 1e-9)`.
- 수익 상태(currentPrice ≥ buyPrice): `recoveryNeeded`를 0으로 표시하고 "이미 본전 이상입니다" + 현재 수익률.

### 5-2. 표시 함수

| 함수 | 규칙 |
|---|---|
| `fmtWon(v)` | `Math.round`, `toLocaleString("ko-KR")` + "원", 음수 "−" 부호 |
| `fmtPrice(v)` | 정수면 원 단위, 소수면 `minimumFractionDigits: 0, maximumFractionDigits: 2` |
| `fmtPct(v, d=2)` | `(v*100).toFixed(d)` + "%", 양수 `+` |
| `fmtPctRef(v)` | 기준표·FAQ용 `d=1` |
| `fmtQty(v)` | "42주" |

### 5-3. 입력 검증

| 조건 | 처리 |
|---|---|
| buyPrice ≤ 0 / 빈 값 | 필드 오류 "매수가를 입력해 주세요", 결과 직전 유효값 유지 |
| currentPrice = 0 | 결과 카드에 "가격이 0이면 상승률로 복구할 수 없습니다", 반등표·추가매수 숨김 |
| quantity < 1 또는 소수 | `Math.max(1, Math.floor())`로 보정 후 필드 값 갱신 |
| lossRate ≥ 100 또는 < 0 | rate 모드 오류 "0 이상 100 미만" |
| addAmount < addPrice | `addQty=0`, "1주도 살 수 없는 금액입니다" 안내, 추가매수 카드는 전 상태 유지 |
| addPrice ≤ 0 | 필드 오류 |
| 결과에 `NaN`/`Infinity` | 렌더 함수에서 "—"로 치환(최종 가드) |

## 6. 화면·인터랙션·스타일

### 6-1. 섹션 순서 (SimpleToolShell, resultFirst)

1. hero: `CalculatorHero` eyebrow "주식 계산기", title `SLR_META.h1`, description "매수가와 현재가만 넣으면 본전까지 필요한 상승률을 바로 보여줍니다. -50%는 +100%가 필요합니다." + `InfoNotice` 3줄(수수료·세금 미반영 / 추가매수 권유 아님 / 미래 주가 예측 아님)
2. actions: `ToolActionBar resetId="slrResetBtn" copyId="slrCopyLinkBtn"`
3. aside(입력):
   - 모드 토글 `[data-slr-mode]` (가격 입력 / 손실률만)
   - 패널 "보유 종목": 매수가 `#slrBuyPrice`, 현재가 `#slrCurrentPrice`, 수량 `#slrQuantity`, 손실률 `#slrLossRate`(rate 모드에서만 표시)
   - 프리셋 칩 `[data-slr-preset="30"]` 4개
   - 패널 "추가매수(선택)": 금액 `#slrAddAmount`, 가격 `#slrAddPrice` + 연동 버튼 `#slrAddPriceSync`
4. 결과(본문 슬롯):
   - 핵심 카드: `[data-slr-result="recoveryNeeded"]` 큰 숫자 + 배지 `시뮬레이션`, 보조 `lossRate`, `pnl`, `breakevenPrice`
   - 추가매수 비교 카드 `[data-slr-avg]`: 평균단가 전→후, 필요 상승률 전→후, 투자원금 전→후(+%), 추가 수량·잔액. **투자원금 증가를 필요 상승률과 같은 글자 크기**로.
   - 반등표 `<table data-slr-rebound>`: 행 +5/+10/+20/+30%, 열 [평가금액, 손익, 수익률] × [추가매수 전, 후(있을 때)]
   - 기준표 + 차트: `<canvas id="slrChart">`, fallback `<table class="slr-ref">`
   - 손익분기점 계산기 안내 박스 ("수수료·거래세까지 넣은 본전 매도가는 …")
5. `SeoContent` intro 4, criteria(계산 기준 4줄), FAQ 6, related 4

### 6-2. 렌더 흐름

```
hydrateFromUrl() → readInputs() → validate() → calcBase/calcAveraging/calcRebound
→ renderCards() → renderRebound() → updateChartPoint() → writeParams()
```

- `input` 이벤트마다 즉시 렌더(QUALITY 3-3 5점 기준). 금액 필드는 `blur` 시 콤마 재포맷, 계산은 콤마 제거 값.
- 차트는 최초 1회 생성, 이후 사용자 점(dataset 2)만 갱신. 손실률 > 90%면 점 숨기고 "차트 범위 밖" 캡션.
- 초기화: `SLR_DEFAULT_INPUT`로 복원, `deleteParams(["m","bp","cp","q","lr","aa","ap"])`.

### 6-3. SCSS

- `.slr-page` 하위 스코프, 중첩 3단계 이내, 리터럴 색상(기존 계산기 팔레트).
- `.slr-hero-number` 데스크톱 40px / 모바일 32px.
- 반등표 ≤480px: 열 그룹을 탭(추가매수 전/후)으로 전환하지 않고 행 카드(`display:block`)로 변환, 가로 스크롤 없음.
- 오류 문구 `.slr-field-error` `aria-live="polite"`.

## 7. SEO·내부 링크·등록

### 메타·JSON-LD

`WebApplication`(name "주식 손실 복구율 계산기", applicationCategory "FinanceApplication") + `mainEntity: FAQPage`. `ogImage="/og/tools/stock-loss-recovery-calculator.png"`.

### 내부 링크

| 대상 | 위치 |
|---|---|
| `/tools/stock-breakeven-calculator/` | 결과 하단 안내 박스, related |
| `/tools/kospi-leverage-etf-calculator/` | FAQ 6 답변 링크, related |
| `/reports/kospi-october-crash-2026/` | related (페이지 파일 존재 시에만 — astro frontmatter에서 `import.meta.glob`으로 존재 확인 또는 데이터 플래그) |
| `/tools/dca-investment-calculator/` | related |
| 역링크 | `SBC_RELATED_LINKS`에 `{ href: "/tools/stock-loss-recovery-calculator/", label: "주식 손실 복구율 계산기" }` |

### 등록 스케치

```ts
// src/data/tools.ts
{
  slug: "stock-loss-recovery-calculator",
  title: "주식 손실 복구율 계산기",
  description: "매수가와 현재가로 손실률과 본전까지 필요한 상승률을 계산하고, 추가매수 후 평균단가와 반등률별 손익을 비교합니다.",
  order: 27.31,                      // 손익분기점 계산기(27.3) 바로 뒤. 27.32·27.35·27.36·27.4는 기존 항목이 사용 중(구현 시 확인)
  eyebrow: "주식 계산기",
  category: "investment",
  iframeReady: true,
  badges: ["신규", "주식"],
  previewStats: [
    { label: "-30% 손실", value: "+42.9% 필요" },
    { label: "-50% 손실", value: "+100% 필요" },
  ],
},
// src/pages/index.astro topicBySlug
"stock-loss-recovery-calculator": "투자·재테크",
```

```python
{"slug": "stock-loss-recovery-calculator", "title": "주식 손실 복구율 계산기", "description": "손실률·본전 필요 상승률·물타기 후 평균단가를 바로 계산", "eyebrow": "투자·재테크", "stats": [("-30% 손실", "+42.9% 필요"), ("-50% 손실", "+100% 필요")]},
```

sitemap: `<changefreq>monthly</changefreq><priority>0.7</priority>`.

## 8. 검증 사례와 완료 기준

### 8-1. 기능 테스트 (기획서 5-3 그대로, 수수료 0)

| # | 입력 | 기대 결과 |
|---|---|---|
| T1 | bp 100,000 / q 100 / cp 90,000 | 손익 −1,000,000원, 손실률 −10.00%, 필요 +11.11%, 손익분기 100,000원 |
| T2 | bp 50,000 / q 200 / cp 40,000 | −2,000,000원, −20.00%, +25.00% |
| T3 | T2 + aa 2,000,000 / ap 40,000 | 추가 50주, 잔액 0원, 원금 12,000,000원(+20.0%), 평균 48,000원, 필요 +20.00% |
| T4 | bp 100,000 / q 100 / cp 70,000 | −3,000,000원, −30.00%, +42.86% |
| T5 | T4 + aa 3,000,000 / ap 70,000 | 추가 42주, 잔액 60,000원, 원금 12,940,000원(+29.4%), 평균 91,126.76원, 필요 +30.18% |
| T6 | bp 100,000 / q 100 / cp 50,000 | −5,000,000원, −50.00%, +100.00% |
| T7 | T6 + aa 5,000,000 / ap 50,000 | 추가 100주, 원금 15,000,000원, 평균 75,000원, 필요 +50.00% |
| T8 | T4 반등표 | +5% 7,350,000 / −2,650,000 / −26.50%, +10% 7,700,000 / −2,300,000 / −23.00%, +20% 8,400,000 / −1,600,000 / −16.00%, +30% 9,100,000 / −900,000 / −9.00% |
| T9 | rate 모드 lr 40 | 필요 +66.67%, 금액 카드 숨김, 추가매수 비활성 |
| T10 | cp 0 | 오류 문구, `Infinity` 미노출 |
| T11 | cp 120,000 (bp 100,000) | "이미 본전 이상", 현재 수익률 +20.00% |
| T12 | aa 50,000 / ap 70,000 | 추가 0주, "1주도 살 수 없는 금액" |
| T13 | URL `?bp=50000&q=200&cp=40000&aa=2000000` 진입 | T3 결과 복원, ap는 현재가 연동 |

기준표 기대값(1자리): 5% → +5.3%, 10% → +11.1%, 20% → +25.0%, 30% → +42.9%, 40% → +66.7%, 50% → +100.0%, 60% → +150.0%, 70% → +233.3%, 80% → +400.0%, 90% → +900.0%.

### 8-2. QA 체크리스트

- [ ] T1~T13 수동 확인(브라우저 콘솔 또는 화면)
- [ ] 320/375/768px 가로 스크롤 없음, 입력 → 요약 → 상세 순서
- [ ] 결과 카드 배지 `시뮬레이션`, InfoNotice 3줄 노출
- [ ] "회복 가능", "반등 예상", "물타기 추천" 등 권유·예측 표현 없음
- [ ] 초기화·링크 복사 동작, URL 복원
- [ ] Chart.js 차단 시 기준표 fallback
- [ ] 손익분기점 계산기 역링크 반영

### 8-3. 구현 순서

1. 데이터 파일 → 2. Astro 마크업(SSR 기본 결과 포함) → 3. JS 계산·렌더·URL → 4. SCSS → 5. 등록 4곳 + 역링크 + OG → 6. 검증

### 완료 조건

```bash
npm run check:all
npm run build
```

둘 다 성공하고 `dist/tools/stock-loss-recovery-calculator/index.html`이 생성돼야 한다. **이 설계서 작성 시점에는 구현·실행하지 않았다.**

## 구현 기록 · 2026-10-27

- 구현 파일: `src/data/stockLossRecoveryCalculator.ts`, `src/pages/tools/stock-loss-recovery-calculator.astro`, `public/scripts/stock-loss-recovery-calculator.js`, `src/styles/scss/pages/_stock-loss-recovery-calculator.scss`, `public/og/tools/stock-loss-recovery-calculator.png`
- 수정 파일: `public/scripts/url-state.js`(`deleteParams` 추가), `src/data/tools.ts`(order 27.31), `src/pages/index.astro`, `src/styles/app.scss`, `public/sitemap.xml`, `src/data/stockBreakevenCalculator.ts`(역링크), `scripts/generate-og-tools.py`(TOOLS 항목)
- 설계 대비 변경:
  - 리포트 조건부 링크는 `node:fs` 대신 `import.meta.glob("../reports/kospi-october-crash-2026.astro")` 키 존재 여부로 판단(프로젝트에 Node 타입 정의가 없어 `astro check` 오류).
  - 수익 상태에서도 자연스럽도록 카드 라벨을 "현재 손실률" → "현재 손익률"로 변경.
  - 차트 캡션이 표와 겹쳐 캔버스를 높이 고정 박스(`.slr-chart-box`)로 분리.
- 검증: `npm run check:all` 오류 0건(경고 2건은 기존과 같은 `is:inline` 안내), 매핑 누락 없음. `npm run build` 성공, `dist/tools/stock-loss-recovery-calculator/index.html` 생성.
- 브라우저(빌드 미리보기): T1~T13 기대값 모두 일치, 콘솔 오류 없음, 375px에서 가로 스크롤 없음, 차트·기준표 강조·프리셋·초기화·URL 복원 확인.
- 미완료: 커밋·배포.
