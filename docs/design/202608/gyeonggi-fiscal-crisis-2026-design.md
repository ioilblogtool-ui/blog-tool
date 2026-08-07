# 설계 문서
## 경기도 재정 비상 선언 2026 완전 정리 + 역대 지사 재정 비교

> 기획 원본: `docs/plan/202608/gyeonggi-fiscal-crisis-2026.md`
> 콘텐츠 유형: `/reports/` 정보성 리포트 (선거 재산 리포트와 달리 단일 이슈 정리형)
> 구현 대상 URL: `/reports/gyeonggi-fiscal-crisis-2026/`
> 핵심 안전장치: "누구 책임인가"는 결론을 내리지 않는다. 추미애 지사 측 발표와 반론(이준석 등)을 각각 출처와 함께 병기하고, 정치적 배경(전당대회 의혹)은 "제기된 의혹" 수준으로만 짧게 다룬다. 출처마다 다른 수치(예산 41.7조 vs 40.06조, 재정자립도 45.42% vs 55.1%)는 임의로 통일하지 않고 `확인 필요` 배지로 병기한다.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `gyeonggi-fiscal-crisis-2026` |
| 페이지 경로 | `src/pages/reports/gyeonggi-fiscal-crisis-2026.astro` |
| 데이터 파일 | `src/data/gyeonggiFiscalCrisis2026.ts` |
| SCSS | `src/styles/scss/pages/_gyeonggi-fiscal-crisis-2026.scss` |
| SCSS prefix | `.gfc` |
| 스크립트 | 없음 (MVP는 정적 페이지, bar 차트는 Astro 서버 렌더링 시 width% 계산) |
| 레이아웃 | `BaseLayout` 직접 구성 |
| 등록 카테고리 | `politics` |
| 홈 노출 카테고리 라벨 | `정치·선거` |
| 검증 명령어 | `npm run build` |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`추미애 경기도지사의 2026-08-05 재정 비상 선언을 숫자로 정리하고, 이재명·김동연·추미애 3개 임기의 채무·재정자립도 추이와 책임 공방을 양측 주장 그대로 병기하는 리포트`

### 1-2. 사용자가 얻는 것

- "예산 41.7조인데 왜 비상선언?"이라는 직관적 의문에 대한 답 (총예산 vs 가용재원 3.5조 구조 이해)
- 감액추경 7,700억 원, 지방채 한도소진율 99.6% 등 핵심 수치를 표 없이도 빠르게 스캔
- 실제로 부족하다고 발표된 사업(노인장기요양, 급식비 등)을 통해 체감 가능한 영향 파악
- 이재명 → 김동연 → 추미애 시기별 채무·재정자립도 변화를 연속된 흐름으로 확인
- "김동연 책임 vs 이재명 시기부터 시작" 공방을 양측 근거와 함께 보고 스스로 판단

### 1-3. 피해야 할 것

- "경기도가 부도난다"처럼 자극적으로 단정
- 채무·재정자립도 수치를 출처 확인 없이 하나로 통일해서 표시
- 추미애 지사 발표를 팩트로, 반론을 부가 의견처럼 비중을 낮게 다루는 구성 (또는 그 반대)
- 전당대회 정치 공방을 사실로 단정
- "지역개발채권 vs 순수 채무" 논쟁을 한쪽 해석만 제시
- 감액추경으로 특정 사업이 실제 중단된다고 예단

---

## 2. 사실 검증 및 데이터 배지 설계

### 2-1. 배지 타입

```ts
export type EvidenceBadge = "공식" | "확인 필요" | "참고";
```

| 배지 | 의미 | 사용 예 |
|---|---|---|
| 공식 | 경기도 공식 발표(경기도뉴스포털) 원문에서 WebFetch로 직접 대조한 값 | 예산·자체재원·감액추경·지방채 한도·기금 전출액 |
| 확인 필요 | 출처마다 다른 값이 확인됐거나 산정 기준이 불명확한 값 | 41.7조 vs 40.06조 예산, 재정자립도 45.42% vs 55.1%, 2018~2021년 재정자립도 미확보 |
| 참고 | 2차 보도·정치적 주장·편집부 해설 계산값 | 채무 연도별 표(도의원 공개자료 인용 보도), 책임 공방 각 진영 주장, "가용재원 대비 22%" 같은 해설 |

### 2-2. 원문 대조 완료 항목 (2026-08-07 WebFetch 검증)

| 출처 | 확인 방법 | 사용 데이터 |
|---|---|---|
| [경기도뉴스포털](https://gnews.gg.go.kr/news/news_detail.do?number=202608051737578186C052&s_code=C400) | WebFetch 원문 대조 | 3-1, 3-2, 3-3 전체 |
| [주간경향](https://weekly.khan.co.kr/article/202608061202001) | WebFetch 원문 대조 | 3-6 책임 공방 인용 |
| [이투데이](https://www.etoday.co.kr/news/view/2611470) | WebFetch 원문 대조 | 3-4 채무 2020·2025·2026.06 수치, 2021년 변곡점 |
| [KPI뉴스](https://www.kpinews.kr/newsView/1065598433939531) | WebFetch 원문 대조 | 3-4 채무 2019~2024 연도별 전체 |
| 세무사신문(webzine.kacta.or.kr) | WebSearch 결과 인용 | 3-5 재정자립도 2022~2025 |

> ⚠️ 구현 전 재확인 권장: 41.7조 vs 40.06조 예산 수치 차이, 재정자립도 산정 기준(본청 단독 vs 통합, 지방재정365 공식 수치와 재대조), 2018~2021년 재정자립도. 시간상 미확보된 항목은 데이터 필드를 비우지 않고 `확인 필요`로 명시하며, 억지로 추정치를 채우지 않는다.

---

## 3. 데이터 파일 설계

파일: `src/data/gyeonggiFiscalCrisis2026.ts`

### 3-1. 타입 정의

```ts
export type EvidenceBadge = "공식" | "확인 필요" | "참고";
export type GovernorTerm = "이재명" | "권한대행" | "김동연" | "추미애";

export interface GfcMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  updatedAt: string;
  dataNote: string;
  neutralityNote: string;
}

export interface KpiCardItem {
  label: string;
  value: string;
  description: string;
  badge: EvidenceBadge;
}

export interface CauseCard {
  title: string;
  body: string;
}

export interface ShortfallItem {
  label: string;
  amountEokwon: number;
  amountLabel: string;
}

export interface PolicyMeasure {
  order: number;
  title: string;
  body: string;
}

export interface DebtYearPoint {
  year: string;
  debtEokwon: number;
  governor: GovernorTerm;
  note?: string;
}

export interface FiscalIndependenceYearPoint {
  year: string;
  rate: number;
  governor: GovernorTerm;
  badge: EvidenceBadge;
}

export interface ResponsibilityClaim {
  side: string;
  claim: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface SourceLink {
  label: string;
  href: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}
```

### 3-2. 메타

```ts
export const GFC_META: GfcMeta = {
  slug: "gyeonggi-fiscal-crisis-2026",
  title: "경기도 재정위기 2026 완전 정리",
  seoTitle: "경기도 재정위기 2026 완전 정리 | 41조 예산인데 왜 비상선언",
  seoDescription:
    "경기도 예산 41.7조 중 자체재원은 3.5조, 올해 감액추경만 7,700억 원입니다. 지방채·기금 현황과 이재명·김동연·추미애 시기별 채무 비교표까지 정리했습니다.",
  description:
    "추미애 경기도지사의 2026-08-05 재정 비상 선언 수치와, 이재명·김동연·추미애 3개 임기의 채무·재정자립도 추이, 책임 공방을 정리한 리포트입니다.",
  updatedAt: "2026-08-07",
  dataNote:
    "이 페이지의 수치는 경기도 공식 발표(경기도뉴스포털)와 언론 보도를 출처와 함께 정리한 참고 자료입니다. 출처마다 다른 값은 통일하지 않고 병기했습니다.",
  neutralityNote:
    "이 리포트는 특정 정치인·정당을 지지하거나 비판하지 않습니다. 책임 소재에 대한 주장은 각 진영 발표를 출처와 함께 그대로 병기하며, 판단은 독자의 몫입니다.",
};
```

### 3-3. KPI 요약 카드

```ts
export const GFC_KPI_CARDS: KpiCardItem[] = [
  {
    label: "2026년 경기도 전체 예산",
    value: "약 41.7조 원",
    description: "2026-08-05 재정 비상 선언 발표 기준. 2025-12-26 확정 예산(40조 577억 원, 경향신문 보도)과 차이가 있어 함께 확인이 필요합니다.",
    badge: "확인 필요",
  },
  {
    label: "자체재원(재량 지출 가능분)",
    value: "약 3.5조 원",
    description: "전체 예산 중 도가 정책적으로 움직일 수 있는 재원입니다. 41.7조 전체를 마음대로 쓸 수 있는 것이 아닙니다.",
    badge: "공식",
  },
  {
    label: "올해 필요 감액추경",
    value: "약 7,700억 원",
    description: "자체재원 3.5조 대비 약 22% 규모로, 신규 사업 축소·조직 구조조정 논의의 배경입니다.",
    badge: "공식",
  },
  {
    label: "2025년 지방채 발행 한도 소진율",
    value: "99.6%",
    description: "발행 한도 9,460억 원 중 9,430억 원 발행. 경기도는 20년 만에 최고 수준이라고 밝혔습니다.",
    badge: "공식",
  },
];
```

### 3-4. 구조적 원인 카드

```ts
export const GFC_CAUSE_CARDS: CauseCard[] = [
  {
    title: "취득세 수입이 30% 가까이 줄었다",
    body: "경기도 세입은 부동산 거래 관련 취득세 비중이 큽니다. 취득세는 2022년 약 11조 원에서 2026년 전망 약 8조 원으로 줄었습니다.",
  },
  {
    title: "3기 신도시 취득세도 기대보다 적다",
    body: "당초 약 6,500억 원을 기대했지만 공공임대 확대 등의 영향으로 현재 전망은 약 2,300억 원 수준입니다. 반면 교통망·소방 등 기반시설 지출은 계속 들어갑니다.",
  },
  {
    title: "복지·매칭사업 같은 고정비는 줄지 않는다",
    body: "노인장기요양, 급식비 지원처럼 매년 반복되는 필수사업은 세입이 줄어도 축소하기 어렵습니다. 그 결과 2026년 예산에서 일부 사업이 12개월치가 아닌 9개월치만 편성됐다는 것이 경기도의 설명입니다.",
  },
];
```

### 3-5. 9개월치만 편성된 필수사업

```ts
export const GFC_SHORTFALL_ITEMS: ShortfallItem[] = [
  { label: "노인장기요양", amountEokwon: 1234, amountLabel: "약 1,234억 원" },
  { label: "도교육청 급식비 지원", amountEokwon: 548, amountLabel: "약 548억 원" },
  { label: "시내버스 공공관리제 운영지원", amountEokwon: 291, amountLabel: "약 291억 원" },
  { label: "경기도 산후조리비 지원", amountEokwon: 80, amountLabel: "약 80억 원" },
  { label: "친환경 우수 농축산물 학교급식 지원", amountEokwon: 34, amountLabel: "약 34억 원" },
  { label: "농작물재해보험 가입지원", amountEokwon: 29, amountLabel: "약 29억 원" },
  { label: "가족돌봄수당 지원", amountEokwon: 14, amountLabel: "약 14억 원" },
  { label: "소아응급 책임의료기관 육성", amountEokwon: 10, amountLabel: "약 10억 원" },
];
```

### 3-6. 4대 재정 정상화 방안

```ts
export const GFC_POLICY_MEASURES: PolicyMeasure[] = [
  { order: 1, title: "고위공직자 비용 삭감", body: "도지사 포함 고위공직자 업무경비 등을 감액합니다." },
  { order: 2, title: "세출 구조조정", body: "일회성 행사·선심성·불요불급 사업 편성과 집행을 전면 차단합니다." },
  { order: 3, title: "조직 구조조정", body: "실·국, 참모조직, 산하 공공기관 인력을 재배치합니다." },
  { order: 4, title: "세입구조 개편", body: "지방소비세 확대, 기업유치 세수 배분 개선, 국비 매칭 부담 개선을 추진합니다." },
];
```

### 3-7. 역대 지사 채무 추이

```ts
export const GFC_DEBT_TIMELINE: DebtYearPoint[] = [
  { year: "2019", debtEokwon: 21754, governor: "이재명" },
  { year: "2020", debtEokwon: 17693, governor: "이재명", note: "최저점" },
  { year: "2021", debtEokwon: 29112, governor: "이재명", note: "전년比 +64.5%" },
  { year: "2022", debtEokwon: 38362, governor: "김동연" },
  { year: "2023", debtEokwon: 45067, governor: "김동연" },
  { year: "2024", debtEokwon: 49847, governor: "김동연" },
  { year: "2025", debtEokwon: 61357, governor: "김동연" },
  { year: "2026.06", debtEokwon: 62368, governor: "추미애", note: "취임 시점" },
];

export const GFC_DEBT_CAUTION =
  "경기도 관계자는 채무 대부분이 자동차 구입 시 의무 매입하는 지역개발채권이며 '순수 채무는 없는 상태'라고 설명한 보도가 있습니다. 다만 이는 경기도 측 해석이며, 채무 총액 자체가 늘어난 사실과는 별개로 함께 읽어야 합니다. 2018년 이전 수치는 확보하지 못했습니다.";
```

### 3-8. 역대 지사 재정자립도 추이

```ts
export const GFC_FISCAL_INDEPENDENCE: FiscalIndependenceYearPoint[] = [
  { year: "2022", rate: 55.73, governor: "김동연", badge: "확인 필요" },
  { year: "2023", rate: 51.9, governor: "김동연", badge: "확인 필요" },
  { year: "2024", rate: 45.42, governor: "김동연", badge: "확인 필요" },
  { year: "2025", rate: 45.36, governor: "김동연", badge: "확인 필요" },
];

export const GFC_FISCAL_INDEPENDENCE_CAUTION =
  "공공데이터포털에는 2024년 경기도 본청 재정자립도가 55.1%로 다른 수치도 확인됩니다. 산정 기준(본청 단독 vs 광역+통합, 당초예산 vs 결산) 차이로 추정되며, 하나의 공식 기준으로 통일하려면 행정안전부 지방재정365 원자료 재확인이 필요합니다. 2018~2021년 수치는 확보하지 못했습니다.";
```

### 3-9. 책임 공방 (양측 병기)

```ts
export const GFC_RESPONSIBILITY_CLAIMS: ResponsibilityClaim[] = [
  {
    side: "추미애 지사 측",
    claim: "김동연 도정이 2025년 지방채를 한도의 99.6%까지 발행하고, 기금에서 5,588억 원을 일반회계로 끌어 쓴 결과 '미완의 미생 예산'을 남겼다.",
    sourceLabel: "경기도 자체 발표 (경기도뉴스포털)",
    sourceUrl: "https://gnews.gg.go.kr/news/news_detail.do?number=202608051737578186C052&s_code=C400",
  },
  {
    side: "이준석 (개혁신당 대표)",
    claim: "채무는 이재명 지사 시절인 2020년 1조7,693억 원에서 2021년 2조9,112억 원으로 이미 64.5% 늘었다. 최근 5년 중 가장 가파른 증가였다.",
    sourceLabel: "주간경향 보도",
    sourceUrl: "https://weekly.khan.co.kr/article/202608061202001",
  },
  {
    side: "제기된 의혹 (사실로 단정 아님)",
    claim: "8월 17일 민주당 전당대회(정청래·김민석 초접전) 국면에서 나온 발표라 정청래 후보에게 유리하게 작용하려는 것 아니냐는 의혹이 친명 커뮤니티 등에서 제기됐다.",
    sourceLabel: "주간경향 보도",
    sourceUrl: "https://weekly.khan.co.kr/article/202608061202001",
  },
  {
    side: "추미애 지사 측 반박",
    claim: "재정 문제는 인수위 때부터 계속 공개해온 사안이며, 감액추경을 앞둔 구조조정 설명일 뿐이다.",
    sourceLabel: "주간경향 보도",
    sourceUrl: "https://weekly.khan.co.kr/article/202608061202001",
  },
];
```

### 3-10. 출처

```ts
export const GFC_SOURCES: SourceLink[] = [
  { label: "경기도뉴스포털", href: "https://gnews.gg.go.kr/news/news_detail.do?number=202608051737578186C052&s_code=C400", description: "추미애 지사 재정 비상 선언 공식 발표 원문" },
  { label: "주간경향", href: "https://weekly.khan.co.kr/article/202608061202001", description: "책임 공방, 이준석 반론, 전당대회 관련 배경 보도" },
  { label: "이투데이", href: "https://www.etoday.co.kr/news/view/2611470", description: "경기도 채무 12년치 도의원 공개자료 보도" },
  { label: "KPI뉴스", href: "https://www.kpinews.kr/newsView/1065598433939531", description: "경기도 최근 5년 지방채 규모 연도별 보도" },
  { label: "경향신문", href: "https://www.khan.co.kr/article/202512262000001", description: "2026년 경기도 확정 예산(40조 577억 원) 보도" },
];
```

### 3-11. FAQ

```ts
export const GFC_FAQ: FaqItem[] = [
  {
    question: "경기도 재정 비상 선언은 경기도가 부도난다는 뜻인가요?",
    answer: "아닙니다. 41조 원 넘는 예산을 가진 광역자치단체이고 세입 자체가 사라진 것도 아닙니다. 문제는 총예산이 아니라 도가 정책적으로 쓸 수 있는 자체재원(약 3.5조 원) 대비 올해 줄여야 할 금액(약 7,700억 원)이 22% 수준으로 크다는 현금흐름·가용재원 문제입니다.",
  },
  {
    question: "예산이 41.7조나 되는데 왜 돈이 없다는 건가요?",
    answer: "전체 예산 41.7조 원 중 상당 부분은 국비 매칭사업이나 이미 용도가 정해진 특별회계 등으로 묶여 있어, 경기도가 자율적으로 편성·조정할 수 있는 자체재원은 약 3.5조 원 수준입니다. 이 자체재원 안에서 7,700억 원을 줄여야 하는 상황입니다.",
  },
  {
    question: "감액추경은 확정된 건가요?",
    answer: "2026-08-05 발표는 경기도의 재정 비상 상황 선언과 감액추경 필요성 설명이며, 실제 감액추경안은 이후 경기도의회 심의·의결 절차를 거쳐야 확정됩니다. 이 페이지는 발표 시점 수치를 기준으로 하며, 확정 결과가 나오면 업데이트가 필요합니다.",
  },
  {
    question: "이번 재정 위기는 김동연 전 지사 책임인가요?",
    answer: "추미애 지사 측은 김동연 도정의 지방채 발행과 기금 사용을 문제 삼았지만, 이준석 개혁신당 대표는 이재명 지사 시절인 2020~2021년에도 채무가 64.5% 늘었다는 점을 반론 근거로 제시했습니다. 이 리포트는 결론을 내리지 않고 양측 주장을 출처와 함께 병기합니다.",
  },
  {
    question: "경기도 채무는 정말 '빚'인가요?",
    answer: "경기도 관계자는 채무 대부분이 자동차 구입 시 의무 매입하는 지역개발채권이며 순수 채무는 아니라고 설명한 보도가 있습니다. 다만 채무 총액 자체가 늘어난 사실과는 별개의 해석이므로, 이 페이지는 두 설명을 함께 안내합니다.",
  },
  {
    question: "이 리포트는 어느 정치인 편을 드나요?",
    answer: "어느 쪽도 지지하거나 비판하지 않습니다. 발표 수치는 출처를 명시한 사실로, 책임 공방은 각 진영 주장을 그대로 병기해 판단은 독자의 몫으로 남겨둡니다.",
  },
];
```

### 3-12. 관련 링크

```ts
export const GFC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/gyeonggi-governor-candidate-assets-2026/", label: "경기도지사 후보 재산·부동산 비교 2026" },
  { href: "/reports/local-election-governor-2026/", label: "2026 지방선거 시도지사 당선자 공약 지도" },
  { href: "/reports/seoul-gyeonggi-youth-allowance-comparison-2026/", label: "서울 vs 경기 청년수당 비교 2026" },
  { href: "/reports/gyeonggi-family-care-allowance-2026/", label: "경기도 가족돌봄수당 안내" },
];
```

---

## 4. 페이지 IA 설계

### 4-1. 전체 구조

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page gfc-page">
    [CalculatorHero]
    [InfoNotice]                 // 데이터 기준 + 중립성 안내 2개 문단
    .gfc-kpi-section             // KPI 카드 4개
    .gfc-cause-section           // 구조적 원인 카드 3개
    .gfc-shortfall-section       // 9개월치 사업 bar rows
    .gfc-measure-section         // 4대 대책 카드
    .gfc-debt-section            // 역대 채무 bar 차트 + 지사 배지
    .gfc-independence-section    // 재정자립도 bar 차트
    .gfc-responsibility-section  // 책임 공방 카드 (양측 병기)
    .gfc-source-section          // 출처 목록
    [SeoContent]                 // FAQ + 관련 링크 + 서술형 인트로
  </main>
```

### 4-2. Hero

```astro
<CalculatorHero
  eyebrow="경기도 재정 비상 선언"
  title={GFC_META.title}
  description="2026-08-05 추미애 지사가 선언한 재정 비상 상황을 숫자로 정리하고, 이재명·김동연·추미애 3개 임기의 채무·재정자립도를 비교합니다."
  badges={["경기도", "재정 비상", "감액추경", "2026"]}
/>
```

### 4-3. InfoNotice

```astro
<InfoNotice
  title="데이터 기준 및 중립성 안내"
  lines={[GFC_META.dataNote, GFC_META.neutralityNote]}
/>
```

### 4-4. KPI 카드

```astro
<section class="content-section gfc-kpi-section" aria-labelledby="gfc-kpi-title">
  <div class="gfc-section-heading">
    <p>핵심 수치</p>
    <h2 id="gfc-kpi-title">41.7조 예산인데 왜 비상선언했나</h2>
    <span>총예산이 아니라 자체재원과 감액추경 규모를 함께 봐야 합니다.</span>
  </div>
  <div class="gfc-kpi-grid">
    {GFC_KPI_CARDS.map((card) => (
      <article class="gfc-kpi-card">
        <span class:list={["gfc-badge", `gfc-badge--${card.badge}`]}>{card.badge}</span>
        <small>{card.label}</small>
        <strong>{card.value}</strong>
        <p>{card.description}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-5. 구조적 원인 카드

```astro
<section class="content-section gfc-cause-section" aria-labelledby="gfc-cause-title">
  <div class="gfc-section-heading">
    <p>왜 이렇게 됐나</p>
    <h2 id="gfc-cause-title">부동산 경기에 기댄 세입 구조가 흔들렸다</h2>
  </div>
  <div class="gfc-cause-grid">
    {GFC_CAUSE_CARDS.map((card) => (
      <article class="gfc-cause-card">
        <h3>{card.title}</h3>
        <p>{card.body}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-6. 9개월치 사업 bar rows

막대 폭은 Astro frontmatter에서 최댓값 대비 비율로 서버 계산한다.

```astro
---
const shortfallMax = Math.max(...GFC_SHORTFALL_ITEMS.map((i) => i.amountEokwon));
---
<section class="content-section gfc-shortfall-section" aria-labelledby="gfc-shortfall-title">
  <div class="gfc-section-heading">
    <p>연말 3개월분 부족 사업</p>
    <h2 id="gfc-shortfall-title">9개월치만 편성됐다고 발표된 필수사업</h2>
    <span>경기도가 직접 밝힌 사업 8건입니다. 실제 감액추경 결과는 도의회 심의 후 확정됩니다.</span>
  </div>
  <div class="gfc-bar-rows">
    {GFC_SHORTFALL_ITEMS.map((item) => (
      <div class="gfc-bar-row">
        <span class="gfc-bar-row__label">{item.label}</span>
        <div class="gfc-bar-row__track">
          <div class="gfc-bar-row__fill" style={`width:${(item.amountEokwon / shortfallMax) * 100}%`}></div>
        </div>
        <span class="gfc-bar-row__value">{item.amountLabel}</span>
      </div>
    ))}
  </div>
</section>
```

### 4-7. 4대 대책

```astro
<section class="content-section gfc-measure-section" aria-labelledby="gfc-measure-title">
  <div class="gfc-section-heading">
    <p>경기도 발표 대책</p>
    <h2 id="gfc-measure-title">4가지 재정 정상화 방안</h2>
  </div>
  <div class="gfc-measure-grid">
    {GFC_POLICY_MEASURES.map((m) => (
      <article class="gfc-measure-card">
        <span class="gfc-measure-card__order">{m.order}</span>
        <h3>{m.title}</h3>
        <p>{m.body}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-8. 역대 채무 추이

```astro
---
const debtMax = Math.max(...GFC_DEBT_TIMELINE.map((d) => d.debtEokwon));
const governorClass: Record<string, string> = {
  이재명: "gfc-gov--lee",
  권한대행: "gfc-gov--acting",
  김동연: "gfc-gov--kim",
  추미애: "gfc-gov--chu",
};
---
<section class="content-section gfc-debt-section" aria-labelledby="gfc-debt-title">
  <div class="gfc-section-heading">
    <p>역대 지사 비교 · 채무</p>
    <h2 id="gfc-debt-title">이재명 → 김동연 → 추미애, 채무는 어떻게 늘었나</h2>
    <span>지방채 발행 잔액 기준입니다. 경기도는 대부분 자동차 구입 시 의무 매입하는 지역개발채권이라고 설명합니다.</span>
  </div>
  <div class="gfc-bar-rows gfc-bar-rows--debt">
    {GFC_DEBT_TIMELINE.map((d) => (
      <div class="gfc-bar-row">
        <span class="gfc-bar-row__label">
          {d.year}
          <span class:list={["gfc-gov-badge", governorClass[d.governor]]}>{d.governor}</span>
        </span>
        <div class="gfc-bar-row__track">
          <div class:list={["gfc-bar-row__fill", governorClass[d.governor]]} style={`width:${(d.debtEokwon / debtMax) * 100}%`}></div>
        </div>
        <span class="gfc-bar-row__value">{(d.debtEokwon / 10000).toFixed(1)}조 원{d.note ? ` · ${d.note}` : ""}</span>
      </div>
    ))}
  </div>
  <p class="gfc-caution">{GFC_DEBT_CAUTION}</p>
</section>
```

### 4-9. 재정자립도 추이

```astro
---
const rateMax = 100;
---
<section class="content-section gfc-independence-section" aria-labelledby="gfc-independence-title">
  <div class="gfc-section-heading">
    <p>역대 지사 비교 · 재정자립도</p>
    <h2 id="gfc-independence-title">재정자립도는 10년 만에 최저 수준</h2>
  </div>
  <div class="gfc-bar-rows">
    {GFC_FISCAL_INDEPENDENCE.map((f) => (
      <div class="gfc-bar-row">
        <span class="gfc-bar-row__label">{f.year}</span>
        <div class="gfc-bar-row__track">
          <div class="gfc-bar-row__fill" style={`width:${(f.rate / rateMax) * 100}%`}></div>
        </div>
        <span class="gfc-bar-row__value">
          {f.rate}%
          <span class:list={["gfc-badge", `gfc-badge--${f.badge}`]}>{f.badge}</span>
        </span>
      </div>
    ))}
  </div>
  <p class="gfc-caution">{GFC_FISCAL_INDEPENDENCE_CAUTION}</p>
</section>
```

### 4-10. 책임 공방

```astro
<section class="content-section gfc-responsibility-section" aria-labelledby="gfc-responsibility-title">
  <div class="gfc-section-heading">
    <p>책임 공방</p>
    <h2 id="gfc-responsibility-title">누구 책임인가 — 양측 주장을 그대로 병기합니다</h2>
    <span>{GFC_META.neutralityNote}</span>
  </div>
  <div class="gfc-claim-list">
    {GFC_RESPONSIBILITY_CLAIMS.map((claim) => (
      <article class="gfc-claim-card">
        <strong>{claim.side}</strong>
        <p>{claim.claim}</p>
        <a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">{claim.sourceLabel} →</a>
      </article>
    ))}
  </div>
</section>
```

### 4-11. 출처

```astro
<section class="content-section gfc-source-section" aria-labelledby="gfc-source-title">
  <div class="gfc-section-heading">
    <p>출처</p>
    <h2 id="gfc-source-title">원문에서 직접 확인하세요</h2>
  </div>
  <div class="gfc-source-grid">
    {GFC_SOURCES.map((s) => (
      <a class="gfc-source-card" href={s.href} target="_blank" rel="noopener noreferrer">
        <strong>{s.label}</strong>
        <span>{s.description}</span>
      </a>
    ))}
  </div>
</section>
```

---

## 5. SCSS 설계

파일: `src/styles/scss/pages/_gyeonggi-fiscal-crisis-2026.scss`

### 5-1. 기본 구조 및 그리드

```scss
.gfc-page {
  display: grid;
  gap: 28px;

  .gfc-section-heading {
    display: grid;
    gap: 6px;
    margin-bottom: 18px;
    p, h2, span { margin: 0; }
    p { font-size: 12px; font-weight: 900; color: #1a56db; }
    h2 { font-size: clamp(20px, 3vw, 30px); line-height: 1.25; color: #111928; }
    span { color: #4b5563; line-height: 1.65; }
  }
}

.gfc-kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.gfc-cause-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.gfc-measure-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.gfc-source-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.gfc-claim-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }

@media (max-width: 820px) {
  .gfc-kpi-grid, .gfc-cause-grid, .gfc-measure-grid, .gfc-source-grid, .gfc-claim-list {
    grid-template-columns: 1fr;
  }
}
```

### 5-2. 카드 공통

```scss
.gfc-kpi-card, .gfc-cause-card, .gfc-measure-card, .gfc-claim-card, .gfc-source-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  padding: 18px;
}

.gfc-measure-card__order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #1a56db;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 8px;
}

.gfc-claim-card {
  border-left: 4px solid #1a56db;
  strong { display: block; margin-bottom: 6px; font-size: 14px; }
  p { margin: 0 0 10px; line-height: 1.65; color: #374151; }
  a { font-size: 12px; color: #1a56db; text-decoration: none; }
}
```

### 5-3. Bar rows

```scss
.gfc-bar-rows { display: grid; gap: 10px; }

.gfc-bar-row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  align-items: center;
  gap: 12px;
  font-size: 13px;

  &__label { display: flex; align-items: center; gap: 6px; color: #374151; font-weight: 600; }
  &__track { height: 10px; border-radius: 99px; background: #e5edfa; overflow: hidden; }
  &__fill { height: 100%; border-radius: 99px; background: #1a56db; }
  &__value { color: #111928; font-weight: 700; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
}

@media (max-width: 640px) {
  .gfc-bar-row {
    grid-template-columns: 1fr;
    gap: 4px;
    &__value { justify-self: start; }
  }
}

// 지사별 색상 구분 (채무 차트 전용)
.gfc-gov--lee { background: #16a34a; }
.gfc-gov--acting { background: #94a3b8; }
.gfc-gov--kim { background: #f59e0b; }
.gfc-gov--chu { background: #1a56db; }

.gfc-gov-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 99px;
  font-size: 10px;
  color: #fff;
  font-weight: 700;
}
```

### 5-4. 배지 및 주의문

```scss
.gfc-badge {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 700;

  &--공식 { background: #dcfce7; color: #15803d; }
  &--확인.필요, &--확인\ 필요 { background: #fef3c7; color: #b45309; }
  &--참고 { background: #e5e7eb; color: #4b5563; }
}

.gfc-caution {
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.7;
  background: #f8fafc;
  border-radius: 6px;
  padding: 10px 12px;
}
```

> ⚠️ 구현 시 확인: `class:list`로 `gfc-badge--확인 필요`처럼 공백이 들어간 클래스명이 생성되면 SCSS `&--` 셀렉터가 정상 매칭되지 않는다. 배지 modifier는 `공식 / 확인 필요 / 참고` 대신 영문 키(`official / check / reference`)로 매핑하는 헬퍼 함수를 데이터 파일 또는 컴포넌트 레벨에 추가한다.
>
> ```ts
> const badgeModifier: Record<EvidenceBadge, string> = { "공식": "official", "확인 필요": "check", "참고": "reference" };
> ```

### 5-5. 색상 방향

- 사이트 기본 primary `#1a56db` 유지
- 지사별 구분색: 이재명 `#16a34a`(초록), 권한대행 `#94a3b8`(회색), 김동연 `#f59e0b`(주황), 추미애 `#1a56db`(블루) — 정당색이 아닌 임기 구분용 중립 색상 사용
- 책임 공방 카드는 좌측 보더만 강조, 배경은 중립 회색조 유지 (특정 진영을 시각적으로 우대하지 않도록)

---

## 6. Astro 페이지 설계

파일: `src/pages/reports/gyeonggi-fiscal-crisis-2026.astro`

### 6-1. frontmatter

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  GFC_META,
  GFC_KPI_CARDS,
  GFC_CAUSE_CARDS,
  GFC_SHORTFALL_ITEMS,
  GFC_POLICY_MEASURES,
  GFC_DEBT_TIMELINE,
  GFC_DEBT_CAUTION,
  GFC_FISCAL_INDEPENDENCE,
  GFC_FISCAL_INDEPENDENCE_CAUTION,
  GFC_RESPONSIBILITY_CLAIMS,
  GFC_SOURCES,
  GFC_FAQ,
  GFC_RELATED_LINKS,
} from "../../data/gyeonggiFiscalCrisis2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${GFC_META.slug}/`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: GFC_META.title,
    description: GFC_META.description,
    dateModified: GFC_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GFC_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];
---
```

### 6-2. SeoContent

```astro
<SeoContent
  introTitle="경기도 재정 비상 선언, 숫자로 보면 어느 정도인가"
  intro={[
    "2026년 8월 5일 추미애 경기도지사는 경기도 재정을 '비상 상황'으로 공식 선언했습니다. 41.7조 원 규모 예산을 가진 광역자치단체의 재정 비상 선언은 이례적이라 검색 수요가 빠르게 늘었지만, 개별 기사만 봐서는 실제로 얼마나 심각한 상황인지 종합적으로 판단하기 어렵습니다.",
    "핵심은 예산 총액이 아니라 가용재원입니다. 41.7조 원 중 경기도가 정책적으로 움직일 수 있는 자체재원은 약 3.5조 원이고, 이 중 7,700억 원을 올해 안에 줄여야 한다는 것이 이번 발표의 골자입니다. 취득세 수입이 2022년 11조 원에서 2026년 8조 원 수준으로 줄어든 반면, 복지·교통 같은 고정비 지출은 줄지 않으면서 격차가 커졌습니다.",
    "이 리포트는 발표 수치 정리에 더해 이재명·김동연·추미애 3개 임기의 채무·재정자립도 추이를 함께 비교합니다. 채무는 2020년 1조7,693억 원(최저점) 이후 2021년부터 5년 연속 늘어 2026년 6월 기준 6조2,368억 원에 이르렀습니다. 재정자립도는 2022년 55.73%에서 2025년 45.36%로 10년 만에 최저 수준을 기록했습니다.",
    "누구 책임인지는 진영에 따라 다르게 말합니다. 추미애 지사 측은 김동연 전 지사의 지방채·기금 운용을 문제 삼았고, 이준석 개혁신당 대표는 이재명 지사 시절인 2020~2021년에도 채무가 64.5% 늘었다는 점을 반론으로 제시했습니다. 이 리포트는 결론을 내리지 않고 양측 주장을 출처와 함께 병기합니다. 실제 감액추경 결과는 경기도의회 심의를 거쳐야 확정되므로, 이후 업데이트가 필요합니다.",
  ]}
  inputPoints={[
    "경기도 재정 비상 선언의 핵심 수치(예산, 자체재원, 감액추경, 지방채)를 정리합니다.",
    "이재명·김동연·추미애 3개 임기의 채무·재정자립도 추이를 비교합니다.",
    "김동연 책임론과 이재명 시기 반론을 출처와 함께 병기합니다.",
  ]}
  criteria={[
    "발표 수치는 경기도뉴스포털 원문을 기준으로 합니다.",
    "채무·재정자립도는 출처를 명시하고, 출처 간 값이 다르면 통일하지 않고 병기합니다.",
    "책임 공방은 결론을 내리지 않고 각 진영 발표를 그대로 인용합니다.",
    "감액추경 확정 결과가 나오면 업데이트가 필요합니다.",
  ]}
  faq={GFC_FAQ}
  related={GFC_RELATED_LINKS}
/>
```

---

## 7. 등록 설계

### 7-1. `src/data/reports.ts`

```ts
{
  slug: "gyeonggi-fiscal-crisis-2026",
  title: "경기도 재정위기 2026 완전 정리",
  description: "경기도 예산 41.7조 중 자체재원은 3.5조, 올해 감액추경만 7,700억 원입니다. 이재명·김동연·추미애 시기별 채무 비교표까지 정리했습니다.",
  order: <다음 순번>,
  badges: ["경기도", "재정위기", "2026"],
}
```

### 7-2. `src/pages/index.astro`

`reportMetaBySlug`에 추가:

```ts
"gyeonggi-fiscal-crisis-2026": { category: "politics", isNew: true },
```

### 7-3. `src/pages/reports/index.astro`

`reportMetaBySlug`에 추가:

```ts
"gyeonggi-fiscal-crisis-2026": {
  eyebrow: "경기도 재정 비상",
  tags: [
    { label: "경기도", mod: "politics" },
    { label: "재정위기", mod: "politics" },
    { label: "2026", mod: "politics" },
  ],
  category: "politics",
  isNew: true,
},
```

### 7-4. `src/styles/app.scss`

```scss
@use 'scss/pages/gyeonggi-fiscal-crisis-2026';
```

### 7-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/gyeonggi-fiscal-crisis-2026/</loc>
  <lastmod>2026-08-07</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
```

> `changefreq`를 `weekly`로 둔 이유: 감액추경 도의회 심의 결과에 따라 단기간 내 업데이트 가능성이 높음.

---

## 8. 구현 순서

1. (권장) 41.7조 vs 40.06조 예산 수치, 재정자립도 산정 기준 재확인 — 시간 제약 시 `확인 필요` 배지로 진행 가능
2. 데이터 파일 생성 (`gyeonggiFiscalCrisis2026.ts`) — 3장 전체 반영
3. Astro 페이지 생성 — Hero, InfoNotice, KPI, 원인, 부족사업, 대책, 채무·재정자립도 bar 차트, 책임 공방, 출처, SeoContent
4. SCSS 생성 — `.gfc` prefix, bar row 컴포넌트, 배지 modifier는 영문 키로 매핑
5. 등록 파일 반영 — `reports.ts`, 홈 `reportMetaBySlug`, 리포트 허브 `reportMetaBySlug`, `app.scss`, `sitemap.xml`
6. `npm run build` 통과 확인

---

## 9. QA 체크리스트

### 콘텐츠·중립성

- [ ] 추미애 지사 발표와 이준석 반론이 비슷한 비중과 카드 크기로 다뤄지는가?
- [ ] "경기도가 부도난다" 같은 과장 표현이 없는가?
- [ ] 41.7조 vs 40.06조, 재정자립도 45.42% vs 55.1% 수치 차이가 임의로 통일되지 않고 병기됐는가?
- [ ] 전당대회 관련 의혹이 "제기된 의혹"으로만 표현되고 사실처럼 단정되지 않았는가?
- [ ] 지역개발채권 vs 순수 채무 논쟁이 한쪽 해석만 반영되지 않았는가?
- [ ] 모든 발표·주장 문장에 출처 링크가 붙어 있는가?

### SEO

- [ ] title에 "경기도 재정", "2026", 핵심 궁금증이 자연스럽게 포함되는가?
- [ ] description이 80~120자인가?
- [ ] FAQ가 화면에 보이고 JSON-LD와 같은 데이터에서 생성되는가?
- [ ] 관련 링크 3개 이상인가?

### UI

- [ ] 모바일에서 4열/3열/2열 그리드가 1열로 자연스럽게 쌓이는가?
- [ ] bar row가 320px 화면에서 라벨-바-값 순서로 깨지지 않는가?
- [ ] 배지 modifier 클래스(`gfc-badge--official` 등)가 공백 없는 영문 키로 정상 매칭되는가?
- [ ] 책임 공방 카드가 특정 진영 쪽으로 시각적으로 치우쳐 보이지 않는가?

### 등록·검증

- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/index.astro`의 `reportMetaBySlug` 등록
- [ ] `src/pages/reports/index.astro`의 `reportMetaBySlug` 등록
- [ ] `src/styles/app.scss` 등록
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 통과

---

## 10. 최종 판단

이 리포트는 SVG 지도나 인터랙티브 계산이 필요 없는 **정적 정보 정리형 리포트**다. 핵심은 계산 로직이 아니라 ①발표 수치의 출처 검증, ②역대 지사 비교의 공정한 시각화(bar row + 임기 구분 배지), ③책임 공방의 중립적 병기다. MVP는 정적 페이지로 충분하며, 감액추경이 도의회에서 실제 확정되면 `GFC_META.updatedAt`과 KPI 카드 수치를 갱신하는 방식으로 유지보수한다.
