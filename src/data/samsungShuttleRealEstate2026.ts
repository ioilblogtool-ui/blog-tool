export type SamsungShuttleBadge = "추정" | "참고" | "확인필요";

export interface SamsungShuttleCampus {
  name: string;
  location: string;
  business: string;
  shuttleHint: string;
}

export interface SamsungShuttleZone {
  id: string;
  name: string;
  areas: string[];
  targetCampus: string[];
  commuteLabel: string;
  commuteMin: number;
  jeonseEok: number;
  saleEok: number;
  pricePerPyeongManwon: number;
  note: string;
  badge: SamsungShuttleBadge;
}

export interface SamsungShuttleFaq {
  question: string;
  answer: string;
}

export const SAMSUNG_SHUTTLE_META = {
  slug: "samsung-shuttle-real-estate-2026",
  title: "삼성전자 셔틀버스 노선별 아파트 시세 정리 2026",
  description:
    "수원·기흥·화성·평택 캠퍼스별 삼성전자 셔틀권 아파트 전세·매매 시세와 출퇴근 후보 지역을 한눈에 정리합니다.",
  updatedAt: "2026년 1분기 기준",
  caution:
    "셔틀 정류장과 노선은 회사 내부 운영 정보에 따라 바뀔 수 있습니다. 이 페이지는 공개 채용 정보, 직장인 커뮤니티에서 반복 언급되는 권역, 국토부 실거래가 참고값을 묶은 추정 리포트입니다.",
};

export const SAMSUNG_SHUTTLE_CAMPUSES: SamsungShuttleCampus[] = [
  {
    name: "수원 삼성디지털시티",
    location: "경기 수원시 영통구",
    business: "DX 부문 본사·연구",
    shuttleHint: "강남·판교·분당·수원 시내 거주 수요가 함께 겹칩니다.",
  },
  {
    name: "기흥캠퍼스",
    location: "경기 용인시 기흥구",
    business: "DS 반도체 연구·제조",
    shuttleHint: "광교·수지·분당·강남에서 통근을 검토하는 수요가 많습니다.",
  },
  {
    name: "화성캠퍼스",
    location: "경기 화성시",
    business: "DS 파운드리·메모리",
    shuttleHint: "동탄, 수원, 서울 남부권 통근 수요가 나뉩니다.",
  },
  {
    name: "평택캠퍼스",
    location: "경기 평택시 고덕동 일대",
    business: "DS 메모리 생산 거점",
    shuttleHint: "고덕신도시와 동탄을 비교하는 실거주 수요가 큽니다.",
  },
];

export const SAMSUNG_SHUTTLE_ZONES: SamsungShuttleZone[] = [
  {
    id: "gangnam",
    name: "강남·서초권",
    areas: ["강남역", "양재", "선릉", "서초", "교대"],
    targetCampus: ["수원", "기흥", "화성", "평택"],
    commuteLabel: "60~120분",
    commuteMin: 60,
    jeonseEok: 8,
    saleEok: 25,
    pricePerPyeongManwon: 8000,
    note: "서울 생활권을 유지하려는 수요가 선택하는 권역입니다. 가격은 가장 높지만 복수 캠퍼스 이동 선택지가 넓습니다.",
    badge: "추정",
  },
  {
    id: "pangyo",
    name: "판교·분당권",
    areas: ["판교", "정자", "미금", "서현"],
    targetCampus: ["수원", "기흥"],
    commuteLabel: "40~50분",
    commuteMin: 40,
    jeonseEok: 6.5,
    saleEok: 16,
    pricePerPyeongManwon: 5000,
    note: "IT·판교 생활권과 삼성 통근을 같이 보려는 수요가 많습니다. 기흥·수원 접근성은 좋은 편입니다.",
    badge: "추정",
  },
  {
    id: "gwanggyo",
    name: "광교·수지권",
    areas: ["광교", "수지구청", "죽전", "상현"],
    targetCampus: ["수원", "기흥"],
    commuteLabel: "20~35분",
    commuteMin: 25,
    jeonseEok: 4.5,
    saleEok: 10,
    pricePerPyeongManwon: 3100,
    note: "수원·기흥 출퇴근 균형이 좋습니다. 강남권보다 매매 부담은 낮고 생활 인프라는 안정적입니다.",
    badge: "추정",
  },
  {
    id: "dongtan",
    name: "동탄권",
    areas: ["동탄1", "동탄2", "동탄역"],
    targetCampus: ["화성", "평택"],
    commuteLabel: "20~30분",
    commuteMin: 20,
    jeonseEok: 3.8,
    saleEok: 8,
    pricePerPyeongManwon: 2500,
    note: "화성·평택 캠퍼스 모두를 염두에 둘 때 실용적인 선택지입니다. GTX-A 이용 가능성이 장기 변수입니다.",
    badge: "추정",
  },
  {
    id: "suwon",
    name: "수원 시내권",
    areas: ["영통", "망포", "매탄", "권선"],
    targetCampus: ["수원", "기흥"],
    commuteLabel: "10~20분",
    commuteMin: 15,
    jeonseEok: 2.8,
    saleEok: 6,
    pricePerPyeongManwon: 1900,
    note: "수원 삼성디지털시티 직주근접성이 가장 강합니다. 전세 부담을 낮추려는 실거주자에게 유리합니다.",
    badge: "추정",
  },
  {
    id: "pyeongtaek",
    name: "평택·고덕권",
    areas: ["고덕신도시", "지제", "브레인시티"],
    targetCampus: ["평택"],
    commuteLabel: "10~20분",
    commuteMin: 15,
    jeonseEok: 2.2,
    saleEok: 4.5,
    pricePerPyeongManwon: 1400,
    note: "평택캠퍼스 직주근접에 가장 초점이 맞습니다. 가격 진입장벽은 낮지만 서울 접근성은 별도로 봐야 합니다.",
    badge: "추정",
  },
];

export const SAMSUNG_SHUTTLE_PREMIUMS = [
  {
    title: "셔틀권 프리미엄은 단독 요인이 아닙니다",
    body: "강남권은 셔틀보다 서울 핵심 입지가 가격을 주도합니다. 반대로 광교·동탄·고덕은 캠퍼스 접근성과 신도시 생활 인프라가 같이 반영되는 구조입니다.",
  },
  {
    title: "캠퍼스 확장 리스크를 같이 봐야 합니다",
    body: "평택 생산라인 확대처럼 근무지가 바뀌면 최적 거주지도 달라집니다. 현재 배치만 보고 매수하기보다 3~5년 이동 가능성을 함께 두는 편이 안전합니다.",
  },
  {
    title: "전세는 통근 시간, 매매는 환금성이 핵심입니다",
    body: "단기 거주는 전세 부담과 셔틀 접근성이 중요하지만, 매매는 학군·역세권·대단지 여부가 출퇴근보다 더 크게 작동할 수 있습니다.",
  },
];

export const SAMSUNG_SHUTTLE_FAQ: SamsungShuttleFaq[] = [
  {
    question: "삼성전자 셔틀버스 정류장은 어디서 확인하나요?",
    answer:
      "정확한 정류장과 노선은 사내 시스템에서 확인하는 것이 원칙입니다. 외부 공개 정보는 제한적이므로, 입사·전배 전에는 반드시 사내 안내와 현재 근무지 기준 노선을 다시 확인해야 합니다.",
  },
  {
    question: "평택 발령이면 동탄과 고덕 중 어디가 나을까요?",
    answer:
      "평택캠퍼스 출퇴근만 보면 고덕이 유리하고, 서울 접근성·생활권·향후 근무지 변경 가능성까지 보면 동탄이 후보가 됩니다. 전세라면 통근 시간을, 매매라면 환금성과 장기 생활권을 같이 보세요.",
  },
  {
    question: "셔틀 정류장 근처 아파트가 항상 더 비싼가요?",
    answer:
      "항상 그렇지는 않습니다. 강남·판교는 지역 자체 시세가 더 큰 요인이고, 광교·동탄·고덕은 캠퍼스 접근성이 일부 수요를 만들 수 있습니다. 학군, 역세권, 대단지 여부가 함께 작동합니다.",
  },
  {
    question: "외부인도 삼성전자 셔틀을 탈 수 있나요?",
    answer:
      "일반적으로 임직원 또는 승인된 인원만 이용할 수 있습니다. 출입증, 사원증, 사내 예약 방식 등은 사업장과 시점에 따라 달라질 수 있습니다.",
  },
  {
    question: "성과급으로 아파트 매수가 가능한지 어떻게 계산하나요?",
    answer:
      "성과급은 세후 수령액을 먼저 확인한 뒤, 보유 현금과 대출 가능액을 더해 매수 가능 범위를 봐야 합니다. 삼성전자 성과급 계산기와 내집마련 자금 계산기를 함께 쓰면 현실적인 예산을 잡기 쉽습니다.",
  },
  {
    question: "셔틀 노선이 바뀌면 어떻게 대응해야 하나요?",
    answer:
      "노선 변경은 캠퍼스 확장, 인력 배치, 교통 여건에 따라 발생할 수 있습니다. 매수 전에는 특정 정류장 하나보다 대중교통 대안, 자차 이동, 다른 캠퍼스 접근성까지 함께 확인하는 편이 좋습니다.",
  },
];

export const SAMSUNG_SHUTTLE_RELATED = [
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
  { href: "/reports/sk-hynix-shuttle-real-estate-2026/", label: "SK하이닉스 셔틀권 부동산 정리" },
];

