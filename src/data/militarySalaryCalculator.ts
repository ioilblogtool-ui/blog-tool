import { NCO_STEPS, OFFICER_STEPS, SOLDIER_PAY } from "./militarySalary2026";

export type MilitaryCategory = "soldier" | "nco" | "officer";

export interface MsRankOption {
  id: string;
  label: string;
  group?: string;
  monthlyBase: number;
  monthlyNet: number;
  annualGross: number;
  note?: string;
}

export interface MsPreset {
  id: string;
  label: string;
  description: string;
  category: MilitaryCategory;
  rankId: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const MS_META = {
  slug: "military-salary-calculator",
  title: "군인 월급 계산기 2027",
  seoTitle: "군인 월급 계산기 2027 | 병사·부사관·장교 실수령액 바로 계산",
  seoDescription:
    "병사, 부사관, 장교 계급을 선택하면 2027년 기준 월급과 세후 실수령액, 연봉을 바로 계산합니다. 이병부터 대장까지 계급별 봉급을 한 화면에서 비교하세요.",
  dataNote:
    "이 계산기의 봉급 수치는 국방부 군인보수법과 2026~2027년 봉급표를 기준으로 정리한 추정치입니다. 실제 지급액은 복무 기간, 보직, 수당 적용 여부에 따라 달라질 수 있습니다.",
} as const;

// ── 병사: SOLDIER_PAY를 계산기 옵션 형태로 변환 ───────────────
export const SOLDIER_OPTIONS: MsRankOption[] = SOLDIER_PAY.map((item) => ({
  id: item.rank,
  label: `${item.rank} (${item.serviceMonths})`,
  monthlyBase: item.monthlyBase,
  monthlyNet: item.monthlyNet,
  annualGross: item.monthlyBase * 12,
  note: item.note,
}));

// ── 부사관: NCO_STEPS를 계산기 옵션 형태로 변환 ───────────────
export const NCO_OPTIONS: MsRankOption[] = NCO_STEPS.map((item) => ({
  id: `${item.rank}-${item.step}`,
  label: `${item.rank} ${item.step}호봉`,
  group: item.rank,
  monthlyBase: item.monthlyBase,
  monthlyNet: item.monthlyNet,
  annualGross: item.annualGross,
  note: item.note,
}));

// ── 장교: OFFICER_STEPS를 계산기 옵션 형태로 변환 ─────────────
export const OFFICER_OPTIONS: MsRankOption[] = OFFICER_STEPS.map((item) => ({
  id: `${item.rank}-${item.step}`,
  label: `${item.rank} ${item.step}호봉`,
  group: item.rankGroup,
  monthlyBase: item.monthlyBase,
  monthlyNet: item.monthlyNet,
  annualGross: item.annualGross,
  note: item.note,
}));

export const MS_OPTIONS_BY_CATEGORY: Record<MilitaryCategory, MsRankOption[]> = {
  soldier: SOLDIER_OPTIONS,
  nco: NCO_OPTIONS,
  officer: OFFICER_OPTIONS,
};

export const MS_CATEGORY_LABELS: Record<MilitaryCategory, string> = {
  soldier: "병사",
  nco: "부사관",
  officer: "장교",
};

export const MS_PRESETS: MsPreset[] = [
  {
    id: "private-entry",
    label: "이병 (입대 직후)",
    description: "입대 1~3개월차 기준",
    category: "soldier",
    rankId: "이병",
  },
  {
    id: "sergeant-soldier",
    label: "병장 (전역 직전)",
    description: "복무 18개월차 이후 기준",
    category: "soldier",
    rankId: "병장",
  },
  {
    id: "nco-entry",
    label: "신임 하사",
    description: "부사관 임관 1호봉 기준",
    category: "nco",
    rankId: "하사-1",
  },
  {
    id: "officer-entry",
    label: "신임 소위",
    description: "장교 임관 1년차 기준",
    category: "officer",
    rankId: "소위-1",
  },
];

export const MS_FAQ: FaqItem[] = [
  {
    question: "2027년 병장 월급은 얼마인가요?",
    answer:
      "정부는 병장 봉급을 2027년까지 단계적으로 인상하는 정책을 추진하고 있습니다. 이 계산기의 병사 봉급은 2026년 기준 봉급표에 인상 추세를 반영한 추정치이며, 실제 2027년 확정 봉급표가 발표되면 갱신됩니다.",
  },
  {
    question: "병사 봉급은 왜 호봉이 아니라 계급으로만 나뉘나요?",
    answer:
      "병사(이병·일병·상병·병장)는 의무복무 기간 동안 계급별로 고정된 봉급을 받는 구조라 부사관·장교처럼 호봉이 세분화되어 있지 않습니다. 복무 기간에 따라 계급이 자동으로 올라가는 방식입니다.",
  },
  {
    question: "부사관과 장교 중 어느 쪽이 초임이 더 높나요?",
    answer:
      "초임 기준으로는 장교(소위)가 부사관(하사)보다 다소 높게 책정되어 있습니다. 다만 부사관은 임관이 빠르고 전문 기술직 경로가 있어 중사~상사 구간에서 안정적인 소득을 얻을 수 있습니다.",
  },
  {
    question: "이 계산기의 실수령액은 정확한가요?",
    answer:
      "세후 실수령액은 미혼·부양가족 없음을 기준으로 한 추정치입니다. 직책수당, 특수직무수당, 가족수당, 주거수당 등 개인별 수당은 반영되지 않았으므로 실제 지급액과 차이가 있을 수 있습니다.",
  },
  {
    question: "장병내일준비적금까지 합치면 전역 시 얼마나 모이나요?",
    answer:
      "병사 봉급은 매달 받는 현금이고, 장병내일준비적금은 그 일부를 적립해 정부 매칭지원금과 이자를 더해 받는 별도 제도입니다. 전역 시 목돈 규모는 장병내일준비적금 계산기에서 별도로 확인할 수 있습니다.",
  },
];

export const MS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/military-savings-calculator/", label: "장병내일준비적금 만기 계산기" },
  { href: "/reports/military-salary-2026/", label: "군인 월급·연봉 2026 완전 정리" },
  { href: "/tools/police-firefighter-salary-calculator/", label: "경찰·소방 호봉 실수령액 계산기" },
  { href: "/tools/public-servant-salary-calculator/", label: "공무원 호봉 실수령액 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
];
