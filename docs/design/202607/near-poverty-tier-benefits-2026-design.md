# 2026 차상위계층 혜택 총정리 — 설계 문서

> 작성일: 2026-07-02
> 콘텐츠 유형: `/reports/` 심층 리포트
> 구현 기준: [`docs/plan/202607/near-poverty-tier-benefits-2026.md`](../../plan/202607/near-poverty-tier-benefits-2026.md) — 차상위계층 확인 기준, 세부 혜택 11종, 기초수급 대비 비교, 복지급여 수급자격 계산기 CTA

---

## 1. 문서 개요

- 구현 대상: `2026 차상위계층 혜택 총정리`
- slug: `near-poverty-tier-benefits-2026`
- URL: `/reports/near-poverty-tier-benefits-2026/`
- 카테고리: 복지/지원금
- 핵심 검색 의도: "차상위계층 혜택", "차상위계층 확인서 발급", "차상위계층 기준", "기초수급 탈락 후 지원", "차상위 통신비 감면", "차상위 자활사업"
- 핵심 CTA: `/tools/welfare-benefit-eligibility/`
- 핵심 출력: 차상위계층 확인 기준(중위 50%)표, 기초수급 vs 차상위 비교, 세부 혜택 11종 비교, 확인서 발급 절차, 대상별 추천 혜택
- 상위 허브 리포트: `/reports/2026-government-welfare-benefits/` — 이 페이지는 허브의 "차상위계층" 섹션을 독립 확장한 서브 리포트이며, 허브와 상호 링크로 연결한다.

중요 원칙 (허브 리포트와 동일하게 적용):
- 취약계층 대상 콘텐츠이므로 과장 표현과 고위험 대출 CTA를 피한다.
- 모든 금액과 조건에는 `공식`, `확인 필요`, `추정` 배지를 붙인다.
- "차상위계층 확인서만 받으면 모든 혜택이 자동 적용된다"는 단정 표현을 쓰지 않는다.
- 사업마다 소득기준이 다르다는 점(50% 원칙 vs 52% 특례 등)을 표로 명확히 구분한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    nearPovertyTierBenefits2026.ts   ← 차상위 세부 혜택 11종, 확인 절차, 추천 카드, FAQ, 관련 링크
    governmentWelfareBenefits2026.ts ← GWB_MEDIAN_INCOME_ROWS를 그대로 import (재계산 없음)
  pages/
    reports/
      near-poverty-tier-benefits-2026.astro

public/
  scripts/
    near-poverty-tier-benefits-2026.js ← Chart.js 1개 + 카테고리 필터

src/styles/scss/pages/
  _near-poverty-tier-benefits-2026.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/near-poverty-tier-benefits-2026';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지. `2026-government-welfare-benefits.astro`와 동일한 컴포넌트 조합 재사용.
- 클래스: `report-page npt-page`
- SCSS prefix: `npt-`
- Chart.js 사용:
  - 기초수급 4급여 기준(32/40/48/50%) vs 차상위 확인 기준(50%) 비교 차트 1개
- Vanilla JS 사용:
  - 차상위 세부 혜택 11종 카테고리 필터 (GWB 필터 패턴 재사용)
- 리포트 톤은 공공 안내형. "확인", "신청", "서류 준비" 중심, 광고성 문구 배제.

---

## 4. 데이터 모델

```ts
// src/data/nearPovertyTierBenefits2026.ts
import type { MedianIncomeRow } from "./governmentWelfareBenefits2026";

export type SourceLabel = "공식" | "확인 필요" | "추정";
export type NptGroup =
  | "verify"
  | "medical"
  | "jobs"
  | "disability"
  | "family"
  | "discount"
  | "voucher"
  | "education"
  | "childcare";

export interface NptBenefitItem {
  id: string;
  group: NptGroup;
  name: string;
  target: string;
  incomeCriteria: string;
  supportType: "현금" | "바우처" | "감면" | "서비스";
  supportSummary: string;
  applicationChannel: string;
  sourceLabel: SourceLabel;
  sourceUrl?: string;
  updatedAt: string;
  notes: string[];
}

export interface NptComparisonRow {
  label: string;
  basicLivelihood: string;
  nearPoverty: string;
}

export interface NptApplicationStep {
  id: string;
  step: number;
  title: string;
  desc: string;
}

export interface NptAudienceRecommendation {
  id: string;
  audience: string;
  firstCheck: string[];
  reason: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface NptFaq {
  question: string;
  answer: string;
}

export interface NptRelatedLink {
  href: string;
  label: string;
  desc?: string;
}
```

---

## 5. 핵심 데이터 상수

### 5-1. 차상위계층 확인 기준 (기준 중위소득 50%)

기존 `governmentWelfareBenefits2026.ts`의 `GWB_MEDIAN_INCOME_ROWS`(공식 라벨, 이미 `education` 필드에 중위 50% 값 보유)를 그대로 import해서 사용한다. 새 상수를 만들지 않는다.

```ts
import { GWB_MEDIAN_INCOME_ROWS } from "./governmentWelfareBenefits2026";

// 페이지에서 사용 시:
// const nearPovertyThreshold = (row: MedianIncomeRow) => row.education;
```

### 5-2. 기초수급 vs 차상위 비교

```ts
export const NPT_COMPARISON_ROWS: NptComparisonRow[] = [
  { label: "소득기준", basicLivelihood: "생계 32%·의료 40%·주거 48%·교육 50%", nearPoverty: "대체로 중위 50% 이하" },
  { label: "지원 형태", basicLivelihood: "현금 급여(생계·주거·교육) + 의료급여", nearPoverty: "감면·바우처·서비스 중심" },
  { label: "대표 혜택", basicLivelihood: "생계급여, 의료급여, 주거급여, 교육급여", nearPoverty: "본인부담경감, 통신비 감면, 전기요금 할인, 문화누리카드" },
  { label: "확인 방법", basicLivelihood: "기초생활보장 수급자 선정", nearPoverty: "차상위계층 확인서 발급" },
];
```

### 5-3. 차상위 세부 혜택 11종

```ts
export const NPT_BENEFIT_ITEMS: NptBenefitItem[] = [
  {
    id: "near-poverty-cert",
    group: "verify",
    name: "차상위계층 확인서",
    target: "중위소득 50% 이하이면서 기초생활수급자가 아닌 가구",
    incomeCriteria: "중위 50% 이하",
    supportType: "서비스",
    supportSummary: "개별 차상위 혜택 신청의 전제 조건이 되는 확인서 발급",
    applicationChannel: "복지로 또는 주소지 읍면동 주민센터",
    sourceLabel: "공식",
    sourceUrl: "https://www.bokjiro.go.kr",
    updatedAt: "2026년 기준",
    notes: ["확인서 자체만으로 혜택이 자동 적용되지 않습니다."],
  },
  {
    id: "medical-cost-reduction",
    group: "medical",
    name: "차상위 본인부담경감",
    target: "만성질환자·희귀난치성질환자 등 차상위 가구원",
    incomeCriteria: "중위 50% 이하 (질환별 세부 기준 확인 필요)",
    supportType: "감면",
    supportSummary: "병원 진료비·약제비 본인부담 비율 경감",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["질환 종류에 따라 경감 비율이 다릅니다."],
  },
  {
    id: "self-support-program",
    group: "jobs",
    name: "차상위 자활사업",
    target: "근로 가능한 차상위 가구원",
    incomeCriteria: "중위 50% 이하 + 근로 가능 판정",
    supportType: "서비스",
    supportSummary: "자활근로 참여를 통한 소득 보전과 자산형성 연계",
    applicationChannel: "지역자활센터 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["근로 능력 평가 결과에 따라 참여 유형이 달라집니다."],
  },
  {
    id: "disability-allowance",
    group: "disability",
    name: "차상위 장애수당",
    target: "차상위 등록장애인(중증 제외)",
    incomeCriteria: "중위 50% 이하",
    supportType: "현금",
    supportSummary: "장애로 인한 추가 생활비용 보전 수당",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["장애 정도·등록 여부 확인이 필요합니다."],
  },
  {
    id: "single-parent-special",
    group: "family",
    name: "한부모가족지원 차상위 특례",
    target: "한부모·조손가구",
    incomeCriteria: "중위 52% 이하 (특례 완화 기준)",
    supportType: "현금",
    supportSummary: "아동양육비 등 한부모가족 특화 지원",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["일반 차상위 기준(50%)보다 완화된 특례 기준을 적용합니다."],
  },
  {
    id: "telecom-discount",
    group: "discount",
    name: "통신요금 감면",
    target: "차상위계층 확인자",
    incomeCriteria: "차상위계층 확인서 보유",
    supportType: "감면",
    supportSummary: "이동통신 기본료·통화료 정액 감면",
    applicationChannel: "통신사 대리점 또는 복지로 온라인 신청",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["통신사별 신청 절차가 다를 수 있습니다."],
  },
  {
    id: "electricity-discount",
    group: "discount",
    name: "전기요금 할인",
    target: "차상위계층 확인자",
    incomeCriteria: "차상위계층 확인서 보유",
    supportType: "감면",
    supportSummary: "월 전기요금 정액 할인",
    applicationChannel: "한국전력공사 또는 복지로",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["계절별 할인 한도가 다를 수 있습니다."],
  },
  {
    id: "energy-voucher",
    group: "voucher",
    name: "에너지바우처",
    target: "차상위 중 특정 요건(노인·영유아·장애인·임산부 등) 충족 가구",
    incomeCriteria: "중위 50% 이하 + 가구원 요건",
    supportType: "바우처",
    supportSummary: "냉난방비 지원 바우처",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    sourceUrl: "https://www.energyv.or.kr",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["가구원 특성 요건 충족 여부를 함께 확인해야 합니다."],
  },
  {
    id: "culture-card",
    group: "voucher",
    name: "문화누리카드",
    target: "기초·차상위",
    incomeCriteria: "차상위계층 확인서 보유",
    supportType: "바우처",
    supportSummary: "문화·여행·체육 활동비 바우처",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    sourceUrl: "https://www.mnuri.kr",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["연간 미사용 잔액은 소멸될 수 있습니다."],
  },
  {
    id: "lifelong-education-voucher",
    group: "education",
    name: "평생교육바우처",
    target: "차상위 등 저소득 성인",
    incomeCriteria: "중위 50% ~ 65% 이하 (사업 공고 기준)",
    supportType: "바우처",
    supportSummary: "평생교육 강좌 수강료 지원",
    applicationChannel: "국가평생교육진흥원",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["매년 모집 시기와 예산이 제한적입니다."],
  },
  {
    id: "priority-childcare",
    group: "childcare",
    name: "우선돌봄 차상위",
    target: "만 12세 이하 아동을 양육하는 차상위 가구",
    incomeCriteria: "중위 50% 이하",
    supportType: "현금",
    supportSummary: "아동양육비 등 돌봄 지원",
    applicationChannel: "복지로 또는 주민센터",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 공고 확인 필요",
    notes: ["지자체별 추가 지원 여부를 함께 확인하세요."],
  },
];
```

### 5-4. 확인서 발급 절차

```ts
export const NPT_APPLICATION_STEPS: NptApplicationStep[] = [
  { id: "step-1", step: 1, title: "신청", desc: "주소지 읍면동 주민센터 방문 또는 복지로 온라인 신청" },
  { id: "step-2", step: 2, title: "소득·재산 조사", desc: "소득인정액 산정을 위한 소득·재산·부채 자료 제출" },
  { id: "step-3", step: 3, title: "심사", desc: "중위소득 50% 이하 여부 및 기초생활수급자 해당 여부 확인" },
  { id: "step-4", step: 4, title: "확인서 발급", desc: "차상위계층 확인서 발급, 유효기간 내 개별 사업 신청 시 활용" },
  { id: "step-5", step: 5, title: "개별 사업 신청", desc: "확인서를 근거로 통신비·전기요금·바우처 등 개별 혜택 별도 신청" },
];
```

### 5-5. 대상별 추천 카드

```ts
export const NPT_AUDIENCE_RECOMMENDATIONS: NptAudienceRecommendation[] = [
  {
    id: "rejected-basic-livelihood",
    audience: "기초수급 탈락 통보 받은 가구",
    firstCheck: ["차상위계층 확인서 발급"],
    reason: "기초수급 탈락은 자동으로 차상위 전환되지 않으므로 별도 신청이 필요합니다.",
    ctaLabel: "수급자격 재확인",
    ctaHref: "/tools/welfare-benefit-eligibility/",
  },
  {
    id: "chronic-illness",
    audience: "만성질환자가 있는 가구",
    firstCheck: ["차상위 본인부담경감"],
    reason: "질환별 의료비 본인부담을 경감받을 수 있는지 우선 확인합니다.",
    ctaLabel: "의료비 혜택 확인",
    ctaHref: "#medical-jobs",
  },
  {
    id: "employable-member",
    audience: "근로 가능한 저소득 가구원",
    firstCheck: ["차상위 자활사업"],
    reason: "자활근로 참여로 소득 보전과 자산형성을 함께 도모할 수 있습니다.",
    ctaLabel: "자활 지원 확인",
    ctaHref: "#medical-jobs",
  },
  {
    id: "single-parent",
    audience: "한부모·조손가구",
    firstCheck: ["한부모가족지원 차상위 특례"],
    reason: "일반 차상위 기준보다 완화된 중위 52% 특례 기준이 적용됩니다.",
    ctaLabel: "가족 지원 확인",
    ctaHref: "#family-childcare",
  },
  {
    id: "high-energy-bill",
    audience: "냉난방비 부담이 큰 가구",
    firstCheck: ["에너지바우처", "전기요금 할인"],
    reason: "가구원 요건을 충족하면 바우처와 정액 할인을 함께 받을 수 있습니다.",
    ctaLabel: "바우처 신청 확인",
    ctaHref: "#discount-voucher",
  },
];
```

---

## 6. 페이지 IA

1. **Hero**
   - 제목: "2026 차상위계층 혜택 총정리"
   - 설명: "기초생활수급자는 아니지만 소득이 낮은 가구가 확인할 수 있는 혜택을 한 번에 정리합니다."
   - 배지: `2026`, `복지/지원금`, `공식 기준`, `확인 필요 포함`
2. **InfoNotice**
   - 차상위계층 확인 기준은 2026년 기준 중위소득 50% 공식 수치 적용
   - 세부 혜택별 소득기준·금액은 사업 공고 확인 필요
   - "확인서 = 자동 혜택"이 아니며, 개별 신청이 필요함
3. **TrustPanel(DesignTrustPanel)**
   - 공식: 기준 중위소득·차상위 확인 기준(50%)
   - 확인 필요: 세부 혜택 11종 소득기준·금액
   - 추정: 없음(이 리포트는 월 환산 예시를 최소화)
4. **핵심 요약 카드 4개**
5. **섹션 ① 차상위계층이란 — 기초수급자와 무엇이 다른가**
6. **섹션 ② 차상위계층 확인서 발급 방법** (5단계 플로우)
7. **섹션 ③ 의료·자활 관련 혜택** (id: `medical-jobs`)
8. **섹션 ④ 감면형 생활비 혜택** (id: `discount-voucher` 상단)
9. **섹션 ⑤ 바우처형 혜택** (id: `discount-voucher` 하단, 같은 필터 그룹으로 통합)
10. **섹션 ⑥ 가족·아동 특화 차상위 지원** (id: `family-childcare`)
11. **중간 CTA** — 복지급여 수급자격 계산기
12. **섹션 ⑦ 차상위계층 혜택 한눈에 보기 표** (필터 가능한 11종 카드)
13. **섹션 ⑧ 기초수급 탈락 후 차상위로 넘어가는 절차**
14. **섹션 ⑨ FAQ**
15. **공공 상담 CTA**
16. **섹션 ⑩ 관련 리포트·계산기 내부링크**
17. **SeoContent** — intro 4문단, FAQ 5개, related 4개

> 참고: 계획 문서(plan doc)의 섹션 ③~⑤(의료·감면·바우처)는 실제 구현에서 `NPT_BENEFIT_ITEMS`의 `group` 필터로 통합 렌더링하며, 앵커 id만 그룹별로 분리해 목차 이동을 지원한다.

---

## 7. 핵심 요약 카드

| 카드 제목 | 내용 | 배지 |
|---|---|---|
| 차상위계층 확인 기준(4인) | 3,247,369원 (중위 50%) | 공식 |
| 기초수급과의 차이 | 현금 급여 vs 감면·바우처 중심 | 공식 |
| 세부 혜택 | 의료·자활·통신·전기·바우처 등 11종 | 확인 필요 포함 |
| 확인서 발급처 | 복지로 또는 주민센터 | 공식 |

---

## 8. 섹션별 마크업 설계

### 섹션 ① 차상위계층이란

```astro
<section class="content-section npt-section" id="what-is-near-poverty">
  <div class="section-header section-header--compact">
    <p class="section-eyebrow">기초 개념</p>
    <h2>차상위계층은 기초수급자와 무엇이 다른가</h2>
    <p>차상위계층은 기초생활수급자 기준(중위 32~50%)은 넘지만, 소득이 낮아 감면·바우처 혜택을 받을 수 있는 계층입니다.</p>
  </div>

  <div class="npt-table-wrap">
    <table class="npt-comparison-table">
      <thead>
        <tr><th>구분</th><th>기초생활수급자</th><th>차상위계층</th></tr>
      </thead>
      <tbody>
        {NPT_COMPARISON_ROWS.map(row => (
          <tr>
            <td>{row.label}</td>
            <td>{row.basicLivelihood}</td>
            <td class="is-highlight">{row.nearPoverty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div class="npt-table-wrap">
    <table class="npt-threshold-table">
      <!-- GWB_MEDIAN_INCOME_ROWS 1~6인 × education(50%) 컬럼을
           "차상위계층 확인 기준"으로 리네이밍해 표시 -->
    </table>
  </div>
</section>
```

### 섹션 ② 확인서 발급 절차

```astro
<section class="content-section npt-section" id="how-to-apply">
  <div class="section-header section-header--compact">
    <p class="section-eyebrow">발급 절차</p>
    <h2>차상위계층 확인서, 어떻게 받나요</h2>
  </div>

  <ol class="npt-step-list">
    {NPT_APPLICATION_STEPS.map(step => (
      <li class="npt-step-card">
        <span class="npt-step-number">{step.step}</span>
        <h3>{step.title}</h3>
        <p>{step.desc}</p>
      </li>
    ))}
  </ol>
</section>
```

### 중간 계산기 CTA

```astro
<section class="npt-calculator-cta" aria-labelledby="npt-calc-cta-title">
  <p class="npt-cta-eyebrow">직접 확인하기</p>
  <h2 id="npt-calc-cta-title">우리 집 소득인정액으로 수급·차상위 가능성을 계산해보세요</h2>
  <p>가구원 수, 소득, 재산 정보를 입력하면 기초수급과 차상위 중 어디에 해당할 가능성이 높은지 확인할 수 있습니다.</p>
  <a href="/tools/welfare-benefit-eligibility/" class="npt-cta-button">복지급여 수급자격 계산기 열기</a>
</section>
```

### 섹션 ⑦ 차상위계층 혜택 한눈에 보기 (필터형 카드)

```astro
<section class="content-section npt-section" id="benefit-list">
  <div class="npt-filter-row" role="tablist" aria-label="차상위 혜택 분류">
    <button class="npt-filter-btn is-active" data-npt-filter="all">전체</button>
    <button class="npt-filter-btn" data-npt-filter="medical">의료·자활</button>
    <button class="npt-filter-btn" data-npt-filter="discount">감면</button>
    <button class="npt-filter-btn" data-npt-filter="voucher">바우처</button>
    <button class="npt-filter-btn" data-npt-filter="family">가족·돌봄</button>
  </div>

  <div class="npt-benefit-grid">
    {NPT_BENEFIT_ITEMS.map(item => (
      <article class="npt-benefit-card" data-npt-group={filterGroup(item.group)}>
        <div class="npt-benefit-card__top">
          <span class={`npt-source-badge npt-source-badge--${sourceClass(item.sourceLabel)}`}>{item.sourceLabel}</span>
        </div>
        <h3>{item.name}</h3>
        <p>{item.supportSummary}</p>
        <dl>
          <div><dt>대상</dt><dd>{item.target}</dd></div>
          <div><dt>소득기준</dt><dd>{item.incomeCriteria}</dd></div>
          <div><dt>신청처</dt><dd>{item.applicationChannel}</dd></div>
        </dl>
      </article>
    ))}
  </div>
</section>
```

`filterGroup()`은 `NptGroup`(9종)을 필터 버튼 4종(`medical`=medical+jobs+disability, `discount`=discount, `voucher`=voucher+education, `family`=family+childcare)으로 매핑하는 astro frontmatter 헬퍼 함수다.

### 섹션 ⑧ 기초수급 탈락 후 차상위로 넘어가는 절차

```astro
<section class="content-section npt-section" id="fallback-flow">
  <div class="npt-fallback-grid">
    <article class="npt-fallback-card">
      <span>기초생활보장 탈락 통보</span>
      <strong>차상위계층 확인 신청</strong>
      <p>자동 전환되지 않으므로 주민센터·복지로에서 별도로 신청해야 합니다.</p>
    </article>
    <article class="npt-fallback-card">
      <span>차상위 기준에서도 탈락</span>
      <strong>긴급복지지원·지자체 개별 지원</strong>
      <p>위기 사유가 있다면 긴급복지지원을 우선 확인하세요.</p>
    </article>
  </div>
</section>
```

---

## 9. 차트 및 JS 설계

### 9-1. 기초수급 4급여 vs 차상위 확인 기준 비교 차트

```js
new Chart(thresholdCtx, {
  type: "bar",
  data: {
    labels: ["생계급여 32%", "의료급여 40%", "주거급여 48%", "차상위 확인 50%"],
    datasets: [{
      label: "4인 가구 기준",
      data: [fourPerson.livelihood, fourPerson.medical, fourPerson.housing, fourPerson.education],
      backgroundColor: ["#0F6E56", "#1A7F64", "#4DC4A0", "#D98B3C"],
      borderRadius: 4,
    }],
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { callback: v => `${Math.round(v / 10000)}만` } } },
  },
});
```

차상위 확인 기준(50%) 막대만 강조 색상(`#D98B3C`)으로 구분해 기초수급 3급여와 시각적으로 대비시킨다.

### 9-2. 카테고리 필터

```js
(() => {
  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }

  function setFilter(group) {
    qa("[data-npt-filter]").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.nptFilter === group);
      btn.setAttribute("aria-selected", String(btn.dataset.nptFilter === group));
    });

    qa("[data-npt-group]").forEach(card => {
      const visible = group === "all" || card.dataset.nptGroup === group;
      card.hidden = !visible;
    });
  }

  qa("[data-npt-filter]").forEach(btn => {
    btn.addEventListener("click", () => setFilter(btn.dataset.nptFilter));
  });

  if (window.Chart) {
    const thresholdCanvas = q("#nptThresholdChart");
    if (thresholdCanvas) renderThresholdChart(thresholdCanvas);
  }
})();
```

---

## 10. SCSS 설계

`_near-poverty-tier-benefits-2026.scss`는 `_2026-government-welfare-benefits.scss`의 클래스 구조를 `gwb-` → `npt-` prefix로 그대로 재사용한다(요약 카드, 표, 필터 버튼, 배지, CTA 박스 패턴 동일). 추가·변경되는 클래스만 아래에 명시한다.

```scss
.npt-page {
  .npt-comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.86rem;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: left;
    }

    th {
      background: #f8fcfa;
      font-weight: 800;
      color: #374151;
    }

    td.is-highlight {
      color: #0f6e56;
      font-weight: 800;
    }
  }

  .npt-step-list {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    margin: 0;
    padding: 0;
    list-style: none;

    @media (min-width: 760px) {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }

  .npt-step-card {
    position: relative;
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #fff;

    h3 {
      margin: 8px 0 6px;
      font-size: 0.94rem;
      color: #111827;
    }

    p {
      margin: 0;
      font-size: 0.8rem;
      color: #6b7280;
      line-height: 1.55;
    }
  }

  .npt-step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #0f6e56;
    color: #fff;
    font-weight: 900;
    font-size: 0.82rem;
  }

  .npt-fallback-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;

    @media (min-width: 760px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .npt-fallback-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #fff;

    span {
      display: block;
      font-size: 0.74rem;
      font-weight: 800;
      color: #6b7280;
      margin-bottom: 6px;
    }

    strong {
      display: block;
      color: #111827;
      font-size: 1rem;
      margin-bottom: 6px;
    }

    p {
      margin: 0;
      color: #4b5563;
      font-size: 0.86rem;
      line-height: 1.6;
    }
  }
}
```

나머지(`.npt-summary-grid`, `.npt-chart-wrap`, `.npt-table-wrap`, `.npt-filter-row/btn`, `.npt-benefit-grid/card`, `.npt-source-badge`, `.npt-calculator-cta`, `.npt-cta-button`)는 `_2026-government-welfare-benefits.scss`의 동일 규칙을 클래스명만 치환해 그대로 가져온다.

---

## 11. SEO 설계

```text
title: 차상위계층 혜택 2026 완전 정리 - 기초수급 탈락 후 받을 수 있는 지원
description: 기초생활수급자가 아니어도 차상위계층 확인서로 받을 수 있는 의료비 경감, 통신비·전기요금 감면, 문화누리카드, 자활사업까지 2026년 기준으로 한 번에 정리했습니다.
H1: 2026 차상위계층 혜택 총정리
```

JSON-LD:
- `Article`
- `FAQPage`

키워드:
- 차상위계층 혜택
- 차상위계층 확인서 발급
- 차상위계층 기준
- 기초수급 탈락 후 지원
- 차상위 통신비 감면
- 차상위 자활사업

---

## 12. SeoContent 초안

### introTitle

`2026 차상위계층 혜택 총정리 — 확인 기준부터 세부 혜택 신청까지`

### intro

1. 기초생활보장 심사에서 탈락했다고 해서 받을 수 있는 지원이 없는 것은 아닙니다. 소득이 기준 중위소득 50% 안팎으로 낮다면 차상위계층 확인서를 통해 의료비 경감, 통신비·전기요금 감면, 문화누리카드 등 다양한 혜택을 확인할 수 있습니다.

2. 차상위계층은 기초생활수급자와 다릅니다. 수급자는 생계·의료·주거·교육급여처럼 현금성 급여를 받지만, 차상위계층은 대부분 감면·바우처·서비스 형태로 지원받습니다. 2026년 4인 가구 기준 차상위계층 확인 기준은 월 3,247,369원(중위소득 50%)입니다.

3. 차상위계층 확인서는 그 자체로 혜택을 자동 지급하지 않습니다. 본인부담경감, 자활사업, 통신비 감면, 전기요금 할인, 에너지바우처, 문화누리카드 등 개별 사업마다 별도 신청과 심사가 필요하며, 사업에 따라 중위 50%가 아닌 52% 등 완화된 특례 기준이 적용되기도 합니다.

4. 이 리포트는 2026년 공식 기준 중위소득과 차상위 관련 제도별 공고를 바탕으로 작성된 참고 자료입니다. 실제 확인서 발급 여부와 개별 혜택 지급 여부는 소득·재산 조사와 사업별 심사 결과에 따라 달라질 수 있습니다. 본인 가구 기준으로 먼저 확인하려면 복지급여 수급자격 계산기를 함께 사용하세요.

### inputPoints

- 2026년 차상위계층 확인 기준(중위소득 50%)을 가구원 수별로 확인할 수 있습니다.
- 기초생활수급자와 차상위계층의 차이, 세부 혜택 11종을 한 페이지에서 비교할 수 있습니다.
- 확인서 발급 절차와 기초수급 탈락 후 대안 경로를 확인할 수 있습니다.

### criteria

- 차상위계층 확인 기준(중위 50%)은 보건복지부 2026년 기준 중위소득을 사용합니다.
- 세부 혜택별 소득기준·금액은 사업별 공식 공고 확인이 필요합니다.
- 실제 확인서 발급과 개별 혜택 신청은 복지로, 정부24, 주민센터에서 확인해야 합니다.

### FAQ

```ts
export const NPT_FAQ: NptFaq[] = [
  {
    question: "차상위계층과 기초생활수급자는 무엇이 다른가요?",
    answer: "기초생활수급자는 생계·의료·주거·교육급여 등 현금성 급여를 받는 저소득 가구이고, 차상위계층은 수급자 기준(중위 32~50%)은 넘지만 소득이 낮아 의료비 경감, 통신비·전기요금 감면, 바우처 등 개별 사업 혜택을 받을 수 있는 계층입니다.",
  },
  {
    question: "차상위계층 확인서만 있으면 모든 혜택을 다 받을 수 있나요?",
    answer: "아닙니다. 확인서는 차상위 자격을 증명하는 전제 조건일 뿐이며, 본인부담경감·자활사업·통신비 감면 등 개별 사업마다 별도 신청과 심사가 필요합니다.",
  },
  {
    question: "차상위계층 기준은 어떻게 되나요?",
    answer: "대체로 기준 중위소득 50% 이하이면서 기초생활수급자가 아닌 가구가 해당됩니다. 다만 한부모가족지원처럼 일부 사업은 중위 52%까지 완화된 특례 기준을 적용하므로 사업별 공고 확인이 필요합니다.",
  },
  {
    question: "기초수급 심사에서 탈락하면 차상위로 자동 전환되나요?",
    answer: "자동 전환되지 않습니다. 탈락 통보를 받은 후 주민센터나 복지로에서 차상위계층 확인을 별도로 신청해야 합니다.",
  },
  {
    question: "차상위 기준에서도 벗어나면 받을 수 있는 지원이 없나요?",
    answer: "긴급복지지원, 지자체 개별 지원제도 등 추가 대안이 있습니다. 소득이 기준을 조금 넘더라도 위기 사유가 있다면 긴급복지지원을 먼저 확인하는 것이 좋습니다.",
  },
];
```

---

## 13. 관련 링크

```ts
export const NPT_RELATED_LINKS: NptRelatedLink[] = [
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    desc: "가구원 수, 소득, 재산을 입력해 수급·차상위 가능성을 간이 확인",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    desc: "생계·주거·청년·가족·장애·바우처 20개 제도 전체 비교",
  },
  {
    href: "/tools/livelihood-benefit-income-recognition/",
    label: "생계급여 소득인정액 계산기",
    desc: "생계급여와 차상위 경계선 비교",
  },
  {
    href: "/tools/housing-benefit-income-recognition/",
    label: "주거급여 소득인정액 계산기",
    desc: "주거급여 탈락 시 차상위 대안 연결",
  },
];
```

---

## 14. 등록 작업

```ts
// src/data/reports.ts
{
  slug: "near-poverty-tier-benefits-2026",
  title: "2026 차상위계층 혜택 총정리",
  description: "기초생활수급자는 아니지만 소득이 낮은 가구가 확인할 수 있는 차상위계층 혜택 11종을 2026년 기준으로 비교합니다.",
  category: "복지/지원금",
  order: 31.7,
  badges: ["복지", "차상위", "2026", "공식 기준"],
}
```

`order`는 상위 허브(`2026-government-welfare-benefits`, order 31.6) 바로 다음에 오도록 소수점으로 배치해 리스트에서 인접 노출되게 한다.

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/reports/near-poverty-tier-benefits-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 15. QA 체크리스트

- [ ] 4인 가구 차상위계층 확인 기준이 `3,247,369원`으로 표시됨 (GWB `education` 필드 재사용, 재계산하지 않음)
- [ ] 기초수급 vs 차상위 비교표에서 "현금 급여 vs 감면·바우처" 구분이 명확함
- [ ] 세부 혜택 11종 카드가 카테고리 필터(의료·자활 / 감면 / 바우처 / 가족·돌봄)로 정상 노출/숨김
- [ ] 한부모가족지원 차상위 특례(중위 52%)가 일반 차상위 기준(50%)과 다르다는 점이 별도 표시됨
- [ ] 모든 혜택 카드에 `공식`, `확인 필요` 배지 표시 (이 리포트는 `추정` 라벨 최소화)
- [ ] "확인서만 받으면 자동 혜택"이라는 단정 표현이 없음
- [ ] Chart.js 임계값 비교 차트가 데스크톱/모바일에서 정상 렌더링, 차상위 막대가 시각적으로 구분됨
- [ ] 계산기 CTA 링크 `/tools/welfare-benefit-eligibility/` 정상
- [ ] 상위 허브 리포트 `/reports/2026-government-welfare-benefits/`로의 상호 링크 정상 (허브 페이지에도 이 리포트 링크 추가 검토)
- [ ] 공공 상담 CTA는 고금리 대출성 문구 없이 복지로·주민센터 중심
- [ ] FAQ 5개 이상 표시 및 FAQPage JSON-LD 포함
- [ ] 모바일 360px에서 카드·표·필터 버튼이 겹치지 않음 (특히 `npt-comparison-table`, `npt-step-list`는 `overflow-x: auto` wrap 적용 여부 확인)
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
