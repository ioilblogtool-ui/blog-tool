# 설계 문서
## 2026 재산세 납부기간 총정리

> 기획 원본: `docs/plan/202607/property-tax-payment-2026.md`  
> 현재 구현 페이지: `/reports/property-tax-payment-2026/`  
> 설계 목적: 기존 `2026 재산세 납부 완전 가이드` 페이지를 `납부기간·재산 종류별 일정·6월 1일 기준` 중심의 시즌성 검색 리포트로 보강한다.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `property-tax-payment-2026` |
| 페이지 경로 | `src/pages/reports/property-tax-payment-2026.astro` |
| 데이터 파일 | `src/data/propertyTaxPayment2026.ts` |
| SCSS | `src/styles/scss/pages/_property-tax-payment-2026.scss` |
| SCSS prefix | `.ptx` |
| 스크립트 | 없음. MVP는 정적 리포트 |
| 등록 파일 | `src/data/reports.ts`, `public/sitemap.xml`, `src/styles/app.scss` 등록 완료 |
| 콘텐츠 유형 | `/reports/` 시즌성 정보 리포트 |
| 주요 CTA | `/tools/apartment-holding-tax/` |
| 빌드 확인 | 보강 구현 후 `npm run build` 필수 |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`아파트·주택·토지·건축물 재산세를 언제 내는지 7월·9월 납부 일정 중심으로 정리하고, 예상 세액 계산기로 연결하는 시즌성 리포트`

### 1-2. 사용자가 얻는 것

- 2026년 재산세 납부기간을 날짜와 요일로 즉시 확인
- 아파트·주택·토지·건축물별로 7월과 9월 중 언제 내야 하는지 확인
- 6월 1일 과세기준일 때문에 매수자·매도자 중 누가 부담하는지 이해
- 재산세 고지서를 못 받았을 때 위택스에서 확인하는 흐름 파악
- 납부기간 확인 후 `아파트 보유세 계산기`로 예상 세액 확인

### 1-3. 피해야 할 것

- 실제 고지세액을 공식 확정값처럼 표현
- 지자체 조례·감면·세부담상한 차이를 생략
- 매수자·매도자 간 계약상 정산을 법정 납세의무와 혼동
- 납부기한 경과 시 부담을 단정적으로 과장
- 세무 상담이나 절세 자문처럼 보이는 문구

---

## 2. SEO 설계

### 2-1. 메타 변경안

현재:

```ts
title: "2026 재산세 납부 완전 가이드"
seoTitle: "2026 재산세 납부 일정·계산 방법 | 7월·9월 기준 완전 가이드"
```

권장:

```ts
export const PTX_META = {
  slug: "property-tax-payment-2026",
  title: "2026 재산세 납부기간 총정리",
  description:
    "아파트·주택·토지·건축물별 2026년 재산세 납부기간과 6월 1일 과세기준일을 정리합니다.",
  seoTitle: "2026 재산세 납부기간 총정리 | 아파트·주택·토지 언제 내야 할까?",
  seoDescription:
    "2026년 재산세 납부기간을 아파트·주택·토지·건축물별로 정리했습니다. 7월·9월 납부 일정, 6월 1일 과세기준일, 분납 기준과 위택스 납부방법까지 확인하세요.",
  updatedAt: "2026-07",
  dataNote:
    "이 리포트는 행정안전부 지방세 안내, 위택스, 지방세법상 재산세 납부 구조를 바탕으로 정리한 참고 자료입니다. 실제 고지세액과 납부 가능 방식은 지자체 고지서와 위택스 조회 결과가 우선합니다.",
};
```

### 2-2. H1 및 Hero

```astro
<CalculatorHero
  eyebrow="부동산 세금 리포트"
  title={PTX_META.title}
  description="아파트·주택·토지·건축물별 7월·9월 납부기간과 6월 1일 과세기준일을 한눈에 확인하세요."
  badges={["2026 기준", "7월·9월 납부", "주택·토지", "위택스"]} 
/>
```

### 2-3. H2 구조

검색 의도 순서대로 배치한다.

1. `2026년 재산세는 7월 16일과 9월 16일부터 납부합니다`
2. `아파트·주택·토지·건축물별 납부월이 다릅니다`
3. `재산세는 6월 1일 현재 소유자가 냅니다`
4. `위택스에서 고지서 없이도 조회·납부할 수 있습니다`
5. `재산세를 놓치면 납부지연 부담이 생길 수 있습니다`
6. `250만 원 초과 고지서는 분납을 확인하세요`
7. `내 아파트 재산세는 계산기로 먼저 확인하세요`
8. `2026 재산세 납부기간 FAQ`

### 2-4. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 2026 재산세 납부기간 | title, H1, 첫 H2, FAQ |
| 재산세 언제 | Hero description, FAQ |
| 아파트 재산세 납부기간 | 재산 종류별 표, FAQ |
| 주택 재산세 납부기간 | 표, 주택 설명 카드 |
| 토지 재산세 납부기간 | 표, FAQ |
| 재산세 7월 9월 | 납부 달력, H2 |
| 재산세 과세기준일 6월 1일 | 과세기준일 섹션 |
| 위택스 재산세 납부 | 납부방법 섹션 |
| 재산세 분납 | 분납 섹션, FAQ |

---

## 3. 데이터 파일 설계

기존 `propertyTaxPayment2026.ts`는 유지하되, 납부기간 검색 의도에 맞춰 타입과 배열을 확장한다.

### 3-1. 상수 구조

```ts
export const PTX_META = { ... };
export const PTX_SCHEDULE = [ ... ];
export const PTX_ASSET_SCHEDULE = [ ... ];      // 신규
export const PTX_OWNERSHIP_CASES = [ ... ];     // 신규
export const PTX_PAYMENT_METHODS = [ ... ];
export const PTX_LATE_PAYMENT_NOTES = [ ... ];  // 신규
export const PTX_INSTALLMENT = { ... };
export const PTX_RATES = [ ... ];               // 현재 유지, 하단 보조 섹션
export const PTX_EXAMPLES = [ ... ];            // 현재 유지, 하단 보조 섹션
export const PTX_FAQ = [ ... ];
export const PTX_RELATED_LINKS = [ ... ];
export const PTX_SOURCE_LINKS = [ ... ];
```

### 3-2. 납부 일정 타입

```ts
export type PaymentSchedule = {
  id: "july" | "september";
  month: string;
  period: string;
  weekday: string;
  target: string;
  note: string;
  highlight: string;
};
```

데이터:

```ts
export const PTX_SCHEDULE: PaymentSchedule[] = [
  {
    id: "july",
    month: "7월",
    period: "2026년 7월 16일 ~ 7월 31일",
    weekday: "목요일 ~ 금요일",
    target: "주택 1기분, 건축물, 선박, 항공기",
    note: "주택분 재산세의 절반과 건축물분 재산세가 고지됩니다.",
    highlight: "7월 31일 금요일까지",
  },
  {
    id: "september",
    month: "9월",
    period: "2026년 9월 16일 ~ 9월 30일",
    weekday: "수요일 ~ 수요일",
    target: "주택 2기분, 토지",
    note: "주택분 나머지 절반과 토지분 재산세가 고지됩니다.",
    highlight: "9월 30일 수요일까지",
  },
];
```

### 3-3. 재산 종류별 납부월

```ts
export type AssetScheduleRow = {
  assetType: string;
  july: string;
  september: string;
  summary: string;
  badge?: string;
};
```

데이터:

```ts
export const PTX_ASSET_SCHEDULE: AssetScheduleRow[] = [
  {
    assetType: "아파트·주택",
    july: "1기분",
    september: "2기분",
    summary: "주택분 재산세는 7월과 9월에 나누어 고지됩니다.",
    badge: "가장 많음",
  },
  {
    assetType: "토지",
    july: "-",
    september: "납부",
    summary: "토지분 재산세는 9월에 납부합니다.",
  },
  {
    assetType: "건축물",
    july: "납부",
    september: "-",
    summary: "상가·일반 건축물분은 7월 납부 대상입니다.",
  },
  {
    assetType: "선박·항공기",
    july: "납부",
    september: "-",
    summary: "해당 자산 보유자에게만 부과됩니다.",
  },
];
```

### 3-4. 6월 1일 소유자 사례

```ts
export type OwnershipCase = {
  title: string;
  dateLabel: string;
  payer: string;
  explanation: string;
  caution?: string;
};
```

데이터:

```ts
export const PTX_OWNERSHIP_CASES: OwnershipCase[] = [
  {
    title: "5월 31일 잔금·등기 완료",
    dateLabel: "6월 1일 전",
    payer: "새 소유자 부담 가능성 높음",
    explanation: "6월 1일 현재 소유자가 새 매수자라면 해당 연도 재산세 납세의무자가 됩니다.",
  },
  {
    title: "6월 1일 현재 보유",
    dateLabel: "과세기준일",
    payer: "그날 소유자가 납세의무자",
    explanation: "재산세는 매년 6월 1일 현재 소유자를 기준으로 부과됩니다.",
  },
  {
    title: "6월 2일 매수",
    dateLabel: "6월 1일 후",
    payer: "기존 소유자 부담 가능성 높음",
    explanation: "매수일이 6월 1일 이후라면 법정 납세의무는 기존 소유자에게 남을 수 있습니다.",
    caution: "단, 거래 당사자 간 정산 특약은 별도로 확인해야 합니다.",
  },
];
```

### 3-5. 납부 지연 안내

```ts
export type LatePaymentNote = {
  title: string;
  body: string;
};
```

데이터:

```ts
export const PTX_LATE_PAYMENT_NOTES: LatePaymentNote[] = [
  {
    title: "기한 말일 전에 미리 납부",
    body: "납부 마지막 날에는 위택스 접속이 몰릴 수 있으므로 가능하면 1~2일 전에 확인하는 편이 안전합니다.",
  },
  {
    title: "전자고지·자동이체 확인",
    body: "전자고지를 신청했다면 우편 고지서가 오지 않을 수 있습니다. 위택스 또는 지자체 앱에서 고지 내역을 확인하세요.",
  },
  {
    title: "지연 부담 가능성",
    body: "납부기한을 넘기면 납부지연 부담이 생길 수 있습니다. 실제 가산 여부와 금액은 고지서와 지자체 안내를 기준으로 확인해야 합니다.",
  },
];
```

---

## 4. 페이지 IA 설계

### 4-1. 전체 섹션 순서

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page ptx-page">
    [CalculatorHero]
    [InfoNotice]
    .ptx-overview-section        // 신규: 2026 납부 핵심 3카드
    .ptx-schedule-section        // 기존 보강: 7월·9월 납부 달력
    .ptx-asset-section           // 신규: 재산 종류별 납부월 표
    .ptx-owner-section           // 신규: 6월 1일 소유자 사례
    .ptx-payment-section         // 기존 보강: 위택스 중심 납부방법
    .ptx-late-section            // 신규: 놓치면 생기는 일
    .ptx-installment-section     // 기존 유지: 분납 기준
    .ptx-rates-section           // 기존 하단 이동: 세율 구조
    .ptx-examples-section        // 기존 하단 이동: 세액 예시
    .ptx-related-section         // 기존 보강: 관련 도구
    [SeoContent]
  </main>
```

### 4-2. 첫 화면 설계

첫 화면 목표는 세율 설명이 아니라 납부기간 즉답이다.

Hero 직후에 3개 요약 카드를 둔다.

| 카드 | 메인 문구 | 보조 문구 |
|---|---|---|
| 과세기준일 | 6월 1일 | 이날 소유자가 납세의무자 |
| 7월 납부 | 7월 16일 ~ 31일 | 주택 1기분·건축물 |
| 9월 납부 | 9월 16일 ~ 30일 | 주택 2기분·토지 |

마크업:

```astro
<section class="content-section ptx-overview-section" aria-labelledby="ptx-overview-title">
  <div class="ptx-section-heading">
    <p>핵심 요약</p>
    <h2 id="ptx-overview-title">2026년 재산세는 이 날짜만 먼저 확인하세요</h2>
  </div>
  <div class="ptx-overview-grid">
    <article class="ptx-overview-card">
      <span>과세기준일</span>
      <strong>6월 1일</strong>
      <p>이날 현재 소유자가 해당 연도 재산세 납세의무자가 됩니다.</p>
    </article>
    ...
  </div>
</section>
```

### 4-3. 납부 달력 섹션

기존 `ptx-schedule-section`을 유지하되 `weekday`, `highlight`를 추가한다.

```astro
{PTX_SCHEDULE.map((s) => (
  <article class:list={["ptx-schedule-card", `ptx-schedule-card--${s.id}`]}>
    <span class="ptx-month-badge">{s.month}</span>
    <strong>{s.period}</strong>
    <em>{s.weekday}</em>
    <p>{s.target}</p>
    <small>{s.note}</small>
    <b>{s.highlight}</b>
  </article>
))}
```

### 4-4. 재산 종류별 표

사용자 질문을 직접 해결하는 핵심 표다.

```astro
<section class="content-section ptx-asset-section" aria-labelledby="ptx-asset-title">
  <div class="ptx-section-heading">
    <p>대상별 일정</p>
    <h2 id="ptx-asset-title">아파트·주택·토지·건축물별 납부월이 다릅니다</h2>
    <span>주택은 두 번, 토지는 9월, 건축물은 7월에 확인합니다.</span>
  </div>
  <div class="table-wrap ptx-table-wrap">
    <table class="ptx-asset-table">
      <thead>
        <tr>
          <th>재산 종류</th>
          <th>7월</th>
          <th>9월</th>
          <th>설명</th>
        </tr>
      </thead>
      <tbody>
        {PTX_ASSET_SCHEDULE.map((row) => (
          <tr>
            <td>
              <strong>{row.assetType}</strong>
              {row.badge && <span class="ptx-mini-badge">{row.badge}</span>}
            </td>
            <td>{row.july}</td>
            <td>{row.september}</td>
            <td>{row.summary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 4-5. 6월 1일 과세기준일 카드

```astro
<section class="content-section ptx-owner-section" aria-labelledby="ptx-owner-title">
  <div class="ptx-section-heading">
    <p>누가 내나요?</p>
    <h2 id="ptx-owner-title">재산세는 6월 1일 현재 소유자가 냅니다</h2>
    <span>매수·매도 시점이 6월 1일 근처라면 잔금일과 등기일, 계약상 정산 특약을 함께 확인하세요.</span>
  </div>
  <div class="ptx-owner-grid">
    {PTX_OWNERSHIP_CASES.map((item) => (
      <article class="ptx-owner-card">
        <span>{item.dateLabel}</span>
        <h3>{item.title}</h3>
        <strong>{item.payer}</strong>
        <p>{item.explanation}</p>
        {item.caution && <small>{item.caution}</small>}
      </article>
    ))}
  </div>
</section>
```

### 4-6. 납부방법 섹션

기존 `PTX_PAYMENT_METHODS`를 사용하되 위택스와 스마트위택스를 앞에 둔다. 외부 링크는 별도 `source` 또는 `url` 필드를 추가해도 된다.

권장 타입:

```ts
export type PaymentMethod = {
  method: string;
  channel: string;
  note: string;
  priority: "primary" | "secondary";
  url?: string;
};
```

CTA:

```astro
<a class="button button--primary" href="https://www.wetax.go.kr" rel="noopener noreferrer" target="_blank">
  위택스에서 재산세 조회하기
</a>
```

외부 링크는 새 창으로 열고 `rel="noopener noreferrer"`를 붙인다.

### 4-7. 놓치면 생기는 일

기한 임박 사용자를 잡는 섹션이다. 공포성 문구보다 체크리스트 톤으로 작성한다.

```astro
<section class="content-section ptx-late-section" aria-labelledby="ptx-late-title">
  <div class="ptx-section-heading">
    <p>기한 체크</p>
    <h2 id="ptx-late-title">납부기한을 놓치기 전에 이 세 가지를 확인하세요</h2>
  </div>
  <div class="ptx-late-grid">
    {PTX_LATE_PAYMENT_NOTES.map((note) => (
      <article class="ptx-late-card">
        <strong>{note.title}</strong>
        <p>{note.body}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-8. 세율표와 공시가격 예시

현재 구현에서는 세율과 세액 예시가 납부 일정 직후에 나온다. 보강 후에는 **납부기간 검색 의도 해결 후 하단 보조 섹션**으로 이동한다.

순서:

1. 납부기간
2. 대상별 일정
3. 6월 1일 기준
4. 납부방법
5. 분납
6. 세율·예상 세액

세액 예시는 계속 `추정` 문구를 유지한다.

---

## 5. SCSS 설계

기존 `.ptx-page` 내부 중첩 구조를 유지한다. 새 클래스는 모두 `.ptx-` prefix를 사용한다.

### 5-1. 추가 클래스 목록

```scss
.ptx-overview-section
.ptx-overview-grid
.ptx-overview-card
.ptx-asset-section
.ptx-asset-table
.ptx-mini-badge
.ptx-owner-section
.ptx-owner-grid
.ptx-owner-card
.ptx-late-section
.ptx-late-grid
.ptx-late-card
```

### 5-2. 그리드 규칙

```scss
.ptx-overview-grid,
.ptx-owner-grid,
.ptx-late-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .ptx-overview-grid,
  .ptx-owner-grid,
  .ptx-late-grid {
    grid-template-columns: 1fr;
  }
}
```

### 5-3. 카드 스타일 원칙

기존 색상 계열을 유지한다.

```scss
.ptx-overview-card,
.ptx-owner-card,
.ptx-late-card {
  border: 1px solid #dde3f0;
  border-radius: 8px;
  background: #f8faff;
  box-shadow: 0 12px 30px rgba(26, 86, 219, 0.06);
  padding: 18px;
}
```

### 5-4. 모바일 표 처리

표는 기존 `.ptx-table-wrap { overflow-x: auto; }`를 재사용한다. 모바일에서 긴 설명이 깨지지 않도록 최소 폭을 둔다.

```scss
.ptx-asset-table {
  min-width: 680px;
}
```

### 5-5. 버튼과 링크

- 기존 `.button button--primary` 사용
- 외부 링크 버튼은 `target="_blank"`지만 버튼 텍스트에 "새 창"을 굳이 쓰지 않는다.
- CTA 밴드는 기존 `.ptx-cta-band`를 재사용한다.

---

## 6. 접근성 및 구조화 데이터

### 6-1. HTML 구조

- 각 `section`은 `aria-labelledby`를 가진다.
- 표에는 `caption`을 둔다.
- 날짜 정보는 카드 안에서 텍스트로 노출한다. 아이콘에만 의존하지 않는다.
- 외부 링크는 `rel="noopener noreferrer"`를 둔다.

### 6-2. JSON-LD

현재 `Article`, `FAQPage`, `BreadcrumbList`가 들어가 있다. 유지한다.

보강 포인트:

```ts
dateModified: PTX_META.updatedAt
```

`updatedAt`은 `"2026-07"`보다 ISO 날짜가 더 명확하다. 가능하면:

```ts
updatedAt: "2026-07-02"
```

처럼 운영 날짜로 관리한다.

### 6-3. FAQPage

FAQ는 화면에 보이는 내용과 JSON-LD가 일치해야 한다. `PTX_FAQ` 배열을 단일 출처로 유지한다.

---

## 7. FAQ 데이터 설계

최소 9개로 확장한다.

```ts
export const PTX_FAQ = [
  {
    question: "2026년 재산세 납부기간은 언제인가요?",
    answer:
      "2026년 재산세는 7월 16일부터 7월 31일까지, 9월 16일부터 9월 30일까지 납부합니다. 주택은 보통 7월과 9월에 나누어 고지되고, 토지는 9월, 건축물은 7월 납부 대상입니다.",
  },
  {
    question: "아파트 재산세는 7월에 내나요, 9월에 내나요?",
    answer:
      "아파트와 주택 재산세는 원칙적으로 7월 1기분과 9월 2기분으로 나누어 납부합니다. 다만 주택분 세액이 소액이면 7월에 한 번에 고지될 수 있으므로 실제 고지서는 위택스나 지자체 안내를 확인해야 합니다.",
  },
  {
    question: "토지 재산세 납부기간은 언제인가요?",
    answer:
      "토지분 재산세는 9월 납부 대상입니다. 2026년에는 9월 16일부터 9월 30일까지가 납부기간입니다.",
  },
  {
    question: "건축물 재산세는 언제 내나요?",
    answer:
      "건축물분 재산세는 7월 납부 대상입니다. 상가, 일반 건축물 등은 주택분과 구분되어 고지될 수 있습니다.",
  },
  {
    question: "재산세는 누가 내나요?",
    answer:
      "재산세는 매년 6월 1일 현재 소유자를 기준으로 부과됩니다. 6월 1일 전후로 부동산을 사고팔았다면 잔금일, 등기일, 계약상 정산 특약을 함께 확인하는 것이 좋습니다.",
  },
  {
    question: "재산세 고지서를 못 받으면 어떻게 하나요?",
    answer:
      "우편 고지서를 받지 못했더라도 위택스나 스마트위택스에서 조회할 수 있습니다. 전자고지를 신청했다면 우편 고지서가 오지 않을 수 있으므로 온라인 고지 내역을 먼저 확인하세요.",
  },
  {
    question: "재산세를 카드로 납부할 수 있나요?",
    answer:
      "위택스와 금융기관 납부 채널을 통해 카드 납부가 가능합니다. 카드사별 혜택, 무이자 할부, 납부 수수료 여부는 시점마다 다를 수 있어 납부 전 카드사 조건을 확인해야 합니다.",
  },
  {
    question: "재산세 분납은 언제 가능한가요?",
    answer:
      "고액 고지서의 경우 일정 기준을 넘으면 분납이 가능할 수 있습니다. 분납 가능 금액과 절차는 실제 고지서와 위택스 안내가 우선이므로, 납부기한 전에 조회해 확인하는 것이 안전합니다.",
  },
  {
    question: "재산세와 종합부동산세는 같은 세금인가요?",
    answer:
      "재산세는 지방세로 부동산 보유자에게 부과되고, 종합부동산세는 일정 공시가격 기준을 넘는 경우 별도로 부과되는 국세입니다. 납부 시기도 달라 재산세는 7월·9월, 종부세는 보통 12월에 확인합니다.",
  },
];
```

---

## 8. 내부 링크 및 CTA 설계

### 8-1. 관련 링크 데이터

현재 2개에서 4개 이상으로 확장 권장.

```ts
export const PTX_RELATED_LINKS = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공시가격으로 재산세와 종부세를 추정합니다.",
  },
  {
    label: "부동산 취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    desc: "집을 살 때 내는 취득세를 함께 확인합니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "취득세·보유세·양도세 구조를 함께 정리합니다.",
  },
  {
    label: "서울 구별 아파트 집값 순위 2026",
    href: "/reports/seoul-district-apartment-price-ranking-2026/",
    desc: "보유세 부담과 함께 볼 서울 아파트 가격 리포트입니다.",
  },
];
```

### 8-2. CTA 배치

| 위치 | CTA | 목적 |
|---|---|---|
| 납부 달력 직후 | `내 아파트 보유세 계산하기` | 계산기 전환 |
| 과세기준일 섹션 하단 | `취득세도 함께 확인하기` | 부동산 거래 세금 연결 |
| 세액 예시 하단 | `공시가격으로 직접 계산하기` | 고의도 사용자 전환 |
| SeoContent related | 관련 계산기·리포트 | 회유율 개선 |

---

## 9. 구현 순서

### 9-1. 데이터 수정

파일: `src/data/propertyTaxPayment2026.ts`

1. `PTX_META` 제목·설명 업데이트
2. `PaymentSchedule` 타입에 `id`, `weekday`, `highlight` 추가
3. `PTX_ASSET_SCHEDULE` 추가
4. `PTX_OWNERSHIP_CASES` 추가
5. `PTX_LATE_PAYMENT_NOTES` 추가
6. `PTX_FAQ` 9개 이상으로 확장
7. `PTX_RELATED_LINKS` 4개 이상으로 확장

### 9-2. Astro 수정

파일: `src/pages/reports/property-tax-payment-2026.astro`

1. import 목록에 신규 데이터 추가
2. Hero title/description/badges 변경
3. `ptx-overview-section` 추가
4. `ptx-schedule-section`에 요일·마감 강조 추가
5. `ptx-asset-section` 추가
6. `ptx-owner-section` 추가
7. `ptx-payment-section`을 위택스 중심으로 보강
8. `ptx-late-section` 추가
9. 세율표와 공시가격 예시는 하단으로 이동
10. SeoContent intro를 납부기간 중심으로 재작성

### 9-3. SCSS 수정

파일: `src/styles/scss/pages/_property-tax-payment-2026.scss`

1. 신규 섹션 카드 스타일 추가
2. 3열 그리드의 모바일 1열 전환 추가
3. `.ptx-asset-table` 최소 폭 추가
4. `.ptx-mini-badge` 추가
5. `.ptx-owner-card small` 주의 문구 스타일 추가

### 9-4. 등록 파일 확인

이미 등록되어 있으나 보강 후 확인한다.

- `src/data/reports.ts`: title/description이 페이지 메타와 크게 어긋나지 않는지 확인
- `public/sitemap.xml`: `/reports/property-tax-payment-2026/` 유지
- `src/styles/app.scss`: `@use 'scss/pages/property-tax-payment-2026';` 유지

---

## 10. QA 체크리스트

### 콘텐츠

- [ ] 첫 화면에서 2026년 7월·9월 납부기간이 바로 보이는가?
- [ ] 아파트·주택·토지·건축물별 납부월이 표로 구분되는가?
- [ ] 6월 1일 과세기준일 설명이 매수·매도 사례로 보이는가?
- [ ] 세액 예시에 `추정` 또는 `참고` 문구가 있는가?
- [ ] 실제 고지세액은 위택스·지자체 기준이라는 안내가 있는가?
- [ ] FAQ가 9개 이상이고 화면에 노출되는가?

### SEO

- [ ] title에 `2026 재산세 납부기간`이 포함되는가?
- [ ] H1이 `납부기간` 의도를 직접 담는가?
- [ ] meta description이 120~160자 내외인가?
- [ ] FAQPage JSON-LD와 화면 FAQ가 같은 데이터에서 나오는가?
- [ ] 내부 링크가 3개 이상 연결되는가?

### UI

- [ ] 320px 모바일에서 카드 텍스트가 넘치지 않는가?
- [ ] 표는 모바일에서 가로 스크롤로 읽을 수 있는가?
- [ ] CTA 버튼이 모바일에서 줄바꿈되어도 깨지지 않는가?
- [ ] 카드 안의 날짜·요일·대상 텍스트가 겹치지 않는가?

### 빌드

- [ ] `npm run build` 성공
- [ ] `dist/reports/property-tax-payment-2026/index.html` 생성
- [ ] sitemap URL 유지

---

## 11. 향후 확장

### 11-1. 2027년 갱신 구조

매년 새 리포트를 만들지 않고 같은 slug를 유지할 경우:

- `updatedAt`
- `PTX_SCHEDULE.period`
- `PTX_SCHEDULE.weekday`
- SEO title의 연도
- sitemap lastmod

만 갱신하면 된다.

별도 연도별 slug를 만들 경우:

- `/reports/property-tax-payment-2027/`
- 기존 2026 페이지에서 2027 페이지로 내부 링크 추가
- 2026 페이지는 과거 기록성 페이지로 유지

### 11-2. 간단 인터랙션 추가 후보

MVP는 정적으로 충분하다. 이후 필요 시 아래만 추가한다.

| 기능 | 방식 | 필요성 |
|---|---|---|
| 보유 재산 선택 필터 | 버튼 클릭으로 대상 일정 강조 | 중 |
| 납부 D-day 표시 | 현재 날짜 기준 계산 | 중 |
| 위택스 납부 체크리스트 | 체크박스 로컬 상태 | 낮음 |

D-day 기능은 날짜가 매년 바뀌므로 유지보수 비용이 있다. 시즌 피크용으로는 정적 날짜 카드가 더 안정적이다.

---

## 12. 최종 판단

이 페이지는 이미 구현되어 있고 네이버 트래킹에서도 `26년 재산세 확인방법`, `아파트 보유세 계산기`, `property-tax-payment-2026` 진입 신호가 확인된 상태다. 따라서 신규 기능을 크게 늘리기보다 **제목·첫 화면·대상별 표·과세기준일 사례·FAQ**를 보강해 납부기간 검색 의도를 더 빠르게 만족시키는 방향이 가장 효율적이다.

구현 난이도는 낮고 시즌성 효과는 높다. 7월 고지서 발송 전후에 우선 반영할 가치가 크다.
