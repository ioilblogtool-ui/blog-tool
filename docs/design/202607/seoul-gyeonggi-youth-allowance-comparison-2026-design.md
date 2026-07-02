# 설계 문서
## 서울 vs 경기 청년수당 비교 리포트 2026

> 기획 원본: `docs/plan/202607/seoul-gyeonggi-youth-allowance-comparison-2026.md`  
> 콘텐츠 유형: `/reports/` 지역별 청년지원 비교 리포트  
> 구현 대상 URL: `/reports/seoul-gyeonggi-youth-allowance-comparison-2026/`  
> 핵심 안전장치: `경기 청년수당`은 공식 제도명으로 단정하지 않고, 공식명 `경기도 청년기본소득`과 검색어 맥락을 분리한다.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `seoul-gyeonggi-youth-allowance-comparison-2026` |
| 페이지 경로 | `src/pages/reports/seoul-gyeonggi-youth-allowance-comparison-2026.astro` |
| 데이터 파일 | `src/data/seoulGyeonggiYouthAllowanceComparison2026.ts` |
| SCSS | `src/styles/scss/pages/_seoul-gyeonggi-youth-allowance-comparison-2026.scss` |
| SCSS prefix | `.sgya` |
| 스크립트 | MVP 없음. 2차 확장 시 `public/scripts/seoul-gyeonggi-youth-allowance-comparison-2026.js` |
| 레이아웃 | `BaseLayout` 직접 구성 |
| 등록 카테고리 | `support` |
| 홈 노출 카테고리 | `복지·지원금` |
| 검증 명령어 | `npm run check:all` |

---

## 1. 제품 방향

### 1-1. 페이지 한 줄 정의

`서울 청년수당과 경기도 청년기본소득을 금액·나이·거주·소득·지급방식 기준으로 비교하고, 사용자가 먼저 확인할 제도를 고르게 돕는 리포트`

### 1-2. 사용자가 얻는 것

- 서울 청년수당과 경기도 청년기본소득이 같은 제도가 아니라는 점을 빠르게 이해
- 내가 서울형 구직활동 지원 대상에 가까운지, 경기 만 24세 기본소득 대상에 가까운지 판단
- 금액보다 나이·거주기간·취업상태·소득기준이 더 중요하다는 해석 기준 확보
- 서울과 경기 사이로 이사할 때 주민등록 기준일과 거주기간을 무엇부터 확인해야 하는지 파악
- 청년월세지원, 청년미래적금, 정부지원금 리포트로 이어지는 탐색 경로 확보

### 1-3. 피해야 할 것

- `서울이 경기보다 무조건 유리하다`처럼 금액만으로 단정
- `경기 청년수당`을 공식 제도명처럼 표기
- 2026년 모집기간·금액·소득기준을 공식 확인 없이 확정값처럼 노출
- 중복수급 가능 여부를 일반화
- 지역화폐 사용처와 서울 청년수당 사용 제한을 같은 제한으로 묶어 설명
- 수급 가능 여부를 계산기처럼 확정 판정

---

## 2. 사실 검증 및 데이터 배지 설계

### 2-1. 배지 타입

```ts
export type EvidenceBadge = "공식" | "확인 필요" | "참고";
```

| 배지 | 의미 | 사용 예 |
|---|---|---|
| 공식 | 2026년 공식 공고·공공기관 안내에서 확인한 값 | 신청기간, 연령 기준, 금액 |
| 확인 필요 | 공식 공고마다 바뀌거나 시군별 예외가 있는 값 | 서울 소득기준, 경기 일부 시군 지급 여부 |
| 참고 | 검색어 맥락·제도 해석·비교 인사이트 | `경기 청년수당`이라는 검색어 설명 |

### 2-2. 구현 전 공식 확인 필수 항목

| 제도 | 항목 | 확인 경로 |
|---|---|---|
| 서울 청년수당 | 모집기간, 연령, 서울 거주, 미취업/단기근로, 졸업상태, 소득기준, 지원금액, 지급방식, 중복수급 제한 | 서울 청년몽땅정보통 |
| 경기 청년기본소득 | 분기별 신청기간, 만 24세 생년월일 범위, 거주기간, 소득기준 없음 여부, 분기별 금액, 지역화폐, 시군별 지급 예외 | 경기도 청년기본소득, 잡아바 어플라이 |

### 2-3. 상단 InfoNotice 문구

```text
이 리포트는 서울 청년수당과 경기도 청년기본소득의 대표 구조를 비교하는 참고 자료입니다. 실제 신청 가능 여부는 신청 연도 공고, 주민등록 기준일, 소득·취업 상태, 중복수급 제한, 시군별 운영 여부에 따라 달라집니다.
```

---

## 3. 데이터 파일 설계

파일: `src/data/seoulGyeonggiYouthAllowanceComparison2026.ts`

### 3-1. 메타

```ts
export const SGYA_META = {
  slug: "seoul-gyeonggi-youth-allowance-comparison-2026",
  title: "서울 vs 경기 청년수당 비교 2026",
  seoTitle: "서울 vs 경기 청년수당 비교 2026 | 청년수당·청년기본소득 조건 한눈에",
  seoDescription:
    "서울 청년수당과 경기도 청년기본소득을 지원금액, 나이, 거주요건, 소득기준, 신청시기, 사용처 기준으로 비교합니다. 서울·경기 청년지원금 차이를 한눈에 확인하세요.",
  description:
    "서울 청년수당과 경기도 청년기본소득의 목적, 금액, 나이, 거주요건, 소득기준, 지급방식을 비교합니다.",
  updatedAt: "2026-07-02",
  dataNote:
    "서울 청년수당과 경기도 청년기본소득은 연도별 모집 공고와 시군 운영 여부에 따라 세부 조건이 달라질 수 있습니다. 구현 전 공식 공고 확인이 필요합니다.",
};
```

### 3-2. 타입 정의

```ts
export type EvidenceBadge = "공식" | "확인 필요" | "참고";

export interface YouthSupportProgram {
  id: "seoul-youth-allowance" | "gyeonggi-basic-income";
  region: "서울" | "경기";
  programName: string;
  commonSearchName: string;
  purpose: string;
  ageText: string;
  residencyText: string;
  incomeText: string;
  employmentText: string;
  amountText: string;
  maxTotalText: string;
  paymentMethod: string;
  applicationCycle: string;
  mainCautions: string[];
  officialUrl: string;
  evidence: EvidenceBadge;
}

export interface SummaryCard {
  label: string;
  value: string;
  description: string;
  badge: EvidenceBadge;
}

export interface ComparisonRow {
  label: string;
  seoul: string;
  gyeonggi: string;
  insight: string;
}

export interface ScenarioCard {
  title: string;
  recommendedProgram: string;
  reason: string;
  caution: string;
}

export interface MigrationScenario {
  fromTo: string;
  firstCheck: string;
  explanation: string;
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
```

### 3-3. 주요 상수

```ts
export const SGYA_PROGRAMS: YouthSupportProgram[] = [
  {
    id: "seoul-youth-allowance",
    region: "서울",
    programName: "서울 청년수당",
    commonSearchName: "서울 청년수당",
    purpose: "미취업 청년의 진로탐색과 구직활동 지원",
    ageText: "만 19~34세 계열",
    residencyText: "신청일 기준 서울 거주",
    incomeText: "중위소득 또는 건강보험료 기준 확인 필요",
    employmentText: "미취업 또는 단기근로 기준 확인 필요",
    amountText: "월 50만 원 × 최대 6개월 구조 확인 필요",
    maxTotalText: "최대 300만 원",
    paymentMethod: "활동지원금",
    applicationCycle: "모집 공고형",
    mainCautions: ["중복수급 제한", "소득 기준", "졸업·취업 상태"],
    officialUrl: "https://youth.seoul.go.kr/",
    evidence: "확인 필요",
  },
  {
    id: "gyeonggi-basic-income",
    region: "경기",
    programName: "경기도 청년기본소득",
    commonSearchName: "경기 청년수당",
    purpose: "만 24세 청년 대상 지역화폐형 기본소득",
    ageText: "만 24세",
    residencyText: "경기도 거주기간 요건 확인 필요",
    incomeText: "소득 기준 없음으로 알려짐",
    employmentText: "취업 여부와 무관한 구조로 알려짐",
    amountText: "분기별 25만 원 × 최대 4분기 구조 확인 필요",
    maxTotalText: "최대 100만 원",
    paymentMethod: "시군 지역화폐",
    applicationCycle: "분기 신청형",
    mainCautions: ["생년월일 기준", "거주기간", "시군별 지급 여부"],
    officialUrl: "https://apply.jobaba.net/",
    evidence: "확인 필요",
  },
];
```

```ts
export const SGYA_SUMMARY_CARDS: SummaryCard[] = [
  {
    label: "서울 최대 지원",
    value: "최대 300만 원",
    description: "월 50만 원 × 최대 6개월 구조는 공식 공고 확인 후 확정합니다.",
    badge: "확인 필요",
  },
  {
    label: "경기 최대 지원",
    value: "최대 100만 원",
    description: "분기 25만 원 × 최대 4분기 구조는 분기별 공고 확인 후 확정합니다.",
    badge: "확인 필요",
  },
  {
    label: "서울 핵심 조건",
    value: "미취업·구직활동",
    description: "소득, 졸업상태, 중복수급 제한을 함께 확인합니다.",
    badge: "확인 필요",
  },
  {
    label: "경기 핵심 조건",
    value: "만 24세·거주기간",
    description: "생년월일 범위와 경기도 거주기간이 핵심입니다.",
    badge: "확인 필요",
  },
];
```

```ts
export const SGYA_COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "제도 목적",
    seoul: "구직·진로탐색 지원",
    gyeonggi: "청년 기본소득",
    insight: "같은 청년지원금이라도 정책 목적이 다릅니다.",
  },
  {
    label: "나이",
    seoul: "만 19~34세 계열",
    gyeonggi: "만 24세",
    insight: "경기 제도는 대상 연령 창이 좁습니다.",
  },
  {
    label: "금액",
    seoul: "월 50만 원 × 최대 6개월",
    gyeonggi: "분기 25만 원 × 최대 4분기",
    insight: "총액만 보면 서울이 크지만 조건 제한도 더 중요합니다.",
  },
  {
    label: "소득·취업",
    seoul: "소득·미취업 조건 중요",
    gyeonggi: "소득보다 나이·거주기간 중심",
    insight: "취업 중이면 서울보다 경기 조건을 먼저 확인할 가능성이 큽니다.",
  },
  {
    label: "지급 방식",
    seoul: "활동지원금",
    gyeonggi: "시군 지역화폐",
    insight: "사용처 제한의 성격이 다릅니다.",
  },
];
```

### 3-4. FAQ 데이터

FAQ는 데이터 파일에서 관리하고 화면 FAQ와 JSON-LD가 같은 배열을 사용한다.

```ts
export const SGYA_FAQ: FaqItem[] = [
  {
    question: "서울 청년수당과 경기 청년수당은 같은 제도인가요?",
    answer:
      "같은 제도가 아닙니다. 서울은 공식적으로 청년수당이라는 이름으로 구직활동·진로탐색을 지원하는 제도이고, 경기도는 청년기본소득이 대표 제도입니다. 사용자는 경기 청년수당이라고 검색할 수 있지만 페이지에서는 공식명과 검색어를 분리해 설명해야 합니다.",
  },
  {
    question: "서울 청년수당은 얼마를 받을 수 있나요?",
    answer:
      "대표 구조는 월 50만 원씩 최대 6개월, 총 300만 원으로 알려져 있습니다. 다만 모집연도와 공고에 따라 세부 요건이 달라질 수 있으므로 구현 전 서울 청년몽땅정보통 공식 공고로 확인해야 합니다.",
  },
  {
    question: "경기도 청년기본소득은 얼마인가요?",
    answer:
      "대표 구조는 분기별 25만 원씩 최대 4분기, 총 100만 원으로 알려져 있습니다. 실제 지급 여부와 신청기간은 분기별 공고, 생년월일 기준, 시군별 운영 여부를 함께 확인해야 합니다.",
  },
  {
    question: "둘 다 받을 수 있나요?",
    answer:
      "거주지와 신청 시점, 중복수급 제한 때문에 단순히 둘 다 가능하다고 말할 수 없습니다. 서울 청년수당은 서울 거주와 미취업·소득 조건을 보고, 경기도 청년기본소득은 경기도 거주기간과 만 24세 기준을 먼저 봅니다.",
  },
  {
    question: "서울에서 경기도로 이사하면 바로 경기 청년기본소득을 받을 수 있나요?",
    answer:
      "바로 가능하다고 단정할 수 없습니다. 경기도 청년기본소득은 거주기간 요건이 핵심이므로 전입 직후라면 거주기간을 충족하지 못할 수 있습니다.",
  },
  {
    question: "취업 중이어도 신청할 수 있나요?",
    answer:
      "서울 청년수당은 미취업 또는 단기근로 요건이 중요합니다. 반면 경기도 청년기본소득은 대표적으로 나이와 거주기간이 핵심이라 취업 여부보다 공식 신청 조건 확인이 우선입니다.",
  },
];
```

---

## 4. 페이지 IA 설계

### 4-1. 전체 구조

```text
[BaseLayout]
  [SiteHeader]
  <main class="container page-shell report-page sgya-page">
    [CalculatorHero]
    [InfoNotice]
    .sgya-summary-section       // 핵심 요약 카드 4개
    .sgya-program-section       // 서울/경기 2열 프로그램 카드
    .sgya-comparison-section    // 메인 비교표
    .sgya-scenario-section      // 내 상황별 먼저 볼 제도
    .sgya-migration-section     // 서울↔경기 이사 시나리오
    .sgya-caution-section       // 중복수급·제외 조건
    .sgya-source-section        // 공식 확인 경로
    [SeoContent]
  </main>
```

### 4-2. Hero

```astro
<CalculatorHero
  eyebrow="청년지원금 비교"
  title={SGYA_META.title}
  description="서울 청년수당과 경기도 청년기본소득은 이름은 비슷하게 검색되지만 대상·목적·지급 방식이 다릅니다."
  badges={["서울", "경기", "청년수당", "청년기본소득", "확인 필요"]}
/>
```

### 4-3. InfoNotice

```astro
<InfoNotice
  title="데이터 기준 안내"
  lines={[
    SGYA_META.dataNote,
    "금액과 조건은 구현 전 2026년 공식 공고로 재확인하고, 확정된 값에는 공식 배지, 변동 가능 항목에는 확인 필요 배지를 표시합니다.",
  ]}
/>
```

### 4-4. 핵심 요약 카드

```astro
<section class="content-section sgya-summary-section" aria-labelledby="sgya-summary-title">
  <div class="sgya-section-heading">
    <p>핵심 요약</p>
    <h2 id="sgya-summary-title">금액보다 조건을 먼저 봐야 합니다</h2>
    <span>서울은 구직활동 지원, 경기는 만 24세 지역화폐형 기본소득에 가깝습니다.</span>
  </div>
  <div class="sgya-summary-grid">
    {SGYA_SUMMARY_CARDS.map((card) => (
      <article class="sgya-summary-card">
        <span class:list={["sgya-badge", `sgya-badge--${card.badge}`]}>{card.badge}</span>
        <small>{card.label}</small>
        <strong>{card.value}</strong>
        <p>{card.description}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-5. 서울/경기 프로그램 카드

```astro
<section class="content-section sgya-program-section" aria-labelledby="sgya-program-title">
  <div class="sgya-section-heading">
    <p>제도 성격</p>
    <h2 id="sgya-program-title">서울과 경기는 같은 청년수당이 아닙니다</h2>
  </div>
  <div class="sgya-program-grid">
    {SGYA_PROGRAMS.map((program) => (
      <article class:list={["sgya-program-card", `sgya-program-card--${program.region}`]}>
        <span class="sgya-region">{program.region}</span>
        <h3>{program.programName}</h3>
        <p>{program.purpose}</p>
        <dl>
          <div><dt>나이</dt><dd>{program.ageText}</dd></div>
          <div><dt>거주</dt><dd>{program.residencyText}</dd></div>
          <div><dt>소득</dt><dd>{program.incomeText}</dd></div>
          <div><dt>지급</dt><dd>{program.amountText}</dd></div>
        </dl>
        <a href={program.officialUrl} target="_blank" rel="noopener noreferrer">공식 페이지 확인</a>
      </article>
    ))}
  </div>
</section>
```

### 4-6. 메인 비교표

```astro
<section class="content-section sgya-comparison-section" aria-labelledby="sgya-comparison-title">
  <div class="sgya-section-heading">
    <p>조건 비교</p>
    <h2 id="sgya-comparison-title">나이·거주·소득 조건이 다릅니다</h2>
  </div>
  <div class="table-wrap sgya-table-wrap">
    <table class="sgya-comparison-table">
      <caption>서울 청년수당과 경기도 청년기본소득 비교</caption>
      <thead>
        <tr>
          <th>항목</th>
          <th>서울 청년수당</th>
          <th>경기 청년기본소득</th>
          <th>해석</th>
        </tr>
      </thead>
      <tbody>
        {SGYA_COMPARISON_ROWS.map((row) => (
          <tr>
            <td>{row.label}</td>
            <td>{row.seoul}</td>
            <td>{row.gyeonggi}</td>
            <td>{row.insight}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 4-7. 내 상황별 추천 카드

정확한 판정이 아니라 “먼저 확인할 제도”로 표현한다.

```astro
<section class="content-section sgya-scenario-section" aria-labelledby="sgya-scenario-title">
  <div class="sgya-section-heading">
    <p>내 상황별</p>
    <h2 id="sgya-scenario-title">내 상황이면 어느 제도를 먼저 봐야 할까?</h2>
  </div>
  <div class="sgya-scenario-grid">
    {SGYA_SCENARIOS.map((item) => (
      <article class="sgya-scenario-card">
        <h3>{item.title}</h3>
        <strong>{item.recommendedProgram}</strong>
        <p>{item.reason}</p>
        <small>{item.caution}</small>
      </article>
    ))}
  </div>
</section>
```

### 4-8. 서울↔경기 이사 시나리오

```astro
<section class="content-section sgya-migration-section" aria-labelledby="sgya-migration-title">
  <div class="sgya-section-heading">
    <p>이사 예정자</p>
    <h2 id="sgya-migration-title">서울에서 경기로, 경기에서 서울로 이사하면 기준일이 중요합니다</h2>
  </div>
  <div class="sgya-migration-list">
    {SGYA_MIGRATION_SCENARIOS.map((item) => (
      <article class="sgya-migration-card">
        <span>{item.fromTo}</span>
        <strong>{item.firstCheck}</strong>
        <p>{item.explanation}</p>
      </article>
    ))}
  </div>
</section>
```

### 4-9. 공식 확인 경로

외부 링크는 모두 `target="_blank"`와 `rel="noopener noreferrer"`를 붙인다.

```astro
<section class="content-section sgya-source-section" aria-labelledby="sgya-source-title">
  <div class="sgya-section-heading">
    <p>공식 확인</p>
    <h2 id="sgya-source-title">신청 전 공식 공고를 마지막으로 확인하세요</h2>
  </div>
  <div class="sgya-source-grid">
    {SGYA_SOURCE_LINKS.map((source) => (
      <a class="sgya-source-card" href={source.href} target="_blank" rel="noopener noreferrer">
        <strong>{source.label}</strong>
        <span>{source.description}</span>
      </a>
    ))}
  </div>
</section>
```

---

## 5. SCSS 설계

파일: `src/styles/scss/pages/_seoul-gyeonggi-youth-allowance-comparison-2026.scss`

### 5-1. 기본 구조

```scss
.sgya-page {
  display: grid;
  gap: 28px;

  .sgya-section-heading {
    display: grid;
    gap: 6px;
    margin-bottom: 18px;

    p, h2, span { margin: 0; }

    p {
      font-size: 12px;
      font-weight: 900;
      color: #0f766e;
      letter-spacing: 0;
    }

    h2 {
      font-size: clamp(20px, 3vw, 30px);
      line-height: 1.25;
      color: #111928;
    }

    span {
      color: #4b5563;
      line-height: 1.65;
    }
  }
}
```

### 5-2. 그리드

```scss
.sgya-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.sgya-program-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.sgya-scenario-grid,
.sgya-source-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .sgya-summary-grid,
  .sgya-program-grid,
  .sgya-scenario-grid,
  .sgya-source-grid {
    grid-template-columns: 1fr;
  }
}
```

### 5-3. 카드 공통

```scss
.sgya-summary-card,
.sgya-program-card,
.sgya-scenario-card,
.sgya-migration-card,
.sgya-source-card {
  border: 1px solid #d8e6e3;
  border-radius: 8px;
  background: #f8fbfa;
  box-shadow: 0 12px 30px rgba(15, 118, 110, 0.06);
  padding: 18px;
}
```

### 5-4. 표

```scss
.sgya-table-wrap {
  overflow-x: auto;
  border: 1px solid #d8e6e3;
  border-radius: 8px;
}

.sgya-comparison-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 13px;
  background: #f8fbfa;

  caption {
    caption-side: top;
    text-align: left;
    font-size: 12px;
    color: #6b7280;
    padding: 12px 14px 8px;
  }

  th, td {
    padding: 12px 14px;
    border-bottom: 1px solid #e5efec;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    font-weight: 900;
    color: #374151;
    background: #edf7f5;
  }
}
```

### 5-5. 색상 방향

- 서울 카드: `#2563eb` 계열 포인트
- 경기 카드: `#0f766e` 계열 포인트
- 전체 배경: 밝은 민트/그레이 계열
- 단색 테마로 흐르지 않도록 서울/경기 비교 카드에 서로 다른 포인트색 사용
- 보라/남색 그라데이션 금지

---

## 6. Astro 페이지 설계

파일: `src/pages/reports/seoul-gyeonggi-youth-allowance-comparison-2026.astro`

### 6-1. frontmatter

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SGYA_META,
  SGYA_SUMMARY_CARDS,
  SGYA_PROGRAMS,
  SGYA_COMPARISON_ROWS,
  SGYA_SCENARIOS,
  SGYA_MIGRATION_SCENARIOS,
  SGYA_CAUTION_ROWS,
  SGYA_SOURCE_LINKS,
  SGYA_FAQ,
  SGYA_RELATED_LINKS,
} from "../../data/seoulGyeonggiYouthAllowanceComparison2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SGYA_META.slug}/`;
const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SGYA_META.title,
    description: SGYA_META.description,
    dateModified: SGYA_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SGYA_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];
---
```

### 6-2. BaseLayout

```astro
<BaseLayout title={SGYA_META.seoTitle} description={SGYA_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page sgya-page" data-report={SGYA_META.slug}>
    ...
  </main>
</BaseLayout>
```

### 6-3. SeoContent

```astro
<SeoContent
  introTitle="서울·경기 청년수당 비교는 금액보다 조건을 먼저 봐야 합니다"
  intro={[
    "청년수당은 검색량이 꾸준하지만 지역별로 실제 제도명이 달라 혼동이 큽니다. 서울은 청년수당이라는 이름으로 미취업 청년의 진로탐색과 구직활동을 지원하는 제도이고, 경기도는 청년기본소득이 대표적인 청년 현금성 지원 제도입니다. 그래서 단순히 서울 청년수당과 경기 청년수당을 같은 표에 놓고 금액만 비교하면 실제 신청 판단과 어긋날 수 있습니다.",
    "이 리포트는 두 제도를 금액, 나이, 거주요건, 소득·취업상태, 지급방식으로 나누어 비교합니다. 서울은 소득과 미취업 상태, 졸업 여부, 중복수급 제한이 중요하고, 경기는 만 24세 여부와 경기도 거주기간, 시군별 지급 여부가 핵심입니다. 같은 청년지원금이라도 확인해야 할 순서가 완전히 다릅니다.",
    "결과를 읽을 때는 먼저 현재 주민등록상 거주지와 나이를 봐야 합니다. 서울 거주 미취업 청년이라면 서울 청년수당 공고를 먼저 확인하고, 경기도에 오래 거주한 만 24세 청년이라면 경기도 청년기본소득 분기 신청을 먼저 확인하는 식입니다. 서울과 경기 사이로 이사할 예정이라면 신청일 기준 주민등록과 거주기간을 반드시 따로 봐야 합니다.",
    "이 페이지는 신청 가능성을 확정하는 계산기가 아니라 비교 리포트입니다. 실제 조건은 연도별 모집 공고, 예산, 시군별 운영 여부, 중복수급 제한에 따라 달라질 수 있습니다. 신청 전에는 서울 청년몽땅정보통과 경기도 청년기본소득 공식 안내, 잡아바 어플라이의 최신 공고를 마지막으로 확인해야 합니다.",
  ]}
  inputPoints={[
    "서울 청년수당과 경기 청년기본소득의 금액·대상·신청 차이를 한눈에 비교합니다.",
    "나이, 거주지, 취업상태에 따라 어떤 제도를 먼저 확인할지 판단합니다.",
    "서울·경기 이사 예정자가 확인해야 할 주민등록 기준과 거주기간 포인트를 정리합니다.",
  ]}
  criteria={[
    "서울 청년수당은 서울시 최신 모집 공고 기준으로 확인합니다.",
    "경기 청년기본소득은 경기도 분기별 신청 공고 기준으로 확인합니다.",
    "금액과 조건은 연도·예산·시군 운영 여부에 따라 달라질 수 있습니다.",
    "공식 확인 전 수치는 확인 필요 배지로 표시합니다.",
  ]}
  faq={SGYA_FAQ}
  related={SGYA_RELATED_LINKS.map((link) => ({ href: link.href, label: link.label }))}
/>
```

---

## 7. 등록 설계

최신 `AGENT.md` 기준으로 신규 리포트 등록 파일을 모두 반영한다.

### 7-1. `src/data/reports.ts`

```ts
{
  slug: "seoul-gyeonggi-youth-allowance-comparison-2026",
  title: "서울 vs 경기 청년수당 비교 2026",
  description: "서울 청년수당과 경기도 청년기본소득을 지원금액, 나이, 거주요건, 소득기준, 신청시기, 사용처 기준으로 비교합니다.",
  order: 37.2,
  badges: ["청년지원", "서울", "경기", "2026"],
}
```

### 7-2. `src/pages/index.astro`

`reportMetaBySlug`에 추가:

```ts
"seoul-gyeonggi-youth-allowance-comparison-2026": { category: "support", isNew: true },
```

### 7-3. `src/pages/reports/index.astro`

`reportMetaBySlug`에 추가:

```ts
"seoul-gyeonggi-youth-allowance-comparison-2026": {
  eyebrow: "청년지원금 비교",
  tags: [
    { label: "서울", mod: "life" },
    { label: "경기", mod: "asset" },
    { label: "청년수당", mod: "support" },
  ],
  category: "support",
  isNew: true,
},
```

### 7-4. `src/styles/app.scss`

```scss
@use 'scss/pages/seoul-gyeonggi-youth-allowance-comparison-2026';
```

### 7-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/seoul-gyeonggi-youth-allowance-comparison-2026/</loc>
  <lastmod>2026-07-02</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 8. 구현 순서

1. 공식 공고 확인
   - 서울 청년몽땅정보통 2026년 청년수당
   - 경기도 청년기본소득 2026년 분기 신청
   - 시군별 예외 확인
2. 데이터 파일 생성
   - 메타, 프로그램 카드, 비교표, 시나리오, FAQ, 관련 링크
3. Astro 페이지 생성
   - Hero, InfoNotice, 요약 카드, 비교표, 시나리오, 공식 확인 경로, SeoContent
4. SCSS 생성
   - `.sgya` prefix, 모바일 1열, 표 가로 스크롤
5. 등록 파일 반영
   - `reports.ts`, 홈 메타, 리포트 허브 메타, app.scss, sitemap
6. 검증
   - `npm run check:all`
   - 필요 시 `npm run build`

---

## 9. QA 체크리스트

### 콘텐츠

- [ ] 서울 청년수당과 경기도 청년기본소득을 같은 제도로 표현하지 않았는가?
- [ ] `경기 청년수당`은 검색어 맥락으로만 다루고 공식명은 `경기도 청년기본소득`으로 표기했는가?
- [ ] 공식 확인 전 수치에 `확인 필요` 배지가 붙었는가?
- [ ] 금액만 비교해 어느 지역이 더 좋다고 단정하지 않았는가?
- [ ] 서울·경기 이사 시나리오에서 주민등록 기준일과 거주기간을 안내했는가?
- [ ] 중복수급 여부를 단정하지 않고 공식 공고 확인을 안내했는가?

### SEO

- [ ] title에 `서울 청년수당`, `경기`, `청년기본소득`이 자연스럽게 포함되는가?
- [ ] meta description이 120~160자 내외인가?
- [ ] H2가 검색 질문 순서로 구성되는가?
- [ ] FAQ가 화면에 보이고 JSON-LD와 같은 데이터에서 생성되는가?
- [ ] 관련 링크가 3개 이상인가?

### UI

- [ ] 모바일에서 2열 비교 카드가 1열로 자연스럽게 쌓이는가?
- [ ] 비교표는 320px 화면에서 가로 스크롤로 읽을 수 있는가?
- [ ] 배지 텍스트가 버튼처럼 보이지 않는가?
- [ ] 외부 링크와 내부 링크가 시각적으로 구분되는가?
- [ ] 카드 안 긴 제도명이 줄바꿈되어도 레이아웃이 깨지지 않는가?

### 등록·검증

- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/index.astro`의 `reportMetaBySlug` 등록
- [ ] `src/pages/reports/index.astro`의 `reportMetaBySlug` 등록
- [ ] `src/styles/app.scss` 등록
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run check:all` 통과

---

## 10. 2차 확장 설계

검색 유입이 확인되면 선택형 자가점검 모듈을 추가한다.

### 10-1. 입력값

| 입력 | 옵션 |
|---|---|
| 현재 거주지 | 서울 / 경기 / 기타 |
| 만 나이 | 숫자 |
| 취업 상태 | 미취업 / 단기근로 / 취업 |
| 경기도 거주기간 | 3년 이상 계속 / 합산 10년 이상 / 미충족 / 모름 |
| 서울 소득기준 | 충족 가능 / 모름 / 어려움 |

### 10-2. 결과

| 결과 | 조건 |
|---|---|
| 서울 청년수당 먼저 확인 | 서울 거주 + 미취업/단기근로 + 청년 연령 |
| 경기 청년기본소득 먼저 확인 | 경기 거주 + 만 24세 + 거주기간 충족 가능 |
| 둘 다 공식 공고 확인 필요 | 이사 예정 또는 조건 일부 모름 |
| 현재 조건 가능성 낮음 | 기타 지역, 나이 불일치, 취업상태/거주기간 미충족 |

결과는 확정 판정이 아니라 `먼저 확인할 제도`로만 표시한다.

---

## 11. 최종 판단

이 리포트는 계산 로직보다 **제도명 혼동 해소와 조건 비교**가 핵심이다. MVP는 정적 리포트로 충분하며, 공식 공고 확인 후 `공식/확인 필요` 배지만 명확히 붙이면 빠르게 발행할 수 있다. 이후 네이버에서 `서울 청년수당`, `경기 청년수당`, `경기도 청년기본소득` 유입이 확인되면 자가점검 인터랙션을 붙이는 방식이 가장 효율적이다.
