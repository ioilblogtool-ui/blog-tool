# 설계 문서
## 침수차 보험처리 계산기

> 기획 원본: `docs/plan/202607/chuseok-content-cluster-2026-plan.md` (§4-4)
> 신규 구현 페이지: `/tools/flood-car-insurance-calculator/`
> 발행 목표: 2026-08월 초 (장마·태풍 시즌)

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `flood-car-insurance-calculator` |
| 페이지 경로 | `src/pages/tools/flood-car-insurance-calculator.astro` |
| 데이터 파일 | `src/data/floodCarInsuranceCalculator.ts` |
| 스크립트 | `public/scripts/flood-car-insurance-calculator.js` |
| SCSS | `src/styles/scss/pages/_flood-car-insurance-calculator.scss` |
| SCSS/데이터 prefix | `fci-` / `FCI_` |
| 레이아웃 | `SimpleToolShell` (`pageClass="fci-page"`) |
| 홈 tools 카테고리 | `category: "자동차·보험"` |
| 주요 CTA | `/tools/car-accident-insurance-vs-cash-calculator/` |

---

## 1. 제품 방향

### 1-1. 한 줄 정의

`차량 시세와 예상 수리비를 입력하면 전손·분손 가능성과 자기부담금을 반영한 예상 보험금을 추정하는 계산기`

### 1-2. 데이터 신뢰성 원칙 (★ 핵심)

침수차 보험 처리는 **최종적으로 보험사 손해사정 결과가 우선**하는 영역이다. 착수 전 확인한 사실관계:

| 항목 | 확인 결과 | 출처 |
|---|---|---|
| 보상 전제 조건 | 자기차량손해담보(차량단독사고 특약 포함) 가입이 되어 있어야 침수 피해 보상 가능. 미가입 시 보상 불가 | [DB손해보험](https://www.idbins.com/pc/bizxpress/ask/cc/FWCLAV1146.shtm) |
| 전손 판정 기준 | 손해액(수리비 등)+인정 비용의 합이 사고 당시 차량가액(보험가액) 이상이면 전손. 미만이면 분손(수리) | [정보알리미](https://dnublog.co.kr/2026/07/06/%EC%B9%A8%EC%88%98%EC%B0%A8-%EC%A0%84%EC%86%90-%EC%B2%98%EB%A6%AC-%EA%B8%B0%EC%A4%80%EA%B3%BC-%EC%B0%A8%EB%9F%89%EA%B0%80%EC%95%A1%C2%B7%EB%B3%B4%ED%97%98%EA%B8%88-%ED%99%95%EC%9D%B8-%EB%B0%A9/) |
| 자기부담금 기준 | 정률 20%(또는 30%), 최소 20만 원~최대 50만 원 범위 내에서 산정 (예: 손해액 50만 원 → 20%인 10만 원이 최소값 20만 원보다 작아 자기부담금 20만 원 적용) | [normen.co.kr](https://normen.co.kr/5397/), [finispot](https://finispot.com/%EC%9E%90%EA%B8%B0%EB%B6%80%EB%8B%B4%EA%B8%88-%ED%99%98%EA%B8%89/) |
| 전손 시 자기부담금 | 상품에 따라 전손 시 자기부담금을 공제하지 않는 경우도, 공제하는 경우도 있음 — **단정 불가, 보험증권 확인 필요** | [DB손해보험](https://www.idbins.com/pc/bizxpress/ask/cc/FWCLAV1146.shtm) |

계산기는 위 공식 기준(정률 20%, 20만~50만 원 캡)을 **기본값**으로 제공하되, 사용자가 자기 증권의 실제 자기부담금 비율·범위를 직접 입력해 수정할 수 있게 설계한다(§3-3).

### 1-3. 피해야 할 것

- "이 계산기 결과가 실제 지급액이다"라는 인상
- 자기차량손해담보 미가입자에게 보상 가능한 것처럼 보이는 결과 노출 (§4-2에서 가입 여부를 첫 입력으로 강제)
- 전손 시 자기부담금 면제 여부를 단정

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const FCI_META = {
  slug: "flood-car-insurance-calculator",
  title: "침수차 보험처리 계산기",
  description: "차량 시세와 예상 수리비를 입력하면 전손·분손 가능성과 예상 보험금을 추정합니다.",
  seoTitle: "침수차 보험처리 계산기 2026 | 전손·분손 예상 보험금 바로 계산",
  seoDescription:
    "차량 시세와 예상 수리비를 입력하면 전손·분손 판정 기준에 따라 자기부담금을 반영한 예상 보험금을 계산합니다. 자기차량손해담보 가입 여부부터 확인하세요.",
  updatedAt: "2026-07",
  dataNote:
    "이 계산기는 자기차량손해담보(차량단독사고 특약) 가입자를 기준으로 한 참고용 추정 도구입니다. 실제 전손·분손 판정과 최종 보험금은 보험사 손해사정 결과가 우선합니다.",
};
```

### 2-2. Hero

```astro
<CalculatorHero
  eyebrow="침수차 보험처리"
  title={FCI_META.title}
  description="차량 시세와 예상 수리비를 입력하면 전손·분손 가능성과 예상 보험금을 추정합니다."
  badges={["장마·태풍", "자차보험", "전손·분손 추정", "2026"]}
/>
```

### 2-3. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 침수차 보험처리 | title, H1 |
| 침수차 전손 기준 | 결과 패널, FAQ |
| 자차보험 자기부담금 | 입력 섹션, FAQ |
| 침수차 보험금 계산 | 결과 패널 |
| 자기차량손해담보 | InfoNotice, FAQ |

---

## 3. 데이터 파일 설계

### 3-1. 타입

```ts
export interface FloodCarInput {
  hasCollisionCoverage: boolean; // 자기차량손해담보 가입 여부
  vehicleValue: number; // 보험가액(사고 당시 차량 시세)
  estimatedRepairCost: number; // 예상 수리비 + 인정 비용
  deductibleRate: number; // 자기부담금 정률, 기본 20
  deductibleMin: number; // 기본 200,000
  deductibleMax: number; // 기본 500,000
  waiveDeductibleOnTotalLoss: boolean; // 전손 시 자기부담금 면제 특약 여부
}

export interface FloodCarResult {
  isTotalLoss: boolean;
  deductibleAmount: number;
  expectedPayout: number;
  lossRatio: number; // estimatedRepairCost / vehicleValue * 100
}
```

### 3-2. 기본값

```ts
export const FCI_DEFAULT_INPUT: FloodCarInput = {
  hasCollisionCoverage: true,
  vehicleValue: 15_000_000,
  estimatedRepairCost: 8_000_000,
  deductibleRate: 20,
  deductibleMin: 200_000,
  deductibleMax: 500_000,
  waiveDeductibleOnTotalLoss: false,
};
```

### 3-3. 계산 함수

```ts
export function calcFloodCarInsurance(input: FloodCarInput): FloodCarResult {
  const isTotalLoss = input.estimatedRepairCost >= input.vehicleValue;

  const rawDeductible = Math.round((input.estimatedRepairCost * input.deductibleRate) / 100);
  const deductibleAmount = Math.min(Math.max(rawDeductible, input.deductibleMin), input.deductibleMax);

  let expectedPayout: number;
  if (isTotalLoss) {
    // 전손: 보험금은 차량가액 기준. 면제 특약이 없으면 자기부담금 공제
    expectedPayout = input.waiveDeductibleOnTotalLoss
      ? input.vehicleValue
      : Math.max(input.vehicleValue - deductibleAmount, 0);
  } else {
    // 분손: 수리비에서 자기부담금 공제
    expectedPayout = Math.max(input.estimatedRepairCost - deductibleAmount, 0);
  }

  return {
    isTotalLoss,
    deductibleAmount,
    expectedPayout,
    lossRatio: Math.round((input.estimatedRepairCost / input.vehicleValue) * 1000) / 10,
  };
}
```

`hasCollisionCoverage`가 `false`이면 계산을 실행하지 않고 "자기차량손해담보 미가입 — 침수 피해는 보상되지 않습니다"라는 경고 카드만 표시한다(§4-2).

### 3-4. 프리셋

```ts
export const FCI_PRESETS = [
  { id: "minor-flood", label: "경미한 침수 (분손 예상)", input: { vehicleValue: 15_000_000, estimatedRepairCost: 5_000_000 } },
  { id: "engine-damage", label: "엔진 침수 (전손 경계)", input: { vehicleValue: 15_000_000, estimatedRepairCost: 13_000_000 } },
  { id: "old-car-total", label: "노후 차량 전손", input: { vehicleValue: 5_000_000, estimatedRepairCost: 6_000_000 } },
];
```

### 3-5. FAQ

```ts
export const FCI_FAQ = [
  {
    question: "침수차는 무조건 보험처리가 되나요?",
    answer:
      "아닙니다. 자동차보험 중 자기차량손해담보(차량단독사고 보상 특약 포함)에 가입되어 있어야 침수 피해를 보상받을 수 있습니다. 책임보험만 가입했다면 내 차량의 침수 피해는 보상되지 않습니다.",
  },
  {
    question: "전손과 분손은 어떻게 구분하나요?",
    answer:
      "수리비와 인정 비용을 합한 금액이 사고 당시 차량가액(보험가액) 이상이면 전손으로, 미만이면 분손(수리 처리)으로 판정하는 것이 일반적인 기준입니다. 엔진이나 전자장치가 물리적으로 복구 불가능한 경우뿐 아니라, 수리는 가능하지만 비용이 차량가액에 이르는 경우도 전손으로 검토될 수 있습니다.",
  },
  {
    question: "자기부담금은 얼마나 되나요?",
    answer:
      "일반적으로 손해액의 20%(또는 30%)를 최소 20만 원, 최대 50만 원 범위 안에서 부담합니다. 예를 들어 손해액이 50만 원이면 20%인 10만 원이 최소 자기부담금 20만 원보다 작아 실제로는 20만 원을 부담하고, 손해액이 300만 원이면 20%인 60만 원이 최대 50만 원을 넘어 50만 원만 부담합니다. 정확한 비율과 한도는 본인 보험증권을 확인해야 합니다.",
  },
  {
    question: "전손 판정을 받아도 자기부담금을 내나요?",
    answer:
      "보험 상품에 따라 다릅니다. 전손 시 자기부담금을 공제하지 않는 상품도 있고, 별도 특약으로 면제되는 경우도 있습니다. 반드시 본인 보험증권과 약관을 확인해야 합니다.",
  },
  {
    question: "이 계산기 결과와 실제 보험금이 다르면 어떻게 하나요?",
    answer:
      "이 계산기는 일반적인 산정 기준을 적용한 참고용 추정치입니다. 실제 차량가액 산정, 손해액 인정 범위, 잔존물 처리 방식은 보험사 손해사정 결과에 따라 달라지므로 최종 금액은 보험사 안내를 기준으로 확인해야 합니다.",
  },
];
```

### 3-6. 관련 링크

```ts
export const FCI_RELATED_LINKS = [
  { href: "/tools/car-accident-insurance-vs-cash-calculator/", label: "자동차 사고 보험처리 vs 현금처리 계산기" },
];
```

---

## 4. 페이지 마크업 설계

```text
[SimpleToolShell pageClass="fci-page"]
  slot="hero": [CalculatorHero] + [InfoNotice dataNote — "손해사정 결과 우선" 강조]
  slot="actions": [ToolActionBar]
  slot="aside":
    .panel 프리셋 그리드 (FCI_PRESETS)
    .panel 가입 여부 확인 — 자기차량손해담보 가입 toggle (data-fci-input="hasCollisionCoverage", 최상단 배치, §4-2)
    .panel 기본 입력
      - 차량 시세/보험가액 (data-fci-input="vehicleValue")
      - 예상 수리비 (data-fci-input="estimatedRepairCost")
    .panel 자기부담금 설정 (기본값 노출, 접이식 "직접 조정" 옵션)
      - 부담률(%), 최소·최대 한도
      - 전손 시 자기부담금 면제 특약 여부 토글
  default slot (main):
    .panel.fci-warning-panel[hidden] — 미가입 시에만 노출되는 경고 카드 (§4-2)
    .panel.fci-result-panel — 전손/분손 판정 배지 + 예상 보험금 메인 카드
    .panel — 손해액 대비 차량가액 비율(loss ratio) 게이지
    .panel — 계산 상세 분해 (수리비/자기부담금/예상 보험금)
  slot="seo": [SeoContent]
```

### 4-1. 판정 배지

```astro
<article class="panel fci-result-panel" aria-live="polite">
  <span class="fci-verdict-badge" data-fci-verdict>전손 추정</span>
  <strong data-fci-result="expectedPayout">0원</strong>
  <small>예상 보험금 (자기부담금 반영)</small>
  <p class="fci-disclaimer">실제 판정은 보험사 손해사정 결과가 우선합니다.</p>
</article>
```

### 4-2. 미가입 경고 카드 (JS로 토글)

```astro
<article class="panel fci-warning-panel" data-fci-warning hidden>
  <strong>자기차량손해담보 미가입 상태입니다</strong>
  <p>책임보험만 가입한 경우 침수로 인한 내 차량 피해는 보상되지 않습니다. 보험증권에서 자기차량손해담보(또는 차량단독사고 특약) 가입 여부를 먼저 확인하세요.</p>
</article>
```

`hasCollisionCoverage`가 false면 이 카드를 노출하고 `.fci-result-panel`은 `hidden` 처리한다.

---

## 5. SCSS 설계

```scss
.fci-page {
  .fci-verdict-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-weight: 900;
    font-size: 13px;
    background: #eaf1ff;
    color: #1a56db;

    &[data-verdict="total-loss"] {
      background: #fee2e2;
      color: #dc2626;
    }
  }

  .fci-warning-panel {
    border: 1px solid #fecaca;
    background: #fef2f2;
    border-radius: 8px;
    padding: 18px;

    strong { color: #b91c1c; }
  }

  .fci-disclaimer {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 8px;
  }
}
```

---

## 6. 구현 순서

1. `src/data/floodCarInsuranceCalculator.ts` 작성 (§3)
2. `src/pages/tools/flood-car-insurance-calculator.astro` 작성 (§4)
3. `public/scripts/flood-car-insurance-calculator.js` 작성 — 미가입 시 경고 카드 토글 로직 포함 (§4-2)
4. `src/styles/scss/pages/_flood-car-insurance-calculator.scss` 작성, `app.scss` 등록
5. `src/data/tools.ts` 등록
6. `public/sitemap.xml` 등록
7. `npm run build` 확인

---

## 7. QA 체크리스트

- [ ] 자기차량손해담보 미가입 토글 시 경고 카드만 보이고 결과 카드는 숨겨지는가?
- [ ] 손해액이 차량가액 이상일 때 정확히 "전손"으로 판정되는가? (경계값 테스트: 손해액 = 차량가액)
- [ ] 자기부담금이 최소 20만~최대 50만 원 범위 안에서 정확히 캡되는가? (손해액 50만원 → 자기부담금 20만원, 손해액 300만원 → 자기부담금 50만원 검증)
- [ ] 전손 시 자기부담금 면제 토글이 결과에 정확히 반영되는가?
- [ ] "손해사정 결과 우선" 고지가 결과 카드에 항상 보이는가?
- [ ] `npm run build` 성공 확인
