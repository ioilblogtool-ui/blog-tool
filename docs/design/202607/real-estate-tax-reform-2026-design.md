# 설계 문서
## 2026 부동산 세제개편 검토안 정리

> 기획 원본: `docs/plan/202607/real-estate-tax-reform-2026-scenario-plan.md` (§6)
> 신규 구현 페이지: `/reports/real-estate-tax-reform-2026/`
> 설계 목적: 기획재정부가 2026-08월 말 발표 예고한 부동산 세제개편안을, 확정 전 "검토 단계"임을 명확히 하면서 종부세 공정시장가액비율·장기보유특별공제·과세기준 전환 등 실제 논의 중인 항목만 정리하는 신규 리포트.
> 착수 범위: 이번 1차 착수는 이 리포트 1개만 진행한다. 계산기(매도 시점 비교 등)는 리포트 발행 후 별도 착수(기획서 §4-3, §5, §7 참고).

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `real-estate-tax-reform-2026` |
| 페이지 경로 | `src/pages/reports/real-estate-tax-reform-2026.astro` |
| 데이터 파일 | `src/data/realEstateTaxReform2026.ts` |
| SCSS | `src/styles/scss/pages/_real-estate-tax-reform-2026.scss` |
| SCSS prefix | `.rtr` |
| 스크립트 | 없음. MVP는 정적 리포트(선택 인터랙션 없음) |
| 콘텐츠 유형 | `/reports/` 시의성 정책 리포트 (`REPORT_CONTENT_GUIDE.md` 기준) |
| 홈 카테고리 | `tax` (세금) |
| 주요 CTA | `/tools/apartment-holding-tax/`, `/tools/capital-gains-tax-calculator/`, `/tools/real-estate-acquisition-tax/` |
| 등록 필요 | `src/data/reports.ts`, `src/pages/index.astro`(`reportMetaBySlug`), `public/sitemap.xml`, `src/styles/app.scss` |
| 빌드 확인 | 구현 후 `npm run build` 필수 |
| 갱신 트리거 | 8월 말 정부안 발표 시 이 페이지 데이터를 갱신 (§11 참고) — 새 slug 만들지 않고 기존 페이지 갱신 |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`기획재정부가 검토 중인 종부세 공정시장가액비율·장특공제·과세기준 개편 논의를 확정 전 검토 단계로 명확히 구분해 정리하고, 보유세·양도세·취득세 계산기로 연결하는 정책 추적 리포트`

### 1-2. 사용자가 얻는 것

- "2026 부동산 세제개편이 확정됐는지" 여부를 첫 화면에서 바로 확인 (아직 아님 — 검토 단계)
- 실제로 논의 중인 항목(공정시장가액비율, 장특공제, 과세기준, 인구감소지역 특례)만 정리된 표
- 입법 단계(정부 검토 중 → 정부안 발표 → 국회 제출 → 국회 통과 → 시행)를 타임라인으로 확인
- 유형별(1주택 실거주자 / 1주택 비거주자·다주택자 / 인구감소지역 매수자) 영향 방향을 대략 파악
- 확인 후 보유세·양도세·취득세 계산기로 이동해 현재 기준 세금을 계산

### 1-3. 피해야 할 것 (기획서 §2-2 표현 규칙 그대로 적용)

- "확정", "결정", "시행된다" 등 이미 확정된 것처럼 보이는 표현
- 검토되지 않은 세목(취득세율, 양도세율 자체)을 표에 포함해 정부안처럼 보이게 하는 것
- "다주택자는 무조건 불리하다" 같은 단정
- 구체적 세율·공제율 숫자를 확정 수치처럼 제시 (현재는 "60% → 80% 등" 같은 방향성만 보도됨, 특정 숫자로 단정하지 않음)
- 8월 말 이전에 이 페이지가 마치 정부 공식 발표를 대체하는 것처럼 보이는 톤

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const RTR_META = {
  slug: "real-estate-tax-reform-2026",
  title: "2026 부동산 세제개편 검토안 정리",
  description:
    "기획재정부가 검토 중인 종부세 공정시장가액비율 인상, 장기보유특별공제 개편 논의를 정리합니다. 8월 말 정부안 발표 전 검토 단계 기준입니다.",
  seoTitle: "2026 부동산 세제개편 검토안 정리 | 종부세·보유세 뭐가 바뀌나",
  seoDescription:
    "기획재정부가 검토 중인 종부세 공정시장가액비율 인상, 장기보유특별공제 개편 내용을 정리했습니다. 8월 말 정부안 발표 전 검토 단계 기준이며 확정 아닙니다. 보유세 계산기로 바로 연결됩니다.",
  updatedAt: "2026-07-20",
  policyStatus: "GOVERNMENT_REVIEW" as const,
  policyStatusLabel: "정부 검토 중",
  nextMilestone: "2026년 8월 말 기획재정부 세제개편안 발표 예정",
  dataNote:
    "이 리포트는 2026년 7월 기준 언론 보도와 기획재정부 부동산 세제 국민 의견 경청 토론회(2026-07-16) 내용을 바탕으로 정리한 검토 단계 자료입니다. 8월 말 정부안이 발표되면 실제 내용과 다를 수 있습니다.",
};
```

CLAUDE.md 리포트 타이틀 공식(`{주제} {연도} 완전 정리 | {핵심 궁금증}`)을 적용하되, 아직 확정이 아니므로 "완전 정리" 대신 "검토안 정리"를 사용한다.

### 2-2. H1 및 Hero

```astro
<CalculatorHero
  eyebrow="부동산 세금 리포트"
  title={RTR_META.title}
  description="종부세 공정시장가액비율, 장기보유특별공제 개편이 검토되고 있습니다. 아직 확정 아닌 검토 단계 기준으로 정리했습니다."
  badges={["정부 검토 중", "8월 말 발표 예정", "종부세", "장특공제"]}
/>
```

### 2-3. H2 구조 (검색 의도 순서)

1. `2026 부동산 세제개편, 아직 확정되지 않았습니다`
2. `지금까지 나온 이야기 — 무엇이 검토되고 있나`
3. `현행 vs 검토 중인 방향 비교`
4. `유형별로 어떻게 달라질 수 있나`
5. `발표 타임라인 — 정부 검토 중 → 8월 말 정부안 → 국회`
6. `내 세금은 지금 기준으로 먼저 계산해보세요`
7. `2026 부동산 세제개편 FAQ`

### 2-4. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 2026 부동산 세제개편 | title, H1, 첫 H2, FAQ |
| 종부세 개편 | Hero description, 비교표 |
| 공정시장가액비율 | 비교표, 설명 카드, FAQ |
| 장기보유특별공제 개편 | 비교표, 설명 카드, FAQ |
| 종부세 과세기준 | 비교표, 설명 카드 |
| 부동산 세제개편 발표일 | 타임라인 섹션, FAQ |
| 다주택자 세금 개편 | 유형별 영향 섹션 |
| 1주택자 종부세 | 유형별 영향 섹션, FAQ |

---

## 3. 데이터 파일 설계

파일: `src/data/realEstateTaxReform2026.ts`

### 3-1. 상수 구조

```ts
export const RTR_META = { ... };                 // §2-1
export const RTR_TIMELINE: TimelineStep[] = [ ... ];
export const RTR_REVIEW_ITEMS: ReviewItem[] = [ ... ];
export const RTR_IMPACT_BY_TYPE: ImpactCard[] = [ ... ];
export const RTR_EXPLAINERS: ExplainerCard[] = [ ... ];
export const RTR_FAQ: FaqItem[] = [ ... ];
export const RTR_RELATED_LINKS: RelatedLink[] = [ ... ];
export const RTR_SOURCE_LINKS: SourceLink[] = [ ... ];
```

### 3-2. 타임라인 타입

```ts
export type PolicyStatus =
  | "RUMOR"
  | "GOVERNMENT_REVIEW"
  | "GOVERNMENT_ANNOUNCED"
  | "BILL_SUBMITTED"
  | "ASSEMBLY_PASSED"
  | "EFFECTIVE";

export type TimelineStep = {
  status: PolicyStatus;
  label: string;
  dateLabel: string;
  isCurrent: boolean;
  isDone: boolean;
};
```

데이터 (2026-07-20 기준 — `isCurrent`/`isDone`은 8월 말 발표 후 갱신 대상):

```ts
export const RTR_TIMELINE: TimelineStep[] = [
  { status: "GOVERNMENT_REVIEW", label: "정부 검토 중", dateLabel: "2026년 7월", isCurrent: true, isDone: false },
  { status: "GOVERNMENT_ANNOUNCED", label: "정부안 발표", dateLabel: "2026년 8월 말 예정", isCurrent: false, isDone: false },
  { status: "BILL_SUBMITTED", label: "국회 제출", dateLabel: "발표 이후", isCurrent: false, isDone: false },
  { status: "ASSEMBLY_PASSED", label: "국회 통과", dateLabel: "미정", isCurrent: false, isDone: false },
  { status: "EFFECTIVE", label: "시행", dateLabel: "미정", isCurrent: false, isDone: false },
];
```

### 3-3. 검토 항목 비교 타입 (기획서 §6-3 그대로 반영)

```ts
export type ReviewItem = {
  id: string;
  category: string;
  current: string;
  reviewDirection: string;
  affectedGroup: string;
  confidence: "보도 확인" | "전문가 논의";
  sourceLabel: string;
  sourceUrl: string;
};
```

데이터:

```ts
export const RTR_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "fair-market-ratio",
    category: "종부세 공정시장가액비율",
    current: "60%",
    reviewDirection: "단계적으로 80% 등으로 인상하는 방향 검토",
    affectedGroup: "다주택자·비거주 보유자 (실거주 1주택자는 상대적으로 보호하는 방향 거론)",
    confidence: "보도 확인",
    sourceLabel: "뉴스핌 (2026-06-23)",
    sourceUrl: "https://www.newspim.com/news/view/20260623000789",
  },
  {
    id: "tax-base-standard",
    category: "종부세 과세기준",
    current: "주택 수 중심",
    reviewDirection: "\"보유가액\" 중심으로 전환하는 방안에 전문가 공감대 형성 (7/16 토론회)",
    affectedGroup: "저가주택 다수 보유자 vs 고가주택 소수 보유자 간 형평 이슈",
    confidence: "전문가 논의",
    sourceLabel: "기획재정부 부동산 세제 국민 의견 경청 토론회 (2026-07-16) 보도",
    sourceUrl: "https://www.newspim.com/news/view/20260720000674",
  },
  {
    id: "long-term-deduction",
    category: "장기보유특별공제",
    current: "보유기간 공제 + 거주기간 공제",
    reviewDirection: "단순 보유기간 공제는 축소, 실거주기간 공제는 유지하는 방향 검토",
    affectedGroup: "비거주 장기보유 고가주택자",
    confidence: "보도 확인",
    sourceLabel: "뉴스핌 (2026-07-15)",
    sourceUrl: "https://www.newspim.com/news/view/20260715000949",
  },
  {
    id: "population-decline-area",
    category: "인구감소지역 특례 대상 주택가액",
    current: "현행 기준",
    reviewDirection: "수도권 4억 원, 비수도권 9억 원으로 상향 검토",
    affectedGroup: "인구감소지역 주택 매수자",
    confidence: "보도 확인",
    sourceLabel: "관련 보도 (2026-07)",
    sourceUrl: "https://www.newspim.com/news/view/20260720000674",
  },
];
```

> 취득세율·양도세율 자체는 이번 조사에서 구체적 검토 근거가 확인되지 않아 목록에서 제외했다(기획서 §6-3 원칙). 8월 말 발표 후 재확인해 추가한다.

### 3-4. 유형별 영향 카드

```ts
export type ImpactCard = {
  id: string;
  title: string;
  direction: "완화 가능" | "부담 증가 가능" | "혜택 확대 검토";
  summary: string;
};
```

데이터:

```ts
export const RTR_IMPACT_BY_TYPE: ImpactCard[] = [
  {
    id: "one-house-resident",
    title: "1주택 실거주자",
    direction: "완화 가능",
    summary: "공정시장가액비율 인상이 검토되지만, 실거주 1주택자는 상대적으로 보호하는 방향이 함께 거론됩니다. 다만 구체적 공제 폭은 8월 말 정부안을 확인해야 합니다.",
  },
  {
    id: "one-house-non-resident",
    title: "1주택 비거주자",
    direction: "부담 증가 가능",
    summary: "장기보유특별공제 중 단순 보유기간 공제 축소가 검토되고 있어, 실거주하지 않고 장기 보유만 한 경우 공제 혜택이 줄어들 가능성이 있습니다.",
  },
  {
    id: "multi-house",
    title: "다주택자",
    direction: "부담 증가 가능",
    summary: "공정시장가액비율 인상과 과세기준의 \"보유가액\" 전환 논의 모두 다주택자에게 상대적으로 불리한 방향으로 거론되고 있습니다. 다만 최종 설계는 확정되지 않았습니다.",
  },
  {
    id: "population-decline-buyer",
    title: "인구감소지역 매수 예정자",
    direction: "혜택 확대 검토",
    summary: "특례 대상 주택가액 기준이 상향되면(수도권 4억/비수도권 9억 검토) 더 많은 주택이 특례 대상에 포함될 수 있습니다.",
  },
];
```

### 3-5. 설명 카드 (개념 해설)

```ts
export type ExplainerCard = {
  id: string;
  question: string;
  answer: string;
};

export const RTR_EXPLAINERS: ExplainerCard[] = [
  {
    id: "fair-market-ratio-explainer",
    question: "공정시장가액비율이란?",
    answer:
      "종합부동산세 과세표준을 계산할 때 공시가격에서 공제금액을 뺀 금액에 곱하는 비율입니다. 이 비율이 오르면 공시가격이 그대로여도 과세표준과 세액이 늘어납니다. 현재 60% 수준이며, 세율 자체를 올리는 것보다 이 비율을 조정하는 방식이 시행령 개정만으로 가능해 정책적으로 자주 활용됩니다.",
  },
  {
    id: "tax-base-explainer",
    question: "\"주택 수\" 기준과 \"보유가액\" 기준은 뭐가 다른가?",
    answer:
      "현재는 보유한 주택 수가 늘어나면 종부세 부담이 커지는 구조입니다. \"보유가액\" 중심으로 바뀌면 주택 수보다 전체 보유 부동산 가치를 기준으로 과세하게 되어, 지방 저가주택을 여러 채 가진 경우와 수도권 고가주택 한 채를 가진 경우의 형평성 문제를 다르게 다룰 수 있습니다. 아직 방향만 논의되는 단계입니다.",
  },
  {
    id: "long-term-deduction-explainer",
    question: "장기보유특별공제는 왜 개편이 거론되나?",
    answer:
      "현재는 오래 보유하기만 해도 공제를 받을 수 있어, 실거주 없이 장기 보유한 고가주택도 상당한 공제를 받는 경우가 있었습니다. 개편 논의는 이 중 실거주 요건이 없는 단순 보유기간 공제를 줄이고, 실제 거주한 기간에 대한 공제는 유지하는 방향입니다.",
  },
];
```

### 3-6. FAQ / 관련 링크 / 출처

```ts
export type FaqItem = { question: string; answer: string };
export type RelatedLink = { label: string; href: string; desc: string };
export type SourceLink = { label: string; url: string; note?: string };
```

내용은 §7, §8 참고.

---

## 4. 페이지 IA 설계

### 4-1. 전체 섹션 순서

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page rtr-page">
    [CalculatorHero]
    [InfoNotice]                  // 검토 단계 고지 + dataNote
    .rtr-status-section           // 신규: 정부 검토 중 배지 + 다음 일정
    .rtr-timeline-section         // 신규: 5단계 타임라인
    .rtr-compare-section          // 신규: 현행 vs 검토 방향 비교표
    .rtr-explainer-section        // 신규: 개념 설명 카드 3개
    .rtr-impact-section           // 신규: 유형별 영향 카드 4개
    .rtr-cta-section              // 신규: 계산기 3개 연결 카드
    [SeoContent]                  // FAQ + 관련 리포트/계산기
  </main>
```

### 4-2. 첫 화면 설계

Hero 직후 "아직 확정 아님"을 가장 먼저 명확히 한다.

```astro
<InfoNotice
  title="검토 단계 안내"
  lines={[
    RTR_META.dataNote,
    `현재 단계: ${RTR_META.policyStatusLabel} · ${RTR_META.nextMilestone}`,
  ]}
/>

<section class="content-section rtr-status-section" aria-labelledby="rtr-status-title">
  <div class="rtr-status-card">
    <span class="rtr-status-badge" data-status={RTR_META.policyStatus}>
      {RTR_META.policyStatusLabel}
    </span>
    <h2 id="rtr-status-title">2026 부동산 세제개편은 아직 확정되지 않았습니다</h2>
    <p>{RTR_META.nextMilestone}. 이 페이지는 그 전까지 나온 논의만 정리한 검토 단계 자료입니다.</p>
  </div>
</section>
```

### 4-3. 타임라인 섹션

```astro
<section class="content-section rtr-timeline-section" aria-labelledby="rtr-timeline-title">
  <div class="rtr-section-heading">
    <p>진행 단계</p>
    <h2 id="rtr-timeline-title">정부 검토 중 → 8월 말 정부안 → 국회</h2>
  </div>
  <ol class="rtr-timeline">
    {RTR_TIMELINE.map((step) => (
      <li
        class:list={[
          "rtr-timeline-step",
          step.isCurrent && "rtr-timeline-step--current",
          step.isDone && "rtr-timeline-step--done",
        ]}
      >
        <span class="rtr-timeline-dot" aria-hidden="true"></span>
        <strong>{step.label}</strong>
        <span>{step.dateLabel}</span>
      </li>
    ))}
  </ol>
</section>
```

가로 스텝퍼는 모바일에서 세로 리스트로 전환한다(§5-2).

### 4-4. 비교표 섹션 (핵심 섹션)

```astro
<section class="content-section rtr-compare-section" aria-labelledby="rtr-compare-title">
  <div class="rtr-section-heading">
    <p>무엇이 검토되고 있나</p>
    <h2 id="rtr-compare-title">현행 vs 검토 중인 방향</h2>
    <span>확정 수치가 아니라 언론 보도·토론회에서 거론된 방향입니다.</span>
  </div>
  <div class="table-wrap rtr-table-wrap">
    <table class="rtr-compare-table">
      <caption class="sr-only">2026 부동산 세제개편 검토 항목 비교표</caption>
      <thead>
        <tr>
          <th>항목</th>
          <th>현행</th>
          <th>검토 중인 방향</th>
          <th>영향 대상</th>
          <th>근거</th>
        </tr>
      </thead>
      <tbody>
        {RTR_REVIEW_ITEMS.map((item) => (
          <tr>
            <td><strong>{item.category}</strong></td>
            <td>{item.current}</td>
            <td>{item.reviewDirection}</td>
            <td>{item.affectedGroup}</td>
            <td>
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                {item.sourceLabel}
              </a>
              <span class="rtr-confidence-badge">{item.confidence}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 4-5. 개념 설명 섹션

```astro
<section class="content-section rtr-explainer-section" aria-labelledby="rtr-explainer-title">
  <div class="rtr-section-heading">
    <p>용어가 낯설다면</p>
    <h2 id="rtr-explainer-title">공정시장가액비율·장특공제, 쉽게 설명하면</h2>
  </div>
  <div class="rtr-explainer-grid">
    {RTR_EXPLAINERS.map((item) => (
      <article class="rtr-explainer-card">
        <h3>{item.question}</h3>
        <p>{item.answer}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-6. 유형별 영향 섹션

```astro
<section class="content-section rtr-impact-section" aria-labelledby="rtr-impact-title">
  <div class="rtr-section-heading">
    <p>나는 어디에 해당하나</p>
    <h2 id="rtr-impact-title">유형별로 어떻게 달라질 수 있나</h2>
  </div>
  <div class="rtr-impact-grid">
    {RTR_IMPACT_BY_TYPE.map((card) => (
      <article class="rtr-impact-card" data-direction={card.direction}>
        <span class="rtr-impact-direction">{card.direction}</span>
        <h3>{card.title}</h3>
        <p>{card.summary}</p>
      </article>
    ))}
  </div>
</section>
```

`data-direction` 값에 따라 배지 색만 다르게 하고(§5-3), 방향을 확정처럼 보이지 않도록 카드 문구는 항상 "가능"·"검토" 어미를 유지한다.

### 4-7. 계산기 연결 CTA 섹션

```astro
<section class="content-section rtr-cta-section" aria-labelledby="rtr-cta-title">
  <div class="rtr-section-heading">
    <p>지금 기준으로 먼저 확인</p>
    <h2 id="rtr-cta-title">내 세금은 현재 기준으로 미리 계산해보세요</h2>
    <span>개편안이 확정되기 전까지는 현재 제도가 그대로 적용됩니다.</span>
  </div>
  <div class="rtr-cta-grid">
    <a class="rtr-cta-card" href="/tools/apartment-holding-tax/">
      <strong>아파트 보유세 계산기</strong>
      <p>공정시장가액비율을 직접 조정해 재산세·종부세를 계산합니다.</p>
    </a>
    <a class="rtr-cta-card" href="/tools/capital-gains-tax-calculator/">
      <strong>양도소득세 계산기</strong>
      <p>장기보유특별공제를 반영한 양도세를 계산합니다.</p>
    </a>
    <a class="rtr-cta-card" href="/tools/real-estate-acquisition-tax/">
      <strong>부동산 취득세 계산기</strong>
      <p>매수 시 취득세를 미리 계산합니다.</p>
    </a>
  </div>
</section>
```

### 4-8. SeoContent 연결

```astro
<SeoContent
  introTitle="2026 부동산 세제개편, 지금까지 나온 이야기"
  intro={[
    "기획재정부는 2026년 8월 말 부동산 세제개편안을 발표할 예정입니다. 그 전까지는 종부세 공정시장가액비율, 장기보유특별공제, 과세기준 전환 등이 검토·논의 단계에 있습니다.",
    "이 페이지는 확정된 정부안이 아니라 언론 보도와 토론회에서 나온 방향을 정리한 자료이며, 8월 말 발표 이후 실제 내용으로 갱신됩니다.",
  ]}
  criteria={RTR_REVIEW_ITEMS.map((item) => `${item.category}: ${item.reviewDirection}`)}
  faq={RTR_FAQ}
  related={RTR_RELATED_LINKS}
/>
```

---

## 5. SCSS 설계

파일: `src/styles/scss/pages/_real-estate-tax-reform-2026.scss`, 전부 `.rtr-` prefix.

### 5-1. 추가 클래스 목록

```scss
.rtr-status-section
.rtr-status-card
.rtr-status-badge
.rtr-timeline-section
.rtr-timeline
.rtr-timeline-step
.rtr-timeline-step--current
.rtr-timeline-step--done
.rtr-timeline-dot
.rtr-compare-section
.rtr-table-wrap
.rtr-compare-table
.rtr-confidence-badge
.rtr-explainer-section
.rtr-explainer-grid
.rtr-explainer-card
.rtr-impact-section
.rtr-impact-grid
.rtr-impact-card
.rtr-impact-direction
.rtr-cta-section
.rtr-cta-grid
.rtr-cta-card
```

### 5-2. 타임라인 반응형

데스크톱은 가로 스텝퍼, 모바일은 세로 리스트로 전환한다.

```scss
.rtr-timeline {
  display: flex;
  gap: 12px;
  list-style: none;
  padding: 0;
}

.rtr-timeline-step {
  flex: 1;
  text-align: center;
  border-top: 3px solid #dde3f0;
  padding-top: 12px;

  &--current {
    border-top-color: #1a56db;

    .rtr-status-badge,
    strong {
      color: #1a56db;
    }
  }

  &--done {
    border-top-color: #16a34a;
  }
}

@media (max-width: 720px) {
  .rtr-timeline {
    flex-direction: column;
    gap: 0;
  }

  .rtr-timeline-step {
    text-align: left;
    border-top: none;
    border-left: 3px solid #dde3f0;
    padding: 8px 0 8px 14px;

    &--current {
      border-left-color: #1a56db;
    }

    &--done {
      border-left-color: #16a34a;
    }
  }
}
```

### 5-3. 상태·방향 배지

디자인 시스템의 파랑 계열을 기본으로 하고, 방향 배지만 의미색을 최소한으로 사용한다(과채도 금지 — `docs/UI_ARCHITECTURE.md` 기준).

```scss
.rtr-status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eaf1ff;
  color: #1a56db;
  font-weight: 600;
  font-size: 13px;
}

.rtr-impact-card {
  border: 1px solid #dde3f0;
  border-radius: 8px;
  padding: 16px;

  &[data-direction="완화 가능"] .rtr-impact-direction {
    color: #16a34a;
  }

  &[data-direction="부담 증가 가능"] .rtr-impact-direction {
    color: #dc2626;
  }

  &[data-direction="혜택 확대 검토"] .rtr-impact-direction {
    color: #1a56db;
  }
}
```

### 5-4. 그리드 규칙

```scss
.rtr-explainer-grid,
.rtr-impact-grid,
.rtr-cta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .rtr-explainer-grid,
  .rtr-impact-grid,
  .rtr-cta-grid {
    grid-template-columns: 1fr;
  }
}
```

### 5-5. 표 모바일 처리

```scss
.rtr-table-wrap {
  overflow-x: auto;
}

.rtr-compare-table {
  min-width: 720px;
}

.rtr-confidence-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #f1f4fa;
  font-size: 11px;
  color: #5b6472;
}
```

---

## 6. 접근성 및 구조화 데이터

### 6-1. HTML 구조

- 각 `section`은 `aria-labelledby`.
- 비교표에 `caption`(시각적으로는 `sr-only`) 포함.
- 타임라인 `<ol>`로 순서 있는 목록 처리, 현재 단계는 텍스트로도 "(현재 단계)"를 스크린리더용으로 별도 표기 검토.
- 외부 출처 링크는 `target="_blank" rel="noopener noreferrer"`.

### 6-2. JSON-LD

`property-tax-payment-2026.astro` 패턴을 그대로 따른다: `Article` + `FAQPage` + `BreadcrumbList`.

```ts
{
  "@context": "https://schema.org",
  "@type": "Article",
  headline: RTR_META.title,
  description: RTR_META.description,
  dateModified: RTR_META.updatedAt,   // "2026-07-20" — ISO 날짜 유지
  mainEntityOfPage: reportUrl,
  author: { "@type": "Organization", name: "비교계산소" },
}
```

`Article`에는 가능하면 `about` 또는 `keywords`에 "종합부동산세", "공정시장가액비율"을 추가해도 좋다(선택).

### 6-3. FAQPage

`RTR_FAQ` 배열을 화면과 JSON-LD가 공유하는 단일 출처로 유지한다.

---

## 7. FAQ 데이터 설계

```ts
export const RTR_FAQ: FaqItem[] = [
  {
    question: "2026 부동산 세제개편은 확정된 건가요?",
    answer:
      "아니요. 2026년 7월 기준으로는 기획재정부가 세제개편안 발표를 예고했을 뿐 확정된 내용은 없습니다. 정부안은 2026년 8월 말 발표될 예정이며, 이후 국회 제출과 통과 절차를 거쳐야 실제 시행됩니다.",
  },
  {
    question: "공정시장가액비율이 오르면 내 보유세는 얼마나 오르나요?",
    answer:
      "공정시장가액비율이 60%에서 오르면 같은 공시가격이어도 종합부동산세 과세표준이 커져 세액이 늘어날 수 있습니다. 정확한 인상 폭은 아직 확정되지 않았으므로, 아파트 보유세 계산기에서 비율을 직접 바꿔가며 현재 기준으로 먼저 확인하는 것을 권장합니다.",
  },
  {
    question: "1주택 실거주자도 세금이 오르나요?",
    answer:
      "논의되는 방향은 실거주 1주택자를 상대적으로 보호하는 쪽입니다. 다만 공정시장가액비율 자체가 오르면 1주택자도 영향을 받을 수 있어, 구체적인 공제 설계는 8월 말 정부안을 확인해야 합니다.",
  },
  {
    question: "장기보유특별공제는 어떻게 바뀌나요?",
    answer:
      "실거주하지 않고 보유만 한 기간에 대한 공제(단순 보유기간 공제)는 축소하고, 실제 거주한 기간에 대한 공제는 유지하는 방향이 거론되고 있습니다. 즉 같은 보유기간이어도 실거주 여부에 따라 공제 차이가 커질 가능성이 있습니다.",
  },
  {
    question: "이 내용은 언제 확정되나요?",
    answer:
      "2026년 8월 말 기획재정부 세제개편안 발표 → 국회 제출 → 국회 통과의 절차를 거칩니다. 이 페이지는 각 단계가 진행될 때마다 갱신할 예정입니다.",
  },
  {
    question: "다주택자는 이번 개편으로 무조건 불리해지나요?",
    answer:
      "공정시장가액비율 인상과 과세기준 전환 논의 모두 다주택자에게 상대적으로 부담이 커지는 방향으로 거론되고 있지만, 최종 설계가 확정되지 않아 \"무조건\" 불리하다고 단정할 수는 없습니다. 8월 말 정부안을 확인해야 합니다.",
  },
];
```

---

## 8. 내부 링크 및 CTA 설계

### 8-1. 관련 링크 데이터

```ts
export const RTR_RELATED_LINKS: RelatedLink[] = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공정시장가액비율을 직접 조정해 재산세·종부세를 계산합니다.",
  },
  {
    label: "양도소득세 계산기",
    href: "/tools/capital-gains-tax-calculator/",
    desc: "장기보유특별공제를 반영한 양도세를 계산합니다.",
  },
  {
    label: "부동산 취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    desc: "매수 시 취득세를 미리 계산합니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "취득세·보유세·양도세 구조를 단계별로 정리한 심층 리포트입니다.",
  },
  {
    label: "2026 재산세 납부기간 총정리",
    href: "/reports/property-tax-payment-2026/",
    desc: "재산세 납부 일정과 6월 1일 과세기준일을 확인합니다.",
  },
];
```

### 8-2. CTA 배치

| 위치 | CTA | 목적 |
|---|---|---|
| 비교표 직후 | 유형별 영향 섹션으로 스크롤 유도 | 체류 시간 |
| 유형별 영향 섹션 직후 | `rtr-cta-section` 계산기 3종 | 계산기 전환 |
| SeoContent related | 관련 리포트 2개 + 계산기 3개 | 회유율 |

---

## 9. 구현 순서

### 9-1. 데이터 파일 작성

파일: `src/data/realEstateTaxReform2026.ts` (신규)

1. 타입 정의 (`PolicyStatus`, `TimelineStep`, `ReviewItem`, `ImpactCard`, `ExplainerCard`, `FaqItem`, `RelatedLink`, `SourceLink`)
2. `RTR_META` (§3-1)
3. `RTR_TIMELINE` 5단계 (§3-2)
4. `RTR_REVIEW_ITEMS` 4개 (§3-3)
5. `RTR_IMPACT_BY_TYPE` 4개 (§3-4)
6. `RTR_EXPLAINERS` 3개 (§3-5)
7. `RTR_FAQ` 6개 (§7)
8. `RTR_RELATED_LINKS` 5개 (§8-1)
9. `RTR_SOURCE_LINKS` — §2-1-1 출처 4개를 그대로 배열화

### 9-2. Astro 페이지 작성

파일: `src/pages/reports/real-estate-tax-reform-2026.astro` (신규)

1. `property-tax-payment-2026.astro`를 템플릿으로 복사해 시작
2. import 교체 (§3-1 데이터)
3. JSON-LD 3종 구성 (§6-2)
4. Hero (§4-2)
5. InfoNotice (§4-2)
6. `rtr-status-section` (§4-2)
7. `rtr-timeline-section` (§4-3)
8. `rtr-compare-section` (§4-4)
9. `rtr-explainer-section` (§4-5)
10. `rtr-impact-section` (§4-6)
11. `rtr-cta-section` (§4-7)
12. `SeoContent` (§4-8)

### 9-3. SCSS 작성

파일: `src/styles/scss/pages/_real-estate-tax-reform-2026.scss` (신규)

1. §5-1 클래스 뼈대 작성
2. 타임라인 반응형 (§5-2)
3. 상태/방향 배지 (§5-3)
4. 3열 그리드 + 모바일 1열 (§5-4)
5. 표 가로 스크롤 (§5-5)
6. `src/styles/app.scss`에 `@use 'scss/pages/real-estate-tax-reform-2026';` 추가

### 9-4. 등록 파일 반영

- `src/data/reports.ts` — 신규 항목 추가 (title/description은 §2-1 `seoTitle`/`description` 기준, `order`는 현재 최대값 다음 순번, `badges: ["세금", "종부세", "2026"]` 등)
- `src/pages/index.astro`의 `reportMetaBySlug`에 `"real-estate-tax-reform-2026": { category: "tax", isNew: true }` 추가 — **누락 시 홈에서 "기타"로 표시되므로 필수** (`REPORT_CONTENT_GUIDE.md` 경고 항목)
- `public/sitemap.xml`에 `/reports/real-estate-tax-reform-2026/` 추가
- `src/pages/reports/index.astro`에서 정상 노출 확인

---

## 10. QA 체크리스트

### 콘텐츠

- [ ] 첫 화면(Hero + InfoNotice)에서 "아직 확정 아님"이 바로 보이는가?
- [ ] 비교표의 모든 행에 출처 링크가 걸려 있는가?
- [ ] 취득세·양도세 세율처럼 근거 없는 항목이 표에 섞여있지 않은가?
- [ ] "확정", "반드시", "정부가 올린다" 같은 단정 표현이 없는가? (§1-3 재확인)
- [ ] 유형별 영향 카드 문구가 전부 "가능"·"검토" 어미로 끝나는가?
- [ ] FAQ가 화면에 실제로 보이는가(숨김 아님)?

### SEO

- [ ] title에 "2026 부동산 세제개편"이 포함되는가?
- [ ] H1이 "검토안 정리" 의도를 담는가(확정 리포트처럼 보이지 않는가)?
- [ ] meta description이 100~160자 내외인가?
- [ ] FAQPage JSON-LD와 화면 FAQ가 동일 데이터에서 나오는가?
- [ ] 내부 링크(계산기 3개 + 관련 리포트 2개)가 모두 연결되는가?

### UI

- [ ] 320px 모바일에서 타임라인이 세로 리스트로 자연스럽게 전환되는가?
- [ ] 비교표가 모바일에서 가로 스크롤로 읽히는가?
- [ ] 방향 배지(완화/부담 증가/혜택 확대) 색이 과채도 없이 은은한가?
- [ ] 외부 출처 링크가 새 창으로 열리고 `rel="noopener noreferrer"`가 걸려 있는가?

### 빌드

- [ ] `npm run build` 성공
- [ ] `dist/reports/real-estate-tax-reform-2026/index.html` 생성 확인
- [ ] 홈 리포트 섹션에서 "세금" 카테고리로 정상 노출(“기타” 아님) 확인
- [ ] sitemap에 트레일링 슬래시 포함해 정확히 반영 (`docs/GOOGLE_SEO_RULES.md` 기준)

---

## 11. 향후 확장 — 8월 말 발표 후 갱신 계획

새 slug를 만들지 않고 **같은 페이지를 갱신**한다(재산세 납부기간 리포트와 동일 원칙, §11-1).

발표 시 갱신 대상:

1. `RTR_META.policyStatus` → `"GOVERNMENT_ANNOUNCED"`, `policyStatusLabel` → `"정부안 발표"`
2. `RTR_TIMELINE` — `isCurrent`/`isDone` 갱신, `dateLabel`에 실제 발표일 반영
3. `RTR_REVIEW_ITEMS` — 확정 수치로 교체(예: "80% 등으로 인상 검토" → 실제 확정 비율), `confidence`를 `"보도 확인"`에서 `"정부안 확정"` 같은 새 값으로 확장 검토
4. 취득세·양도세 항목이 실제 포함되면 `RTR_REVIEW_ITEMS`에 행 추가
5. `RTR_META.updatedAt`, sitemap `lastmod` 갱신
6. 기획서(`docs/plan/202607/real-estate-tax-reform-2026-scenario-plan.md`) §5 매도 시점 비교 계산기 착수 여부 재검토 — 정부안이 구체적 시행 시점(예: 2027년 적용)을 포함한다면 "2026년 vs 2027년 매도" 계산기의 실효성이 커짐

국회 제출·통과·시행 단계도 동일한 방식으로 순차 갱신한다.

---

## 12. 최종 판단

이 리포트는 완전 신규 페이지지만 구현 난이도는 낮다 — 정적 리포트이며 클라이언트 스크립트가 필요 없고, 기존 `property-tax-payment-2026.astro` 구조를 그대로 재사용할 수 있다. 핵심은 콘텐츠 정확성과 표현 수위 관리(§1-3, §2-2)이며, 8월 말 정부안 발표 전까지는 "검토 단계" 톤을 유지하는 것이 정책 리포트의 신뢰도와 SEO 안정성(허위 정보 리스크 회피) 모두에 중요하다.

발표 이후 실제 트래픽이 발생할 가능성이 높은 시의성 콘텐츠이므로, 발표 전에 검토 단계 버전을 먼저 게시해 "2026 부동산 세제개편" 키워드를 선점하고, 발표 직후 빠르게 갱신하는 전략이 유효하다.
