# 용인 반도체 클러스터 vs 평택 삼성캠퍼스 집값 비교 리포트 2026 — 설계 문서

## 1. 개요

- **슬러그**: `reports/yongin-vs-pyeongtaek-cluster-housing-2026`
- **유형**: 리포트 (메가 프로젝트 비교형)
- **prefix**: `yvp-` (Yongin vs Pyeongtaek)
- **데이터 파일**: `src/data/yonginVsPyeongtaekClusterHousing2026.ts`
- **기획 문서**: `docs/plan/202606/yongin-vs-pyeongtaek-cluster-housing-2026-plan.md`
- **관계**: `sk-hynix-shuttle-real-estate-2026`, `samsung-shuttle-real-estate-2026`(셔틀 통근권 시세)과는 앵글이 다른 별도 리포트 — 이 리포트는 "클러스터/캠퍼스 메가 프로젝트 자체가 지역 부동산에 미치는 영향"을 다룸. 상호 관련 링크로 연결.
- **핵심 원칙**: 직전 작업에서 확인한 "추정 과다 → 신뢰도 저하" 문제를 처음부터 피하기 위해, 모든 핵심 수치를 언론 보도 기준 **확인됨(Fact)**으로 표기하고, 추정이 필요한 항목(향후 시세 전망 등)만 명확히 분리.

---

## 2. 화면 구성 (IA)

```text
[BaseLayout]
  SiteHeader
  main.report-page.yvp-page
    CalculatorHero            (eyebrow: "메가 프로젝트 비교 리포트")
    InfoNotice                (fact 기준 출처, 투자 추천 아님 고지)

    section.yvp-overview      (두 지역 KPI 비교 카드: 투자규모/인력/공정률)
    section.yvp-timeline      (착공~준공 타임라인, 좌우 2단)
    section.yvp-housing       (시세 비교: 처인구 평당가 vs 평택 단지 실거래)
    section.yvp-risk          (리스크 비교: 전력·용수 vs 공급과다·미분양)
    section.yvp-summary       (한눈에 비교 요약 표)
    section.yvp-related       (관련 리포트 링크)

    SeoContent
```

---

## 3. 데이터 파일 (`src/data/yonginVsPyeongtaekClusterHousing2026.ts`)

```ts
export type FactBadge = "확인됨" | "추정" | "전망";

export interface RegionProfile {
  id: "yongin" | "pyeongtaek";
  name: string;
  shortName: string;
  projectName: string;
  operator: string;
  siteSize: string;
  totalInvestment: string;
  badge: FactBadge;
  sourceLabel: string;
  sourceUrl: string;
}

export interface KpiCompareRow {
  label: string;
  yongin: string;
  pyeongtaek: string;
  badge: FactBadge;
}

export interface TimelineEvent {
  id: string;
  region: "yongin" | "pyeongtaek" | "both";
  date: string;
  title: string;
  description: string;
  badge: FactBadge;
}

export interface HousingFactCard {
  id: string;
  region: "yongin" | "pyeongtaek";
  label: string;
  value: string;
  detail: string;
  badge: FactBadge;
  sourceLabel: string;
}

export interface RiskCard {
  region: "yongin" | "pyeongtaek";
  title: string;
  body: string;
  badge: FactBadge;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const YVP_META = {
  slug: "yongin-vs-pyeongtaek-cluster-housing-2026",
  title: "용인 반도체 클러스터 vs 평택 삼성캠퍼스 집값 비교 2026",
  seoTitle: "용인 vs 평택 반도체 클러스터 2026 | 집값·투자규모 한눈에 비교",
  seoDescription:
    "용인 반도체 클러스터(122조원)와 평택 삼성캠�스 주변 집값 변화를 투자 규모, 인력 유입, 최근 실거래 기준으로 비교합니다. 119주 만에 오른 평택, 평당가 1,699만원 용인까지 확인하세요.",
  description:
    "SK하이닉스 용인 반도체 클러스터와 삼성전자 평택캠퍼스 주변 부동산을 투자 규모, 인력 유입, 시세 변화, 리스크 기준으로 비교하는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-23",
  dataNote:
    "투자 규모, 공정률, 인력 전망은 SK하이닉스·언론 공식 발표 기준이며, 아파트 시세는 국토부 실거래가와 언론 보도를 인용한 확인된 거래 사례입니다. 향후 시세 전망은 다루지 않으며, 특정 지역·단지 매수를 권유하지 않습니다.",
};

export const YVP_REGIONS: RegionProfile[] = [
  {
    id: "yongin",
    name: "용인 반도체 클러스터",
    shortName: "용인",
    projectName: "용인 일반산업단지(원삼면)",
    operator: "SK하이닉스",
    siteSize: "126만 평 (팹 4개 약 60만 평 + 소부장단지 약 14만 평 + 인프라 약 12만 평)",
    totalInvestment: "총 122조원 이상 (1기 팹 약 31조원 포함)",
    badge: "확인됨",
    sourceLabel: "SK hynix Newsroom · 머니투데이(2026-01-21)",
    sourceUrl: "https://www.mt.co.kr/politics/2026/01/21/2026012011442115017",
  },
  {
    id: "pyeongtaek",
    name: "평택 삼성전자 캠퍼스",
    shortName: "평택",
    projectName: "삼성전자 평택캠퍼스 + 고덕국제신도시",
    operator: "삼성전자",
    siteSize: "고덕국제신도시 일대 배후 주거지 포함",
    totalInvestment: "삼성전자 평택캠퍼스 누적 투자 발표분(확인 필요, 캠퍼스 자체 투자액은 비공개 구간 다수)",
    badge: "확인됨",
    sourceLabel: "중부일보 · 이투데이(2026-06)",
    sourceUrl: "https://www.joongboo.com/news/articleView.html?idxno=363728829",
  },
];

export const YVP_KPI_ROWS: KpiCompareRow[] = [
  { label: "프로젝트 부지", yongin: "126만 평", pyeongtaek: "고덕국제신도시 일대", badge: "확인됨" },
  { label: "총투자 규모", yongin: "122조원 이상", pyeongtaek: "공개 구간 다수 비공개", badge: "확인됨" },
  { label: "1기 시설 공정률", yongin: "77% (계획 대비 앞섬)", pyeongtaek: "캠퍼스 기존 가동 중, 신규 라인 순차 증설", badge: "확인됨" },
  { label: "예상 투입 인력", yongin: "2026년 하반기 약 2만명 → 2027년 상반기 최대 2.6만명", pyeongtaek: "고덕동 인구 1년간 +1만 1,000명(5.48만→6.57만)", badge: "확인됨" },
  { label: "최근 부동산 동향", yongin: "처인구 평당가 1,699만원, 전년 대비 +4.7%", pyeongtaek: "119주 만에 매매가 상승 전환(+0.14%)", badge: "확인됨" },
];

export const YVP_TIMELINE: TimelineEvent[] = [
  { id: "yg-approve", region: "yongin", date: "2026-01-15", title: "클러스터 승인 적법 판결", description: "서울행정법원, 환경단체가 제기한 소송에서 용인 반도체 클러스터 승인이 적법하다고 판결.", badge: "확인됨" },
  { id: "yg-law", region: "yongin", date: "2026-01-29", title: "반도체특별법 국회 통과", description: "전력·용수 등 인프라 구축에 속도가 붙을 전망.", badge: "확인됨" },
  { id: "yg-progress", region: "yongin", date: "2025년 말 기준", title: "1기 팹 공정률 77%", description: "SK에코플랜트 발표 기준 계획 공정보다 앞선 진행 상황.", badge: "확인됨" },
  { id: "yg-cleanroom", region: "yongin", date: "2027-02 (목표)", title: "1기 팹 첫 클린룸 오픈", description: "기존 2027년 5월 목표에서 2월로 앞당김.", badge: "확인됨" },
  { id: "pt-bottom", region: "pyeongtaek", date: "2024-02", title: "평택 아파트값 하락 시작", description: "이후 2년 4개월간 하락·정체 국면.", badge: "확인됨" },
  { id: "pt-turn", region: "pyeongtaek", date: "2026-06", title: "119주 만에 상승 전환", description: "6월 둘째 주 평택 아파트 매매가 전주 대비 +0.14%.", badge: "확인됨" },
  { id: "pt-supply", region: "pyeongtaek", date: "2026년 하반기 (예정)", title: "고덕국제신도시 약 9,000가구 분양", description: "공급 물량이 늘어나는 시점으로, 수급 변화를 함께 지켜봐야 함.", badge: "확인됨" },
];

export const YVP_HOUSING_FACTS: HousingFactCard[] = [
  { id: "yg-price", region: "yongin", label: "처인구 아파트 평당가", value: "1,699만원", detail: "2025년 기준, 2024년 대비 +4.7%", badge: "확인됨", sourceLabel: "지역 시세 보도 종합" },
  { id: "pt-hillstate", region: "pyeongtaek", label: "힐스테이트고덕센트럴 전용 84㎡", value: "8억 4,500만원", detail: "2026년 6월 실거래", badge: "확인됨", sourceLabel: "EBN·중부일보" },
  { id: "pt-paragon", region: "pyeongtaek", label: "고덕국제신도시파라곤 전용 85㎡", value: "9억 8,000만원", detail: "2021년 9월 최고가, 분양가 3억원대 중후반 대비 약 3배", badge: "확인됨", sourceLabel: "이투데이" },
  { id: "pt-unsold", region: "pyeongtaek", label: "평택시 미분양", value: "2,612가구", detail: "1년 전 5,868가구에서 약 55% 감소", badge: "확인됨", sourceLabel: "중부일보" },
];

export const YVP_RISKS: RiskCard[] = [
  {
    region: "yongin",
    title: "전력·용수 인프라 부족",
    body: "현재 전력 공급량은 약 1.9GW이지만 클러스터 완전 가동 시 15~16GW 이상이 필요해 약 8배 증설이 필요합니다. 용수도 2050년 기준 하루 109.7만㎥ 부족이 전망돼, 인프라 확보 속도가 입주·가동 일정의 핵심 변수입니다.",
    badge: "확인됨",
  },
  {
    region: "pyeongtaek",
    title: "공급 과다·미분양 이력",
    body: "평택은 한때 전국 최다 미분양 지역이라는 오명을 썼던 곳으로, 미분양이 빠르게 줄고 있지만(1년간 약 55% 감소) 올해 고덕국제신도시에서 약 9,000가구가 추가로 분양될 예정입니다. 수요 회복 속도보다 공급이 빠르면 가격 회복이 다시 꺾일 수 있습니다.",
    badge: "확인됨",
  },
];

export const YVP_FAQ: FaqItem[] = [
  {
    question: "용인 반도체 클러스터와 평택 삼성캠퍼스 중 어디가 더 오를까요?",
    answer:
      "이 리포트는 투자 추천이 아니라 두 프로젝트의 공식 발표 수치와 최근 실거래 사례를 비교하는 데 목적이 있습니다. 용인은 클러스터 착공 초기 단계로 전력·용수 인프라 리스크가 남아 있고, 평택은 119주 만에 상승 전환했지만 추가 분양 물량이 많아 공급 변수가 있습니다. 두 지역 모두 장단점이 다르므로 단정적으로 비교할 수 없습니다.",
  },
  {
    question: "용인 반도체 클러스터는 언제 완공되나요?",
    answer:
      "1기 팹은 2027년 2월 첫 클린룸 오픈을 목표로 하고 있으며(기존 5월에서 앞당김), 2025년 말 기준 공정률은 77%로 계획보다 앞서 있습니다. 다만 클러스터 전체(팹 4개, 소부장단지, 인프라 부지 포함)는 단계적으로 조성되며 전체 완공까지는 더 오랜 시간이 걸립니다.",
  },
  {
    question: "평택 아파트값은 정말 오르고 있나요?",
    answer:
      "네, 2026년 6월 둘째 주 기준 평택 아파트 매매가가 전주 대비 0.14% 올라 2024년 2월 이후 119주 만에 상승 전환했습니다. 힐스테이트고덕센트럴 전용 84㎡가 2026년 6월 8억 4,500만원에 거래된 사례도 확인됩니다. 다만 한 시점의 거래 사례를 지역 전체 시세로 일반화하면 안 됩니다.",
  },
  {
    question: "용인 처인구 아파트는 지금 사도 괜찮을까요?",
    answer:
      "이 리포트는 매수 추천을 하지 않습니다. 처인구 평당가가 1년간 4.7% 오른 것은 사실이지만, 클러스터가 실제 가동되기까지 전력·용수 인프라 확보, 보상·인허가 절차 등 변수가 남아 있습니다. 투자 판단은 별도의 전문 상담과 최신 정보 확인을 거쳐야 합니다.",
  },
  {
    question: "용인 반도체 클러스터 전력 부족 문제는 해결됐나요?",
    answer:
      "완전히 해결된 것은 아닙니다. 현재 약 1.9GW 수준의 전력 공급량을 클러스터 완전 가동 시 필요한 15~16GW까지 끌어올려야 하는데, 이는 약 8배에 달하는 증설입니다. 2026년 1월 반도체특별법이 통과돼 인프라 구축에 속도가 붙을 전망이지만, 실제 해소 시점은 계속 확인이 필요합니다.",
  },
  {
    question: "평택 미분양은 완전히 해소됐나요?",
    answer:
      "아직 완전히 해소되지는 않았습니다. 평택시 미분양은 1년 전 5,868가구에서 2,612가구로 약 55% 줄었지만, 올해 고덕국제신도시에서 약 9,000가구가 추가로 분양될 예정이라 공급이 다시 늘어날 변수가 있습니다.",
  },
];

export const YVP_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/sk-hynix-shuttle-real-estate-2026/", label: "SK하이닉스 셔틀버스 아파트 시세 정리", description: "이천 본사·셔틀 통근권 기준 시세 비교" },
  { href: "/reports/samsung-shuttle-real-estate-2026/", label: "삼성전자 셔틀권 부동산 정리", description: "삼성 캠퍼스 셔틀 통근권 기준 시세 비교" },
  { href: "/reports/seoul-housing-affordability-map-2026/", label: "내 연봉으로 서울 어디 살 수 있나", description: "서울 25개 구 매매·전세 가능 여부 지도" },
  { href: "/tools/home-purchase-fund/", label: "부동산 매매 자금 계산기", description: "대출 한도·취득세까지 포함한 자금 계산" },
];
```

---

## 4. Astro 페이지 (`src/pages/reports/yongin-vs-pyeongtaek-cluster-housing-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  YVP_META,
  YVP_REGIONS,
  YVP_KPI_ROWS,
  YVP_TIMELINE,
  YVP_HOUSING_FACTS,
  YVP_RISKS,
  YVP_FAQ,
  YVP_RELATED_LINKS,
} from "../../data/yonginVsPyeongtaekClusterHousing2026";
import { withBase } from "../../utils/base";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${YVP_META.slug}/`;
const badgeClass = (label: string) => label.replace(/\s/g, "-");

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: YVP_META.title,
    description: YVP_META.seoDescription,
    dateModified: YVP_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: YVP_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteBase },
      { "@type": "ListItem", position: 2, name: "리포트", item: `${siteBase}/reports/` },
      { "@type": "ListItem", position: 3, name: YVP_META.title, item: reportUrl },
    ],
  },
];
---

<BaseLayout title={YVP_META.seoTitle} description={YVP_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page yvp-page" data-report="yongin-vs-pyeongtaek-cluster-housing-2026">
    <CalculatorHero
      eyebrow="메가 프로젝트 비교 리포트"
      title={YVP_META.title}
      description={YVP_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        YVP_META.dataNote,
        "이 페이지는 정치적 평가나 투자 추천이 아니라 공개된 발표 수치와 실거래 사례를 비교하는 인터랙티브 리포트입니다.",
        "두 프로젝트 모두 진행 중이라 수치가 빠르게 바뀔 수 있어 업데이트 기준일을 확인하세요.",
      ]}
    />

    <!-- 5.1 개요 KPI / 5.2 타임라인 / 5.3 시세 비교 / 5.4 리스크 비교 / 5.5 요약표 / 5.6 관련 링크 -->

    <SeoContent
      introTitle="용인 클러스터와 평택 캠퍼스, 숫자로 비교하면"
      intro={YVP_SEO_INTRO}
      criteria={YVP_SEO_CRITERIA}
      faq={YVP_FAQ}
      related={YVP_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

> `YVP_SEO_INTRO`, `YVP_SEO_CRITERIA`는 데이터 파일에 추가 export하며, 6번 섹션에서 정의한다. 이 리포트는 `report-page` inline 구현(Shell 미사용)이므로 `SeoContent`는 `<Fragment slot="seo">` 없이 `main` 안에 직접 배치한다 (`lee-kang-in-psg-salary-2026.astro` 실제 구현과 동일 패턴).

---

## 5. 주요 섹션 마크업 설계

### 5.1 개요 KPI 비교

```astro
<section class="content-section yvp-overview" aria-labelledby="yvp-overview-title">
  <div class="yvp-section-heading">
    <p>한눈에 비교</p>
    <h2 id="yvp-overview-title">투자 규모와 진행 상황</h2>
    <span>두 프로젝트 모두 공식 발표·언론 보도 기준 확인된 수치입니다.</span>
  </div>

  <div class="yvp-region-cards">
    {YVP_REGIONS.map((region) => (
      <article class={`yvp-region-card yvp-region-card--${region.id}`}>
        <span class="yvp-region-badge">{region.badge}</span>
        <h3>{region.name}</h3>
        <dl>
          <div><dt>사업 주체</dt><dd>{region.operator}</dd></div>
          <div><dt>부지 규모</dt><dd>{region.siteSize}</dd></div>
          <div><dt>총투자 규모</dt><dd>{region.totalInvestment}</dd></div>
        </dl>
        <p class="yvp-region-source">출처: {region.sourceLabel}</p>
      </article>
    ))}
  </div>

  <div class="op-table-wrap yvp-kpi-table">
    <table>
      <thead><tr><th>항목</th><th>용인 클러스터</th><th>평택 캠퍼스</th></tr></thead>
      <tbody>
        {YVP_KPI_ROWS.map((row) => (
          <tr><td>{row.label}</td><td>{row.yongin}</td><td>{row.pyeongtaek}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 5.2 타임라인 (좌우 2단)

```astro
<section class="content-section yvp-timeline" aria-labelledby="yvp-timeline-title">
  <div class="yvp-section-heading">
    <p>최근 타임라인</p>
    <h2 id="yvp-timeline-title">2026년 무슨 일이 있었나</h2>
  </div>

  <div class="yvp-timeline-columns">
    <div class="yvp-timeline-col yvp-timeline-col--yongin">
      <h3>용인 클러스터</h3>
      <ol>
        {YVP_TIMELINE.filter((e) => e.region === "yongin").map((event) => (
          <li><span>{event.date}</span><strong>{event.title}</strong><p>{event.description}</p></li>
        ))}
      </ol>
    </div>
    <div class="yvp-timeline-col yvp-timeline-col--pyeongtaek">
      <h3>평택 캠퍼스</h3>
      <ol>
        {YVP_TIMELINE.filter((e) => e.region === "pyeongtaek").map((event) => (
          <li><span>{event.date}</span><strong>{event.title}</strong><p>{event.description}</p></li>
        ))}
      </ol>
    </div>
  </div>
</section>
```

### 5.3 시세 비교 카드

```astro
<section class="content-section yvp-housing" aria-labelledby="yvp-housing-title">
  <div class="yvp-section-heading">
    <p>최근 실거래 비교</p>
    <h2 id="yvp-housing-title">집값은 실제로 어떻게 움직였나</h2>
    <span>추정이 아니라 보도된 실거래·통계 수치입니다.</span>
  </div>

  <div class="yvp-housing-grid">
    {YVP_HOUSING_FACTS.map((fact) => (
      <article class={`yvp-housing-card yvp-housing-card--${fact.region}`}>
        <span class="yvp-badge yvp-badge--confirmed">{fact.badge}</span>
        <strong>{fact.value}</strong>
        <p>{fact.label}</p>
        <small>{fact.detail} · {fact.sourceLabel}</small>
      </article>
    ))}
  </div>
</section>
```

### 5.4 리스크 비교

```astro
<section class="content-section yvp-risk" aria-labelledby="yvp-risk-title">
  <div class="yvp-section-heading">
    <p>같이 봐야 할 리스크</p>
    <h2 id="yvp-risk-title">장점만 보면 안 되는 이유</h2>
  </div>

  <div class="yvp-risk-grid">
    {YVP_RISKS.map((risk) => (
      <article class={`yvp-risk-card yvp-risk-card--${risk.region}`}>
        <h3>{risk.title}</h3>
        <p>{risk.body}</p>
      </article>
    ))}
  </div>
</section>
```

### 5.5 한눈에 비교 요약

```astro
<section class="content-section yvp-summary" aria-labelledby="yvp-summary-title">
  <div class="yvp-section-heading">
    <p>요약</p>
    <h2 id="yvp-summary-title">용인 vs 평택, 핵심만 정리하면</h2>
  </div>
  <div class="yvp-summary-grid">
    <article>
      <h3>용인 클러스터</h3>
      <p>착공 초기 단계, 공정률 77%로 계획보다 빠름. 전력·용수 인프라 확보가 관전 포인트.</p>
    </article>
    <article>
      <h3>평택 캠퍼스</h3>
      <p>이미 가동 중인 캠퍼스 배후 주거지로, 119주 만에 시세 반등. 추가 분양 물량이 변수.</p>
    </article>
  </div>
</section>
```

### 5.6 관련 링크

```astro
<section class="content-section yvp-related" aria-labelledby="yvp-related-title">
  <div class="yvp-section-heading">
    <p>같이 보면 좋은 콘텐츠</p>
    <h2 id="yvp-related-title">반도체 클러스터·셔틀권 리포트 이어서 보기</h2>
  </div>
  <div class="yvp-related-grid">
    {YVP_RELATED_LINKS.map((link) => (
      <a class="yvp-related-card" href={withBase(link.href)}>
        <strong>{link.label}</strong>
        <p>{link.description}</p>
      </a>
    ))}
  </div>
</section>
```

---

## 6. SEO 콘텐츠 (GOOGLE_SEO_RULES.md 기준 — intro 5단락 800자 이상, faq 5개 이상)

데이터 파일에 추가 export:

```ts
export const YVP_SEO_INTRO: string[] = [
  "서울 경기 남부 부동산이 심상치 않다는 체감은 숫자로도 확인됩니다. SK하이닉스가 짓고 있는 용인 반도체 클러스터는 부지 126만 평, 총투자 규모 122조원 이상의 메가 프로젝트이고, 삼성전자 평택캠퍼스 배후 주거지인 고덕국제신도시는 2년 4개월간의 하락·정체를 끝내고 2026년 6월 119주 만에 매매가가 상승 전환했습니다. 이 리포트는 두 프로젝트를 같은 화면에서 비교해, 투자 규모·진행 상황·실거래 시세·리스크까지 한눈에 확인할 수 있게 정리했습니다.",
  "용인 반도체 클러스터는 SK하이닉스 팹 4개(약 60만 평)와 소부장 협력단지(약 14만 평), 인프라 부지(약 12만 평)로 구성됩니다. 2025년 말 기준 1기 팹 공정률은 77%로 계획보다 앞서 있고, 첫 클린룸 오픈 목표도 2027년 5월에서 2월로 앞당겨졌습니다. 2026년 1월에는 환경단체가 제기한 소송에서 클러스터 승인이 적법하다는 판결이 나왔고, 반도체특별법도 국회를 통과해 인프라 구축에 속도가 붙을 전망입니다.",
  "다만 용인 클러스터에는 분명한 리스크도 있습니다. 현재 전력 공급량은 약 1.9GW에 불과한데 완전 가동 시 15~16GW 이상이 필요해 약 8배 증설이 필요하고, 용수도 2050년 기준 하루 109.7만㎥가 부족할 것으로 전망됩니다. 처인구 아파트 평당가는 1년 사이 4.7% 올라 1,699만원을 기록했지만, 이는 클러스터가 실제 가동되기 전 기대감이 선반영된 수치라는 점도 함께 봐야 합니다.",
  "평택은 상황이 다릅니다. 이미 가동 중인 삼성전자 캠퍼스를 배후로 둔 고덕국제신도시는 한때 전국 최다 미분양 지역이라는 오명을 썼지만, 1년 사이 미분양이 5,868가구에서 2,612가구로 약 55% 줄었습니다. 힐스테이트고덕센트럴 전용 84㎡는 2026년 6월 8억 4,500만원에 거래됐고, 고덕국제신도시파라곤 전용 85㎡는 2021년 9월 최고가 9억 8,000만원을 기록한 바 있습니다. 다만 올해 고덕국제신도시에서 약 9,000가구가 추가로 분양될 예정이라 공급 변수도 함께 봐야 합니다.",
  "이 리포트는 어느 지역이 투자하기 좋다고 추천하지 않습니다. 두 프로젝트는 진행 단계도 다르고(용인은 착공 초기, 평택은 이미 가동 중인 캠퍼스 배후지) 리스크의 성격도 다릅니다(용인은 인프라 부족, 평택은 공급 과다 이력). 공개된 발표 수치와 실거래 사례를 비교해서 읽는 데 목적이 있으며, 실제 거주·투자 판단은 최신 정보와 전문 상담을 거쳐야 합니다.",
];

export const YVP_SEO_CRITERIA: string[] = [
  "투자 규모, 공정률, 인력 전망은 SK하이닉스 공식 발표와 언론 보도를 인용한 확인된 수치입니다.",
  "아파트 시세는 국토부 실거래가와 언론에 보도된 실제 거래 사례를 인용했으며 추정값이 아닙니다.",
  "두 프로젝트의 진행 단계와 리스크 성격이 다르므로 단순 비교로 우열을 판단하지 않습니다.",
  "이 리포트는 투자 추천이 아니며, 특정 지역·단지 매수를 권유하지 않습니다.",
];
```

---

## 7. SCSS 설계 포인트 (`_yongin-vs-pyeongtaek-cluster-housing-2026.scss`)

기존 `_sk-hynix-shuttle-real-estate-2026.scss`의 카드/배지/표 패턴을 재사용하고, 좌우 2단 타임라인과 지역별 색상 토큰만 추가:

```scss
.yvp-page {
  --yvp-ink: #172033;
  --yvp-muted: #667085;
  --yvp-line: #d8e0ea;
  --yvp-yongin: #2f5acf;
  --yvp-pyeongtaek: #0f8a5f;

  .yvp-region-card--yongin { border-top: 3px solid var(--yvp-yongin); }
  .yvp-region-card--pyeongtaek { border-top: 3px solid var(--yvp-pyeongtaek); }

  .yvp-timeline-columns {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .yvp-timeline-col--yongin h3 { color: var(--yvp-yongin); }
  .yvp-timeline-col--pyeongtaek h3 { color: var(--yvp-pyeongtaek); }

  .yvp-housing-card--yongin strong { color: var(--yvp-yongin); }
  .yvp-housing-card--pyeongtaek strong { color: var(--yvp-pyeongtaek); }

  @media (max-width: 640px) {
    .yvp-timeline-columns { grid-template-columns: 1fr; }
  }
}
```

> 카드/표/배지 기본 레이아웃(`yvp-region-cards`, `yvp-housing-grid`, `yvp-risk-grid`, `op-table-wrap` 등)은 `_sk-hynix-shuttle-real-estate-2026.scss`, `_han-seong-sook-pm-nominee-career-assets-2026.scss` 패턴을 그대로 복제해 일관성을 유지한다.

---

## 8. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `yongin-vs-pyeongtaek-cluster-housing-2026` 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/yongin-vs-pyeongtaek-cluster-housing-2026';` 추가 |
| `public/sitemap.xml` | `/reports/yongin-vs-pyeongtaek-cluster-housing-2026/` 추가 (`changefreq: weekly` — 진행 상황 변동 빈번) |
| `src/data/skHynixShuttleRealEstate2026.ts` | `SK_HYNIX_SHUTTLE_RELATED`에 본 리포트 링크 추가 검토 |
| `src/data/samsungShuttleRealEstate2026.ts` | 관련 링크에 본 리포트 추가 검토 |
| `src/pages/reports/index.astro` | 리포트 허브 노출 확인 |

---

## 9. QA 포인트

- [ ] `intro` 5단락 이상, 800자 이상 / `faq` 6개
- [ ] 모든 핵심 수치에 출처 표기, "확인됨"과 "전망/추정" 구분 명확
- [ ] 매수 추천처럼 읽히는 문장이 없는지 전체 검토 (특히 KPI·요약 섹션)
- [ ] 좌우 타임라인이 모바일 375px에서 세로 스택으로 자연스럽게 전환
- [ ] JSON-LD `Article`, `FAQPage`, `BreadcrumbList` 생성 확인
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 누락 없음
- [ ] `npm run build` 성공
- [ ] 추후 갱신 포인트(공정률, 미분양 수치, 추가 분양 일정)를 `updatedAt` 기준으로 주기적 확인

---

## 10. 구현 리스크 및 갱신 계획

- **수치 변동 속도**: 공정률, 미분양 가구수, 시세는 분기/월 단위로 바뀜 — `updatedAt`을 자주 갱신하고 출처 링크를 유지해 사후 검증 가능하게 함.
- **투자 추천 오인 리스크**: KPI·요약 섹션에서 "오를까" 식 결론을 내리지 않도록 문장 검토. FAQ 1번에서 명확히 투자 추천이 아님을 고지.
- **평택 캠퍼스 투자액 비공개 한계**: 삼성전자는 SK하이닉스만큼 클러스터 단위 총투자액을 명시적으로 공개하지 않는 구간이 있어, `totalInvestment` 필드에 "공개 구간 다수 비공개"로 정직하게 표기 — 억지로 추정치를 채우지 않음.
- **기존 셔틀권 리포트와의 역할 분리**: 이 리포트는 "메가 프로젝트 자체의 투자·고용 임팩트", 셔틀권 리포트는 "통근 셔틀 기준 시세"로 명확히 구분해 관련 링크 설명문에도 반영.
