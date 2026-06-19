export type InteriorGrade = 'min' | 'mid' | 'high';

export type InteriorItemKey =
  | 'sash'
  | 'expansion'
  | 'wallpaper'
  | 'floor'
  | 'bath_master'
  | 'bath_common'
  | 'kitchen'
  | 'lighting'
  | 'door'
  | 'entrance';

export interface InteriorItemMeta {
  key: InteriorItemKey;
  label: string;
  icon: string;
  hasSubOption: boolean;
  subOptions?: { value: string; label: string }[];
  defaultSubOption?: string;
}

export interface UnitPrice {
  min: number;
  mid: number;
  high: number;
}

// 24평 기준 단가 (원)
export const UNIT_PRICES: Record<string, Record<string, UnitPrice>> = {
  sash:        { default:          { min: 3_000_000, mid: 5_000_000, high: 8_500_000 } },
  expansion:   { default:          { min: 1_500_000, mid: 2_200_000, high: 3_500_000 } },
  wallpaper: {
    hap:                           { min:   700_000, mid: 1_200_000, high: 2_000_000 },
    silk:                          { min: 1_000_000, mid: 1_600_000, high: 2_800_000 },
  },
  floor: {
    strong:                        { min:   800_000, mid: 1_400_000, high: 2_200_000 },
    hard:                          { min: 1_200_000, mid: 2_000_000, high: 3_200_000 },
    wood:                          { min: 2_500_000, mid: 3_800_000, high: 6_000_000 },
  },
  bath_master: { default:          { min: 1_400_000, mid: 2_600_000, high: 4_500_000 } },
  bath_common: { default:          { min: 1_400_000, mid: 2_600_000, high: 4_500_000 } },
  kitchen: {
    sink:                          { min: 1_600_000, mid: 3_000_000, high: 5_500_000 },
    sink_tile:                     { min: 2_000_000, mid: 3_800_000, high: 7_000_000 },
    sink_tile_builtin:             { min: 3_000_000, mid: 5_500_000, high: 10_000_000 },
  },
  lighting:    { default:          { min:   350_000, mid:   700_000, high: 1_400_000 } },
  door:        { default:          { min:   600_000, mid: 1_200_000, high: 2_200_000 } },
  entrance:    { default:          { min:   250_000, mid:   450_000, high:   800_000 } },
};

// 24평 = 1.0 기준 평수별 계수
export const AREA_MULTIPLIERS: { pyeong: number; multiplier: number }[] = [
  { pyeong: 10, multiplier: 0.55 },
  { pyeong: 15, multiplier: 0.70 },
  { pyeong: 20, multiplier: 0.85 },
  { pyeong: 24, multiplier: 1.00 },
  { pyeong: 30, multiplier: 1.20 },
  { pyeong: 34, multiplier: 1.35 },
  { pyeong: 40, multiplier: 1.55 },
  { pyeong: 45, multiplier: 1.70 },
  { pyeong: 50, multiplier: 1.85 },
  { pyeong: 60, multiplier: 2.10 },
];

export const INTERIOR_ITEMS: InteriorItemMeta[] = [
  { key: 'sash',        label: '샷시 교체',   icon: '🪟', hasSubOption: false },
  { key: 'expansion',   label: '베란다 확장',  icon: '🏗️', hasSubOption: false },
  {
    key: 'wallpaper', label: '도배', icon: '🖌️', hasSubOption: true,
    subOptions: [
      { value: 'hap',  label: '합지' },
      { value: 'silk', label: '실크' },
    ],
    defaultSubOption: 'silk',
  },
  {
    key: 'floor', label: '마루', icon: '🪵', hasSubOption: true,
    subOptions: [
      { value: 'strong', label: '강화마루' },
      { value: 'hard',   label: '강마루' },
      { value: 'wood',   label: '원목마루' },
    ],
    defaultSubOption: 'hard',
  },
  { key: 'bath_master', label: '욕실 (안방)',  icon: '🚿', hasSubOption: false },
  { key: 'bath_common', label: '욕실 (공용)',  icon: '🚿', hasSubOption: false },
  {
    key: 'kitchen', label: '주방', icon: '🍳', hasSubOption: true,
    subOptions: [
      { value: 'sink',              label: '싱크대만' },
      { value: 'sink_tile',         label: '싱크대 + 타일' },
      { value: 'sink_tile_builtin', label: '싱크대 + 타일 + 빌트인' },
    ],
    defaultSubOption: 'sink_tile',
  },
  { key: 'lighting',    label: '조명 전체',    icon: '💡', hasSubOption: false },
  { key: 'door',        label: '중문',         icon: '🚪', hasSubOption: false },
  { key: 'entrance',    label: '현관 타일',    icon: '🔲', hasSubOption: false },
];

// 평수별 참고 비교표 (샷시+도배실크+강마루+욕실2+주방싱크타일+조명 기준)
export const REFERENCE_BY_PYEONG = [
  { pyeong: 20, min:  9_000_000, mid: 15_000_000, high: 25_000_000 },
  { pyeong: 24, min: 10_500_000, mid: 17_800_000, high: 30_000_000 },
  { pyeong: 32, min: 13_500_000, mid: 22_500_000, high: 38_000_000 },
  { pyeong: 34, min: 14_500_000, mid: 24_000_000, high: 40_000_000 },
  { pyeong: 40, min: 17_000_000, mid: 28_000_000, high: 47_000_000 },
];

export const AIC_FAQ = [
  {
    q: "24평 구축 아파트 올수리 비용은 보통 얼마인가요?",
    a: "샷시·도배(실크)·강마루·욕실 2개·주방(싱크대+타일)·조명 포함 기준으로 최소 약 1,000만 원, 보통 1,700만 원, 고급 자재 시 3,000만 원대입니다. 자재 등급과 업체에 따라 편차가 매우 큽니다.",
  },
  {
    q: "비용이 가장 많이 드는 항목은 무엇인가요?",
    a: "샷시(창호), 욕실 전체 철거·재시공, 주방(빌트인 포함) 순으로 비용이 높습니다. 이 3개 항목이 전체 예산의 60~70%를 차지하는 경우가 많습니다.",
  },
  {
    q: "마루는 강화마루와 강마루 중 어느 쪽이 나은가요?",
    a: "강화마루는 비용이 낮지만 내구성이 약하고 물에 취약합니다. 강마루는 비용이 약간 높지만 내구성과 질감이 좋아 가장 많이 선택합니다. 원목마루는 고급감이 높지만 유지 관리가 필요합니다.",
  },
  {
    q: "인테리어 업체 견적서 받을 때 반드시 확인해야 할 항목은?",
    a: "①철거비 포함 여부, ②폐기물 처리비, ③부자재(이음새·몰딩·코킹) 포함 기준, ④추가 공사 단가 기준, ⑤하자보증 기간을 반드시 확인하세요. 이 항목들이 빠진 견적은 실제 비용이 20~40% 더 나올 수 있습니다.",
  },
  {
    q: "베란다 확장 공사는 꼭 해야 하나요?",
    a: "필수는 아닙니다. 거실 면적이 넓어지는 장점이 있지만 단열 성능 저하 우려가 있고, 지역별 허가 기준이 다릅니다. 반드시 구청 문의 후 합법 여부를 확인한 뒤 진행하세요.",
  },
];

export const AIC_RELATED_LINKS = [
  { href: "/tools/real-estate-acquisition-tax/", label: "아파트 취득세 계산기", desc: "구입가 기준 취득세 즉시 계산" },
  { href: "/reports/seoul-84-apartment-prices/", label: "서울 국평 아파트 가격 리포트", desc: "강남·마포·성동 84㎡ 평균가 비교" },
  { href: "/tools/jeonwolse-conversion/", label: "전월세 전환 계산기", desc: "전세→월세, 월세→전세 환산" },
  { href: "/tools/apartment-holding-tax/", label: "아파트 보유세 계산기", desc: "재산세+종부세 연간 보유세 계산" },
];

export const AIC_INTRO = [
  "구축 아파트 올수리 비용은 24평 기준 최소 800만 원에서 고급 자재를 쓰면 3,500만 원이 넘기도 합니다. 같은 평수라도 어떤 항목을 선택하고 자재 등급을 어떻게 잡느냐에 따라 견적이 최대 3~4배 차이납니다. 이 계산기는 항목을 직접 체크하면서 내 예산에 맞는 견적 범위를 확인하는 용도로 만들었습니다.",
  "비용 격차를 만드는 3대 항목은 샷시(창호), 욕실, 마루입니다. 샷시는 브랜드 창호와 일반 창호 간 가격 차이가 2~3배, 욕실은 사용하는 도기와 타일 등급에 따라 1개당 150만 원에서 500만 원까지 올라갑니다. 이 세 항목이 전체 공사비의 60~70%를 차지하기 때문에, 예산 조정이 필요하다면 이 항목의 등급을 먼저 조정하는 게 효과적입니다.",
  "인테리어 업체에서 받은 최초 견적과 실제 최종 금액이 20~40% 차이나는 경우가 흔합니다. 최초 견적은 대부분 기본 자재 기준이고, 시공 중 발견되는 방수 보강, 전기 분전반 교체, 단열재 추가 같은 추가 공사가 붙으면 금액이 올라갑니다. 견적서를 받을 때는 철거비, 폐기물 처리비, 부자재 포함 여부를 반드시 확인하세요.",
  "우선순위를 정할 때는 입주 후 교체가 어려운 항목을 먼저 시공하는 게 합리적입니다. 샷시, 욕실 방수, 마루 철거는 가구가 들어오기 전에 처리해야 비용과 불편이 줄어듭니다. 반면 도배와 조명은 나중에 부분 교체가 가능하므로 예산이 부족하면 후순위로 미뤄도 됩니다.",
  "2026년 기준 인건비 상승과 자재비 증가로 욕실과 주방 시공 비용이 2024년 대비 10~15% 올랐습니다. 특히 타일 시공 인건비와 수입 도기 가격 상승이 주된 원인입니다. 이 계산기의 단가는 2024~2026년 국내 시공 사례와 소비자원 자료를 기반으로 산정했으며, 실제 견적은 지역·업체·시기에 따라 달라질 수 있습니다.",
];
