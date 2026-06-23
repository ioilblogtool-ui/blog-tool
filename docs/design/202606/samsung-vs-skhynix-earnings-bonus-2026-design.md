# 삼성전자 vs SK하이닉스 2026~2028 실적·성과급 비교 — 설계 문서

## 1. 개요

- **슬러그**: `reports/samsung-vs-skhynix-earnings-bonus-2026`
- **유형**: 리포트 (실적-성과급 연동 계산형)
- **prefix**: `sevb-` (Samsung-Earnings-vs-Bonus)
- **데이터 파일**: `src/data/samsungVsSkhynixEarningsBonus2026.ts`
- **기획 문서**: `docs/plan/202606/samsung-vs-skhynix-earnings-bonus-2026-plan.md`
- **핵심 원칙**: 매출/영업이익 숫자는 **절대 새로 만들지 않고** `semiconductorStocksForecast2026_2028.ts`에서 그대로 import. 이 리포트의 유일한 신규 콘텐츠는 "그 실적이면 직급별 성과급이 얼마인가"라는 환산 레이어.

---

## 2. ⚠️ 사전 확인 필수 — 데이터 소스 충돌

설계 과정에서 기존 두 데이터 파일 사이에 **수치 불일치**를 발견했습니다. 구현 시작 전에 반드시 인지하고 아래 원칙대로 처리해야 합니다.

| 파일 | SK하이닉스 2026 영업이익 | SK하이닉스 2027 영업이익 |
|---|---|---|
| `semiconductorStocksForecast2026_2028.ts` (`semiconductorForecasts`) | 228조원 (시나리오 재구성, 2026-05-31) | 284조원 |
| `skHynixCompensation.ts` (`factAnchors`) | 약 77.1조원 (FnGuide 2026/12(E), 2026-05-20 확인) | 약 84.5조원 (FnGuide 2027/12(E)) |

두 값이 3배 가까이 차이 납니다. 원인을 단정할 수는 없지만(예: 사업부 vs 전사, 작성 시점 차이, 단순화 재구성 방식 차이), **이 리포트에서 두 수치를 같은 자리에 나란히 놓고 "영업이익"이라는 한 단어로 부르면 안 됩니다.** 처리 원칙은 다음과 같습니다.

1. **실적 비교 카드(매출/영업이익/영업이익률) 섹션**은 `semiconductorStocksForecast2026_2028.ts`만 출처로 사용한다. 출처 라벨에 "메모리 슈퍼사이클 보도·리서치 범위 재구성(2026-05-31)"을 그대로 노출한다.
2. **성과급 환산 섹션**은 `skHynixCompensation.ts`의 `psMultipliersByYear`(비율, %)만 사용하고, 이 비율의 산출 배경으로 `factAnchors`의 FnGuide 컨센서스(77.1조/84.5조)를 **별도 카드**로 분리해서 "성과급 비율 산정 시점의 참고 컨센서스"라고 명확히 라벨링한다.
3. 두 섹션 사이에는 안내 문구를 넣는다: "위 실적 전망과 아래 성과급 비율은 서로 다른 시점·기준의 컨센서스를 참고했습니다. 영업이익 절대값과 성과급 비율을 직접 곱해서 새로운 숫자를 만들지 마세요."
4. 페이지 내에서 **영업이익 절대값과 PS/OPI 비율을 곱해 "예상 성과급 총액(회사 전체)"을 계산하는 기능은 만들지 않는다.** 직급별 "기준급 × 비율 = 개인 성과급"만 계산한다(이건 두 비율 모두 이미 인사 발표/보도에서 검증된 비율이라 안전함).

이 원칙을 어기면 같은 회사의 같은 연도 영업이익이 페이지 안에서 서로 다른 숫자로 두 번 등장해 신뢰도 문제가 재발한다.

---

## 3. 화면 구성 (IA)

```text
[BaseLayout]
  SiteHeader
  main.report-page.op-page.sevb-page
    CalculatorHero          (eyebrow: "실적·성과급 연동 리포트")
    InfoNotice              (데이터 소스 분리 고지 - 위 2번 섹션 원칙 반영)

    section.op-section      (연도 탭 2026/2027/2028 + 회사 탭 삼성전자/SK하이닉스/동시비교)
    section.op-section      (실적 요약 카드: 매출/영업이익/영업이익률 - forecast 파일 인용)
    section.op-section      (직급 선택 + 성과급 환산 패널)
    section.op-section      (두 회사 동시 비교 표: 같은 직급이면 어디가 더 받나)
    section.op-section      (해석 카드: 매출은 삼성, 이익률은 하이닉스, 성과급 체감은?)
    section.op-section      (관련 링크)

    SeoContent
```

매매 페이지 패턴은 `seoul-housing-affordability-map-2026`(입력값에 따라 실시간 재계산)과 유사하게 **클라이언트 스크립트로 직급/연도/회사 선택 시 즉시 갱신**한다.

---

## 4. 데이터 파일 (`src/data/samsungVsSkhynixEarningsBonus2026.ts`)

기존 3개 파일을 import해서 재구성하고, 신규 로직(직급별 환산 계산)만 추가한다.

```ts
import {
  semiconductorForecasts,
  semiconductorCompanies,
  getCompanyForecasts,
  type SemiconductorForecast,
} from "./semiconductorStocksForecast2026_2028";
import {
  rankPresets as samsungRankPresets,
  divisions as samsungDivisions,
  scenarioPresets as samsungScenarioPresets,
  unionDemandScenarios as samsungUnionDemandScenarios,
  factAnchors as samsungFactAnchors,
  type RankCode as SamsungRankCode,
  type ScenarioCode as SamsungScenarioCode,
} from "./samsungCompensation";
import {
  rankPresets as hynixRankPresets,
  psMultipliersByYear,
  scenarioOptions as hynixScenarioOptions,
  factAnchors as hynixFactAnchors,
  actualPsMultiplier,
  type RankCode as HynixRankCode,
  type TargetYear,
  type ScenarioCode as HynixScenarioCode,
} from "./skHynixCompensation";

export type CompanySlugSEVB = "samsung-electronics" | "sk-hynix";
export type ComparisonYear = "2026" | "2027" | "2028";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SEVB_META = {
  slug: "samsung-vs-skhynix-earnings-bonus-2026",
  title: "삼성전자 vs SK하이닉스 2026~2028 실적·성과급 비교",
  seoTitle: "삼성전자 vs SK하이닉스 성과급 2026 | 실적 늘면 얼마 더 받을까",
  seoDescription:
    "삼성전자·SK하이닉스의 2026~2028년 영업이익 전망과 직급별 성과급 환산을 한 화면에서 비교합니다. 매출은 삼성, 영업이익률은 SK하이닉스가 앞서는데 성과급 체감은 어떻게 다를까요?",
  description:
    "삼성전자와 SK하이닉스의 2026~2028년 실적 전망(기존 반도체 실적 리포트 인용)과 직급별 성과급 환산을 연도·시나리오별로 비교하는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-23",
  dataNote:
    "매출·영업이익·영업이익률은 'semiconductor-stocks-forecast-2026-2028' 리포트와 동일한 출처(2026-05-31 기준 컨센서스·시나리오 재구성)를 그대로 인용합니다. 성과급 비율은 각 회사 성과급 계산기에 쓰인 보도 기준 비율이며, 실적 섹션과는 산출 시점·기준이 다른 별도 자료이므로 서로 곱해 새로운 숫자를 만들지 않습니다.",
};

// ── 실적 비교 (semiconductorStocksForecast2026_2028.ts 그대로 인용) ──────────
export function getEarningsCompareRows(): Array<{
  year: 2026 | 2027 | 2028;
  samsung: SemiconductorForecast;
  hynix: SemiconductorForecast;
}> {
  const samsung = getCompanyForecasts("samsung-electronics");
  const hynix = getCompanyForecasts("sk-hynix");
  return [2026, 2027, 2028].map((year) => ({
    year: year as 2026 | 2027 | 2028,
    samsung: samsung.find((f) => f.year === year)!,
    hynix: hynix.find((f) => f.year === year)!,
  }));
}

// ── 성과급 환산 (각 회사 compensation 파일의 비율을 그대로 사용) ────────────
export interface BonusEstimateResult {
  company: CompanySlugSEVB;
  rankLabel: string;
  baseSalary: number;
  ratePercent: number;
  rateLabel: string;
  estimatedBonus: number;
  scenarioLabel: string;
}

export function estimateHynixBonus(
  rankCode: HynixRankCode,
  year: TargetYear,
  scenario: HynixScenarioCode,
): BonusEstimateResult {
  const rank = hynixRankPresets.find((r) => r.code === rankCode)!;
  const yearData = psMultipliersByYear[year];
  const ratePercent = scenario === "CONSERVATIVE" ? yearData.conservative : scenario === "BASE" ? yearData.base : yearData.aggressive;
  return {
    company: "sk-hynix",
    rankLabel: rank.label,
    baseSalary: rank.defaultSalary,
    ratePercent,
    rateLabel: `PS ${ratePercent}%`,
    estimatedBonus: Math.round((rank.defaultSalary * ratePercent) / 100),
    scenarioLabel: scenario === "CONSERVATIVE" ? "보수적" : scenario === "BASE" ? "기준" : "공격적",
  };
}

export function estimateSamsungBonus(
  rankCode: SamsungRankCode,
  divisionCode: "DS" | "MX" | "CSS" | "DEVICE" | "SUPPORT",
  scenario: SamsungScenarioCode,
): BonusEstimateResult {
  const rank = samsungRankPresets.find((r) => r.code === rankCode)!;
  const division = samsungDivisions.find((d) => d.code === divisionCode)!;
  const ratePercent = (scenario === "CONSERVATIVE" ? division.scenarioRates.CONSERVATIVE
    : scenario === "BASE" ? division.scenarioRates.BASE
    : division.scenarioRates.AGGRESSIVE) * 100;
  return {
    company: "samsung-electronics",
    rankLabel: `${rank.label} · ${division.label}`,
    baseSalary: rank.defaultSalary,
    ratePercent,
    rateLabel: `OPI ${ratePercent.toFixed(1)}%`,
    estimatedBonus: Math.round((rank.defaultSalary * ratePercent) / 100),
    scenarioLabel: scenario === "CONSERVATIVE" ? "보수적" : scenario === "BASE" ? "기준" : "공격적",
  };
}

// ── 연도별 PS 비율 요약 (skHynixCompensation.ts 인용) ────────────────────────
export const SEVB_HYNIX_PS_BY_YEAR = psMultipliersByYear;

// ── 컨센서스 참고 카드 (출처 분리 고지용) ───────────────────────────────────
export const SEVB_CONSENSUS_REFERENCE_CARDS = [
  {
    company: "sk-hynix" as CompanySlugSEVB,
    label: "PS 비율 산정 시점 참고 컨센서스",
    value: hynixFactAnchors.find((a) => a.label === "2026 영업이익 컨센서스")?.value ?? "약 77.1조 원",
    note: "FnGuide 2026/12(E), 2026-05-20 확인 — 위 실적 비교 섹션의 228조원(2026-05-31 재구성)과는 별도 출처입니다.",
  },
  {
    company: "samsung-electronics" as CompanySlugSEVB,
    label: "OPI/TAI 시나리오 참고 영업이익",
    value: "297.5조원 (2026 컨센서스) / 317조원 (2027 슈퍼사이클)",
    note: "samsungCompensation.ts operatingProfitScenarios 인용 — 위 실적 비교 섹션의 145조원(2026E)과는 별도 출처입니다.",
  },
];

export const SEVB_FAQ: FaqItem[] = [
  {
    question: "삼성전자와 SK하이닉스 중 어느 쪽 성과급이 더 많나요?",
    answer:
      "직급과 시나리오에 따라 다릅니다. SK하이닉스는 PS 비율이 기준급의 24~70%(연도·시나리오별)로 책정되는 구조이고, 삼성전자는 사업부별 OPI 비율(DS 47% 등)에 특별성과급(TAI, 잠정합의안 기준 추가 10.5%)이 더해지는 구조입니다. 같은 기준급이라도 시나리오에 따라 우위가 바뀔 수 있어 이 페이지에서 직급·시나리오를 선택해 직접 비교해야 합니다.",
  },
  {
    question: "이 페이지의 영업이익 수치는 성과급 비율과 같은 자료에서 나온 건가요?",
    answer:
      "아닙니다. 실적 비교 섹션의 매출·영업이익은 'semiconductor-stocks-forecast-2026-2028' 리포트와 동일한 2026-05-31 기준 재구성 자료이고, 성과급 비율(PS/OPI)은 각 회사 성과급 계산기에 쓰인 보도 기준 비율로 산출 시점과 기준이 다릅니다. 두 수치를 곱해서 새로운 총액을 만들면 안 됩니다.",
  },
  {
    question: "2027년, 2028년 성과급도 확정된 건가요?",
    answer:
      "아닙니다. 2026년 지급분만 일부 확정·보도된 실제값(SK하이닉스 PS 2,964%, 삼성전자 잠정합의안 총 12%)이 있고, 2027·2028년은 모두 보수·기준·공격적 시나리오로 제공되는 추정값입니다.",
  },
  {
    question: "직급별 기준급은 어떻게 정해졌나요?",
    answer:
      "각 회사의 기존 성과급 계산기(`samsung-bonus`, `sk-hynix-bonus`)에서 쓰는 사원~부장 기준급 프리셋을 그대로 가져왔습니다. 실제 개인별 기준급은 입사 연차, 평가 등급에 따라 달라질 수 있어 참고용으로만 사용해야 합니다.",
  },
  {
    question: "이 리포트는 이직이나 투자를 추천하나요?",
    answer:
      "아닙니다. 공개된 실적 전망과 보도된 성과급 비율을 비교해서 보여주는 정보 제공용 리포트이며, 이직·투자 추천이 아닙니다. 실제 의사결정은 최신 공시와 본인 상황을 기준으로 별도 판단해야 합니다.",
  },
  {
    question: "삼성전자 TAI(특별성과급)는 매년 나오나요?",
    answer:
      "아닙니다. TAI는 사업 성과에 따라 지급 여부와 규모가 달라지는 별도 재원입니다. 이 페이지에 표시된 2026년 잠정합의안(총 12%, DS 특별경영성과급 10.5% 포함)은 2026년 노사 합의 기준이며, 향후 연도에 동일하게 반복된다고 가정할 수 없습니다.",
  },
];

export const SEVB_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 4대장 2026~2028 실적 전망 비교", description: "삼성전자·SK하이닉스·마이크론·TSMC 매출·영업이익 전망 원본 리포트" },
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기", description: "사업부·직급별 OPI·TAI 상세 계산" },
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기", description: "연도·시나리오별 PS 상세 계산" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교 계산기", description: "삼성전자·SK하이닉스·DB하이텍 동시 비교" },
];

export const SEVB_SEO_INTRO: string[] = [
  "삼성전자와 SK하이닉스는 같은 한국 반도체 양강이지만 돈 버는 구조가 다릅니다. 'semiconductor-stocks-forecast-2026-2028' 리포트 기준으로 2026년 삼성전자 매출은 585조원, SK하이닉스는 300조원으로 삼성전자가 규모는 더 크지만, 영업이익률은 SK하이닉스가 76.0%로 삼성전자(24.8%)를 크게 앞섭니다. 이 리포트는 이 실적 격차가 실제로 직원 성과급 체감으로 어떻게 이어지는지를 직급별로 환산해서 보여줍니다.",
  "성과급 환산은 각 회사의 기존 성과급 계산기에 쓰이는 보도 기준 비율을 그대로 사용합니다. SK하이닉스는 PS(생산성격려금) 비율로 2026년 보수적 24%부터 공격적 33%까지, 2027년에는 54~66%, 2028년에는 58~70%까지 시나리오별로 제시됩니다. 삼성전자는 사업부별 OPI 비율(예: DS부문 47%)에 2026년 잠정합의안 기준 특별성과급(TAI) 최대 10.5%가 더해지는 구조입니다.",
  "한 가지 꼭 짚어야 할 점이 있습니다. 이 페이지의 실적 비교 섹션(매출·영업이익)과 성과급 비율 산정에 참고된 컨센서스는 출처와 산출 시점이 다릅니다. 예를 들어 SK하이닉스의 2026년 영업이익은 실적 비교 섹션에서 228조원으로 표시되지만, PS 비율이 책정될 당시 참고된 FnGuide 컨센서스는 약 77.1조원으로 다른 자료입니다. 두 수치를 곱해 새로운 회사 전체 성과급 총액을 계산하는 것은 이 페이지의 목적이 아니며, 그렇게 계산하면 잘못된 숫자가 나옵니다.",
  "이 페이지가 실제로 답하는 질문은 '내 직급이면 얼마를 받을까'입니다. 직급(사원~부장)과 연도(2026~2028), 시나리오(보수적·기준·공격적)를 선택하면 두 회사의 예상 성과급을 같은 화면에서 비교할 수 있습니다. 2026년은 SK하이닉스 PS 2,964%, 삼성전자 잠정합의안 총 12%처럼 일부 실제 발표값이 있고, 2027·2028년은 모두 시나리오 추정값입니다.",
  "이 리포트는 이직이나 투자를 추천하지 않습니다. 두 회사의 성과급 구조와 실적 전망을 비교해서 보여주는 정보 제공용 콘텐츠이며, 실제 성과급은 회사 전체 실적, 사업부 성과, 개인 평가 등급, 노사 협의 결과에 따라 달라집니다. 정확한 개인별 계산은 '삼성전자 성과급 계산기', 'SK하이닉스 성과급 계산기'에서 더 상세한 입력값으로 확인할 수 있습니다.",
];

export const SEVB_SEO_CRITERIA: string[] = [
  "매출·영업이익·영업이익률은 'semiconductor-stocks-forecast-2026-2028' 리포트와 동일한 2026-05-31 기준 컨센서스·시나리오 재구성 자료입니다.",
  "성과급 비율(PS/OPI/TAI)은 각 회사 성과급 계산기에 쓰이는 보도 기준 비율로, 실적 비교 섹션과 출처·시점이 다릅니다.",
  "실적 수치와 성과급 비율을 곱해 회사 전체 성과급 총액을 추정하지 않습니다 — 이 페이지는 개인 직급 기준 환산만 제공합니다.",
  "2026년 일부 수치는 실제 발표·보도 기준이며, 2027·2028년은 모두 시나리오 기반 추정입니다.",
  "이 리포트는 투자·이직 추천이 아닙니다.",
];
```

---

## 5. Astro 페이지 (`src/pages/reports/samsung-vs-skhynix-earnings-bonus-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { semiconductorCompanies } from "../../data/semiconductorStocksForecast2026_2028";
import { rankPresets as hynixRankPresets, psMultipliersByYear } from "../../data/skHynixCompensation";
import { rankPresets as samsungRankPresets, divisions as samsungDivisions } from "../../data/samsungCompensation";
import {
  SEVB_META,
  SEVB_FAQ,
  SEVB_SEO_INTRO,
  SEVB_SEO_CRITERIA,
  SEVB_RELATED_LINKS,
  SEVB_CONSENSUS_REFERENCE_CARDS,
  getEarningsCompareRows,
  estimateHynixBonus,
  estimateSamsungBonus,
} from "../../data/samsungVsSkhynixEarningsBonus2026";
import { withBase } from "../../utils/base";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SEVB_META.slug}/`;
const earningsRows = getEarningsCompareRows();

const initialHynix = estimateHynixBonus("MANAGER", "2026", "BASE");
const initialSamsung = estimateSamsungBonus("MANAGER", "DS", "BASE");

const clientPayload = {
  hynixRankPresets,
  samsungRankPresets,
  samsungDivisions,
  psMultipliersByYear,
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SEVB_META.title,
    description: SEVB_META.seoDescription,
    dateModified: SEVB_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SEVB_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: SEVB_META.title, item: reportUrl },
    ],
  },
];
---

<BaseLayout title={SEVB_META.seoTitle} description={SEVB_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page sevb-page" data-report="samsung-vs-skhynix-earnings-bonus-2026">
    <CalculatorHero
      eyebrow="실적·성과급 연동 리포트"
      title={SEVB_META.title}
      description={SEVB_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내 (중요)"
      lines={[
        SEVB_META.dataNote,
        "실적 비교 섹션과 성과급 비율 섹션은 서로 다른 시점·출처의 자료이며, 둘을 곱해 새 숫자를 만들지 않습니다.",
        "이 페이지는 이직·투자 추천이 아니라 공개된 실적 전망과 보도된 성과급 비율을 비교하는 정보 제공용 리포트입니다.",
      ]}
    />

    <!-- 6.1 실적 비교 / 6.2 성과급 환산 패널 / 6.3 동시비교 / 6.4 해석 / 6.5 컨센서스 출처 분리 카드 / 6.6 관련링크 -->

    <SeoContent
      introTitle="삼성전자와 SK하이닉스, 실적과 성과급을 같이 보면"
      intro={SEVB_SEO_INTRO}
      criteria={SEVB_SEO_CRITERIA}
      faq={SEVB_FAQ}
      related={SEVB_RELATED_LINKS}
    />

    <script id="sevbPayload" type="application/json" set:html={JSON.stringify(clientPayload)}></script>
  </main>

  <script src={withBase("/scripts/samsung-vs-skhynix-earnings-bonus-2026.js")} defer></script>
</BaseLayout>
```

---

## 6. 주요 섹션 마크업 설계

### 6.1 실적 비교 (forecast 파일 인용, 가공 없음)

```astro
<section class="op-section">
  <h2>2026~2028 실적 전망 비교</h2>
  <p class="op-message">매출·영업이익 수치는 '반도체 4대장 실적 전망' 리포트와 동일한 자료를 그대로 인용합니다.</p>
  <div class="op-table-wrap sevb-earnings-table">
    <table>
      <thead><tr><th>연도</th><th>삼성전자 매출</th><th>삼성전자 영업이익(이익률)</th><th>SK하이닉스 매출</th><th>SK하이닉스 영업이익(이익률)</th></tr></thead>
      <tbody>
        {earningsRows.map((row) => (
          <tr>
            <td>{row.year}E</td>
            <td>{row.samsung.revenue}조원</td>
            <td>{row.samsung.operatingProfit}조원 ({row.samsung.operatingMargin}%)</td>
            <td>{row.hynix.revenue}조원</td>
            <td>{row.hynix.operatingProfit}조원 ({row.hynix.operatingMargin}%)</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <p class="op-message">
    출처: <a href={withBase("/reports/semiconductor-stocks-forecast-2026-2028/")}>반도체 4대장 2026~2028 실적 전망 비교</a> (2026-05-31 기준 컨센서스·시나리오 재구성)
  </p>
</section>
```

### 6.2 성과급 환산 패널 (핵심 인터랙션)

```astro
<section class="op-section sevb-bonus-panel">
  <h2>내 직급이면 성과급 얼마?</h2>
  <p class="op-message">연도·시나리오를 바꾸면 두 회사 예상 성과급이 동시에 갱신됩니다.</p>

  <div class="sevb-input-row">
    <label>
      <span>SK하이닉스 직급</span>
      <select id="sevbHynixRank">
        {hynixRankPresets.map((r) => <option value={r.code}>{r.label}</option>)}
      </select>
    </label>
    <label>
      <span>삼성전자 직급 · 사업부</span>
      <select id="sevbSamsungRank">
        {samsungRankPresets.map((r) => <option value={r.code}>{r.label}</option>)}
      </select>
      <select id="sevbSamsungDivision">
        {samsungDivisions.map((d) => <option value={d.code}>{d.label}</option>)}
      </select>
    </label>
    <label>
      <span>연도</span>
      <select id="sevbYear">
        <option value="2026">2026</option>
        <option value="2027">2027</option>
        <option value="2028">2028</option>
      </select>
    </label>
    <label>
      <span>시나리오</span>
      <select id="sevbScenario">
        <option value="CONSERVATIVE">보수적</option>
        <option value="BASE" selected>기준</option>
        <option value="AGGRESSIVE">공격적</option>
      </select>
    </label>
  </div>

  <div class="sevb-result-grid">
    <article class="sevb-result-card sevb-result-card--hynix">
      <span>SK하이닉스</span>
      <strong id="sevbHynixResult">{initialHynix.estimatedBonus.toLocaleString("ko-KR")}원</strong>
      <small id="sevbHynixRate">{initialHynix.rateLabel} · {initialHynix.scenarioLabel}</small>
    </article>
    <article class="sevb-result-card sevb-result-card--samsung">
      <span>삼성전자</span>
      <strong id="sevbSamsungResult">{initialSamsung.estimatedBonus.toLocaleString("ko-KR")}원</strong>
      <small id="sevbSamsungRate">{initialSamsung.rateLabel} · {initialSamsung.scenarioLabel}</small>
    </article>
  </div>
</section>
```

### 6.3 컨센서스 출처 분리 카드 (충돌 방지용 필수 섹션)

```astro
<section class="op-section sevb-consensus-notice">
  <h2>잠깐, 이 두 수치는 다른 자료입니다</h2>
  <div class="sevb-consensus-grid">
    {SEVB_CONSENSUS_REFERENCE_CARDS.map((card) => (
      <article>
        <strong>{card.label}</strong>
        <p>{card.value}</p>
        <small>{card.note}</small>
      </article>
    ))}
  </div>
</section>
```

### 6.4 해석 카드

```astro
<section class="op-section">
  <h2>매출은 삼성, 이익률은 하이닉스</h2>
  <div class="sevb-insight-grid">
    <article><h3>규모</h3><p>삼성전자는 메모리·파운드리·모바일·가전이 섞인 종합 기업이라 매출 규모가 훨씬 큽니다.</p></article>
    <article><h3>이익률</h3><p>SK하이닉스는 메모리·HBM에 집중해 영업이익률이 70%대로 삼성전자(20%대)보다 높게 나타납니다.</p></article>
    <article><h3>성과급 체감</h3><p>이익률이 높은 SK하이닉스가 PS 비율도 높게 형성되는 경향이 있어, 같은 기준급이라면 시나리오에 따라 체감 차이가 커질 수 있습니다.</p></article>
  </div>
</section>
```

---

## 7. 클라이언트 스크립트 (`public/scripts/samsung-vs-skhynix-earnings-bonus-2026.js`)

```js
(function () {
  const payloadScript = document.getElementById("sevbPayload");
  if (!payloadScript) return;
  const payload = JSON.parse(payloadScript.textContent || "{}");
  const { hynixRankPresets, samsungRankPresets, samsungDivisions, psMultipliersByYear } = payload;

  const hynixRankSelect = document.getElementById("sevbHynixRank");
  const samsungRankSelect = document.getElementById("sevbSamsungRank");
  const samsungDivisionSelect = document.getElementById("sevbSamsungDivision");
  const yearSelect = document.getElementById("sevbYear");
  const scenarioSelect = document.getElementById("sevbScenario");

  const scenarioKeyMap = { CONSERVATIVE: "conservative", BASE: "base", AGGRESSIVE: "aggressive" };

  function calcHynix() {
    const rank = hynixRankPresets.find((r) => r.code === hynixRankSelect.value);
    const yearData = psMultipliersByYear[yearSelect.value];
    const rate = yearData[scenarioKeyMap[scenarioSelect.value]];
    const bonus = Math.round((rank.defaultSalary * rate) / 100);
    document.getElementById("sevbHynixResult").textContent = bonus.toLocaleString("ko-KR") + "원";
    document.getElementById("sevbHynixRate").textContent = "PS " + rate + "% · " + scenarioLabel(scenarioSelect.value);
  }

  function calcSamsung() {
    const rank = samsungRankPresets.find((r) => r.code === samsungRankSelect.value);
    const division = samsungDivisions.find((d) => d.code === samsungDivisionSelect.value);
    const scenarioKey = scenarioSelect.value;
    const rateFraction = scenarioKey === "CONSERVATIVE" ? division.scenarioRates.CONSERVATIVE
      : scenarioKey === "BASE" ? division.scenarioRates.BASE
      : division.scenarioRates.AGGRESSIVE;
    const ratePercent = rateFraction * 100;
    const bonus = Math.round((rank.defaultSalary * ratePercent) / 100);
    document.getElementById("sevbSamsungResult").textContent = bonus.toLocaleString("ko-KR") + "원";
    document.getElementById("sevbSamsungRate").textContent = "OPI " + ratePercent.toFixed(1) + "% · " + scenarioLabel(scenarioKey);
  }

  function scenarioLabel(code) {
    return code === "CONSERVATIVE" ? "보수적" : code === "BASE" ? "기준" : "공격적";
  }

  function recalcAll() {
    calcHynix();
    calcSamsung();
  }

  [hynixRankSelect, samsungRankSelect, samsungDivisionSelect, yearSelect, scenarioSelect].forEach((el) => {
    el.addEventListener("change", recalcAll);
  });

  recalcAll();
})();
```

> SK하이닉스 PS 비율은 연도와 무관하게 시나리오 기준값만 바뀌는 구조(`psMultipliersByYear[year]`)이므로 연도 변경 시 `calcHynix`가 자동 반영한다. 삼성전자는 현재 데이터 구조상 사업부 시나리오 비율이 연도 구분 없이 고정값이라(`divisions[].scenarioRates`), 연도 선택은 삼성전자 결과에는 영향을 주지 않는다 — 이 점을 UI에 작은 안내 텍스트로 표시한다("삼성전자 사업부 비율은 연도 구분 없이 동일 시나리오 기준입니다").

---

## 8. SCSS 설계 포인트 (`_samsung-vs-skhynix-earnings-bonus-2026.scss`)

`op-page` 공용 클래스(`op-section`, `op-table-wrap`, `op-message`)를 베이스로 사용하고, 신규 클래스만 추가:

```scss
.sevb-page {
  --sevb-ink: #172033;
  --sevb-muted: #667085;
  --sevb-line: #d8e0ea;
  --sevb-samsung: #1428a0;
  --sevb-hynix: #e4002b;

  .sevb-input-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    margin-bottom: 16px;
  }

  .sevb-result-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sevb-result-card {
    padding: 18px;
    border-radius: 8px;
    border: 1px solid var(--sevb-line);
    background: #fff;

    strong { display: block; font-size: clamp(20px, 3.5vw, 28px); }
    &--samsung strong { color: var(--sevb-samsung); }
    &--hynix strong { color: var(--sevb-hynix); }
  }

  .sevb-consensus-grid,
  .sevb-insight-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .sevb-consensus-grid article,
  .sevb-insight-grid article {
    padding: 16px;
    border: 1px solid var(--sevb-line);
    border-radius: 8px;
    background: var(--sevb-line, #f5f8fb);
    background: #fff8e8; /* 출처 분리 카드는 주의색 배경으로 강조 */
  }

  @media (max-width: 640px) {
    .sevb-result-grid { grid-template-columns: 1fr; }
  }
}
```

---

## 9. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `samsung-vs-skhynix-earnings-bonus-2026` 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/samsung-vs-skhynix-earnings-bonus-2026';` 추가 |
| `public/sitemap.xml` | `/reports/samsung-vs-skhynix-earnings-bonus-2026/` 추가 |
| `src/data/semiconductorStocksForecast2026_2028.ts` | `relatedLinks`에 본 리포트 추가 검토 |
| `src/data/samsungCompensation.ts`, `skHynixCompensation.ts` | `SAMSUNG_RELATED_CALCULATORS` 등에 본 리포트 추가 검토 |

---

## 10. QA 포인트

- [ ] 실적 비교 표의 수치가 `semiconductorStocksForecast2026_2028.ts` 원본과 1:1 일치 (별도 계산 없이 그대로 표시)
- [ ] "두 수치는 다른 자료" 안내 섹션이 실적 표와 성과급 패널 사이에 반드시 노출됨
- [ ] 직급/연도/시나리오 변경 시 두 회사 결과가 모두 즉시 갱신됨
- [ ] 영업이익 절대값 × 성과급 비율을 곱하는 코드가 어디에도 없음 (코드 리뷰 시 중점 확인)
- [ ] "삼성전자 사업부 비율은 연도 구분 없음" 안내 문구 노출
- [ ] intro 5단락 이상 800자 이상, faq 6개
- [ ] 이직·투자 추천처럼 읽히는 문장 없는지 전체 검토
- [ ] `npm run build` 성공

---

## 11. 구현 리스크

- **데이터 충돌 재발 리스크(최우선)**: 향후 두 원본 파일 중 하나가 갱신되면 이 리포트의 출처 분리 카드 수치도 함께 갱신해야 함. import 구조를 유지하면 실적 비교 섹션은 자동 동기화되지만, `SEVB_CONSENSUS_REFERENCE_CARDS`의 하드코딩된 비교 문구는 수동 갱신이 필요 — 코드 주석으로 명시.
- **삼성전자 연도 미반영 한계**: 현재 `samsungCompensation.ts` 구조상 사업부 시나리오 비율에 연도 차원이 없어, 연도 탭이 삼성전자 쪽엔 시각적으로만 존재하고 실제 값을 바꾸지 못함 — UI에서 혼란을 주지 않도록 안내 문구 필수.
- **투자/이직 추천 오인 리스크**: "어디가 더 받는다"는 비교가 회사 우열 평가처럼 보일 수 있어 FAQ·InfoNotice·해석 카드 3곳에서 반복 고지.
