// ============================================================
// localElectionGovernor2026.ts
// 2026 지방선거 시도지사 당선자 데이터
// 기준: 2026.06.04 14:00 개표율 99.92%
// TODO 주석 = 선관위 최종 확정 후 업데이트 필요 항목
// ============================================================

export type Party = "더불어민주당" | "국민의힘" | "무소속" | "기타";
export type ResultBadge = "확정" | "확정대기" | "초박빙";
export type PledgeCategory =
  | "경제·일자리"
  | "교통·인프라"
  | "주거·도시"
  | "교육·청년"
  | "복지·의료"
  | "환경·에너지"
  | "농업·수산"
  | "행정·자치"
  | "기타";

export interface GovernorCandidate {
  name: string;
  party: Party;
  voteShare: number;   // 0이면 확정대기
  badge: ResultBadge;
}

export interface GovernorPledge {
  category: PledgeCategory;
  title: string;
  description: string;
  source: "선관위공약마당" | "선거공보" | "참고";
}

export interface GovernorElected {
  regionId: string;
  regionName: string;       // 영문 (SVG id용)
  regionNameKo: string;     // 한글 지역명
  elected: GovernorCandidate;
  runner: GovernorCandidate | null;
  previousParty: Party;     // 2022 당선 정당
  isPartyFlip: boolean;     // 정당 교체 여부
  career: string[];         // 이력 (최근 → 과거)
  pledges: GovernorPledge[];
  dataAsOf: string;
  sources: { label: string; url: string }[];
}

export interface GovernorPageMeta {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalRegions: number;
  demCount: number;
  pppCount: number;
  note: string;
}

// ─── 메타 ─────────────────────────────────────────────────
export const GOVERNOR_META: GovernorPageMeta = {
  electionName: "제9회 전국동시지방선거",
  electionDate: "2026-06-03",
  dataAsOf: "2026-06-04 14:00 개표율 99.92% 기준",   // TODO: 최종 확정 시 "선관위 최종 확정" 으로 변경
  totalRegions: 16,
  demCount: 12,
  pppCount: 4,
  note: "광주·전남은 2026년 7월 1일 전남광주통합특별시 출범에 따라 단일 광역단체장으로 통합 선거 실시",
};

// ─── 당선자 데이터 ────────────────────────────────────────
export const GOVERNORS: GovernorElected[] = [
  // ── 1. 서울 ──────────────────────────────────────────────
  {
    regionId: "seoul",
    regionName: "Seoul",
    regionNameKo: "서울",
    elected: {
      name: "오세훈",
      party: "국민의힘",
      voteShare: 48.77,
      badge: "초박빙",
    },
    runner: {
      name: "정원오",
      party: "더불어민주당",
      voteShare: 48.51,
      badge: "확정",
    },
    previousParty: "국민의힘",
    isPartyFlip: false,
    career: [
      "서울시장 재선 (2021~2026)",
      "서울시장 1기 (2006~2011)",
      "국회의원 서울 마포구을 (2004~2006)",
      "서울시의회 의원 (1995~1998)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "교통·인프라", title: "GTX 연장·도심 교통 개선", description: "GTX-A·B·C 서울 구간 완공 및 도심 교통망 확충", source: "참고" },
      { category: "주거·도시",   title: "재건축·재개발 규제 완화",  description: "노후 주거지 정비 사업 신속 추진, 서울 주택 공급 확대", source: "참고" },
      { category: "경제·일자리", title: "서울 글로벌 비즈니스 허브", description: "동대문·잠실·여의도 국제 업무 지구 조성", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [
      { label: "선관위 당선인 정보", url: "https://info.nec.go.kr" },
    ],
  },

  // ── 2. 부산 ──────────────────────────────────────────────
  {
    regionId: "busan",
    regionName: "Busan",
    regionNameKo: "부산",
    elected: {
      name: "전재수",
      party: "더불어민주당",
      voteShare: 50.52,
      badge: "확정",
    },
    runner: {
      name: "박형준",
      party: "국민의힘",
      voteShare: 47.90,
      badge: "확정",
    },
    previousParty: "국민의힘",
    isPartyFlip: true,
    career: [
      "국회의원 부산 북구·강서구갑 및 북구갑",
      "국회 문화체육관광위원회 위원장",
      "청와대 제2부속실장",
      "부산 지역 정무·의정 활동",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "부산 글로벌 허브도시 조성", description: "북항 재개발·해양 산업 클러스터 육성", source: "참고" },
      { category: "교통·인프라", title: "부산 교통망 현대화",          description: "도시철도 연장·스마트 교통 시스템 구축", source: "참고" },
      { category: "교육·청년",   title: "청년 인구 유입 정책",          description: "청년 일자리·주거 지원으로 정착 유도", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 3. 대구 ──────────────────────────────────────────────
  {
    regionId: "daegu",
    regionName: "Daegu",
    regionNameKo: "대구",
    elected: {
      name: "추경호",
      party: "국민의힘",
      voteShare: 53.92,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "국민의힘",
    isPartyFlip: false,
    career: [
      "국회의원 대구 달성군 (2020~2026)",
      "기획재정부 장관 (2022~2023)",
      "국민의힘 원내대표 (2024~2025)",
      "기획재정부 제1차관 (2014~2016)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "대구 첨단산업 유치",      description: "반도체·모빌리티 산업 집적지 조성", source: "참고" },
      { category: "교통·인프라", title: "대구 광역교통망 확충",    description: "대구~수도권 KTX·고속도로 연결 강화", source: "참고" },
      { category: "교육·청년",   title: "청년 인구 대구 정착 지원", description: "청년 창업·주거 원스톱 지원", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 4. 인천 ──────────────────────────────────────────────
  {
    regionId: "incheon",
    regionName: "Incheon",
    regionNameKo: "인천",
    elected: {
      name: "박찬대",
      party: "더불어민주당",
      voteShare: 52.84,
      badge: "확정",
    },
    runner: {
      name: "유정복",
      party: "국민의힘",
      voteShare: 0,   // TODO: 선관위 확정 후 업데이트
      badge: "확정대기",
    },
    previousParty: "국민의힘",
    isPartyFlip: true,
    career: [
      "국회의원 인천 연수구을 (2020~2026)",
      "더불어민주당 대표 (2025~2026)",
      "더불어민주당 원내대표 (2024~2025)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "교통·인프라", title: "인천 GTX·지하철 확충",       description: "수도권 광역교통망 인천 연결 강화", source: "참고" },
      { category: "경제·일자리", title: "인천 공항·항만 경제권 발전", description: "인천공항 주변 경제자유구역 활성화", source: "참고" },
      { category: "주거·도시",   title: "인천 주거환경 개선",          description: "구도심 재개발 및 신도시 인프라 확충", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 5. 광주·전남 ─────────────────────────────────────────
  {
    regionId: "gwangju_jeonnam",
    regionName: "Gwangju-Jeonnam",
    regionNameKo: "광주·전남",
    elected: {
      name: "민형배",
      party: "더불어민주당",
      voteShare: 79.02,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "더불어민주당",
    isPartyFlip: false,
    career: [
      "국회의원 광주 광산구을 (2020~2026)",
      "광주 광산구청장 (2010~2018)",
      "더불어민주당 최고위원",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "행정·자치",   title: "광주·전남 통합특별시 조성",  description: "전남광주통합특별시 출범 안착 및 행정 통합 완성", source: "참고" },
      { category: "경제·일자리", title: "AI·에너지 산업 유치",        description: "AI 집적단지·해상풍력·태양광 산업 광주전남 집중 유치", source: "참고" },
      { category: "복지·의료",   title: "농어촌 복지 강화",           description: "전남 농어촌 주민 의료·교통·교육 서비스 향상", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 6. 대전 ──────────────────────────────────────────────
  {
    regionId: "daejeon",
    regionName: "Daejeon",
    regionNameKo: "대전",
    elected: {
      name: "허태정",
      party: "더불어민주당",
      voteShare: 53.49,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "더불어민주당",
    isPartyFlip: false,
    career: [
      "대전시장 (2018~2022)",
      "대전 유성구청장 (2010~2018)",
      "국회의원 대전 유성구갑 (2004~2008)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "대덕연구개발특구 고도화",    description: "대덕특구 연구 성과 사업화 및 첨단 바이오·AI 융합", source: "참고" },
      { category: "교통·인프라", title: "대전 도시철도 2호선 완공",   description: "트램 2호선 조기 완공 및 대전 외곽 연장", source: "참고" },
      { category: "교육·청년",   title: "청년 창업·일자리 확대",      description: "과학기술 특화 스타트업 지원 강화", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 7. 울산 ──────────────────────────────────────────────
  {
    regionId: "ulsan",
    regionName: "Ulsan",
    regionNameKo: "울산",
    elected: {
      name: "김상욱",
      party: "더불어민주당",
      voteShare: 48.73,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "국민의힘",
    isPartyFlip: true,
    career: [
      "국회의원 울산 중구 (2020~2026)",
      // TODO: 추가 이력 확인 필요
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "환경·에너지", title: "울산 수소 경제 도시 조성",    description: "수소 생산·유통 거점 울산 육성", source: "참고" },
      { category: "경제·일자리", title: "산업 구조 전환 지원",          description: "자동차·석유화학 → 미래 친환경 산업 전환", source: "참고" },
      { category: "복지·의료",   title: "노동자·시민 복지 강화",        description: "산업재해 예방 및 시민 공공의료 접근성 향상", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 8. 세종 ──────────────────────────────────────────────
  {
    regionId: "sejong",
    regionName: "Sejong",
    regionNameKo: "세종",
    elected: {
      name: "조상호",
      party: "더불어민주당",
      voteShare: 61.04,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "더불어민주당",
    isPartyFlip: false,
    career: [
      // TODO: 이력 상세 확인 필요
      "더불어민주당 세종시 정치인",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "행정·자치",   title: "행정수도 세종 완성",          description: "국회·주요 기관 세종 이전 완성 촉구", source: "참고" },
      { category: "교통·인프라", title: "세종 광역교통망 구축",        description: "대전·청주 연결 BRT·철도망 확충", source: "참고" },
      { category: "교육·청년",   title: "자족 교육도시 조성",          description: "고교·대학 유치로 교육 자족 기능 강화", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 9. 경기 ──────────────────────────────────────────────
  {
    regionId: "gyeonggi",
    regionName: "Gyeonggi",
    regionNameKo: "경기",
    elected: {
      name: "추미애",
      party: "더불어민주당",
      voteShare: 55.04,
      badge: "확정",
    },
    runner: {
      name: "양향자",
      party: "국민의힘",
      voteShare: 39.37,
      badge: "확정",
    },
    previousParty: "국민의힘",
    isPartyFlip: true,
    career: [
      "법무부 장관 (2020~2021)",
      "더불어민주당 대표 (2016~2018)",
      "국회의원 7선 (1995~2020)",
      "판사 출신",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "교통·인프라", title: "GTX 경기 전역 연결",   description: "GTX A·B·C·D 경기 전역 연결 완성", source: "참고" },
      { category: "주거·도시",   title: "경기 주거비 부담 완화", description: "공공주택 확대 및 전·월세 안정 대책", source: "참고" },
      { category: "교육·청년",   title: "청년 기본소득 확대",    description: "청년기본소득 대상·금액 확대", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 10. 강원 ─────────────────────────────────────────────
  {
    regionId: "gangwon",
    regionName: "Gangwon",
    regionNameKo: "강원",
    elected: {
      name: "우상호",
      party: "더불어민주당",
      voteShare: 51.81,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "국민의힘",
    isPartyFlip: true,
    career: [
      "국회의원 서울 서대문구갑 (2008~2026)",
      "더불어민주당 원내대표 (2016~2017)",
      "더불어민주당 비상대책위원장 (2022)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "강원 관광·레저 산업 육성",  description: "평창 올림픽 시설 활용·4계절 관광 활성화", source: "참고" },
      { category: "교통·인프라", title: "서울~강원 고속 연결 강화",  description: "동서고속철도·제2경춘국도 완공 추진", source: "참고" },
      { category: "환경·에너지", title: "강원 탄소중립 선도",         description: "청정 자연 기반 그린에너지 산업 구축", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 11. 충북 ─────────────────────────────────────────────
  {
    regionId: "chungbuk",
    regionName: "Chungbuk",
    regionNameKo: "충북",
    elected: {
      name: "신용한",
      party: "더불어민주당",
      voteShare: 54.57,
      badge: "확정",
    },
    runner: {
      name: "김영환",
      party: "국민의힘",
      voteShare: 45.42,
      badge: "확정",
    },
    previousParty: "국민의힘",
    isPartyFlip: true,
    career: [
      // TODO: 이력 상세 확인 필요
      "더불어민주당 충북 정치인",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "충북 반도체·바이오 유치",  description: "오창·오송 산업단지 첨단산업 클러스터 고도화", source: "참고" },
      { category: "교통·인프라", title: "충북 고속화 교통망",        description: "청주공항 국제선 확대 및 KTX 충북선 연결", source: "참고" },
      { category: "복지·의료",   title: "충북 공공의료 강화",         description: "충북 의료원 확충 및 응급의료 체계 개선", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 12. 충남 ─────────────────────────────────────────────
  {
    regionId: "chungnam",
    regionName: "Chungnam",
    regionNameKo: "충남",
    elected: {
      name: "박수현",
      party: "더불어민주당",
      voteShare: 52.53,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "국민의힘",
    isPartyFlip: true,
    career: [
      "청와대 국민소통수석 비서관 (2017~2018)",
      "청와대 대변인 (2018~2020)",
      "국회의원 충남 공주시·청양군 (2004~2008)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "환경·에너지", title: "충남 탈석탄 에너지 전환",  description: "석탄발전소 조기 폐쇄·재생에너지 산업 육성", source: "참고" },
      { category: "경제·일자리", title: "서해안 산업단지 활성화",   description: "당진·보령·서산 서해안 산업 클러스터 강화", source: "참고" },
      { category: "복지·의료",   title: "농어촌 주민 생활 지원",   description: "농어촌 인구 감소 대응 특별 지원 패키지", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 13. 전북 ─────────────────────────────────────────────
  {
    regionId: "jeonbuk",
    regionName: "Jeonbuk",
    regionNameKo: "전북",
    elected: {
      name: "이원택",
      party: "더불어민주당",
      voteShare: 51.23,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "더불어민주당",
    isPartyFlip: false,
    career: [
      "국회의원 전북 익산시을 (2020~2026)",
      // TODO: 추가 이력 확인 필요
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "새만금 개발 가속화",       description: "새만금 국제자유도시 조성 속도 향상", source: "참고" },
      { category: "농업·수산",   title: "전북 농업 디지털화",       description: "스마트팜 확대 및 농식품 수출 증대", source: "참고" },
      { category: "교통·인프라", title: "전북 KTX·고속도로 확충", description: "전주~수도권 고속 이동 인프라 강화", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 14. 경북 ─────────────────────────────────────────────
  {
    regionId: "gyeongbuk",
    regionName: "Gyeongbuk",
    regionNameKo: "경북",
    elected: {
      name: "이철우",
      party: "국민의힘",
      voteShare: 67.24,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "국민의힘",
    isPartyFlip: false,
    career: [
      "경북도지사 재선 (2018~2026)",
      "국회의원 경북 김천시 (2008~2018)",
      "국가정보원 차장 (2007~2008)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "경북 첨단산업 클러스터",   description: "구미 반도체·포항 이차전지 제조업 재도약", source: "참고" },
      { category: "행정·자치",   title: "경북·대구 행정통합 추진", description: "대구경북 광역 메가시티 구성 논의 지속", source: "참고" },
      { category: "교통·인프라", title: "경북 교통망 완성",         description: "동해선·중부내륙선 완공 및 연계 인프라", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 15. 경남 ─────────────────────────────────────────────
  {
    regionId: "gyeongnam",
    regionName: "Gyeongnam",
    regionNameKo: "경남",
    elected: {
      name: "박완수",
      party: "국민의힘",
      voteShare: 50.80,
      badge: "확정",
    },
    runner: {
      name: "김경수",
      party: "더불어민주당",
      voteShare: 49.19,
      badge: "확정",
    },
    previousParty: "국민의힘",
    isPartyFlip: false,
    career: [
      "경남도지사 (2022~2026)",
      "국회의원 경남 창원시 의창구",
      "창원시장",
      "민선 8기 경남도정 운영",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제·일자리", title: "경남 항공·우주 산업 육성", description: "사천 항공 클러스터·위성 산업 고도화", source: "참고" },
      { category: "환경·에너지", title: "낙동강 수질·환경 개선",    description: "낙동강 수질 정화 및 친수공간 조성", source: "참고" },
      { category: "교육·청년",   title: "경남 청년 인구 유입",      description: "청년 일자리·주거 지원 패키지", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 16. 제주 ─────────────────────────────────────────────
  {
    regionId: "jeju",
    regionName: "Jeju",
    regionNameKo: "제주",
    elected: {
      name: "위성곤",
      party: "더불어민주당",
      voteShare: 63.11,
      badge: "확정",
    },
    runner: null,   // TODO: 상대 후보 정보 확인
    previousParty: "더불어민주당",
    isPartyFlip: false,
    career: [
      "국회의원 제주 서귀포시 (2016~2026)",
      // TODO: 추가 이력 확인 필요
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "환경·에너지", title: "제주 탄소중립 섬 실현",   description: "2030 탄소중립 조기 달성·청정에너지 전환", source: "참고" },
      { category: "경제·일자리", title: "제주 관광 고부가가치화",   description: "오버투어리즘 해소·프리미엄 관광 육성", source: "참고" },
      { category: "교통·인프라", title: "제주 제2공항 건설 추진",   description: "제2공항 조기 착공으로 교통 분산", source: "참고" },
    ],
    dataAsOf: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },
];
