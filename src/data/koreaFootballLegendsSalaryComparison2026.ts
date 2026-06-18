export type SalarySourceBadge = "보도 기준" | "추정" | "확인 필요";
export type PlayerEra = "current" | "legend";
export type PlayerPosition = "GK" | "DF" | "MF" | "FW";

export interface LegendSalaryRecord {
  id: string;
  nameKo: string;
  nameEn: string;
  era: PlayerEra;
  position: PlayerPosition;
  peakPeriodLabel: string;
  peakClub: string;
  peakLeague: string;
  annualSalaryManMin: number;
  annualSalaryManMax: number;
  presentValueManMin: number;
  presentValueManMax: number;
  sourceBadge: SalarySourceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  careerSummary: string;
  highlights: string[];
  note?: string;
  isFeatured?: boolean;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export const KFLS_META = {
  slug: "korea-football-legends-salary-comparison-2026",
  title: "손흥민·김민재·이강인 연봉 vs 역대 레전드 연봉 비교",
  seoTitle: "손흥민 김민재 이강인 연봉 vs 박지성 차범근 안정환 연봉 비교 2026",
  seoDescription:
    "손흥민, 김민재, 이강인의 추정 연봉을 박지성, 차범근, 이영표, 안정환, 이천수, 기성용 등 역대 레전드의 전성기 연봉·현재가치 환산과 비교합니다.",
  description:
    "현재 대표팀 핵심 3인과 한국 축구 역대 레전드 6인의 연봉을 전성기 기준, 현재가치 환산 기준으로 비교한 리포트입니다.",
  updatedAt: "2026-06-12",
  dataNote:
    "연봉은 구단 공식 계약서가 아닌 언론 보도와 추정을 바탕으로 한 세전 단순 환산입니다. 1980~90년대 선수의 연봉은 보도 자체가 희소해 확인 필요로 표시했습니다. 현재가치 환산은 소비자물가지수 기준 단순 환산이며 실제 구매력과 차이가 있을 수 있습니다.",
};

export const KFLS_PLAYERS: LegendSalaryRecord[] = [
  {
    id: "son-heung-min",
    nameKo: "손흥민",
    nameEn: "Son Heung-min",
    era: "current",
    position: "FW",
    peakPeriodLabel: "2026 기준",
    peakClub: "LAFC",
    peakLeague: "MLS",
    annualSalaryManMin: 1540000,
    annualSalaryManMax: 1540000,
    presentValueManMin: 1540000,
    presentValueManMax: 1540000,
    sourceBadge: "보도 기준",
    sourceLabel: "2026 MLS 보수 보도 기준",
    sourceUrl: "https://www.theguardian.com/football/2026/may/12/mls-2026-salary-release-takeaways",
    careerSummary: "토트넘에서 통산 173골을 넣은 한국인 해외 진출 역대 최다 득점자이자 2022년 EPL 골든부트 공동 수상자",
    highlights: [
      "2021-22시즌 EPL 골든부트 공동 수상 (아시아 선수 최초)",
      "토트넘 통산 173골, 한국인 해외 진출 선수 역대 최다골",
      "토트넘 주장 역임 후 2026년 LAFC(MLS) 이적",
    ],
    note: "MLS 공개 보수 보도를 원화로 단순 환산한 값입니다.",
    isFeatured: true,
  },
  {
    id: "kim-min-jae",
    nameKo: "김민재",
    nameEn: "Kim Min-jae",
    era: "current",
    position: "DF",
    peakPeriodLabel: "2026 기준",
    peakClub: "바이에른 뮌헨",
    peakLeague: "분데스리가",
    annualSalaryManMin: 2227500,
    annualSalaryManMax: 2227500,
    presentValueManMin: 2227500,
    presentValueManMax: 2227500,
    sourceBadge: "보도 기준",
    sourceLabel: "독일 축구 매체 보도 기준",
    sourceUrl: "https://www.bavarianfootballworks.com/transfer-rumors/212242/bayern-munich-brown-manchester-city-united-real-madrid-fc-barcelona-arsenal-psg-chelsea-liverpool-world-cup",
    careerSummary: "나폴리의 세리에A 우승(2022-23)을 이끈 주전 센터백으로 한국 선수 최초 세리에A 베스트일레븐에 선정",
    highlights: [
      "나폴리 세리에A 우승(2022-23 시즌) 주전 센터백",
      "한국 선수 최초 세리에A 베스트일레븐 선정",
      "2023년 바이에른 뮌헨 이적, 분데스리가 주전 수비수",
    ],
    note: "보도된 샐러리 패키지 금액을 세전 기준으로 단순 환산했습니다.",
    isFeatured: true,
  },
  {
    id: "lee-kang-in",
    nameKo: "이강인",
    nameEn: "Lee Kang-in",
    era: "current",
    position: "MF",
    peakPeriodLabel: "2026 기준",
    peakClub: "파리 생제르맹",
    peakLeague: "리그1",
    annualSalaryManMin: 594000,
    annualSalaryManMax: 594000,
    presentValueManMin: 594000,
    presentValueManMax: 594000,
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB·언론 추정치",
    careerSummary: "발렌시아·마요르카를 거쳐 2023년 PSG로 이적, 2024-25시즌 UEFA 챔피언스리그 우승을 경험한 미드필더",
    highlights: [
      "발렌시아 유스 출신, 라리가에서 성장한 한국 선수",
      "2023년 PSG(리그1) 이적",
      "2024-25시즌 UEFA 챔피언스리그 우승 멤버",
    ],
    note: "구단 공식 공개값이 아니므로 추정값으로만 사용합니다.",
    isFeatured: true,
  },
  {
    id: "park-ji-sung",
    nameKo: "박지성",
    nameEn: "Park Ji-sung",
    era: "legend",
    position: "MF",
    peakPeriodLabel: "2009~2011",
    peakClub: "맨체스터 유나이티드",
    peakLeague: "프리미어리그",
    annualSalaryManMin: 435000,
    annualSalaryManMax: 522000,
    presentValueManMin: 652500,
    presentValueManMax: 783000,
    sourceBadge: "보도 기준",
    sourceLabel: "영국 스포츠지 보도 종합 (전성기 주급 기준 추정)",
    careerSummary: "맨유에서 프리미어리그 4회 우승과 UEFA 챔피언스리그 우승(2008)을 경험한 한국 축구 역대 최고 인기 레전드",
    highlights: [
      "맨체스터 유나이티드 소속 프리미어리그 4회 우승",
      "2008년 UEFA 챔피언스리그 우승",
      "2011년 UEFA 챔피언스리그 4강 바르셀로나전 결승골",
    ],
    note: "전성기(2009~2011) 주급 보도를 연봉으로 환산한 추정 범위입니다.",
    isFeatured: true,
  },
  {
    id: "cha-bum-kun",
    nameKo: "차범근",
    nameEn: "Cha Bum-kun",
    era: "legend",
    position: "FW",
    peakPeriodLabel: "1979~1989",
    peakClub: "프랑크푸르트·레버쿠젠",
    peakLeague: "분데스리가",
    annualSalaryManMin: 20000,
    annualSalaryManMax: 60000,
    presentValueManMin: 70000,
    presentValueManMax: 210000,
    sourceBadge: "확인 필요",
    sourceLabel: "1980년대 분데스리가 보수 관련 회고·보도 종합 (출처 희소)",
    careerSummary: "1979년 아시아 선수 최초로 분데스리가에 진출해 통산 121골을 넣은 분데스리가 아시아 선수 역대 최다 득점자",
    highlights: [
      "아시아 선수 최초 분데스리가 진출(1979년)",
      "분데스리가 통산 121골, 아시아 선수 역대 최다 기록",
      "UEFA컵 우승 2회 (1980 프랑크푸르트, 1988 레버쿠젠)",
    ],
    note: "1980년대 분데스리가 선수 연봉은 정확한 보도가 거의 남아있지 않아 매우 넓은 추정 범위로 표시했습니다.",
    isFeatured: true,
  },
  {
    id: "lee-young-pyo",
    nameKo: "이영표",
    nameEn: "Lee Young-pyo",
    era: "legend",
    position: "DF",
    peakPeriodLabel: "2005~2008",
    peakClub: "토트넘 홋스퍼",
    peakLeague: "프리미어리그",
    annualSalaryManMin: 174000,
    annualSalaryManMax: 226200,
    presentValueManMin: 295800,
    presentValueManMax: 384200,
    sourceBadge: "추정",
    sourceLabel: "영국 보도·샐러리 DB 종합 추정",
    careerSummary: "PSV 에인트호번에서 토트넘으로 이적해 2002 월드컵 4강 신화의 주역 중 한 명으로 활약한 왼쪽 풀백",
    highlights: [
      "2002 한일 월드컵 4강 멤버",
      "PSV 에인트호번에서 UEFA 챔피언스리그 출전",
      "2005년 토트넘 홋스퍼 이적, 프리미어리그 활약",
    ],
    note: "토트넘 시절 주급 추정치를 연봉으로 환산한 범위입니다.",
  },
  {
    id: "ahn-jung-hwan",
    nameKo: "안정환",
    nameEn: "Ahn Jung-hwan",
    era: "legend",
    position: "FW",
    peakPeriodLabel: "2000~2006",
    peakClub: "페루자·뒤스부르크",
    peakLeague: "세리에A·분데스리가",
    annualSalaryManMin: 148500,
    annualSalaryManMax: 222750,
    presentValueManMin: 282150,
    presentValueManMax: 423225,
    sourceBadge: "추정",
    sourceLabel: "이탈리아·독일 현지 보도 종합 추정",
    careerSummary: "2002 월드컵 이탈리아전 골든골로 16강 진출을 이끈 뒤 세리에A·분데스리가에서 활약한 공격수",
    highlights: [
      "2002 한일 월드컵 16강 이탈리아전 골든골",
      "세리에A 페루자·베로나에서 활약",
      "독일 분데스리가 뒤스부르크 진출",
    ],
    note: "세리에A·분데스리가 활동 시기 보도 기준 추정 연봉입니다.",
  },
  {
    id: "lee-cheon-soo",
    nameKo: "이천수",
    nameEn: "Lee Cheon-soo",
    era: "legend",
    position: "MF",
    peakPeriodLabel: "2005~2006",
    peakClub: "레알 소시에다드",
    peakLeague: "라리가",
    annualSalaryManMin: 103950,
    annualSalaryManMax: 148500,
    presentValueManMin: 176800,
    presentValueManMax: 253300,
    sourceBadge: "확인 필요",
    sourceLabel: "스페인 현지 보도 기반 추정 (출전 시간 대비 보수 차이 큼)",
    careerSummary: "2002 월드컵에서 활약 후 라리가 레알 소시에다드에 진출했던 공격형 미드필더, 이후 K리그로 복귀",
    highlights: [
      "2002 한일 월드컵 폴란드전 골",
      "2005년 라리가 레알 소시에다드 이적",
      "K리그 복귀 후 인천 유나이티드 등에서 활약",
    ],
    note: "라리가 진출 초기 계약 보도를 기준으로 한 추정 범위입니다.",
  },
  {
    id: "ki-sung-yueng",
    nameKo: "기성용",
    nameEn: "Ki Sung-yueng",
    era: "legend",
    position: "MF",
    peakPeriodLabel: "2014~2018",
    peakClub: "스완지시티·뉴캐슬",
    peakLeague: "프리미어리그",
    annualSalaryManMin: 313200,
    annualSalaryManMax: 348000,
    presentValueManMin: 406900,
    presentValueManMax: 452400,
    sourceBadge: "추정",
    sourceLabel: "영국 보도·샐러리 DB 종합 추정",
    careerSummary: "셀틱을 거쳐 스완지시티에서 프리미어리그 주전 미드필더로 자리 잡은, 손흥민 이전 한국인 EPL 주전 자원",
    highlights: [
      "스완지시티·뉴캐슬 등에서 프리미어리그 주전 미드필더",
      "2018 자카르타-팔렘방 아시안게임 금메달 주장",
      "국가대표 최다 출전 기록 보유 선수 중 한 명",
    ],
    note: "스완지시티 전성기 주급 보도를 연봉으로 환산한 범위입니다.",
  },
];

export const KFLS_FAQ: PageFaqItem[] = [
  {
    question: "손흥민·김민재·이강인 연봉은 공식 자료인가요?",
    answer:
      "아니요. 구단 공식 계약서가 아니라 언론 보도와 샐러리 DB를 바탕으로 한 추정값입니다. 2026 대한민국 월드컵 대표팀 연봉 순위 리포트와 동일한 출처 기준을 사용해 일관성을 유지했습니다.",
  },
  {
    question: "차범근 선수의 연봉은 왜 확인 필요로 표시되나요?",
    answer:
      "1980년대 분데스리가 선수 연봉은 당시 보도 자체가 거의 남아있지 않습니다. 정확한 금액을 특정하기 어려워 매우 넓은 추정 범위로 표시했고, 확인 필요 배지를 붙였습니다.",
  },
  {
    question: "현재가치 환산은 어떻게 계산하나요?",
    answer:
      "선수의 전성기 연도를 기준으로 소비자물가지수 변동을 참고한 단순 배수를 곱해 계산했습니다. 실제 구매력, 당시 환율, 리그 보수 구조의 차이는 모두 반영하지 못하는 단순 참고용 수치입니다.",
  },
  {
    question: "지금 선수와 레전드 선수 중 누가 더 많이 받았나요?",
    answer:
      "이 리포트는 선수 간 우열을 가리기 위한 자료가 아닙니다. 시대, 리그 수준, 환율, 보수 공개 관행이 모두 달라 직접 비교에는 한계가 있으니 참고용으로만 봐주세요.",
  },
  {
    question: "기성용 선수도 포함되나요?",
    answer:
      "네. 셀틱·스완지시티·뉴캐슬 시절 전성기 기준 추정 연봉을 포함했습니다. 손흥민 이전 한국인 프리미어리그 주전 미드필더로서 검색 수요가 많은 선수입니다.",
  },
  {
    question: "K리그 복귀 이후 연봉도 반영되나요?",
    answer:
      "이 리포트는 해외 진출 전성기 기준 연봉을 우선 다룹니다. K리그 복귀 이후 연봉은 별도로 다루지 않으며, K리그 선수 연봉은 K리그1 구단 연봉 비교 리포트를 참고해 주세요.",
  },
  {
    question: "손흥민·김민재·이강인 연봉은 다른 리포트와 다른가요?",
    answer:
      "2026 대한민국 월드컵 대표팀 연봉 순위 리포트와 동일한 출처 기준의 추정값을 사용해 두 리포트 간 숫자가 일치하도록 했습니다.",
  },
];

export const KFLS_RELATED_LINKS = [
  { href: "/reports/son-heung-min-lafc-salary-net-worth-2026/", label: "손흥민 연봉 2026｜LAFC 주급·세후 실수령액·재산 추정" },
  { href: "/reports/lee-kang-in-psg-salary-2026/", label: "이강인 연봉 2026｜PSG 주급·세후 실수령액" },
  { href: "/reports/korea-worldcup-squad-salary-2026/", label: "2026 대한민국 월드컵 대표팀 연봉 순위" },
  { href: "/reports/kleague-salary-comparison-2026/", label: "K리그1 구단 연봉 비교 2026" },
  { href: "/reports/salary-asset-2016-vs-2026/", label: "2016 vs 2026 연봉·자산 비교" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기" },
];
