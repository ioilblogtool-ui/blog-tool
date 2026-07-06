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
  seoTitle: "한성숙 국무총리 프로필 2026 | 재산 223억·경력 총정리",
  seoDescription:
    "한성숙 국무총리 후보자 프로필 한눈에 정리. 네이버 대표이사~중기부 장관 경력과 공개 재산 223억원 상세, 총리 연봉·인사청문회 절차까지 확인.",
  description:
    "엠파스 창립 멤버에서 네이버 대표이사, 중소벤처기업부 장관, 국무총리 후보자까지 한성숙의 커리어 전환점과 공개 재산을 한 화면에서 확인하는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-20",
  dataNote:
    "재산 수치는 2026년 3월 26일 고위공직자 정기 재산변동 공개 보도(조선비즈) 기준이며, 네이버 재직 시절 보수·스톡옵션은 비공개 데이터를 바탕으로 한 추정값입니다. 국무총리 공식 인준 전까지는 '후보자' 기준으로 표기합니다.",
};

export const HSSR_CAREER_TIMELINE: CareerTimelineStep[] = [
  {
    id: "empas",
    year: "1990년대~2000년대",
    periodLabel: "엠파스 창립 멤버 ~ 검색사업본부장",
    roleTitle: "검색사업본부장",
    org: "엠파스",
    description:
      "숙명여대 영어영문학과를 졸업한 뒤 잡지사 기자로 사회생활을 시작해 나눔기술, PC라인을 거쳐 검색 포털 엠파스에 창립 멤버로 합류했습니다. 엠파스에서 검색사업본부장을 맡으며 검색 서비스 기획·운영 경험을 쌓았습니다.",
    compEstimateLabel: "비공개 (창립 멤버·임원급 보수 미공개)",
    badge: "공식 프로필",
  },
  {
    id: "nhn-naver",
    year: "2000년대 후반~2017년",
    periodLabel: "엠파스 매각 이후 ~ 2017년 3월",
    roleTitle: "검색품질센터장 → 서비스본부장",
    org: "NHN(네이버 전신)",
    description:
      "엠파스가 SK커뮤니케이션즈에 매각되자 네이버의 전신인 NHN으로 자리를 옮겨 검색품질센터장, 서비스본부장을 역임하며 네이버 서비스 전반을 총괄했습니다. 이 시기는 네이버의 검색·모바일 서비스 경쟁력을 다진 핵심 구간으로 평가됩니다.",
    compEstimateLabel: "비공개 (등기임원 선임 전 단계)",
    badge: "공식 프로필",
  },
  {
    id: "naver-ceo",
    year: "2017~2022",
    periodLabel: "2017년 3월 ~ 2022년 3월",
    roleTitle: "대표이사 사장",
    org: "네이버",
    description:
      "2017년 3월 네이버 대표이사 사장으로 취임해 5년간 회사를 이끌며 라인 분사, 커머스·콘텐츠 확장, 글로벌 사업 재편을 주도했습니다. 2022년 3월 대표이사직에서 물러났습니다. 재임 기간 개인 보수는 공식 비공개 데이터이므로 사업보고서에 공시된 등기임원 보수 총액 기준 추정값으로만 다룹니다.",
    compEstimateLabel: "추정 연 보수 수억원대 (사업보고서 등기임원 보수 공시 기준 추정)",
    badge: "추정",
  },
  {
    id: "naver-post-ceo",
    year: "2022~2025",
    periodLabel: "2022년 ~ 2025년 4월",
    roleTitle: "유럽사업개발 대표 → 고문",
    org: "네이버",
    description:
      "대표이사 퇴임 이후 네이버 유럽사업개발 대표를 지냈고, 2025년 4월부터는 네이버 고문으로 활동하며 공직 진출 직전까지 회사와의 연결을 유지했습니다. 이후 중소벤처기업부 장관 후보자 지명과 함께 고문직을 사임했습니다.",
    badge: "공식 프로필",
  },
  {
    id: "minister",
    year: "2025",
    periodLabel: "2025년 6월 23일 지명 ~ 7월 23일 임명",
    roleTitle: "중소벤처기업부 장관",
    org: "이재명 정부",
    description:
      "2025년 6월 23일 이재명 정부 초대 중소벤처기업부 장관 후보자로 지명됐고, 같은 해 7월 23일 이재명 대통령이 임명안을 재가하며 공직에 첫발을 디뎠습니다. 이 시기부터 고위공직자 정기 재산변동 공개 대상이 되어 총재산 약 223억원(2,230,160만원) 규모가 처음 공식적으로 확인됐습니다.",
    compEstimateLabel: "정무직 장관 연봉 약 1억5,493만원 (세전, 정무직 보수표 기준)",
    badge: "공개재산",
  },
  {
    id: "pm-nominee",
    year: "2026",
    periodLabel: "2026년 6월 7일 지명 ~",
    roleTitle: "국무총리 후보자",
    org: "이재명 정부",
    description:
      "2026년 6월 7일 이재명 정부의 두 번째 국무총리 후보자로 지명됐습니다. 거대 플랫폼 기업과 정부 부처를 모두 이끌어본 혁신 리더십을 바탕으로, 중소기업·소상공인까지 체감할 수 있는 경제 성장을 이끌 적임자로 평가받았습니다. 국회 인사청문회와 본회의 인준을 거쳐야 정식 취임합니다.",
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
];

export const HSSR_DEBT_MANWON = 3500;
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
  { id: "nomination", order: 1, title: "국무총리 후보자 지명", description: "2026년 6월 7일 대통령이 한성숙 후보자를 국무총리로 지명하고 국회에 인사청문 요청서를 제출했습니다.", statusLabel: "완료" },
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
      "검색 포털 엠파스 창립 멤버로 검색사업본부장을 지낸 뒤, 엠파스가 SK커뮤니케이션즈에 매각되자 NHN(네이버 전신)으로 이동해 검색품질센터장, 서비스본부장을 역임했습니다. 2017년 3월부터 2022년 3월까지 네이버 대표이사를 지냈고, 퇴임 후 유럽사업개발 대표와 고문을 거쳐 2025년 7월 중소벤처기업부 장관으로 공직에 입문했습니다. 2026년 6월 7일 국무총리 후보자로 지명됐습니다.",
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

export const HSSR_SEO_INTRO: string[] = [
  "한성숙 국무총리 후보자는 검색 포털 엠파스 창립 멤버에서 시작해 네이버 대표이사까지 지낸 뒤 공직에 입문한 드문 경력을 가진 인물입니다. 엠파스가 SK커뮤니케이션즈에 매각된 이후 NHN(네이버 전신)으로 자리를 옮겨 검색품질센터장과 서비스본부장을 역임했고, 2017년 3월부터 2022년 3월까지 5년간 네이버 대표이사 사장으로 회사를 이끌며 라인 분사, 커머스·콘텐츠 확장, 글로벌 사업 재편을 주도했습니다. 이번 국무총리 후보자 지명은 거대 플랫폼 운영 경험과 정부 부처 운영 경험을 모두 갖춘 인사가 중소기업과 소상공인까지 체감할 수 있는 경제 성장을 이끌 적임자로 평가받았다는 배경에서 이뤄졌습니다.",
  "이 리포트는 한성숙 후보자의 커리어 전환점을 연도별 타임라인으로 정리하고, 각 단계에서 확인 가능한 보수·재산 수치를 함께 보여줍니다. 네이버 대표이사 시절 개인 보수는 공식 비공개 데이터이기 때문에 사업보고서에 공시된 등기임원 보수 총액을 바탕으로 한 추정값으로만 다루며, 2025년 7월 중소벤처기업부 장관으로 취임한 이후부터는 고위공직자 정기 재산변동 공개 대상이 되어 구체적인 수치가 공식적으로 확인됩니다.",
  "2026년 3월 26일 공개된 정기 재산변동 신고 기준 한성숙 후보자의 총재산은 약 223억원(2,230,160만원)입니다. 건물 약 9.7억원, 토지 약 6.7억원, 예금 약 6.5억원, 증권 약 5.1억원으로 구성되어 있으며, 채권 2억4,500만원과 금 1,500만원, 가상자산 2,029만원 등도 메모성 항목으로 함께 보도됐습니다. 1차 공개 대상 공직자 15명 중에서도 자산 절대액 상위권에 속하는 규모입니다.",
  "공직 보수 측면에서는 2026년 정무직 공무원 보수표를 기준으로 중소벤처기업부 장관 연봉이 약 1억5,493만원이며, 국무총리로 정식 취임할 경우 연봉은 약 2억1,069만원으로 약 5,576만원 늘어납니다. 다만 이 연봉은 국회 인사청문회와 본회의 임명동의안 표결을 모두 통과해야 적용되며, 현재는 2026년 6월 7일 지명된 '후보자' 단계입니다.",
  "이 페이지는 한성숙 후보자 한 명의 커리어와 재산을 정치적으로 평가하기 위한 콘텐츠가 아닙니다. 비교계산소의 다른 공직자 재산 리포트와 동일한 기준으로, 공개된 경력과 재산 수치를 커리어 타임라인 형태로 정리해 읽는 인터랙티브 리포트입니다. 같은 정기 재산변동 공개 기준으로 작성된 '2026 이재명 정부 핵심 공직자 재산·보수 비교 리포트'와 함께 보면, 민간 출신 공직자와 관료 출신 공직자의 자산 구성 차이도 함께 확인할 수 있습니다.",
];

export const HSSR_SEO_CRITERIA: string[] = [
  "재산 수치는 2026년 3월 26일 고위공직자 정기 재산변동 공개 보도(조선비즈)를 기준으로 작성했습니다.",
  "네이버 재직 시절 보수는 공식 비공개 데이터이므로 사업보고서 공시 기준 추정값으로만 제공하며, 확정값으로 보지 않습니다.",
  "공직 보수는 2026년 정무직 공무원 보수표 기준 세전 연봉이며, 개인별 수당·세금은 반영하지 않습니다.",
  "국무총리 정식 취임 전까지는 모든 표기를 '후보자' 기준으로 유지하며, 인사청문회·본회의 인준 결과에 따라 갱신합니다.",
];

export function formatManwon(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "미공개";
  if (value >= 10000) {
    const eok = value / 10000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }
  return `${Number(value).toLocaleString("ko-KR")}만원`;
}

export function getCompGapManwon(items: CompensationCompareItem[]) {
  if (items.length < 2) return 0;
  return items[items.length - 1].annualCompManwon - items[0].annualCompManwon;
}
