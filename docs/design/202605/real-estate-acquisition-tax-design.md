# 부동산 취득세 계산기 — 설계 문서

> 작성일: 2026-05-10
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 주택 취득 유형(매매·증여·상속)·주택 수·취득가액·면적에 따른 취득세+지방교육세+농어촌특별세 자동 계산

---

## 1. 문서 개요

- 구현 대상: `부동산 취득세 계산기`
- slug: `real-estate-acquisition-tax`
- URL: `/tools/real-estate-acquisition-tax/`
- 카테고리: 부동산
- 핵심 검색 의도: "아파트 취득세 계산", "집 살 때 세금 얼마", "2주택 취득세 8%?", "증여 취득세 계산기", "상속 취득세"
- 핵심 출력: 적용 취득세율, 취득세액, 지방교육세, 농어촌특별세, 총 납부세액

---

## 2. 구현 파일 구조

```text
src/
  data/
    realEstateAcquisitionTax.ts    ← 세율 데이터, 시뮬레이션 케이스, FAQ, 관련 링크
  pages/
    tools/
      real-estate-acquisition-tax.astro

public/
  scripts/
    real-estate-acquisition-tax.js

src/styles/scss/pages/
  _real-estate-acquisition-tax.scss
```

추가 등록 필수:
- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/real-estate-acquisition-tax';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. `resultFirst={true}` 권장 — 모바일에서 결과 먼저.
- SCSS prefix: `reat-`

```astro
<SimpleToolShell
  calculatorId="real-estate-acquisition-tax"
  pageClass="op-page reat-page"
  resultFirst={true}
>
```

---

## 4. 세율 기준 (2026년 지방세법 기준)

### 4-1. 주택 매매 취득세율

| 취득가액 구간 | 1주택 (비조정) | 1주택 (조정) | 2주택 (비조정) | 2주택 (조정) | 3주택 이상 |
|------------|------------|------------|-------------|------------|----------|
| 6억 원 이하 | 1% | 1% | 1~3% (일반) | 8% | 12% |
| 6억 초과~9억 이하 | 1~3% (비례) | 1~3% | 1~3% | 8% | 12% |
| 9억 원 초과 | 3% | 3% | 3% (일반) | 8% | 12% |

6억~9억 구간 비례 세율 계산 공식:
```
세율 = 1% + (취득가액 - 6억) / 3억 × 2%
예: 7.5억 → 1 + (7.5 - 6) / 3 × 2 = 1 + 1 = 2%
예: 9억 → 1 + (9 - 6) / 3 × 2 = 3%
```

### 4-2. 비주택 취득세율 (상가, 토지, 오피스텔 등)

- 기본세율: 4% (매매 기준)
- 오피스텔: 주거용 여부에 따라 주택 또는 비주택 세율 적용 (지자체 판단)

### 4-3. 증여 취득세율

| 구분 | 세율 |
|------|------|
| 일반 주택 증여 | 3.5% |
| 조정대상지역 내 공시가격 3억 원 이상 주택 증여 | 12% |
| 비주택 증여 | 3.5% |

### 4-4. 상속 취득세율

| 구분 | 세율 |
|------|------|
| 주택 상속 | 2.8% |
| 비주택 상속 | 2.3% |

### 4-5. 부가세 계산

| 세목 | 계산 기준 | 과세 조건 |
|------|----------|----------|
| 지방교육세 | 취득세액 × 10% | 모든 취득 (취득세에 비례) |
| 농어촌특별세 | 취득가액 × 0.2% | 전용면적 85㎡ 초과 주택에만 부과 |

### 4-6. 총 납부세액

```
총 납부세액 = 취득세 + 지방교육세 + 농어촌특별세
```

1주택 5억 원 매매 (비조정, 84㎡) 예시:
```
취득세 = 500,000,000 × 1% = 5,000,000원
지방교육세 = 5,000,000 × 10% = 500,000원
농어촌특별세 = 0원 (84㎡ 이하)
총 납부세액 = 5,500,000원
```

2주택 조정지역 8억 원 매매 (90㎡) 예시:
```
취득세 = 800,000,000 × 8% = 64,000,000원
지방교육세 = 64,000,000 × 10% = 6,400,000원
농어촌특별세 = 800,000,000 × 0.2% = 1,600,000원
총 납부세액 = 72,000,000원
```

---

## 5. 계산 함수 설계

```ts
interface TaxInput {
  acquisitionType: "buy" | "gift" | "inherit";
  propertyType: "housing" | "non-housing";
  price: number;                // 취득가액 (원)
  houseCountAfter: number;     // 취득 후 주택 수
  isAdjusted: boolean;         // 조정대상지역 여부
  area: number;                 // 전용면적 (㎡)
  giftAppraisalPrice?: number; // 증여 시 공시가격 (조정지역 3억 기준)
}

interface TaxResult {
  rate: number;                 // 취득세율 (소수점, 예: 0.01 = 1%)
  acquisitionTax: number;       // 취득세액 (원)
  localEducationTax: number;    // 지방교육세 (원)
  ruralSpecialTax: number;      // 농어촌특별세 (원)
  totalTax: number;             // 총 납부세액 (원)
  rateDisplay: string;          // 세율 표시용 문자열 (예: "1%", "1~3%")
  notes: string[];              // 적용 기준 설명 (면책 포함)
}

function getAcquisitionTaxRate(input: TaxInput): number {
  const { acquisitionType, propertyType, price, houseCountAfter, isAdjusted } = input;

  if (!propertyType || propertyType === "non-housing") return 0.04;

  if (acquisitionType === "inherit") return 0.028;

  if (acquisitionType === "gift") {
    if (isAdjusted && (input.giftAppraisalPrice ?? price) >= 300000000) return 0.12;
    return 0.035;
  }

  // 매매 주택
  if (houseCountAfter >= 3) return 0.12;
  if (houseCountAfter === 2) return isAdjusted ? 0.08 : getNormalRate(price);
  return getNormalRate(price);
}

function getNormalRate(price: number): number {
  if (price <= 600000000) return 0.01;
  if (price <= 900000000) return 0.01 + ((price - 600000000) / 300000000) * 0.02;
  return 0.03;
}

function calculateTax(input: TaxInput): TaxResult {
  const rate = getAcquisitionTaxRate(input);
  const acquisitionTax = input.price * rate;
  const localEducationTax = acquisitionTax * 0.1;
  const ruralSpecialTax = input.area > 85 && input.propertyType === "housing"
    ? input.price * 0.002 : 0;
  const totalTax = acquisitionTax + localEducationTax + ruralSpecialTax;

  return {
    rate,
    acquisitionTax,
    localEducationTax,
    ruralSpecialTax,
    totalTax,
    rateDisplay: `${(rate * 100).toFixed(rate === 0.01 || rate === 0.03 ? 0 : 2)}%`,
    notes: buildNotes(input, rate),
  };
}
```

---

## 6. 프리셋 케이스 (시뮬레이션 표용)

| 케이스 | 취득가액 | 세율 | 취득세 | 지방교육세 | 총 납부 |
|--------|---------|------|--------|----------|--------|
| 1주택 3억 매매 (비조정, 84㎡) | 3억 원 | 1% | 300만 원 | 30만 원 | 330만 원 |
| 1주택 5억 매매 (비조정, 84㎡) | 5억 원 | 1% | 500만 원 | 50만 원 | 550만 원 |
| 1주택 7.5억 매매 (비조정, 84㎡) | 7.5억 원 | 2% | 1,500만 원 | 150만 원 | 1,650만 원 |
| 1주택 9억 매매 (비조정, 84㎡) | 9억 원 | 3% | 2,700만 원 | 270만 원 | 2,970만 원 |
| 1주택 12억 매매 (비조정, 84㎡) | 12억 원 | 3% | 3,600만 원 | 360만 원 | 3,960만 원 |
| 2주택 8억 매매 (조정지역, 90㎡) | 8억 원 | 8% | 6,400만 원 | 640만 원 + 160만 원 | 7,200만 원 |
| 3주택 6억 매매 | 6억 원 | 12% | 7,200만 원 | 720만 원 | 7,920만 원 |

---

## 7. 페이지 IA

1. **Hero** — 제목: "부동산 취득세 계산기", 부제: "매매·증여·상속 취득세와 지방교육세·농어촌특별세까지 한 번에 계산합니다"
2. **InfoNotice** — "세율은 지방세법 개정에 따라 변경될 수 있습니다. 실제 신고 전 국세청·지자체 또는 세무사에게 반드시 확인하세요. 이 계산기는 세무 자문이 아닌 참고용 추정 도구입니다."
3. **DesignTrustPanel** — 기준: 2026년 지방세법
4. **취득 유형 탭** — 매매 / 증여 / 상속 (탭 전환 시 조건부 필드 변경)
5. **입력 패널** — 부동산 유형, 취득가액, 주택 수 (매매 시), 조정지역 여부, 전용면적
6. **결과 KPI 카드 (5개)** — 취득세율, 취득세액, 지방교육세, 농어촌특별세, 총 납부세액
7. **세금 구성 상세 표** — 세목별 세율·금액 나열
8. **취득가액별 시뮬레이션 표** — 주요 구간별 취득세 요약
9. **취득 유형별 주의사항 카드** — 매매/증여/상속 각 주의점 3개
10. **CTA** — 내 집 마련 자금 계산기 / 전세 vs 월세 손익 계산기
11. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

| 필드 | 타입 | 기본값 | 표시 조건 | 유효성 |
|------|------|--------|----------|--------|
| 부동산 유형 | select | 주택 (아파트·단독·다세대) | 항상 | 주택 / 비주택 |
| 취득가액 (원) | number (쉼표 포맷) | 500,000,000 | 항상 | min 1,000,000 |
| 취득 후 주택 수 | select | 1주택 | 취득유형=매매 + 부동산=주택 | 1/2/3 이상 |
| 조정대상지역 여부 | checkbox | 미체크 | 취득유형=매매 또는 증여 | - |
| 공시가격 (원) | number, 선택 | 빈칸 | 취득유형=증여 + 조정지역=체크 | 3억 기준 판단 |
| 전용면적 (㎡) | number | 84 | 부동산=주택 | min 1, 농어촌특별세 85㎡ 기준 |

조건부 표시 로직:
- **매매**: 주택 수, 조정지역 표시
- **증여**: 조정지역, 공시가격 표시 (조정지역 체크 시 공시가격 필드 활성화)
- **상속**: 별도 조건 없음 (세율 고정)
- 비주택 선택 시: 주택 수, 조정지역, 공시가격, 면적 필드 숨김 (세율 4% 고정)

---

## 9. 결과 UI 상세

KPI 카드 (5개):

| 카드 | 레이블 | 서브 텍스트 |
|------|--------|-----------|
| 주요 (Main) | 적용 취득세율 | 입력 조건 기준 |
| 일반 | 취득세액 | 취득가액 × 세율 |
| 일반 | 지방교육세 | 취득세의 10% |
| 일반 | 농어촌특별세 | 85㎡ 초과 시 취득가액의 0.2% |
| Accent | 총 납부세액 | 3개 세목 합계 |

세금 구성 상세 표:

| 세목 | 계산 기준 | 금액 |
|------|----------|------|
| 취득세 | 취득가액 × X% | X원 |
| 지방교육세 | 취득세 × 10% | X원 |
| 농어촌특별세 | 취득가액 × 0.2% (85㎡ 초과 시) | X원 |
| **합계** | | **X원** |

자연어 결과 메시지 예:
```
5억 원 주택 1채를 매매(비조정지역, 전용 84㎡)하는 경우,
취득세율 1% 적용으로 취득세 500만 원, 지방교육세 50만 원이 부과됩니다.
전용면적 84㎡ 이하이므로 농어촌특별세는 부과되지 않습니다.
총 납부세액은 550만 원입니다.
```

---

## 10. 취득 유형별 주의사항 카드

### 매매
- 취득세 신고·납부 기한은 취득일로부터 **60일 이내**. 기한 초과 시 가산세 발생.
- 취득가액 기준은 실거래가이며, 허위 신고 시 세금 추징 대상.
- 잔금일을 취득일로 보는 것이 일반적이나 계약 내용에 따라 다를 수 있으므로 확인 필요.

### 증여
- 증여 취득세는 취득일(증여 등기일)로부터 60일 이내 신고·납부.
- 조정대상지역 내 시가 3억 원 이상 주택 증여 시 12% 중과세율 적용 (2026년 기준).
- 증여세와 취득세는 별도로 부과되므로 두 가지 세금을 함께 고려해야 함.

### 상속
- 상속 취득세는 상속 개시일로부터 **6개월 이내** (해외 거주자는 9개월).
- 상속에 의한 취득은 취득가액이 아닌 시가표준액(공시가격)을 기준으로 신고하는 경우도 있음.
- 상속세와 취득세는 별도이며, 상속 재산 규모에 따라 별도 세무 검토 필요.

---

## 11. JavaScript 설계

```js
(() => {
  let state = {
    acquisitionType: "buy",     // "buy" | "gift" | "inherit"
    propertyType: "housing",    // "housing" | "non-housing"
    price: 500000000,
    houseCountAfter: 1,
    isAdjusted: false,
    giftAppraisalPrice: null,
    area: 84,
  };

  function sanitize(val, fallback = 0, min = 0) {
    const n = parseFloat(String(val).replace(/,/g, ""));
    return isNaN(n) || n < min ? fallback : n;
  }

  function readInputs() {
    state.acquisitionType = q("[data-reat-tab].is-active")?.dataset.reatTab || "buy";
    state.propertyType = q("[data-reat-input='type']")?.value || "housing";
    state.price = sanitize(q("[data-reat-input='price']")?.value, 0, 0);
    state.houseCountAfter = parseInt(q("[data-reat-input='count']")?.value || "1");
    state.isAdjusted = q("[data-reat-input='adjusted']")?.checked || false;
    state.area = sanitize(q("[data-reat-input='area']")?.value, 84, 1);
    const ap = q("[data-reat-input='appraisal']")?.value;
    state.giftAppraisalPrice = ap ? sanitize(ap, null, 0) : null;
  }

  function getRate(s) {
    if (s.propertyType === "non-housing") return 0.04;
    if (s.acquisitionType === "inherit") return 0.028;
    if (s.acquisitionType === "gift") {
      if (s.isAdjusted && (s.giftAppraisalPrice ?? s.price) >= 300000000) return 0.12;
      return 0.035;
    }
    // 매매 주택
    if (s.houseCountAfter >= 3) return 0.12;
    if (s.houseCountAfter === 2) return s.isAdjusted ? 0.08 : calcNormalRate(s.price);
    return calcNormalRate(s.price);
  }

  function calcNormalRate(price) {
    if (price <= 600000000) return 0.01;
    if (price <= 900000000) return 0.01 + ((price - 600000000) / 300000000) * 0.02;
    return 0.03;
  }

  function calculate(s) {
    const rate = getRate(s);
    const acquisitionTax = s.price * rate;
    const localEducationTax = acquisitionTax * 0.1;
    const ruralSpecialTax = (s.propertyType === "housing" && s.area > 85)
      ? s.price * 0.002 : 0;
    const totalTax = acquisitionTax + localEducationTax + ruralSpecialTax;
    return { rate, acquisitionTax, localEducationTax, ruralSpecialTax, totalTax };
  }

  function renderResults(r) { /* 5개 KPI 카드 갱신, 세금 구성 표, 자연어 메시지 */ }
  function renderSimulationTable() { /* 취득가액별 시나리오 표 */ }
  function toggleTabFields(type) { /* 조건부 입력 필드 show/hide */ }
  function syncUrl(s) {}
  function restoreFromUrl() {}
  function bindEvents() {
    // 탭 클릭: toggleTabFields + readInputs + calculate + renderResults
    // 입력 change: readInputs + calculate + renderResults
  }
  function q(sel) { return document.querySelector(sel); }

  restoreFromUrl();
  bindEvents();
  toggleTabFields(state.acquisitionType);
  renderResults(calculate(state));
  renderSimulationTable();
})();
```

URL 파라미터: `type` / `ptype` / `price` / `count` / `adj` / `area`

---

## 12. SCSS 설계

```scss
.reat-page {
  .reat-type-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    .reat-tab-btn {
      padding: 8px 20px;
      border: 1.5px solid #dce6e2;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      background: #fff;
      cursor: pointer;
      &.is-active {
        background: #17382d;
        color: #fff;
        border-color: #17382d;
      }
    }
  }

  .reat-result-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  }

  .reat-breakdown-table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 10px 14px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
    }
    th:first-child, td:first-child { text-align: left; font-weight: 600; }
    tr:last-child td { font-weight: 700; font-size: 1.05rem; background: #f0faf6; }
  }

  .reat-simulation-table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    th, td {
      padding: 9px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
      font-size: 0.88rem;
    }
    th:first-child, td:first-child { text-align: left; }
  }

  .reat-warning-card {
    background: #fff7ed;
    border: 1px solid #fcd34d;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 0.88rem;
    color: #92400e;
    margin-top: 12px;
  }

  .reat-tip-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 760px) { grid-template-columns: repeat(3, 1fr); }
  }
}
```

---

## 13. SEO 설계

```text
title: 부동산 취득세 계산기 2026 - 아파트·주택 매매·증여·상속 취득세 자동 계산
description: 취득가액, 주택 수, 조정대상지역 여부, 전용면적을 입력하면 취득세율, 취득세, 지방교육세, 농어촌특별세, 총 납부세액을 자동으로 계산합니다. 1주택부터 3주택 이상까지 지원.
H1: 부동산 취득세 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 부동산 취득세 계산기, 아파트 취득세, 집 살 때 세금, 2주택 취득세 8%, 3주택 취득세 12%, 증여 취득세, 상속 취득세, 취득세율 2026

---

## 14. SeoContent 초안

### introTitle
`부동산 취득세 계산기 — 매매·증여·상속 세금을 정확히 파악하는 법`

### intro (5문단)

1. 부동산을 취득할 때는 매매대금 외에 취득세, 지방교육세, 농어촌특별세(해당 시)를 납부해야 합니다. 5억 원 아파트 1채를 처음 살 때는 총 납부세액이 550만 원(취득세 500만 원 + 지방교육세 50만 원) 정도지만, 보유 주택 수나 조정대상지역 여부에 따라 같은 가격이라도 세금이 몇 배씩 달라질 수 있습니다. 이 계산기는 취득 유형(매매·증여·상속), 주택 수, 면적을 입력해 총 납부세액을 한 번에 계산합니다.

2. 1주택 매매 취득세율은 취득가액에 따라 1~3%입니다. 6억 원 이하는 1%, 9억 원 초과는 3%, 6억~9억 원 구간은 비례 세율이 적용됩니다. 예를 들어 7.5억 원 주택의 경우 세율이 딱 2%가 되어 취득세 1,500만 원이 됩니다. 이 구간 계산은 (취득가액 - 6억) / 3억 × 2% + 1%로 구합니다.

3. 2주택자부터는 세율이 급격히 올라갑니다. 조정대상지역의 2주택자는 8%, 3주택 이상이거나 조정지역 내 법인·단기 취득의 경우 12%가 적용됩니다. 10억 원 주택을 3주택 상태에서 매수하면 취득세만 1억 2천만 원, 지방교육세를 더하면 약 1억 3,200만 원이 됩니다. 주택 수 산정 시 배우자·직계존비속 포함 세대 전체 기준으로 판단합니다.

4. 증여는 기본 세율 3.5%이지만, 조정대상지역 내 공시가격 3억 원 이상 주택을 증여하면 12%가 적용됩니다. 상속은 2.8%(주택 기준)로 가장 낮습니다. 증여세와 취득세는 별개로 부과되므로 증여를 계획 중이라면 두 가지 세금을 함께 계산해 전체 비용을 파악해야 합니다.

5. 지방교육세는 취득세의 10%, 농어촌특별세는 전용면적 85㎡ 초과 주택에 취득가액의 0.2%가 부과됩니다. 84㎡ 이하 아파트라면 농어촌특별세는 내지 않아도 됩니다. 취득세 신고·납부 기한은 매매의 경우 취득일(잔금일 기준)로부터 60일, 상속은 6개월 이내입니다. 이 계산기의 세율은 2026년 지방세법 기준이며, 법령 변경 시 달라질 수 있으므로 실제 신고 전 반드시 세무사 또는 지자체에 확인하세요.

### FAQ (8개)

```ts
export const REAT_FAQ = [
  {
    question: "취득세는 언제 납부해야 하나요?",
    answer: "매매의 경우 잔금일(부동산 취득일)로부터 60일 이내에 관할 지자체(시·군·구청)에 신고하고 납부해야 합니다. 기한을 넘기면 신고 불성실 가산세(20%)와 납부 지연 가산세가 부과됩니다. 증여는 등기일로부터 60일, 상속은 상속 개시일로부터 6개월 이내(해외 거주자 9개월)가 기한입니다.",
  },
  {
    question: "주택 수는 어떻게 계산하나요?",
    answer: "취득세 중과 판단의 주택 수는 세대 기준으로 계산합니다. 배우자와 같은 세대를 구성하는 직계존비속(부모·자녀 등)이 보유한 주택을 합산합니다. 단, 만 30세 이상으로 독립 세대를 구성한 자녀, 소득이 있는 독립 세대 등은 분리될 수 있습니다. 오피스텔은 주거용으로 사용되면 주택 수에 포함될 수 있습니다.",
  },
  {
    question: "조정대상지역이란 무엇인가요?",
    answer: "국토교통부가 부동산 가격 급등 우려 지역으로 지정한 지역입니다. 지정 해제도 수시로 이루어지므로 국토교통부 공식 사이트(rtms.molit.go.kr)에서 현재 조정대상지역 목록을 확인해야 합니다. 조정대상지역 여부에 따라 2주택자의 취득세율이 1~3%(비조정) vs 8%(조정)로 크게 다릅니다.",
  },
  {
    question: "전용면적 85㎡가 기준인 이유는 무엇인가요?",
    answer: "농어촌특별세 과세 기준은 전용면적 85㎡ 초과 주택입니다. 이는 국민주택 규모 기준(85㎡)과 동일합니다. 84.99㎡ 이하 주택은 농어촌특별세가 면제되어 5~10%가량의 세금을 아낄 수 있습니다. 분양 시 84㎡ 타입이 인기 있는 이유 중 하나이기도 합니다. 전용면적은 등기부등본 또는 아파트 분양 계약서에서 확인할 수 있습니다.",
  },
  {
    question: "취득세를 절약하는 합법적인 방법이 있나요?",
    answer: "첫째, 취득가액 6억 원 이하 구간에서는 1% 세율이 적용되므로, 6억 원 바로 위 가격대 주택보다 세율 차이를 고려한 가격 협상이 의미 있습니다. 둘째, 전용면적 85㎡ 이하 주택을 선택하면 농어촌특별세가 면제됩니다. 셋째, 1주택자 상태에서 취득하면 다주택 중과세율을 피할 수 있습니다. 단, 취득가액을 허위로 낮게 신고하는 것은 탈세이므로 절대 불가합니다.",
  },
  {
    question: "신축 아파트 분양권을 취득할 때도 취득세를 내나요?",
    answer: "분양권 자체는 취득세 과세 대상이 아닙니다. 하지만 분양권이 아파트로 완공되어 잔금을 납부하고 소유권을 이전할 때 취득세가 발생합니다. 이때 취득가액은 분양가(분양대금 전액)를 기준으로 계산합니다. 2021년 이후 취득한 분양권은 주택 수에 포함되므로 보유 주택 수 산정 시 주의가 필요합니다.",
  },
  {
    question: "증여받은 주택의 취득세는 누가 내나요?",
    answer: "취득세는 증여를 받는 수증자(받는 사람)가 납부합니다. 증여세는 별도로 수증자가 신고·납부합니다. 증여세와 취득세는 독립적으로 계산되므로 증여 계획 시 두 가지 세금을 합산한 총 세부담을 미리 확인해야 합니다. 부모가 자녀에게 증여 시, 증여세(공제 한도: 10년간 5,000만 원)와 취득세(3.5% 또는 조정지역 12%)를 모두 고려해야 합니다.",
  },
  {
    question: "취득세 계산기 결과와 실제 납부 금액이 다를 수 있나요?",
    answer: "네. 이 계산기는 2026년 기준 일반적인 경우를 대상으로 하며, 실제 납부 금액은 다음과 같은 이유로 다를 수 있습니다. ① 법령 개정 (세율 변경) ② 지자체별 추가 감면 또는 가산 ③ 임시 특례 적용 (생애 최초 주택 구입 50% 감면 등) ④ 취득가액 정의 차이 (부대 비용 포함 여부). 중요한 거래 전에는 반드시 세무사 또는 관할 구청 세무 담당자에게 최종 확인하세요.",
  },
];
```

---

## 15. 관련 링크

- `/tools/jeonwolse-conversion/` — 전월세 전환율 계산기
- `/tools/jeonse-vs-wolse-calculator/` — 전세 vs 월세 손익 계산기
- `/tools/home-purchase-fund/` — 내 집 마련 자금 계산기
- `/tools/apt-cheonyak-gajum-calculator/` — 주택청약 가점 계산기
- `/reports/seoul-apartment-price-2026/` — 서울 구별 아파트 실거래가

---

## 16. 등록 작업

```ts
// src/data/tools.ts
{
  slug: "real-estate-acquisition-tax",
  title: "부동산 취득세 계산기",
  description: "매매·증여·상속 시 취득세, 지방교육세, 농어촌특별세, 총 납부세액을 주택 수·조정지역 여부에 따라 자동 계산합니다.",
  category: "부동산",
  order: ...,
}
```

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/tools/real-estate-acquisition-tax/</loc>
</url>
```

---

## 17. QA 체크리스트

- [ ] 1주택 6억 이하 → 1%, 9억 초과 → 3% 세율 정확히 계산
- [ ] 6억~9억 비례 구간 정확 검증 (예: 7.5억 정확히 2%)
- [ ] 3주택 이상 → 12%, 조정지역 2주택 → 8% 정확 적용
- [ ] 전용면적 85㎡ 이하 → 농어촌특별세 0원
- [ ] 85㎡ 초과 → 취득가액 × 0.2% 정확히 계산
- [ ] 증여 + 조정지역 + 공시가 3억 이상 → 12% 적용
- [ ] 상속 → 2.8% (주택) / 2.3% (비주택) 고정 적용
- [ ] 비주택 선택 시 → 매매 4%, 증여 3.5%, 상속 2.3%
- [ ] 취득 유형 탭 전환 시 조건부 필드 show/hide 정상
- [ ] 세무 조언 면책 문구 InfoNotice에 명확히 표시
- [ ] 시뮬레이션 표 주요 케이스 7개 정확히 렌더링
- [ ] 모바일 360px 탭·결과 카드·표 overflow 없음
- [ ] URL 파라미터 복원 정상 동작
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
