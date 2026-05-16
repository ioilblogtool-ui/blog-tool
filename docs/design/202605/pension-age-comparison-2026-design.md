# 연금 수령 나이별 실수령액 완전 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202605/pension-age-comparison-2026.md`
> 작성일: 2026-05-11
> 콘텐츠 유형: `/reports/` SEO 리포트형 허브 페이지 (계산기 CTA 연결형)

---

## 1. 문서 개요

- 구현 대상: `연금 수령 나이별 실수령액 완전 비교 2026`
- slug: `pension-age-comparison-2026`
- URL: `/reports/pension-age-comparison-2026/`
- 카테고리: 투자/연금/노후
- 핵심 타깃: 50대 은퇴 준비자, 60대 국민연금 수령 예정자, 조기수령·연기수령 고민자
- 핵심 검색 의도: "국민연금 언제 받는 게 유리?", "조기수령 얼마나 깎이나?", "연기수령 손익분기점"
- 핵심 CTA: `/tools/pension-optimal-age/` (연금 수령 최적 나이 계산기)

---

## 2. 구현 파일 구조

```text
src/
  data/
    pensionAgeComparison2026.ts    ← 수령 나이별 지급률 표, 누적액 시뮬레이션, FAQ, 관련 링크
  pages/
    reports/
      pension-age-comparison-2026.astro

src/styles/scss/pages/
  _pension-age-comparison-2026.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/pension-age-comparison-2026';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지. `report-page op-page pac-page` 클래스.
- SCSS prefix: `pac-`

---

## 4. 데이터 모델

```ts
export interface PensionStartAgeRow {
  startAge: number;         // 수령 시작 나이 (60~70)
  type: "early" | "normal" | "delayed";  // 조기/정상/연기
  ratePercent: number;      // 지급률 (70~136%)
}

export interface PensionCumulativeRow {
  startAge: number;
  monthlyAmount: number;    // 월 수령액 (원)
  cumulativeAt70: number;   // 70세까지 누적 (원)
  cumulativeAt75: number;
  cumulativeAt80: number;
  cumulativeAt85: number;
  cumulativeAt90: number;
}

export interface BirthYearPensionAge {
  birthYearRange: string;   // "1969년생 이후"
  normalAge: number;        // 65
  earlyAge: number;         // 60
}
```

---

## 5. 핵심 데이터

### 출생연도별 수급개시연령

```ts
export const BIRTH_YEAR_PENSION_AGES: BirthYearPensionAge[] = [
  { birthYearRange: "1953~1956년생", normalAge: 61, earlyAge: 56 },
  { birthYearRange: "1957~1960년생", normalAge: 62, earlyAge: 57 },
  { birthYearRange: "1961~1964년생", normalAge: 63, earlyAge: 58 },
  { birthYearRange: "1965~1968년생", normalAge: 64, earlyAge: 59 },
  { birthYearRange: "1969년생 이후", normalAge: 65, earlyAge: 60 },
];
```

### 수령 나이별 지급률 (정상수령 65세 기준)

```ts
export const PENSION_RATE_TABLE: PensionStartAgeRow[] = [
  { startAge: 60, type: "early",   ratePercent: 70  },
  { startAge: 61, type: "early",   ratePercent: 76  },
  { startAge: 62, type: "early",   ratePercent: 82  },
  { startAge: 63, type: "early",   ratePercent: 88  },
  { startAge: 64, type: "early",   ratePercent: 94  },
  { startAge: 65, type: "normal",  ratePercent: 100 },
  { startAge: 66, type: "delayed", ratePercent: 107.2 },
  { startAge: 67, type: "delayed", ratePercent: 114.4 },
  { startAge: 68, type: "delayed", ratePercent: 121.6 },
  { startAge: 69, type: "delayed", ratePercent: 128.8 },
  { startAge: 70, type: "delayed", ratePercent: 136.0 },
];
```

### 누적 수령액 예시 (정상수령 월 120만 원 기준)

| 수령 시작 | 월수령액 | 75세까지 | 80세까지 | 85세까지 | 90세까지 |
|---------|---------|---------|---------|---------|---------|
| 60세 조기 | 84만 원 | 1억 5,120만 | 2억 160만 | 2억 5,200만 | 3억 240만 |
| 65세 정상 | 120만 원 | 1억 4,400만 | 2억 1,600만 | 2억 8,800만 | 3억 6,000만 |
| 70세 연기 | 163.2만 원 | 9,792만 | 1억 9,584만 | 2억 9,376만 | 3억 9,168만 |

→ 75세 이전에는 조기수령 누적액 우세, 82~83세부터 정상수령, 85세부터 연기수령 누적액 역전.

---

## 6. 페이지 IA (14개 섹션)

1. **Hero** — H1: "연금 수령 나이별 실수령액 완전 비교 2026"
2. **InfoNotice** — "실제 수령액·신청 가능 여부는 국민연금공단 확인 필요. 계산 예시는 참고용 추정"
3. **DesignTrustPanel**
4. **한국인 평균 수령 나이 현황** — 출생연도별 수급개시연령 표
5. **조기수령 감액률 계산법** — 1년당 6% 감액, 최대 5년(30% 감액)
6. **연기수령 가산율 및 실제 혜택** — 1년당 7.2% 증액, 최대 5년(36%)
7. **성별·건강수명별 손익분기점** — 건강수명 가정별 유리한 전략 표
8. **3층 연금 조합 전략** — 국민연금 + 개인연금 + 퇴직연금 수령 시기 조합
9. **물가상승률 반영 실질 수령액 비교** — 현재가치 할인 개념 설명
10. **소득 공백기 대응법** — 55~70세 단계별 소득 공백 체크리스트
11. **연금 연기 시 건강보험료 영향** — 연금액 증가 → 건보료 부담 가능성
12. **실제 사례 3가지** — 60세 조기/65세 정상/70세 연기 선택 이유와 적합한 사람
13. **2026 제도 변경 사항** — 소득대체율 43%, 보험료율 인상 계획
14. **CTA** — 연금 수령 최적 나이 계산기

---

## 7. 스타일 설계

```scss
.pac-page {
  .pac-rate-table {
    width: 100%;
    border-collapse: collapse;
    th, td { padding: 9px 12px; border-bottom: 1px solid #e8ede9; text-align: right; font-size: 0.88rem; }
    th:first-child, td:first-child { text-align: left; }
    tr.is-early td:last-child { color: #b91c1c; }
    tr.is-normal { background: #f0faf6; font-weight: 700; }
    tr.is-delayed td:last-child { color: #0f6e56; font-weight: 700; }
  }

  .pac-cumulative-table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    th, td { padding: 9px 12px; border-bottom: 1px solid #e8ede9; text-align: right; font-size: 0.85rem; }
    th:first-child, td:first-child { text-align: left; }
  }

  .pac-case-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 760px) { grid-template-columns: repeat(3, 1fr); }
  }

  .pac-case-card {
    border: 1px solid #dce6e2;
    border-radius: 12px;
    padding: 16px;
    background: #fff;
    &--early { border-top: 3px solid #b91c1c; }
    &--normal { border-top: 3px solid #0f6e56; }
    &--delayed { border-top: 3px solid #1a56db; }
  }

  .pac-checklist {
    background: #f8fcfa;
    border: 1px solid #dce6e2;
    border-radius: 12px;
    padding: 20px 24px;
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 12px; border-bottom: 1px solid #edf2f0; font-size: 0.88rem; }
  }

  .pac-cta-box {
    background: #f0faf6;
    border: 1px solid #0f6e56;
    border-radius: 14px;
    padding: 24px;
    text-align: center;
    a { display: inline-block; background: #17382d; color: #fff; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; margin-top: 12px; }
  }
}
```

---

## 8. SEO 설계

```text
title: 연금 수령 나이별 실수령액 완전 비교 2026 — 국민연금 언제 받는 게 유리할까
description: 국민연금 조기수령, 정상수령, 연기수령 시 월수령액과 생애 누적 수령액을 비교합니다. 60세·65세·70세 수령 시 손익분기점, 건강수명, 세금, 건강보험료까지 2026년 기준으로 정리했습니다.
H1: 연금 수령 나이별 실수령액 완전 비교 2026
```

JSON-LD: `Article` + `FAQPage`

키워드: 국민연금 수령 나이 언제 유리, 조기수령 감액, 연기수령 가산, 연금 손익분기점

---

## 9. SeoContent 초안

### introTitle
`국민연금, 언제 받는 게 가장 유리할까 — 2026 수령 나이별 완전 비교`

### intro (5문단)

1. 국민연금은 언제 받기 시작하느냐에 따라 월 수령액과 생애 누적액이 크게 달라집니다. 1969년생 이후 기준으로 정상 수급개시연령은 65세이며, 5년 앞당겨 60세부터 받으면 월 수령액이 30% 줄고(70% 지급), 반대로 5년 늦춰 70세부터 받으면 36% 증가합니다(136% 지급). 이 차이는 평생 유지되므로 수령 나이 결정은 매우 중요한 재무 판단입니다.

2. 조기수령(60세 시작)의 장점은 은퇴 직후 소득 공백을 줄일 수 있다는 점입니다. 정상수령 월 120만 원이라면 60세 조기수령 시 84만 원, 5년간 받는 누적액이 1차적으로 쌓입니다. 70세까지 기준으로는 조기수령 누적액(1억 80만 원)이 정상수령(7,200만 원)보다 많습니다. 그러나 75~76세를 기점으로 정상수령 누적액이 역전되고, 83~84세 이후에는 연기수령이 가장 유리해집니다.

3. 연기수령(70세 시작)은 월 수령액을 163.2만 원(정상의 136%)으로 높일 수 있습니다. 장수 가능성이 높고 60~70세 동안 생활비를 다른 자산(퇴직연금, 금융자산)으로 충당할 수 있다면 검토할 수 있는 전략입니다. 단, 70세 이전에 사망하거나 건강 문제가 생기면 연기수령은 불리합니다. 또한 연금액이 늘어나면 건강보험 피부양자 자격에 영향을 줄 수 있으므로 함께 검토해야 합니다.

4. 국민연금만으로 노후 생활비를 충당하기는 어렵습니다. 국민연금(1층), 퇴직연금/IRP(2층), 개인연금(3층)을 조합해 수령 시기를 설계해야 합니다. 국민연금 전까지 60~65세 소득 공백은 퇴직연금 분할 수령이나 금융자산으로 대응하고, 국민연금 수령 이후에는 퇴직연금·개인연금을 보조 수입으로 활용하는 3층 구조가 현실적입니다.

5. 2026년부터 국민연금 소득대체율이 43%로 상향되고, 보험료율은 2026년부터 매년 0.5%p씩 인상되어 2033년부터 13%가 될 예정입니다. 이 변화는 향후 가입기간에 적용되며, 이미 수령 중인 수급자에게 직접 적용되는 것은 아닙니다. 연금 수령 최적 나이는 한 가지 정답이 없으므로, 계산기로 본인의 건강수명과 생활비 조건을 직접 입력해 비교해 보세요.

### FAQ (8개)

```ts
export const PAC_FAQ = [
  {
    question: "국민연금은 60세에 받을 수 있나요?",
    answer: "출생연도와 조기노령연금 조건에 따라 가능합니다. 1969년생 이후는 정상 노령연금 65세, 조기노령연금 60세부터 가능합니다. 단, 가입기간 10년 이상, 소득 있는 업무에 종사하지 않는 조건을 충족해야 합니다. 정확한 신청 가능 여부는 국민연금공단(1355)에 문의하거나 내연금.kr에서 확인하세요.",
  },
  {
    question: "조기수령 시 얼마나 깎이나요?",
    answer: "정상수령보다 1년 일찍 받을 때마다 6%씩 감액됩니다. 5년 일찍 60세부터 받으면 정상 수령액의 70%만 받게 됩니다. 이 감액은 평생 유지되므로, 정상수령 월 120만 원이라면 조기수령 시 평생 84만 원을 받는 구조입니다.",
  },
  {
    question: "연기수령하면 얼마나 늘어나나요?",
    answer: "1년 늦출 때마다 7.2%(월 0.6%)씩 증액됩니다. 5년 연기해 70세부터 받으면 정상수령액의 136%를 평생 받을 수 있습니다. 정상수령 월 120만 원이라면 연기수령 시 163.2만 원이 됩니다.",
  },
  {
    question: "조기수령과 정상수령, 누적액 기준 손익분기점은 몇 살인가요?",
    answer: "정상수령 월 120만 원, 60세 조기수령 84만 원을 기준으로 계산하면 약 76~77세가 손익분기점입니다. 이 나이까지 생존하면 정상수령 누적액이 조기수령 누적액을 추월합니다. 건강수명을 75세로 예상한다면 조기수령이, 80세 이상으로 예상한다면 정상수령이 유리합니다.",
  },
  {
    question: "연기수령 시 건강보험료가 올라가나요?",
    answer: "연금 수령액이 늘어나면 건강보험 피부양자 자격 기준에 영향을 줄 수 있습니다. 지역가입자로 전환되거나 피부양자 자격을 잃는 경우 건보료 부담이 추가될 수 있습니다. 연기수령으로 증가하는 연금액과 추가 건보료를 함께 계산해 실질적인 수령액을 비교해야 합니다.",
  },
  {
    question: "2026년 국민연금 제도 변경이 수령액에 영향을 주나요?",
    answer: "2026년부터 소득대체율이 43%로 상향되고 보험료율이 인상됩니다. 다만 이는 2026년 이후 가입기간에 적용되므로, 이미 연금을 받고 있거나 가입기간이 완료된 경우 직접적인 수령액 변화는 없습니다. 아직 보험료를 납부 중인 경우 향후 예상 연금액이 소폭 높아질 수 있습니다.",
  },
  {
    question: "국민연금 연기는 전체가 아니라 일부만 할 수 있나요?",
    answer: "네. 국민연금액의 50%, 60%, 70%, 80%, 90% 중 하나를 선택해 일부 연기가 가능합니다. 나머지 금액은 정상 수급개시연령부터 받고, 연기한 비율만큼 연 7.2%가 가산됩니다. 소득 공백을 일부 보완하면서 연금액도 높이고 싶다면 일부 연기 전략이 유용할 수 있습니다.",
  },
  {
    question: "연금 수령 최적 나이를 어떻게 판단하면 되나요?",
    answer: "정답은 없습니다. ① 건강수명(몇 세까지 건강하게 살 것인가) ② 60~70세 소득 공백을 다른 자산으로 충당할 수 있는가 ③ 배우자 연금과 합산한 가계 현금흐름 ④ 건강보험료·세금 영향 ⑤ 퇴직연금·개인연금 수령 시기 조합까지 함께 고려해야 합니다. 연금 수령 최적 나이 계산기로 본인 조건을 입력해 시나리오를 비교해 보세요.",
  },
];
```

---

## 10. 관련 링크

- `/tools/pension-optimal-age/` — 연금 수령 최적 나이 계산기
- `/reports/worker-retirement-reality-2026/` — 직장인 노후 준비 실태 리포트
- `/tools/retirement-fund-depletion/` — 노후자금 고갈 시점 계산기
- `/tools/irp-pension-calculator/` — IRP 연금 계산기
- `/tools/fire-calculator/` — FIRE 조기 은퇴 계산기

---

## 11. QA 체크리스트

- [ ] 수령 나이별 지급률 표 수치 정확 (70~136% 범위)
- [ ] 누적 수령액 예시 표 계산 정확 (예: 60세 84만 원 × 12 × 25년 = 2억 5,200만 원)
- [ ] 손익분기점 해석 문구가 투자 조언처럼 오해되지 않도록 표현
- [ ] 실제 수령액은 국민연금공단 확인 필요 면책 문구 표시
- [ ] 모바일에서 비교 표 가로 스크롤 정상 동작
- [ ] CTA → 연금 수령 최적 나이 계산기 링크 정확 연결
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
