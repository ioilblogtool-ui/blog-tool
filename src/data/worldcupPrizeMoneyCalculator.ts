// worldcupPrizeMoneyCalculator.ts
// 월드컵 포상금 계산기 — 데이터

import { KWSS_EXCHANGE_RATES } from "./koreaWorldcupSquadSalary2026";

export type FinalStage = "GROUP_OUT" | "ROUND16" | "QUARTER" | "SEMI" | "FINAL" | "WINNER";

export interface StageOption {
  code: FinalStage;
  label: string; // "조별리그 탈락" 등
  shortLabel: string; // "조별리그", "16강" 등 (그래프/표 라벨용)
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export const WPM_META = {
  slug: "worldcup-prize-money-calculator",
  title: "월드컵 포상금 계산기 | 16강·8강·우승 시 대표팀 포상금 얼마? 2026",
  subtitle: "대표팀 성적 단계별 FIFA 협회 상금과 선수단 포상금을 비교합니다.",
  methodology:
    "FIFA 협회 상금은 2026 월드컵 공식 발표(총 상금 약 8.71억 달러) 기준이며, 대한축구협회(KFA) 선수단 포상금은 2022 카타르 월드컵 기준(16강 1인당 1억원, 8강 2억원)을 참고한 추정치입니다. 4강 이상 단계는 공식 미발표로 단계별 증가 패턴을 적용한 추정값입니다.",
  caution:
    "실제 포상금 지급 기준, 세금, 선수단 배분 방식은 대한축구협회 공식 발표와 다를 수 있는 참고용 추정입니다.",
  updatedAt: "2026년 6월 기준",
};

export const STAGE_ORDER: StageOption[] = [
  { code: "GROUP_OUT", label: "조별리그 탈락", shortLabel: "조별리그" },
  { code: "ROUND16", label: "16강", shortLabel: "16강" },
  { code: "QUARTER", label: "8강", shortLabel: "8강" },
  { code: "SEMI", label: "4강", shortLabel: "4강" },
  { code: "FINAL", label: "준우승", shortLabel: "준우승" },
  { code: "WINNER", label: "우승", shortLabel: "우승" },
];

// FIFA 협회 상금 (단위: USD) — 2026 월드컵 공식 발표 기준(참가 준비금 250만 달러 포함)
export const FIFA_PRIZE_TABLE: Record<FinalStage, number> = {
  GROUP_OUT: 9_000_000,
  ROUND16: 17_500_000,
  QUARTER: 19_000_000,
  SEMI: 27_000_000, // 4위 기준
  FINAL: 33_000_000, // 준우승
  WINNER: 50_000_000,
};

// KFA 선수단 포상금 — 1인당 기본/경기 보너스 (단위: 만원), 2022 카타르 월드컵 기준
export const KFA_BASE_BONUS_M = 2000; // 기본 포상금
export const KFA_WIN_BONUS_M = 3000; // 경기 승리 시
export const KFA_DRAW_BONUS_M = 1000; // 경기 무승부 시

// KFA 선수단 포상금 — 단계 진출 보너스 (1인당, 단위: 만원, 누적액)
// GROUP_OUT/ROUND16/QUARTER: 2022 카타르 월드컵 보도 기준
// SEMI/FINAL/WINNER: 공식 미발표, 단계별 증가 패턴을 적용한 추정치
export const KFA_STAGE_BONUS_M: Record<FinalStage, number> = {
  GROUP_OUT: 0,
  ROUND16: 10000, // 1억원
  QUARTER: 20000, // 2억원
  SEMI: 30000, // 추정: 3억원
  FINAL: 40000, // 추정: 4억원
  WINNER: 60000, // 추정: 6억원
};

export const SQUAD_SIZE = 26; // FIFA 월드컵 등록 엔트리 기준
export const OTHER_INCOME_TAX_RATE = 0.22; // 기타소득 단순 가정(소득세 20% + 지방소득세 2%)

// 손흥민 비교용 (koreaWorldcupSquadSalary2026.ts와 동일 출처/금액 — 갱신 시 두 파일 모두 확인)
export const SON_HEUNGMIN_SALARY_USD = 11_200_000;

export const DEFAULT_EXCHANGE_RATE =
  KWSS_EXCHANGE_RATES.find((r) => r.code === "USD")?.krwRate ?? 1375;

export const WPM_FAQ: PageFaqItem[] = [
  {
    question: "FIFA 협회 상금은 어디서 가져온 데이터인가요?",
    answer:
      "2026 월드컵 총 상금 규모(약 8.71억 달러)와 단계별 상금(우승 5,000만 달러, 준우승 3,300만 달러 등)을 다룬 공식 발표·보도를 기준으로 했습니다. 이 상금은 선수 개인이 아니라 각국 축구협회(한국은 대한축구협회)에 지급됩니다.",
  },
  {
    question: "선수단 포상금은 어떤 기준으로 계산하나요?",
    answer:
      "대한축구협회가 2022 카타르 월드컵에서 발표한 기준(기본 포상금 2,000만원 + 경기 승리 시 3,000만원/무승부 시 1,000만원 + 16강 진출 시 1억원, 8강 진출 시 2억원)을 그대로 적용합니다. 4강 이상 단계는 공식 발표가 없어 단계별 증가 패턴을 적용한 추정치입니다.",
  },
  {
    question: "4강·준우승·우승 포상금은 왜 추정치인가요?",
    answer:
      "대한축구협회가 2022 카타르 월드컵에서도 16강·8강 포상금만 사전 공개했고, 4강 이상은 실제로 진출하지 못해 공식 수치가 없습니다. 이 계산기는 16강(1억원)→8강(2억원)의 증가 패턴을 참고해 4강 3억원, 준우승 4억원, 우승 6억원으로 추정했습니다. 공식 발표가 나오면 갱신됩니다.",
  },
  {
    question: "세후 추정액은 정확한 금액인가요?",
    answer:
      "아닙니다. 포상금을 기타소득으로 보고 22%(소득세 20% + 지방소득세 2%)를 단순 차감한 참고용 추정치입니다. 실제로는 비과세 여부, 증여세 적용, 소속 구단과의 계약 조건 등에 따라 실수령액이 달라질 수 있습니다.",
  },
  {
    question: "선수단 26명에게 똑같이 나눠주나요?",
    answer:
      "이 계산기는 선수단 26명에게 균등 배분한다고 가정한 단순 추정입니다. 실제로는 코칭스태프·지원 스태프도 포상금을 나눠 받을 수 있고, 출전 경기 수나 기여도에 따라 배분 비율이 달라질 수 있습니다.",
  },
];

export const WPM_RELATED_LINKS = [
  { href: "/reports/korea-worldcup-squad-salary-2026/", label: "2026 대한민국 월드컵 대표팀 연봉 순위" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
];
