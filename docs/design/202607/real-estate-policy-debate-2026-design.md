# 설계 문서
## 7·23 부동산정책 국민 대토론회 핵심 정리

> 기획 원본: `docs/plan/202607/real-estate-policy-debate-2026-plan.md`  
> 신규 구현 페이지: `/reports/real-estate-policy-debate-2026/`  
> 설계 목적: 2026년 7월 23일 부동산정책 국민 대토론회에서 논의된 공급·대출·세제 방향을 확정 정책이 아닌 "토론회 논의 단계"로 명확히 구분하고, 사용자가 자신의 유형별 체크 포인트를 빠르게 확인하게 하는 정책 해설형 리포트.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `real-estate-policy-debate-2026` |
| 페이지 경로 | `src/pages/reports/real-estate-policy-debate-2026.astro` |
| 데이터 파일 | `src/data/realEstatePolicyDebate2026.ts` |
| SCSS | `src/styles/scss/pages/_real-estate-policy-debate-2026.scss` |
| SCSS prefix | `.repd` |
| 스크립트 | 없음. MVP는 정적 리포트 |
| 콘텐츠 유형 | `/reports/` 정책 해설형 비교 리포트 |
| 홈 카테고리 | `estate` 우선. 세제 중심 노출을 강화하려면 `tax`도 가능하나, 토론회 전체 주제가 부동산 정책이므로 `estate` 권장 |
| 주요 CTA | `/tools/apartment-holding-tax/`, `/tools/capital-gains-tax-calculator/`, `/tools/real-estate-acquisition-tax/` |
| 등록 필요 | `src/data/reports.ts`, `src/pages/index.astro`, `src/pages/reports/index.astro`, `src/styles/app.scss`, `public/sitemap.xml` |
| 빌드 확인 | 구현 후 `npm run build` 필수 |
| 갱신 트리거 | 후속 정부 발표, 세제개편안 발표, 대출 규제 세부안 발표 시 같은 slug 갱신 |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`7·23 부동산정책 국민 대토론회를 공급·대출·세금 3축으로 정리하고, 실거주 1주택자·다주택자·갈아타기 수요별 체크 포인트로 바꿔주는 정책 해설 리포트`

### 1-2. 사용자가 얻는 것

- 이번 토론회가 확정 대책 발표가 아니라는 점을 첫 화면에서 확인
- 공급·대출·세금 중 어느 영역이 자신에게 관련 있는지 빠르게 파악
- 실거주 1주택자, 비거주 1주택자, 다주택자, 갈아타기 수요 등 유형별 영향 방향 확인
- 후속 발표 때 봐야 할 체크리스트 7개 확보
- 현재 기준 세금은 기존 보유세·양도세·취득세 계산기로 즉시 확인

### 1-3. 피해야 할 것

- 토론회 논의를 확정 정책처럼 표현
- "세금 폭탄", "집값 폭락", "무조건 완화" 같은 과장 문구
- 대출 완화가 투자 목적 추가 매수까지 확대되는 것처럼 보이는 표현
- 종부세·양도세·공제금액·시행일을 단정
- 특정 보유자에게 매도·매수 결정을 권하는 문장

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const REPD_META = {
  slug: "real-estate-policy-debate-2026",
  title: "7·23 부동산정책 국민 대토론회 핵심 정리",
  description:
    "2026년 7월 23일 부동산정책 국민 대토론회에서 논의된 공급·대출·세제 방향을 실거주 1주택자, 다주택자, 갈아타기 수요별로 정리합니다.",
  seoTitle:
    "7·23 부동산정책 국민 대토론회 핵심 정리 | 실거주 1주택자·다주택자 영향",
  seoDescription:
    "2026년 7월 23일 부동산정책 국민 대토론회에서 논의된 공급·대출·세제 방향을 정리했습니다. 실거주 1주택자, 다주택자, 갈아타기 수요별 영향을 확정안이 아닌 토론회 논의 단계 기준으로 확인하세요.",
  updatedAt: "2026-07-27",
  policyStatus: "PUBLIC_DEBATE" as const,
  policyStatusLabel: "토론회 논의 단계",
  dataNote:
    "이 리포트는 2026년 7월 23일 부동산정책 국민 대토론회와 관련 공식·언론 보도를 바탕으로 정리한 참고 자료입니다. 세율, 공제금액, 대출 한도, 시행일, 경과규정은 후속 정부 발표 전까지 확정되지 않았습니다.",
};
```

### 2-2. H1 및 Hero

```astro
<CalculatorHero
  eyebrow="부동산 정책 리포트"
  title={REPD_META.title}
  description="확정 대책이 아니라 공급·대출·세제 방향을 논의한 자리입니다. 대상별로 무엇을 확인해야 하는지 정리했습니다."
  badges={["2026-07-23", "확정안 아님", "세금·대출·공급", "대상별 영향"]}
/>
```

### 2-3. H2 구조

1. `이번 토론회는 확정 대책 발표가 아닙니다`
2. `공급·대출·세금, 세 축으로 보면 이해가 쉽습니다`
3. `분야별 핵심 논의 한눈에 보기`
4. `나는 어디에 해당하나 — 대상별 영향 진단`
5. `공급: 새 계획보다 실제 착공·입주`
6. `대출: 실수요는 보완, 우회 대출은 차단`
7. `세금: 몇 채인가보다 얼마짜리인가`
8. `확정 발표 때 체크할 7가지`
9. `현재 기준 세금은 계산기로 먼저 확인하세요`
10. `7·23 부동산정책 국민 대토론회 FAQ`

### 2-4. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 7·23 부동산정책 | title, H1, 첫 H2, FAQ |
| 부동산정책 국민 대토론회 | title, description, InfoNotice |
| 종부세 개편 | 세금 섹션, 체크리스트, FAQ |
| 실거주 1주택자 | 대상별 영향, FAQ |
| 다주택자 세금 | 대상별 영향, 관련 링크 |
| 갈아타기 대출 | 대출 섹션, FAQ |
| 장기보유특별공제 | 세금 섹션, 체크리스트 |
| 재건축 이주비 대출 | 대출 섹션, 체크리스트 |

---

## 3. 데이터 파일 설계

파일: `src/data/realEstatePolicyDebate2026.ts`

### 3-1. 상수 구조

```ts
export const REPD_META = { ... };
export const REPD_SUMMARY_CARDS: SummaryCard[] = [ ... ];
export const REPD_POLICY_AREAS: PolicyArea[] = [ ... ];
export const REPD_AUDIENCE_IMPACTS: AudienceImpact[] = [ ... ];
export const REPD_LOAN_GROUPS: LoanGroup[] = [ ... ];
export const REPD_TAX_EXAMPLES: TaxExample[] = [ ... ];
export const REPD_CHECKLIST: ChecklistItem[] = [ ... ];
export const REPD_FAQ: FaqItem[] = [ ... ];
export const REPD_RELATED_LINKS: RelatedLink[] = [ ... ];
export const REPD_SOURCE_LINKS: SourceLink[] = [ ... ];
```

### 3-2. 타입 정의

```ts
export type PolicyStatus = "PUBLIC_DEBATE" | "GOVERNMENT_REVIEW" | "GOVERNMENT_ANNOUNCED" | "EFFECTIVE";

export type SummaryCard = {
  id: string;
  title: string;
  value: string;
  description: string;
};

export type PolicyArea = {
  id: string;
  area: string;
  direction: string;
  impactLevel: "높음" | "중상" | "중간";
  status: "논의";
  note: string;
};

export type AudienceImpact = {
  id: string;
  audience: string;
  direction: "긍정 가능성" | "중립" | "소폭 긍정 가능성" | "부담 증가 가능성" | "혼재" | "부정 가능성";
  summary: string;
  checkPoint: string;
};

export type LoanGroup = {
  title: string;
  items: string[];
};

export type TaxExample = {
  holdingType: string;
  currentIssue: string;
  reviewPoint: string;
};

export type ChecklistItem = {
  label: string;
  detail: string;
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
  note?: string;
};
```

### 3-3. 요약 카드

```ts
export const REPD_SUMMARY_CARDS: SummaryCard[] = [
  {
    id: "supply",
    title: "공급",
    value: "실제 입주 속도",
    description: "새 공급 숫자보다 인허가·착공·준공 병목을 줄이는 방향입니다.",
  },
  {
    id: "loan",
    title: "대출",
    value: "실수요 보완",
    description: "갈아타기·이주비 등 실수요성 대출은 보완하되 우회 대출은 차단하는 흐름입니다.",
  },
  {
    id: "tax",
    title: "세금",
    value: "가액·거주 여부",
    description: "주택 수만 보기보다 전체 보유가액과 실제 거주 여부를 더 보자는 논의입니다.",
  },
];
```

### 3-4. 분야별 핵심 요약

```ts
export const REPD_POLICY_AREAS: PolicyArea[] = [
  {
    id: "housing-supply",
    area: "주택공급",
    direction: "기존 사업의 인허가·착공·준공 속도 개선",
    impactLevel: "높음",
    status: "논의",
    note: "새 공급 목표보다 실제 입주까지 이어지는 실행력이 핵심입니다.",
  },
  {
    id: "redevelopment",
    area: "재건축·재개발",
    direction: "전면 완화보다 공공성·순증 효과 검증",
    impactLevel: "중간",
    status: "논의",
    note: "사업별 공급 효과와 공공성에 따라 차등 접근할 가능성이 있습니다.",
  },
  {
    id: "housing-finance",
    area: "주택금융",
    direction: "실수요 대출 보완, 편법 대출 차단",
    impactLevel: "높음",
    status: "논의",
    note: "투자 목적 추가 매수의 DSR·LTV 완화로 해석하면 위험합니다.",
  },
  {
    id: "comprehensive-real-estate-tax",
    area: "종합부동산세",
    direction: "주택 수보다 보유주택 합산가액 중심 검토",
    impactLevel: "높음",
    status: "논의",
    note: "고가·비거주 보유와 지방 저가 다주택의 형평성 논의와 연결됩니다.",
  },
  {
    id: "capital-gains-tax",
    area: "양도소득세",
    direction: "비거주 장기보유 혜택 축소 가능성",
    impactLevel: "중상",
    status: "논의",
    note: "장기보유특별공제에서 실제 거주 기간의 의미가 더 커질 수 있습니다.",
  },
  {
    id: "resident-one-house",
    area: "실거주 1주택",
    direction: "급격한 세 부담 증가 방지 방향",
    impactLevel: "높음",
    status: "논의",
    note: "기본공제와 고령·장기보유 부담 완화 장치가 핵심 확인 대상입니다.",
  },
  {
    id: "rental-housing",
    area: "민간임대",
    direction: "장기 민간임대 공급자·금융체계 육성",
    impactLevel: "중간",
    status: "논의",
    note: "단순 임대료 지원보다 장기 공급자 육성 논의와 가깝습니다.",
  },
];
```

### 3-5. 대상별 영향 데이터

```ts
export const REPD_AUDIENCE_IMPACTS: AudienceImpact[] = [
  {
    id: "no-home-buyer",
    audience: "무주택 실수요자",
    direction: "긍정 가능성",
    summary: "정책대출·공급 보완 논의가 직접 관련됩니다.",
    checkPoint: "생애최초·청년·신혼부부 정책대출과 공공공급 세부안을 확인하세요.",
  },
  {
    id: "resident-one-house",
    audience: "일반 실거주 1주택자",
    direction: "중립",
    summary: "급격한 세 부담 증가는 제한적으로 보입니다.",
    checkPoint: "1세대 1주택 기본공제, 고령·장기보유 공제, 납부유예 유지 여부를 확인하세요.",
  },
  {
    id: "move-up-buyer",
    audience: "갈아타기 수요",
    direction: "소폭 긍정 가능성",
    summary: "일시적 2주택·처분조건부 대출 보완 가능성이 있습니다.",
    checkPoint: "처분기한, 대출 예외, 시행일 이전 계약의 경과규정을 확인하세요.",
  },
  {
    id: "expensive-one-house",
    audience: "초고가 1주택자",
    direction: "부담 증가 가능성",
    summary: "주택 수보다 보유가액 기준을 강화하면 영향이 커질 수 있습니다.",
    checkPoint: "고가 기준, 종부세 공제 한도, 장기보유특별공제 한도 논의를 확인하세요.",
  },
  {
    id: "non-resident-one-house",
    audience: "비거주 1주택자",
    direction: "부담 증가 가능성",
    summary: "실거주 없는 장기보유 혜택 축소 논의와 직접 연결됩니다.",
    checkPoint: "장기보유특별공제에서 보유기간 공제가 어떻게 조정되는지 확인하세요.",
  },
  {
    id: "local-low-price-two-house",
    audience: "지방 저가 2주택자",
    direction: "긍정 가능성",
    summary: "주택 수보다 합산가액을 보면 부담이 완화될 가능성이 있습니다.",
    checkPoint: "지방 저가주택의 주택 수 제외 기준과 합산가액 기준을 확인하세요.",
  },
  {
    id: "capital-area-multi-house",
    audience: "수도권 다주택자",
    direction: "부담 증가 가능성",
    summary: "세제·금융 부담이 유지되거나 강화될 가능성이 큽니다.",
    checkPoint: "종부세 기준, DSR·LTV, 사업자대출 우회 차단 규정을 함께 확인하세요.",
  },
  {
    id: "redevelopment-owner",
    audience: "재건축 보유자",
    direction: "혼재",
    summary: "사업별 공공성·순증 물량·이주비 대출에 따라 달라질 수 있습니다.",
    checkPoint: "공공분양 비율, 임대주택 확보, 사업기간 단축, 이주비 대출 한도를 확인하세요.",
  },
  {
    id: "gap-investor",
    audience: "갭투자자",
    direction: "부정 가능성",
    summary: "전세대출·사업자대출을 활용한 우회 매수 차단 논의가 있습니다.",
    checkPoint: "보증부 전세대출, 사업자대출, 생활안정자금 대출의 사용 제한을 확인하세요.",
  },
];
```

### 3-6. 대출·세금·체크리스트 데이터

```ts
export const REPD_LOAN_GROUPS: LoanGroup[] = [
  {
    title: "보완 논의",
    items: [
      "생애최초·청년·신혼부부 주택구입자금",
      "재건축·재개발 조합원 이주비 대출",
      "일시적 2주택·처분조건부 대출",
      "정상적인 임대주택 사업자금",
    ],
  },
  {
    title: "차단 논의",
    items: [
      "사업자대출을 통한 주택 매입",
      "법인·특수목적법인을 통한 우회 매입",
      "생활안정자금 대출의 투자 전용",
      "보증부 전세대출을 활용한 갭투자",
    ],
  },
];

export const REPD_TAX_EXAMPLES: TaxExample[] = [
  {
    holdingType: "지방 저가주택 2채",
    currentIssue: "다주택자로 묶일 수 있음",
    reviewPoint: "합산가액 기준이면 부담 완화 가능성",
  },
  {
    holdingType: "서울 초고가주택 1채",
    currentIssue: "1주택 혜택 가능",
    reviewPoint: "고가 기준이면 부담 확대 가능성",
  },
  {
    holdingType: "실거주 중가 1주택",
    currentIssue: "장기보유·고령자 부담 우려",
    reviewPoint: "공제·납부유예 유지 여부",
  },
  {
    holdingType: "비거주 고가 1주택",
    currentIssue: "실거주 없이 세제 혜택",
    reviewPoint: "장특공제·종부세 혜택 축소 여부",
  },
];

export const REPD_CHECKLIST: ChecklistItem[] = [
  { label: "종부세 기준", detail: "주택 수 기준에서 합산가액 기준으로 바뀌는지" },
  { label: "1주택 기본공제", detail: "1세대 1주택 기본공제 금액이 유지되는지" },
  { label: "장특공제", detail: "비거주 보유기간 공제가 축소되는지" },
  { label: "갈아타기 대출", detail: "일시적 2주택·처분조건부 대출 예외가 확대되는지" },
  { label: "지방 저가주택", detail: "주택 수 제외 기준이 변경되는지" },
  { label: "재건축 이주비", detail: "재건축·재개발 이주비 대출 한도가 완화되는지" },
  { label: "경과규정", detail: "시행일 이전 계약에 경과규정이 적용되는지" },
];
```

---

## 4. 페이지 IA 설계

### 4-1. 전체 섹션 순서

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page repd-page">
    [CalculatorHero]
    [InfoNotice]
    .repd-status-section          // 확정안 아님 상태 카드
    .repd-summary-section         // 공급·대출·세금 3카드
    .repd-area-section            // 분야별 핵심 요약표
    .repd-impact-section          // 대상별 영향 카드
    .repd-supply-section          // 공급 파이프라인 설명
    .repd-loan-section            // 보완/차단 대출 2열
    .repd-tax-section             // 세금 프레임 + 예시표
    .repd-checklist-section       // 확정 발표 체크리스트 7개
    .repd-cta-section             // 계산기 연결
    .repd-source-section          // 출처 목록
    [SeoContent]
  </main>
```

### 4-2. 상태 카드

```astro
<InfoNotice
  title="토론회 논의 단계 안내"
  lines={[
    REPD_META.dataNote,
    "이 페이지는 매도·매수 판단을 권하는 자료가 아니라, 후속 발표 때 확인할 항목을 정리한 참고 자료입니다.",
  ]}
/>

<section class="content-section repd-status-section" aria-labelledby="repd-status-title">
  <article class="repd-status-card">
    <span class="repd-status-badge">{REPD_META.policyStatusLabel}</span>
    <h2 id="repd-status-title">이번 토론회는 확정 대책 발표가 아닙니다</h2>
    <p>
      공급, 대출, 세제 방향을 공개적으로 논의한 자리입니다. 실제 세율·공제금액·대출 한도는 후속 정부 발표와 법령 개정에서 확인해야 합니다.
    </p>
  </article>
</section>
```

### 4-3. 요약 카드

```astro
<section class="content-section repd-summary-section" aria-labelledby="repd-summary-title">
  <div class="repd-section-heading">
    <p>세 줄 요약</p>
    <h2 id="repd-summary-title">공급·대출·세금, 세 축으로 보면 이해가 쉽습니다</h2>
  </div>
  <div class="repd-summary-grid">
    {REPD_SUMMARY_CARDS.map((card) => (
      <article class="repd-summary-card" data-topic={card.id}>
        <span>{card.title}</span>
        <strong>{card.value}</strong>
        <p>{card.description}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-4. 분야별 요약표

```astro
<section class="content-section repd-area-section" aria-labelledby="repd-area-title">
  <div class="repd-section-heading">
    <p>분야별 논의</p>
    <h2 id="repd-area-title">분야별 핵심 논의 한눈에 보기</h2>
    <span>모든 항목은 확정안이 아니라 토론회·보도 기준의 논의 방향입니다.</span>
  </div>
  <div class="table-wrap repd-table-wrap">
    <table class="repd-area-table">
      <caption class="sr-only">부동산정책 국민 대토론회 분야별 핵심 논의 표</caption>
      <thead>
        <tr>
          <th>분야</th>
          <th>논의 방향</th>
          <th>영향 강도</th>
          <th>상태</th>
          <th>읽는 법</th>
        </tr>
      </thead>
      <tbody>
        {REPD_POLICY_AREAS.map((item) => (
          <tr>
            <td><strong>{item.area}</strong></td>
            <td>{item.direction}</td>
            <td><span class="repd-level-badge">{item.impactLevel}</span></td>
            <td>{item.status}</td>
            <td>{item.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 4-5. 대상별 영향 카드

```astro
<section class="content-section repd-impact-section" aria-labelledby="repd-impact-title">
  <div class="repd-section-heading">
    <p>내 유형 찾기</p>
    <h2 id="repd-impact-title">나는 어디에 해당하나 — 대상별 영향 진단</h2>
    <span>영향은 확정 결과가 아니라 후속 발표 때 확인할 방향입니다.</span>
  </div>
  <div class="repd-impact-grid">
    {REPD_AUDIENCE_IMPACTS.map((item) => (
      <article class="repd-impact-card" data-direction={item.direction}>
        <span class="repd-impact-direction">{item.direction}</span>
        <h3>{item.audience}</h3>
        <p>{item.summary}</p>
        <small>{item.checkPoint}</small>
      </article>
    ))}
  </div>
</section>
```

### 4-6. 공급 섹션

```astro
<section class="content-section repd-supply-section" aria-labelledby="repd-supply-title">
  <div class="repd-section-heading">
    <p>공급</p>
    <h2 id="repd-supply-title">공급은 새 계획보다 실제 착공·입주가 중요합니다</h2>
  </div>
  <ol class="repd-pipeline" aria-label="주택 공급 파이프라인">
    {["택지 확보", "인허가", "착공", "준공", "실제 입주"].map((step) => (
      <li>{step}</li>
    ))}
  </ol>
  <div class="repd-insight-card">
    <p>
      토론회 논의는 새 공급 목표를 크게 발표하는 것보다 기존 공공주택, 정비사업, 도심 유휴부지가 실제 입주까지 이어지도록 병목을 줄이는 쪽에 가깝습니다.
    </p>
  </div>
</section>
```

### 4-7. 대출 섹션

```astro
<section class="content-section repd-loan-section" aria-labelledby="repd-loan-title">
  <div class="repd-section-heading">
    <p>대출</p>
    <h2 id="repd-loan-title">실수요는 보완, 우회 대출은 차단하는 방향입니다</h2>
  </div>
  <div class="repd-loan-grid">
    {REPD_LOAN_GROUPS.map((group) => (
      <article class="repd-loan-card">
        <h3>{group.title}</h3>
        <ul>
          {group.items.map((item) => <li>{item}</li>)}
        </ul>
      </article>
    ))}
  </div>
  <p class="repd-caution-text">
    투자 목적 추가 매수에 대한 DSR·LTV 규제가 크게 풀린다는 의미로 해석하면 위험합니다.
  </p>
</section>
```

### 4-8. 세금 섹션

```astro
<section class="content-section repd-tax-section" aria-labelledby="repd-tax-title">
  <div class="repd-section-heading">
    <p>세금</p>
    <h2 id="repd-tax-title">몇 채인가보다 얼마짜리인가, 그리고 실제 거주하는가</h2>
  </div>
  <div class="repd-frame-compare">
    <article>
      <span>기존 프레임</span>
      <strong>1주택인가, 2주택인가</strong>
    </article>
    <article>
      <span>논의 프레임</span>
      <strong>전체 주택가액 + 실제 거주 여부</strong>
    </article>
  </div>
  <div class="table-wrap repd-table-wrap">
    <table class="repd-tax-table">
      <caption class="sr-only">보유 형태별 세금 개편 논의 체크 포인트</caption>
      <thead>
        <tr>
          <th>보유 형태</th>
          <th>현재 제도에서의 쟁점</th>
          <th>개편 논의 시 확인할 점</th>
        </tr>
      </thead>
      <tbody>
        {REPD_TAX_EXAMPLES.map((item) => (
          <tr>
            <td><strong>{item.holdingType}</strong></td>
            <td>{item.currentIssue}</td>
            <td>{item.reviewPoint}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 4-9. 체크리스트 섹션

```astro
<section class="content-section repd-checklist-section" aria-labelledby="repd-checklist-title">
  <div class="repd-section-heading">
    <p>후속 발표 확인</p>
    <h2 id="repd-checklist-title">확정 발표 때 체크할 7가지</h2>
  </div>
  <ol class="repd-checklist">
    {REPD_CHECKLIST.map((item) => (
      <li>
        <strong>{item.label}</strong>
        <span>{item.detail}</span>
      </li>
    ))}
  </ol>
</section>
```

### 4-10. CTA 및 출처

```astro
<section class="content-section repd-cta-section" aria-labelledby="repd-cta-title">
  <div class="repd-section-heading">
    <p>현재 기준 계산</p>
    <h2 id="repd-cta-title">현재 기준 세금은 계산기로 먼저 확인하세요</h2>
  </div>
  <div class="repd-cta-grid">
    {REPD_RELATED_LINKS.slice(0, 3).map((link) => (
      <a class="repd-cta-card" href={link.href}>
        <strong>{link.label}</strong>
        <p>{link.desc}</p>
      </a>
    ))}
  </div>
</section>

<section class="content-section repd-source-section" aria-labelledby="repd-source-title">
  <div class="repd-section-heading">
    <p>출처</p>
    <h2 id="repd-source-title">확인한 자료</h2>
  </div>
  <ul class="repd-source-list">
    {REPD_SOURCE_LINKS.map((source) => (
      <li>
        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>
        {source.note && <span>{source.note}</span>}
      </li>
    ))}
  </ul>
</section>
```

---

## 5. SCSS 설계

파일: `src/styles/scss/pages/_real-estate-policy-debate-2026.scss`, 전부 `.repd-` prefix.

### 5-1. 추가 클래스 목록

```scss
.repd-page
.repd-section-heading
.repd-status-section
.repd-status-card
.repd-status-badge
.repd-summary-section
.repd-summary-grid
.repd-summary-card
.repd-area-section
.repd-table-wrap
.repd-area-table
.repd-level-badge
.repd-impact-section
.repd-impact-grid
.repd-impact-card
.repd-impact-direction
.repd-supply-section
.repd-pipeline
.repd-insight-card
.repd-loan-section
.repd-loan-grid
.repd-loan-card
.repd-caution-text
.repd-tax-section
.repd-frame-compare
.repd-tax-table
.repd-checklist-section
.repd-checklist
.repd-cta-section
.repd-cta-grid
.repd-cta-card
.repd-source-section
.repd-source-list
```

### 5-2. 레이아웃 원칙

```scss
.repd-section-heading {
  margin-bottom: 16px;

  p {
    margin: 0 0 6px;
    color: #1a56db;
    font-weight: 700;
    font-size: 13px;
  }

  h2 {
    margin: 0;
  }

  span {
    display: block;
    margin-top: 8px;
    color: #5b6472;
  }
}

.repd-summary-grid,
.repd-loan-grid,
.repd-cta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.repd-impact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .repd-summary-grid,
  .repd-loan-grid,
  .repd-cta-grid,
  .repd-impact-grid {
    grid-template-columns: 1fr;
  }
}
```

### 5-3. 카드 스타일

```scss
.repd-status-card,
.repd-summary-card,
.repd-impact-card,
.repd-loan-card,
.repd-insight-card,
.repd-cta-card {
  border: 1px solid #dde3f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(22, 30, 46, 0.06);
  padding: 18px;
}

.repd-status-card {
  background: #f8faff;
}

.repd-status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eaf1ff;
  color: #1a56db;
  font-weight: 700;
  font-size: 13px;
}
```

### 5-4. 방향 배지

```scss
.repd-impact-direction,
.repd-level-badge {
  display: inline-block;
  margin-bottom: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f1f4fa;
  color: #475569;
  font-weight: 700;
  font-size: 12px;
}

.repd-impact-card[data-direction="긍정 가능성"] .repd-impact-direction,
.repd-impact-card[data-direction="소폭 긍정 가능성"] .repd-impact-direction {
  background: #ecfdf5;
  color: #047857;
}

.repd-impact-card[data-direction="부담 증가 가능성"] .repd-impact-direction,
.repd-impact-card[data-direction="부정 가능성"] .repd-impact-direction {
  background: #fef2f2;
  color: #b91c1c;
}

.repd-impact-card[data-direction="혼재"] .repd-impact-direction {
  background: #fff7ed;
  color: #c2410c;
}
```

### 5-5. 공급 파이프라인

```scss
.repd-pipeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0 0 16px;

  li {
    border: 1px solid #dde3f0;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    font-weight: 700;
    background: #f8faff;
  }
}

@media (max-width: 720px) {
  .repd-pipeline {
    grid-template-columns: 1fr;
  }
}
```

### 5-6. 표 모바일 처리

```scss
.repd-table-wrap {
  overflow-x: auto;
}

.repd-area-table,
.repd-tax-table {
  min-width: 720px;
  width: 100%;
  border-collapse: collapse;
}
```

---

## 6. 접근성 및 구조화 데이터

### 6-1. HTML 구조

- 각 `section`은 `aria-labelledby`를 사용한다.
- 분야별 표와 세금 예시표에는 `caption`을 둔다.
- 공급 파이프라인은 순서가 있으므로 `<ol>`을 사용한다.
- 카드의 색상만으로 의미를 전달하지 않고 배지 텍스트를 함께 표시한다.
- 외부 출처 링크는 `target="_blank" rel="noopener noreferrer"`를 사용한다.

### 6-2. JSON-LD

`Article`, `FAQPage`, `BreadcrumbList` 구성.

```ts
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: REPD_META.title,
  description: REPD_META.description,
  dateModified: REPD_META.updatedAt,
  mainEntityOfPage: reportUrl,
  author: { "@type": "Organization", name: "비교계산소" },
  keywords: [
    "7·23 부동산정책",
    "부동산정책 국민 대토론회",
    "종부세 개편",
    "실거주 1주택자",
    "갈아타기 대출",
  ],
};
```

### 6-3. FAQPage

`REPD_FAQ` 배열을 화면 FAQ와 JSON-LD가 공유한다. 화면에 보이지 않는 FAQ를 JSON-LD에만 넣지 않는다.

---

## 7. FAQ 데이터 설계

```ts
export const REPD_FAQ: FaqItem[] = [
  {
    question: "7·23 부동산정책 국민 대토론회에서 확정 대책이 발표된 건가요?",
    answer:
      "아니요. 2026년 7월 23일 토론회는 공급·대출·세제 방향을 공개적으로 논의한 자리입니다. 세율, 공제금액, 대출 한도, 시행일은 후속 정부 발표와 법령 개정에서 확인해야 합니다.",
  },
  {
    question: "실거주 1주택자도 세금이 크게 오르나요?",
    answer:
      "토론회 흐름만 보면 일반적인 실거주 1주택자의 급격한 세 부담 증가는 제한하려는 방향으로 읽힙니다. 다만 1세대 1주택 기본공제, 고가주택 기준, 고령·장기보유 공제 유지 여부는 확정 발표 때 확인해야 합니다.",
  },
  {
    question: "종부세가 주택 수 기준에서 가액 기준으로 바뀌나요?",
    answer:
      "주택 수보다 보유주택의 합산가액과 실제 거주 여부를 더 보자는 방향이 논의됐습니다. 아직 확정된 제도는 아니며, 합산가액 기준과 공제금액이 어떻게 설계되는지가 핵심입니다.",
  },
  {
    question: "비거주 1주택자는 왜 영향이 클 수 있나요?",
    answer:
      "실거주 없이 장기 보유만 한 주택에 대한 세제 혜택을 줄이자는 논의가 있기 때문입니다. 특히 장기보유특별공제에서 보유기간 공제와 거주기간 공제를 어떻게 나눌지가 중요합니다.",
  },
  {
    question: "갈아타기 대출은 완화되나요?",
    answer:
      "일시적 2주택, 기존 주택 처분 조건부 대출, 재건축 이주비 대출 같은 실수요성 대출은 보완 필요성이 논의됐습니다. 다만 투자 목적 추가 매수나 우회 대출까지 완화된다는 의미로 해석하면 안 됩니다.",
  },
  {
    question: "재건축·재개발 규제가 풀리나요?",
    answer:
      "전면 완화보다는 공공성, 임대주택 확보, 실제 공급 순증 효과에 따라 혜택을 차등 적용하는 방향으로 볼 수 있습니다. 사업별 조건이 중요하므로 단지별로 같은 영향이 생긴다고 단정하기 어렵습니다.",
  },
  {
    question: "다주택자는 어떤 부분을 봐야 하나요?",
    answer:
      "종부세 기준이 주택 수에서 합산가액 중심으로 바뀌는지, 사업자대출·전세대출 우회 규제가 강화되는지, 양도세 장기보유특별공제가 조정되는지를 함께 확인해야 합니다.",
  },
  {
    question: "정책 발표 전 매도나 매수를 결정해도 되나요?",
    answer:
      "토론회만 보고 급하게 결정하기보다 확정안, 시행일, 경과규정, 기존 계약 적용 여부를 확인하는 편이 안전합니다. 이 페이지는 의사결정 권고가 아니라 확인해야 할 항목을 정리한 참고 자료입니다.",
  },
];
```

---

## 8. 내부 링크 및 CTA 설계

### 8-1. 관련 링크 데이터

```ts
export const REPD_RELATED_LINKS: RelatedLink[] = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공시가격과 공정시장가액비율을 입력해 재산세·종부세를 추정합니다.",
  },
  {
    label: "양도소득세 계산기",
    href: "/tools/capital-gains-tax-calculator/",
    desc: "보유기간과 실거주기간을 반영해 매도 전 양도세를 확인합니다.",
  },
  {
    label: "부동산 취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    desc: "갈아타기나 추가 매수 전 취득세 부담을 먼저 확인합니다.",
  },
  {
    label: "2026 부동산 세제개편 검토안 정리",
    href: "/reports/real-estate-tax-reform-2026/",
    desc: "종부세·장기보유특별공제 등 세제개편 논의를 따로 정리한 리포트입니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "다주택자의 취득세·보유세·양도세 구조를 함께 확인합니다.",
  },
];
```

### 8-2. CTA 배치

| 위치 | CTA | 목적 |
|---|---|---|
| 대상별 영향 섹션 하단 | `내 보유세 먼저 계산하기` | 계산기 전환 |
| 세금 섹션 하단 | `매도 전 양도세 확인하기` | 장특공제 수요 전환 |
| 갈아타기 문단 하단 | `취득세 확인하기` | 매수·갈아타기 수요 전환 |
| SeoContent related | 계산기 3개 + 리포트 2개 | 회유율 개선 |

---

## 9. 구현 순서

### 9-1. 데이터 파일 작성

파일: `src/data/realEstatePolicyDebate2026.ts`

1. 타입 정의 (§3-2)
2. `REPD_META`
3. `REPD_SUMMARY_CARDS`
4. `REPD_POLICY_AREAS`
5. `REPD_AUDIENCE_IMPACTS`
6. `REPD_LOAN_GROUPS`
7. `REPD_TAX_EXAMPLES`
8. `REPD_CHECKLIST`
9. `REPD_FAQ`
10. `REPD_RELATED_LINKS`
11. `REPD_SOURCE_LINKS`

### 9-2. Astro 페이지 작성

파일: `src/pages/reports/real-estate-policy-debate-2026.astro`

1. 기존 정책/세금 리포트 페이지 구조 참고
2. `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent` import
3. JSON-LD 구성
4. Hero + InfoNotice
5. 상태 카드
6. 요약 카드
7. 분야별 요약표
8. 대상별 영향 카드
9. 공급·대출·세금 섹션
10. 체크리스트
11. CTA 섹션
12. 출처 섹션
13. SeoContent

### 9-3. SCSS 작성

파일: `src/styles/scss/pages/_real-estate-policy-debate-2026.scss`

1. `.repd-` prefix 클래스 작성
2. 카드·그리드·표·파이프라인 스타일 작성
3. 모바일 1열 전환
4. 표 가로 스크롤
5. `src/styles/app.scss`에 `@use 'scss/pages/real-estate-policy-debate-2026';` 추가

### 9-4. 등록 파일 반영

- `src/data/reports.ts`에 리포트 등록
- `src/pages/index.astro`의 `reportMetaBySlug`에 `"real-estate-policy-debate-2026": { category: "estate", isNew: true }` 추가
- `src/pages/reports/index.astro`의 `reportMetaBySlug`에 태그 등록
- `public/sitemap.xml`에 `/reports/real-estate-policy-debate-2026/` 추가

---

## 10. QA 체크리스트

### 콘텐츠

- [ ] 첫 화면에서 "확정안 아님"이 명확히 보이는가?
- [ ] 모든 정책 문구가 "논의", "검토", "가능성" 톤을 유지하는가?
- [ ] 세율·공제금액·대출 한도를 확정값처럼 쓰지 않았는가?
- [ ] 대상별 영향 카드가 매도·매수를 권하지 않는가?
- [ ] FAQ가 8개 이상이고 화면에 노출되는가?
- [ ] 출처 섹션에 공식 자료와 언론 자료가 구분되어 있는가?

### SEO

- [ ] title에 `7·23 부동산정책 국민 대토론회`가 포함되는가?
- [ ] description에 `실거주 1주택자`, `다주택자`, `갈아타기`가 자연스럽게 포함되는가?
- [ ] H2가 검색 의도 순서로 배치되는가?
- [ ] FAQPage JSON-LD와 화면 FAQ가 같은 데이터에서 나오는가?
- [ ] 관련 계산기·리포트 내부 링크가 5개 이상 연결되는가?

### UI

- [ ] 320px 모바일에서 대상별 카드 텍스트가 넘치지 않는가?
- [ ] 분야별 표와 세금 예시표가 모바일에서 가로 스크롤로 읽히는가?
- [ ] 공급 파이프라인이 모바일에서 세로 스택으로 전환되는가?
- [ ] 방향 배지 색상이 과하지 않고 텍스트로 의미가 전달되는가?
- [ ] CTA 카드가 버튼처럼 과장되지 않고 리포트 흐름 안에 자연스럽게 들어가는가?

### 빌드

- [ ] `npm run build` 성공
- [ ] `dist/reports/real-estate-policy-debate-2026/index.html` 생성
- [ ] 홈 리포트 섹션에서 `estate` 카테고리로 정상 노출
- [ ] sitemap URL에 트레일링 슬래시 포함

---

## 11. 향후 확장

### 11-1. 후속 발표 갱신

후속 정부 발표가 나오면 새 slug를 만들지 않고 같은 페이지를 갱신한다.

- `REPD_META.policyStatus`를 `GOVERNMENT_REVIEW` 또는 `GOVERNMENT_ANNOUNCED`로 변경
- `REPD_POLICY_AREAS`에서 확정된 항목과 논의 항목을 구분
- `REPD_AUDIENCE_IMPACTS`의 방향 문구를 실제 발표 기준으로 수정
- `REPD_CHECKLIST`를 "확정 발표 때 체크"에서 "확정된 내용 요약"으로 전환
- `updatedAt`과 sitemap `lastmod` 갱신

### 11-2. 선택 인터랙션 추가 후보

MVP는 정적 카드로 충분하다. 트래픽이 붙으면 다음을 추가한다.

| 기능 | 방식 | 필요성 |
|---|---|---|
| 내 유형 선택 | `select`로 대상별 카드 하나를 상단 강조 | 중 |
| 후속 발표 체크 상태 | 체크리스트를 완료/미확정 배지로 갱신 | 중 |
| 세제개편 리포트 연동 | `/reports/real-estate-tax-reform-2026/`의 상태 배지를 공유 | 낮음 |

---

## 12. 최종 판단

이 리포트는 계산기보다 정책 해설에 가깝지만, 비교계산소의 강점인 "내 유형별 영향"과 "관련 계산기 전환"을 붙이면 사이트 정체성과 잘 맞는다. 구현 난이도는 중간 이하이며, 클라이언트 스크립트 없이 정적 페이지로도 충분하다.

가장 중요한 것은 표현 수위다. 7·23 토론회는 확정안 발표가 아니므로, 첫 화면과 모든 표에서 `토론회 논의 단계`, `확정안 아님`, `후속 발표 확인 필요`를 계속 유지해야 한다.
