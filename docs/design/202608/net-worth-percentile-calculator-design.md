# 내 순자산 상위 몇 % 계산기 — 설계 문서

> 기획 원문: `docs/plan/202608/net-worth-percentile-calculator.md`
> 작성일: 2026-07-22
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

- 구현 대상: `내 순자산 상위 몇 % 계산기`
- slug: `net-worth-percentile-calculator`
- URL: `/tools/net-worth-percentile-calculator/`
- 카테고리: 자산·재테크
- 핵심 검색 의도: "내 자산 상위 몇 퍼센트", "순자산 계산기", "대한민국 자산 순위", "순자산 평균"
- 핵심 출력: 순자산, 전국 추정 상위 %, 자산 구성 비중, 부채비율, 부자 TOP10 대비 배율
- 핵심 CTA: `/reports/korea-rich-top10-assets/`, `/reports/us-rich-top10-patterns/`, `/tools/fire-calculator/`

중요 톤:
- "정확한 순위"가 아니라 "표본 조사 기반 추정"임을 반복 고지한다.
- 순자산이 낮거나 마이너스인 사용자에게 위축감을 주는 표현을 쓰지 않는다.
- 부자 리포트와의 배율 비교는 "재미 요소"로 취급하고 과도하게 자극적인 문구를 쓰지 않는다.

---

## 2. 기존 데이터 재사용 계획

### 2-1. 한국 부자 TOP10 연동

`src/data/koreaRichTop10Current.ts`의 `koreaRichTop10Seed`를 import해 1위 인물의 `netWorthUsdB`와 `usdBillionToKrw()` 헬퍼를 그대로 재사용한다. 새로운 환율 상수를 중복 정의하지 않는다.

```ts
import { koreaRichTop10Seed, usdBillionToKrw } from "./koreaRichTop10Current";

const koreaTop1NetWorthKrw = usdBillionToKrw(
  koreaRichTop10Seed.entries[0].netWorthUsdB,
  koreaRichTop10Seed.meta.usdKrwRate // 리포트에서 사용 중인 환율 상수 재사용, 실제 필드명은 구현 시 재확인
);
```

> `koreaRichTop10Seed`의 실제 구조(entries 배열명, meta 필드명)는 구현 착수 전 `src/data/koreaRichTop10Current.ts` 상단 타입 정의를 다시 확인한다(2026-07 시점 파일에는 `rank`, `netWorthUsdB` 필드가 확인됨).

### 2-2. 세계 부자 TOP10 연동(선택)

`src/data/usRichTop10Report.ts`의 `wealthProfiles[0]`(Elon Musk)도 "세계 1위와는 몇 배 차이" 카드에 선택적으로 사용할 수 있다. MVP에서는 한국 TOP10만 우선 연동하고, 세계 TOP10 연동은 2차 확장으로 둔다.

---

## 3. 구현 파일 구조

```text
src/
  data/
    netWorthPercentileCalculator.ts   ← 타입, 통계청 분포 데이터, 근사 곡선 상수, 프리셋, FAQ
  pages/
    tools/
      net-worth-percentile-calculator.astro

public/
  scripts/
    net-worth-percentile-calculator.js

src/styles/scss/pages/
  _net-worth-percentile-calculator.scss
```

추가 등록: `src/data/tools.ts`(category: `asset`), `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반. 좌측 입력(자산 8종 + 연령대), 우측 결과.
- SCSS prefix: `nwp-`
- 결과 최상단에 **백분위 게이지 바**를 배치해 첫 화면에서 바로 위치를 보여준다.

```astro
<SimpleToolShell calculatorId="net-worth-percentile-calculator" pageClass="nwp-page">
```

`InfoNotice` 고정 문구:

```text
2025년 가계금융복지조사(통계청·국가데이터처) 순자산 분포를 기준으로 한 참고용 추정이며,
표본 조사 특성상 정확한 전 국민 순위를 보장하지 않습니다.
```

---

## 5. 데이터 모델

```ts
// src/data/netWorthPercentileCalculator.ts

export type AgeGroup = "20s" | "30s" | "40s" | "50s" | "60plus";

export interface NwpInput {
  realEstate: number;       // 부동산(자가 시가)
  jeonseDeposit: number;    // 전세보증금(받을 돈)
  savings: number;          // 예금·적금
  domesticStock: number;    // 국내주식 평가액
  overseasStock: number;    // 해외주식 평가액
  crypto: number;           // 코인 평가액
  pension: number;          // 연금(해지환급금 추정)
  debt: number;             // 대출·부채
  ageGroup: AgeGroup;
}

export interface NwpResult {
  totalAsset: number;
  netWorth: number;
  debtRatio: number;
  realEstateRatio: number;        // (부동산+전세보증금) / 총자산
  percentileEstimate: number;     // 0~100, 상위 %
  percentileBand: "top1" | "top10" | "aboveAverage" | "belowAverage";
  gapToNextBand: {
    label: string;               // "상위 20%", "상위 10%", "상위 1%"
    amountNeeded: number;        // 진입까지 필요한 순자산
  } | null;
  koreaTop1RatioText: string;    // "약 6,000배 차이" 같은 자연어
}

export interface NwpPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<NwpInput>;
}
```

---

## 6. 기준 데이터 (통계청 2025년 가계금융복지조사)

```ts
export const NWP_STAT_SOURCE = {
  year: 2025,
  surveyDate: "2025-03-31",
  sourceName: "통계청·국가데이터처 가계금융복지조사",
  sourceUrl: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156733201",
};

// 확보된 지점만 사용 (전체 10분위 경계값은 KOSIS 원자료로 후속 보강 필요 — 8-1 참고)
export const NWP_KNOWN_POINTS = {
  decile1Average: -7710000,        // 1분위(하위 10%) 평균 순자산
  overallAverage: 471440000,       // 전체 가구 평균 순자산
  decile10Average: 2171220000,     // 10분위(상위 10%) 평균 순자산
  decile10ShareOfTotal: 0.461,     // 상위 10%가 전체 순자산의 46.1% 보유
  under3okShare: 0.570,            // 순자산 3억 미만 가구 비율
  over10okShare: 0.118,            // 순자산 10억 이상 가구 비율
};
```

### 6-1. MVP 백분위 근사 곡선

정밀한 10분위 경계값을 확보하기 전까지, `NWP_KNOWN_POINTS`의 세 지점(1분위, 전체 평균, 10분위 평균)을 통과하는 **로그 스케일 조각별 선형보간**을 사용한다.

```text
기준점(순자산 → 누적 상위 %):
  -7,710,000원      → 상위 95% (하위 10% 평균 지점)
  471,440,000원     → 상위 50%  (전체 평균 ≈ 중앙값 근사, MVP 단순화)
  2,171,220,000원   → 상위 10%  (10분위 평균 지점)
  2,171,220,000원 × 3(추정 배수) → 상위 1% (실측치 확보 전까지 잠정 추정)

두 기준점 사이는 log(순자산)에 대해 선형보간한다.
순자산이 음수인 경우 상위 90~99% 구간으로 별도 처리(로그 계산 불가하므로 분기 처리).
```

> **필수 후속 작업**: KOSIS(kosis.kr) "가계금융복지조사 > 순자산 10분위별 가구당 순자산" 원자료를 확보해 위 근사 곡선을 실측 구간 표(2~9분위 포함)로 교체한다. 이 설계 문서의 근사값은 MVP 출시용 임시 방편이다.

---

## 7. 계산 로직

### 7-1. 총자산·순자산

```text
총자산 = realEstate + jeonseDeposit + savings + domesticStock + overseasStock + crypto + pension
순자산 = 총자산 - debt
부채비율 = debt / max(총자산, 1)
부동산비중 = (realEstate + jeonseDeposit) / max(총자산, 1)
```

### 7-2. 백분위 추정 (로그 선형보간)

```text
function estimatePercentile(netWorth):
  if netWorth <= NWP_KNOWN_POINTS.decile1Average:
    return 97   # 하위 10% 평균보다 낮으면 상위 97%대로 고정 처리

  points = [
    { value: NWP_KNOWN_POINTS.decile1Average, percentile: 95 },
    { value: NWP_KNOWN_POINTS.overallAverage, percentile: 50 },
    { value: NWP_KNOWN_POINTS.decile10Average, percentile: 10 },
    { value: NWP_KNOWN_POINTS.decile10Average * 3, percentile: 1 },
  ]

  # netWorth가 속한 두 지점 구간을 찾아 log(value) 기준 선형보간
  # 단, 구간 시작값이 0 이하(예: 1분위 평균이 음수)면 log 계산이 불가능하므로 일반 선형보간으로 대체한다
  for i in 0..points.length-2:
    if points[i].value <= netWorth <= points[i+1].value:
      if points[i].value <= 0:
        ratio = (netWorth - points[i].value) / (points[i+1].value - points[i].value)
        return points[i].percentile + ratio × (points[i+1].percentile - points[i].percentile)
      logRatio = (log(netWorth) - log(points[i].value)) / (log(points[i+1].value) - log(points[i].value))
      return points[i].percentile + logRatio × (points[i+1].percentile - points[i].percentile)

  if netWorth > points[last].value:
    return 1  # 상한 고정(추가 보간 없이 상위 1% 미만으로 표시)
  if netWorth < points[0].value (양수 구간):
    return 99
```

### 7-3. 구간 배지

```text
if percentile <= 3: band = 'top1'
elif percentile <= 10: band = 'top10'
elif netWorth > NWP_KNOWN_POINTS.overallAverage: band = 'aboveAverage'
else: band = 'belowAverage'
```

### 7-4. 다음 구간까지 필요 금액

```text
if percentile > 20: target = { label: "상위 20%", value: 근사곡선 역산(percentile=20) }
elif percentile > 10: target = { label: "상위 10%", value: NWP_KNOWN_POINTS.decile10Average }
elif percentile > 1: target = { label: "상위 1%", value: NWP_KNOWN_POINTS.decile10Average * 3 }
else: target = null  # 이미 상위 1% 도달

gapToNextBand.amountNeeded = max(target.value - netWorth, 0)
```

### 7-5. 부자 TOP10 배율

```text
koreaTop1NetWorthKrw = usdBillionToKrw(koreaRichTop10Seed.entries[0].netWorthUsdB, 환율상수)
ratio = round(koreaTop1NetWorthKrw / max(netWorth, 1))
koreaTop1RatioText = `한국 부자 TOP10 1위와 약 ${ratio.toLocaleString()}배 차이`
```

---

## 8. 프리셋

```ts
export const NWP_PRESETS: NwpPreset[] = [
  { id: "starter", label: "사회초년생", summary: "순자산 약 5천만", input: { savings: 30000000, debt: -20000000 /* 예시: 학자금 등 음수 표기 지양, 실제로는 debt 양수 20000000 */ } },
  { id: "newlywed-jeonse", label: "신혼부부(전세+대출)", summary: "순자산 약 1.5억", input: { jeonseDeposit: 300000000, debt: 150000000 } },
  { id: "seoul-owner-30s", label: "서울 자가 30대", summary: "순자산 약 3억", input: { realEstate: 700000000, debt: 400000000, savings: 20000000 } },
  { id: "asset-rich-40s", label: "40대 자산가형", summary: "순자산 약 10억", input: { realEstate: 1200000000, domesticStock: 50000000, debt: 300000000 } },
  { id: "debt-heavy", label: "부채 초과(1분위 근접)", summary: "순자산 마이너스", input: { savings: 5000000, debt: 10000000 } },
];
```

> 프리셋 값은 예시이며 구현 시 `debt`는 항상 양수로 입력받고 계산식에서 차감하는 방식으로 통일한다(위 표기의 음수 debt는 오기 방지를 위해 실제 구현에서 제거).

---

## 9. 페이지 IA

1. **Hero** — "내 순자산 상위 몇 % 계산기"
2. **InfoNotice** — 표본 조사 기반 추정 고지
3. **프리셋 버튼 5개**
4. **입력 패널** (부동산/전세보증금/예금/국내주식/해외주식/코인/연금/부채/연령대)
5. **백분위 게이지 바** (핵심 시각 요소, 최상단 배치)
6. **KPI 카드 4개**: 순자산 / 전국 추정 상위 % / 부채비율 / 다음 구간까지 필요 금액
7. **자산 구성 도넛/막대** (부동산·금융·기타)
8. **부자 TOP10 연결 카드**
9. **자연어 결과 메시지**
10. **2025년 한국 가구 순자산 분포 요약 표**
11. **SeoContent(FAQ 포함)**

---

## 10. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 |
|---|---|---:|---|
| 부동산(자가) | number | 500,000,000 | min 0 |
| 전세보증금 | number | 0 | min 0 |
| 예금·적금 | number | 30,000,000 | min 0 |
| 국내주식 평가액 | number | 10,000,000 | min 0 |
| 해외주식 평가액 | number | 0 | min 0 |
| 코인 평가액 | number | 0 | min 0 |
| 연금(해지환급금 추정) | number | 0 | min 0 |
| 대출·부채 | number | 300,000,000 | min 0 |
| 연령대 | select | 30대 | 20s/30s/40s/50s/60plus |

보조 문구:
- "연금은 즉시 현금화가 어려운 자산이라 참고용으로만 포함합니다."
- "부동산은 실거래가·KB시세 등 최근 시세 기준으로 입력하는 것을 권장합니다."

---

## 11. 결과 UI 상세

### 11-1. 백분위 게이지 바

```text
0% ────────────────────────────────── 100%
[상위]                              [하위]
        ▲ 내 위치(마커, percentile 값)
```
- 배경은 3단 그라데이션(상위 1~10%: 진한 초록 / 10~50%: 연한 초록 / 50~100%: 회색조)
- 마커에 `aria-label="전국 추정 상위 {percentile}%"` 부여

### 11-2. KPI 카드

| 카드 | 레이블 | 표시값 |
|---|---|---|
| Main | 순자산 | X억 원 |
| Accent | 전국 추정 상위 | X% |
| 일반 | 부채비율 | X% |
| 일반 | 다음 구간까지 필요 금액 | +X만 원 (상위 N% 진입까지) |

### 11-3. 자산 구성 시각화

CSS 도넛 또는 stacked bar로 부동산/금융자산(예금+주식+코인+연금)/기타 비중 표시. Chart.js는 사용하지 않고 CSS conic-gradient로 가볍게 구현한다.

### 11-4. 부자 TOP10 연결 카드

```text
한국 부자 TOP10 1위(이재용 · 약 21.6B 달러)와 비교하면
내 순자산의 약 6,392배 수준입니다.

→ 한국 부자 TOP10 자산 비교 리포트 보기
```

### 11-5. 자연어 결과 메시지

```text
입력하신 자산 기준 순자산은 약 2억 원으로 계산되며,
2025년 가계금융복지조사 기준 전국 상위 약 35% 구간으로 추정됩니다.

전체 가구 평균 순자산(4억 7,144만 원)에는 아직 못 미치지만,
상위 20% 진입까지는 약 1억 5,000만 원이 더 필요합니다.
```

### 11-6. 2025년 순자산 분포 요약 표 (정적 데이터)

| 구간 | 내용 |
|---|---|
| 전체 평균 순자산 | 4억 7,144만 원 |
| 상위 10%(10분위) 평균 | 21억 7,122만 원 |
| 상위 10% 순자산 비중 | 전체의 46.1% |
| 하위 10%(1분위) 평균 | -771만 원 |
| 순자산 3억 미만 가구 | 57.0% |
| 순자산 10억 이상 가구 | 11.8% |

---

## 12. JavaScript 설계

```js
// public/scripts/net-worth-percentile-calculator.js
(() => {
  const DATA = JSON.parse(document.getElementById('nwp-data').textContent);

  const state = {
    realEstate: 500000000,
    jeonseDeposit: 0,
    savings: 30000000,
    domesticStock: 10000000,
    overseasStock: 0,
    crypto: 0,
    pension: 0,
    debt: 300000000,
    ageGroup: '30s',
  };

  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function num(v, fallback = 0) {
    const n = Number(String(v ?? '').replace(/,/g, ''));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  }
  function fmtEok(n) {
    const eok = n / 100000000;
    return (eok >= 0 ? '약 ' : '약 -') + Math.abs(eok).toFixed(1) + '억 원';
  }

  function estimatePercentile(netWorth) {
    const p = DATA.knownPoints;
    if (netWorth <= p.decile1Average) return 97;

    const points = [
      { value: p.decile1Average, percentile: 95 },
      { value: p.overallAverage, percentile: 50 },
      { value: p.decile10Average, percentile: 10 },
      { value: p.decile10Average * 3, percentile: 1 },
    ];

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      if (netWorth >= a.value && netWorth <= b.value) {
        const logRatio = (Math.log(netWorth) - Math.log(a.value)) / (Math.log(b.value) - Math.log(a.value));
        return a.percentile + logRatio * (b.percentile - a.percentile);
      }
    }
    if (netWorth > points[points.length - 1].value) return 1;
    return 99;
  }

  function getBand(percentile, netWorth) {
    if (percentile <= 3) return 'top1';
    if (percentile <= 10) return 'top10';
    if (netWorth > DATA.knownPoints.overallAverage) return 'aboveAverage';
    return 'belowAverage';
  }

  function getGapToNextBand(percentile, netWorth) {
    const p = DATA.knownPoints;
    if (percentile > 20) {
      // 상위 20% 지점은 근사 곡선 역산 대신 10분위 평균의 절반 수준으로 잠정 근사
      return { label: '상위 20%', amountNeeded: Math.max(p.decile10Average * 0.5 - netWorth, 0) };
    }
    if (percentile > 10) {
      return { label: '상위 10%', amountNeeded: Math.max(p.decile10Average - netWorth, 0) };
    }
    if (percentile > 1) {
      return { label: '상위 1%', amountNeeded: Math.max(p.decile10Average * 3 - netWorth, 0) };
    }
    return null;
  }

  function calculate(s) {
    const totalAsset = s.realEstate + s.jeonseDeposit + s.savings + s.domesticStock + s.overseasStock + s.crypto + s.pension;
    const netWorth = totalAsset - s.debt;
    const debtRatio = totalAsset > 0 ? s.debt / totalAsset : 0;
    const realEstateRatio = totalAsset > 0 ? (s.realEstate + s.jeonseDeposit) / totalAsset : 0;
    const percentileEstimate = estimatePercentile(netWorth);
    const percentileBand = getBand(percentileEstimate, netWorth);
    const gapToNextBand = getGapToNextBand(percentileEstimate, netWorth);

    const top1Krw = DATA.koreaTop1NetWorthKrw;
    const ratio = Math.round(top1Krw / Math.max(netWorth, 1));
    const koreaTop1RatioText = netWorth > 0
      ? `한국 부자 TOP10 1위와 약 ${ratio.toLocaleString('ko-KR')}배 차이`
      : '순자산이 0 이하라 배율 비교가 어렵습니다';

    return {
      totalAsset, netWorth, debtRatio, realEstateRatio,
      percentileEstimate, percentileBand, gapToNextBand, koreaTop1RatioText,
    };
  }

  function renderGauge(result) {}
  function renderKpis(result) {}
  function renderComposition(result, state) {}
  function renderTop10Card(result) {}
  function renderMessage(result) {}
  function syncUrl(state) {}
  function restoreFromUrl() {}
  function applyPreset(id) {}

  function readInputs() {
    ['realEstate', 'jeonseDeposit', 'savings', 'domesticStock', 'overseasStock', 'crypto', 'pension', 'debt']
      .forEach(key => {
        state[key] = num(q(`[data-nwp="${key}"]`)?.value, state[key]);
      });
    state.ageGroup = q('[data-nwp="ageGroup"]')?.value || '30s';
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderGauge(result);
    renderKpis(result);
    renderComposition(result, state);
    renderTop10Card(result);
    renderMessage(result);
    syncUrl(state);
  }

  function bindEvents() {
    qa('[data-nwp]').forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    qa('[data-nwp-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.nwpPreset));
    });
  }

  restoreFromUrl();
  bindEvents();
  update();
})();
```

URL 파라미터: `re / jd / sv / ds / os / cr / pe / dt / age`

---

## 13. SCSS 설계 (핵심 발췌)

```scss
.nwp-page {
  .nwp-gauge-wrap {
    margin: 8px 0 40px;
  }

  .nwp-gauge {
    position: relative;
    height: 20px;
    border-radius: 999px;
    background: linear-gradient(90deg, #0f6e56 0 10%, #a7e3cf 10% 50%, #e5e7eb 50% 100%);
  }

  .nwp-gauge-marker {
    position: absolute;
    top: -6px;
    width: 4px;
    height: 32px;
    background: #111827;
    border-radius: 2px;

    span {
      position: absolute;
      top: 36px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      font-size: 0.76rem;
      font-weight: 800;
      color: #111827;
    }
  }

  .nwp-composition {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  .nwp-donut {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    flex-shrink: 0;
    /* conic-gradient는 JS에서 인라인 style로 값 주입 */
  }

  .nwp-composition-legend {
    display: grid;
    gap: 6px;
    font-size: 0.82rem;

    span.dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }

  .nwp-top10-card {
    margin-top: 20px;
    border: 1px solid #fde68a;
    background: #fffbeb;
    border-radius: 12px;
    padding: 16px 18px;

    a {
      color: #0f6e56;
      font-weight: 700;
    }
  }

  .nwp-distribution-table-wrap {
    overflow-x: auto;
    margin-top: 24px;
  }
}
```

---

## 14. SEO 설계

```text
title: 내 자산 순위 계산기 2026 | 순자산 넣으면 상위 몇 % 바로 확인
description: 부동산·예금·주식·코인·부채를 입력하면 통계청 가계금융복지조사 기준 내 순자산이 전국 상위 몇 %인지 추정합니다. 한국 부자 TOP10과의 격차 비교까지 포함.
H1: 내 순자산 상위 몇 % 계산기
```

키워드: 내 자산 상위 몇 퍼센트, 순자산 계산기, 대한민국 자산 순위, 순자산 평균, 자산 상위 10% 기준

---

## 15. SeoContent 초안

### intro

1. 순자산은 부동산·예금·주식·코인 등 자산에서 부채를 뺀 값입니다. 통계청 가계금융복지조사에 따르면 2025년 3월 말 기준 우리나라 가구의 평균 순자산은 4억 7,144만 원이며, 상위 10%(10분위) 가구는 평균 21억 7,122만 원의 순자산을 보유해 전체 순자산의 46.1%를 차지하고 있습니다.

2. 이 계산기는 부동산, 전세보증금, 예금·적금, 국내·해외주식, 코인, 연금, 부채를 입력하면 순자산을 계산하고, 위 통계 기준으로 전국 대비 상위 몇 %에 해당하는지 추정합니다. 다만 정확한 10분위 경계값이 아니라 확보된 주요 지점을 기준으로 한 근사치임을 유의해야 합니다.

3. 자산 구성 비중과 부채비율도 함께 보여줘, 단순히 순위만 확인하는 것을 넘어 "왜 이 순위인지"를 이해할 수 있게 했습니다. 부동산 비중이 지나치게 높거나 부채비율이 높은 경우 별도로 안내합니다.

### criteria

- 순자산 분포는 2025년 가계금융복지조사(통계청·국가데이터처) 기준입니다.
- 백분위는 확보된 주요 지점(1분위, 전체 평균, 10분위 평균)을 기준으로 한 근사 추정이며, 실제 순위와 다를 수 있습니다.
- 부동산 시세는 사용자가 직접 입력한 값이며 공식 시세가 아닙니다.

### FAQ

```ts
export const NWP_FAQ = [
  { question: "이 계산기의 순위는 정확한가요?", answer: "아닙니다. 통계청 가계금융복지조사 표본 데이터를 기준으로 한 추정치이며, 실제 전 국민 대상 정밀 순위가 아닙니다." },
  { question: "전세보증금도 자산에 포함되나요?", answer: "네. 받을 전세보증금은 자산으로, 낸 전세자금대출은 부채로 계산합니다." },
  { question: "연금도 자산에 넣어야 하나요?", answer: "연금은 즉시 현금화가 어려운 자산이라 참고용으로만 포함했습니다. 결과 해석 시 이 점을 감안해야 합니다." },
  { question: "순자산이 마이너스면 어떻게 되나요?", answer: "2025년 조사 기준 하위 10% 가구의 평균 순자산도 -771만 원으로 마이너스입니다. 부채 초과는 드문 상황이 아닙니다." },
  { question: "부동산 시세는 어떻게 넣어야 하나요?", answer: "실거래가나 KB시세 등 최근 시세를 참고해 시가 기준으로 입력하는 것을 권장합니다." },
];
```

---

## 16. 관련 링크

- `/reports/korea-rich-top10-assets/` — 한국 부자 TOP10 자산 비교 리포트
- `/reports/us-rich-top10-patterns/` — 세계 부자 TOP10 성공 패턴 리포트
- `/tools/fire-calculator/` — 파이어족 목표자산 계산기
- `/tools/home-purchase-fund/` — 내집마련 자금 계산기
- `/reports/salary-asset-2016-vs-2026/` — 한국인 평균 연봉·자산 2016 vs 2026 비교

---

## 17. 접근성·톤 설계

- 순자산이 마이너스이거나 하위 구간에 속하는 경우, 결과 카드 문구에서 비교·조롱 톤을 배제하고 "평균보다 낮은 구간"처럼 담백하게 표현한다.
- 게이지 마커에 `aria-label`로 백분위를 텍스트로 제공한다.
- 도넛 차트는 색상 외에 범례 텍스트로 비중을 함께 표시한다.

---

## 18. QA 체크리스트

- [ ] 모든 자산 입력값 0일 때 총자산 0, 순자산 -부채로 정상 계산(NaN 없음)
- [ ] 순자산이 마이너스일 때 백분위 추정이 97로 고정 처리되고 UI 깨지지 않음
- [ ] 순자산이 10분위 평균의 3배를 초과해도 백분위가 1 미만으로 내려가지 않고 1로 고정
- [ ] 부채가 총자산보다 커도 부채비율이 100%를 초과해 표시되지 않도록 처리(초과 시 별도 경고 문구)
- [ ] 도넛 차트 conic-gradient가 비중 합계 100% 기준으로 정확히 렌더링
- [ ] 부자 TOP10 배율 카드가 `koreaRichTop10Current.ts` 데이터 변경 시 자동 반영되는지 확인(하드코딩 금지)
- [ ] 다음 구간까지 필요 금액이 이미 상위 1%인 경우 "다음 구간 없음" 메시지로 대체
- [ ] URL 파라미터 복원 정상 동작
- [ ] 모바일 360px에서 게이지·도넛·카드가 겹치지 않음
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
- [ ] **후속 작업 티켓**: KOSIS 원자료 확보 후 근사 곡선을 실측 10분위 표로 교체
