// 지역구별 국회의원 재산 순위 2026
// 원본 데이터(NAW_TOP30/NAW_BOTTOM10)를 지역구·권역 단위로 재구성한 파생 데이터.
// 신규 개인 재산 수치를 추정하지 않고, 기존 national-assembly-wealth-2026 데이터만 재사용한다.
import { NAW_TOP30, NAW_BOTTOM10 } from "./nationalAssemblyWealth2026";

export type Region = "수도권" | "영남" | "호남" | "충청" | "강원·제주" | "비례대표" | "확인필요";

const REGION_PREFIX: Record<string, Region> = {
  "서울": "수도권",
  "경기": "수도권",
  "인천": "수도권",
  "부산": "영남",
  "울산": "영남",
  "경남": "영남",
  "대구": "영남",
  "경북": "영남",
  "광주": "호남",
  "전남": "호남",
  "전북": "호남",
  "대전": "충청",
  "세종": "충청",
  "충남": "충청",
  "충북": "충청",
  "강원": "강원·제주",
  "제주": "강원·제주",
};

export function classifyRegion(district: string): Region {
  if (district === "비례대표") return "비례대표";
  const prefix = district.slice(0, 2);
  return REGION_PREFIX[prefix] ?? "확인필요";
}

type SampleMember = {
  rank: number;
  name: string;
  party: string;
  district: string;
  totalBillion: number;
};

// 오세훈(rank 14)은 국회의원이 아닌 서울시장 참고값으로 원본에 포함된 항목이라
// "국회의원 지역구" 표본에서 제외한다 (원본 note 참조).
const NON_LAWMAKER_NAMES = new Set(["오세훈"]);

const RAW_SAMPLE: SampleMember[] = [...NAW_TOP30, ...NAW_BOTTOM10].filter(
  (m) => !NON_LAWMAKER_NAMES.has(m.name)
);

export interface DistrictMember {
  rank: number;
  name: string;
  party: string;
  district: string;
  region: Region;
  totalBillion: number;
}

export const NADW_ALL_MEMBERS: DistrictMember[] = RAW_SAMPLE.map((m) => ({
  rank: m.rank,
  name: m.name,
  party: m.party,
  district: m.district,
  region: classifyRegion(m.district),
  totalBillion: m.totalBillion,
})).sort((a, b) => a.rank - b.rank);

export interface RegionSummary {
  region: Region;
  memberCountInSample: number;
  avgBillionInSample: number;
  topMember: { name: string; billion: number; district: string };
  members: DistrictMember[];
}

export const NADW_REGION_SUMMARY: RegionSummary[] = (() => {
  const groups = new Map<Region, DistrictMember[]>();
  for (const m of NADW_ALL_MEMBERS) {
    if (m.region === "확인필요") continue; // 이상값 데이터는 권역 집계에서 제외
    if (!groups.has(m.region)) groups.set(m.region, []);
    groups.get(m.region)!.push(m);
  }
  return [...groups.entries()]
    .map(([region, members]) => {
      const sorted = [...members].sort((a, b) => b.totalBillion - a.totalBillion);
      const avg = members.reduce((sum, m) => sum + m.totalBillion, 0) / members.length;
      return {
        region,
        memberCountInSample: members.length,
        avgBillionInSample: Math.round(avg * 10) / 10,
        topMember: { name: sorted[0].name, billion: sorted[0].totalBillion, district: sorted[0].district },
        members: sorted,
      };
    })
    .sort((a, b) => b.avgBillionInSample - a.avgBillionInSample);
})();

const SAMPLE_SIZE = NADW_ALL_MEMBERS.length;

export const NADW_META = {
  slug: "national-assembly-district-wealth-2026",
  title: "지역구별 국회의원 재산 순위 2026",
  seoTitle: "지역구별 국회의원 재산 순위 2026 | 우리 지역 의원은 몇 위",
  seoDescription:
    "TOP30·하위 10명 국회의원의 지역구·수도권/영남/호남/충청 권역별 재산을 순위로 비교. 우리 지역 의원 재산과 권역 평균까지 한눈에 확인하세요.",
  updatedAt: "2026-07-03",
  sampleNote: `공개된 TOP30·하위 10명 중 지역구가 확인된 ${SAMPLE_SIZE}명 표본 기준입니다. 전체 253개 지역구를 포함하지 않습니다.`,
  sourceReportSlug: "national-assembly-wealth-2026",
};

// ─── FAQ ─────────────────────────────────────────────────────
export const NADW_FAQ = [
  {
    question: "우리 지역구 의원이 목록에 없어요",
    answer:
      "이 리포트는 공개된 TOP30·하위 10명(지역구 확인 기준 표본) 데이터만 다룹니다. 전체 253개 지역구를 포함하지 않으므로 목록에 없는 지역구도 많습니다. 전체 300명 기준 순위는 원본 TOP30 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "수도권 의원이 재산이 더 많은가요?",
    answer:
      "표본(지역구 확인 기준) 내에서는 수도권 의원 평균이 다른 권역보다 높게 나타나지만, 이는 전체 지역구를 대표하는 값이 아니라 공개된 40명 표본 안에서의 경향입니다. 표본 크기가 작아 특정 고액 자산가 1~2명의 영향이 클 수 있습니다.",
  },
  {
    question: "이 데이터는 실제 공시 수치인가요?",
    answer:
      "공직자윤리위원회 공시 기준 추정치입니다. 실제 공시 내역과 차이가 있을 수 있으며, 투자 판단이나 정치적 평가의 근거로 사용해서는 안 됩니다.",
  },
  {
    question: "지역구가 아니라 비례대표인 의원도 있나요?",
    answer: "있습니다. 비례대표 의원은 지역구가 없어 별도의 '비례대표' 권역 그룹으로 분류해 표시합니다.",
  },
  {
    question: "원본 TOP30 리포트와 뭐가 다른가요?",
    answer:
      "같은 데이터를 지역구·권역 관점으로 재구성한 자매 리포트입니다. 정당별·직업별 분석 등 더 자세한 내용은 원본 TOP30 리포트에서 확인할 수 있습니다.",
  },
];

// ─── 관련 링크 ────────────────────────────────────────────────
export const NADW_RELATED_LINKS = [
  {
    href: "/reports/national-assembly-wealth-2026/",
    label: "국회의원 재산 순위 TOP30 전체 분석",
    desc: "정당별 평균·재산 구성·직업 배경별 완전 분석",
  },
  {
    href: "/reports/seoul-mayor-candidate-assets-2026/",
    label: "서울시장 후보 재산 비교",
    desc: "오세훈 등 서울시장 후보 재산 공개",
  },
  {
    href: "/reports/governor-mayor-candidate-assets-comparison-2026/",
    label: "광역단체장 재산 비교 2026",
    desc: "시도지사 재산 순위 한눈에 비교",
  },
];
