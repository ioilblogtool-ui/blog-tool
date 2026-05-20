# 2026 정부 복지지원금 완전 정복 — 설계 문서

> 작성일: 2026-05-19
> 콘텐츠 유형: `/reports/` 심층 리포트
> 구현 기준: 2026년 기준 중위소득·기초생활보장 선정기준·생애주기별 복지지원금 20개 비교 + 복지급여 수급자격 계산기 CTA

---

## 1. 문서 개요

- 구현 대상: `2026 정부 복지지원금 완전 정복`
- slug: `2026-government-welfare-benefits`
- URL: `/reports/2026-government-welfare-benefits/`
- 카테고리: 복지/지원금
- 핵심 검색 의도: "2026 정부 지원금 종류 총정리", "2026 복지 지원금", "기초생활수급자 혜택 2026", "차상위계층 혜택", "청년 지원금 2026"
- 핵심 CTA: `/tools/welfare-benefit-eligibility/`
- 핵심 출력: 2026 기준 중위소득표, 급여별 선정기준, 복지제도 20개 비교, 대상별 추천 지원, 신청 서류 체크리스트, 수급 탈락 시 대안

중요 원칙:
- 취약계층 대상 콘텐츠이므로 과장 표현과 고위험 대출 CTA를 피한다.
- 모든 금액과 조건에는 `공식`, `확인 필요`, `추정`, `예고` 배지를 붙인다.
- 중앙정부 제도와 지자체 제도는 분리한다.
- "받을 수 있다"가 아니라 "확인할 수 있다", "가능성이 있다"로 표현한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    governmentWelfareBenefits2026.ts   ← 기준표, 지원금 20개, 추천 카드, FAQ, 관련 링크
  pages/
    reports/
      2026-government-welfare-benefits.astro

public/
  scripts/
    2026-government-welfare-benefits.js ← Chart.js 2개 + 카테고리 필터

src/styles/scss/pages/
  _2026-government-welfare-benefits.scss
```

추가 등록:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/2026-government-welfare-benefits';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지.
- 클래스: `report-page gwb-page`
- SCSS prefix: `gwb-`
- Chart.js 사용:
  - 기준 중위소득 2025 vs 2026 비교 차트
  - 4인 가구 급여별 선정기준 차트
- Vanilla JS 사용:
  - 20개 제도 카테고리 필터
  - 신청 우선순위 카드 필터
- 리포트 톤은 공공 안내형. 광고성 문구보다 "확인", "신청", "서류 준비" 중심.

---

## 4. 데이터 모델

```ts
// src/data/governmentWelfareBenefits2026.ts

export type SourceLabel = '공식' | '확인 필요' | '추정' | '예고' | '참고';
export type WelfareGroup =
  | 'basic'
  | 'low-income'
  | 'family'
  | 'youth'
  | 'disability'
  | 'senior'
  | 'voucher'
  | 'region';

export type Priority = '최우선' | '높음' | '상황별' | '계절형' | '확인';

export interface MedianIncomeRow {
  householdSize: number;
  median2025: number;
  median2026: number;
  increaseRate: number;
  livelihood: number;
  medical: number;
  housing: number;
  education: number;
}

export interface WelfareBenefitItem {
  id: string;
  group: WelfareGroup;
  name: string;
  target: string;
  incomeCriteria: string;
  supportType: '현금' | '바우처' | '감면' | '대출/금융' | '서비스' | '혼합';
  supportSummary: string;
  applicationChannel: string;
  priority: Priority;
  sourceLabel: SourceLabel;
  sourceUrl?: string;
  updatedAt: string;
  notes: string[];
}

export interface AudienceRecommendation {
  id: string;
  audience: string;
  firstCheck: string[];
  reason: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ApplicationChecklist {
  id: string;
  label: string;
  description: string;
  requiredFor: string[];
}

export interface ChangeItem2026 {
  id: string;
  title: string;
  desc: string;
  label: SourceLabel;
  impact: 'high' | 'medium' | 'low';
}

export interface ExternalSourceLink {
  source: string;
  title: string;
  href: string;
  desc: string;
}

export interface GwbFaq {
  question: string;
  answer: string;
}

export interface GwbRelatedLink {
  href: string;
  label: string;
  desc?: string;
}
```

---

## 5. 핵심 데이터 상수

### 5-1. 기준 중위소득 및 급여별 선정기준

```ts
export const GWB_MEDIAN_INCOME_ROWS: MedianIncomeRow[] = [
  {
    householdSize: 1,
    median2025: 2392013,
    median2026: 2564238,
    increaseRate: 0.0720,
    livelihood: 820556,
    medical: 1025695,
    housing: 1230834,
    education: 1282119,
  },
  {
    householdSize: 2,
    median2025: 3932658,
    median2026: 4199292,
    increaseRate: 0.0677,
    livelihood: 1343773,
    medical: 1679717,
    housing: 2015660,
    education: 2099646,
  },
  {
    householdSize: 3,
    median2025: 5025353,
    median2026: 5359036,
    increaseRate: 0.0663,
    livelihood: 1714892,
    medical: 2143614,
    housing: 2572337,
    education: 2679518,
  },
  {
    householdSize: 4,
    median2025: 6097773,
    median2026: 6494738,
    increaseRate: 0.0651,
    livelihood: 2078316,
    medical: 2597895,
    housing: 3117474,
    education: 3247369,
  },
  {
    householdSize: 5,
    median2025: 7108192,
    median2026: 7556719,
    increaseRate: 0.0631,
    livelihood: 2418150,
    medical: 3022688,
    housing: 3627225,
    education: 3778360,
  },
  {
    householdSize: 6,
    median2025: 8064805,
    median2026: 8555952,
    increaseRate: 0.0609,
    livelihood: 2737905,
    medical: 3422381,
    housing: 4106857,
    education: 4277976,
  },
];
```

### 5-2. 복지지원금 20개

```ts
export const GWB_BENEFIT_ITEMS: WelfareBenefitItem[] = [
  {
    id: 'livelihood-benefit',
    group: 'basic',
    name: '생계급여',
    target: '소득인정액이 기준 중위소득 32% 이하인 가구',
    incomeCriteria: '중위 32% 이하',
    supportType: '현금',
    supportSummary: '선정기준에서 소득인정액을 뺀 금액을 생계급여로 지급',
    applicationChannel: '복지로 또는 주소지 읍면동 주민센터',
    priority: '최우선',
    sourceLabel: '공식',
    sourceUrl: 'https://mw.go.kr/menu.es?mid=a10708010300',
    updatedAt: '2026년 기준',
    notes: ['실제 지급액은 소득인정액 조사 결과에 따라 달라집니다.'],
  },
  {
    id: 'medical-benefit',
    group: 'basic',
    name: '의료급여',
    target: '소득인정액이 기준 중위소득 40% 이하인 가구',
    incomeCriteria: '중위 40% 이하',
    supportType: '서비스',
    supportSummary: '의료비 본인부담을 낮춰주는 기초생활보장 급여',
    applicationChannel: '복지로 또는 주소지 읍면동 주민센터',
    priority: '최우선',
    sourceLabel: '공식',
    sourceUrl: 'https://mw.go.kr/menu.es?mid=a10708010300',
    updatedAt: '2026년 기준',
    notes: ['부양의무자 기준 등 별도 확인이 필요할 수 있습니다.'],
  },
  {
    id: 'housing-benefit',
    group: 'basic',
    name: '주거급여',
    target: '소득인정액이 기준 중위소득 48% 이하인 임차·자가 가구',
    incomeCriteria: '중위 48% 이하',
    supportType: '현금',
    supportSummary: '임차료 또는 자가 수선유지비 지원',
    applicationChannel: '복지로 또는 주소지 읍면동 주민센터',
    priority: '최우선',
    sourceLabel: '공식',
    sourceUrl: 'https://mw.go.kr/menu.es?mid=a10708010300',
    updatedAt: '2026년 기준',
    notes: ['지역·가구원 수별 기준임대료는 별도 확인이 필요합니다.'],
  },
  {
    id: 'education-benefit',
    group: 'basic',
    name: '교육급여',
    target: '소득인정액이 기준 중위소득 50% 이하인 학생 가구',
    incomeCriteria: '중위 50% 이하',
    supportType: '바우처',
    supportSummary: '교육활동지원비 등 학생 교육비 지원',
    applicationChannel: '복지로 또는 교육청 안내',
    priority: '높음',
    sourceLabel: '공식',
    sourceUrl: 'https://mw.go.kr/menu.es?mid=a10708010300',
    updatedAt: '2026년 기준',
    notes: ['학생 자녀가 있는 가구는 별도 확인이 필요합니다.'],
  },
  {
    id: 'near-poor',
    group: 'low-income',
    name: '차상위계층 확인',
    target: '수급자 기준은 넘지만 소득이 낮은 가구',
    incomeCriteria: '대체로 중위 50% 전후',
    supportType: '감면',
    supportSummary: '의료비 경감, 통신비·전기요금 감면, 바우처 등',
    applicationChannel: '복지로 또는 주민센터',
    priority: '높음',
    sourceLabel: '확인 필요',
    updatedAt: '2026년 공고 확인 필요',
    notes: ['혜택 항목별로 세부 기준이 다릅니다.'],
  },
  {
    id: 'emergency-welfare',
    group: 'low-income',
    name: '긴급복지지원',
    target: '실직·질병·휴폐업 등 갑작스러운 위기 가구',
    incomeCriteria: '위기 사유와 소득·재산 기준 동시 확인',
    supportType: '현금',
    supportSummary: '생계·의료·주거 등 긴급 지원',
    applicationChannel: '주민센터 또는 보건복지상담센터',
    priority: '높음',
    sourceLabel: '확인 필요',
    updatedAt: '2026년 공고 확인 필요',
    notes: ['위기 사유 증빙이 중요합니다.'],
  },
  // 가족 4개, 청년 4개, 장애 2개, 노인 1개, 바우처 3개를 동일 구조로 추가
];
```

실제 데이터 파일에는 20개 전부 입력한다. 문서상 생략된 나머지 항목:
- 한부모가족 지원
- 다자녀 지원
- 아동수당
- 부모급여
- 청년도약계좌
- 청년월세지원
- 청년내일저축계좌
- 국민취업지원제도
- 장애인연금
- 장애수당
- 기초연금
- 에너지바우처
- 문화누리카드
- 농식품바우처·푸드뱅크

### 5-3. 대상별 추천 카드

```ts
export const GWB_AUDIENCE_RECOMMENDATIONS: AudienceRecommendation[] = [
  {
    id: 'low-income-single',
    audience: '소득이 낮은 1인 가구',
    firstCheck: ['생계급여', '주거급여', '긴급복지지원'],
    reason: '소득인정액이 낮다면 생계·주거급여를 먼저 확인하고, 갑작스러운 위기 사유가 있다면 긴급복지도 함께 확인합니다.',
    ctaLabel: '수급자격 계산하기',
    ctaHref: '/tools/welfare-benefit-eligibility/',
  },
  {
    id: 'young-renter',
    audience: '월세 사는 청년',
    firstCheck: ['청년월세지원', '주거급여', '청년도약계좌'],
    reason: '주거비 부담이 큰 청년은 월세 지원과 자산형성 상품을 같이 비교하는 것이 좋습니다.',
    ctaLabel: '청년 지원 비교하기',
    ctaHref: '#youth-benefits',
  },
  {
    id: 'single-parent-family',
    audience: '자녀 있는 한부모',
    firstCheck: ['한부모가족 지원', '교육급여', '문화누리카드'],
    reason: '한부모가족 지원은 기초생활보장과 별도 기준으로 확인할 수 있습니다.',
    ctaLabel: '가족 지원 확인하기',
    ctaHref: '#family-benefits',
  },
  {
    id: 'disabled-household',
    audience: '중증장애인 가구',
    firstCheck: ['장애인연금', '의료급여', '에너지바우처'],
    reason: '장애인연금과 의료·에너지 지원은 생활비 부담을 직접 낮추는 핵심 제도입니다.',
    ctaLabel: '장애 지원 확인하기',
    ctaHref: '#disability-benefits',
  },
  {
    id: 'senior-alone',
    audience: '노인 단독 가구',
    firstCheck: ['기초연금', '생계급여', '의료급여'],
    reason: '기초연금 수급 여부와 별개로 소득인정액에 따라 생계·의료급여도 확인할 수 있습니다.',
    ctaLabel: '노후 지원 확인하기',
    ctaHref: '#senior-benefits',
  },
];
```

### 5-4. 신청 서류 체크리스트

```ts
export const GWB_APPLICATION_CHECKLIST: ApplicationChecklist[] = [
  {
    id: 'id-card',
    label: '신분증',
    description: '주민등록증, 운전면허증 등 본인 확인 서류',
    requiredFor: ['공통'],
  },
  {
    id: 'bankbook',
    label: '통장 사본',
    description: '급여·지원금 지급 계좌 확인용',
    requiredFor: ['현금성 급여', '바우처 일부'],
  },
  {
    id: 'lease',
    label: '임대차계약서',
    description: '주거급여, 청년월세지원 등 주거비 지원 신청 시 필요',
    requiredFor: ['주거급여', '청년월세지원'],
  },
  {
    id: 'family',
    label: '가족관계증명서',
    description: '가구원·한부모·부양 관계 확인',
    requiredFor: ['한부모', '가족 지원', '교육급여'],
  },
  {
    id: 'income-asset',
    label: '소득·재산 확인 자료',
    description: '근로소득, 사업소득, 금융재산, 부채 등 확인',
    requiredFor: ['기초생활보장', '차상위', '청년저축'],
  },
  {
    id: 'crisis',
    label: '위기 사유 증빙',
    description: '실직, 질병, 휴폐업, 화재 등 긴급복지 신청 사유',
    requiredFor: ['긴급복지'],
  },
];
```

---

## 6. 페이지 IA

1. **Hero**
   - 제목: "2026 정부 복지지원금 완전 정복"
   - 설명: "생계·주거·청년·한부모·장애·바우처 지원금을 한 번에 비교합니다."
   - 배지: `2026`, `복지/지원금`, `공식 기준`, `확인 필요 포함`
2. **InfoNotice**
   - 2026년 기준 중위소득 공식 수치 적용
   - 지원금·바우처 금액은 제도별 공고 확인 필요
   - 실제 수급 여부는 복지로·주민센터 확인
3. **TrustPanel**
   - 공식: 기준 중위소득·급여별 선정기준
   - 확인 필요: 청년·바우처·지역 제도
   - 추정: 월 환산액·실수령 비교
4. **핵심 요약 카드 4개**
5. **섹션 ① 2026 기준 중위소득 변화**
6. **섹션 ② 생계·의료·주거·교육급여 기준표**
7. **중간 CTA** — 복지급여 수급자격 계산기
8. **섹션 ③ 복지지원금 20개 한눈에 보기**
9. **섹션 ④ 차상위계층 혜택**
10. **섹션 ⑤ 청년 대상 지원금 비교**
11. **섹션 ⑥ 한부모·다자녀·장애인 특화 지원**
12. **섹션 ⑦ 에너지·문화·식품 바우처**
13. **섹션 ⑧ 지역별 추가 지원금**
14. **섹션 ⑨ 신청 방법과 서류 체크리스트**
15. **섹션 ⑩ 수급 탈락 시 대안 지원**
16. **섹션 ⑪ 2026 신설·확대 변경 사항**
17. **공공 상담 CTA**
18. **섹션 ⑫ 관련 계산기·시리즈 링크**
19. **SeoContent** — intro 5문단, FAQ 8개, related 6개

---

## 7. 핵심 요약 카드

| 카드 제목 | 내용 | 배지 |
|---|---|---|
| 2026년 4인 기준 중위소득 | 6,494,738원 | 공식 |
| 4인 생계급여 선정기준 | 2,078,316원 | 공식 |
| 급여별 기준 | 생계 32%·의료 40%·주거 48%·교육 50% | 공식 |
| 비교 대상 | 핵심 복지제도 20개 | 확인 필요 포함 |

---

## 8. 섹션별 마크업 설계

### 섹션 ① 기준 중위소득 변화

```astro
<section class="content-section gwb-section" id="median-income">
  <div class="section-header section-header--compact">
    <p class="section-eyebrow">2026 기준</p>
    <h2>기준 중위소득이 얼마나 올랐나</h2>
    <p>2026년 4인 가구 기준 중위소득은 6,494,738원으로, 2025년보다 6.51% 인상됐습니다.</p>
  </div>

  <div class="gwb-chart-wrap">
    <canvas id="gwbMedianChart" data-chart={JSON.stringify(GWB_MEDIAN_INCOME_ROWS)}></canvas>
  </div>

  <div class="gwb-table-wrap">
    <table class="gwb-median-table">
      <!-- 1~6인 2025/2026/증가율 표 -->
    </table>
  </div>
</section>
```

### 섹션 ② 급여별 선정기준

```astro
<section class="content-section gwb-section" id="basic-benefits">
  <div class="section-header section-header--compact">
    <p class="section-eyebrow">기초생활보장</p>
    <h2>생계·의료·주거·교육급여 기준 비교</h2>
  </div>

  <div class="gwb-threshold-grid">
    <article class="gwb-threshold-card gwb-threshold-card--primary">
      <span>생계급여</span>
      <strong>기준 중위소득 32%</strong>
      <p>4인 기준 2,078,316원</p>
    </article>
    <!-- 의료/주거/교육 반복 -->
  </div>

  <div class="gwb-chart-wrap gwb-chart-wrap--short">
    <canvas id="gwbThresholdChart"></canvas>
  </div>

  <div class="gwb-table-wrap">
    <table class="gwb-benefit-threshold-table">
      <!-- 1~6인 × 4급여 기준표 -->
    </table>
  </div>
</section>
```

### 중간 계산기 CTA

```astro
<section class="gwb-calculator-cta" aria-labelledby="gwb-calc-cta-title">
  <p class="gwb-cta-eyebrow">직접 확인하기</p>
  <h2 id="gwb-calc-cta-title">우리 집 소득인정액으로 수급 가능성을 계산해보세요</h2>
  <p>가구원 수, 소득, 재산, 자동차 정보를 입력하면 생계·의료·주거·교육급여 가능성을 한 번에 확인할 수 있습니다.</p>
  <a href="/tools/welfare-benefit-eligibility/" class="gwb-cta-button">복지급여 수급자격 계산기 열기</a>
</section>
```

### 섹션 ③ 복지지원금 20개 한눈에 보기

```astro
<section class="content-section gwb-section" id="benefit-list">
  <div class="gwb-filter-row" role="tablist" aria-label="복지지원금 분류">
    <button class="gwb-filter-btn is-active" data-gwb-filter="all">전체</button>
    <button class="gwb-filter-btn" data-gwb-filter="basic">기초생활</button>
    <button class="gwb-filter-btn" data-gwb-filter="youth">청년</button>
    <button class="gwb-filter-btn" data-gwb-filter="family">가족</button>
    <button class="gwb-filter-btn" data-gwb-filter="voucher">바우처</button>
  </div>

  <div class="gwb-benefit-grid">
    {GWB_BENEFIT_ITEMS.map(item => (
      <article class="gwb-benefit-card" data-gwb-group={item.group}>
        <div class="gwb-benefit-card__top">
          <span class={`gwb-source-badge gwb-source-badge--${sourceClass(item.sourceLabel)}`}>{item.sourceLabel}</span>
          <span class="gwb-priority-badge">{item.priority}</span>
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

### 섹션 ⑤ 청년 대상 지원금 비교

```astro
<section class="content-section gwb-section" id="youth-benefits">
  <div class="gwb-youth-comparison">
    {GWB_BENEFIT_ITEMS.filter(item => item.group === 'youth').map(item => (
      <article class="gwb-comparison-card">
        <span class="gwb-source-badge">{item.sourceLabel}</span>
        <h3>{item.name}</h3>
        <p>{item.target}</p>
        <strong>{item.supportSummary}</strong>
        <small>{item.updatedAt}</small>
      </article>
    ))}
  </div>
  <div class="gwb-notice-box gwb-notice-box--warning">
    청년 자산형성 상품은 2026년 중 개편·신설 가능성이 있어 신청 전 금융위원회·서민금융진흥원 공고를 확인하세요.
  </div>
</section>
```

### 섹션 ⑨ 신청 체크리스트

```astro
<section class="content-section gwb-section" id="application-checklist">
  <div class="gwb-checklist-grid">
    {GWB_APPLICATION_CHECKLIST.map(item => (
      <article class="gwb-checklist-card">
        <span class="gwb-check-icon" aria-hidden="true">✓</span>
        <h3>{item.label}</h3>
        <p>{item.description}</p>
        <small>{item.requiredFor.join(' · ')}</small>
      </article>
    ))}
  </div>
</section>
```

### 섹션 ⑩ 탈락 시 대안 지원

```astro
<section class="content-section gwb-section" id="fallback-supports">
  <div class="gwb-fallback-grid">
    <article class="gwb-fallback-card">
      <span>기초생활보장 탈락</span>
      <strong>차상위·긴급복지·지자체 긴급지원</strong>
      <p>기준을 조금 넘었더라도 감면·바우처·긴급지원은 별도 확인할 수 있습니다.</p>
    </article>
    <!-- 주거급여/청년/가족 반복 -->
  </div>
</section>
```

---

## 9. 차트 및 JS 설계

### 9-1. 기준 중위소득 2025 vs 2026 차트

```js
new Chart(medianCtx, {
  type: 'bar',
  data: {
    labels: rows.map(row => row.householdSize + '인'),
    datasets: [
      {
        label: '2025년',
        data: rows.map(row => row.median2025),
        backgroundColor: '#C9D8D2',
        borderRadius: 4,
      },
      {
        label: '2026년',
        data: rows.map(row => row.median2026),
        backgroundColor: '#0F6E56',
        borderRadius: 4,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${Math.round(ctx.raw / 10000).toLocaleString('ko-KR')}만 원`,
        },
      },
    },
    scales: {
      y: {
        ticks: { callback: v => `${Math.round(v / 10000)}만` },
      },
    },
  },
});
```

### 9-2. 4인 가구 급여별 선정기준 차트

```js
const four = rows.find(row => row.householdSize === 4);

new Chart(thresholdCtx, {
  type: 'bar',
  data: {
    labels: ['생계급여 32%', '의료급여 40%', '주거급여 48%', '교육급여 50%'],
    datasets: [{
      label: '4인 가구 선정기준',
      data: [four.livelihood, four.medical, four.housing, four.education],
      backgroundColor: ['#0F6E56', '#1A7F64', '#4DC4A0', '#93C5BE'],
      borderRadius: 4,
    }],
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { callback: v => `${Math.round(v / 10000)}만` } },
    },
  },
});
```

### 9-3. 카테고리 필터

```js
(() => {
  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }

  function setFilter(group) {
    qa('[data-gwb-filter]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.gwbFilter === group);
      btn.setAttribute('aria-selected', String(btn.dataset.gwbFilter === group));
    });

    qa('[data-gwb-group]').forEach(card => {
      const visible = group === 'all' || card.dataset.gwbGroup === group;
      card.hidden = !visible;
    });
  }

  function initCharts() {
    if (!window.Chart) return;
    const medianCanvas = q('#gwbMedianChart');
    const thresholdCanvas = q('#gwbThresholdChart');
    if (medianCanvas) renderMedianChart(medianCanvas);
    if (thresholdCanvas) renderThresholdChart(thresholdCanvas);
  }

  qa('[data-gwb-filter]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.gwbFilter));
  });

  initCharts();
})();
```

---

## 10. SCSS 설계

```scss
.gwb-page {
  .gwb-section {
    margin-top: 28px;
  }

  .gwb-summary-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .gwb-summary-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #f8faf9;

    span {
      display: inline-flex;
      margin-bottom: 8px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #0f6e56;
    }

    strong {
      display: block;
      font-size: 1.24rem;
      line-height: 1.25;
      color: #111827;
    }

    p {
      margin: 6px 0 0;
      font-size: 0.78rem;
      color: #6b7280;
    }

    &--primary {
      background: #e1f5ee;
      border-color: #0f6e56;

      strong {
        color: #0f6e56;
      }
    }
  }

  .gwb-chart-wrap {
    position: relative;
    height: 340px;
    margin-top: 18px;

    canvas {
      width: 100%;
      height: 100%;
    }

    &--short {
      height: 300px;
    }

    @media (max-width: 640px) {
      height: 320px;
    }
  }

  .gwb-table-wrap {
    overflow-x: auto;
    margin-top: 18px;
  }

  .gwb-median-table,
  .gwb-benefit-threshold-table,
  .gwb-wide-table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
    font-size: 0.86rem;

    th,
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
    }

    th:first-child,
    td:first-child {
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

  .gwb-threshold-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .gwb-threshold-card {
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
      color: #0f6e56;
      font-size: 0.9rem;
      font-weight: 800;
    }

    &--primary {
      border-color: #0f6e56;
      background: #e1f5ee;
    }
  }

  .gwb-calculator-cta,
  .gwb-public-cta {
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 22px;
    margin: 28px 0;
    background: #f0fdf4;

    .gwb-cta-eyebrow {
      margin: 0 0 6px;
      color: #0f6e56;
      font-size: 0.76rem;
      font-weight: 900;
    }

    h2 {
      margin: 0 0 8px;
      color: #111827;
      font-size: 1.18rem;
    }

    p {
      margin: 0;
      color: #4b5563;
      font-size: 0.9rem;
      line-height: 1.65;
    }
  }

  .gwb-cta-button {
    display: inline-flex;
    align-items: center;
    margin-top: 14px;
    padding: 9px 16px;
    border-radius: 8px;
    background: #0f6e56;
    color: #fff;
    font-size: 0.86rem;
    font-weight: 800;
    text-decoration: none;
  }

  .gwb-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  }

  .gwb-filter-btn {
    border: 1px solid #dce6e2;
    border-radius: 999px;
    padding: 7px 13px;
    background: #fff;
    color: #374151;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;

    &.is-active {
      border-color: #0f6e56;
      background: #0f6e56;
      color: #fff;
    }
  }

  .gwb-benefit-grid,
  .gwb-youth-comparison,
  .gwb-recommendation-grid,
  .gwb-checklist-grid,
  .gwb-fallback-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;

    @media (min-width: 760px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1080px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .gwb-benefit-card,
  .gwb-comparison-card,
  .gwb-recommendation-card,
  .gwb-checklist-card,
  .gwb-fallback-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #fff;
  }

  .gwb-benefit-card {
    &[hidden] {
      display: none;
    }

    h3 {
      margin: 10px 0 6px;
      color: #111827;
      font-size: 1rem;
    }

    p {
      margin: 0 0 12px;
      color: #4b5563;
      font-size: 0.86rem;
      line-height: 1.6;
    }

    dl {
      display: grid;
      gap: 8px;
      margin: 0;
    }

    div {
      display: grid;
      gap: 2px;
    }

    dt {
      color: #6b7280;
      font-size: 0.72rem;
      font-weight: 800;
    }

    dd {
      margin: 0;
      color: #111827;
      font-size: 0.82rem;
      line-height: 1.45;
    }
  }

  .gwb-benefit-card__top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
  }

  .gwb-source-badge,
  .gwb-priority-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 3px 8px;
    font-size: 0.7rem;
    font-weight: 900;
  }

  .gwb-source-badge {
    background: #f3f4f6;
    color: #4b5563;

    &--official {
      background: #dcfce7;
      color: #166534;
    }

    &--check {
      background: #fef3c7;
      color: #92400e;
    }

    &--estimate {
      background: #dbeafe;
      color: #1e40af;
    }

    &--notice {
      background: #fee2e2;
      color: #991b1b;
    }
  }

  .gwb-priority-badge {
    background: #e1f5ee;
    color: #0f6e56;
  }

  .gwb-notice-box {
    margin-top: 16px;
    border-radius: 12px;
    padding: 14px 16px;
    background: #f8faf9;
    color: #374151;
    font-size: 0.86rem;
    line-height: 1.65;

    &--warning {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
  }

  .gwb-check-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e1f5ee;
    color: #0f6e56;
    font-weight: 900;
    margin-bottom: 10px;
  }
}
```

---

## 11. SEO 설계

```text
title: 2026 정부 지원금 종류 총정리 - 생계·주거·청년·한부모·장애인 복지 혜택
description: 2026년 기준 중위소득과 정부 복지지원금 20개를 한 번에 비교합니다. 생계·의료·주거·교육급여, 차상위, 한부모, 청년월세, 청년도약계좌, 에너지바우처 신청 기준과 서류를 확인하세요.
H1: 2026 정부 복지지원금 완전 정복
```

JSON-LD:
- `Article`
- `FAQPage`

키워드:
- 2026 정부 지원금 종류 총정리
- 2026 복지 지원금
- 기초생활수급자 혜택 2026
- 차상위계층 혜택
- 청년 지원금 2026
- 한부모가족 지원금
- 에너지바우처 신청

---

## 12. SeoContent 초안

### introTitle

`2026 정부 복지지원금 완전 정복 — 기준 중위소득부터 신청 서류까지 한 번에 정리`

### intro

1. 정부 복지지원금은 제도마다 소득기준, 신청처, 지원 방식이 다릅니다. 생계급여처럼 현금으로 지급되는 제도도 있고, 문화누리카드·에너지바우처처럼 사용처가 정해진 바우처도 있습니다. 이 리포트는 2026년에 확인해야 할 핵심 복지제도 20개를 한 페이지에서 비교할 수 있도록 정리했습니다.

2. 2026년 4인 가구 기준 중위소득은 월 6,494,738원입니다. 생계급여는 기준 중위소득 32%, 의료급여는 40%, 주거급여는 48%, 교육급여는 50% 이하 기준을 사용합니다. 같은 가구라도 생계급여는 어렵지만 주거급여나 교육급여는 가능할 수 있으므로 급여별로 나누어 확인해야 합니다.

3. 기초생활수급자가 아니어도 확인할 수 있는 지원은 많습니다. 차상위계층 혜택, 한부모가족 지원, 청년월세지원, 청년도약계좌, 국민취업지원제도, 에너지바우처, 문화누리카드, 지자체 긴급지원처럼 별도 기준으로 신청 가능한 제도가 있습니다.

4. 지원금 신청에서 가장 중요한 것은 신청처와 서류입니다. 대부분의 복지급여는 복지로 또는 주소지 읍면동 주민센터에서 확인할 수 있지만, 청년 자산형성 상품은 은행 앱이나 전담기관을 통해 신청하는 경우도 있습니다. 임대차계약서, 통장 사본, 가족관계증명서, 소득·재산 확인 자료는 미리 준비하는 것이 좋습니다.

5. 이 리포트는 2026년 공식 기준과 제도별 공고를 바탕으로 작성하는 참고 자료입니다. 실제 수급 여부와 지원 금액은 소득·재산 조사, 가구 특성, 지자체 예산, 신청 시점에 따라 달라질 수 있습니다. 본인 가구 기준으로 먼저 확인하려면 복지급여 수급 자격 계산기를 함께 사용하세요.

### inputPoints

- 2026년 기준 중위소득과 생계·의료·주거·교육급여 선정기준을 확인할 수 있습니다.
- 청년·한부모·장애·노인·바우처 지원을 한 페이지에서 비교할 수 있습니다.
- 신청 전 준비해야 할 서류와 수급 탈락 시 대안 제도를 확인할 수 있습니다.

### criteria

- 기준 중위소득과 기초생활보장 선정기준은 보건복지부 2026년 기준을 사용합니다.
- 청년·바우처·지역 지원은 제도별 공식 공고 확인이 필요합니다.
- 월 환산액과 실수령액 예시는 이해를 돕기 위한 추정값입니다.
- 실제 신청과 최종 판정은 복지로, 정부24, 주민센터, 전담기관에서 확인해야 합니다.

### FAQ

```ts
export const GWB_FAQ: GwbFaq[] = [
  {
    question: '2026년 4인 가구 기준 중위소득은 얼마인가요?',
    answer: '2026년 4인 가구 기준 중위소득은 월 6,494,738원입니다. 2025년 6,097,773원에서 6.51% 인상되었습니다.',
  },
  {
    question: '생계급여와 주거급여는 동시에 받을 수 있나요?',
    answer: '가능할 수 있습니다. 다만 각 급여는 선정기준과 조사 항목이 다르며, 실제 수급 여부는 소득인정액과 가구 상황을 기준으로 결정됩니다.',
  },
  {
    question: '기초생활수급자가 아니어도 받을 수 있는 지원금이 있나요?',
    answer: '네. 차상위계층 혜택, 한부모가족 지원, 청년월세지원, 에너지바우처, 문화누리카드, 지자체 긴급지원 등은 별도 기준으로 확인할 수 있습니다.',
  },
  {
    question: '청년 지원금은 부모 소득도 보나요?',
    answer: '제도마다 다릅니다. 청년도약계좌, 청년월세지원, 청년내일저축계좌는 개인소득과 가구소득 기준이 각각 다르게 적용될 수 있으므로 신청 전 공식 공고 확인이 필요합니다.',
  },
  {
    question: '차상위계층과 기초생활수급자는 무엇이 다른가요?',
    answer: '기초생활수급자는 생계·의료·주거·교육급여 대상이 되는 저소득 가구이고, 차상위계층은 수급자 기준은 넘지만 소득이 낮아 감면·바우처·의료비 경감 등 일부 지원을 받을 수 있는 계층입니다.',
  },
  {
    question: '정부지원금은 어디서 신청하나요?',
    answer: '대부분 복지로, 정부24, 주소지 읍면동 주민센터에서 확인할 수 있습니다. 청년 자산형성 상품처럼 은행 앱이나 전담기관을 통해 신청하는 제도도 있습니다.',
  },
  {
    question: '지역별 추가 지원금은 어떻게 확인하나요?',
    answer: '거주 지자체 홈페이지, 복지로 지역 서비스, 주민센터 상담으로 확인하는 것이 가장 정확합니다. 지역 지원은 예산 소진이나 공고 기간에 따라 빠르게 바뀔 수 있습니다.',
  },
  {
    question: '수급 기준에서 조금 넘으면 아무 지원도 못 받나요?',
    answer: '아닙니다. 기준에서 조금 넘는 경우에도 차상위, 긴급복지, 지자체 지원, 청년·가족·장애 특화 지원을 확인해볼 수 있습니다. 리포트에서는 탈락 시 대안 제도를 함께 안내합니다.',
  },
];
```

---

## 13. 관련 링크

```ts
export const GWB_RELATED_LINKS: GwbRelatedLink[] = [
  {
    href: '/tools/welfare-benefit-eligibility/',
    label: '복지급여 수급 자격 계산기',
    desc: '가구원 수, 소득, 재산을 입력해 급여별 가능성을 간이 확인',
  },
  {
    href: '/tools/daycare-vs-kindergarten-cost/',
    label: '어린이집 vs 유치원 비용 계산기',
    desc: '자녀 양육비와 교육급여·한부모 지원 연결',
  },
  {
    href: '/reports/daycare-kindergarten-cost-2026/',
    label: '2026 어린이집·유치원 비용 리포트',
    desc: '육아 가구 생활비 부담 맥락',
  },
  {
    href: '/reports/newlywed-cost-2026/',
    label: '2026 신혼부부 생활비 리포트',
    desc: '가구 생활비·주거비 부담 맥락',
  },
  {
    href: '/tools/newlywed-rent-vs-buy/',
    label: '신혼집 전세 vs 매매 계산기',
    desc: '주거비 부담과 주거급여 연결',
  },
  {
    href: '/tools/year-end-tax-refund-calculator/',
    label: '연말정산 환급액 계산기',
    desc: '소득·세금·정부 지원금 탐색 흐름 연결',
  },
];

export const GWB_SOURCE_LINKS: ExternalSourceLink[] = [
  {
    source: '보건복지부',
    title: '2026년 기준 중위소득 보도자료',
    href: 'https://mohw.go.kr/board.es?act=view&bid=0027&list_no=1487098&mid=a10503000000',
    desc: '2026년 기준 중위소득과 기초생활보장 급여별 선정기준',
  },
  {
    source: '보건복지부',
    title: '수급자 선정기준',
    href: 'https://mw.go.kr/menu.es?mid=a10708010300',
    desc: '생계·의료·주거·교육급여 선정기준표',
  },
  {
    source: '복지로',
    title: '복지서비스 통합 조회',
    href: 'https://www.bokjiro.go.kr',
    desc: '복지급여 신청·모의계산·서비스 안내',
  },
  {
    source: '문화누리카드',
    title: '문화누리카드 공식 안내',
    href: 'https://www.mnuri.kr',
    desc: '문화·여행·체육 바우처 사용처와 신청 안내',
  },
  {
    source: '에너지바우처',
    title: '에너지바우처 공식 안내',
    href: 'https://www.energyv.or.kr',
    desc: '전기·가스·난방비 바우처 신청 기준',
  },
];
```

---

## 14. 등록 작업

```ts
// src/data/reports.ts
{
  slug: '2026-government-welfare-benefits',
  title: '2026 정부 복지지원금 완전 정복',
  description: '2026년 기준 중위소득과 정부 복지지원금 20개를 생계·주거·청년·한부모·장애·바우처별로 비교합니다.',
  category: '복지/지원금',
  order: 50,
  badges: ['복지', '지원금', '2026', '공식 기준'],
}
```

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://bigyocalc.com/reports/2026-government-welfare-benefits/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.9</priority>
</url>
```

---

## 15. QA 체크리스트

- [ ] 2026년 4인 기준 중위소득이 `6,494,738원`으로 표시됨
- [ ] "609만 원"을 2026 수치로 오표기하지 않음
- [ ] 기준 중위소득표 1~6인 데이터가 계산기 문서와 일치
- [ ] 생계·의료·주거·교육급여 선정비율 32/40/48/50% 명확히 표시
- [ ] 모든 금액 카드에 `공식`, `확인 필요`, `추정`, `예고` 배지 표시
- [ ] 지원금 20개 카드가 카테고리 필터로 정상 노출/숨김
- [ ] Chart.js 두 차트가 데스크톱/모바일에서 정상 렌더링
- [ ] 차트 툴팁 금액 단위가 한국어 `만 원`으로 표시
- [ ] 계산기 CTA 링크 `/tools/welfare-benefit-eligibility/` 정상
- [ ] 공공 상담 CTA는 고금리 대출성 문구 없이 복지로·주민센터·공공 상담 중심
- [ ] 외부 링크는 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] FAQ 8개 이상 표시 및 FAQPage JSON-LD 포함
- [ ] 모바일 360px에서 카드·표·필터 버튼이 겹치지 않음
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
