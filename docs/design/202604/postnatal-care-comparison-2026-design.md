# 2026 산후도우미 vs 산후조리원 완전 비교 - 설계 문서

> 기획 원문: `docs/plan-docs/202604/postnatal-care-comparison-2026.md`  
> 작성일: 2026-04-27  
> 구현 기준: Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정  
> 참고 리포트: `postpartum-center-cost-2026`, `pregnancy-birth-cost`, `baby-cost-guide-first-year`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan-docs/202604/postnatal-care-comparison-2026.md`
- 구현 대상: `2026 산후도우미 vs 산후조리원 완전 비교`
- 콘텐츠 유형: 비교 리포트 + 간단 선택 테스트 (`/reports/` 계열)
- URL: `/reports/postnatal-care-comparison-2026/`
- 카테고리: 출산/임신

### 1-2. 페이지 성격

- **선택 기준 리포트**: 산후조리원과 산후도우미를 비용, 정부지원, 회복 환경, 신생아 케어, 가족 지원 여부 기준으로 비교한다.
- **핵심 차별점**: 단순 가격 비교가 아니라 "우리 집 상황에서는 어느 조합이 현실적인가"를 판단하게 한다.
- **주요 전환**: 산후조리 총비용 계산기, 출산지원금 계산기, 육아휴직 급여 계산기로 연결한다.
- **데이터 원칙**: 기획 문서의 공개 자료 기반 금액을 사용하되, 산후도우미 지원금과 지자체 지원은 지역·소득·출산 순위별 변동이 크므로 `참고` 또는 `추정` 라벨을 붙인다.

### 1-3. 권장 파일 구조

```txt
src/
  data/
    postnatalCareComparison2026.ts
  pages/
    reports/
      postnatal-care-comparison-2026.astro

public/
  scripts/
    postnatal-care-comparison-2026.js
  og/
    reports/
      postnatal-care-comparison-2026.png

src/styles/scss/pages/
  _postnatal-care-comparison-2026.scss
```

### 1-4. 구현 전제

- 실시간 정부지원금 조회 또는 시설 가격 조회는 구현하지 않는다.
- 금액은 "대표 예시" 또는 "범위값"으로 표시한다.
- 모든 금액에는 기준 기간을 함께 표기한다. 예: `2주 기준`, `10일 기준`, `5~20일`.
- 산후도우미는 공식 명칭 `산모·신생아 건강관리 지원사업`을 함께 노출한다.
- 의료·정신건강 관련 판단은 일반 정보로만 제공하고, 산후우울증 우려가 있으면 전문가 상담을 권장한다.

---

## 2. 현재 프로젝트 리포트 구조 정리

### 2-1. 재사용할 공통 패턴

1. `CalculatorHero`
2. `InfoNotice`
3. Hero KPI 카드
4. 비교 표와 비교 카드
5. 탭 기반 인터랙션
6. 체크리스트
7. 관련 계산기 CTA
8. FAQ
9. `SeoContent`

### 2-2. 이번 리포트의 구현 방향

- `postpartum-center-cost-2026`에서 가져올 것
  - 산후조리원 비용 데이터 표기 방식
  - 공식/참고/추정 배지
  - 비용 상승과 공공/민간 비교 문맥
- `pregnancy-birth-cost`에서 가져올 것
  - 출산 관련 계산기 CTA 연결
  - 지원금과 본인부담금을 분리하는 설명 방식
- `baby-cost-guide-first-year`에서 가져올 것
  - 비용 절약 체크리스트
  - 출산·육아 관련 내부 링크 구성

---

## 3. 구현 범위

### 3-1. MVP 포함

- 산후조리원 vs 산후도우미 핵심 비교표
- "30초 선택 테스트" 인터랙션
- 산후조리원 비용 요약
- 산후도우미 서비스 기간·지원 구조 요약
- 첫째/둘째 이상/쌍태아/배우자 육아휴직 가능 여부별 추천 카드
- 병행 시나리오 3개
- 지원금·바우처 확인 체크리스트
- FAQ 8개 이상
- 관련 계산기 CTA 3개 이상

### 3-2. MVP 제외

- 개인별 정확한 바우처 지원금 자동 산정
- 지역별 최신 제공기관 조회
- 산후조리원 예약 가능 여부 조회
- 제휴 플랫폼 실시간 견적
- 사용자 후기 수집 기능

---

## 4. 데이터 파일 설계 (`postnatalCareComparison2026.ts`)

### 4-1. 타입 정의

```ts
export type DataBadge = "공식" | "참고" | "추정";

export type CareType = "center" | "helper" | "hybrid";

export type ComparisonRow = {
  label: string;
  center: string;
  helper: string;
  note?: string;
};

export type CostSummary = {
  id: string;
  label: string;
  period: string;
  costRange: string;
  support: string;
  outOfPocket: string;
  badge: DataBadge;
  note: string;
};

export type DecisionQuestion = {
  id: string;
  question: string;
  yesCareType: CareType;
  noCareType: CareType;
  weight: number;
};

export type RecommendationScenario = {
  id: string;
  title: string;
  recommended: CareType;
  summary: string;
  reasons: string[];
  cautions: string[];
};

export type HybridScenario = {
  id: string;
  title: string;
  composition: string;
  budgetDirection: string;
  suitableFor: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};
```

### 4-2. 메타 데이터

```ts
export const PNC_META = {
  slug: "postnatal-care-comparison-2026",
  title: "2026 산후도우미 vs 산후조리원 완전 비교",
  seoTitle: "2026 산후도우미 vs 산후조리원 비교 | 비용·정부지원·추천 기준 총정리",
  seoDescription:
    "산후조리원 2주 비용과 산후도우미 정부지원 바우처, 첫째·둘째·쌍태아 상황별 추천 기준을 2026년 기준으로 비교합니다.",
  updatedAt: "2026-04",
  dataNote:
    "이 리포트는 공개 자료와 지자체 안내를 바탕으로 작성한 비교 목적 자료입니다. 실제 지원금과 요금은 거주지, 소득 구간, 출산 순위, 제공기관에 따라 달라집니다.",
};
```

### 4-3. Hero KPI

```ts
export const PNC_HERO_STATS = [
  {
    label: "산후조리원",
    value: "2주 수백만 원대",
    note: "지역·등급별 편차 큼",
    badge: "참고" as DataBadge,
  },
  {
    label: "산후도우미",
    value: "5~20일 이상",
    note: "정부 바우처 적용 가능",
    badge: "공식" as DataBadge,
  },
  {
    label: "첫째 출산",
    value: "조리원 선호",
    note: "신생아 케어 학습 수요 높음",
    badge: "추정" as DataBadge,
  },
  {
    label: "둘째 이상",
    value: "도우미 선호",
    note: "가정 동선 유지가 중요",
    badge: "추정" as DataBadge,
  },
];
```

### 4-4. 핵심 비교표

```ts
export const PNC_COMPARISON_ROWS: ComparisonRow[] = [
  { label: "이용 장소", center: "전문 시설 입소", helper: "자택 방문" },
  { label: "대표 기간", center: "보통 2주", helper: "5일~20일 이상" },
  { label: "비용 구조", center: "대부분 본인부담", helper: "정부 바우처 + 본인부담금" },
  { label: "식사", center: "조리원 식사 제공", helper: "가정식 또는 일부 지원" },
  { label: "신생아 케어", center: "24시간 관리 체계", helper: "정해진 방문 시간 내 관리" },
  { label: "산모 회복", center: "휴식·마사지·수유교육 집중", helper: "집 환경과 가족 지원에 따라 차이" },
  { label: "배우자 역할", center: "상대적으로 적음", helper: "가정 돌봄 참여 가능" },
  { label: "주요 리스크", center: "고비용, 감염 우려, 예약 경쟁", helper: "매칭 품질 편차, 집안 환경 영향" },
];
```

### 4-5. 비용 요약

```ts
export const PNC_COST_SUMMARY: CostSummary[] = [
  {
    id: "center-national",
    label: "산후조리원 전국 평균",
    period: "2주 기준",
    costRange: "약 370만 원대",
    support: "일부 지자체 지원 가능",
    outOfPocket: "대부분 본인부담",
    badge: "참고",
    note: "일반실 기준 공개 자료 기반 요약",
  },
  {
    id: "center-seoul",
    label: "서울 산후조리원",
    period: "2주 기준",
    costRange: "약 490만 원대 이상 가능",
    support: "공공·지자체 지원 여부 확인 필요",
    outOfPocket: "지역과 시설 등급별 차이 큼",
    badge: "참고",
    note: "민간 조리원은 강남권·특실에서 고가 사례가 많음",
  },
  {
    id: "helper-standard",
    label: "산후도우미 표준형",
    period: "10일 예시",
    costRange: "서비스 가격은 정부 고시·지역별 기준 확인",
    support: "소득 구간·출산 순위별 차등",
    outOfPocket: "지원금 차감 후 부담",
    badge: "공식",
    note: "산모·신생아 건강관리 지원사업 기준",
  },
];
```

### 4-6. 선택 테스트 질문

```ts
export const PNC_DECISION_QUESTIONS: DecisionQuestion[] = [
  {
    id: "first_birth",
    question: "첫째 출산이고 신생아 돌봄 경험이 거의 없나요?",
    yesCareType: "center",
    noCareType: "helper",
    weight: 2,
  },
  {
    id: "budget_sensitive",
    question: "2주 조리원 비용이 예산에서 큰 부담인가요?",
    yesCareType: "helper",
    noCareType: "center",
    weight: 2,
  },
  {
    id: "family_support",
    question: "배우자나 가족이 낮 시간 돌봄을 함께 할 수 있나요?",
    yesCareType: "helper",
    noCareType: "center",
    weight: 1,
  },
  {
    id: "home_child",
    question: "집에 돌봐야 할 첫째 아이가 있나요?",
    yesCareType: "helper",
    noCareType: "center",
    weight: 2,
  },
  {
    id: "recovery_priority",
    question: "산모 휴식과 회복 공간을 최우선으로 두나요?",
    yesCareType: "center",
    noCareType: "helper",
    weight: 2,
  },
  {
    id: "hybrid_possible",
    question: "조리원 1주 + 도우미 2주처럼 병행할 예산과 일정이 있나요?",
    yesCareType: "hybrid",
    noCareType: "helper",
    weight: 1,
  },
];
```

### 4-7. 상황별 추천 카드

```ts
export const PNC_RECOMMENDATION_SCENARIOS: RecommendationScenario[] = [
  {
    id: "first-birth",
    title: "첫째 출산, 돌봄 경험이 적은 가정",
    recommended: "center",
    summary: "산후조리원 2주 또는 조리원 1주 + 도우미 병행을 우선 검토합니다.",
    reasons: ["신생아 케어와 수유 교육을 집중적으로 받을 수 있음", "산모가 회복에 집중하기 쉬움"],
    cautions: ["시설별 감염관리와 추가비 항목을 확인해야 함", "예약 경쟁이 높을 수 있음"],
  },
  {
    id: "second-plus",
    title: "둘째 이상 출산, 첫째 돌봄이 필요한 가정",
    recommended: "helper",
    summary: "가정 동선을 유지하면서 산후도우미를 쓰는 방식이 현실적입니다.",
    reasons: ["첫째 아이와 분리되는 부담을 줄일 수 있음", "정부지원 적용 시 실부담금이 낮아질 수 있음"],
    cautions: ["도우미 매칭 품질과 교체 기준을 사전에 확인해야 함"],
  },
  {
    id: "twins",
    title: "쌍태아·다태아 출산",
    recommended: "hybrid",
    summary: "초기 회복은 조리원, 퇴소 후 적응은 산후도우미로 나누는 병행형을 검토합니다.",
    reasons: ["돌봄 강도가 높아 한 가지 방식만으로 부족할 수 있음", "서비스 기간과 지원금이 단태아와 다를 수 있음"],
    cautions: ["조리원 추가요금과 도우미 인력 기준을 별도로 확인해야 함"],
  },
  {
    id: "spouse-leave",
    title: "배우자 육아휴직 또는 재택 지원 가능",
    recommended: "helper",
    summary: "산후도우미와 배우자 돌봄을 조합하면 비용과 적응 측면의 균형이 좋습니다.",
    reasons: ["집에서 생활 루틴을 빠르게 만들 수 있음", "야간·주말 돌봄 공백을 가족이 보완할 수 있음"],
    cautions: ["배우자 역할 분담표를 출산 전에 정해야 함"],
  },
];
```

### 4-8. 병행 시나리오

```ts
export const PNC_HYBRID_SCENARIOS: HybridScenario[] = [
  {
    id: "center-2w",
    title: "산후조리원 2주",
    composition: "조리원 2주 + 퇴소 후 가족 돌봄",
    budgetDirection: "비용은 높지만 초기 회복과 교육 집중",
    suitableFor: ["첫째 출산", "회복 지원이 부족한 가정", "수유·목욕 교육이 필요한 가정"],
  },
  {
    id: "helper-3w",
    title: "산후도우미 3주",
    composition: "산후도우미 표준·연장형 + 배우자 또는 가족 지원",
    budgetDirection: "정부지원 적용 시 실부담금 절감 가능",
    suitableFor: ["둘째 이상", "집에서 회복하고 싶은 가정", "첫째 아이 동선 유지가 필요한 가정"],
  },
  {
    id: "hybrid-1w-2w",
    title: "조리원 1주 + 산후도우미 2주",
    composition: "초기 회복은 시설, 퇴소 후 적응은 자택",
    budgetDirection: "회복과 비용 절감의 절충안",
    suitableFor: ["예산 부담이 있는 첫째 출산", "쌍태아·다태아", "퇴소 후 돌봄 공백이 걱정되는 가정"],
  },
];
```

### 4-9. FAQ

```ts
export const PNC_FAQ: FaqItem[] = [
  {
    q: "산후조리원과 산후도우미 중 어느 쪽이 더 저렴한가요?",
    a: "대체로 산후도우미가 더 저렴합니다. 산후조리원은 2주 기준 수백만 원대 비용이 발생하는 반면, 산후도우미는 정부 바우처 지원을 받을 수 있어 실부담금이 낮아질 수 있습니다. 다만 거주지, 소득 구간, 출산 순위, 서비스 기간에 따라 달라집니다.",
  },
  {
    q: "첫째 출산이면 산후조리원이 꼭 필요한가요?",
    a: "꼭 필요한 것은 아니지만, 신생아 케어 경험이 적고 산모 회복 지원이 부족하다면 산후조리원이 도움이 될 수 있습니다. 비용 부담이 크다면 조리원 1주 + 산후도우미 2주 조합도 검토할 수 있습니다.",
  },
  {
    q: "둘째 이상 출산이면 산후도우미가 더 나은가요?",
    a: "첫째 아이 돌봄과 가정 동선 유지가 중요하다면 산후도우미가 현실적인 선택이 될 수 있습니다. 다만 산모가 충분히 쉴 수 있는 공간과 가족의 역할 분담이 준비되어 있어야 합니다.",
  },
  {
    q: "산후도우미 정부지원은 누구나 받을 수 있나요?",
    a: "산모·신생아 건강관리 지원사업은 소득 구간, 출산 순위, 태아 유형, 예외지원 여부에 따라 지원금이 달라집니다. 신청 전 거주지 보건소, 복지로, 지자체 안내에서 최신 기준을 확인해야 합니다.",
  },
  {
    q: "산후조리원 비용은 정부지원으로 차감되나요?",
    a: "중앙정부 바우처가 산후조리원 기본 이용료를 직접 차감하는 구조는 제한적입니다. 일부 지자체 산후조리비 지원이나 공공 산후조리원 이용 가능 여부를 별도로 확인해야 합니다.",
  },
  {
    q: "산후도우미는 야간에도 이용할 수 있나요?",
    a: "정부지원 서비스는 정해진 방문 시간과 서비스 유형을 기준으로 운영됩니다. 야간·입주형·프리미엄 서비스는 민간 업체 별도 상품일 수 있으므로 비용과 지원 적용 여부를 구분해야 합니다.",
  },
  {
    q: "쌍둥이 출산은 어떤 방식을 추천하나요?",
    a: "쌍둥이·다태아는 돌봄 강도가 높아 조리원과 산후도우미 병행을 검토하는 것이 현실적입니다. 조리원 추가요금, 신생아실 기준, 도우미 인력 배치 기준을 사전에 확인해야 합니다.",
  },
  {
    q: "산후우울감이 걱정되면 어떤 기준을 우선해야 하나요?",
    a: "비용보다 산모의 수면, 정서적 지지, 돌봄 공백을 우선해야 합니다. 우울감이 지속되거나 일상 기능에 영향을 준다면 산부인과, 정신건강복지센터, 보건소 등 전문기관 상담을 권장합니다.",
  },
];
```

---

## 5. 페이지 섹션 구성

### 5-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. Hero KPI 카드
4. 산후조리 방식 핵심 비교표
5. 30초 선택 테스트
6. 비용 비교 요약
7. 산후조리원 상세 비교
8. 산후도우미 정부지원 구조
9. 첫째·둘째·쌍태아·배우자 육아휴직 상황별 추천
10. 병행 시나리오
11. 체크리스트
12. 비용 절약 팁
13. 관련 계산기 CTA
14. FAQ
15. `SeoContent`

### 5-2. Hero

```astro
<CalculatorHero
  eyebrow="출산 준비 리포트"
  title="2026 산후도우미 vs 산후조리원 완전 비교"
  description="산후조리원 2주 비용, 산후도우미 정부지원, 첫째·둘째·쌍태아 상황별 추천 기준을 한 번에 비교합니다."
  badges={["산후도우미", "산후조리원", "정부지원", "2026"] }
/>
<InfoNotice text={PNC_META.dataNote} />
```

### 5-3. KPI 카드

```astro
<section class="content-section pnc-kpi-section">
  <div class="pnc-kpi-grid">
    {PNC_HERO_STATS.map((stat) => (
      <article class="pnc-kpi-card">
        <span class={`pnc-badge pnc-badge--${stat.badge}`}>{stat.badge}</span>
        <p>{stat.label}</p>
        <strong>{stat.value}</strong>
        <small>{stat.note}</small>
      </article>
    ))}
  </div>
</section>
```

### 5-4. 핵심 비교표

- H2: `산후조리원과 산후도우미, 무엇이 다른가요?`
- 표는 모바일에서 `overflow-x: auto`를 적용한다.
- 첫 컬럼은 비교 항목, 두 번째는 산후조리원, 세 번째는 산후도우미.

```astro
<table class="pnc-compare-table">
  <thead>
    <tr>
      <th>비교 항목</th>
      <th>산후조리원</th>
      <th>산후도우미</th>
    </tr>
  </thead>
  <tbody>
    {PNC_COMPARISON_ROWS.map((row) => (
      <tr>
        <td><strong>{row.label}</strong></td>
        <td>{row.center}</td>
        <td>{row.helper}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### 5-5. 30초 선택 테스트

- H2: `우리 집은 어느 방식이 맞을까?`
- 질문은 예/아니오 토글로 구성한다.
- 결과는 `center`, `helper`, `hybrid` 점수를 합산해 가장 높은 유형을 표시한다.
- 결과 CTA는 `/tools/postnatal-care-cost-calculator/`로 연결한다.

```html
<section class="content-section pnc-test" data-pnc-test>
  <div id="pnc-question-list"></div>
  <div class="pnc-test-result" id="pnc-test-result" aria-live="polite">
    <p class="pnc-test-result__eyebrow">추천 결과</p>
    <strong id="pnc-result-title">질문에 답하면 추천이 표시됩니다</strong>
    <p id="pnc-result-copy"></p>
    <a href="/tools/postnatal-care-cost-calculator/" class="pnc-cta-button">총비용 계산하기</a>
  </div>
</section>
```

### 5-6. 비용 비교 요약

- H2: `비용은 어디서 가장 크게 갈리나`
- `PNC_COST_SUMMARY` 기반 3개 카드.
- 공식/참고/추정 배지 필수.
- 산후조리원 기본요금, 특실·마사지·보호자 식사 등 추가비 주의 문구를 포함한다.

### 5-7. 산후도우미 정부지원 구조

- H2: `산후도우미는 정부지원 후 실부담금이 핵심`
- 포함 내용:
  - 산모·신생아 건강관리 지원사업 명칭
  - 출산예정일 전 신청 가능 기간 안내
  - 바우처 유효기간 안내
  - 소득 구간, 출산 순위, 태아 유형별 차등
- CTA: `복지로 또는 거주지 보건소 기준 확인` 문구. 외부 링크는 구현 시 실제 공식 URL 검토 후 추가한다.

### 5-8. 상황별 추천 카드

- H2: `첫째·둘째·쌍태아 상황별 추천`
- `PNC_RECOMMENDATION_SCENARIOS`를 2열 카드로 배치한다.
- 카드에는 추천 유형 배지, 이유 2개, 주의점 1~2개를 표시한다.

### 5-9. 병행 시나리오

- H2: `조리원 2주만이 답은 아닙니다`
- `PNC_HYBRID_SCENARIOS` 기반 카드 3개.
- 비용 방향은 정확한 금액이 아니라 `높음`, `절충`, `절감 가능` 수준으로 표시한다.

### 5-10. 체크리스트

체크리스트는 정적 UI로 구현한다. 선택 상태 저장은 하지 않는다.

```ts
export const PNC_CHECKLIST = [
  "조리원 기본요금과 추가요금을 분리해서 확인했다",
  "보호자 식사, 마사지, 신생아 추가 케어 비용을 확인했다",
  "산후도우미 바우처 신청 가능 기간을 확인했다",
  "소득 구간과 예외지원 대상 여부를 확인했다",
  "도우미 제공기관의 교체 기준과 후기 기준을 확인했다",
  "배우자 육아휴직 또는 가족 지원 일정을 정했다",
  "퇴소 후 첫 1주일의 식사·청소·야간 돌봄 계획을 세웠다",
];
```

### 5-11. 관련 계산기 CTA

최소 3개를 노출한다.

- `/tools/postnatal-care-cost-calculator/` - 산후조리 총비용 계산기
- `/tools/birth-support-calculator/` - 출산지원금 계산기
- `/tools/parental-leave/` - 육아휴직 급여 계산기
- `/reports/postpartum-center-cost-2026/` - 산후조리원 비용 비교 리포트
- `/reports/baby-cost-guide-first-year/` - 신생아 1년 육아비용 리포트

---

## 6. JS 인터랙션 (`postnatal-care-comparison-2026.js`)

### 6-1. 상태

```js
const state = {
  answers: {},
  scores: {
    center: 0,
    helper: 0,
    hybrid: 0,
  },
};
```

### 6-2. 함수 목록

| 함수명 | 역할 |
|---|---|
| `initDecisionTest()` | 질문 렌더링 및 이벤트 바인딩 |
| `handleAnswer(questionId, answer)` | 답변 저장 후 점수 재계산 |
| `calculateScores()` | `PNC_DECISION_QUESTIONS` 기준 점수 합산 |
| `renderResult(resultType)` | 추천 결과 카드 갱신 |
| `initFaq()` | FAQ accordion |
| `initSmoothAnchor()` | CTA 앵커 이동 보조 |

### 6-3. 점수 계산 규칙

```js
function calculateScores(questions, answers) {
  const scores = { center: 0, helper: 0, hybrid: 0 };

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;

    const target = answer === "yes" ? question.yesCareType : question.noCareType;
    scores[target] += question.weight;
  });

  if (scores.hybrid >= Math.max(scores.center, scores.helper)) return "hybrid";
  return scores.center >= scores.helper ? "center" : "helper";
}
```

### 6-4. 결과 문구

```js
const RESULT_COPY = {
  center: {
    title: "산후조리원 우선 검토",
    copy: "초기 회복, 신생아 케어 교육, 산모 휴식 확보가 중요한 조건입니다. 2주 비용과 추가비를 먼저 확인하세요.",
  },
  helper: {
    title: "산후도우미 우선 검토",
    copy: "가정 동선 유지와 비용 절감이 중요한 조건입니다. 정부지원 대상 여부와 제공기관 매칭 품질을 확인하세요.",
  },
  hybrid: {
    title: "조리원 + 산후도우미 병행 검토",
    copy: "초기 회복과 퇴소 후 적응을 모두 고려해야 하는 조건입니다. 조리원 1주 + 도우미 2주 같은 절충안을 비교하세요.",
  },
};
```

### 6-5. 데이터 주입 방식

Astro 페이지에서 JSON script로 주입한다.

```astro
<script
  id="pnc-data"
  type="application/json"
  set:html={JSON.stringify({
    questions: PNC_DECISION_QUESTIONS,
    resultCopy: PNC_RESULT_COPY,
    faq: PNC_FAQ,
  })}
/>
<script src="/scripts/postnatal-care-comparison-2026.js" defer></script>
```

---

## 7. SCSS 설계 (`_postnatal-care-comparison-2026.scss`)

### 7-1. prefix

모든 페이지 전용 클래스는 `pnc-` prefix를 사용한다.

### 7-2. 주요 스타일

```scss
.pnc-page {
  --pnc-center: #2f6f9f;
  --pnc-helper: #2f8f6f;
  --pnc-hybrid: #9b6a2f;
  --pnc-warn: #b45309;
}

.pnc-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.pnc-kpi-card,
.pnc-cost-card,
.pnc-scenario-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  padding: 16px;
}

.pnc-badge {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.pnc-badge--공식 {
  background: #e6f4ea;
  color: #256d3f;
}

.pnc-badge--참고 {
  background: #eef4ff;
  color: #245c9f;
}

.pnc-badge--추정 {
  background: #fff4e5;
  color: #9a5a00;
}

.pnc-table-wrap {
  overflow-x: auto;
}

.pnc-compare-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    border-bottom: 1px solid var(--color-border);
    padding: 12px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: var(--color-surface-alt);
    font-weight: 700;
  }
}

.pnc-test {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
}

.pnc-question {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 14px;
}

.pnc-question__actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.pnc-choice {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font-weight: 700;
  cursor: pointer;

  &.is-active {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: #fff;
  }
}

.pnc-test-result {
  position: sticky;
  top: 16px;
  align-self: start;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 18px;
  background: var(--color-surface-alt);

  @media (max-width: 820px) {
    position: static;
  }
}

.pnc-scenario-grid,
.pnc-cost-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.pnc-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 14px;
    line-height: 1.6;
  }

  li::before {
    content: "✓";
    flex: 0 0 auto;
    color: var(--color-primary);
    font-weight: 700;
  }
}
```

---

## 8. 등록 작업

### 8-1. `src/data/reports.ts`

```ts
{
  slug: "postnatal-care-comparison-2026",
  title: "2026 산후도우미 vs 산후조리원 완전 비교",
  description: "산후조리원 2주 비용과 산후도우미 정부지원, 첫째·둘째·쌍태아 상황별 추천 기준을 비교합니다.",
  order: 0, // 실제 구현 시 기존 순서에 맞춰 조정
  badges: ["출산", "산후조리", "정부지원", "2026"],
}
```

### 8-2. `src/pages/reports/index.astro`

```ts
"postnatal-care-comparison-2026": {
  eyebrow: "산후조리 비교",
  tags: [
    { label: "산후도우미", mod: "life" },
    { label: "산후조리원", mod: "life" },
    { label: "정부지원", mod: "life" },
  ],
  category: "life",
  isNew: true,
},
```

### 8-3. `src/pages/index.astro`

```ts
"postnatal-care-comparison-2026": { category: "life", isNew: true },
```

### 8-4. `src/styles/app.scss`

```scss
@use 'scss/pages/postnatal-care-comparison-2026';
```

### 8-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/postnatal-care-comparison-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 9. SEO 설계

### 9-1. 메타

```txt
title: 2026 산후도우미 vs 산후조리원 비교 | 비용·정부지원·추천 기준 총정리
description: 산후조리원 2주 비용과 산후도우미 정부지원 바우처, 첫째·둘째·쌍태아 상황별 추천 기준을 2026년 기준으로 비교합니다.
ogTitle: 산후도우미 vs 산후조리원, 우리 집은 어느 쪽이 맞을까?
ogDescription: 비용, 정부지원, 회복 환경, 신생아 케어, 배우자 육아휴직 가능 여부까지 한 번에 비교합니다.
```

### 9-2. H 구조

- H1: `2026 산후도우미 vs 산후조리원 완전 비교`
- H2: `산후조리원과 산후도우미, 무엇이 다른가요?`
- H2: `우리 집은 어느 방식이 맞을까?`
- H2: `비용은 어디서 가장 크게 갈리나`
- H2: `산후도우미는 정부지원 후 실부담금이 핵심`
- H2: `첫째·둘째·쌍태아 상황별 추천`
- H2: `조리원 2주만이 답은 아닙니다`
- H2: `신청 전 체크리스트`
- H2: `산후조리 비용을 줄이는 방법`
- H2: `산후도우미·산후조리원 FAQ`

### 9-3. 내부 링크

- `/reports/postpartum-center-cost-2026/`
- `/tools/postnatal-care-cost-calculator/`
- `/tools/birth-support-calculator/`
- `/tools/parental-leave/`
- `/reports/baby-cost-guide-first-year/`
- `/reports/fetal-insurance-guide-2026/`

---

## 10. 구현 순서

1. `src/data/postnatalCareComparison2026.ts` 생성
2. `src/pages/reports/postnatal-care-comparison-2026.astro` 생성
3. `public/scripts/postnatal-care-comparison-2026.js` 생성
4. `src/styles/scss/pages/_postnatal-care-comparison-2026.scss` 생성
5. `src/styles/app.scss` import 추가
6. `src/data/reports.ts` 항목 추가
7. `src/pages/reports/index.astro`와 `src/pages/index.astro` 메타 추가
8. `public/sitemap.xml` URL 추가
9. `npm run build` 실행
10. 모바일 375px, 태블릿 768px, 데스크톱 1280px 레이아웃 확인

---

## 11. QA 체크리스트

### 데이터

- [ ] 모든 금액에 기준 기간이 표시되어 있다.
- [ ] 공식/참고/추정 배지가 누락되지 않았다.
- [ ] 산후도우미 지원금은 개인별 확정 금액처럼 표현하지 않았다.
- [ ] 산후조리원 추가비 항목을 별도 주의 문구로 표시했다.

### 화면

- [ ] Hero에서 페이지 목적이 3초 안에 이해된다.
- [ ] 핵심 비교표가 모바일에서 가로 스크롤로 깨지지 않는다.
- [ ] 30초 선택 테스트 결과가 `aria-live` 영역에 표시된다.
- [ ] 상황별 추천 카드가 첫째·둘째·쌍태아·배우자 지원 가능 케이스를 모두 포함한다.
- [ ] 관련 계산기 CTA가 3개 이상 있다.

### 스크립트

- [ ] 예/아니오 버튼 선택 상태가 명확하다.
- [ ] 모든 질문 미응답 상태에서도 기본 안내가 표시된다.
- [ ] 동점일 때 `hybrid` 우선 규칙이 의도대로 동작한다.
- [ ] FAQ accordion이 키보드로 조작 가능하다.

### 스타일

- [ ] 모든 전용 클래스가 `pnc-` prefix를 사용한다.
- [ ] 카드 안 텍스트가 375px 모바일에서 넘치지 않는다.
- [ ] sticky 결과 카드가 모바일에서 일반 블록으로 전환된다.
- [ ] 표의 `min-width`와 `overflow-x`가 적용되어 레이아웃이 깨지지 않는다.

### 등록/빌드

- [ ] `src/data/reports.ts`에 slug가 등록되었다.
- [ ] `src/styles/app.scss`에 SCSS import가 추가되었다.
- [ ] `public/sitemap.xml`에 URL이 추가되었다.
- [ ] `npm run build`가 성공한다.
