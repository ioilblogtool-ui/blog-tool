export interface SeoulApartmentDistrict {
  district: string;
  group: string;
  price84: number;
  average: number;
  median: number;
  pyeongPrice: number;
  yoy: number;
  trades: number;
  jeonseRatio: number;
  newAverage: number;
  oldAverage: number;
  note: string;
}

export const seoulApartmentMarketSummary = {
  updatedAt: "2026-05-10",
  basis: "2024~2026년 공개 실거래 구조를 바탕으로 구별 비교가 가능하도록 재구성한 표본·추정 리포트",
  averagePrice: 1260000000,
  medianPrice: 1040000000,
  averagePrice84: 1370000000,
  averagePyeongPrice: 53800000,
  yoy: 5.4,
  totalTrades: 8920,
  averageJeonseRatio: 60,
};

export const seoulApartmentDistricts: SeoulApartmentDistrict[] = [
  { district: "강남구", group: "강남3구", price84: 3200000000, average: 2850000000, median: 2600000000, pyeongPrice: 126000000, yoy: 8.2, trades: 420, jeonseRatio: 48, newAverage: 3650000000, oldAverage: 2700000000, note: "대치·개포·압구정 등 단지별 편차가 매우 큼" },
  { district: "서초구", group: "강남3구", price84: 3000000000, average: 2700000000, median: 2520000000, pyeongPrice: 118000000, yoy: 7.4, trades: 360, jeonseRatio: 50, newAverage: 3400000000, oldAverage: 2580000000, note: "반포·잠원 신축 거래가 평균을 끌어올림" },
  { district: "송파구", group: "강남3구", price84: 2300000000, average: 2050000000, median: 1900000000, pyeongPrice: 90000000, yoy: 6.1, trades: 520, jeonseRatio: 55, newAverage: 2700000000, oldAverage: 1950000000, note: "잠실·가락·문정의 가격대가 다르게 움직임" },
  { district: "용산구", group: "마용성", price84: 2450000000, average: 2180000000, median: 1980000000, pyeongPrice: 96000000, yoy: 9.1, trades: 180, jeonseRatio: 47, newAverage: 3100000000, oldAverage: 2050000000, note: "한강변·정비사업 기대가 가격 변동성을 키움" },
  { district: "성동구", group: "마용성", price84: 2050000000, average: 1800000000, median: 1700000000, pyeongPrice: 80000000, yoy: 8.8, trades: 310, jeonseRatio: 53, newAverage: 2450000000, oldAverage: 1620000000, note: "성수·옥수·금호 권역 간 차이가 큼" },
  { district: "마포구", group: "마용성", price84: 1850000000, average: 1600000000, median: 1500000000, pyeongPrice: 72000000, yoy: 5.3, trades: 290, jeonseRatio: 56, newAverage: 2100000000, oldAverage: 1480000000, note: "공덕·아현·상암 생활권을 분리해 봐야 함" },
  { district: "양천구", group: "목동·서남", price84: 1700000000, average: 1480000000, median: 1370000000, pyeongPrice: 67000000, yoy: 5.8, trades: 260, jeonseRatio: 58, newAverage: 1980000000, oldAverage: 1420000000, note: "목동 학군과 재건축 기대가 별도 프리미엄을 형성" },
  { district: "광진구", group: "동부권", price84: 1620000000, average: 1400000000, median: 1280000000, pyeongPrice: 64000000, yoy: 5.6, trades: 210, jeonseRatio: 57, newAverage: 1840000000, oldAverage: 1320000000, note: "한강 접근성과 지하철 생활권에 따라 가격 차이" },
  { district: "동작구", group: "준핵심권", price84: 1500000000, average: 1320000000, median: 1230000000, pyeongPrice: 59000000, yoy: 5.4, trades: 300, jeonseRatio: 60, newAverage: 1720000000, oldAverage: 1240000000, note: "흑석·상도·사당을 같은 평균으로 보면 왜곡 가능" },
  { district: "종로구", group: "도심권", price84: 1450000000, average: 1280000000, median: 1160000000, pyeongPrice: 57000000, yoy: 4.1, trades: 120, jeonseRatio: 55, newAverage: 1620000000, oldAverage: 1180000000, note: "거래량이 적어 평균 변동성이 큼" },
  { district: "중구", group: "도심권", price84: 1400000000, average: 1220000000, median: 1120000000, pyeongPrice: 55000000, yoy: 4.4, trades: 130, jeonseRatio: 56, newAverage: 1580000000, oldAverage: 1130000000, note: "도심 직주근접 수요와 표본 부족을 함께 봐야 함" },
  { district: "영등포구", group: "서남권", price84: 1380000000, average: 1200000000, median: 1120000000, pyeongPrice: 54000000, yoy: 4.9, trades: 340, jeonseRatio: 61, newAverage: 1600000000, oldAverage: 1130000000, note: "여의도·당산·문래·신길 가격대가 분리됨" },
  { district: "강동구", group: "동남권", price84: 1320000000, average: 1150000000, median: 1080000000, pyeongPrice: 52000000, yoy: 4.7, trades: 430, jeonseRatio: 63, newAverage: 1500000000, oldAverage: 1080000000, note: "대단지 입주와 전세가율을 함께 확인" },
  { district: "서대문구", group: "서북권", price84: 1180000000, average: 1040000000, median: 970000000, pyeongPrice: 46000000, yoy: 4.2, trades: 250, jeonseRatio: 62, newAverage: 1350000000, oldAverage: 970000000, note: "도심 접근성은 좋지만 단지 연식 차이가 큼" },
  { district: "동대문구", group: "동북권", price84: 1120000000, average: 980000000, median: 910000000, pyeongPrice: 44000000, yoy: 4.0, trades: 320, jeonseRatio: 64, newAverage: 1300000000, oldAverage: 910000000, note: "청량리 주변 신축과 구축 평균을 분리해야 함" },
  { district: "성북구", group: "동북권", price84: 1050000000, average: 910000000, median: 850000000, pyeongPrice: 41000000, yoy: 3.7, trades: 360, jeonseRatio: 65, newAverage: 1180000000, oldAverage: 850000000, note: "대단지 구축과 역세권 신축의 가격차가 큼" },
  { district: "강서구", group: "서부권", price84: 1020000000, average: 900000000, median: 840000000, pyeongPrice: 40000000, yoy: 3.5, trades: 520, jeonseRatio: 66, newAverage: 1160000000, oldAverage: 840000000, note: "마곡 접근성과 외곽 생활권을 나눠 봐야 함" },
  { district: "은평구", group: "서북권", price84: 980000000, average: 850000000, median: 800000000, pyeongPrice: 38500000, yoy: 3.2, trades: 330, jeonseRatio: 66, newAverage: 1120000000, oldAverage: 790000000, note: "은평뉴타운과 구도심 가격 차이가 큼" },
  { district: "관악구", group: "금관구", price84: 930000000, average: 820000000, median: 760000000, pyeongPrice: 36500000, yoy: 3.1, trades: 280, jeonseRatio: 67, newAverage: 1040000000, oldAverage: 760000000, note: "역세권 여부가 실거주 편의와 가격을 좌우" },
  { district: "구로구", group: "금관구", price84: 900000000, average: 790000000, median: 730000000, pyeongPrice: 35500000, yoy: 2.9, trades: 390, jeonseRatio: 68, newAverage: 1010000000, oldAverage: 730000000, note: "신도림·구로·개봉 생활권을 분리해 확인" },
  { district: "중랑구", group: "동북권", price84: 880000000, average: 760000000, median: 710000000, pyeongPrice: 34500000, yoy: 2.8, trades: 340, jeonseRatio: 69, newAverage: 980000000, oldAverage: 700000000, note: "가격 접근성은 좋지만 단지별 환금성 확인 필요" },
  { district: "노원구", group: "노도강", price84: 820000000, average: 700000000, median: 660000000, pyeongPrice: 32200000, yoy: 2.1, trades: 610, jeonseRatio: 68, newAverage: 950000000, oldAverage: 660000000, note: "거래량은 많지만 구축 비중과 재건축 이슈 확인" },
  { district: "금천구", group: "금관구", price84: 760000000, average: 690000000, median: 640000000, pyeongPrice: 29800000, yoy: 3.1, trades: 240, jeonseRatio: 66, newAverage: 900000000, oldAverage: 635000000, note: "가산·독산 직주근접 수요와 연식 차이 확인" },
  { district: "강북구", group: "노도강", price84: 720000000, average: 640000000, median: 600000000, pyeongPrice: 28200000, yoy: 2.5, trades: 260, jeonseRatio: 69, newAverage: 820000000, oldAverage: 595000000, note: "저가 접근성은 있으나 거래량과 입지를 좁혀 봐야 함" },
  { district: "도봉구", group: "노도강", price84: 690000000, average: 610000000, median: 570000000, pyeongPrice: 27000000, yoy: 1.8, trades: 350, jeonseRatio: 70, newAverage: 790000000, oldAverage: 560000000, note: "서울 내 저가권이지만 전세가율과 구축 관리상태 중요" },
];

export const seoulApartmentBudgetBands = [
  { budget: "6억 이하", options: "도봉·강북·금천 일부 소형 또는 구축", strategy: "실거주 안정성과 관리상태를 최우선으로 확인", caution: "84㎡는 선택지가 좁고 대출·수리비 변수가 큼" },
  { budget: "6억~9억", options: "노원·도봉·강북·금천·중랑·구로 59㎡ 또는 구축 84㎡", strategy: "역세권, 대단지, 거래량이 있는 생활권부터 좁히기", caution: "전세가율이 높으면 하락장 리스크를 더 보수적으로 봐야 함" },
  { budget: "9억~12억", options: "강서·은평·성북·동대문·서대문 일부 59~84㎡", strategy: "실거주 편의와 환금성의 균형을 비교", caution: "동일 구 안에서도 신축과 구축 가격 차이가 큼" },
  { budget: "12억~15억", options: "영등포·강동·동작·광진 일부, 마용성 소형", strategy: "학군, 직주근접, 신축 프리미엄을 분리해 계산", caution: "고점 거래 1건이 평균을 끌어올렸는지 확인" },
  { budget: "15억 이상", options: "마용성 84㎡ 일부, 강남3구 소형·준신축", strategy: "장기 보유와 세금·대출 규제를 함께 검토", caution: "취득세, 보유세, 대출 규제 체감액이 커짐" },
];

export const seoulApartmentGroupDescriptions = [
  { group: "강남3구", districts: "강남·서초·송파", description: "서울 고가 주거 핵심권으로 가격 방어력은 강하지만 진입 예산과 세금 부담이 큽니다." },
  { group: "마용성", districts: "마포·용산·성동", description: "도심 접근성, 한강변, 신축 선호가 겹치며 단지별 프리미엄 차이가 큽니다." },
  { group: "노도강", districts: "노원·도봉·강북", description: "실수요 접근권이지만 구축 비중, 재건축 기대, 전세가율을 함께 확인해야 합니다." },
  { group: "금관구", districts: "금천·관악·구로", description: "서남권 가격 접근성이 장점이며 역세권과 직주근접 여부가 중요합니다." },
  { group: "서북·동북권", districts: "은평·서대문·성북·동대문·중랑", description: "예산과 도심 접근성을 함께 보는 실수요자가 많이 비교하는 구간입니다." },
];

export const seoulApartmentTimeline = [
  { period: "2024 상반기", flow: "거래 회복 초기", detail: "금리 부담이 남아 있었지만 핵심지 선호가 먼저 회복되는 구간" },
  { period: "2024 하반기", flow: "구별 차별화 확대", detail: "강남권·마용성·대단지 위주로 가격 회복 체감이 커짐" },
  { period: "2025 상반기", flow: "국민평형 관심 재확대", detail: "84㎡ 기준 가격과 전세가율을 함께 보는 수요 증가" },
  { period: "2025 하반기", flow: "외곽 접근권 재평가", detail: "9억 이하 예산에서 노도강·금관구·서북권 비교가 늘어남" },
  { period: "2026 상반기", flow: "가격보다 조건 비교", detail: "구 평균보다 단지 연식, 역세권, 대출 가능액이 판단의 중심" },
];

export const seoulApartmentLookupSteps = [
  "국토교통부 실거래가 공개시스템 또는 서울 열린데이터광장에 접속합니다.",
  "아파트, 서울특별시, 자치구, 법정동 또는 단지명을 선택합니다.",
  "계약 연월을 최근 3~6개월과 1년 단위로 나눠 조회합니다.",
  "전용면적, 층, 건축년도, 거래금액, 해제 여부를 함께 확인합니다.",
  "같은 단지의 매매와 전세를 비교해 전세가율과 갭 리스크를 봅니다.",
];

export const seoulApartmentSources = [
  {
    label: "국토교통부 실거래가 공개시스템",
    href: "https://rt.molit.go.kr/",
    basis: "아파트 매매·전월세 실거래 조회",
  },
  {
    label: "공공데이터포털 국토교통부 아파트 매매 실거래가 자료",
    href: "https://www.data.go.kr/data/15126469/openapi.do",
    basis: "법정동 코드와 계약년월 기준 아파트 매매 신고정보 API",
  },
  {
    label: "서울 열린데이터광장 서울시 부동산 실거래가 정보",
    href: "https://data.seoul.go.kr/dataList/OA-21275/S/1/datasetView.do",
    basis: "자치구, 법정동, 신고년도, 건물면적, 물건금액 등 서울 실거래 정보",
  },
];

export const seoulApartmentFaq = [
  { question: "84㎡ 환산가는 무엇인가요?", answer: "거래금액을 전용면적으로 나눈 뒤 84㎡ 기준으로 환산한 비교용 가격입니다. 실제 같은 구 안에서도 층, 동, 준공연도, 단지 규모에 따라 가격은 크게 달라질 수 있습니다." },
  { question: "평균 실거래가만 보면 되나요?", answer: "아닙니다. 평균값은 고가 단지나 소수 거래에 흔들릴 수 있으므로 중앙값, 거래량, 84㎡ 환산가, 대표 단지 거래를 함께 봐야 합니다." },
  { question: "전세가율이 높으면 좋은 지역인가요?", answer: "전세 수요가 강하다는 신호일 수 있지만, 매매가 하락 시 갭 리스크가 커질 수도 있습니다. 실거주자는 전세가율과 함께 대출, 입주 물량, 노후도까지 확인해야 합니다." },
  { question: "신축 프리미엄은 어떻게 해석해야 하나요?", answer: "신축 평균가가 구축 평균가보다 얼마나 높은지를 보는 지표입니다. 30% 이상이면 신축 선호가 강한 구간으로 볼 수 있지만, 표본 거래가 적으면 과장될 수 있습니다." },
  { question: "이 리포트의 가격은 공식 시세인가요?", answer: "아닙니다. 공식 실거래 원자료를 사용자가 해석하기 쉽게 재구성한 표본·추정 리포트입니다. 실제 의사결정 전에는 국토교통부 실거래가 공개시스템에서 최신 거래를 다시 확인해야 합니다." },
  { question: "이 리포트가 매수 추천인가요?", answer: "아닙니다. 특정 지역이나 단지 매수를 권유하지 않습니다. 가격 구조, 예산 구간, 리스크를 비교하기 위한 일반 정보입니다." },
];
