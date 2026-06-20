# 한성숙 국무총리 후보자 커리어·재산 리포트 2026 — 설계 문서

## 1. 개요

- **슬러그**: `reports/han-seong-sook-pm-nominee-career-assets-2026`
- **유형**: 리포트 (커리어-자산 타임라인형)
- **prefix**: `hssr-` (Han Seong-sook Report)
- **데이터 파일**: `src/data/hanSeongSookPmNomineeCareerAssets2026.ts`
- **기획 문서**: `docs/plan/202606/han-seong-sook-pm-nominee-career-assets-2026-plan.md`
- **핵심 목표**:
  - `한성숙`, `한성숙 재산`, `한성숙 경력`, `한성숙 총리`, `한성숙 총리 후보자`, `한성숙 인사청문회` 검색 의도 동시 대응
  - 기존 `lee-jaemyung-government-officials-assets-salary-2026` 리포트와 데이터 일관성 유지 + 상호 내부링크
  - "정치 인물 비교"가 아니라 "커리어 단계별 자산 변화"라는 차별화된 스토리라인으로 체류시간·재방문 확보
  - 비공개 추정치는 전부 `추정` 라벨 처리, 공식 재산 공개 수치와 명확히 분리

---

## 2. 화면 구성 (IA)

```text
[BaseLayout]
  SiteHeader
  main.report-page.hssr-page
    CalculatorHero            (eyebrow: "인물 커리어·재산 리포트")
    InfoNotice                (fact/estimate 구분 고지)

    section.hssr-profile      (프로필 요약 카드 4종)
    section.hssr-timeline     (커리어 타임라인 - 핵심 섹션)
    section.hssr-assets       (재산 상세 카드 + bar 분포)
    section.hssr-compensation (장관 연봉 -> 총리 연봉 비교)
    section.hssr-context      (민간 출신 vs 관료 출신 해석)
    section.hssr-procedure    (인사청문회 절차 안내)
    section.hssr-related      (관련 리포트 링크)

    SeoContent (Fragment slot="seo")
```

페이지는 `TimelineToolShell`(계산기용 쉘)을 그대로 import하지 않고, REPORT_CONTENT_GUIDE.md 권장대로 **페이지 inline 구현**으로 시작한다. 타임라인 비주얼은 `hssr-timeline` 섹션 내부에서 세로 스텝 리스트 + 좌측 세로선 CSS로 직접 구현한다 (차트 라이브러리 불필요).

---

## 3. 데이터 파일 (`src/data/hanSeongSookPmNomineeCareerAssets2026.ts`)

```ts
export type EvidenceBadge = "공개재산" | "보도 기준" | "추정" | "공식 프로필";

export interface CareerTimelineStep {
  id: string;
  year: string;
  periodLabel: string;
  roleTitle: string;
  org: string;
  description: string;
  compEstimateLabel?: string;
  badge: EvidenceBadge;
}

export interface AssetBreakdownItem {
  id: string;
  label: string;
  amountManwon: number;
  shareOfTotalPercent: number;
  description: string;
}

export interface CompensationCompareItem {
  id: string;
  roleLabel: string;
  annualCompManwon: number;
  monthlyCompManwon: number;
  badge: EvidenceBadge;
  note: string;
}

export interface RelatedOfficialCompare {
  id: string;
  nameKo: string;
  roleTitle: string;
  background: "민간 출신" | "관료 출신";
  totalAssetsManwon: number;
  href: string;
  note: string;
}

export interface ProcedureStep {
  id: string;
  order: number;
  title: string;
  description: string;
  statusLabel: "진행 전" | "진행 중" | "완료" | "예정";
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const HSSR_META = {
  slug: "han-seong-sook-pm-nominee-career-assets-2026",
  title: "한성숙 재산·경력 2026｜네이버 대표에서 총리 후보까지",
  seoTitle: "한성숙 재산·경력 2026 완전 정리 | 총리 후보자 커리어 타임라인",
  seoDescription:
    "한성숙 국무총리 후보자의 네이버 대표이사~중기부 장관 커리어 타임라인과 공개 재산 223억원 상세를 정리합니다. 총리 연봉 비교, 인사청문회 절차까지 한 번에 확인하세요.",
  description:
    "네이버 대표이사에서 중소벤처기업부 장관, 국무총리 후보자까지 한성숙의 커리어 전환점과 공개 재산을 한 화면에서 확인하는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-20",
  dataNote:
    "재산 수치는 2026년 3월 26일 고위공직자 정기 재산변동 공개 보도(조선비즈) 기준이며, 네이버 재직 시절 보수·스톡옵션은 비공개 데이터를 바탕으로 한 추정값입니다. 국무총리 공식 인준 전까지는 '후보자' 기준으로 표기합니다.",
};

export const HSSR_CAREER_TIMELINE: CareerTimelineStep[] = [
  {
    id: "naver-early",
    year: "2007",
    periodLabel: "2007년 ~ 2017년",
    roleTitle: "검색·서비스 총괄 임원",
    org: "네이버(NHN)",
    description:
      "검색 서비스와 콘텐츠 플랫폼을 총괄하며 네이버의 모바일 전환기 핵심 의사결정에 참여한 시기입니다. 임원 보수는 공식 공개 대상이 아니어서 등기이사 선임 이후 공시 자료를 기준으로 추정해야 합니다.",
    compEstimateLabel: "비공개 (등기 임원 전 단계)",
    badge: "공식 프로필",
  },
  {
    id: "naver-ceo",
    year: "2017",
    periodLabel: "2017년 3월 ~ 2022년 3월",
    roleTitle: "대표이사",
    org: "네이버",
    description:
      "네이버 단독 대표이사로 취임해 5년간 회사를 이끌며 라인 분사, 커머스·콘텐츠 확장, 글로벌 사업 재편을 주도했습니다. 대표이사 재임 기간 보수는 사업보고서 등기임원 보수 총액 공시를 기준으로 추정한 값입니다.",
    compEstimateLabel: "추정 연 보수 수억원대 (사업보고서 등기임원 보수 공시 기준 추정)",
    badge: "추정",
  },
  {
    id: "naver-post-ceo",
    year: "2022",
    periodLabel: "2022년 ~ 2025년",
    roleTitle: "고문 / 산업 자문",
    org: "민간 부문",
    description:
      "대표이사 퇴임 이후 산업계 자문과 스타트업 생태계 관련 활동을 이어간 시기로, 공직 진출 전 마지막 민간 경력 구간입니다.",
    badge: "공식 프로필",
  },
  {
    id: "minister",
    year: "2025",
    periodLabel: "2025년 ~ 2026년",
    roleTitle: "중소벤처기업부 장관",
    org: "이재명 정부",
    description:
      "이재명 정부 초대 중소벤처기업부 장관으로 임명되며 공직에 첫발을 디뎠습니다. 이 시기부터 고위공직자 정기 재산변동 공개 대상이 되어, 총재산 약 223억원(2,230,160만원) 규모가 처음 공식적으로 확인됩니다.",
    compEstimateLabel: "정무직 장관 연봉 약 1억5,493만원 (세전, 정무직 보수표 기준)",
    badge: "공개재산",
  },
  {
    id: "pm-nominee",
    year: "2026",
    periodLabel: "2026년 6월 ~",
    roleTitle: "국무총리 후보자",
    org: "이재명 정부",
    description:
      "거대 플랫폼 기업과 정부 부처를 이끌며 쌓아온 혁신 리더십을 바탕으로, 중소기업·소상공인까지 체감할 수 있는 경제 성장을 이끌 적임자로 평가받아 국무총리 후보자로 지명됐습니다. 국회 인사청문회와 본회의 인준을 거쳐야 정식 취임합니다.",
    compEstimateLabel: "국무총리 연봉 약 2억1,069만원 (세전, 취임 시 적용 예정)",
    badge: "공식 프로필",
  },
];

export const HSSR_ASSET_BREAKDOWN: AssetBreakdownItem[] = [
  { id: "building", label: "건물", amountManwon: 97412, shareOfTotalPercent: 4.4, description: "정기 재산변동 공개 기준 건물 자산" },
  { id: "land", label: "토지", amountManwon: 67418, shareOfTotalPercent: 3.0, description: "정기 재산변동 공개 기준 토지 자산" },
  { id: "deposits", label: "예금", amountManwon: 65019, shareOfTotalPercent: 2.9, description: "예금 등 현금성 금융자산" },
  { id: "securities", label: "증권", amountManwon: 51362, shareOfTotalPercent: 2.3, description: "주식 등 증권 자산" },
  { id: "other", label: "기타(채권·금·가상자산 등)", amountManwon: 38745, shareOfTotalPercent: 1.7, description: "채권 2억4,500만원, 금 1,500만원, 가상자산 2,029만원 등 메모성 참고값 합산" },
  { id: "debt", label: "채무", amountManwon: 3500, shareOfTotalPercent: 0.2, description: "공개된 채무 항목 (총재산에서 별도 표시)" },
];

export const HSSR_TOTAL_ASSETS_MANWON = 2_230_160;

export const HSSR_COMPENSATION_COMPARE: CompensationCompareItem[] = [
  {
    id: "minister",
    roleLabel: "중소벤처기업부 장관 (현직 기준)",
    annualCompManwon: 15493,
    monthlyCompManwon: 1291,
    badge: "공개재산",
    note: "2026년 정무직 공무원 보수표 기준 장관 연봉",
  },
  {
    id: "pm",
    roleLabel: "국무총리 (취임 시 적용)",
    annualCompManwon: 21069,
    monthlyCompManwon: 1756,
    badge: "공식 프로필",
    note: "인준 통과 후 취임 시 적용되는 국무총리 연봉 기준값",
  },
];

export const HSSR_RELATED_OFFICIALS_COMPARE: RelatedOfficialCompare[] = [
  {
    id: "han-sungsook",
    nameKo: "한성숙",
    roleTitle: "국무총리 후보자 (전 중기부 장관)",
    background: "민간 출신",
    totalAssetsManwon: 2_230_160,
    href: "/reports/han-seong-sook-pm-nominee-career-assets-2026/",
    note: "네이버 대표이사 출신, 1차 공개 대상 중 자산 절대액 상위권",
  },
  {
    id: "kim-minseok",
    nameKo: "김민석",
    roleTitle: "국무총리",
    background: "관료 출신",
    totalAssetsManwon: 33090,
    href: "/reports/lee-jaemyung-government-officials-assets-salary-2026/",
    note: "전세권·채무가 동시에 큰 레버리지형 구조, 총재산 자체는 낮은 편",
  },
  {
    id: "choi-hwiyoung",
    nameKo: "최휘영",
    roleTitle: "문화체육관광부 장관",
    background: "민간 출신",
    totalAssetsManwon: 1_774_970,
    href: "/reports/lee-jaemyung-government-officials-assets-salary-2026/",
    note: "예금 비중이 매우 큰 고자산군, 민간 경력 출신 공통 패턴 비교 대상",
  },
];

export const HSSR_PROCEDURE_STEPS: ProcedureStep[] = [
  { id: "nomination", order: 1, title: "국무총리 후보자 지명", description: "대통령이 한성숙 후보자를 국무총리로 지명하고 국회에 인사청문 요청서를 제출합니다.", statusLabel: "완료" },
  { id: "hearing-request", order: 2, title: "인사청문 요청서 국회 제출", description: "후보자의 재산, 경력, 병역, 세금, 전과 관련 자료를 국회에 제출합니다.", statusLabel: "완료" },
  { id: "hearing", order: 3, title: "국회 인사청문회", description: "인사청문특별위원회가 후보자의 자질과 정책 방향을 검증하는 청문회를 진행합니다.", statusLabel: "예정" },
  { id: "report-adoption", order: 4, title: "인사청문 경과보고서 채택", description: "청문회 이후 위원회가 경과보고서를 채택해 본회의에 넘깁니다.", statusLabel: "예정" },
  { id: "plenary-vote", order: 5, title: "국회 본회의 인준 표결", description: "국회 본회의에서 임명동의안이 표결로 처리되며 통과 시 정식 취임이 가능합니다.", statusLabel: "예정" },
  { id: "inauguration", order: 6, title: "국무총리 정식 취임", description: "본회의 인준 통과 후 대통령이 임명장을 수여하면 국무총리로 정식 취임합니다.", statusLabel: "예정" },
];

export const HSSR_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/lee-jaemyung-government-officials-assets-salary-2026/",
    label: "2026 이재명 정부 핵심 공직자 재산·보수 비교 리포트",
    description: "한성숙을 포함한 15명 공직자의 재산·보수를 한 화면에서 비교",
  },
  {
    href: "/reports/local-election-governor-2026/",
    label: "2026 지방선거 광역단체장 재산 비교",
    description: "정치인 재산 공개 시리즈와 함께 보기",
  },
  {
    href: "/reports/local-election-winners-assets-2026/",
    label: "2026 지방선거 당선자 재산 순위",
    description: "공직자 재산 비교 콘텐츠 클러스터 내부링크",
  },
];

export const HSSR_FAQ: FaqItem[] = [
  {
    question: "한성숙 재산은 얼마인가요?",
    answer:
      "2026년 3월 26일 고위공직자 정기 재산변동 공개 기준 총재산은 약 223억원(2,230,160만원)입니다. 건물 약 9.7억원, 토지 약 6.7억원, 예금 약 6.5억원, 증권 약 5.1억원 등으로 구성되어 있으며, 채권·금·가상자산 등 메모성 항목도 일부 포함됩니다.",
  },
  {
    question: "한성숙은 어떤 경력을 거쳐 총리 후보자가 됐나요?",
    answer:
      "네이버에서 검색·서비스 총괄 임원을 거쳐 2017년부터 2022년까지 네이버 대표이사를 지냈습니다. 퇴임 후 산업계 자문 활동을 이어가다 이재명 정부 초대 중소벤처기업부 장관으로 공직에 입문했고, 2026년 6월 국무총리 후보자로 지명됐습니다.",
  },
  {
    question: "한성숙은 정식으로 국무총리가 된 건가요?",
    answer:
      "아직 아닙니다. 현재는 '국무총리 후보자' 단계로, 국회 인사청문회와 본회의 임명동의안 표결을 통과해야 정식 취임이 가능합니다. 이 페이지는 인준 전까지 '후보자' 기준으로 표기를 유지합니다.",
  },
  {
    question: "네이버 대표이사 시절 연봉도 알 수 있나요?",
    answer:
      "네이버 대표이사 시절 개인 보수는 공식 확정값이 아니라, 사업보고서에 공시된 등기임원 보수 총액을 바탕으로 한 추정치로만 제공합니다. 공직자 재산 공개와 달리 민간 기업 임원 개인별 보수는 비공개인 경우가 많아 단정값으로 쓰지 않습니다.",
  },
  {
    question: "장관 연봉과 총리 연봉은 얼마나 차이 나나요?",
    answer:
      "2026년 정무직 보수표 기준 장관 연봉은 약 1억5,493만원, 국무총리 연봉은 약 2억1,069만원으로 약 5,576만원 차이가 납니다. 총리 연봉은 인준 통과 후 정식 취임 시점부터 적용됩니다.",
  },
  {
    question: "한성숙과 다른 공직자의 재산을 비교할 수 있나요?",
    answer:
      "네, 같은 정기 재산변동 공개 기준으로 작성된 '2026 이재명 정부 핵심 공직자 재산·보수 비교 리포트'에서 김민석 국무총리, 최휘영 문화체육관광부 장관 등 다른 15명과 함께 비교할 수 있습니다. 이 페이지 하단 관련 리포트 링크에서 바로 이동 가능합니다.",
  },
  {
    question: "이 페이지는 정치적 평가를 담고 있나요?",
    answer:
      "아닙니다. 비교계산소의 다른 공직자 리포트와 동일하게, 정치적 해석이 아니라 공개된 경력·재산 수치를 커리어 타임라인 형태로 정리해 읽는 데 초점을 맞춘 인터랙티브 리포트입니다.",
  },
];
```

---

## 4. 계산/가공 유틸 설계

데이터 파일 또는 frontmatter에 순수 함수로 정의한다. (기존 `formatManwon`, `formatRatio`, `formatPercent`와 동일한 포맷 컨벤션을 재사용해 일관성 유지)

```ts
export function formatManwon(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "미공개";
  if (value >= 10000) {
    const eok = value / 10000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }
  return `${Number(value).toLocaleString("ko-KR")}만원`;
}

export function getAssetSharePercent(item: AssetBreakdownItem, totalManwon: number) {
  return Math.round((item.amountManwon / totalManwon) * 1000) / 10;
}

export function getCompGapManwon(items: CompensationCompareItem[]) {
  if (items.length < 2) return 0;
  return items[items.length - 1].annualCompManwon - items[0].annualCompManwon;
}
```

`HSSR_ASSET_BREAKDOWN`의 `shareOfTotalPercent`는 데이터 파일에 미리 계산된 값을 넣어두되, 페이지에서는 `getAssetSharePercent`로 합계 검증(`npm run build` 전에 합계가 100%에 근접하는지 수동 확인)한다.

---

## 5. Astro 페이지 (`src/pages/reports/han-seong-sook-pm-nominee-career-assets-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  HSSR_META,
  HSSR_CAREER_TIMELINE,
  HSSR_ASSET_BREAKDOWN,
  HSSR_TOTAL_ASSETS_MANWON,
  HSSR_COMPENSATION_COMPARE,
  HSSR_RELATED_OFFICIALS_COMPARE,
  HSSR_PROCEDURE_STEPS,
  HSSR_RELATED_LINKS,
  HSSR_FAQ,
  formatManwon,
  getCompGapManwon,
} from "../../data/hanSeongSookPmNomineeCareerAssets2026";
import { withBase } from "../../utils/base";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${HSSR_META.slug}/`;
const compGap = getCompGapManwon(HSSR_COMPENSATION_COMPARE);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: HSSR_META.title,
    description: HSSR_META.seoDescription,
    dateModified: HSSR_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HSSR_FAQ.map((item) => ({
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
      { "@type": "ListItem", position: 3, name: HSSR_META.title, item: reportUrl },
    ],
  },
];
---

<BaseLayout title={HSSR_META.seoTitle} description={HSSR_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page hssr-page" data-report="han-seong-sook-pm-nominee-career-assets-2026">
    <CalculatorHero
      eyebrow="인물 커리어·재산 리포트"
      title={HSSR_META.title}
      description={HSSR_META.description}
    />

    <InfoNotice
      title="데이터 기준 안내"
      lines={[
        HSSR_META.dataNote,
        "총재산은 2026년 3월 26일 정기 재산변동 공개 보도 기준이며, 국무총리 취임 전까지는 '후보자' 표기를 유지합니다.",
        "이 페이지는 정치적 평가가 아니라 공개 경력·재산 수치를 커리어 타임라인으로 정리한 인터랙티브 리포트입니다.",
      ]}
    />

    <!-- 6.1 프로필 요약 / 6.2 타임라인 / 6.3 재산 상세 / 6.4 보수 비교 / 6.5 비교 / 6.6 절차 / 6.7 관련 링크 -->

    <Fragment slot="seo">
      <SeoContent
        introTitle="한성숙 국무총리 후보자, 숫자로 보는 커리어와 재산"
        intro={seoIntro}
        criteriaTitle="이 리포트가 다루는 기준"
        criteria={seoCriteria}
        faqTitle="자주 묻는 질문"
        faq={HSSR_FAQ}
      />
    </Fragment>
  </main>
</BaseLayout>
```

> `GOOGLE_SEO_RULES.md` 4번 규칙에 따라 `SeoContent`는 **반드시 `<Fragment slot="seo">` 안에** 배치한다. `seoIntro`, `seoCriteria`는 8번 섹션에서 정의한다.

---

## 6. 주요 섹션 마크업 설계

### 6.1 프로필 요약 카드

```astro
<section class="content-section hssr-profile" aria-labelledby="hssr-profile-title">
  <div class="hssr-section-heading">
    <p>프로필 요약</p>
    <h2 id="hssr-profile-title">한성숙은 누구인가</h2>
  </div>

  <div class="hssr-profile-grid">
    <article class="hssr-profile-card">
      <span>현재 직위</span>
      <strong>국무총리 후보자</strong>
      <small>전 중소벤처기업부 장관</small>
    </article>
    <article class="hssr-profile-card">
      <span>주요 경력</span>
      <strong>네이버 대표이사</strong>
      <small>2017년 ~ 2022년</small>
    </article>
    <article class="hssr-profile-card">
      <span>지명 배경</span>
      <strong>플랫폼·정부 혁신 리더십</strong>
      <small>소상공인·중기 경제 성장 적임자 평가</small>
    </article>
    <article class="hssr-profile-card">
      <span>다음 절차</span>
      <strong>국회 인사청문회</strong>
      <small>본회의 인준 필요</small>
    </article>
  </div>
</section>
```

### 6.2 커리어 타임라인 (핵심 섹션)

```astro
<section class="content-section hssr-timeline" aria-labelledby="hssr-timeline-title">
  <div class="hssr-section-heading">
    <p>커리어 타임라인</p>
    <h2 id="hssr-timeline-title">네이버 대표에서 총리 후보까지</h2>
    <span>각 단계의 보수·자산 수치는 공개 자료 기준과 추정값을 뱃지로 구분해 표시합니다.</span>
  </div>

  <ol class="hssr-timeline-list">
    {HSSR_CAREER_TIMELINE.map((step) => (
      <li class="hssr-timeline-item">
        <div class="hssr-timeline-marker"><span>{step.year}</span></div>
        <div class="hssr-timeline-body">
          <span class={`hssr-badge hssr-badge--${step.badge.replace(/\s/g, "-")}`}>{step.badge}</span>
          <h3>{step.roleTitle} · {step.org}</h3>
          <p class="hssr-timeline-period">{step.periodLabel}</p>
          <p>{step.description}</p>
          {step.compEstimateLabel && <p class="hssr-timeline-comp">{step.compEstimateLabel}</p>}
        </div>
      </li>
    ))}
  </ol>
</section>
```

### 6.3 재산 상세 카드 + bar 분포

```astro
<section class="content-section hssr-assets" aria-labelledby="hssr-assets-title">
  <div class="hssr-section-heading">
    <p>공개 재산 상세</p>
    <h2 id="hssr-assets-title">총재산 {formatManwon(HSSR_TOTAL_ASSETS_MANWON)}의 구성</h2>
    <span>2026년 3월 26일 고위공직자 정기 재산변동 공개 보도 기준입니다.</span>
  </div>

  <div class="hssr-asset-bars">
    {HSSR_ASSET_BREAKDOWN.map((item) => (
      <div class="hssr-asset-row">
        <span class="hssr-asset-label">{item.label}</span>
        <div class="hssr-asset-bar-track">
          <div class="hssr-asset-bar-fill" style={`width: ${item.shareOfTotalPercent * 10}%`}></div>
        </div>
        <span class="hssr-asset-amount">{formatManwon(item.amountManwon)}</span>
      </div>
    ))}
  </div>
</section>
```

`shareOfTotalPercent`는 총재산 대비 비중(%)이며, 막대 폭은 시각적으로 강조하기 위해 `* 10`을 곱해 사용한다 (가장 큰 항목인 건물 4.4% 기준 44% 폭). 실제 구현 시 막대 폭 스케일은 데이터 디자인 QA에서 조정 가능.

### 6.4 보수 비교

```astro
<section class="content-section hssr-compensation" aria-labelledby="hssr-comp-title">
  <div class="hssr-section-heading">
    <p>보수 비교</p>
    <h2 id="hssr-comp-title">장관에서 총리가 되면 연봉이 어떻게 바뀔까</h2>
    <span>2026년 정무직 공무원 보수표 기준 세전 연봉입니다.</span>
  </div>

  <div class="hssr-comp-grid">
    {HSSR_COMPENSATION_COMPARE.map((item) => (
      <article class="hssr-comp-card">
        <span class={`hssr-badge hssr-badge--${item.badge.replace(/\s/g, "-")}`}>{item.badge}</span>
        <strong>{item.roleLabel}</strong>
        <em>{formatManwon(item.annualCompManwon)}</em>
        <small>월 {formatManwon(item.monthlyCompManwon)} · {item.note}</small>
      </article>
    ))}
  </div>

  <p class="hssr-comp-gap">취임 시 연봉 차이는 약 {formatManwon(compGap)}입니다.</p>
</section>
```

### 6.5 민간 vs 관료 출신 비교

```astro
<section class="content-section hssr-context" aria-labelledby="hssr-context-title">
  <div class="hssr-section-heading">
    <p>공직자 재산 비교</p>
    <h2 id="hssr-context-title">민간 출신과 관료 출신, 자산 구조가 다르다</h2>
    <span>같은 정기 재산변동 공개 기준으로 작성된 다른 공직자와 비교합니다.</span>
  </div>

  <div class="hssr-compare-grid">
    {HSSR_RELATED_OFFICIALS_COMPARE.map((official) => (
      <a class="hssr-compare-card" href={withBase(official.href)}>
        <span class={`hssr-bg-tag hssr-bg-tag--${official.background === "민간 출신" ? "private" : "public"}`}>{official.background}</span>
        <strong>{official.nameKo}</strong>
        <small>{official.roleTitle}</small>
        <em>{formatManwon(official.totalAssetsManwon)}</em>
        <p>{official.note}</p>
      </a>
    ))}
  </div>
</section>
```

### 6.6 인사청문회 절차 안내

```astro
<section class="content-section hssr-procedure" aria-labelledby="hssr-procedure-title">
  <div class="hssr-section-heading">
    <p>다음 절차</p>
    <h2 id="hssr-procedure-title">정식 취임까지 남은 단계</h2>
  </div>

  <ol class="hssr-procedure-list">
    {HSSR_PROCEDURE_STEPS.map((step) => (
      <li class={`hssr-procedure-item hssr-procedure-item--${step.statusLabel === "완료" ? "done" : step.statusLabel === "진행 중" ? "active" : "pending"}`}>
        <span class="hssr-procedure-order">{step.order}</span>
        <div>
          <strong>{step.title}</strong>
          <p>{step.description}</p>
        </div>
        <span class="hssr-procedure-status">{step.statusLabel}</span>
      </li>
    ))}
  </ol>
</section>
```

### 6.7 관련 링크

```astro
<section class="content-section hssr-related" aria-labelledby="hssr-related-title">
  <div class="hssr-section-heading">
    <p>같이 보면 좋은 리포트</p>
    <h2 id="hssr-related-title">다른 공직자 재산도 비교해보세요</h2>
  </div>

  <div class="hssr-related-grid">
    {HSSR_RELATED_LINKS.map((link) => (
      <a class="hssr-related-card" href={withBase(link.href)}>
        <strong>{link.label}</strong>
        <p>{link.description}</p>
      </a>
    ))}
  </div>
</section>
```

---

## 7. SCSS (`src/styles/scss/pages/_han-seong-sook-pm-nominee-career-assets-2026.scss`)

```scss
.hssr-page {
  --hssr-ink: #172033;
  --hssr-muted: #667085;
  --hssr-line: #d8e0ea;
  --hssr-soft: #f5f8fb;
  --hssr-blue: #2f5acf;
  --hssr-green: #0f8a5f;
  --hssr-warn: #9a5b00;

  .hssr-section-heading {
    display: grid;
    gap: 6px;

    p, h2, span { margin: 0; }

    p {
      color: var(--hssr-blue);
      font-size: 12px;
      font-weight: 900;
    }

    h2 {
      color: var(--hssr-ink);
      font-size: clamp(22px, 3vw, 30px);
      line-height: 1.25;
    }

    span {
      color: var(--hssr-muted);
      font-size: 14px;
      line-height: 1.65;
    }
  }

  .hssr-profile-grid,
  .hssr-comp-grid,
  .hssr-compare-grid,
  .hssr-related-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .hssr-profile-card,
  .hssr-comp-card,
  .hssr-compare-card,
  .hssr-related-card {
    display: grid;
    gap: 8px;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--hssr-line);
    border-radius: 8px;
    background: #fff;
    color: inherit;
    text-decoration: none;
  }

  .hssr-profile-card {
    span { color: var(--hssr-muted); font-size: 12px; }
    strong { color: var(--hssr-ink); font-size: 18px; line-height: 1.3; }
    small { color: var(--hssr-muted); font-size: 13px; }
  }

  /* 타임라인 */
  .hssr-timeline-list {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
  }

  .hssr-timeline-item {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 16px;
    padding-bottom: 24px;
    position: relative;

    &:not(:last-child)::before {
      content: "";
      position: absolute;
      left: 27px;
      top: 40px;
      bottom: 0;
      width: 2px;
      background: var(--hssr-line);
    }
  }

  .hssr-timeline-marker {
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 999px;
      background: var(--hssr-soft);
      border: 2px solid var(--hssr-blue);
      color: var(--hssr-blue);
      font-size: 13px;
      font-weight: 900;
    }
  }

  .hssr-timeline-body {
    display: grid;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid var(--hssr-line);
    border-radius: 8px;
    background: #fff;

    h3 { margin: 0; color: var(--hssr-ink); font-size: 17px; line-height: 1.35; }
    p { margin: 0; color: var(--hssr-muted); font-size: 14px; line-height: 1.65; }
  }

  .hssr-timeline-period {
    color: var(--hssr-blue) !important;
    font-size: 12px !important;
    font-weight: 700;
  }

  .hssr-timeline-comp {
    color: var(--hssr-green) !important;
    font-weight: 700;
  }

  /* 재산 bar */
  .hssr-asset-bars {
    display: grid;
    gap: 10px;
  }

  .hssr-asset-row {
    display: grid;
    grid-template-columns: 140px 1fr 100px;
    align-items: center;
    gap: 10px;
  }

  .hssr-asset-label {
    color: var(--hssr-ink);
    font-size: 13px;
    font-weight: 700;
  }

  .hssr-asset-bar-track {
    height: 10px;
    border-radius: 999px;
    background: var(--hssr-soft);
    overflow: hidden;
  }

  .hssr-asset-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--hssr-blue);
  }

  .hssr-asset-amount {
    text-align: right;
    color: var(--hssr-ink);
    font-size: 13px;
    font-weight: 900;
  }

  /* 보수 카드 */
  .hssr-comp-card {
    em {
      color: var(--hssr-blue);
      font-size: 22px;
      font-style: normal;
      font-weight: 900;
    }
    small { color: var(--hssr-muted); font-size: 12px; }
  }

  .hssr-comp-gap {
    margin-top: 12px;
    color: var(--hssr-muted);
    font-size: 14px;
  }

  /* 비교 카드 */
  .hssr-compare-card {
    transition: border-color 0.16s, transform 0.16s;
    &:hover { border-color: var(--hssr-blue); transform: translateY(-1px); }

    strong { color: var(--hssr-ink); font-size: 16px; }
    em { color: var(--hssr-blue); font-size: 18px; font-style: normal; font-weight: 900; }
    p { margin: 0; color: var(--hssr-muted); font-size: 13px; line-height: 1.6; }
  }

  .hssr-bg-tag {
    width: fit-content;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 900;

    &--private { background: #eaf1ff; color: var(--hssr-blue); }
    &--public { background: #f0f6f1; color: var(--hssr-green); }
  }

  .hssr-badge {
    width: fit-content;
    padding: 4px 8px;
    border-radius: 999px;
    background: #fff4df;
    color: var(--hssr-warn);
    font-size: 11px;
    font-weight: 900;

    &--공개재산,
    &--공식-프로필 { background: #eaf1ff; color: var(--hssr-blue); }
    &--보도-기준 { background: #f0f6f1; color: var(--hssr-green); }
    &--추정 { background: #fff4df; color: var(--hssr-warn); }
  }

  /* 절차 */
  .hssr-procedure-list {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .hssr-procedure-item {
    display: grid;
    grid-template-columns: 32px 1fr auto;
    align-items: start;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid var(--hssr-line);
    border-radius: 8px;
    background: #fff;

    strong { color: var(--hssr-ink); font-size: 14px; }
    p { margin: 4px 0 0; color: var(--hssr-muted); font-size: 13px; line-height: 1.55; }

    &--done { border-color: #bfe3cf; background: #f5fbf7; }
    &--active { border-color: #b9ccff; background: #f6f9ff; }
  }

  .hssr-procedure-order {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: var(--hssr-soft);
    color: var(--hssr-ink);
    font-size: 12px;
    font-weight: 900;
  }

  .hssr-procedure-status {
    color: var(--hssr-muted);
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .hssr-profile-grid,
    .hssr-comp-grid,
    .hssr-compare-grid,
    .hssr-related-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .hssr-timeline-item { grid-template-columns: 40px 1fr; }
    .hssr-timeline-marker span { width: 40px; height: 40px; font-size: 11px; }
    .hssr-timeline-item:not(:last-child)::before { left: 19px; }

    .hssr-asset-row { grid-template-columns: 1fr; gap: 4px; }
    .hssr-asset-amount { text-align: left; }

    .hssr-procedure-item { grid-template-columns: 24px 1fr; }
    .hssr-procedure-status { grid-column: 2; }
  }
}
```

---

## 8. SEO 콘텐츠 설계 (GOOGLE_SEO_RULES.md 기준 준수)

`intro`는 **5단락 이상, 총 800자 이상**, `faq`는 **5개 이상**(위 데이터 파일 `HSSR_FAQ`는 7개로 여유 확보)을 충족한다.

```ts
const seoIntro = [
  "한성숙 국무총리 후보자는 네이버 대표이사 출신으로, 거대 플랫폼 기업과 정부 부처를 모두 이끌어본 드문 경력을 가진 인물입니다. 2017년부터 2022년까지 네이버 단독 대표이사를 지내며 라인 분사, 커머스·콘텐츠 확장, 글로벌 사업 재편을 주도했고, 퇴임 이후에는 산업계 자문 활동을 이어가다 이재명 정부 초대 중소벤처기업부 장관으로 공직에 입문했습니다. 이번 국무총리 후보자 지명은 거대 플랫폼 운영 경험과 정부 부처 운영 경험을 모두 갖춘 인사가 중소기업과 소상공인까지 체감할 수 있는 경제 성장을 이끌 적임자로 평가받았다는 배경에서 이뤄졌습니다.",
  "이 리포트는 한성숙 후보자의 커리어 전환점을 연도별 타임라인으로 정리하고, 각 단계에서 확인 가능한 보수·재산 수치를 함께 보여줍니다. 네이버 대표이사 시절 개인 보수는 공식 비공개 데이터이기 때문에 사업보고서에 공시된 등기임원 보수 총액을 바탕으로 한 추정값으로만 다루며, 중소벤처기업부 장관 취임 이후부터는 고위공직자 정기 재산변동 공개 대상이 되어 구체적인 수치가 공식적으로 확인됩니다.",
  "2026년 3월 26일 공개된 정기 재산변동 신고 기준 한성숙 후보자의 총재산은 약 223억원(2,230,160만원)입니다. 건물 약 9.7억원, 토지 약 6.7억원, 예금 약 6.5억원, 증권 약 5.1억원으로 구성되어 있으며, 채권 2억4,500만원과 금 1,500만원, 가상자산 2,029만원 등도 메모성 항목으로 함께 보도됐습니다. 1차 공개 대상 공직자 15명 중에서도 자산 절대액 상위권에 속하는 규모입니다.",
  "공직 보수 측면에서는 2026년 정무직 공무원 보수표를 기준으로 중소벤처기업부 장관 연봉이 약 1억5,493만원이며, 국무총리로 정식 취임할 경우 연봉은 약 2억1,069만원으로 약 5,576만원 늘어납니다. 다만 이 연봉은 국회 인사청문회와 본회의 임명동의안 표결을 모두 통과해야 적용되며, 현재는 아직 '후보자' 단계입니다.",
  "이 페이지는 한성숙 후보자 한 명의 커리어와 재산을 정치적으로 평가하기 위한 콘텐츠가 아닙니다. 비교계산소의 다른 공직자 재산 리포트와 동일한 기준으로, 공개된 경력과 재산 수치를 커리어 타임라인 형태로 정리해 읽는 인터랙티브 리포트입니다. 같은 정기 재산변동 공개 기준으로 작성된 '2026 이재명 정부 핵심 공직자 재산·보수 비교 리포트'와 함께 보면, 민간 출신 공직자와 관료 출신 공직자의 자산 구성 차이도 함께 확인할 수 있습니다.",
];

const seoCriteria = [
  "재산 수치는 2026년 3월 26일 고위공직자 정기 재산변동 공개 보도(조선비즈)를 기준으로 작성했습니다.",
  "네이버 재직 시절 보수는 공식 비공개 데이터이므로 사업보고서 공시 기준 추정값으로만 제공하며, 확정값으로 보지 않습니다.",
  "공직 보수는 2026년 정무직 공무원 보수표 기준 세전 연봉이며, 개인별 수당·세금은 반영하지 않습니다.",
  "국무총리 정식 취임 전까지는 모든 표기를 '후보자' 기준으로 유지하며, 인사청문회·본회의 인준 결과에 따라 갱신합니다.",
];
```

---

## 9. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `han-seong-sook-pm-nominee-career-assets-2026` 항목 추가 (제목/설명/카테고리/뱃지) |
| `src/styles/app.scss` | `@use 'scss/pages/han-seong-sook-pm-nominee-career-assets-2026';` 추가 |
| `public/sitemap.xml` | `/reports/han-seong-sook-pm-nominee-career-assets-2026/` 추가 (`changefreq: weekly` — 청문회 일정 변동 대응) |
| `src/data/leeGovernmentOfficialsAssetsSalary2026.ts` | `referenceLinks` 또는 패턴 포인트에 단독 리포트 링크 추가 검토 |
| `src/pages/reports/index.astro` | 리포트 허브 목록 노출 확인 |
| 홈 추천 리포트 영역 | 시즌성 이슈이므로 1~2주 노출 후 교체 검토 |

---

## 10. 내부 링크 수정 포인트

### 10.1 공직자 비교 리포트 → 단독 리포트
파일: `src/data/leeGovernmentOfficialsAssetsSalary2026.ts`
- `referenceLinks.media`에 본 리포트 링크 추가하거나, 한성숙 항목(`entries` 내 `han-sungsook`) 근처에 "한성숙 단독 커리어·재산 리포트 보기" CTA 추가 검토.

### 10.2 비교표 허브
파일: `src/data/compareHub.ts` (존재 시)
- 정치/공직자 카테고리에 카드 추가:
```ts
{
  id: "han-seong-sook-career-assets",
  title: "한성숙 재산·경력 2026",
  description: "네이버 대표에서 총리 후보까지, 커리어 단계별 보수와 재산을 정리합니다.",
  href: "/reports/han-seong-sook-pm-nominee-career-assets-2026/",
  type: "report",
  categoryId: "politics",
  criteria: ["총리 후보자", "재산 223억", "커리어 타임라인"],
  badges: [{ label: "신규", tone: "new" }, { label: "추정 포함", tone: "estimate" }],
  stats: [{ label: "총재산", value: "223억원" }, { label: "현직", value: "총리 후보자" }],
  ctaLabel: "리포트 보기",
  priority: 0.6,
}
```

---

## 11. QA 포인트

- [ ] `intro` 5단락 이상, 800자 이상 (실측 글자수 확인)
- [ ] `faq` 5개 이상, 각 답변 3문장 이상
- [ ] `SeoContent`가 `<Fragment slot="seo">` 안에 배치됨
- [ ] 모든 비공개 추정 수치(네이버 재직 시절 보수)에 `추정` 뱃지 표시
- [ ] "총리"가 아니라 "총리 후보자"로 표기 — 인준 전 시제 오류 없는지 전체 검토
- [ ] 재산 상세 합계가 총재산(223억160만원)과 일치하는지 검증
- [ ] 모바일 375px에서 타임라인·재산 bar·절차 리스트가 깨지지 않음
- [ ] JSON-LD `Article`, `FAQPage`, `BreadcrumbList` 생성 확인
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 누락 없음
- [ ] `npm run build` 성공
- [ ] 인사청문회 일정 확정 시 `HSSR_PROCEDURE_STEPS`의 `statusLabel` 갱신 필요 — `updatedAt` 동기화

---

## 12. 구현 리스크 및 갱신 계획

- **시제 오류 리스크**: 지명 단계에서 "총리"로 단정 표기하면 사실 오류가 됨. Hero, 프로필 카드, 보수 비교 섹션 전체에 "후보자" 표기를 반복 노출.
- **비공개 데이터 오인 리스크**: 네이버 재직 시절 보수·스톡옵션은 절대 확정값처럼 쓰지 않고, 타임라인 카드마다 추정 뱃지를 개별 부착.
- **빠른 정보 변화 대응**: 인사청문회 일정, 인준 통과 여부가 빠르게 바뀌므로 `updatedAt`을 자주 갱신하고, 인준 통과 시 전체 페이지를 "총리 취임" 기준으로 재작성하는 후속 작업을 별도 플랜으로 분리.
- **기존 클러스터와 중복 방지**: 15인 비교 리포트는 횡단 비교, 이 리포트는 단일 인물 커리어 타임라인으로 역할을 명확히 분리해 콘텐츠 카니발라이제이션 방지.
- **출처 검증 필요 항목**: 네이버 입사 연도(2007년 가정), 대표이사 취임/퇴임 정확한 날짜는 실제 구현 전 공식 프로필 또는 보도자료로 재검증 필수 (현재 설계 문서의 연도는 1차 추정 기준이며 실제 구현 시 정확한 사실 확인 후 보정).
