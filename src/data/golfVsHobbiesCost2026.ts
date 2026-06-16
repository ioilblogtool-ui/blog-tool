export type HobbyCategory = "outdoor" | "indoor" | "watersport" | "racket" | "fitness";

export interface HobbyCostEntry {
  id: string;
  name: string;
  category: HobbyCategory;
  emoji: string;
  monthlyMin: number;
  monthlyMax: number;
  monthlyAvg: number;
  initialCost: number;
  annualCost: number;
  fiveYearTotal: number;
  tenYearTotal: number;
  socialScore: number;
  healthScore: number;
  entryBarrier: "낮음" | "보통" | "높음";
  peakSeason: string;
  highlight: string;
  isGolf?: boolean;
}

export const HOBBY_LIST: HobbyCostEntry[] = [
  {
    id: "golf", name: "골프", category: "outdoor", emoji: "⛳",
    monthlyMin: 200_000, monthlyMax: 800_000, monthlyAvg: 400_000,
    initialCost: 2_000_000, annualCost: 4_800_000,
    fiveYearTotal: 26_000_000, tenYearTotal: 50_000_000,
    socialScore: 5, healthScore: 4, entryBarrier: "높음",
    peakSeason: "3~11월", highlight: "비즈니스 네트워킹 최강, 전국 500+ 골프장", isGolf: true,
  },
  {
    id: "ski", name: "스키·보드", category: "outdoor", emoji: "⛷️",
    monthlyMin: 80_000, monthlyMax: 300_000, monthlyAvg: 150_000,
    initialCost: 800_000, annualCost: 1_800_000,
    fiveYearTotal: 9_800_000, tenYearTotal: 18_800_000,
    socialScore: 3, healthScore: 4, entryBarrier: "보통",
    peakSeason: "12~3월 (시즌제)", highlight: "겨울 시즌 집중, 리조트 숙박 비용 추가",
  },
  {
    id: "tennis", name: "테니스", category: "racket", emoji: "🎾",
    monthlyMin: 60_000, monthlyMax: 200_000, monthlyAvg: 120_000,
    initialCost: 400_000, annualCost: 1_440_000,
    fiveYearTotal: 7_600_000, tenYearTotal: 14_800_000,
    socialScore: 4, healthScore: 5, entryBarrier: "보통",
    peakSeason: "연중", highlight: "최근 MZ세대 급증, 레슨비가 주 비용",
  },
  {
    id: "fitness", name: "헬스·피트니스", category: "fitness", emoji: "💪",
    monthlyMin: 30_000, monthlyMax: 150_000, monthlyAvg: 80_000,
    initialCost: 300_000, annualCost: 960_000,
    fiveYearTotal: 5_100_000, tenYearTotal: 9_900_000,
    socialScore: 2, healthScore: 5, entryBarrier: "낮음",
    peakSeason: "연중", highlight: "가장 접근성 높은 취미, PT 포함 시 비용 상승",
  },
  {
    id: "cycling", name: "자전거 (로드)", category: "outdoor", emoji: "🚴",
    monthlyMin: 50_000, monthlyMax: 200_000, monthlyAvg: 100_000,
    initialCost: 1_500_000, annualCost: 1_200_000,
    fiveYearTotal: 7_500_000, tenYearTotal: 13_500_000,
    socialScore: 3, healthScore: 5, entryBarrier: "보통",
    peakSeason: "3~11월", highlight: "초기 자전거 구매가 비용의 핵심",
  },
  {
    id: "fishing", name: "낚시", category: "outdoor", emoji: "🎣",
    monthlyMin: 50_000, monthlyMax: 250_000, monthlyAvg: 120_000,
    initialCost: 600_000, annualCost: 1_440_000,
    fiveYearTotal: 7_800_000, tenYearTotal: 15_000_000,
    socialScore: 3, healthScore: 2, entryBarrier: "보통",
    peakSeason: "3~11월", highlight: "장비 업그레이드 욕심이 비용 상승 주범",
  },
  {
    id: "hiking", name: "등산", category: "outdoor", emoji: "🏔️",
    monthlyMin: 10_000, monthlyMax: 80_000, monthlyAvg: 40_000,
    initialCost: 400_000, annualCost: 480_000,
    fiveYearTotal: 2_800_000, tenYearTotal: 5_200_000,
    socialScore: 3, healthScore: 5, entryBarrier: "낮음",
    peakSeason: "연중 (봄·가을 성수기)", highlight: "가장 경제적인 야외 취미",
  },
  {
    id: "baseball", name: "야구 (사회인)", category: "outdoor", emoji: "⚾",
    monthlyMin: 20_000, monthlyMax: 100_000, monthlyAvg: 60_000,
    initialCost: 300_000, annualCost: 720_000,
    fiveYearTotal: 3_900_000, tenYearTotal: 7_500_000,
    socialScore: 5, healthScore: 4, entryBarrier: "낮음",
    peakSeason: "3~10월", highlight: "팀 스포츠, 사회적 유대감 최고",
  },
  {
    id: "bowling", name: "볼링", category: "indoor", emoji: "🎳",
    monthlyMin: 20_000, monthlyMax: 80_000, monthlyAvg: 50_000,
    initialCost: 100_000, annualCost: 600_000,
    fiveYearTotal: 3_100_000, tenYearTotal: 6_100_000,
    socialScore: 4, healthScore: 2, entryBarrier: "낮음",
    peakSeason: "연중", highlight: "실내·사계절 가능, 가장 낮은 진입 장벽",
  },
  {
    id: "surfing", name: "서핑", category: "watersport", emoji: "🏄",
    monthlyMin: 80_000, monthlyMax: 350_000, monthlyAvg: 180_000,
    initialCost: 800_000, annualCost: 2_160_000,
    fiveYearTotal: 11_600_000, tenYearTotal: 22_400_000,
    socialScore: 4, healthScore: 5, entryBarrier: "보통",
    peakSeason: "6~9월", highlight: "라이프스타일 취미, 교통·숙박비 포함 시 고비용",
  },
];

export const HOBBY_LIST_SORTED = [...HOBBY_LIST].sort((a, b) => b.monthlyAvg - a.monthlyAvg);

export const GHC_KPI = {
  cheapest: HOBBY_LIST_SORTED[HOBBY_LIST_SORTED.length - 1],
  mostExpensive: HOBBY_LIST_SORTED[0],
  golfRank: HOBBY_LIST_SORTED.findIndex(h => h.id === 'golf') + 1,
  totalCount: HOBBY_LIST.length,
};

export const CATEGORY_LABEL: Record<HobbyCategory, string> = {
  outdoor: "야외", indoor: "실내", watersport: "수상", racket: "라켓", fitness: "피트니스",
};

export const SCORE_LABELS: Record<number, string> = {
  1: "★", 2: "★★", 3: "★★★", 4: "★★★★", 5: "★★★★★",
};

export interface FaqItem { question: string; answer: string; }

export const GHC_FAQ: FaqItem[] = [
  {
    question: "골프는 정말 가장 비싼 취미인가요?",
    answer: "월 비용 기준으로는 골프가 비교 취미 10종 중 1위입니다. 하지만 스키·보드는 시즌 리조트 숙박비를 포함하면 월 환산 시 골프 못지않은 경우도 있습니다. 서핑도 교통·숙박비 포함 시 상당한 수준입니다.",
  },
  {
    question: "골프 비용 데이터의 기준이 무엇인가요?",
    answer: "월 평균은 퍼블릭 라운딩 2회 + 연습장 월정액 + 장비 감가상각 + 의류 기준입니다. 월 4회 이상 라운딩하거나 프리미엄 골프장을 이용하면 월 70~150만원까지 오를 수 있습니다.",
  },
  {
    question: "취미별 10년 총비용은 어떻게 계산되나요?",
    answer: "초기 비용(장비·가입비) + 월 평균 비용 × 12개월 × 10년으로 계산합니다. 물가 상승률·장비 교체 주기는 포함하지 않은 단순화된 추정치입니다.",
  },
  {
    question: "인맥 형성 지수는 어떻게 산정했나요?",
    answer: "팀 스포츠(야구·볼링 등)는 함께 즐기는 구조로 5점에 가깝게 평가했고, 개인 운동(자전거·등산)은 낮게 평가했습니다. 골프는 비즈니스 골프 관행상 5점으로 설정했습니다.",
  },
  {
    question: "테니스가 갑자기 뜨는 이유는 뭔가요?",
    answer: "2022년 이후 MZ세대 사이에서 '힙한 운동'으로 부상했습니다. 레슨비가 월 5~10만원대로 저렴하고, 도심 내 공공 테니스장이 많아 접근성이 좋습니다. 골프의 대체재로도 주목받고 있습니다.",
  },
  {
    question: "비용이 적은 취미를 골라야 할까요?",
    answer: "취미는 비용보다 지속 가능성과 삶의 질 향상이 중요합니다. 비싼 취미도 꾸준히 즐기면 삶의 만족도와 건강에 기여합니다. 이 비교는 예산 계획 수립을 돕기 위한 참고 자료입니다.",
  },
];

export const GHC_META = {
  slug: "golf-vs-hobbies-cost-comparison",
  title: "골프 vs 취미 비용 비교 2026 — 10종 월 유지비 랭킹",
  description: "골프·테니스·스키·헬스·낚시 등 10가지 취미의 월 유지비와 10년 총비용을 비교합니다.",
};
