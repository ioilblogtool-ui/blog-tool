export type BabySex = "male" | "female";

export interface BabyGrowthInput {
  sex: BabySex;
  birthDate: string;
  measureDate: string;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm: number;
  useCorrectedAge: boolean;
  prematureWeeks: number;
}

export interface PercentilePoint {
  month: number;
  p3: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p97: number;
}

export interface FeedingBand {
  id: string;
  label: string;
  monthStart: number;
  monthEnd: number;
  dailyMlPerKgMin: number;
  dailyMlPerKgMax: number;
  feedingsPerDay: string;
  singleFeedMl: string;
  note: string;
}

export interface DevelopmentBand {
  id: string;
  label: string;
  monthStart: number;
  monthEnd: number;
  summary: string;
  currentChecks: string[];
  nextPreview: string[];
  consultFlags: string[];
}

export interface VaccinationBand {
  id: string;
  label: string;
  monthStart: number;
  monthEnd: number;
  currentVaccines: string[];
  nextVaccines: string[];
  note: string;
}

export const PAGE_META = {
  title: "아기 성장 백분위 계산기 | 수유량·발달 체크·예방접종 안내",
  subtitle:
    "몸무게, 키, 머리둘레를 넣으면 아기 성장 백분위를 참고용으로 계산하고 월령별 수유량, 발달 체크, 예방접종 일정을 한 화면에서 확인할 수 있습니다.",
  methodology:
    "0~24개월 성장 기준표를 단순화한 참고용 계산기입니다. 실제 진단이나 치료 판단은 반드시 의료진 상담을 우선하세요.",
  caution:
    "백분위 한 번보다 성장 추세가 더 중요합니다. 급격한 감소·정체·증가가 있거나 수유와 발달이 함께 걱정되면 진료를 권장합니다.",
  updatedAt: "2026년 4월 기준",
};

export const BABY_GROWTH_DEFAULT_INPUT: BabyGrowthInput = {
  sex: "male",
  birthDate: "2025-10-01",
  measureDate: "2026-04-01",
  weightKg: 7.6,
  heightCm: 67.2,
  headCircumferenceCm: 43.1,
  useCorrectedAge: false,
  prematureWeeks: 36,
};

export const BABY_GROWTH_TABLES: Record<
  BabySex,
  {
    weight: PercentilePoint[];
    height: PercentilePoint[];
    head: PercentilePoint[];
  }
> = {
  male: {
    weight: [
      { month: 0, p3: 2.5, p10: 2.8, p25: 3.1, p50: 3.4, p75: 3.8, p90: 4.2, p97: 4.5 },
      { month: 1, p3: 3.4, p10: 3.8, p25: 4.2, p50: 4.5, p75: 5.1, p90: 5.6, p97: 6.0 },
      { month: 2, p3: 4.4, p10: 4.9, p25: 5.3, p50: 5.7, p75: 6.4, p90: 7.0, p97: 7.5 },
      { month: 4, p3: 5.6, p10: 6.1, p25: 6.6, p50: 7.0, p75: 7.8, p90: 8.5, p97: 9.0 },
      { month: 6, p3: 6.4, p10: 6.9, p25: 7.4, p50: 7.9, p75: 8.8, p90: 9.5, p97: 10.1 },
      { month: 9, p3: 7.1, p10: 7.6, p25: 8.1, p50: 8.8, p75: 9.6, p90: 10.4, p97: 11.1 },
      { month: 12, p3: 7.7, p10: 8.2, p25: 8.8, p50: 9.6, p75: 10.4, p90: 11.3, p97: 12.0 },
      { month: 18, p3: 8.7, p10: 9.3, p25: 10.0, p50: 10.9, p75: 11.8, p90: 12.8, p97: 13.8 },
      { month: 24, p3: 9.7, p10: 10.3, p25: 11.1, p50: 12.2, p75: 13.2, p90: 14.3, p97: 15.3 },
    ],
    height: [
      { month: 0, p3: 46.0, p10: 47.2, p25: 48.4, p50: 49.9, p75: 51.1, p90: 52.3, p97: 53.4 },
      { month: 1, p3: 50.1, p10: 51.4, p25: 52.6, p50: 54.0, p75: 55.3, p90: 56.5, p97: 57.6 },
      { month: 2, p3: 53.7, p10: 55.0, p25: 56.3, p50: 57.8, p75: 59.2, p90: 60.5, p97: 61.7 },
      { month: 4, p3: 59.1, p10: 60.5, p25: 61.9, p50: 63.9, p75: 65.8, p90: 67.2, p97: 68.6 },
      { month: 6, p3: 63.0, p10: 64.5, p25: 66.0, p50: 67.6, p75: 69.3, p90: 70.8, p97: 72.0 },
      { month: 9, p3: 67.2, p10: 68.8, p25: 70.2, p50: 72.0, p75: 73.8, p90: 75.2, p97: 76.5 },
      { month: 12, p3: 70.0, p10: 71.5, p25: 73.1, p50: 75.0, p75: 76.9, p90: 78.4, p97: 79.8 },
      { month: 18, p3: 76.0, p10: 77.8, p25: 79.5, p50: 81.7, p75: 84.0, p90: 85.7, p97: 87.3 },
      { month: 24, p3: 81.0, p10: 82.8, p25: 84.8, p50: 87.1, p75: 89.4, p90: 91.2, p97: 92.9 },
    ],
    head: [
      { month: 0, p3: 32.8, p10: 33.5, p25: 34.1, p50: 34.9, p75: 35.6, p90: 36.2, p97: 36.8 },
      { month: 1, p3: 35.2, p10: 36.0, p25: 36.6, p50: 37.3, p75: 38.0, p90: 38.6, p97: 39.1 },
      { month: 2, p3: 36.9, p10: 37.6, p25: 38.3, p50: 39.1, p75: 39.8, p90: 40.4, p97: 41.0 },
      { month: 4, p3: 39.2, p10: 39.9, p25: 40.5, p50: 41.4, p75: 42.1, p90: 42.8, p97: 43.4 },
      { month: 6, p3: 40.7, p10: 41.4, p25: 42.1, p50: 43.0, p75: 43.7, p90: 44.4, p97: 45.0 },
      { month: 9, p3: 42.0, p10: 42.7, p25: 43.4, p50: 44.3, p75: 45.0, p90: 45.7, p97: 46.3 },
      { month: 12, p3: 42.8, p10: 43.5, p25: 44.2, p50: 45.1, p75: 45.8, p90: 46.5, p97: 47.1 },
      { month: 18, p3: 44.0, p10: 44.8, p25: 45.4, p50: 46.4, p75: 47.1, p90: 47.8, p97: 48.5 },
      { month: 24, p3: 44.9, p10: 45.6, p25: 46.3, p50: 47.3, p75: 48.1, p90: 48.8, p97: 49.5 },
    ],
  },
  female: {
    weight: [
      { month: 0, p3: 2.4, p10: 2.7, p25: 3.0, p50: 3.2, p75: 3.7, p90: 4.0, p97: 4.4 },
      { month: 1, p3: 3.2, p10: 3.6, p25: 4.0, p50: 4.2, p75: 4.8, p90: 5.2, p97: 5.6 },
      { month: 2, p3: 4.0, p10: 4.5, p25: 4.9, p50: 5.1, p75: 5.8, p90: 6.3, p97: 6.7 },
      { month: 4, p3: 5.1, p10: 5.6, p25: 6.0, p50: 6.4, p75: 7.1, p90: 7.7, p97: 8.2 },
      { month: 6, p3: 5.8, p10: 6.3, p25: 6.8, p50: 7.3, p75: 8.0, p90: 8.7, p97: 9.3 },
      { month: 9, p3: 6.5, p10: 7.0, p25: 7.5, p50: 8.2, p75: 9.0, p90: 9.8, p97: 10.5 },
      { month: 12, p3: 7.0, p10: 7.5, p25: 8.1, p50: 8.9, p75: 9.7, p90: 10.6, p97: 11.3 },
      { month: 18, p3: 8.1, p10: 8.7, p25: 9.4, p50: 10.2, p75: 11.2, p90: 12.1, p97: 13.0 },
      { month: 24, p3: 9.0, p10: 9.7, p25: 10.5, p50: 11.5, p75: 12.5, p90: 13.6, p97: 14.6 },
    ],
    height: [
      { month: 0, p3: 45.4, p10: 46.6, p25: 47.8, p50: 49.1, p75: 50.4, p90: 51.6, p97: 52.7 },
      { month: 1, p3: 49.1, p10: 50.3, p25: 51.6, p50: 53.0, p75: 54.4, p90: 55.6, p97: 56.8 },
      { month: 2, p3: 52.4, p10: 53.7, p25: 55.0, p50: 56.4, p75: 57.9, p90: 59.2, p97: 60.4 },
      { month: 4, p3: 57.7, p10: 59.1, p25: 60.5, p50: 62.1, p75: 63.8, p90: 65.2, p97: 66.5 },
      { month: 6, p3: 61.4, p10: 62.8, p25: 64.3, p50: 65.7, p75: 67.4, p90: 68.9, p97: 70.1 },
      { month: 9, p3: 65.3, p10: 66.8, p25: 68.3, p50: 70.1, p75: 71.9, p90: 73.4, p97: 74.7 },
      { month: 12, p3: 68.2, p10: 69.7, p25: 71.2, p50: 73.2, p75: 75.1, p90: 76.7, p97: 78.1 },
      { month: 18, p3: 74.3, p10: 76.0, p25: 77.8, p50: 80.1, p75: 82.3, p90: 84.1, p97: 85.7 },
      { month: 24, p3: 79.4, p10: 81.2, p25: 83.1, p50: 85.7, p75: 88.0, p90: 89.9, p97: 91.5 },
    ],
    head: [
      { month: 0, p3: 32.1, p10: 32.8, p25: 33.4, p50: 34.2, p75: 34.9, p90: 35.5, p97: 36.1 },
      { month: 1, p3: 34.5, p10: 35.2, p25: 35.9, p50: 36.5, p75: 37.3, p90: 37.9, p97: 38.4 },
      { month: 2, p3: 36.0, p10: 36.8, p25: 37.5, p50: 38.3, p75: 39.1, p90: 39.7, p97: 40.3 },
      { month: 4, p3: 38.3, p10: 39.0, p25: 39.7, p50: 40.6, p75: 41.4, p90: 42.1, p97: 42.7 },
      { month: 6, p3: 39.6, p10: 40.4, p25: 41.1, p50: 41.9, p75: 42.8, p90: 43.5, p97: 44.1 },
      { month: 9, p3: 40.9, p10: 41.6, p25: 42.3, p50: 43.2, p75: 44.0, p90: 44.7, p97: 45.3 },
      { month: 12, p3: 41.7, p10: 42.4, p25: 43.1, p50: 44.1, p75: 44.8, p90: 45.5, p97: 46.2 },
      { month: 18, p3: 42.9, p10: 43.6, p25: 44.3, p50: 45.2, p75: 46.0, p90: 46.8, p97: 47.5 },
      { month: 24, p3: 43.8, p10: 44.5, p25: 45.2, p50: 46.1, p75: 47.0, p90: 47.7, p97: 48.4 },
    ],
  },
};

export const FEEDING_GUIDES: FeedingBand[] = [
  {
    id: "newborn",
    label: "0~1개월",
    monthStart: 0,
    monthEnd: 1,
    dailyMlPerKgMin: 140,
    dailyMlPerKgMax: 180,
    feedingsPerDay: "6~8회",
    singleFeedMl: "60~120ml",
    note: "신생아는 적은 양을 자주 먹는 패턴이 일반적입니다. 수유 후 처짐, 젖은 기저귀 수, 체중 증가를 함께 보세요.",
  },
  {
    id: "early",
    label: "2~3개월",
    monthStart: 2,
    monthEnd: 3,
    dailyMlPerKgMin: 130,
    dailyMlPerKgMax: 160,
    feedingsPerDay: "5~7회",
    singleFeedMl: "100~160ml",
    note: "먹는 양이 빠르게 늘어나는 시기입니다. 토하거나 너무 보채는 경우 속도와 간격을 함께 점검하세요.",
  },
  {
    id: "peak",
    label: "4~6개월",
    monthStart: 4,
    monthEnd: 6,
    dailyMlPerKgMin: 120,
    dailyMlPerKgMax: 150,
    feedingsPerDay: "5~6회",
    singleFeedMl: "140~220ml",
    note: "총 수유량이 가장 많은 구간입니다. 이유식 시작 전후로 수유량이 조금 흔들려도 추세가 더 중요합니다.",
  },
  {
    id: "mixed",
    label: "7~11개월",
    monthStart: 7,
    monthEnd: 11,
    dailyMlPerKgMin: 90,
    dailyMlPerKgMax: 120,
    feedingsPerDay: "4~5회",
    singleFeedMl: "160~240ml",
    note: "이유식 비중이 늘면서 분유나 모유 수유량이 함께 줄어듭니다. 이유식과 수유를 합쳐 하루 섭취 흐름을 보세요.",
  },
  {
    id: "toddler",
    label: "12~24개월",
    monthStart: 12,
    monthEnd: 24,
    dailyMlPerKgMin: 60,
    dailyMlPerKgMax: 90,
    feedingsPerDay: "2~3회",
    singleFeedMl: "150~240ml",
    note: "식사 비중이 훨씬 커지는 시기입니다. 우유와 유제품, 식사량을 포함해 전체 섭취 균형을 보는 것이 좋습니다.",
  },
];

export const DEVELOPMENT_GUIDES: DevelopmentBand[] = [
  {
    id: "m0_2",
    label: "0~2개월",
    monthStart: 0,
    monthEnd: 2,
    summary: "시선 맞추기와 반사 반응, 짧은 목 가누기 시작을 보는 시기입니다.",
    currentChecks: [
      "큰 소리에 놀라거나 반응이 있다",
      "얼굴을 잠깐 따라본다",
      "엎드렸을 때 잠시 고개를 든다",
      "울음 외에도 표정 변화가 보인다",
    ],
    nextPreview: ["사회적 미소가 더 분명해진다", "옹알이가 늘어난다", "고개를 더 오래 든다"],
    consultFlags: [
      "수유가 매우 힘들고 깨우기 어렵다",
      "소리나 얼굴 자극에 거의 반응이 없다",
      "전신이 지나치게 축 처지거나 뻣뻣하다",
    ],
  },
  {
    id: "m3_5",
    label: "3~5개월",
    monthStart: 3,
    monthEnd: 5,
    summary: "사회적 미소, 옹알이, 목 가누기 안정성이 늘어나는 구간입니다.",
    currentChecks: [
      "사람을 보고 웃거나 반응한다",
      "소리를 내며 옹알이한다",
      "엎드렸을 때 팔로 버틴다",
      "손을 보고 만지며 관심을 보인다",
    ],
    nextPreview: ["뒤집기 시작", "장난감을 잡고 입으로 가져간다", "낯익은 사람과 낯선 사람 반응 차이가 보인다"],
    consultFlags: [
      "목 가누기가 전혀 되지 않는다",
      "시선 맞춤이 거의 없다",
      "한쪽만 쓰거나 몸의 비대칭이 매우 크다",
    ],
  },
  {
    id: "m6_8",
    label: "6~8개월",
    monthStart: 6,
    monthEnd: 8,
    summary: "뒤집기, 앉기 준비, 물건 탐색이 활발해지는 시기입니다.",
    currentChecks: [
      "뒤집기를 하거나 자세를 바꾼다",
      "물건을 잡고 양손으로 옮긴다",
      "이름이나 친숙한 소리에 반응한다",
      "앉기 자세를 잠시 유지하려고 한다",
    ],
    nextPreview: ["혼자 앉기 안정", "기거나 이동하려는 시도", "낯가림과 분리불안 초기 반응"],
    consultFlags: [
      "물건을 잡으려는 시도가 거의 없다",
      "몸을 거의 뒤집지 않는다",
      "소리와 사람에 대한 반응이 매우 적다",
    ],
  },
  {
    id: "m9_11",
    label: "9~11개월",
    monthStart: 9,
    monthEnd: 11,
    summary: "혼자 앉기, 잡고 서기, 의사 표현이 크게 늘어나는 구간입니다.",
    currentChecks: [
      "혼자 앉아 버틸 수 있다",
      "잡고 서거나 기기 시작한다",
      "간단한 말에 반응한다",
      "물건을 집어 전달하거나 떨어뜨린다",
    ],
    nextPreview: ["첫 걸음 준비", "간단한 손짓과 몸짓", "의미 있는 첫말 시작"],
    consultFlags: [
      "스스로 앉는 자세가 전혀 어렵다",
      "사람과 상호작용이 매우 적다",
      "몸을 움직이려는 시도가 거의 없다",
    ],
  },
  {
    id: "m12_17",
    label: "12~17개월",
    monthStart: 12,
    monthEnd: 17,
    summary: "첫 걸음과 간단한 말, 의도 있는 요청이 늘어나는 시기입니다.",
    currentChecks: [
      "가구를 잡고 걷거나 몇 걸음 걷는다",
      "'맘마', '엄마' 같은 의미 있는 말이 보인다",
      "원하는 것을 손가락으로 가리키거나 손짓한다",
      "간단한 지시에 반응한다",
    ],
    nextPreview: ["걷기 안정", "단어 수 증가", "모방 놀이 시작"],
    consultFlags: [
      "전혀 서려고 하지 않는다",
      "의미 있는 소통 시도가 거의 없다",
      "눈맞춤과 상호작용이 지속적으로 매우 적다",
    ],
  },
  {
    id: "m18_24",
    label: "18~24개월",
    monthStart: 18,
    monthEnd: 24,
    summary: "걷기와 간단한 문장 전 단계, 모방 놀이가 확장되는 구간입니다.",
    currentChecks: [
      "혼자 잘 걷고 방향을 바꾼다",
      "단어 수가 늘고 두 단어 조합을 준비한다",
      "블록 쌓기나 흉내 놀이를 시도한다",
      "원하는 것을 더 분명히 표현한다",
    ],
    nextPreview: ["짧은 두 단어 조합", "계단 오르내리기 시도", "역할 놀이 확장"],
    consultFlags: [
      "걷기 자체가 매우 불안정하거나 어렵다",
      "말과 몸짓을 포함한 의사 표현이 거의 없다",
      "반복 행동이나 반응 저하가 눈에 띄게 크다",
    ],
  },
];

export const VACCINATION_GUIDES: VaccinationBand[] = [
  {
    id: "birth",
    label: "출생~1개월",
    monthStart: 0,
    monthEnd: 1,
    currentVaccines: ["B형간염 1차", "BCG(결핵)"],
    nextVaccines: ["2개월 국가예방접종 일정 확인"],
    note: "출생 직후 접종 여부와 다음 예약 시점을 같이 확인해두면 편합니다.",
  },
  {
    id: "m2",
    label: "2개월",
    monthStart: 2,
    monthEnd: 2,
    currentVaccines: ["DTaP-IPV-Hib 1차", "폐렴구균 1차", "B형간염 2차", "로타바이러스 1차"],
    nextVaccines: ["4개월 2차 접종"],
    note: "첫 정기 접종이 몰리는 시기라 병원 예약 간격을 미리 맞춰두는 편이 좋습니다.",
  },
  {
    id: "m4",
    label: "4개월",
    monthStart: 3,
    monthEnd: 4,
    currentVaccines: ["DTaP-IPV-Hib 2차", "폐렴구균 2차", "로타바이러스 2차"],
    nextVaccines: ["6개월 추가 접종"],
    note: "이전 접종과 간격이 맞는지 함께 확인하세요.",
  },
  {
    id: "m6",
    label: "6개월",
    monthStart: 5,
    monthEnd: 6,
    currentVaccines: ["DTaP-IPV-Hib 3차", "B형간염 3차", "인플루엔자 시작 가능 시기"],
    nextVaccines: ["12개월 MMR·수두·일본뇌염 일정"],
    note: "독감 접종 시작 여부는 시즌과 월령을 함께 확인해야 합니다.",
  },
  {
    id: "m12",
    label: "12~15개월",
    monthStart: 7,
    monthEnd: 15,
    currentVaccines: ["MMR 1차", "수두 1회", "폐렴구균 추가", "Hib 추가", "일본뇌염 불활성화 1~2차"],
    nextVaccines: ["18개월 DTaP 추가", "일본뇌염 후속 일정"],
    note: "돌 무렵 접종 종류가 많아져 누락 체크가 특히 중요합니다.",
  },
  {
    id: "m18_24",
    label: "18~24개월",
    monthStart: 16,
    monthEnd: 24,
    currentVaccines: ["DTaP 4차", "A형간염 1차(권장 시점 확인)", "일본뇌염 후속 일정"],
    nextVaccines: ["24개월 이후 추가 일정 확인"],
    note: "실제 접종 브랜드와 이전 이력에 따라 일정이 달라질 수 있어 예방접종도우미 확인이 가장 정확합니다.",
  },
];

export const EXTERNAL_REFERENCE_LINKS = [
  {
    title: "질병관리청 예방접종도우미",
    desc: "실제 접종 이력과 국가예방접종 일정을 가장 정확하게 확인할 때 참고",
    url: "https://nip.kdca.go.kr/",
  },
  {
    title: "국가건강정보포털 영유아 성장·영양",
    desc: "수유, 이유식, 성장 평가에 대한 기본 건강정보를 볼 때 참고",
    url: "https://health.kdca.go.kr/",
  },
  {
    title: "대한소아청소년과학회",
    desc: "영유아 발달과 성장 관련 전문 학회 자료를 볼 때 참고",
    url: "https://www.pediatrics.or.kr/",
  },
];

export const PAGE_FAQ = [
  {
    question: "아기 성장 백분위는 평균보다 낮으면 문제인가요?",
    answer:
      "꼭 그렇지는 않습니다. 백분위는 현재 위치를 보는 참고값이고, 더 중요한 것은 시간이 지나면서 성장 곡선을 크게 벗어나지 않는지입니다. 한 번의 수치보다 추세를 같이 보세요.",
  },
  {
    question: "몸무게와 키, 머리둘레 중 무엇을 먼저 봐야 하나요?",
    answer:
      "보통은 세 항목을 함께 봅니다. 몸무게만 낮거나, 키와 머리둘레는 괜찮은데 체중만 크게 떨어지는지처럼 조합이 더 중요할 수 있습니다.",
  },
  {
    question: "조산아는 교정 월령으로 봐야 하나요?",
    answer:
      "조산으로 태어난 경우 초기에는 교정 월령으로 보는 것이 도움이 될 수 있습니다. 이 계산기에서도 조산 주수와 교정 월령 옵션을 넣어 참고할 수 있게 구성했습니다.",
  },
  {
    question: "수유량은 체중만 넣으면 정확한가요?",
    answer:
      "정확한 처방이 아니라 참고 범위를 보는 용도입니다. 수유량은 아이 컨디션, 이유식 진행, 수유 간격에 따라 달라지므로 젖은 기저귀 수, 체중 증가, 먹는 패턴을 함께 봐야 합니다.",
  },
  {
    question: "발달 체크에서 하나가 안 되면 바로 상담해야 하나요?",
    answer:
      "한 항목만으로 바로 판단하기보다는 월령 오차, 기질 차이, 반복 관찰이 중요합니다. 다만 여러 영역이 함께 느리거나 이전에 하던 것을 잃는 경우는 상담을 권장합니다.",
  },
  {
    question: "예방접종 일정은 이 계산기만 보면 되나요?",
    answer:
      "아닙니다. 이 페이지는 월령별 참고 흐름을 보여주는 도구이고, 실제 접종 이력과 병원 예약은 질병관리청 예방접종도우미나 진료기관 확인이 가장 정확합니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/formula-cost/", label: "아기 분유 값 계산기" },
  { href: "/tools/diaper-cost/", label: "아기 기저귀 값 계산기" },
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
  { href: "/tools/parental-leave-pay/", label: "육아휴직 급여 계산기" },
];

export const BABY_AFFILIATE_PRODUCTS = [
  {
    tag: "기록 도구",
    title: "아기 성장 측정 기록 노트",
    desc: "몸무게, 키, 머리둘레를 정기적으로 기록할 때 쓰기 좋은 기본형 노트",
    href: "https://link.coupang.com/a/eiku9a",
  },
  {
    tag: "체중 측정",
    title: "신생아·아기 체중계",
    desc: "집에서 몸무게 추세를 볼 때 자주 찾는 체중계 검색 링크",
    href: "https://link.coupang.com/a/eikr3x",
  },
  {
    tag: "수유 기록",
    title: "아기 수유 기록 용품",
    desc: "수유량과 수유 간격을 함께 기록할 때 보기 좋은 검색 링크",
    href: "https://link.coupang.com/a/eikufk",
  },
  {
    tag: "건강 관리",
    title: "비접촉 체온계",
    desc: "컨디션 변화와 성장 기록을 같이 볼 때 자주 함께 찾는 품목",
    href: "https://link.coupang.com/a/eiktve",
  },
];
