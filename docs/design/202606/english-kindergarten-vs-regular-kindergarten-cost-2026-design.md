# 2026 영어유치원 vs 일반유치원 비용·효과 완전 비교 — 설계 문서

> 작성일: 2026-06-27
> 콘텐츠 유형: `/reports/` 비교 리포트
> 구현 기준: 영어유치원(프리미엄·일반) 2등급 × 일반유치원(국공립·민간) 2등급 × 영어 대안 3종 → 월 비용·3년 누적 비용·지역별 비교·효과성 균형 서술

---

## 1. 문서 개요

- 구현 대상: `2026 영어유치원 vs 일반유치원 비용·효과 완전 비교`
- slug: `english-kindergarten-vs-regular-kindergarten-cost-2026`
- URL: `/reports/english-kindergarten-vs-regular-kindergarten-cost-2026/`
- 카테고리: 육아·사교육
- 핵심 검색 의도: "영어유치원 일반유치원 비교", "영어유치원 비용 2026", "영어유치원 효과", "영어유치원 대신", "누리과정 지원금"
- 핵심 CTA: `/tools/child-tutoring-cost-calculator/`, `/tools/daycare-vs-babysitter-cost-2026/`
- 수익화: 화상영어·전화영어 제휴 링크 (섹션 ⑧), 디스플레이 광고
- 참고 패턴: `baby-formula-brand-cost-comparison-2026`·`baby-food-cost-comparison-2026`의 데이터/컴포넌트 구조 재사용 (가격 비교표 + 누적 비용 시뮬레이션 + 대안 비교). 단, 브랜드명을 직접 노출하지 않고 **등급·지역으로 익명화**한다는 점이 다름.

---

## 2. 구현 파일 구조

```text
src/
  data/
    englishKindergartenVsRegularCost2026.ts   ← 등급별 데이터, 지역별 데이터, 대안 데이터, FAQ, 관련 링크
  pages/
    reports/
      english-kindergarten-vs-regular-kindergarten-cost-2026.astro

src/styles/scss/pages/
  _english-kindergarten-vs-regular-kindergarten-cost-2026.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/english-kindergarten-vs-regular-kindergarten-cost-2026';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지. `report-page op-page ekc-page` 클래스.
- 인터랙션: 없음 (정적 렌더링). 비용 비교·누적 비용·지역별·대안 비교 차트 4개에 Chart.js 사용.
- SCSS prefix: `ekc-` (English Kindergarten Comparison)
- 민감 정보 처리: 특정 학원·유치원 브랜드명을 노출하지 않는다. "프리미엄형 영어유치원(강남·서초권 기준)" 같이 등급+지역 표현만 사용. 모든 가격에 `추정` 또는 `확인 필요` 배지 필수.

---

## 4. 데이터 모델

```ts
// src/data/englishKindergartenVsRegularCost2026.ts

export type InstitutionType = "english_premium" | "english_standard" | "private_kinder" | "public_kinder";
export type SubsidyEligible = "none" | "partial" | "full";

export interface InstitutionOption {
  id: string;
  label: string;                      // "영어유치원(프리미엄형)" 등 익명화된 등급명
  type: InstitutionType;
  monthlyListFee: number;              // 월 정가 학비 (원, 추정)
  subsidyEligible: SubsidyEligible;    // 정부 지원금 대상 여부
  monthlySubsidy: number;              // 월 지원금 (원, 추정). 미대상은 0
  monthlyNetFee: number;               // 지원금 반영 순부담액 (원, 추정)
  extraMonthlyCost: number;            // 셔틀·특별활동·재료비 등 부가 비용 평균 (원, 추정)
  pros: string[];
  cons: string[];
  bestFor: string;
  note: string;
}

export interface RegionalFeeRow {
  region: string;                      // "강남·서초", "목동", "분당", "지방 거점도시" 등
  englishKinderAvg: number;            // 영어유치원 평균 월 학비 (원, 추정)
  regularKinderAvg: number;            // 일반유치원(민간) 평균 월 학비 (원, 추정)
}

export interface AlternativeOption {
  id: string;
  label: string;                       // "화상영어", "전화영어", "영어책 육아" 등
  monthlyCost: number;                 // 월 비용 (원, 추정)
  description: string;
  affiliateUrl: string;
}

export interface CumulativeCostRow {
  option: string;
  monthlyNetFee: number;
  threeYearTotal: number;              // 만 3~5세 3년 기준 누적 (원, 추정)
  isLowest?: boolean;
  isHighest?: boolean;
}

export interface EffectivenessView {
  stance: "positive" | "cautious";
  title: string;
  body: string;
}

export interface EkcFaq {
  question: string;
  answer: string;
}

export interface EkcLink {
  href: string;
  label: string;
}

export interface EkcCtaCard {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

export interface MistakeItem {
  title: string;
  body: string;
}

export interface SupportProgramRow {
  name: string;                        // "교육비 세액공제", "양육수당" 등
  target: string;
  amount: string;
  note: string;
}
```

---

## 5. 등급별 데이터 상세 (4개 + 대안 3개)

### ① 영어유치원 (프리미엄형)

- 대상 지역(예시): 강남·서초권 등 프리미엄 수요가 높은 지역
- 월 정가: 약 220만 원 (추정)
- 지원금 대상: 없음 (학원으로 분류되는 경우 다수)
- 월 부가 비용: 약 15만 원 (셔틀·특별활동·재료비, 추정)
- 강점: 원어민 교사 비율 높음, 영어 노출 시간 多, 다양한 특별활동
- 약점: 비용 부담 매우 큼, 지원금 대상 아닌 경우 多, 초등 진학 후 적응 이슈 일부 제기
- 추천 대상: 영어 노출을 최우선으로 두고 비용 부담을 감당할 수 있는 가정

### ② 영어유치원 (일반형)

- 대상 지역(예시): 수도권 외곽·지방 거점도시 등
- 월 정가: 약 120만 원 (추정)
- 지원금 대상: 없음 (일부 정식 인가 기관만 부분 대상)
- 월 부가 비용: 약 10만 원 (추정)
- 강점: 프리미엄형보다 부담이 적음, 원어민+한국인 혼합 교사
- 약점: 프리미엄형 대비 영어 노출 시간·교사 비율 낮음
- 추천 대상: 영어 노출은 원하지만 프리미엄형 비용은 부담스러운 가정

### ③ 민간유치원 (일반)

- 월 정가: 약 45만 원 (추정)
- 지원금 대상: 부분 (누리과정·유아학비 지원금 적용)
- 월 지원금: 약 30만 원 (추정)
- 월 순부담액: 약 15만 원 (추정)
- 월 부가 비용: 약 5만 원 (추정)
- 강점: 지원금 적용으로 실질 부담 낮음, 접근성 높음
- 약점: 기관별 프로그램 편차 큼
- 추천 대상: 비용 부담을 최소화하면서 일반적인 유아 교육을 원하는 가정

### ④ 국공립유치원

- 월 정가: 약 10만 원 (추정)
- 지원금 대상: 전체 (대부분 무상 또는 소액 부담)
- 월 지원금: 약 8만~10만 원 (추정)
- 월 순부담액: 약 0~5만 원 (추정)
- 월 부가 비용: 약 3만 원 (추정)
- 강점: 비용 부담 최소, 시설·안전 기준 높음
- 약점: 대기 인원 多, 추첨 경쟁률 높은 지역 존재
- 추천 대상: 비용보다 안정성·접근성을 우선하는 가정 (단, 대기 가능성 고려 필요)

### 대안 ① 화상영어

- 월 비용: 약 15만 원 (추정)
- 설명: 주 2~3회 화상 수업, 일반유치원과 병행 가능

### 대안 ② 전화영어

- 월 비용: 약 12만 원 (추정)
- 설명: 매일 짧은 시간 전화 수업, 시간 유연성 높음

### 대안 ③ 영어책 육아 + 영어 도서관

- 월 비용: 약 5만 원 (추정, 도서 구독·대여비 기준)
- 설명: 가정 내 영어 노출 환경 조성, 추가 인력 비용 없음

---

## 6. 3년 누적 비용 시뮬레이션 데이터

만 3~5세(3년) 기준 월 순부담액 + 부가 비용 누적:

| 옵션 | 월 순부담액(추정) | 3년 누적(추정) |
|-----|----------------|---------------|
| 영어유치원(프리미엄형) | 약 235만 원 | 약 8,460만 원 |
| 영어유치원(일반형) | 약 130만 원 | 약 4,680만 원 |
| 민간유치원 | 약 20만 원 | 약 720만 원 |
| 국공립유치원 | 약 5만 원 | 약 180만 원 |

> 모든 수치는 추정값이며 실제 학비·지원금과 다를 수 있습니다.
> 영어유치원(프리미엄형)과 국공립유치원의 3년 차이: 약 8,280만 원.

---

## 7. 지역별 평균 학비 데이터

```ts
export const REGIONAL_FEE_ROWS: RegionalFeeRow[] = [
  { region: "강남·서초", englishKinderAvg: 2300000, regularKinderAvg: 550000 },
  { region: "목동", englishKinderAvg: 1900000, regularKinderAvg: 480000 },
  { region: "분당·판교", englishKinderAvg: 1850000, regularKinderAvg: 470000 },
  { region: "수도권 외곽", englishKinderAvg: 1300000, regularKinderAvg: 420000 },
  { region: "지방 거점도시", englishKinderAvg: 1100000, regularKinderAvg: 380000 },
];
```

- 데이터 출처: 맘카페·학원 공개 정보 종합 (추정값), 본문에 "확인 필요" 배지 별도 표기

---

## 8. 효과성 균형 서술 데이터

```ts
export const EFFECTIVENESS_VIEWS: EffectivenessView[] = [
  {
    stance: "positive",
    title: "조기 영어 노출의 긍정적 효과",
    body: "유아기 집중적인 영어 노출이 듣기·발음 습득에 유리하다는 연구가 있습니다. 원어민 교사와의 상호작용이 자연스러운 언어 습득에 도움이 될 수 있습니다.",
  },
  {
    stance: "cautious",
    title: "장기 효과에 대한 신중한 시각",
    body: "조기 영어 교육이 장기적인 영어 실력 격차로 이어지는지는 학계에서도 견해가 갈립니다. 가정에서의 지속적인 영어 노출 여부가 기관 선택보다 더 중요한 변수라는 의견도 많습니다.",
  },
];
```

---

## 9. 흔한 실수·지원 제도 데이터

```ts
export const COMMON_MISTAKES: MistakeItem[] = [
  { title: "효과 검증 없이 등록", body: "주변 권유나 분위기에 따라 등록하기보다, 아이의 성향과 가정의 영어 노출 환경을 먼저 점검하는 것이 좋습니다." },
  { title: "형제 비교로 인한 스트레스", body: "형제·자매를 같은 기준으로 비교하면 아이에게 부담이 될 수 있습니다. 개별 성향에 맞춘 선택이 중요합니다." },
  { title: "갑작스러운 전환 시 적응 문제", body: "영어유치원에서 일반 초등학교로 전환 시 학습 방식·교우 관계 적응에 시간이 필요할 수 있습니다." },
];

export const SUPPORT_PROGRAMS: SupportProgramRow[] = [
  { name: "누리과정 지원금", target: "국공립·민간유치원 재원 만 3~5세", amount: "월 약 28만~35만 원 (추정)", note: "영어유치원(학원 분류)은 대상 아닌 경우 다수" },
  { name: "유아학비 지원", target: "어린이집·유치원 재원 아동", amount: "기관 유형별 차등", note: "정식 인가 기관 기준" },
  { name: "교육비 세액공제", target: "취학 전 아동 학원비 일부", amount: "연 300만 원 한도 내 15%", note: "영어유치원도 학원비로 공제 가능한 경우 있음, 확인 필요" },
];
```

---

## 10. 페이지 IA

1. **Hero** — 제목: "영어유치원 일반유치원 비교 2026", 부제: "프리미엄형 영어유치원부터 국공립유치원까지, 월 학비와 3년 누적 비용·효과성 논란을 한 페이지에서 비교합니다"
2. **InfoNotice** — "이 리포트의 학비 정보는 2026년 6월 기준 추정값이며 특정 브랜드명을 명시하지 않습니다. 실제 학비는 기관·지역·시기에 따라 다를 수 있으므로 등록 전 반드시 해당 기관에 확인하세요."
3. **TrustPanel** — 기준일: 2026-06, 참고 출처 표기
4. **핵심 요약 카드 (4개)**
5. **섹션 ① 영어유치원, 왜 이렇게 비싼데도 보내는가**
6. **섹션 ② 월 비용 비교표** ← 핵심
7. **섹션 ③ 정부 지원금 반영 기준**
8. **섹션 ④ 부가 비용까지 포함한 실질 비용**
9. **섹션 ⑤ 3년 누적 비용 시뮬레이션 막대 차트**
10. **섹션 ⑥ 지역별 학비 수준 비교 차트**
11. **섹션 ⑦ 효과성 균형 서술 (찬/신중 2단 구성)**
12. **섹션 ⑧ 대안 비교 + 제휴 링크**
13. **섹션 ⑨ 흔한 실수**
14. **섹션 ⑩ 일반유치원에서 영어 노출 늘리는 법**
15. **섹션 ⑪ 학부모 실제 후기 요약**
16. **섹션 ⑫ 사교육비 절세·지원 제도 안내**
17. **섹션 ⑬ 관련 계산기·콘텐츠 안내 CTA**
18. **SeoContent** — intro 5문단, FAQ 5개, 관련 링크 4개

---

## 11. 핵심 요약 카드 (4개)

| 카드 제목 | 내용 |
|----------|------|
| 영어유치원 vs 국공립 차이 | 월 최대 약 230만 원, 3년 약 8,280만 원 차이 (추정) |
| 지원금 핵심 | 영어유치원은 대부분 누리과정 지원금 대상 아님 |
| 효과성 | 단기 노출 효과는 있으나 장기 격차는 학계 견해 분분 |
| 대안 팁 | 화상영어(월 15만 원)+일반유치원 조합 시 영어유치원 대비 대폭 절감 |

---

## 12. 월 비용 비교표 설계 (섹션 ②)

```html
<div class="ekc-table-wrap">
  <table class="ekc-compare-table">
    <thead>
      <tr>
        <th>유형</th>
        <th>월 정가</th>
        <th>지원금</th>
        <th>순부담액</th>
        <th>부가 비용</th>
        <th>실질 월 비용</th>
      </tr>
    </thead>
    <tbody>
      <!-- 4개 옵션 행 반복 -->
      <!-- 순부담액 최저 셀: class="ekc-lowest" (그린 하이라이트) -->
      <!-- 실질 월 비용 최고 셀: class="ekc-highest" (레드 하이라이트) -->
    </tbody>
  </table>
</div>
```

- `추정` 배지를 가격 헤더 옆에 표시
- "지원금 없음" 셀은 `ekc-empty` 클래스로 옅게 표시

---

## 13. 3년 누적 비용 차트 (섹션 ⑤)

- Chart.js Horizontal Bar 차트
- 4개 옵션 × 3년 누적 비용
- 국공립유치원 기준 바(Bar) 강조 (초록), 영어유치원(프리미엄형) 강조 (레드)
- 우측 끝에 금액 레이블 표시

---

## 14. 지역별 학비 비교 차트 (섹션 ⑥)

- Chart.js Grouped Bar 차트
- X축: 5개 지역
- Y축: 월 평균 학비 (원)
- 영어유치원(주황)·일반유치원(초록) 2개 시리즈 동시 표시

---

## 15. 대안 비교 영역 (섹션 ⑧)

```html
<div class="ekc-alt-grid">
  <!-- 대안 3개 카드 -->
  <!-- 각 카드: 이름, 월 비용, 설명, "체험 신청" 제휴 버튼 -->
</div>
```

- "일반유치원(민간) + 화상영어" 조합 월 비용 = 민간유치원 순부담액 + 화상영어 비용으로 계산해 강조 카드 추가

---

## 16. 스타일 설계

```scss
.ekc-page {

  .ekc-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }

  .ekc-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-top: 16px;
  }

  .ekc-compare-table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
      font-size: 0.86rem;
      white-space: nowrap;
    }
    th:first-child, td:first-child { text-align: left; }
    th { background: #f8fcfa; font-weight: 700; }

    td.ekc-lowest { color: #0f6e56; font-weight: 700; }
    td.ekc-highest { color: #b91c1c; font-weight: 700; }
  }

  .ekc-chart-wrap {
    position: relative;
    height: 280px;
    margin-top: 16px;
    @media (min-width: 760px) { height: 360px; }
  }

  .ekc-bar-chart-wrap {
    position: relative;
    height: 320px;
    margin-top: 16px;
    @media (min-width: 760px) { height: 400px; }
  }

  .ekc-effectiveness-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 760px) { grid-template-columns: repeat(2, 1fr); }

    .ekc-effectiveness-card {
      border-radius: 12px;
      padding: 18px;
      &--positive { background: #edf7f2; border: 1px solid #bde3cf; }
      &--cautious { background: #fff8ed; border: 1px solid #f1d4a9; }
    }
  }

  .ekc-alt-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }

    .ekc-alt-card {
      border: 1px solid #e8ede9;
      border-radius: 12px;
      padding: 16px;

      .ekc-alt-price { font-size: 1.2rem; font-weight: 800; color: #0f6e56; }
      .ekc-alt-link {
        display: inline-block;
        margin-top: 10px;
        padding: 5px 14px;
        background: #ff6000;
        color: #fff;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        text-decoration: none;
      }
    }
  }

  .ekc-mistake-list,
  .ekc-support-table {
    margin-top: 14px;
  }

  .ekc-caution-list {
    background: #fff8f0;
    border: 1px solid #fde8c8;
    border-radius: 12px;
    padding: 20px 24px;
    ol { margin: 0; padding-left: 1.4em; line-height: 2; }
    li { font-size: 0.9rem; color: #374151; }
  }
}
```

---

## 17. SEO 설계

```text
title: 영어유치원 일반유치원 비교 2026 | 월 학비 최대 200만 차이
description: 영어유치원과 일반유치원의 월 학비, 정부 지원금 반영 순부담액, 3년 누적 비용을 비교했습니다. 영어유치원 효과 논란과 대안까지 한 페이지에서 확인하세요.
H1: 2026 영어유치원 vs 일반유치원 비용·효과 완전 비교
```

JSON-LD: `Article` + `FAQPage`

키워드: 영어유치원 일반유치원 비교, 영어유치원 비용 2026, 영어유치원 효과, 영어유치원 vs 어린이집, 영어유치원 대신, 누리과정 지원금

---

## 18. SeoContent 초안

### introTitle
`2026 영어유치원 vs 일반유치원 비용·효과 완전 비교 — 월 200만 원 차이, 정말 그만한 가치가 있을까`

### intro (5문단)

1. 영어유치원은 일반유치원보다 월 평균 80만 원에서 많게는 200만 원 이상 더 비쌉니다. 자녀의 영어 노출을 위해 지출을 감당할 가치가 있는지 고민하는 부모가 많지만, 막상 비교할 수 있는 구체적인 데이터는 찾기 어렵습니다. 이 리포트는 프리미엄형·일반형 영어유치원과 국공립·민간유치원의 월 학비, 정부 지원금 반영 순부담액, 3년 누적 비용을 한 페이지에서 비교합니다. (추정)

2. 가장 중요한 차이는 정부 지원금입니다. 대부분의 영어유치원은 정식 유치원이 아닌 학원으로 분류되어 누리과정·유아학비 지원금 대상이 아닙니다. 반면 국공립·민간유치원은 지원금을 적용하면 월 순부담액이 크게 낮아집니다. 이 차이를 감안하지 않고 정가만 비교하면 실제 격차를 과소평가하거나 과대평가하기 쉽습니다.

3. 영어유치원의 효과에 대해서는 학계에서도 견해가 갈립니다. 조기 영어 노출이 듣기·발음 습득에 유리하다는 연구가 있지만, 장기적인 영어 실력 격차로 이어지는지는 가정 내 지속적인 영어 노출 여부가 더 중요한 변수라는 의견도 많습니다. 이 리포트는 양쪽 시각을 균형 있게 제시합니다.

4. 비용 부담이 크다면 화상영어·전화영어·영어책 육아 같은 대안을 일반유치원과 병행하는 방법도 있습니다. 일반유치원(민간) 순부담액에 화상영어(월 15만 원 수준)를 더해도 영어유치원 대비 상당한 비용을 절감할 수 있습니다. (추정)

5. 이 리포트의 모든 학비 정보는 2026년 6월 기준 추정값이며, 특정 브랜드명을 명시하지 않고 등급·지역 기준으로 구성했습니다. 실제 학비는 기관·지역·시기에 따라 크게 달라질 수 있으므로 등록 전 반드시 해당 기관에 직접 확인하세요. 어떤 선택이 "정답"인지는 절대적인 기준이 없으며, 가정의 예산과 아이의 성향을 함께 고려하는 것이 중요합니다.

### FAQ (5개) — 기획 문서 FAQ 그대로 사용

```ts
export const EKC_FAQ: EkcFaq[] = [
  {
    question: "영어유치원은 정부 지원금을 받을 수 있나요?",
    answer: "대부분의 영어유치원은 유치원이 아닌 영어학원으로 분류되어 누리과정·유아학비 지원금 대상이 아닙니다. 일부 영어유치원 형태의 유치원(정식 인가)만 지원금 대상이 될 수 있으므로 등록 전 기관 분류를 확인해야 합니다.",
  },
  {
    question: "영어유치원 효과는 실제로 있나요?",
    answer: "조기 영어 노출이 듣기·발음에 긍정적 영향을 줄 수 있다는 연구가 있지만, 장기적인 영어 실력 격차로 이어지는지는 학계에서도 견해가 갈립니다. 가정에서의 지속적인 영어 노출 여부가 더 중요한 변수라는 의견도 많습니다.",
  },
  {
    question: "영어유치원을 다니다 일반 초등학교로 가면 적응이 어렵나요?",
    answer: "영어유치원 졸업 후 일반 초등학교 진학 시 학습 방식·교우 관계 적응에 시간이 필요할 수 있습니다. 다만 대부분의 아이들은 1학기 내 적응하는 경우가 많습니다.",
  },
  {
    question: "영어유치원 대신 비용을 아끼면서 영어 노출을 늘리는 방법이 있나요?",
    answer: "화상영어·전화영어(월 10~20만 원), 영어 도서관·영어책 육아, 방과후 영어 프로그램 등을 활용하면 일반유치원 비용에 월 10~30만 원을 추가하는 수준으로 영어 노출을 늘릴 수 있습니다.",
  },
  {
    question: "지역에 따라 영어유치원 학비가 그렇게 차이가 나나요?",
    answer: "강남·서초 등 일부 지역은 프리미엄 영어유치원이 많아 월 200만 원을 넘는 경우가 있고, 수도권 외 지역은 월 90만~120만 원대가 일반적입니다. 같은 브랜드라도 지역에 따라 학비 차이가 클 수 있습니다.",
  },
];
```

---

## 19. 관련 링크

- `/tools/daycare-vs-babysitter-cost-2026/` — 어린이집 vs 가정보육 비용 비교 계산기
- `/reports/baby-food-cost-comparison-2026/` — 이유식 비교 리포트
- `/reports/baby-cost-guide-first-year/` — 첫해 육아비용 총정리 리포트
- `/tools/child-tutoring-cost-calculator/` — 자녀 사교육비 계산기

---

## 20. 등록 작업

```ts
// src/data/reports.ts 추가
{
  slug: 'english-kindergarten-vs-regular-kindergarten-cost-2026',
  title: '영어유치원 일반유치원 비교 2026 | 월 학비 최대 200만 차이',
  description: '영어유치원과 일반유치원의 월 학비, 정부 지원금 반영 순부담액, 3년 누적 비용을 비교했습니다. 영어유치원 효과 논란과 대안까지 한 페이지에서 확인하세요.',
  category: 'parenting',
  order: ...,
}
```

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/reports/english-kindergarten-vs-regular-kindergarten-cost-2026/</loc>
</url>
```

---

## 21. QA 체크리스트

- [ ] 모든 가격 데이터에 `추정` 또는 `확인 필요` 레이블 표기
- [ ] 특정 브랜드·학원명 노출 없음 (등급·지역 표현만 사용)
- [ ] 가격 비교표 가로 스크롤 정상 동작 (모바일 360px)
- [ ] 순부담액 최저/실질 비용 최고 셀 하이라이트 표시
- [ ] Chart.js 누적 비용·지역별 차트 정상 렌더링 및 범례 표시
- [ ] 핵심 요약 카드 4개 수치 계산 정확 (영어유치원 vs 국공립 차이)
- [ ] 효과성 섹션 — 찬성/신중 두 시각이 분량·어조에서 균형 유지
- [ ] 대안 비교 카드 제휴 링크 자리 표시 (URL 공란 → 실제 등록 시 채움), `rel="noopener sponsored"` 포함
- [ ] FAQ 5개 `<details>` 접기/펼치기 정상
- [ ] 특정 선택(영어유치원 또는 일반유치원) 과장 추천 없이 상황별 분기로 표현
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
