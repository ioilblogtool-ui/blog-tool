# 출산지원금 총수령액 계산기 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/birth-support-money.md`  
> 작성일: 2026-05-05  
> 구현 기준: 이 문서만 보고 `/tools/` 계산기 구현 또는 기존 `birth-support-total` 확장 판단 가능

---

## 1. 문서 개요

- 구현 대상: `출산지원금 총수령액 계산기`
- 기획 slug: `birth-support-money`
- 기획 URL: `/tools/birth-support-money/`
- 현재 유사 구현: `/tools/birth-support-total/`
- 콘텐츠 유형: 계산기
- 핵심 검색 의도: "우리 지역에서 아이 낳으면 총 얼마 받나?"
- 핵심 CTA: 지역별 출산지원금 리포트, 산후도우미 비용 계산기, 육아휴직 급여 계산기

---

## 2. 기존 페이지와의 관계

현재 저장소에는 `birth-support-total` 계산기가 이미 있다.

| 항목 | 기존 `birth-support-total` | 신규/확장 `birth-support-money` |
|---|---|---|
| URL | `/tools/birth-support-total/` | `/tools/birth-support-money/` |
| 포함 항목 | 첫만남이용권, 부모급여, 아동수당 | 국가 공통 + 지자체 + 다태아 + 지역별 신청 안내 |
| 입력 | 출생일, 자녀 순번, 계산 구간 | 출생일, 지역, 출생순위, 다태아, 어린이집, 계산 기간 |
| 출력 | 18/24개월 총액, 월별 흐름 | 총수령액, 첫 달 수령액, 12/24/95개월 누적, 신청 체크리스트 |
| 추천 방향 | 유지 가능 | 기존 페이지 확장 또는 신규 고급 계산기로 분리 |

구현 판단:

- 단기 MVP: 기존 `birth-support-total`을 확장하는 편이 내부 링크 유지에 유리하다.
- SEO 신규 타깃: `/tools/birth-support-money/`를 새로 만들고 기존 페이지에서 리다이렉트/상호 링크를 검토한다.
- 이 설계 문서는 신규 slug 기준으로 쓰되, 코드 재사용 시 `birth-support-total`의 월별 타임라인 로직을 가져온다.

---

## 3. 페이지 목표

- 출생일과 거주 지역만 입력해도 국가 공통 지원금과 지역별 지원금을 합산한다.
- 첫째/둘째/셋째 이상, 다태아 여부에 따른 차이를 보여준다.
- 0~24개월 현금흐름과 장기 아동수당 기간을 분리해 표시한다.
- `공식`, `확인 필요`, `시뮬레이션` 배지를 통해 정책 데이터의 신뢰도를 구분한다.
- 신청처, 신청시점, 준비서류 체크리스트를 계산 결과와 함께 제공한다.

---

## 4. 권장 파일 구조

```text
src/
  data/
    birthSupportMoney.ts
  pages/
    tools/
      birth-support-money.astro

public/
  scripts/
    birth-support-money.js
  og/
    tools/
      birth-support-money.png

src/styles/scss/pages/
  _birth-support-money.scss
```

추가 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

기존 페이지 확장으로 결정할 경우:

- `src/pages/tools/birth-support-total.astro`
- `public/scripts/birth-support-total.js`
- `src/styles/scss/pages/_timeline-tools.scss` 또는 신규 partial
- `src/data/tools.ts` 설명/키워드 보강

---

## 5. MVP 범위

### 5-1. 1차 MVP

- 국가 공통 3종 계산
  - 첫만남이용권
  - 부모급여
  - 아동수당
- 출생일 기준 월령 계산
- 첫째 / 둘째 이상 분기
- 단태아 / 쌍둥이 / 세쌍둥이 분기 구조 준비
- 12개월 / 24개월 / 95개월 계산 기간 선택
- 서울·경기 주요 지역 일부 지자체 데이터 구조 반영
- 월별 수령 타임라인
- 신청 체크리스트
- FAQ와 관련 링크

### 5-2. MVP 제외

- 전국 모든 시·군·구 데이터 완성
- 신청 마감일 캘린더 알림
- 정부24/아이사랑 API 자동 연동
- 소득분위별 건강보험료 상세 판정
- 어린이집 이용 시 실제 보육료 바우처 차감 상세 계산

---

## 6. 데이터 설계

### 6-1. 타입 정의

```ts
export type BirthOrder = 1 | 2 | 3;
export type MultipleBirthType = "single" | "twins" | "triplets";
export type ChildcareType = "home" | "daycare";
export type CalculationPeriod = 12 | 24 | 95;
export type PolicyType = "national" | "local";
export type PaymentType = "cash" | "voucher" | "localCurrency";
export type AmountType = "once" | "monthly" | "yearly";
export type DataBadge = "공식" | "확인 필요" | "시뮬레이션" | "참고";

export interface BirthSupportPolicy {
  policyId: string;
  policyName: string;
  policyType: PolicyType;
  paymentType: PaymentType;
  amountType: AmountType;
  baseAmount: number;
  startDate: string;
  endDate?: string;
  sourceUrl: string;
  sourceName: string;
  lastCheckedAt: string;
  badge: DataBadge;
  note?: string;
}

export interface LocalBirthSupportRule {
  regionCode: string;
  sido: string;
  sigungu: string;
  birthOrder: BirthOrder;
  multipleBirthType?: MultipleBirthType;
  amount: number | null;
  paymentType: PaymentType;
  paymentSchedule: string;
  residenceMonthsRequired: number | null;
  applicationDeadlineDays: number | null;
  applicationChannel: string[];
  sourceUrl: string;
  lastCheckedAt: string;
  badge: DataBadge;
  note?: string;
}

export interface BirthSupportInput {
  birthDate: string;
  sido: string;
  sigungu: string;
  birthOrder: BirthOrder;
  multipleBirthType: MultipleBirthType;
  childcareType: ChildcareType;
  calculationMonths: CalculationPeriod;
  isDualIncome?: boolean;
  hasNationalHappyCard?: boolean;
}

export interface BenefitItem {
  name: string;
  type: PolicyType;
  paymentType: PaymentType;
  amount: number;
  month: number;
  badge: DataBadge;
  sourceUrl?: string;
  note?: string;
}

export interface BirthSupportTimelineRow {
  month: number;
  ageLabel: string;
  items: BenefitItem[];
  monthlyTotal: number;
}

export interface BirthSupportResult {
  totalAmount: number;
  firstMonthAmount: number;
  nationalTotal: number;
  localTotal: number;
  oneTimeTotal: number;
  monthlyCashTotal: number;
  applicationItemCount: number;
  timeline: BirthSupportTimelineRow[];
}
```

### 6-2. 권장 export

```ts
export const BSM_META = {
  slug: "birth-support-money",
  title: "출산지원금 총수령액 계산기",
  description: "출생일, 거주 지역, 출생순위를 입력해 2026년 출산지원금 총수령액과 월별 수령 타임라인을 계산합니다.",
  updatedAt: "2026-05",
  caution: "계산 결과는 공식 정책과 지자체 자료를 바탕으로 한 참고용 추정치입니다. 실제 지급 여부는 신청 전 공식 페이지와 주민센터에서 확인해야 합니다.",
};

export const BSM_NATIONAL_POLICIES: BirthSupportPolicy[] = [...];
export const BSM_LOCAL_RULES: LocalBirthSupportRule[] = [...];
export const BSM_REGION_OPTIONS = [...];
export const BSM_FAQ = [...];
export const BSM_RELATED_LINKS = [...];
```

---

## 7. 정책 계산 기준

### 7-1. 첫만남이용권

```js
firstMeetingVoucher =
  birthOrder >= 2 ? 3_000_000 : 2_000_000
```

- 지급월: 0개월
- 지급형태: 바우처
- 배지: `공식`
- 다태아는 아동별 지급 여부를 정책 테이블에서 분리할 수 있게 둔다.

### 7-2. 부모급여

```js
function calculateParentBenefit(month) {
  if (month >= 0 && month <= 11) return 1_000_000;
  if (month >= 12 && month <= 23) return 500_000;
  return 0;
}
```

- 0세: 월 100만 원
- 1세: 월 50만 원
- 어린이집 이용 여부에 따라 현금/바우처 실제 수령 구조는 달라질 수 있으므로 결과 해석에 안내 문구를 표시한다.

### 7-3. 아동수당

```js
function calculateChildAllowance(month, monthlyAmount = 100_000) {
  return month >= 0 ? monthlyAmount : 0;
}
```

- MVP에서는 월 10만 원 기본값
- 2026년 지급 연령 확대 및 비수도권·인구감소지역 추가 지급은 데이터 필드만 준비하고, 확정 데이터 확보 후 반영한다.
- 95개월 계산은 장기 누적 참고용이므로 `시뮬레이션` 배지를 붙인다.

### 7-4. 지자체 지원금

```js
localSupport = findLocalRule({
  regionCode,
  birthOrder,
  multipleBirthType,
});
```

검색 조건:

- `sido`
- `sigungu`
- `birthOrder`
- `multipleBirthType`
- `residenceMonthsRequired`
- `applicationDeadlineDays`

금액이 없거나 미확정이면 0원으로 계산하되 결과 카드에 `지역 지원금 확인 필요` 상태를 표시한다.

---

## 8. 화면 IA

1. Hero
2. InfoNotice: 기준일, 공식 확인 필요, 지자체 변동 가능성
3. 입력 패널
4. 결과 요약 카드
5. 항목별 지원금 분해
6. 월별 수령 타임라인 차트
7. 월별 수령 타임라인 표
8. 서울 vs 경기 vs 지방 비교 안내
9. 신청 체크리스트
10. 공식 확인 링크
11. FAQ
12. 관련 계산기/리포트
13. SeoContent

---

## 9. 입력 UI 설계

| 입력 | id | 타입 | 기본값 |
|---|---|---|---|
| 출생일/출생 예정일 | `bsm-birth-date` | date | 오늘 |
| 시·도 | `bsm-sido` | select | 서울특별시 |
| 시·군·구 | `bsm-sigungu` | select | 강남구 또는 첫 옵션 |
| 출생 순위 | `bsm-birth-order` | radio/select | 첫째 |
| 다태아 여부 | `bsm-multiple-birth` | radio | 단태아 |
| 어린이집 이용 여부 | `bsm-childcare-type` | radio | 가정양육 |
| 계산 기간 | `bsm-calculation-months` | select | 24개월 |
| 국민행복카드 보유 | `bsm-happy-card` | checkbox | false |

액션:

```html
<button id="bsm-calc-btn">총수령액 계산하기</button>
<button id="bsm-reset-btn">초기화</button>
<button id="bsm-copy-link-btn">링크 복사</button>
```

---

## 10. 결과 UI 설계

### 10-1. KPI 카드

| 카드 | id | 설명 |
|---|---|---|
| 총 예상 수령액 | `bsm-r-total` | 선택 기간 합산 |
| 첫 달 예상 수령액 | `bsm-r-first-month` | 0개월 지원금 합산 |
| 12개월 누적 | `bsm-r-12m-total` | 0~11개월 합산 |
| 24개월 누적 | `bsm-r-24m-total` | 0~23개월 합산 |
| 일시금/바우처 합계 | `bsm-r-onetime-total` | 첫만남이용권 + 지자체 일시금 |
| 신청 필요 항목 | `bsm-r-application-count` | 체크리스트 항목 수 |

### 10-2. 항목별 분해

| 항목 | id |
|---|---|
| 첫만남이용권 | `bsm-r-first-voucher` |
| 부모급여 총액 | `bsm-r-parent-benefit` |
| 아동수당 총액 | `bsm-r-child-allowance` |
| 지자체 지원금 | `bsm-r-local-support` |
| 추가 확인 필요 | `bsm-r-unknown-support` |

### 10-3. 월별 타임라인

차트:

- Chart.js stacked bar
- dataset: 첫만남이용권, 부모급여, 아동수당, 지자체 지원금

표 컬럼:

- 월령
- 첫만남이용권
- 부모급여
- 아동수당
- 지자체 지원금
- 월 합계
- 신청/주의사항

---

## 11. JS 설계

파일: `public/scripts/birth-support-money.js`

### 11-1. 함수 목록

| 함수 | 역할 |
|---|---|
| `loadData()` | 정책/지역 데이터 파싱 |
| `readForm()` | 입력값 읽기 |
| `calculateBirthSupportTotal(input)` | 총액 계산 |
| `calculateParentBenefit(month)` | 부모급여 |
| `calculateChildAllowance(month, input)` | 아동수당 |
| `calculateFirstMeetingVoucher(input)` | 첫만남이용권 |
| `findLocalSupportRules(input)` | 지자체 지원금 조회 |
| `buildTimeline(input)` | 월별 타임라인 생성 |
| `renderSummary(result)` | KPI 렌더 |
| `renderBreakdown(result)` | 항목별 분해 렌더 |
| `renderTimelineTable(result)` | 표 렌더 |
| `renderTimelineChart(result)` | 차트 렌더 |
| `renderApplicationChecklist(input, result)` | 신청 체크리스트 렌더 |
| `syncUrlParams()` | URL 상태 저장 |
| `restoreFromUrl()` | URL 상태 복원 |

### 11-2. 계산 함수 예시

```js
function calculateBirthSupportTotal(input) {
  const timeline = [];
  const localRules = findLocalSupportRules(input);

  for (let month = 0; month < input.calculationMonths; month += 1) {
    const items = [];

    const firstVoucher = month === 0 ? calculateFirstMeetingVoucher(input) : 0;
    if (firstVoucher > 0) {
      items.push({
        name: "첫만남이용권",
        type: "national",
        paymentType: "voucher",
        amount: firstVoucher,
        month,
        badge: "공식",
      });
    }

    const parentBenefit = calculateParentBenefit(month);
    if (parentBenefit > 0) {
      items.push({
        name: "부모급여",
        type: "national",
        paymentType: input.childcareType === "daycare" ? "voucher" : "cash",
        amount: parentBenefit,
        month,
        badge: "공식",
        note: input.childcareType === "daycare" ? "어린이집 이용 시 실제 현금 수령액은 달라질 수 있습니다." : undefined,
      });
    }

    const childAllowance = calculateChildAllowance(month, input);
    if (childAllowance > 0) {
      items.push({
        name: "아동수당",
        type: "national",
        paymentType: "cash",
        amount: childAllowance,
        month,
        badge: month < 24 ? "공식" : "시뮬레이션",
      });
    }

    localRules
      .filter((rule) => shouldPayLocalRuleAtMonth(rule, month))
      .forEach((rule) => {
        if (rule.amount && rule.amount > 0) {
          items.push({
            name: `${rule.sigungu} 출산지원금`,
            type: "local",
            paymentType: rule.paymentType,
            amount: rule.amount,
            month,
            badge: rule.badge,
            sourceUrl: rule.sourceUrl,
            note: rule.note,
          });
        }
      });

    timeline.push({
      month,
      ageLabel: `${month}개월`,
      items,
      monthlyTotal: items.reduce((sum, item) => sum + item.amount, 0),
    });
  }

  const totalAmount = timeline.reduce((sum, row) => sum + row.monthlyTotal, 0);
  const nationalTotal = timeline.flatMap((row) => row.items)
    .filter((item) => item.type === "national")
    .reduce((sum, item) => sum + item.amount, 0);
  const localTotal = totalAmount - nationalTotal;

  return {
    totalAmount,
    firstMonthAmount: timeline[0]?.monthlyTotal ?? 0,
    nationalTotal,
    localTotal,
    oneTimeTotal: timeline.flatMap((row) => row.items)
      .filter((item) => item.paymentType === "voucher" || item.month === 0)
      .reduce((sum, item) => sum + item.amount, 0),
    monthlyCashTotal: timeline.flatMap((row) => row.items)
      .filter((item) => item.paymentType === "cash")
      .reduce((sum, item) => sum + item.amount, 0),
    applicationItemCount: buildApplicationChecklist(input, localRules).length,
    timeline,
  };
}
```

---

## 12. 스타일 설계

- SCSS 파일: `_birth-support-money.scss`
- 클래스 prefix: `bsm-`
- 레이아웃: `TimelineToolShell` 권장
- 톤: 공공지원금/육아 재무 계산기, 흰색 + 그린 + 블루 포인트

주요 블록:

```scss
.bsm-input-grid
.bsm-region-selects
.bsm-kpi-grid
.bsm-breakdown-grid
.bsm-badge
.bsm-timeline-chart-wrap
.bsm-checklist
.bsm-official-links
.bsm-local-warning
```

모바일:

- 입력 필드는 1열
- KPI는 2열, 총수령액 카드 전체폭
- 타임라인 표는 `.table-wrap` 가로 스크롤
- 배지는 줄바꿈되어도 금액과 겹치지 않게 `inline-flex`

---

## 13. SEO 설계

```text
title: 출산지원금 총수령액 계산기 2026 | 첫만남이용권·부모급여·아동수당
description: 2026년 출산지원금 계산기입니다. 거주 지역, 출생 순위, 출생일을 입력하면 첫만남이용권, 부모급여, 아동수당, 지자체 출산장려금을 합산해 총수령액과 월별 수령 타임라인을 계산합니다.
canonical: https://bigyocalc.com/tools/birth-support-money/
```

주요 키워드:

- 출산지원금 계산기 2026
- 출산지원금 총수령액
- 첫만남이용권 부모급여 아동수당
- 서울 출산지원금 계산
- 경기도 출산지원금 계산
- 둘째 출산지원금
- 지자체 출산장려금

---

## 14. 구조화 데이터

`WebApplication`:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "출산지원금 총수령액 계산기",
  "url": "https://bigyocalc.com/tools/birth-support-money/",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  }
}
```

FAQ가 노출되면 `FAQPage` JSON-LD도 추가한다.

---

## 15. 등록 작업

### `src/data/tools.ts`

신규 페이지로 만들 경우:

```ts
{
  slug: "birth-support-money",
  title: "출산지원금 총수령액 계산기",
  description: "출생일, 거주 지역, 출생순위를 입력해 첫만남이용권·부모급여·아동수당·지자체 지원금을 합산합니다.",
  category: "birth",
  badges: ["출산지원금", "육아", "지역별"],
  iframeReady: false,
}
```

기존 `birth-support-total`을 확장할 경우:

- title을 `출산지원금 총수령액 계산기`로 변경 검토
- description에 `지역별 지원금` 포함
- 기존 내부 링크가 많으므로 URL 변경 없이 콘텐츠를 강화하는 방식이 안전하다.

### `src/styles/app.scss`

```scss
@use 'scss/pages/birth-support-money';
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/birth-support-money/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 16. 구현 순서

1. 기존 `birth-support-total` 유지/확장 또는 신규 `birth-support-money` 생성 여부 결정
2. `src/data/birthSupportMoney.ts` 작성
3. 계산기 페이지 마크업 작성
4. `public/scripts/birth-support-money.js` 작성
5. SCSS 작성 및 `app.scss` import
6. `src/data/tools.ts` 등록 또는 기존 항목 갱신
7. 사이트맵 등록
8. `npm run build` 확인

---

## 17. QA 체크리스트

### 계산

- [ ] 첫째 24개월 기준 국가 공통 총액이 첫만남이용권 200만 원 + 부모급여 1,800만 원 + 아동수당 240만 원으로 계산된다.
- [ ] 둘째 이상 24개월 기준 첫만남이용권이 300만 원으로 반영된다.
- [ ] 부모급여는 0~11개월 100만 원, 12~23개월 50만 원으로 계산된다.
- [ ] 95개월 계산 시 24개월 이후 값에는 장기 추정/시뮬레이션 안내가 붙는다.
- [ ] 지역 지원금이 미확정인 지역은 0원 처리와 함께 `확인 필요` 문구가 표시된다.

### UI

- [ ] 모바일 320px에서 KPI 금액이 카드 밖으로 넘치지 않는다.
- [ ] 타임라인 차트가 비어 있지 않고 stacked bar로 렌더링된다.
- [ ] Chart.js 로드 실패 시 표만으로도 결과를 읽을 수 있다.
- [ ] 신청 체크리스트가 계산 결과 하단에 노출된다.
- [ ] 공식 확인 링크가 정부24, 복지로, 아이사랑 또는 지자체 페이지로 연결된다.

### 콘텐츠

- [ ] 지원금 결과는 `예상`, `추정`, `확인 필요` 표현을 사용한다.
- [ ] 지자체 지원금은 공식 데이터처럼 단정하지 않는다.
- [ ] 어린이집 이용 시 부모급여 현금 수령 구조가 달라질 수 있음을 안내한다.
- [ ] FAQ 6개 이상이 노출된다.

### 등록

- [ ] `src/data/tools.ts` 등록 또는 기존 항목 갱신
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` 추가
- [ ] `npm run build` 성공

---

## 18. 개발 메모

- 기존 `birth-support-total`의 `calculateTimeline`, Chart.js stacked bar, `TimelineToolShell` 구조를 재사용할 수 있다.
- 지역 데이터는 처음부터 전국 완성을 목표로 하지 말고 서울·경기 주요 지역 + `확인 필요` fallback으로 시작한다.
- 정책 금액은 JS에 직접 흩뿌리지 말고 `src/data/birthSupportMoney.ts`의 정책 테이블에 모은다.
- 향후 `birth-support-by-region-2026` 리포트와 같은 지역 데이터 소스를 공유할 수 있게 `regionCode` 중심으로 설계한다.
- 사용자 facing 텍스트는 한국어로 유지하고, 공식 확인 전 수치는 반드시 배지 또는 안내문을 붙인다.

