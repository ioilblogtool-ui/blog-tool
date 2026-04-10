# baby-cost-guide-first-year 설계 문서

> 기획 원본: `docs/plan/202604/baby-cost-guide-first-year.md`
> 콘텐츠 유형: **리포트형 정적 페이지** (인터랙션 없음, 순수 콘텐츠 비교)
> 작성일: 2026-04-07

---

## 1. 페이지 개요

| 항목 | 내용 |
|------|------|
| slug | `baby-cost-guide-first-year` |
| URL | `/reports/baby-cost-guide-first-year/` |
| 페이지 유형 | 정적 리포트 (JS 인터랙션 없음, 추후 계산기 확장 가능) |
| 카테고리 | 육아·출산 |
| 레이아웃 | `BaseLayout.astro` + `report-page` 클래스 |
| CSS prefix | `bcg-` (baby-cost-guide) |

---

## 2. 파일 구조

```
src/pages/reports/baby-cost-guide-first-year.astro
src/data/babyCostGuideFirstYear.ts
src/styles/scss/pages/_baby-cost-guide-first-year.scss
src/styles/app.scss  ← import 추가
src/data/reports.ts  ← 항목 추가
public/sitemap.xml   ← URL 추가
```

JS 없음 — 정적 콘텐츠 전용 리포트. 향후 계산기 전환 시 `public/scripts/baby-cost-guide-first-year.js` 추가.

---

## 3. 데이터 구조 (`src/data/babyCostGuideFirstYear.ts`)

```ts
// ── 3단 기준 타입 ─────────────────────────────────────────────
export type CostTier = 'frugal' | 'average' | 'premium';

export type TierLabel = {
  tier: CostTier;
  label: string;        // "가성비" | "평균" | "프리미엄"
  tagline: string;      // 한 줄 설명
  color: string;        // CSS 색상 토큰
};

// ── KPI 카드 ──────────────────────────────────────────────────
export type CostKpi = {
  tier: CostTier;
  label: string;        // "가성비 1년 총비용"
  value: string;        // "250만~500만원"
  sub: string;          // "지원금 반영 전 기준"
};

// ── 총비용 비교 행 ────────────────────────────────────────────
export type CostOverviewRow = {
  category: string;     // "초기 준비비"
  frugal: string;       // "70만~150만원"
  average: string;      // "150만~300만원"
  premium: string;      // "300만~600만원+"
};

// ── 항목별 비교 행 ────────────────────────────────────────────
export type ItemCompareRow = {
  item: string;         // "유모차"
  frugal: string;       // "중고/보급형"
  average: string;      // "절충형 인기 모델"
  premium: string;      // "프리미엄 브랜드"
};

// ── 월령별 비용 흐름 ──────────────────────────────────────────
export type MonthlyPhase = {
  period: string;       // "0~1개월"
  mainCosts: string;    // "기저귀, 수유용품, 속싸개, 침구"
  note: string;         // "초기 준비비 비중 큼"
};

// ── 지원금 반영 표 ────────────────────────────────────────────
export type SubsidyRow = {
  tier: CostTier;
  label: string;        // "가성비"
  totalCost: string;    // "350만원"
  subsidy: string;      // "-300만원"
  actual: string;       // "50만원"
};

// ── 절약 팁 ──────────────────────────────────────────────────
export type SavingTip = {
  tip: string;
};

// ── FAQ ───────────────────────────────────────────────────────
export type FaqItem = {
  q: string;
  a: string;
};

// ── 제휴 상품 ─────────────────────────────────────────────────
export type AffiliateItem = {
  tag: string;          // "기저귀"
  title: string;        // "하기스 맥스드라이"
  href: string;         // 쿠팡 파트너스 링크
};

// ── 리포트 전체 ───────────────────────────────────────────────
export type BabyCostGuideReport = {
  meta: {
    seoTitle: string;
    seoDescription: string;
    ogTitle: string;
    ogDescription: string;
    caution: string;
    updatedAt: string;
  };
  tiers: TierLabel[];
  kpis: CostKpi[];
  overviewRows: CostOverviewRow[];
  itemRows: ItemCompareRow[];
  monthlyPhases: MonthlyPhase[];
  subsidyRows: SubsidyRow[];
  savingTips: SavingTip[];
  faq: FaqItem[];
  affiliates: AffiliateItem[];
};
```

### 실제 데이터 초기값

```ts
export const babyCostGuideFirstYear: BabyCostGuideReport = {
  meta: {
    seoTitle: "신생아~돌까지 육아 비용 총정리 | 가성비·평균·프리미엄 비교",
    seoDescription: "신생아부터 돌까지 기저귀, 분유, 병원비, 이유식, 육아용품까지 아기 1년 육아 비용을 가성비·평균·프리미엄 기준으로 비교했습니다. 지원금 반영 후 실제 부담도 확인하세요.",
    ogTitle: "신생아~돌까지 육아 비용 총정리",
    ogDescription: "아기 1년 키우는 데 얼마 들까? 가성비·평균·프리미엄 기준으로 한눈에 비교해봅니다.",
    caution: "이 리포트의 비용은 가정별 소비 패턴·수유 방식·중고 활용 여부에 따라 실제와 차이가 있을 수 있습니다. 예산 감 잡기용 참고 자료로 활용하세요.",
    updatedAt: "2026년 4월 기준",
  },
  tiers: [
    { tier: "frugal",  label: "가성비",   tagline: "필수 위주, 중고·선물 활용, 실용성 우선",       color: "#2C7A5E" },
    { tier: "average", label: "평균",     tagline: "신품 중심, 가격·품질 균형, 가장 일반적인 준비", color: "#1a6fa8" },
    { tier: "premium", label: "프리미엄", tagline: "브랜드·편의성 중심, 신품 선호, 고급 사양",      color: "#7c4a1e" },
  ],
  kpis: [
    { tier: "frugal",  label: "가성비 1년 총비용",   value: "250만~500만원",      sub: "지원금 반영 전 기준" },
    { tier: "average", label: "평균 1년 총비용",     value: "500만~900만원",      sub: "지원금 반영 전 기준" },
    { tier: "premium", label: "프리미엄 1년 총비용", value: "900만~1,500만원+",   sub: "지원금 반영 전 기준" },
  ],
  overviewRows: [
    { category: "초기 준비비",       frugal: "70만~150만원",   average: "150만~300만원",  premium: "300만~600만원+" },
    { category: "월 소모품",         frugal: "10만~20만원",    average: "20만~35만원",    premium: "35만~60만원" },
    { category: "병원·예방접종·기타", frugal: "15만~30만원",    average: "30만~60만원",    premium: "60만~100만원+" },
    { category: "이유식·식기·놀이",  frugal: "10만~25만원",    average: "25만~60만원",    premium: "60만~120만원+" },
    { category: "1년 총비용 (예시)", frugal: "250만~500만원",  average: "500만~900만원",  premium: "900만~1,500만원+" },
  ],
  itemRows: [
    { item: "유모차",      frugal: "중고·보급형",        average: "절충형 인기 모델",     premium: "프리미엄 브랜드" },
    { item: "카시트",      frugal: "기본형",             average: "안전성+편의성 균형형",  premium: "회전형·고급형" },
    { item: "아기띠",      frugal: "기본 기능형",         average: "착용감 좋은 대중형",   premium: "프리미엄 소재형" },
    { item: "젖병·소독기",  frugal: "최소 구성",          average: "무난한 브랜드 세트",   premium: "자동화·고급형" },
    { item: "기저귀",      frugal: "행사·가성비 브랜드",  average: "대중 브랜드",         premium: "프리미엄 라인" },
    { item: "분유",        frugal: "표준 제품",           average: "인기 제품",           premium: "프리미엄·특수 라인" },
    { item: "의류",        frugal: "선물+기본 구매",      average: "계절별 적정 구매",     premium: "브랜드·외출복 위주" },
    { item: "장난감·놀이매트", frugal: "최소 구성",       average: "발달 단계별 구매",     premium: "대형 매트·고급 교구" },
  ],
  monthlyPhases: [
    { period: "0~1개월",   mainCosts: "기저귀, 수유용품, 속싸개, 침구",      note: "초기 준비비 비중 큼" },
    { period: "2~3개월",   mainCosts: "소모품, 예방접종, 의류 교체",          note: "월 고정비 패턴이 보이기 시작" },
    { period: "4~6개월",   mainCosts: "장난감, 놀이매트, 외출용품",           note: "발달 관련 소비 증가" },
    { period: "7~9개월",   mainCosts: "이유식, 식기, 턱받이, 간식",           note: "먹는 비용이 늘어나는 시기" },
    { period: "10~12개월", mainCosts: "활동용품, 신발, 추가 장난감",          note: "활동량 증가로 품목 다양화" },
  ],
  subsidyRows: [
    { tier: "frugal",  label: "가성비",   totalCost: "350만원",    subsidy: "-300만원", actual: "50만원" },
    { tier: "average", label: "평균",     totalCost: "700만원",    subsidy: "-300만원", actual: "400만원" },
    { tier: "premium", label: "프리미엄", totalCost: "1,200만원",  subsidy: "-300만원", actual: "900만원" },
  ],
  savingTips: [
    { tip: "초반에 모든 용품을 한 번에 사지 않기" },
    { tip: "큰 용품은 사용 시점에 맞춰 구매하기" },
    { tip: "선물·중고·지인 물려받기 적극 활용하기" },
    { tip: "소모품(기저귀·물티슈)은 행사·묶음 구매로 관리하기" },
    { tip: "의류는 계절과 성장 속도를 고려해 최소 구매하기" },
    { tip: "오래 쓰는 품목과 소모품을 구분해 예산 배분하기" },
  ],
  faq: [
    { q: "신생아부터 돌까지 평균적으로 얼마나 드나요?", a: "준비 방식에 따라 크게 다르지만, 가장 일반적인 평균 기준으로는 1년 총 500만~900만원 수준입니다. 정부 지원금(부모급여·출산지원금)을 반영하면 실부담은 200만~600만원 수준으로 낮아질 수 있습니다." },
    { q: "완전모유수유면 비용이 많이 줄어드나요?", a: "분유값이 월 10만~25만원 정도 절감됩니다. 단, 수유패드·유축기·보관팩 같은 모유수유 용품 비용이 초기에 추가됩니다. 전체 1년 비용에서 분유 절감 효과는 크지만, 다른 항목 선택에 따라 총비용 차이는 여전합니다." },
    { q: "유모차와 카시트는 꼭 비싼 걸 사야 하나요?", a: "카시트는 안전 관련 제품이라 기본 안전 기준을 갖춘 제품이 중요합니다. 유모차는 외출 빈도와 생활 패턴에 따라 다릅니다. 도시 거주 + 대중교통 위주라면 가벼운 중급형으로도 충분합니다. 차량 이동이 많다면 좀 더 큰 형태가 편리할 수 있습니다." },
    { q: "아기 병원비는 어느 정도 잡아야 하나요?", a: "일반 소아과 진료는 1회 5,000~2만원 수준입니다. 예방접종은 국가 무료 접종이 많아 큰 비용은 아니지만, 선택 접종(로타바이러스·폐렴구균 등)을 포함하면 1년에 20만~60만원 추가될 수 있습니다." },
    { q: "지원금까지 반영하면 실제 부담은 얼마나 되나요?", a: "2026년 기준 부모급여(100만원/월 × 12개월 = 최대 1,200만원)와 출산지원금(바우처 등)을 더하면 1년 지원 총액이 300만~600만원 수준입니다. 가성비 준비라면 지원금 이후 실부담이 거의 없을 수 있고, 프리미엄 준비면 900만원 이상이 남는 구조입니다." },
    { q: "첫째와 둘째 육아비는 차이가 크나요?", a: "초기 대형 용품(유모차·카시트·아기침대 등)을 이미 갖고 있다면 둘째는 초기 준비비가 크게 줄어듭니다. 소모품 비용은 비슷하게 유지됩니다. 체감 비용 차이는 초기 준비비 기준 30~50% 절감이 일반적입니다." },
    { q: "꼭 새 제품으로 사야 하는 육아용품은 무엇인가요?", a: "카시트는 사고 이력·충격 흡수 여부 확인이 어렵기 때문에 신품 구매를 권장합니다. 속싸개·의류·젖병류는 위생 관리가 가능하면 중고도 무방합니다. 침구·기저귀 교환 패드는 청결 유지가 핵심이므로 신품 권장입니다." },
  ],
  affiliates: [
    // 쿠팡 파트너스 링크 — 실제 운영 전 링크 입력 필요
    { tag: "기저귀",   title: "하기스 맥스드라이 (가성비 대표)",   href: "https://link.coupang.com/" },
    { tag: "분유",     title: "남양 아이엠마더 (평균 추천)",         href: "https://link.coupang.com/" },
    { tag: "카시트",   title: "다이치 원픽 360 Fix (안전 추천)",    href: "https://link.coupang.com/" },
    { tag: "놀이매트", title: "리베베 원형 놀이매트 (대중형)",        href: "https://link.coupang.com/" },
  ],
};
```

---

## 4. 페이지 화면 구성 (`baby-cost-guide-first-year.astro`)

### 4-1. 전체 섹션 순서

```
[SiteHeader]
[CalculatorHero]         ← eyebrow + title + description
[InfoNotice]             ← 비교 기준 안내
① KPI 카드 3개           ← 가성비 / 평균 / 프리미엄 총비용
② 총비용 비교 표         ← 카테고리 × 3단 비교
③ 3단 기준 설명 카드     ← 어떤 유형인지 설명
④ 항목별 비용 비교 표    ← 용품별 × 3단 비교
⑤ 월령별 비용 흐름 표    ← 월령 × 주요 지출 × 특징
⑥ 지원금 반영 실부담     ← 3단별 실부담 + 내부 CTA
⑦ 절약 팁               ← 체크리스트형
⑧ 쿠팡 제휴 카드         ← 4개 제품 카드
⑨ 관련 계산기 CTA        ← 2개 계산기 링크 카드
[SeoContent]             ← FAQ + 관련 리포트
[SiteFooter]
```

---

### 4-2. 컴포넌트 상세

#### ① KPI 카드

```astro
<section class="content-section bcg-kpi-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">한눈에 보는 총비용</p>
    <h2>아기 1년, 얼마나 드나요?</h2>
  </div>
  <div class="bcg-kpi-grid">
    {report.kpis.map((kpi) => (
      <article class={`bcg-kpi-card bcg-kpi-card--${kpi.tier}`}>
        <p>{kpi.label}</p>
        <strong>{kpi.value}</strong>
        <span>{kpi.sub}</span>
      </article>
    ))}
  </div>
</section>
```

#### ② 총비용 비교 표

```astro
<section class="content-section bcg-overview-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">카테고리별 비교</p>
    <h2>준비 방식에 따른 비용 차이</h2>
  </div>
  <div class="table-wrap">
    <table class="bcg-table">
      <thead>
        <tr>
          <th>항목</th>
          <th class="bcg-th--frugal">가성비</th>
          <th class="bcg-th--average">평균</th>
          <th class="bcg-th--premium">프리미엄</th>
        </tr>
      </thead>
      <tbody>
        {report.overviewRows.map((row) => (
          <tr class={row.category.includes("총비용") ? "bcg-row--total" : ""}>
            <td>{row.category}</td>
            <td class="bcg-td--frugal">{row.frugal}</td>
            <td class="bcg-td--average">{row.average}</td>
            <td class="bcg-td--premium">{row.premium}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="bcg-table-note">실제 금액은 수유 방식, 선물, 중고 활용, 외출 빈도에 따라 달라질 수 있습니다.</p>
</section>
```

#### ③ 3단 기준 설명

```astro
<section class="content-section bcg-tier-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">우리 집은 어떤 타입?</p>
    <h2>가성비 / 평균 / 프리미엄 기준 설명</h2>
  </div>
  <div class="bcg-tier-grid">
    {report.tiers.map((tier) => (
      <article class={`bcg-tier-card bcg-tier-card--${tier.tier}`}>
        <p class="bcg-tier-card__label">{tier.label}</p>
        <p class="bcg-tier-card__tagline">{tier.tagline}</p>
      </article>
    ))}
  </div>
  <p class="bcg-tier-note">아기 1년 육아비는 집집마다 다르지만, 어떤 항목에서 예산 차이가 벌어지느냐가 핵심입니다.</p>
</section>
```

#### ④ 항목별 비용 비교 표

```astro
<section class="content-section bcg-items-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">항목별 비교</p>
    <h2>어디서 비용 차이가 크게 벌어질까</h2>
  </div>
  <div class="table-wrap">
    <table class="bcg-table">
      <thead>
        <tr>
          <th>항목</th>
          <th class="bcg-th--frugal">가성비</th>
          <th class="bcg-th--average">평균</th>
          <th class="bcg-th--premium">프리미엄</th>
        </tr>
      </thead>
      <tbody>
        {report.itemRows.map((row) => (
          <tr>
            <td><strong>{row.item}</strong></td>
            <td class="bcg-td--frugal">{row.frugal}</td>
            <td class="bcg-td--average">{row.average}</td>
            <td class="bcg-td--premium">{row.premium}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="bcg-table-note">총비용 차이는 주로 초기 대형 용품 + 반복 구매 소모품 + 후반부 이유식·놀이용품에서 크게 벌어집니다.</p>
</section>
```

#### ⑤ 월령별 비용 흐름

```astro
<section class="content-section bcg-monthly-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">월령별 지출 흐름</p>
    <h2>언제 어떤 비용이 많이 드나</h2>
  </div>
  <div class="bcg-monthly-grid">
    {report.monthlyPhases.map((phase) => (
      <article class="bcg-monthly-card">
        <p class="bcg-monthly-card__period">{phase.period}</p>
        <strong class="bcg-monthly-card__costs">{phase.mainCosts}</strong>
        <span class="bcg-monthly-card__note">{phase.note}</span>
      </article>
    ))}
  </div>
  <p class="bcg-table-note">초반엔 준비비, 중반엔 소모품, 후반엔 이유식·놀이·활동용품 비중이 커지는 흐름으로 이해하면 쉽습니다.</p>
</section>
```

#### ⑥ 지원금 반영 실부담

```astro
<section class="content-section bcg-subsidy-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">지원금 반영</p>
    <h2>지원금까지 반영하면 실부담은 얼마나 줄까</h2>
  </div>
  <div class="table-wrap">
    <table class="bcg-table bcg-table--subsidy">
      <thead>
        <tr>
          <th>준비 유형</th>
          <th>1년 총 육아비</th>
          <th>주요 지원금 반영</th>
          <th>실부담 예시</th>
        </tr>
      </thead>
      <tbody>
        {report.subsidyRows.map((row) => (
          <tr class={`bcg-subsidy-row--${row.tier}`}>
            <td><strong>{row.label}</strong></td>
            <td>{row.totalCost}</td>
            <td class="bcg-td--minus">{row.subsidy}</td>
            <td class="bcg-td--actual"><strong>{row.actual}</strong></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="bcg-table-note">지원금 규모는 거주지·출생 시점·가구 상황에 따라 달라질 수 있습니다. 아래 계산기에서 개인 기준으로 확인하세요.</p>

  <!-- 내부 CTA -->
  <div class="bcg-cta-row">
    <a class="bcg-cta-btn" href="/tools/birth-support-total/">출산지원금 계산해보기</a>
    <a class="bcg-cta-btn bcg-cta-btn--outline" href="/tools/parental-leave-pay/">육아휴직 급여 계산기</a>
  </div>
</section>
```

#### ⑦ 절약 팁

```astro
<section class="content-section bcg-tips-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">실전 가이드</p>
    <h2>육아비를 줄이는 현실적인 방법</h2>
  </div>
  <ul class="bcg-tips-list">
    {report.savingTips.map((tip) => (
      <li class="bcg-tips-item">
        <span class="bcg-tips-item__icon" aria-hidden="true">✓</span>
        <span>{tip.tip}</span>
      </li>
    ))}
  </ul>
  <p class="bcg-tips-summary">가성비 육아의 핵심은 무조건 싼 제품이 아니라, <strong>오래 쓰는 품목과 소모품을 구분해서 돈을 쓰는 것</strong>입니다.</p>
</section>
```

#### ⑧ 제휴 카드 (쿠팡 파트너스)

```astro
<!-- 쿠팡 파트너스 고지 문구 포함 -->
<section class="affiliate-section content-section">
  <div class="affiliate-box affiliate-box--alt">
    <p class="affiliate-box__notice">이 콘텐츠는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.</p>
    <p class="affiliate-box__label">많이 찾는 육아용품</p>
    <div class="affiliate-grid">
      {report.affiliates.map((item) => (
        <a class="affiliate-card" href={item.href} target="_blank" rel="noopener sponsored">
          <span class="affiliate-card__tag">{item.tag}</span>
          <strong class="affiliate-card__title">{item.title}</strong>
          <span class="affiliate-card__cta">쿠팡에서 보기 →</span>
        </a>
      ))}
    </div>
  </div>
</section>
```

#### ⑨ 관련 계산기 CTA 카드

```astro
<section class="content-section bcg-calc-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">같이 보면 좋은 계산기</p>
    <h2>내 상황에 맞게 직접 계산해보세요</h2>
  </div>
  <div class="bcg-calc-grid">
    <a class="bcg-calc-card" href="/tools/birth-support-total/">
      <span class="bcg-calc-card__eyebrow">지원금 총액</span>
      <strong>출산~2세 총지원금 계산기</strong>
      <p>부모급여·출산지원금·아동수당을 모두 반영해 가구별 총 수령액을 계산합니다.</p>
      <span class="bcg-calc-card__cta">계산기 바로가기</span>
    </a>
    <a class="bcg-calc-card" href="/tools/parental-leave-pay/">
      <span class="bcg-calc-card__eyebrow">육아휴직 급여</span>
      <strong>육아휴직 급여 계산기</strong>
      <p>육아휴직 기간 중 월별 급여를 빠르게 계산해봅니다.</p>
      <span class="bcg-calc-card__cta">계산기 바로가기</span>
    </a>
    <a class="bcg-calc-card" href="/tools/diaper-cost/">
      <span class="bcg-calc-card__eyebrow">소모품 비용</span>
      <strong>아기 기저귀 값 계산기</strong>
      <p>월령별 기저귀 사용량을 자동 계산해 브랜드별 연간 비용을 비교합니다.</p>
      <span class="bcg-calc-card__cta">계산기 바로가기</span>
    </a>
  </div>
</section>
```

---

## 5. SCSS 설계 (`_baby-cost-guide-first-year.scss`)

### 5-1. CSS prefix 규칙

모든 클래스는 `.bcg-` prefix 사용.

### 5-2. 주요 컴포넌트 스타일

```scss
// KPI 카드 3열
.bcg-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.bcg-kpi-card {
  padding: 20px 16px;
  border-radius: 14px;
  border: 1px solid #e5e2db;
  background: #f8f6f2;

  p { margin: 0 0 8px; font-size: 12px; color: #66645e; }
  strong { display: block; font-size: 22px; line-height: 1.1; }
  span { display: block; margin-top: 6px; font-size: 11px; color: #8a8780; }
}

.bcg-kpi-card--frugal  { background: #edf7f2; border-color: #c8e8d8; strong { color: #1b6b4a; } }
.bcg-kpi-card--average { background: #eef4fb; border-color: #c4daf0; strong { color: #1a5a8a; } }
.bcg-kpi-card--premium { background: #faf5ef; border-color: #e8d5b8; strong { color: #7c4a1e; } }

// 비교표 공통
.bcg-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    padding: 10px 12px;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    border-bottom: 2px solid #e5e2db;
    background: #f5f3ef;
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid #eceae6;
    text-align: center;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  td:first-child   { text-align: left; font-weight: 500; }
}

// 3단 컬럼 색상
.bcg-th--frugal  { color: #1b6b4a; background: #edf7f2; }
.bcg-th--average { color: #1a5a8a; background: #eef4fb; }
.bcg-th--premium { color: #7c4a1e; background: #faf5ef; }

.bcg-td--frugal  { color: #1b6b4a; }
.bcg-td--average { color: #1a5a8a; }
.bcg-td--premium { color: #7c4a1e; }

// 총합 행 강조
.bcg-row--total td {
  background: #f0f0ec;
  font-weight: 700;
  border-top: 2px solid #d8d5ce;
}

// 3단 타입 설명 카드
.bcg-tier-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.bcg-tier-card {
  padding: 18px 16px;
  border-radius: 12px;
  border: 1px solid #e5e2db;
}

.bcg-tier-card--frugal  { background: #edf7f2; border-color: #c8e8d8; .bcg-tier-card__label { color: #1b6b4a; } }
.bcg-tier-card--average { background: #eef4fb; border-color: #c4daf0; .bcg-tier-card__label { color: #1a5a8a; } }
.bcg-tier-card--premium { background: #faf5ef; border-color: #e8d5b8; .bcg-tier-card__label { color: #7c4a1e; } }

.bcg-tier-card__label   { margin: 0 0 6px; font-size: 15px; font-weight: 700; }
.bcg-tier-card__tagline { margin: 0; font-size: 12px; line-height: 1.55; color: #66645e; }

// 월령별 카드
.bcg-monthly-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.bcg-monthly-card {
  padding: 16px 14px;
  border-radius: 12px;
  background: #f8f6f2;
  border: 1px solid #ece9e3;

  &__period  { margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #1d9e75; }
  &__costs   { display: block; font-size: 13px; color: #1b1a17; line-height: 1.4; margin-bottom: 6px; }
  &__note    { display: block; font-size: 11px; color: #7d7b74; line-height: 1.4; }
}

// 지원금 표 — 실부담 강조
.bcg-td--minus  { color: #c0392b; font-weight: 600; }
.bcg-td--actual strong { font-size: 16px; color: #1d9e75; }

// CTA 버튼
.bcg-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.bcg-cta-btn {
  display: inline-block;
  padding: 11px 20px;
  border-radius: 8px;
  background: #1d9e75;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  &--outline {
    background: transparent;
    border: 1.5px solid #1d9e75;
    color: #1d9e75;
  }
}

// 절약 팁
.bcg-tips-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: grid;
  gap: 10px;
}

.bcg-tips-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.55;
  color: #2d2b28;

  &__icon { color: #1d9e75; font-weight: 700; flex-shrink: 0; }
}

.bcg-tips-summary {
  margin: 0;
  padding: 14px 16px;
  border-radius: 10px;
  background: #edf7f2;
  font-size: 13px;
  line-height: 1.6;
  color: #1b4a36;
  border: 1px solid #c8e8d8;
}

// 관련 계산기 카드
.bcg-calc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.bcg-calc-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border-radius: 14px;
  background: #f8f5ef;
  border: 1px solid #e9dfd1;
  color: inherit;
  text-decoration: none;
  transition: transform 0.15s, border-color 0.15s;

  &:hover { transform: translateY(-1px); border-color: #d5c4ac; }

  &__eyebrow { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #8a6a3e; font-weight: 700; }
  strong     { font-size: 16px; color: #1f1f1b; line-height: 1.3; }
  p          { margin: 0; font-size: 12px; line-height: 1.55; color: #5f594f; }
  &__cta     { margin-top: auto; font-size: 12px; color: #8a6a3e; font-weight: 600; }
}

// 공통 보조 텍스트
.bcg-table-note,
.bcg-tier-note {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #8a8780;
}
```

---

## 6. `reports.ts` 추가

```ts
{
  slug: "baby-cost-guide-first-year",
  title: "신생아~돌까지 육아 비용 총정리 — 가성비·평균·프리미엄 비교",
  description: "기저귀, 분유, 병원비, 이유식, 육아용품까지 아기 1년 육아 비용을 3단계 기준으로 비교하고 지원금 반영 후 실부담까지 확인하는 리포트입니다.",
  order: 14,
  badges: ["육아", "비용비교"],
},
```

---

## 7. SiteHeader 업데이트

`SiteHeader.astro` 리포트 드롭다운 `연봉·초봉` 섹션 또는 별도 섹션 추가 불필요.
`전체 리포트 보기 →` 링크로 노출 충분. 필요시 비교·트렌드 섹션에 추가 가능.

---

## 8. `sitemap.xml` 추가

```xml
<url>
  <loc>https://bigyocalc.com/reports/baby-cost-guide-first-year/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 9. `app.scss` import 추가

```scss
@use 'pages/baby-cost-guide-first-year';
```

---

## 10. SEO 체크포인트

| 항목 | 내용 |
|------|------|
| `<title>` | 신생아~돌까지 육아 비용 총정리 \| 가성비·평균·프리미엄 비교 |
| `<meta description>` | 신생아부터 돌까지 기저귀, 분유, 병원비, 이유식까지 아기 1년 육아비를 가성비·평균·프리미엄 기준으로 비교. 지원금 반영 후 실부담도 확인. |
| H2 주요 키워드 포함 | 아기 1년 비용, 준비 방식, 지원금 반영, 어디서 차이 벌어지나 |
| 내부 링크 | 출산지원금 계산기, 육아휴직 계산기, 기저귀 계산기 최소 3개 |
| InfoNotice | 추정 기준 명시 (`추정`, `참고용` 표기) |

---

## 11. 구현 순서

1. `src/data/babyCostGuideFirstYear.ts` — 데이터 파일 작성
2. `src/styles/scss/pages/_baby-cost-guide-first-year.scss` — 스타일 작성
3. `src/styles/app.scss` — import 추가
4. `src/pages/reports/baby-cost-guide-first-year.astro` — 페이지 조립
5. `src/data/reports.ts` — 목록 추가
6. `public/sitemap.xml` — URL 추가
7. `npm run build` — 빌드 확인
8. 쿠팡 파트너스 링크 실제 URL 입력 후 배포

---

## 12. QA 포인트

- [ ] 모바일(375px)에서 3단 비교 표가 가로 스크롤 동작하는가 (`table-wrap overflow-x: auto`)
- [ ] KPI 카드 3열 → 모바일 1열 전환되는가
- [ ] 월령별 카드 5열 → 모바일 1열 전환되는가
- [ ] 지원금 실부담 표 숫자 강조 색상이 구분되는가
- [ ] 제휴 링크에 `rel="noopener sponsored"` 포함 여부
- [ ] 쿠팡 파트너스 고지 문구 `affiliate-box__notice` 노출 여부
- [ ] InfoNotice에 `추정`, `참고용` 표기 여부
- [ ] 내부 CTA 링크 3개 이상 존재 여부
- [ ] `reports.ts`에 새 항목이 추가됐는가
- [ ] `sitemap.xml`에 URL이 추가됐는가
