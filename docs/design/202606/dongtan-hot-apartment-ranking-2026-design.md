# 동탄 신고가 아파트 TOP10 추적 리포트 — 설계 문서

## 1. 개요

- **슬러그**: `reports/dongtan-hot-apartment-ranking-2026`
- **유형**: 리포트 (순위·추적형, 정적 — 계산기 아님)
- **prefix**: `dhar-` (Dongtan Hot Apartment Ranking)
- **데이터 파일**: `src/data/dongtanHotApartmentRanking2026.ts`
- **기획 문서**: `docs/plan/202606/dongtan-hot-apartment-ranking-2026-plan.md`
- **레이아웃**: 기존 `op-page` 공용 클래스(`op-section`/`op-table-wrap`/`op-message`) 재사용 (`yongin-vs-pyeongtaek-cluster-housing-2026`, `samsung-vs-skhynix-earnings-bonus-2026`와 동일 패턴)
- **역할 분리**: 이 리포트는 "순위·추적"만 담당. "감당 가능한가"는 `dongtan-20-billion-apartment-affordability-2026`, "다른 지역과 비교"는 `gyeonggi-south-leader-apartment-comparison-2026`로 연결.

---

## 2. 확보된 데이터 (추가 검증 결과, 2026-06 보도 종합)

설계 단계에서 추가 검색으로 9개 단지를 확보했다(기획 문서의 8개 + 1개 추가). **TOP10을 억지로 채우기 위해 추정 단지를 넣지 않고, 확인된 9개로 진행**한다 — CONTENT_GUIDE.md의 "추정 남발 금지" 원칙 준수.

| 순위 | 단지명 | 지역 | 거래가 | 평형 | 거래일 | 직전 최고가 | 상승액 | 배지 |
|---|---|---|---|---|---|---|---|---|
| 1 | 동탄역롯데캐슬 | 여울동 | 22억 2,500만원 | 84㎡ | 06-04 | 20억 8,000만원 | +1억 4,500만원(1개월) | 확인됨 |
| 2 | 동탄역시범우남퍼스트빌 | 동탄역 인근 | 18억 6,000만원 | 84㎡ | 06-05 | 17억 3,000만원 | +1억 3,000만원 | 확인됨 |
| 3 | 동탄역시범한화꿈에그린프레스티지 | 동탄역 인근 | 17억 6,000만원 | 84㎡ | 06-05 | 15억 8,000만원 | +1억 8,000만원 | 확인됨 |
| 4 | 동탄역시범더샵센트럴시티 | 동탄역 인근 | 16억 1,000만원 | 84㎡ | 06-16 | 15억 3,000만원 | +8,000만원 | 확인됨 |
| 5 | 동탄 린스트라우스더레이트 | - | 14억원 | 98㎡ | 06-02 | 직전 거래 미확인 | - | 확인됨(평형 주의) |
| 6 | 호수공원역센트럴시티 | 호수공원 인근 | 11억 9,500만원 | 84㎡ | 06-20 | 직전 거래 미확인 | - | 확인됨 |
| 7 | 동탄더레이크팰리스 | - | 10억 5,000만원 | 84㎡ | 06-05 | 직전 거래 미확인 | - | 확인됨 |
| 8 | 동탄레이크자연앤푸르지오 | 호수공원 인근 | 9억 9,000만원 | 84㎡ | 06월 | 직전 거래 미확인 | - | 확인됨 |
| 9 | 그린힐반도유보라아이비파크10 | 산척동(외곽) | 4억 9,000만원 | 84㎡ | 06월 | - | - | 확인됨 (양극화 비교용) |

> 9번(그린힐반도유보라아이비파크10)은 순위표가 아니라 **"같은 동탄인데 4배 차이" 양극화 비교 카드**에 별도로 배치한다. TOP 랭킹 자체는 1~8위(고가 단지)로 구성.

### 시장 과열 KPI (정성 지표)

| 지표 | 값 | 출처 |
|---|---|---|
| 동탄구 주간 아파트 가격 상승률 | +1.98% (전국 최고, 서울 강서구 0.42%의 4배+) | 파이낸셜뉴스 2026-06-14 |
| 주말 방문 수요 | "하루 10여 팀" (중개사 인터뷰, 3개 조로 나눠 안내) | 파이낸셜뉴스 2026-06-14 |
| 계약파기 배액배상 사례 | 계약금 8,000만원 → 배액배상 1억 6,000만원 지급 후 해제 → 재매도 9억 5,000만~10억원(+1억 5,000만~2억원) | 파이낸셜뉴스 2026-06-14 |
| 동탄 내 가격 격차 | 중심지 22억 2,500만원 vs 외곽 4억 9,000만원 (약 4.5배) | 파이낸셜뉴스 2026-06-14 |

---

## 3. 화면 구성 (IA)

```text
[BaseLayout]
  SiteHeader
  main.report-page.op-page.dhar-page
    CalculatorHero          (eyebrow: "동탄 부동산 추적 리포트")
    InfoNotice              (실거래 보도 기준, 투자 추천 아님, 동/층/향 편차 고지)

    section.op-section      (시장 온도 KPI 카드 4개)
    section.op-section      (신고가 TOP8 테이블 — 핵심 섹션)
    section.op-section      (이번 달 갱신된 신고가 하이라이트)
    section.op-section      (같은 동탄인데 4배 차이 — 양극화 비교 카드)
    section.op-section      (과열 신호 해석 카드 3종)
    section.op-section      (관련 리포트 링크)

    SeoContent
```

---

## 4. 데이터 파일 (`src/data/dongtanHotApartmentRanking2026.ts`)

```ts
export type FactBadge = "확인됨" | "추정" | "주의";

export interface HotApartmentRow {
  rank: number;
  complexName: string;
  district: string;
  priceManwon: number;
  unitArea: string;
  tradeDate: string;
  prevHighManwon: number | null;
  increaseManwon: number | null;
  increasePeriod: string | null;
  badge: FactBadge;
  note?: string;
}

export interface MarketHeatKpi {
  label: string;
  value: string;
  description: string;
  badge: FactBadge;
}

export interface PolarizationCard {
  label: string;
  complexName: string;
  district: string;
  priceManwon: number;
  unitArea: string;
}

export interface InsightCard {
  title: string;
  body: string;
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

export const DHAR_META = {
  slug: "dongtan-hot-apartment-ranking-2026",
  title: "동탄 신고가 아파트 TOP8 추적 2026",
  seoTitle: "동탄 아파트 신고가 순위 2026 | 한 달 만에 1억 4천 오른 단지는",
  seoDescription:
    "동탄역롯데캐슬 22억 2,500만원 등 2026년 6월 신고가를 기록한 동탄 아파트 8곳을 거래가·상승액 기준으로 정리합니다. 주간 상승률 전국 1위, 동탄 부동산 과열 신호도 함께 확인하세요.",
  description:
    "2026년 6월 신고가를 기록한 동탄 아파트 8곳을 거래가, 거래일, 직전 최고가 대비 상승액 기준으로 추적하는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-25",
  dataNote:
    "거래가는 2026년 6월 보도된 실거래 사례(파이낸셜뉴스 등)를 인용한 확인된 수치이며, 추정값이 아닙니다. 같은 단지라도 동·층·향·연식에 따라 가격이 크게 다르므로 표의 가격을 단지 전체의 확정 시세로 보면 안 됩니다. 이 리포트는 투자 추천이 아니며, 매수·매도 결정은 별도 확인을 거쳐야 합니다.",
};

export const DHAR_RANKING: HotApartmentRow[] = [
  { rank: 1, complexName: "동탄역롯데캐슬", district: "여울동", priceManwon: 222500, unitArea: "84㎡", tradeDate: "2026-06-04", prevHighManwon: 208000, increaseManwon: 14500, increasePeriod: "1개월", badge: "확인됨" },
  { rank: 2, complexName: "동탄역시범우남퍼스트빌", district: "동탄역 인근", priceManwon: 186000, unitArea: "84㎡", tradeDate: "2026-06-05", prevHighManwon: 173000, increaseManwon: 13000, increasePeriod: null, badge: "확인됨" },
  { rank: 3, complexName: "동탄역시범한화꿈에그린프레스티지", district: "동탄역 인근", priceManwon: 176000, unitArea: "84㎡", tradeDate: "2026-06-05", prevHighManwon: 158000, increaseManwon: 18000, increasePeriod: null, badge: "확인됨" },
  { rank: 4, complexName: "동탄역시범더샵센트럴시티", district: "동탄역 인근", priceManwon: 161000, unitArea: "84㎡", tradeDate: "2026-06-16", prevHighManwon: 153000, increaseManwon: 8000, increasePeriod: null, badge: "확인됨" },
  { rank: 5, complexName: "동탄 린스트라우스더레이트", district: "동탄2신도시", priceManwon: 140000, unitArea: "98㎡", tradeDate: "2026-06-02", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨", note: "84㎡가 아닌 98㎡ 거래입니다. 면적이 달라 다른 단지와 직접 비교하면 안 됩니다." },
  { rank: 6, complexName: "호수공원역센트럴시티", district: "호수공원 인근", priceManwon: 119500, unitArea: "84㎡", tradeDate: "2026-06-20", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨" },
  { rank: 7, complexName: "동탄더레이크팰리스", district: "호수공원 인근", priceManwon: 105000, unitArea: "84㎡", tradeDate: "2026-06-05", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨" },
  { rank: 8, complexName: "동탄레이크자연앤푸르지오", district: "호수공원 인근", priceManwon: 99000, unitArea: "84㎡", tradeDate: "2026-06", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨" },
];

export const DHAR_MARKET_HEAT: MarketHeatKpi[] = [
  { label: "동탄구 주간 상승률", value: "+1.98%", description: "전국 최고 수준, 서울 강서구(0.42%)의 4배 이상", badge: "확인됨" },
  { label: "주말 방문 수요", value: "하루 10여 팀", description: "한 집을 보러 오는 팀 수, 3개 조로 나눠 안내 (중개사 인터뷰)", badge: "확인됨" },
  { label: "계약파기 배액배상", value: "1억 6,000만원", description: "계약금 8,000만원 거래를 배액배상 후 해제, 재매도 시 1.5~2억원 추가 차익", badge: "확인됨" },
  { label: "동탄 내 가격 격차", value: "약 4.5배", description: "중심지 22억 2,500만원 vs 외곽 4억 9,000만원", badge: "확인됨" },
];

export const DHAR_POLARIZATION: PolarizationCard[] = [
  { label: "중심지 (동탄역 초역세권)", complexName: "동탄역롯데캐슬", district: "여울동", priceManwon: 222500, unitArea: "84㎡" },
  { label: "외곽 (산척동)", complexName: "그린힐반도유보라아이비파크10", district: "산척동", priceManwon: 49000, unitArea: "84㎡" },
];

export const DHAR_INSIGHTS: InsightCard[] = [
  {
    title: "신고가가 한 달 단위로 갱신되고 있다",
    body: "동탄역롯데캐슬은 5월 20억 8,000만원에서 6월 22억 2,500만원으로 한 달 만에 1억 4,500만원이 올랐습니다. 동탄역시범 단지들도 같은 기간 8,000만~1억 8,000만원씩 직전 최고가를 경신했습니다.",
  },
  {
    title: "주말마다 10팀씩 몰리는 매수 경쟁",
    body: "공인중개사 인터뷰에 따르면 주말에는 한 집에 하루 10여 팀이 방문해 3개 조로 나눠 안내해야 할 정도로 수요가 집중되고 있습니다.",
  },
  {
    title: "계약을 깨도 더 남는 구조",
    body: "한 매도자는 계약금 8,000만원 거래를 배액배상(1억 6,000만원)으로 해제한 뒤 재매도해 원래 계약가보다 1억 5,000만~2억원을 더 받았습니다. 위약금을 물어도 다시 팔면 남는 시장이라는 점이 과열의 핵심 신호입니다.",
  },
  {
    title: "같은 동탄인데 4배 넘게 차이 난다",
    body: "동탄역 초역세권(22억 2,500만원)과 외곽 산척동(4억 9,000만원)의 84㎡ 가격 차이가 약 4.5배에 달합니다. '동탄'이라는 한 단어로 뭉뚱그려 보면 체감이 크게 왜곡될 수 있습니다.",
  },
];

export const DHAR_FAQ: FaqItem[] = [
  {
    question: "신고가는 무엇을 기준으로 판단하나요?",
    answer:
      "국토교통부 실거래가 공개시스템에 등록된 거래 중 해당 단지·평형의 직전 최고 거래가를 넘어선 거래를 신고가로 봅니다. 이 리포트는 언론에 보도된 실거래 사례를 인용했으며, 보도되지 않은 더 높은 거래가 있을 수도 있습니다.",
  },
  {
    question: "동탄은 왜 이렇게 많이 오르고 있나요?",
    answer:
      "GTX-A 노선 개통 기대감, 반도체 클러스터(용인·평택) 배후 주거지로서의 수요, 규제 변경 전 매수를 서두르는 심리가 겹친 것으로 보도되고 있습니다. 다만 이 리포트는 원인을 단정하기보다 실제 거래 데이터로 확인된 현상을 정리하는 데 초점을 맞춥니다.",
  },
  {
    question: "지금 동탄 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천을 하지 않습니다. 신고가 랠리와 과열 신호를 보여드리지만, 신고가 이후 가격이 유지되는지 꺾이는지는 후속 거래를 지켜봐야 알 수 있습니다. 실제 매수 결정은 본인의 자금 계획과 리스크 감내 수준에 따라 별도로 판단해야 합니다.",
  },
  {
    question: "배액배상이 무엇인가요?",
    answer:
      "매도자가 계약을 일방적으로 해제할 때 받은 계약금의 2배를 매수자에게 돌려주는 것을 말합니다. 이 리포트에 소개된 사례는 매도자가 1억 6,000만원(계약금 8,000만원의 2배)을 물어주고도 가격이 더 오른 뒤 재매도해 차익을 본 경우로, 시장이 얼마나 빠르게 오르고 있는지를 보여주는 사례입니다.",
  },
  {
    question: "이 순위는 얼마나 자주 업데이트되나요?",
    answer:
      "신고가는 거래가 발생할 때마다 바뀔 수 있어 이 리포트는 월 1회 이상 갱신을 목표로 합니다. 업데이트 기준일은 페이지 상단에 표시되며, 가장 최신 거래는 국토교통부 실거래가 공개시스템에서 직접 확인하는 것이 가장 정확합니다.",
  },
  {
    question: "같은 단지인데 다른 사이트랑 가격이 다른 이유는 무엇인가요?",
    answer:
      "같은 단지라도 동·층·향·연식에 따라 가격이 크게 다르고, 호가와 실거래가도 차이가 날 수 있습니다. 이 리포트의 가격은 보도된 특정 거래 사례이며, 같은 평형이라도 다른 거래는 가격이 다를 수 있습니다.",
  },
];

export const DHAR_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/dongtan-20-billion-apartment-affordability-2026/", label: "동탄 20억 시대, 진짜 가능한 가격일까?", description: "84㎡ 20억 기준 필요 현금·대출·월 상환액 검증" },
  { href: "/reports/gyeonggi-south-leader-apartment-comparison-2026/", label: "동탄·분당·수지·영통 대장 아파트 가격 비교", description: "경기 남부 4개 지역 대장 아파트 비교" },
  { href: "/reports/bundang-redevelopment-vs-dongtan-newbuild-2026/", label: "분당 재건축 vs 동탄 신축, 15억이면 어디가 나을까", description: "예산 15억 기준 지역 선택 비교" },
  { href: "/reports/yongin-vs-pyeongtaek-cluster-housing-2026/", label: "용인 vs 평택 반도체 클러스터 2026", description: "경기 남부 메가 프로젝트와 부동산 영향 비교" },
];

export const DHAR_SEO_INTRO: string[] = [
  "동탄 아파트값이 무섭게 오르고 있다는 체감은 숫자로도 확인됩니다. 2026년 6월 동탄구 주간 아파트 가격은 전주 대비 1.98% 올라 전국 최고 상승률을 기록했고, 이는 같은 기간 서울 강서구(0.42%)의 4배가 넘는 속도입니다. 이 리포트는 실제로 어떤 단지가 신고가를 기록했는지, 한 달 사이 얼마나 올랐는지를 보도된 실거래 사례 기준으로 추적합니다.",
  "가장 눈에 띄는 사례는 동탄역롯데캐슬입니다. 전용 84㎡가 5월 20억 8,000만원에서 6월 4일 22억 2,500만원에 거래되며 한 달 만에 1억 4,500만원이 올랐습니다. 동탄역시범우남퍼스트빌(+1억 3,000만원), 동탄역시범한화꿈에그린프레스티지(+1억 8,000만원), 동탄역시범더샵센트럴시티(+8,000만원)도 같은 시기 직전 최고가를 잇따라 경신했습니다.",
  "가격만큼 눈에 띄는 건 시장의 '온도'입니다. 한 공인중개사는 주말마다 한 집에 하루 10여 팀이 몰려 3개 조로 나눠 안내해야 한다고 말했고, 한 매도자는 계약금 8,000만원짜리 거래를 배액배상(1억 6,000만원)으로 해제한 뒤 다시 팔아 1억 5,000만~2억원을 더 받았습니다. 위약금을 물어줘도 다시 파는 게 더 이득인 시장이라는 뜻으로, 이 리포트가 다루는 '과열'의 실체를 보여주는 사례입니다.",
  "다만 '동탄'이라는 한 단어로 뭉뚱그려 보면 체감이 크게 왜곡될 수 있습니다. 동탄역 초역세권 동탄역롯데캐슬이 22억 2,500만원인 반면, 외곽 산척동의 그린힐반도유보라아이비파크10은 같은 84㎡가 4억 9,000만원으로 약 4.5배 차이가 납니다. 이 리포트는 신고가 순위와 함께 이런 양극화도 같은 화면에서 보여줍니다.",
  "이 리포트는 매수 추천이 아닙니다. 신고가 랠리와 과열 신호를 데이터로 정리해 보여드리지만, 신고가 이후 가격이 유지될지 꺾일지는 후속 거래를 지켜봐야 합니다. 같은 단지도 동·층·향·연식에 따라 가격이 크게 다르므로 표의 가격을 단지 전체의 확정 시세로 받아들이지 말고, 실제 매수 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 거쳐야 합니다.",
];

export const DHAR_SEO_CRITERIA: string[] = [
  "거래가는 2026년 6월 언론에 보도된 실거래 사례를 인용한 확인된 수치이며 추정값이 아닙니다.",
  "같은 단지도 동·층·향·연식에 따라 가격이 크게 다르므로 표의 가격을 단지 전체의 확정 시세로 보면 안 됩니다.",
  "TOP10을 채우기 위해 추정 단지를 넣지 않았으며, 확인된 8개 단지만 순위에 포함했습니다.",
  "이 리포트는 투자·매수 추천이 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 거쳐야 합니다.",
];
```

---

## 5. Astro 페이지 (`src/pages/reports/dongtan-hot-apartment-ranking-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  DHAR_META,
  DHAR_RANKING,
  DHAR_MARKET_HEAT,
  DHAR_POLARIZATION,
  DHAR_INSIGHTS,
  DHAR_FAQ,
  DHAR_SEO_INTRO,
  DHAR_SEO_CRITERIA,
  DHAR_RELATED_LINKS,
} from "../../data/dongtanHotApartmentRanking2026";
import { withBase } from "../../utils/base";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${DHAR_META.slug}/`;
const formatEok = (manwon: number) => {
  const eok = manwon / 10000;
  return `${eok >= 10 ? eok.toFixed(1) : eok.toFixed(2)}억원`.replace(".0억원", "억원");
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: DHAR_META.title,
    description: DHAR_META.seoDescription,
    dateModified: DHAR_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DHAR_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: DHAR_META.title, item: reportUrl },
    ],
  },
];
---

<BaseLayout title={DHAR_META.seoTitle} description={DHAR_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page dhar-page" data-report="dongtan-hot-apartment-ranking-2026">
    <CalculatorHero
      eyebrow="동탄 부동산 추적 리포트"
      title={DHAR_META.title}
      description={DHAR_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        DHAR_META.dataNote,
        "이 페이지는 투자·매수 추천이 아니라 보도된 실거래 사례를 정리한 추적용 리포트입니다.",
        "TOP10을 채우기 위해 추정 단지를 넣지 않았으며, 확인된 8개 단지만 순위에 포함했습니다.",
      ]}
    />

    <!-- 6.1 시장온도 KPI / 6.2 신고가 랭킹 / 6.3 양극화 카드 / 6.4 해석 / 6.5 관련링크 -->

    <SeoContent
      introTitle="동탄, 한 달 만에 1억 4천 오른 진짜 이유"
      intro={DHAR_SEO_INTRO}
      criteria={DHAR_SEO_CRITERIA}
      faq={DHAR_FAQ}
      related={DHAR_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 6. 주요 섹션 마크업 설계

### 6.1 시장 온도 KPI

```astro
<section class="op-section">
  <h2>동탄 부동산, 지금 얼마나 뜨거운가</h2>
  <p class="op-message">2026년 6월 보도 기준 확인된 시장 과열 신호입니다.</p>
  <div class="dhar-heat-grid">
    {DHAR_MARKET_HEAT.map((kpi) => (
      <article class="dhar-heat-card">
        <span>{kpi.label}</span>
        <strong>{kpi.value}</strong>
        <p>{kpi.description}</p>
      </article>
    ))}
  </div>
</section>
```

### 6.2 신고가 랭킹 테이블 (핵심 섹션)

```astro
<section class="op-section">
  <h2>동탄 신고가 아파트 TOP8</h2>
  <p class="op-message">전부 84㎡(5위 제외) 기준 확인된 실거래 사례입니다.</p>
  <div class="op-table-wrap dhar-ranking-table">
    <table>
      <thead>
        <tr><th>순위</th><th>단지명</th><th>지역</th><th>거래가</th><th>평형</th><th>거래일</th><th>직전 최고가 대비</th></tr>
      </thead>
      <tbody>
        {DHAR_RANKING.map((row) => (
          <tr class={row.tradeDate.startsWith("2026-06-1") || row.tradeDate.startsWith("2026-06-2") ? "dhar-row--recent" : ""}>
            <td>{row.rank}</td>
            <td>{row.complexName}{row.note && <span class="dhar-note-flag" title={row.note}>ⓘ</span>}</td>
            <td>{row.district}</td>
            <td>{formatEok(row.priceManwon)}</td>
            <td>{row.unitArea}</td>
            <td>{row.tradeDate}</td>
            <td>{row.increaseManwon ? `+${formatEok(row.increaseManwon)}${row.increasePeriod ? ` (${row.increasePeriod})` : ""}` : "직전 거래 미확인"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 6.3 양극화 비교 카드

```astro
<section class="op-section">
  <h2>같은 동탄인데 4배 넘게 차이 난다</h2>
  <div class="dhar-polarization-grid">
    {DHAR_POLARIZATION.map((card) => (
      <article class="dhar-polarization-card">
        <span>{card.label}</span>
        <strong>{card.complexName}</strong>
        <small>{card.district} · {card.unitArea}</small>
        <em>{formatEok(card.priceManwon)}</em>
      </article>
    ))}
  </div>
  <p class="op-message">두 단지 모두 84㎡ 기준이며, 가격 차이는 약 4.5배입니다.</p>
</section>
```

### 6.4 과열 신호 해석

```astro
<section class="op-section">
  <h2>왜 과열이라고 보는가</h2>
  <div class="dhar-insight-grid">
    {DHAR_INSIGHTS.map((insight) => (
      <article><h3>{insight.title}</h3><p>{insight.body}</p></article>
    ))}
  </div>
</section>
```

### 6.5 관련 링크

```astro
<section class="op-section">
  <h2>동탄·경기 남부 리포트 이어서 보기</h2>
  <div class="dhar-related-grid">
    {DHAR_RELATED_LINKS.map((link) => (
      <a class="dhar-related-card" href={withBase(link.href)}>
        <strong>{link.label}</strong>
        <p>{link.description}</p>
      </a>
    ))}
  </div>
</section>
```

---

## 7. SCSS (`_dongtan-hot-apartment-ranking-2026.scss`)

`op-page` 공용 클래스를 베이스로 하고, 신규 클래스만 추가 (다른 최근 리포트와 동일한 색상 토큰 체계):

```scss
.dhar-page {
  --dhar-ink: #172033;
  --dhar-muted: #667085;
  --dhar-line: #d8e0ea;
  --dhar-hot: #c23b3b;
  --dhar-accent: #2f5acf;

  .dhar-heat-grid,
  .dhar-polarization-grid,
  .dhar-insight-grid,
  .dhar-related-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .dhar-heat-card strong { color: var(--dhar-hot); font-size: clamp(20px, 3.5vw, 26px); }

  .dhar-row--recent { background: #fff8e8; } /* 최근 갱신 신고가 강조 */

  .dhar-note-flag { margin-left: 4px; color: var(--dhar-muted); cursor: help; }

  .dhar-polarization-card em { color: var(--dhar-hot); font-size: 20px; font-style: normal; font-weight: 900; }

  /* 카드/표 기본 박스 스타일은 기존 yongin-vs-pyeongtaek-cluster-housing-2026 패턴과 동일하게 복제 */
}
```

---

## 8. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `dongtan-hot-apartment-ranking-2026` 항목 추가 |
| `src/pages/reports/index.astro` | `reportMetaBySlug`에 항목 추가 (누락 시 통째로 안 보이는 버그 재발 — 반드시 확인) |
| `src/pages/index.astro` | `reportMetaBySlug`(홈)에도 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/dongtan-hot-apartment-ranking-2026';` 추가 |
| `public/sitemap.xml` | `/reports/dongtan-hot-apartment-ranking-2026/` 추가 (`changefreq: weekly` — 신고가 빈번 갱신) |
| 기존 4개 동탄 리포트 | `relatedLinks`에 본 리포트 상호 추가 검토 |

---

## 9. QA 포인트

- [ ] intro 5단락 이상 800자 이상, FAQ 6개
- [ ] 순위표가 8개 단지로 정직하게 표시되고 "TOP10" 표기를 쓰지 않음 (제목에 TOP8로 명시)
- [ ] 직전 최고가 미확인 단지는 공란이 아니라 "직전 거래 미확인"으로 명시 표기
- [ ] 5위(98㎡) 단지에 면적 주의 안내가 노출됨
- [ ] 양극화 카드 두 단지 모두 84㎡로 동일 기준임이 명시됨
- [ ] "매수 추천" 같은 표현이 없는지 전체 검토 (특히 해석 카드 4종)
- [ ] `/reports/index.astro`와 홈 `index.astro` 양쪽 매핑 모두 등록 (직전 작업에서 누락 버그가 있었으므로 이번엔 처음부터 함께 등록)
- [ ] JSON-LD 3종 생성 확인
- [ ] `npm run build` 성공
- [ ] (정적 표시 위주, 신규 계산 로직 없음 — 별도 브라우저 인터랙션 검증 불필요. 단, 빌드 후 dist에서 8개 단지명과 FAQ 6개 텍스트 존재만 grep 확인)

---

## 10. 구현 리스크 및 운영 계획

- **데이터 신선도**: 신고가는 빠르게 갱신됨 — `updatedAt` 기준 월 1회 이상 갱신 운영 필요. 갱신 시 `DHAR_RANKING` 배열과 `DHAR_MARKET_HEAT`를 함께 점검.
- **TOP10 vs TOP8 정직성**: 기획 문서는 "TOP10"으로 시작했으나 설계 단계에서 확인된 단지가 8개뿐이라 **제목과 콘텐츠를 TOP8로 정직하게 조정**했다 — 추정 단지를 채워 넣는 대신 정확성을 우선.
- **투자 추천 오인 리스크**: 배액배상 사례·과열 신호는 "현상 설명"으로만 다루고 "사라"는 메시지로 읽히지 않도록 InfoNotice·FAQ 3번에서 반복 고지.
- **리포트 허브 누락 재발 방지**: 최근 세션에서 신규 리포트가 `reports/index.astro`의 로컬 매핑에 빠져 통째로 안 보인 사고가 있었음 — 이번 구현 시 데이터 파일 작성과 동시에 두 인덱스 페이지 매핑을 함께 추가하는 순서로 진행.
