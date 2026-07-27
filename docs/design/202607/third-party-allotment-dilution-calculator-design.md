# 설계 문서
## 제3자배정 유상증자 지분희석 계산기

> 기획 원본: `docs/plan/202607/third-party-allotment-dilution-calculator-naver-nvidia-plan.md`  
> 신규 구현 페이지: `/tools/third-party-allotment-dilution-calculator/`  
> 설계 목적: 신규 발행주식 수, 투자금액, 기존 주식 수, 보유 주식 수를 입력해 제3자배정 유상증자 후 지분희석률과 내 지분율 변화를 계산하고, 네이버·엔비디아 투자 사례를 프리셋으로 제공하는 투자 계산기.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `third-party-allotment-dilution-calculator` |
| 페이지 경로 | `src/pages/tools/third-party-allotment-dilution-calculator.astro` |
| 데이터 파일 | `src/data/thirdPartyAllotmentDilution.ts` |
| 클라이언트 스크립트 | `public/scripts/third-party-allotment-dilution-calculator.js` |
| SCSS | `src/styles/scss/pages/_third-party-allotment-dilution-calculator.scss` |
| SCSS prefix | `.tpd` |
| 콘텐츠 유형 | `/tools/` 투자·재테크 계산기 |
| 홈 카테고리 | `투자·재테크` |
| 주요 CTA | 주식 평단가 계산기, 주식 수익률 계산기, 배당 관련 계산기, 네이버·엔비디아 사례 해설 |
| 등록 필요 | `src/data/tools.ts`, `src/pages/index.astro`, `src/styles/app.scss`, `public/sitemap.xml` |
| 검증 명령 | `npm run build`, 가능하면 `npm run check:mapping` |
| 향후 확장 | `/reports/naver-nvidia-investment-dilution-2026/` 사례 리포트 분리 |

---

## 1. 제품 방향

### 1-1. 계산기 한 줄 정의

`제3자배정 유상증자에서 신주 발행으로 기존 주주의 지분율이 얼마나 낮아지는지 계산하고, 투자금 유입·자사주 소각·현재 주가를 함께 반영해 희석 효과를 읽게 하는 계산기`

### 1-2. 사용자가 얻는 것

- 신주 발행가격을 투자금액과 신규 발행주식 수로 단순 계산
- 증자 후 총주식 수와 신규 투자자 지분율 확인
- 기존 주주 전체 희석률 확인
- 내가 보유한 주식 수 기준으로 증자 전후 지분율 비교
- 자사주 소각이 희석을 얼마나 줄이는지 확인
- 현재 주가 대비 신주 발행 할인율 확인
- 희석을 이론적으로 상쇄하려면 기업가치가 얼마나 올라야 하는지 확인
- 네이버·엔비디아 사례가 지분교환이 아니라 제3자배정 유상증자 구조임을 이해

### 1-3. 피해야 할 것

- 계산 결과를 투자 의견처럼 표현
- 지분희석률만큼 주가가 반드시 하락한다고 단정
- 보도 숫자를 공시 확정값처럼 표기
- "엔비디아 투자 = 호재 확정"처럼 주가 방향을 단정
- 자사주 소각이 희석을 완전히 상쇄한다고 일반화

---

## 2. SEO 설계

### 2-1. 메타 데이터

```ts
export const TPD_META = {
  slug: "third-party-allotment-dilution-calculator",
  title: "제3자배정 유상증자 지분희석 계산기",
  description:
    "신규 발행주식 수, 투자금액, 보유주식을 입력해 제3자배정 유상증자 후 신규 투자자 지분율, 기존 주주 희석률, 내 지분율 변화를 계산합니다.",
  seoTitle:
    "제3자배정 유상증자 지분희석 계산기 | 신주 발행 지분율 계산",
  seoDescription:
    "신규 발행주식 수, 투자금액, 현재 주가, 보유주식을 입력해 제3자배정 유상증자 후 신주 발행가격, 신규 투자자 지분율, 기존 주주 희석률과 내 지분율 변화를 계산하세요.",
  updatedAt: "2026-07-27",
  dataNote:
    "이 계산기는 공시와 보도에 나온 숫자를 사용자가 직접 입력해 지분율 변화를 단순 계산하는 참고 도구입니다. 실제 투자 판단에는 발행가액 산정 기준, 납입일, 보호예수, 자사주 소각, 전환증권, 거래 종결 조건을 함께 확인해야 합니다.",
};
```

### 2-2. H1 및 Hero

```astro
<CalculatorHero
  eyebrow="투자 계산기"
  title={TPD_META.title}
  description="신주 발행과 전략적 투자로 내 지분율이 얼마나 줄어드는지 계산합니다. 네이버·엔비디아 투자 사례처럼 신규 투자자 지분율과 기존 주주 희석률을 함께 확인하세요."
  badges={["지분희석", "유상증자", "프리머니", "네이버·엔비디아 사례"]}
/>
```

### 2-3. H2 구조

1. `네이버·엔비디아 보도 기준으로 먼저 계산해보기`
2. `유상증자 조건 입력`
3. `핵심 계산 결과`
4. `내 보유지분 전후 비교`
5. `유상증자·지분교환·구주매각 차이`
6. `유상증자가 호재 또는 악재로 해석되는 조건`
7. `네이버·엔비디아 사례를 어떻게 읽어야 할까`
8. `출처와 계산 기준`
9. `제3자배정 유상증자 지분희석 FAQ`

### 2-4. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 지분희석 계산기 | title, H1, FAQ |
| 유상증자 계산기 | title, Hero, SeoContent |
| 제3자배정 유상증자 | H1, 비교표, FAQ |
| 신주 발행 지분율 계산 | title, 결과 카드, FAQ |
| 엔비디아 네이버 투자 | Hero, 프리셋, 사례 섹션 |
| 네이버 유상증자 | 사례 섹션, FAQ |
| 자사주 소각 지분희석 | 고급 입력, 결과 해석 |
| 유상증자와 지분교환 차이 | 비교표, FAQ |

---

## 3. 데이터 파일 설계

파일: `src/data/thirdPartyAllotmentDilution.ts`

### 3-1. export 구조

```ts
export const TPD_META = { ... };
export const TPD_PRESETS: DilutionPreset[] = [ ... ];
export const TPD_RESULT_CARDS: ResultCardMeta[] = [ ... ];
export const TPD_STRUCTURE_COMPARISON: StructureComparison[] = [ ... ];
export const TPD_SIGNAL_GROUPS: SignalGroup[] = [ ... ];
export const TPD_CASE_SUMMARY: CaseSummaryItem[] = [ ... ];
export const TPD_FAQ: FaqItem[] = [ ... ];
export const TPD_RELATED_LINKS: RelatedLink[] = [ ... ];
export const TPD_SOURCE_LINKS: SourceLink[] = [ ... ];
```

### 3-2. 타입 정의

```ts
export type DilutionPreset = {
  id: string;
  label: string;
  description: string;
  sourceLabel: "보도 기준" | "직접 입력";
  values: {
    existingShares: number;
    newShares: number;
    investmentAmount: number;
    currentPrice: number;
    ownedShares: number;
    treasurySharesCancelled: number;
    investorName: string;
  };
};

export type ResultCardMeta = {
  key:
    | "issuePrice"
    | "investorOwnershipRate"
    | "dilutionRate"
    | "breakEvenValueIncreaseRate"
    | "postMoneyShares"
    | "preMoneyValuation"
    | "postMoneyValuation"
    | "issueDiscountRate";
  label: string;
  badge: "단순 계산" | "참고" | "시뮬레이션";
  description: string;
};

export type StructureComparison = {
  label: string;
  thirdPartyAllotment: string;
  shareSwap: string;
  secondarySale: string;
};

export type SignalGroup = {
  title: string;
  tone: "positive" | "negative";
  items: string[];
};

export type CaseSummaryItem = {
  label: string;
  value: string;
  note: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  desc: string;
};

export type SourceLink = {
  label: string;
  url: string;
  note: string;
};
```

### 3-3. 네이버·엔비디아 프리셋

```ts
export const TPD_PRESETS: DilutionPreset[] = [
  {
    id: "naver-nvidia-2026",
    label: "네이버·엔비디아 보도 기준",
    description:
      "보도된 투자금 1조4,810억 원, 신주 720만 주, 거래 후 약 4.5% 지분율을 바탕으로 한 단순 예시입니다.",
    sourceLabel: "보도 기준",
    values: {
      existingShares: 152800000,
      newShares: 7200000,
      investmentAmount: 1481000000000,
      currentPrice: 207500,
      ownedShares: 100,
      treasurySharesCancelled: 0,
      investorName: "엔비디아",
    },
  },
];
```

주의: 기존 발행주식 수는 보도된 `신주 720만 주`, `거래 후 4.5% 지분`을 역산한 값이다. 페이지에는 `단순 역산`으로 표기한다.

### 3-4. 구조 비교표 데이터

```ts
export const TPD_STRUCTURE_COMPARISON: StructureComparison[] = [
  {
    label: "회사에 현금 유입",
    thirdPartyAllotment: "있음",
    shareSwap: "구조에 따라 다름",
    secondarySale: "없음",
  },
  {
    label: "신규 주식 발행",
    thirdPartyAllotment: "있음",
    shareSwap: "가능",
    secondarySale: "없음",
  },
  {
    label: "기존 주주 희석",
    thirdPartyAllotment: "발생",
    shareSwap: "발생 가능",
    secondarySale: "없음",
  },
  {
    label: "투자자가 받는 것",
    thirdPartyAllotment: "신규 발행 주식",
    shareSwap: "서로의 주식",
    secondarySale: "기존 주주 보유주식",
  },
  {
    label: "네이버·엔비디아 사례",
    thirdPartyAllotment: "해당",
    shareSwap: "해당 아님",
    secondarySale: "해당 아님",
  },
];
```

### 3-5. FAQ 데이터

FAQ는 화면과 `FAQPage` JSON-LD가 같은 배열을 사용한다. 8개 이상 유지한다.

```ts
export const TPD_FAQ: FaqItem[] = [
  {
    question: "제3자배정 유상증자가 발생하면 내 주식 수도 줄어드나요?",
    answer:
      "아닙니다. 내가 보유한 주식 수는 그대로입니다. 다만 회사 전체 발행주식 수가 늘어나기 때문에 같은 주식 수가 차지하는 회사 내 비중, 즉 지분율이 낮아집니다.",
  },
  ...
];
```

---

## 4. 계산 로직 설계

계산 로직은 클라이언트 JS에 둔다. Astro 페이지는 기본 HTML과 초기값만 제공한다.

파일: `public/scripts/third-party-allotment-dilution-calculator.js`

### 4-1. 입력 모델

```js
const input = {
  existingShares: 152800000,
  newShares: 7200000,
  investmentAmount: 1481000000000,
  currentPrice: 207500,
  ownedShares: 100,
  treasurySharesCancelled: 0,
  investorName: "엔비디아",
};
```

### 4-2. 계산 함수

```js
function calculateDilution(input) {
  const existingShares = Math.max(0, input.existingShares || 0);
  const newShares = Math.max(0, input.newShares || 0);
  const investmentAmount = Math.max(0, input.investmentAmount || 0);
  const currentPrice = Math.max(0, input.currentPrice || 0);
  const ownedShares = Math.max(0, input.ownedShares || 0);
  const cancelledShares = Math.max(0, input.treasurySharesCancelled || 0);

  const adjustedExistingShares = Math.max(0, existingShares - cancelledShares);
  const postMoneyShares = adjustedExistingShares + newShares;
  const issuePrice = newShares > 0 ? investmentAmount / newShares : 0;
  const investorOwnershipRate = postMoneyShares > 0 ? newShares / postMoneyShares : 0;
  const existingShareholderRate = postMoneyShares > 0 ? adjustedExistingShares / postMoneyShares : 0;
  const dilutionRate = 1 - existingShareholderRate;
  const preMoneyValuation = currentPrice > 0 ? existingShares * currentPrice : 0;
  const postMoneyValuation = preMoneyValuation + investmentAmount;
  const ownershipBefore = existingShares > 0 && ownedShares > 0 ? ownedShares / existingShares : null;
  const ownershipAfter = postMoneyShares > 0 && ownedShares > 0 ? ownedShares / postMoneyShares : null;
  const ownershipDilutionRate =
    ownershipBefore && ownershipAfter ? 1 - ownershipAfter / ownershipBefore : null;
  const issueDiscountRate =
    currentPrice > 0 && issuePrice > 0 ? (currentPrice - issuePrice) / currentPrice : null;
  const breakEvenValueIncreaseRate =
    existingShareholderRate > 0 ? 1 / existingShareholderRate - 1 : 0;

  return {
    adjustedExistingShares,
    postMoneyShares,
    issuePrice,
    investorOwnershipRate,
    existingShareholderRate,
    dilutionRate,
    preMoneyValuation,
    postMoneyValuation,
    ownershipBefore,
    ownershipAfter,
    ownershipDilutionRate,
    issueDiscountRate,
    breakEvenValueIncreaseRate,
  };
}
```

### 4-3. 입력 검증

| 조건 | UI 처리 |
|---|---|
| 기존 주식 수 <= 0 | 결과 카드 대신 `기존 발행주식 수를 입력하세요` |
| 신규 발행주식 수 <= 0 | 신주 발행가격·신규 투자자 지분율 0 처리, 경고 문구 |
| 투자금액 <= 0 | 발행가격 0 처리, 투자금액 입력 안내 |
| 소각 주식 수 > 기존 주식 수 | 소각 입력 아래 오류 표시, 소각값을 계산에서 기존 주식 수 이하로 clamp |
| 현재 주가 <= 0 | 할인율·기업가치 카드에 `현재 주가 입력 시 표시` |
| 보유 주식 수 <= 0 | 내 지분율 섹션에 `보유 주식 수 입력 시 표시` |

### 4-4. 숫자 포맷터

```js
function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(Math.round(value || 0));
}

function formatWon(value) {
  if (!Number.isFinite(value) || value <= 0) return "-";
  if (value >= 1_0000_0000_0000) return `약 ${(value / 1_0000_0000_0000).toFixed(1)}조 원`;
  if (value >= 1_0000_0000) return `약 ${(value / 1_0000_0000).toFixed(0)}억 원`;
  return `${formatNumber(value)}원`;
}

function formatPrice(value) {
  return value > 0 ? `약 ${formatNumber(value)}원` : "-";
}

function formatPercent(value, digits = 2) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : "-";
}

function parseMoneyByUnit(amount, unit) {
  const multipliers = { won: 1, eok: 100000000, jo: 1000000000000 };
  return amount * (multipliers[unit] || 1);
}
```

### 4-5. URL 파라미터

공유 가능한 계산기를 위해 주요 입력을 URL에 저장한다.

| 파라미터 | 의미 |
|---|---|
| `existing` | 기존 발행주식 수 |
| `new` | 신규 발행주식 수 |
| `amount` | 투자금액, 원 단위 |
| `price` | 현재 주가 |
| `owned` | 보유 주식 수 |
| `cancel` | 소각 예정 주식 수 |
| `investor` | 투자자명 |

동작:
- 페이지 로드 시 URL 파라미터가 있으면 프리셋보다 우선한다.
- 입력 변경 시 `history.replaceState`로 URL을 갱신한다.
- 공유 버튼은 현재 URL을 클립보드에 복사한다.
- 초기화 버튼은 네이버·엔비디아 프리셋으로 되돌린다.

---

## 5. 페이지 IA 설계

### 5-1. 전체 구조

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell tool-page tpd-page">
    [CalculatorHero]
    [InfoNotice]
    .tpd-preset-section
    .tpd-calculator-section
      .tpd-input-panel
      .tpd-result-panel
    .tpd-ownership-section
    .tpd-structure-section
    .tpd-signal-section
    .tpd-case-section
    .tpd-source-section
    [SeoContent]
  </main>
  <script src="/scripts/third-party-allotment-dilution-calculator.js" defer></script>
```

### 5-2. 프리셋 섹션

```astro
<section class="content-section tpd-preset-section" aria-labelledby="tpd-preset-title">
  <div class="tpd-section-heading">
    <p>사례 프리셋</p>
    <h2 id="tpd-preset-title">네이버·엔비디아 보도 기준으로 먼저 계산해보기</h2>
    <span>아래 기본값은 보도된 투자금, 신주 수, 지분율을 바탕으로 한 단순 예시입니다.</span>
  </div>
  <div class="tpd-preset-grid">
    {TPD_PRESETS.map((preset) => (
      <button
        class="tpd-preset-card"
        type="button"
        data-preset-id={preset.id}
        data-preset={JSON.stringify(preset.values)}
      >
        <span>{preset.sourceLabel}</span>
        <strong>{preset.label}</strong>
        <small>{preset.description}</small>
      </button>
    ))}
  </div>
</section>
```

### 5-3. 입력 폼

```astro
<section class="content-section tpd-calculator-section" aria-labelledby="tpd-calculator-title">
  <div class="tpd-section-heading">
    <p>계산기</p>
    <h2 id="tpd-calculator-title">유상증자 조건 입력</h2>
  </div>

  <div class="tpd-calculator-grid">
    <form class="tpd-input-panel" data-tpd-form>
      <label class="tpd-field">
        <span>유상증자 전 발행주식 수</span>
        <input type="number" inputmode="numeric" min="0" id="tpd-existing-shares" />
        <small>신주 발행 전 전체 발행주식 수입니다.</small>
      </label>

      <label class="tpd-field">
        <span>신규 발행주식 수</span>
        <input type="number" inputmode="numeric" min="0" id="tpd-new-shares" />
      </label>

      <div class="tpd-field tpd-field--money">
        <label for="tpd-investment-amount">투자금액</label>
        <div class="tpd-money-row">
          <input type="number" inputmode="decimal" min="0" id="tpd-investment-amount" />
          <select id="tpd-investment-unit">
            <option value="won">원</option>
            <option value="eok">억원</option>
            <option value="jo">조원</option>
          </select>
        </div>
      </div>

      <label class="tpd-field">
        <span>현재 주가 또는 기준 주가</span>
        <input type="number" inputmode="numeric" min="0" id="tpd-current-price" />
      </label>

      <label class="tpd-field">
        <span>내가 보유한 주식 수</span>
        <input type="number" inputmode="numeric" min="0" id="tpd-owned-shares" />
      </label>

      <details class="tpd-advanced">
        <summary>자사주 소각·투자자명 설정</summary>
        <label class="tpd-field">
          <span>자사주 소각 예정 주식 수</span>
          <input type="number" inputmode="numeric" min="0" id="tpd-cancelled-shares" />
        </label>
        <label class="tpd-field">
          <span>전략적 투자자명</span>
          <input type="text" id="tpd-investor-name" maxlength="24" />
        </label>
      </details>
    </form>

    <section class="tpd-result-panel" aria-live="polite">
      <!-- JS가 결과 카드 값을 채움 -->
    </section>
  </div>
</section>
```

### 5-4. 결과 카드 마크업

Astro에서 카드 껍데기를 만들고 JS가 `data-result`를 갱신한다.

```astro
<div class="tpd-kpi-grid">
  {TPD_RESULT_CARDS.slice(0, 4).map((card) => (
    <article class="tpd-kpi-card">
      <span class="tpd-card-badge">{card.badge}</span>
      <p>{card.label}</p>
      <strong data-result={card.key}>-</strong>
      <small>{card.description}</small>
    </article>
  ))}
</div>
```

추가 결과는 `.tpd-detail-grid`로 배치한다.

### 5-5. 내 보유지분 섹션

```astro
<section class="content-section tpd-ownership-section" aria-labelledby="tpd-ownership-title">
  <div class="tpd-section-heading">
    <p>내 지분율</p>
    <h2 id="tpd-ownership-title">내 보유지분 전후 비교</h2>
    <span>보유 주식 수는 그대로지만 전체 주식 수 증가로 회사 내 비중은 달라집니다.</span>
  </div>
  <div class="tpd-ownership-card">
    <div class="tpd-ownership-row">
      <span>증자 전 내 지분율</span>
      <strong data-result="ownershipBefore">-</strong>
    </div>
    <div class="tpd-ownership-row">
      <span>증자 후 내 지분율</span>
      <strong data-result="ownershipAfter">-</strong>
    </div>
    <p data-result="ownershipComment"></p>
  </div>
</section>
```

### 5-6. 구조 비교 섹션

```astro
<section class="content-section tpd-structure-section" aria-labelledby="tpd-structure-title">
  <div class="tpd-section-heading">
    <p>용어 구분</p>
    <h2 id="tpd-structure-title">유상증자·지분교환·구주매각 차이</h2>
  </div>
  <div class="table-wrap tpd-table-wrap">
    <table class="tpd-structure-table">
      <caption>제3자배정 유상증자, 지분교환, 구주매각 차이</caption>
      <thead>
        <tr>
          <th>구분</th>
          <th>제3자배정 유상증자</th>
          <th>지분교환</th>
          <th>구주 매각</th>
        </tr>
      </thead>
      <tbody>
        {TPD_STRUCTURE_COMPARISON.map((item) => (
          <tr>
            <td><strong>{item.label}</strong></td>
            <td>{item.thirdPartyAllotment}</td>
            <td>{item.shareSwap}</td>
            <td>{item.secondarySale}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 5-7. 호재·악재 판단 섹션

```astro
<section class="content-section tpd-signal-section" aria-labelledby="tpd-signal-title">
  <div class="tpd-section-heading">
    <p>해석 프레임</p>
    <h2 id="tpd-signal-title">유상증자가 호재 또는 악재로 해석되는 조건</h2>
  </div>
  <div class="tpd-signal-grid">
    {TPD_SIGNAL_GROUPS.map((group) => (
      <article class="tpd-signal-card" data-tone={group.tone}>
        <h3>{group.title}</h3>
        <ul>
          {group.items.map((item) => <li>{item}</li>)}
        </ul>
      </article>
    ))}
  </div>
</section>
```

---

## 6. 클라이언트 JS 설계

### 6-1. DOM 선택자

```js
const selectors = {
  form: "[data-tpd-form]",
  presetButton: "[data-preset-id]",
  result: "[data-result]",
  existingShares: "#tpd-existing-shares",
  newShares: "#tpd-new-shares",
  investmentAmount: "#tpd-investment-amount",
  investmentUnit: "#tpd-investment-unit",
  currentPrice: "#tpd-current-price",
  ownedShares: "#tpd-owned-shares",
  cancelledShares: "#tpd-cancelled-shares",
  investorName: "#tpd-investor-name",
};
```

### 6-2. 초기화 순서

1. 기본 프리셋 값을 JS 상수로 정의하거나 DOM `data-preset`에서 읽는다.
2. URL 파라미터가 있으면 입력값에 우선 반영한다.
3. 없으면 네이버·엔비디아 프리셋을 입력값으로 사용한다.
4. `input`, `change` 이벤트를 폼 전체에 위임한다.
5. 프리셋 버튼 클릭 시 값 세팅 후 재계산한다.
6. 계산 결과를 `data-result` 요소에 주입한다.
7. URL 파라미터를 갱신한다.

### 6-3. 렌더링 맵

| data-result | 표시값 |
|---|---|
| `issuePrice` | `formatPrice(result.issuePrice)` |
| `investorOwnershipRate` | `formatPercent(result.investorOwnershipRate)` |
| `dilutionRate` | `formatPercent(result.dilutionRate)` |
| `breakEvenValueIncreaseRate` | `formatPercent(result.breakEvenValueIncreaseRate)` |
| `postMoneyShares` | `${formatNumber(result.postMoneyShares)}주` |
| `preMoneyValuation` | `formatWon(result.preMoneyValuation)` |
| `postMoneyValuation` | `formatWon(result.postMoneyValuation)` |
| `issueDiscountRate` | `result.issueDiscountRate === null ? "현재 주가 입력 필요" : formatPercent(result.issueDiscountRate)` |
| `ownershipBefore` | `formatPercent(result.ownershipBefore, 6)` |
| `ownershipAfter` | `formatPercent(result.ownershipAfter, 6)` |
| `ownershipComment` | 보유 주식 수와 희석률을 넣은 설명 문장 |

### 6-4. 오류 메시지

오류는 결과 전체를 막기보다 입력 필드 하단에 짧게 노출한다.

```html
<p class="tpd-field-error" data-error-for="cancelledShares" hidden>
  소각 예정 주식 수는 기존 발행주식 수보다 클 수 없습니다.
</p>
```

최소 구현에서는 오류 메시지 대신 값을 clamp하고 `InfoNotice` 성격의 주의 문구를 결과 패널에 표시해도 된다.

---

## 7. SCSS 설계

파일: `src/styles/scss/pages/_third-party-allotment-dilution-calculator.scss`

### 7-1. 클래스 목록

```scss
.tpd-page
.tpd-section-heading
.tpd-preset-section
.tpd-preset-grid
.tpd-preset-card
.tpd-calculator-section
.tpd-calculator-grid
.tpd-input-panel
.tpd-result-panel
.tpd-field
.tpd-field--money
.tpd-money-row
.tpd-advanced
.tpd-kpi-grid
.tpd-kpi-card
.tpd-detail-grid
.tpd-card-badge
.tpd-ownership-section
.tpd-ownership-card
.tpd-ownership-row
.tpd-table-wrap
.tpd-structure-table
.tpd-signal-section
.tpd-signal-grid
.tpd-signal-card
.tpd-case-section
.tpd-case-grid
.tpd-source-section
.tpd-source-list
```

### 7-2. 레이아웃

```scss
.tpd-page {
  display: grid;
  gap: 28px;
}

.tpd-calculator-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  align-items: start;
}

.tpd-input-panel,
.tpd-result-panel,
.tpd-preset-card,
.tpd-kpi-card,
.tpd-ownership-card,
.tpd-signal-card {
  border: 1px solid #dde3f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(22, 30, 46, 0.06);
}

@media (max-width: 900px) {
  .tpd-calculator-grid {
    grid-template-columns: 1fr;
  }
}
```

### 7-3. 입력 필드

```scss
.tpd-input-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.tpd-field {
  display: grid;
  gap: 6px;

  span,
  label {
    font-weight: 900;
    color: #111928;
  }

  input,
  select {
    width: 100%;
    border: 1px solid #cfd8ea;
    border-radius: 8px;
    padding: 11px 12px;
    font: inherit;
    color: #111928;
    background: #fff;
  }

  small {
    color: #6b7280;
    line-height: 1.5;
  }
}

.tpd-money-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px;
  gap: 8px;
}
```

### 7-4. 결과 카드

```scss
.tpd-kpi-grid,
.tpd-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.tpd-kpi-card {
  display: grid;
  gap: 6px;
  padding: 16px;

  p,
  small {
    margin: 0;
  }

  strong {
    color: #111928;
    font-size: clamp(22px, 4vw, 30px);
    line-height: 1.15;
    word-break: keep-all;
  }

  small {
    color: #6b7280;
    line-height: 1.5;
  }
}

@media (max-width: 560px) {
  .tpd-kpi-grid,
  .tpd-detail-grid {
    grid-template-columns: 1fr;
  }
}
```

### 7-5. 표·비교 섹션

```scss
.tpd-table-wrap {
  overflow-x: auto;
  border: 1px solid #dde3f0;
  border-radius: 8px;
}

.tpd-structure-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid #e5e9f5;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    background: #eef2fb;
    font-weight: 900;
  }
}
```

### 7-6. 색상 톤

- 희석률 결과 카드는 빨간색만 쓰지 않고 중립 카드 스타일 유지
- 긍정 조건은 `#ecfdf5`, 부정 조건은 `#fff7ed` 정도의 약한 배경 사용
- 투자 권유처럼 보이지 않도록 `상승`, `하락`을 색상으로 과장하지 않음

---

## 8. Astro 페이지 설계

파일: `src/pages/tools/third-party-allotment-dilution-calculator.astro`

### 8-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  TPD_META,
  TPD_PRESETS,
  TPD_RESULT_CARDS,
  TPD_STRUCTURE_COMPARISON,
  TPD_SIGNAL_GROUPS,
  TPD_CASE_SUMMARY,
  TPD_FAQ,
  TPD_RELATED_LINKS,
  TPD_SOURCE_LINKS,
} from "../../data/thirdPartyAllotmentDilution";
---
```

### 8-2. BaseLayout

```astro
<BaseLayout
  title={TPD_META.seoTitle}
  description={TPD_META.seoDescription}
  jsonLd={jsonLd}
>
```

JSON-LD:
- `WebApplication` 또는 `SoftwareApplication`
- `FAQPage`
- `BreadcrumbList`

`WebApplication` 예시:

```ts
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: TPD_META.title,
  description: TPD_META.description,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: toolUrl,
  inLanguage: "ko-KR",
}
```

### 8-3. SeoContent intro 구조

`CONTENT_GUIDE.md` 기준에 맞춰 4단락, 총 600자 이상 작성한다.

1. 맥락: 유상증자 뉴스에서 개인 투자자가 궁금해하는 것
2. 계산 원리: 총주식 수 증가와 지분율 희석 수식
3. 해석 방법: 희석률과 주가 영향은 다르며 투자금 유입도 함께 봐야 함
4. 한계: 공시, 보호예수, 발행가액, 자사주 소각, 거래 조건 확인 필요

---

## 9. 접근성 및 UX

### 9-1. 접근성

- 모든 입력은 `<label>`과 연결한다.
- 결과 패널은 `aria-live="polite"`를 사용한다.
- 결과 카드의 의미는 색상만으로 전달하지 않고 텍스트 배지로 표시한다.
- 표에는 `caption`을 둔다.
- 프리셋 버튼은 `<button type="button">`을 사용한다.
- 외부 링크는 `target="_blank" rel="noopener noreferrer"`를 사용한다.

### 9-2. 모바일 UX

- 390px 기준 첫 화면에서 Hero 이후 프리셋과 주요 입력이 빠르게 보이도록 한다.
- 입력 폼은 1열 스택.
- 결과 카드도 모바일에서는 1열.
- 긴 숫자는 줄바꿈 가능하도록 `word-break: keep-all`보다 숫자 영역에는 `overflow-wrap: anywhere`를 고려한다.
- 표는 가로 스크롤로 처리한다.
- 고급 설정은 접어서 초기 화면 밀도를 낮춘다.

### 9-3. 상호작용

- 별도 계산 버튼 없음. 입력 즉시 재계산.
- 프리셋 버튼 클릭 시 즉시 입력값과 결과 갱신.
- 공유 버튼은 선택 기능. 구현 시 `navigator.clipboard.writeText(location.href)` 사용.
- 초기화 버튼은 네이버·엔비디아 프리셋으로 되돌림.

---

## 10. 등록 파일 설계

### 10-1. `src/data/tools.ts`

추가 항목 예시:

```ts
{
  slug: "third-party-allotment-dilution-calculator",
  title: "제3자배정 유상증자 지분희석 계산기",
  description:
    "신규 발행주식 수와 투자금액을 입력해 신주 발행가격, 신규 투자자 지분율, 기존 주주 희석률과 내 지분율 변화를 계산합니다.",
  order: 00,
  badges: ["신규", "투자", "유상증자", "지분희석"],
}
```

실제 `order`는 투자·재테크 계산기 주변 위치를 확인한 뒤 배치한다.

### 10-2. `src/pages/index.astro`

`topicBySlug`에 추가:

```ts
"third-party-allotment-dilution-calculator": "투자·재테크",
```

### 10-3. `src/styles/app.scss`

```scss
@use 'scss/pages/third-party-allotment-dilution-calculator';
```

### 10-4. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/third-party-allotment-dilution-calculator/</loc>
  <lastmod>2026-07-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.80</priority>
</url>
```

---

## 11. QA 체크리스트

### 계산

- [ ] 네이버·엔비디아 프리셋에서 신주 발행가격이 약 205,694원으로 표시되는가?
- [ ] 증자 후 총주식 수가 약 160,000,000주로 표시되는가?
- [ ] 신규 투자자 지분율이 약 4.50%로 표시되는가?
- [ ] 기존 주주 희석률이 약 4.50%로 표시되는가?
- [ ] 희석 상쇄 필요 상승률이 약 4.71%로 표시되는가?
- [ ] 보유 100주 기준 지분율 전후가 6자리 소수점으로 표시되는가?
- [ ] 현재 주가가 0이면 할인율 카드가 오류 없이 안내 문구를 표시하는가?
- [ ] 자사주 소각 수를 입력하면 최종 주식 수와 희석률이 줄어드는가?
- [ ] 소각 수가 기존 주식 수보다 클 때 계산이 깨지지 않는가?

### 콘텐츠

- [ ] 모든 결과 카드에 `단순 계산`, `참고`, `시뮬레이션` 등 배지가 있는가?
- [ ] 보도 기준과 공식 발표 기준을 구분했는가?
- [ ] 주가 방향을 단정하지 않았는가?
- [ ] 네이버·엔비디아 사례를 지분교환으로 잘못 설명하지 않았는가?
- [ ] FAQ가 8개 이상이고 화면에 노출되는가?
- [ ] 출처 섹션에 NVIDIA 공식 발표와 Reuters 보도가 포함되는가?

### UI

- [ ] 320px 모바일에서 입력 필드가 넘치지 않는가?
- [ ] 결과 숫자가 카드 밖으로 밀리지 않는가?
- [ ] 비교표는 모바일에서 가로 스크롤로 읽히는가?
- [ ] 고급 설정이 기본 접힘 상태인가?
- [ ] 프리셋 버튼이 버튼으로 인식되고 키보드 접근이 가능한가?

### SEO·등록

- [ ] `src/data/tools.ts` 등록 완료
- [ ] 홈 카테고리 매핑 완료
- [ ] `src/styles/app.scss` import 완료
- [ ] sitemap URL 추가
- [ ] `npm run build` 성공
- [ ] `dist/tools/third-party-allotment-dilution-calculator/index.html` 생성

---

## 12. 구현 순서

1. `src/data/thirdPartyAllotmentDilution.ts` 작성
2. `src/pages/tools/third-party-allotment-dilution-calculator.astro` 작성
3. `public/scripts/third-party-allotment-dilution-calculator.js` 작성
4. `src/styles/scss/pages/_third-party-allotment-dilution-calculator.scss` 작성
5. `src/data/tools.ts`, `src/pages/index.astro`, `src/styles/app.scss`, `public/sitemap.xml` 등록
6. `npm run build`
7. 산출 HTML에서 핵심 문구와 JSON-LD 확인
8. 가능하면 Playwright 또는 브라우저로 390px/1440px 화면 확인

---

## 13. 향후 확장

### 13-1. 사례 리포트 분리

계산기 출시 후 검색 유입이 붙으면 다음 리포트를 별도 생성한다.

| 항목 | 값 |
|---|---|
| slug | `naver-nvidia-investment-dilution-2026` |
| 경로 | `/reports/naver-nvidia-investment-dilution-2026/` |
| 역할 | 뉴스 검색 유입, 계산기 내부 링크 전환 |
| 주요 섹션 | 거래 구조, 지분교환 아님 설명, AI 인프라 목적, 자사주 소각, 계산기 CTA |

### 13-2. 기능 확장

| 기능 | 설명 | 우선순위 |
|---|---|---:|
| 자사주 소각 효과 별도 카드 | 신주 발행만 있을 때와 소각 반영 후 희석률 차이 표시 | 상 |
| 주가 시나리오 | 현재 주가 유지, 5% 상승, 10% 상승, 5% 하락 시 내 보유금액 | 중 |
| 전환사채·CB 희석 | 전환 가능 주식 수를 추가로 반영 | 중 |
| 다중 투자자 | 전략적 투자자가 여러 명일 때 지분율 분산 | 낮음 |
| 프리머니·포스트머니 독립 계산기 | 투자 전후 기업가치 계산만 분리 | 낮음 |

---

## 14. 최종 판단

이 계산기는 네이버·엔비디아 이슈 트래픽과 `유상증자 계산기`, `지분희석 계산기` 상시 키워드를 동시에 잡을 수 있다. 계산 로직은 단순하지만 사용자가 체감하는 효용이 크고, 입력값을 바꿔보는 상호작용이 있어 비교계산소에 잘 맞는다.

가장 중요한 구현 포인트는 **공식값·보도값·단순 계산값을 분리해서 보여주는 것**이다. 페이지는 투자 판단을 대신하지 않고, 공시를 읽기 전 숫자 구조를 이해하는 참고 도구로 설계해야 한다.
