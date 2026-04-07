// ── 타입 정의 ─────────────────────────────────────────────────────────────────

export type CostTier = "frugal" | "average" | "premium";

export type TierLabel = {
  tier: CostTier;
  label: string;
  tagline: string;
  recommend: string;
};

export type CostKpi = {
  tier: CostTier;
  label: string;
  value: string;
  sub: string;
};

export type CostOverviewRow = {
  category: string;
  frugal: string;
  average: string;
  premium: string;
  isTotal?: boolean;
};

export type ItemCompareRow = {
  item: string;
  frugal: string;
  average: string;
  premium: string;
};

export type MonthlyPhase = {
  period: string;
  mainCosts: string;
  note: string;
};

export type SubsidyRow = {
  tier: CostTier;
  label: string;
  totalCost: string;
  subsidy: string;
  actual: string;
};

export type SavingTip = {
  tip: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type AffiliateItem = {
  tag: string;
  title: string;
  desc: string;
  url: string;
};

export type RelatedCalc = {
  label: string;
  href: string;
};

export type BabyCostGuideReport = {
  meta: {
    seoTitle: string;
    seoDescription: string;
    ogTitle: string;
    ogDescription: string;
    caution: string;
    updatedAt: string;
  };
  tiers: TierLabel[];
  kpis: CostKpi[];
  overviewRows: CostOverviewRow[];
  itemRows: ItemCompareRow[];
  monthlyPhases: MonthlyPhase[];
  subsidyRows: SubsidyRow[];
  savingTips: SavingTip[];
  faq: FaqItem[];
  affiliates: AffiliateItem[];
  relatedCalcs: RelatedCalc[];
};

// ── 데이터 ─────────────────────────────────────────────────────────────────────

export const babyCostGuideFirstYear: BabyCostGuideReport = {
  meta: {
    seoTitle: "신생아~돌까지 육아 비용 총정리 | 가성비·평균·프리미엄 비교",
    seoDescription:
      "신생아부터 돌까지 기저귀, 분유, 병원비, 이유식, 육아용품까지 아기 1년 육아 비용을 가성비·평균·프리미엄 기준으로 비교했습니다. 지원금 반영 후 실제 부담도 확인하세요.",
    ogTitle: "신생아~돌까지 육아 비용 총정리",
    ogDescription:
      "아기 1년 키우는 데 얼마 들까? 가성비·평균·프리미엄 기준으로 한눈에 비교해봅니다.",
    caution:
      "이 리포트의 비용은 가정별 소비 패턴, 수유 방식, 중고 활용 여부에 따라 실제와 차이가 있을 수 있습니다. 예산 감 잡기용 참고 자료로 활용하세요.",
    updatedAt: "2026년 4월 기준 · 추정치",
  },

  tiers: [
    {
      tier: "frugal",
      label: "가성비",
      tagline: "필수 위주 · 중고·선물 적극 활용 · 실용성 우선",
      recommend: "초반 지출을 줄이고 싶은 가정",
    },
    {
      tier: "average",
      label: "평균",
      tagline: "신품 중심 · 가격·품질 균형 · 가장 일반적인 준비",
      recommend: "대부분의 초보 부모",
    },
    {
      tier: "premium",
      label: "프리미엄",
      tagline: "브랜드·편의성 중심 · 신품 선호 · 고급 사양",
      recommend: "예산 여유가 있고 편의성을 중시하는 가정",
    },
  ],

  kpis: [
    {
      tier: "frugal",
      label: "가성비 1년 총비용",
      value: "250만~500만원",
      sub: "지원금 반영 전 기준",
    },
    {
      tier: "average",
      label: "평균 1년 총비용",
      value: "500만~900만원",
      sub: "지원금 반영 전 기준",
    },
    {
      tier: "premium",
      label: "프리미엄 1년 총비용",
      value: "900만~1,500만원+",
      sub: "지원금 반영 전 기준",
    },
  ],

  overviewRows: [
    {
      category: "초기 준비비",
      frugal: "70만~150만원",
      average: "150만~300만원",
      premium: "300만~600만원+",
    },
    {
      category: "월 소모품 (×12)",
      frugal: "120만~240만원",
      average: "240만~420만원",
      premium: "420만~720만원",
    },
    {
      category: "병원·예방접종",
      frugal: "15만~30만원",
      average: "30만~60만원",
      premium: "60만~100만원+",
    },
    {
      category: "이유식·식기·놀이",
      frugal: "10만~25만원",
      average: "25만~60만원",
      premium: "60만~120만원+",
    },
    {
      category: "1년 총비용 예시",
      frugal: "250만~500만원",
      average: "500만~900만원",
      premium: "900만~1,500만원+",
      isTotal: true,
    },
  ],

  itemRows: [
    {
      item: "유모차",
      frugal: "중고·보급형 (10~30만원)",
      average: "절충형 인기 모델 (30~80만원)",
      premium: "프리미엄 브랜드 (100만원+)",
    },
    {
      item: "카시트",
      frugal: "기본형 (10~20만원)",
      average: "안전+편의 균형형 (20~50만원)",
      premium: "회전형·고급형 (50만원+)",
    },
    {
      item: "아기띠",
      frugal: "기본 기능형 (3~10만원)",
      average: "착용감 좋은 대중형 (10~25만원)",
      premium: "프리미엄 소재형 (30만원+)",
    },
    {
      item: "젖병·소독기",
      frugal: "최소 구성 (2~5만원)",
      average: "브랜드 세트 (5~15만원)",
      premium: "자동화·고급형 (20만원+)",
    },
    {
      item: "기저귀 (월)",
      frugal: "행사·가성비 브랜드 (3~5만원)",
      average: "대중 브랜드 (5~8만원)",
      premium: "프리미엄 라인 (8만원+)",
    },
    {
      item: "분유 (월, 혼합·완분)",
      frugal: "표준 제품 (3~6만원)",
      average: "인기 제품 (6~12만원)",
      premium: "프리미엄·특수 라인 (12만원+)",
    },
    {
      item: "의류",
      frugal: "선물+기본 최소 구매",
      average: "계절별 적정 구매",
      premium: "브랜드·외출복 비중 높음",
    },
    {
      item: "장난감·놀이매트",
      frugal: "최소 구성 (5~10만원)",
      average: "발달 단계별 구매 (15~30만원)",
      premium: "대형 매트·고급 교구 (30만원+)",
    },
  ],

  monthlyPhases: [
    {
      period: "0~1개월",
      mainCosts: "기저귀, 수유용품, 속싸개, 침구",
      note: "초기 준비비 비중 큼",
    },
    {
      period: "2~3개월",
      mainCosts: "소모품, 예방접종, 의류 교체",
      note: "월 고정비 패턴이 보이기 시작",
    },
    {
      period: "4~6개월",
      mainCosts: "장난감, 놀이매트, 외출용품",
      note: "발달 관련 소비 증가",
    },
    {
      period: "7~9개월",
      mainCosts: "이유식, 식기, 턱받이, 간식",
      note: "먹는 비용이 늘어나는 시기",
    },
    {
      period: "10~12개월",
      mainCosts: "활동용품, 신발, 추가 장난감",
      note: "활동량 증가로 품목 다양화",
    },
  ],

  subsidyRows: [
    {
      tier: "frugal",
      label: "가성비",
      totalCost: "약 350만원",
      subsidy: "−300만원",
      actual: "약 50만원",
    },
    {
      tier: "average",
      label: "평균",
      totalCost: "약 700만원",
      subsidy: "−300만원",
      actual: "약 400만원",
    },
    {
      tier: "premium",
      label: "프리미엄",
      totalCost: "약 1,200만원",
      subsidy: "−300만원",
      actual: "약 900만원",
    },
  ],

  savingTips: [
    { tip: "초반에 모든 용품을 한 번에 사지 않기 — 실제로 쓰는 시점에 맞춰 구매" },
    { tip: "유모차·카시트 같은 대형 용품은 사용 기간 대비 가성비 계산 후 결정" },
    { tip: "선물·중고·지인 물려받기 적극 활용 (의류, 바운서, 보행기 등)" },
    { tip: "기저귀·물티슈는 행사·묶음 구매로 월 소모품비 절감" },
    { tip: "의류는 계절과 성장 속도를 고려해 최소 구매 (금방 작아짐)" },
    { tip: "오래 쓰는 품목(카시트·유모차)과 소모품(기저귀·분유)을 구분해 예산 배분" },
  ],

  faq: [
    {
      q: "신생아부터 돌까지 평균적으로 얼마나 드나요?",
      a: "준비 방식에 따라 크게 다르지만, 가장 일반적인 평균 기준으로 1년 총 500만~900만원 수준입니다. 2026년 기준 부모급여·출산지원금 등을 반영하면 실부담은 200만~600만원 수준으로 낮아질 수 있습니다.",
    },
    {
      q: "완전모유수유면 비용이 많이 줄어드나요?",
      a: "분유값이 월 6만~12만원 절감됩니다. 단, 유축기·수유패드·보관팩 같은 모유수유 용품 비용이 초기에 추가됩니다. 1년 기준 분유 절감 효과는 60만~150만원 수준이지만, 다른 항목 선택에 따라 총비용 차이는 여전히 클 수 있습니다.",
    },
    {
      q: "유모차와 카시트는 꼭 비싼 걸 사야 하나요?",
      a: "카시트는 안전 관련 제품이라 기본 안전 인증을 갖춘 제품이 중요합니다. 고가일수록 편의성이 높아지지만, 안전 자체는 기본형도 충분합니다. 유모차는 외출 빈도와 이동 수단에 따라 다릅니다. 차량 위주 생활이라면 가벼운 보급형도 충분합니다.",
    },
    {
      q: "아기 병원비는 어느 정도 잡아야 하나요?",
      a: "일반 소아과 진료는 1회 5,000~2만원 수준입니다. 예방접종은 국가 무료 접종이 많아 큰 비용은 아니지만, 선택 접종(로타바이러스·폐렴구균·수두 등)을 포함하면 1년에 20만~60만원이 추가될 수 있습니다.",
    },
    {
      q: "지원금까지 반영하면 실제 부담은 얼마나 되나요?",
      a: "2026년 기준 부모급여(0세 100만원/월)와 출산지원금(바우처 포함)을 더하면 1년 총 지원 규모가 300만원 이상입니다. 가성비 준비라면 지원금 이후 실부담이 거의 없을 수 있고, 프리미엄 준비면 900만원 이상이 실부담으로 남는 구조입니다.",
    },
    {
      q: "첫째와 둘째 육아비는 차이가 크나요?",
      a: "초기 대형 용품(유모차·카시트·아기침대 등)을 이미 갖고 있다면 둘째는 초기 준비비가 크게 줄어듭니다. 소모품 비용은 비슷하게 유지됩니다. 체감 비용 차이는 초기 준비비 기준 30~50% 절감이 일반적입니다.",
    },
    {
      q: "꼭 새 제품으로 사야 하는 육아용품은 무엇인가요?",
      a: "카시트는 사고 이력·충격 흡수 상태 확인이 어렵기 때문에 신품 구매를 권장합니다. 속싸개·의류·젖병류는 위생 관리가 가능하면 중고도 무방합니다. 침구·기저귀 교환 패드는 청결 유지가 핵심이므로 신품을 권장합니다.",
    },
  ],

  affiliates: [
    {
      tag: "기저귀",
      title: "하기스 맥스드라이 기저귀",
      desc: "신생아~돌까지 가장 많이 소비되는 소모품. 행사가 자주 있어 묶음 구매 시 절약 효과가 큽니다.",
      url: "https://link.coupang.com/a/ej7JpC",
    },
    {
      tag: "분유",
      title: "남양 아이엠마더 분유",
      desc: "혼합·완분 가정에서 많이 선택하는 대중 브랜드. 월 소모량이 크므로 정기구독 할인을 활용하면 유리합니다.",
      url: "https://link.coupang.com/a/ej7L2B",
    },
    {
      tag: "놀이매트",
      title: "리베베 원형 놀이매트",
      desc: "4~6개월부터 필요해지는 필수 아이템. 두께와 소재를 꼼꼼히 비교하고 구매하면 오래 활용할 수 있습니다.",
      url: "https://link.coupang.com/a/ej7ODq",
    },
    {
      tag: "이유식",
      title: "아기 이유식 책 추천",
      desc: "7개월부터 시작하는 이유식 준비에 도움이 되는 가이드북. 직접 만들면 시판 대비 비용을 크게 줄일 수 있습니다.",
      url: "https://link.coupang.com/a/ej7NNZ",
    },
  ],

  relatedCalcs: [
    { label: "출산~2세 총지원금 계산기",  href: "/tools/birth-support-total/" },
    { label: "육아휴직 급여 계산기",       href: "/tools/parental-leave-pay/" },
    { label: "아기 기저귀 값 계산기",      href: "/tools/diaper-cost/" },
    { label: "아기 분유 값 계산기",        href: "/tools/formula-cost/" },
  ],
};
