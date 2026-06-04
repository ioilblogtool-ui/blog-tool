// ============================================================
// localElectionByeollection2026.ts
// 2026 재보궐선거 당선자 데이터
// 기준: 2026.06.04 선관위 개표 결과 기준
// ============================================================

export type Party = "더불어민주당" | "국민의힘" | "무소속" | "조국혁신당" | "기타";
export type ResultBadge = "확정" | "확정대기" | "낙선확정";
export type ByeRegion = "수도권" | "경상권" | "충청권" | "전라권" | "강원·제주";

export interface IssueHighlight {
  type: "winner" | "loser" | "notable";
  districtId: string;
  personName: string;
  party: Party;
  badge: ResultBadge;
  headline: string;
  subHeadline: string;
  career: string[];
  noteText: string;
}

export interface ByeCandidate {
  name: string;
  party: Party;
  voteShare: number;
  badge: ResultBadge;
}

export interface ByePledge {
  category: "경제" | "복지" | "교육" | "환경" | "교통" | "주거" | "청년" | "안전" | "기타";
  title: string;
  description: string;
}

export interface ByeDistrict {
  districtId: string;
  districtName: string;
  region: ByeRegion;
  byeReason: string;
  elected: ByeCandidate | null;
  runner: ByeCandidate | null;
  career: string[];
  pledges: ByePledge[];
  isIssue: boolean;
  noteDate: string;
  sources: { label: string; url: string }[];
}

export interface ByePageMeta {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalDistricts: number;
  demCount: number;
  pppCount: number;
  indCount: number;
}

// ─── 메타 ─────────────────────────────────────────────────
export const BYE_META: ByePageMeta = {
  electionName: "제9회 전국동시지방선거 — 국회의원 재·보궐선거",
  electionDate: "2026-06-03",
  dataAsOf: "2026-06-04 선관위 개표 결과 기준",
  totalDistricts: 14,
  demCount: 9,
  pppCount: 4,
  indCount: 1,
};

// ─── 이슈 하이라이트 ────────────────────────────────────────
export const ISSUE_HIGHLIGHTS: IssueHighlight[] = [
  {
    type: "winner",
    districtId: "busan-bukgu-gap",
    personName: "한동훈",
    party: "무소속",
    badge: "확정",
    headline: "한동훈, 부산 북구갑 무소속 당선",
    subHeadline: "前 법무부 장관·국민의힘 대표, 탈당 후 의회 복귀 — 42.99% 득표",
    career: [
      "서울대학교 법학과 졸업",
      "사법시험 합격 (1998년, 제40회)",
      "검사 임관 (1999년)",
      "법무부 검찰국장·기획조정실장",
      "법무부 장관 (2022.05 ~ 2023.01, 윤석열 정부)",
      "국민의힘 비상대책위원장 (2023.07 ~ 2024.02)",
      "국민의힘 대표 (2024.03 ~ 2024.12)",
      "국민의힘 탈당 (2024.12)",
      "부산 북구갑 무소속 당선 (2026.06, 42.99%)",
    ],
    noteText:
      "前 의원 전재수(더불어민주당)의 부산시장 출마로 공석. 한동훈이 무소속으로 출마해 하정우 후보(41.24%)를 1,425표 차(1.75%p)로 꺾고 당선.",
  },
  {
    type: "loser",
    districtId: "jeonbuk-gunsaim-gap",
    personName: "조국",
    party: "조국혁신당",
    badge: "낙선확정",
    headline: "조국, 지역구 직접 출마 낙선",
    subHeadline: "조국혁신당 대표, 지역구 출마 — 낙선",
    career: [
      "서울대학교 법학과 교수 (1995~2019)",
      "청와대 민정수석 비서관 (2017.05 ~ 2019.08)",
      "법무부 장관 (2019.09 ~ 2019.10, 재임 35일)",
      "자녀 입시비리 의혹 기소·유죄 확정",
      "조국혁신당 창당·대표 취임 (2024.01)",
      "제22대 총선 비례 출마 당선 (2024)",
      "2026 재보궐선거 지역구 출마 → 낙선",
    ],
    noteText:
      "조국혁신당 대표가 직접 지역구에 출마했으나 낙선.",
  },
  {
    type: "notable",
    districtId: "daegu-dalseong",
    personName: "이진숙",
    party: "국민의힘",
    badge: "확정",
    headline: "이진숙, 대구 달성군 59.06% 당선",
    subHeadline: "前 방통위원장, 대구 달성군에서 압도적 당선",
    career: [
      "MBC 기자·앵커 출신",
      "MBC 보도국장 (2013~2014)",
      "MBC 사장 (2014~2016)",
      "방송통신위원회 위원장 (2024.07~2024.08, 재임 30일 탄핵)",
    ],
    noteText: "추경호 의원의 대구시장 출마로 공석된 달성군에서 59.06% 압도적 득표율로 당선.",
  },
];

// ─── 전체 14개 지역구 ─────────────────────────────────────
export const BYE_DISTRICTS: ByeDistrict[] = [
  // ── 1. 경기 하남갑 ── 민주당
  {
    districtId: "gyeonggi-hanam-gap",
    districtName: "경기 하남갑",
    region: "수도권",
    byeReason: "김용만 의원 사직",
    elected: { name: "이광재", party: "더불어민주당", voteShare: 49.68, badge: "확정" },
    runner: null,
    career: [
      "국회의원 강원 원주시갑 (2020~2024)",
      "더불어민주당 미래전략기획단장",
      "원주시장 (2005~2009)",
    ],
    pledges: [
      { category: "교통", title: "하남 광역교통 개선", description: "5호선 연장 및 하남~서울 광역버스 확충" },
      { category: "주거", title: "신도시 생활인프라 확충", description: "미사·감일·위례 신도시 학교·공원·의료 확충" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 2. 경기 안산갑 ── 민주당
  {
    districtId: "gyeonggi-ansan-gap",
    districtName: "경기 안산갑",
    region: "수도권",
    byeReason: "고영인 의원 사직",
    elected: { name: "김남국", party: "더불어민주당", voteShare: 0, badge: "확정" },
    runner: null,
    career: [
      "국회의원 경기 안산시단원구갑 (2020~2024)",
      "변호사 출신",
    ],
    pledges: [
      { category: "경제", title: "안산 산업단지 혁신", description: "반월·시화 산단 첨단화 및 청년 일자리 창출" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 3. 경기 평택을 ── 국민의힘
  {
    districtId: "gyeonggi-pyeongtaek-eul",
    districtName: "경기 평택을",
    region: "수도권",
    byeReason: "홍문표 의원 사직",
    elected: { name: "유의동", party: "국민의힘", voteShare: 34.1, badge: "확정" },
    runner: null,
    career: [
      "국회의원 경기 평택시을 (2020~2024)",
      "국민의힘 원내수석부대표",
    ],
    pledges: [
      { category: "경제", title: "평택 반도체 클러스터 지원", description: "삼성전자 평택캠퍼스 연계 지역경제 활성화" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 4. 인천 연수갑 ── 민주당
  {
    districtId: "incheon-yeonsu-gap",
    districtName: "인천 연수갑",
    region: "수도권",
    byeReason: "박찬대 의원 인천시장 출마 사직",
    elected: { name: "송영길", party: "더불어민주당", voteShare: 0, badge: "확정" },
    runner: null,
    career: [
      "더불어민주당 대표 (2021~2022)",
      "인천시장 (2010~2018)",
      "국회의원 다선",
    ],
    pledges: [
      { category: "교통", title: "인천 GTX·지하철 확충", description: "GTX-B 인천 연장 및 지하철 4호선 연수구 연결" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 5. 인천 계양을 ── 민주당
  {
    districtId: "incheon-gyeyang-eul",
    districtName: "인천 계양을",
    region: "수도권",
    byeReason: "이재명 대통령 취임으로 의원직 상실",
    elected: { name: "김남준", party: "더불어민주당", voteShare: 61.65, badge: "확정" },
    runner: null,
    career: [
      "더불어민주당 인천시당 위원장",
      "인천 계양구 정치 활동",
    ],
    pledges: [
      { category: "교통", title: "계양~부평 교통 개선", description: "광역버스 증편 및 도시철도 접근성 향상" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 6. 부산 북구갑 ── 무소속 (이슈)
  {
    districtId: "busan-bukgu-gap",
    districtName: "부산 북구갑",
    region: "경상권",
    byeReason: "전재수 의원 부산시장 출마 사직",
    elected: { name: "한동훈", party: "무소속", voteShare: 42.99, badge: "확정" },
    runner: { name: "하정우", party: "더불어민주당", voteShare: 41.24, badge: "확정" },
    career: [
      "서울대학교 법학과 졸업",
      "검사 임관 (1999년)",
      "법무부 장관 (2022.05 ~ 2023.01)",
      "국민의힘 비상대책위원장 (2023.07 ~ 2024.02)",
      "국민의힘 대표 (2024.03 ~ 2024.12)",
      "국민의힘 탈당 (2024.12)",
    ],
    pledges: [
      { category: "경제", title: "부산 글로벌 허브도시 추진", description: "북항 재개발·해양 산업 클러스터 육성" },
      { category: "교통", title: "부산 북구 교통 인프라 개선", description: "도시철도 연장 및 간선 버스 개편" },
    ],
    isIssue: true,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 7. 울산 남구갑 ── 국민의힘
  {
    districtId: "ulsan-namgu-gap",
    districtName: "울산 남구갑",
    region: "경상권",
    byeReason: "김기현 의원 사직",
    elected: { name: "김태규", party: "국민의힘", voteShare: 51.15, badge: "확정" },
    runner: null,
    career: [
      "전 울산지방법원 판사",
      "법조인 출신",
    ],
    pledges: [
      { category: "경제", title: "울산 산업 전환 지원", description: "자동차·석유화학 → 수소·친환경 산업 전환" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 8. 대구 달성군 ── 국민의힘 (이슈)
  {
    districtId: "daegu-dalseong",
    districtName: "대구 달성군",
    region: "경상권",
    byeReason: "추경호 의원 대구시장 출마 사직",
    elected: { name: "이진숙", party: "국민의힘", voteShare: 59.06, badge: "확정" },
    runner: null,
    career: [
      "MBC 기자·앵커 출신",
      "MBC 보도국장 (2013~2014)",
      "MBC 사장 (2014~2016)",
      "방송통신위원회 위원장 (2024.07~2024.08, 탄핵)",
    ],
    pledges: [
      { category: "경제", title: "달성 산업단지 혁신", description: "달성 국가산업단지 첨단화 및 기업 유치" },
      { category: "교통", title: "달성 교통망 개선", description: "도시철도 연장 및 낙동강 주변 도로 확충" },
    ],
    isIssue: true,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 9. 광주 광산을 ── 민주당
  {
    districtId: "gwangju-gwangsan-eul",
    districtName: "광주 광산을",
    region: "전라권",
    byeReason: "민형배 의원 광주전남 통합특별시장 출마 사직",
    elected: { name: "임문영", party: "더불어민주당", voteShare: 62.85, badge: "확정" },
    runner: null,
    career: ["더불어민주당 광주 광산구 정치 활동"],
    pledges: [
      { category: "행정", title: "광주전남 통합특별시 안착 지원", description: "통합시 출범 후 광산구 행정서비스 강화" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 10. 전북 군산·김제·부안갑 ── 민주당
  {
    districtId: "jeonbuk-gunsan-gap",
    districtName: "전북 군산·김제·부안갑",
    region: "전라권",
    byeReason: "이원택 의원 전북도지사 출마 사직",
    elected: { name: "김의겸", party: "더불어민주당", voteShare: 0, badge: "확정" },
    runner: null,
    career: [
      "국회의원 전북 군산시 (2022~2024)",
      "청와대 대변인 (2018~2019)",
      "전직 기자 출신",
    ],
    pledges: [
      { category: "경제", title: "새만금 개발 가속화", description: "새만금 국제자유도시 조성 추진" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 11. 전북 군산·김제·부안을 ── 민주당
  {
    districtId: "jeonbuk-gunsan-eul",
    districtName: "전북 군산·김제·부안을",
    region: "전라권",
    byeReason: "신영대 의원 사직",
    elected: { name: "박지원", party: "더불어민주당", voteShare: 66.46, badge: "확정" },
    runner: null,
    career: [
      "국회의원 다선 (전남·전북)",
      "국정원장 (2020~2022)",
      "더불어민주당 원내총무·최고위원",
    ],
    pledges: [
      { category: "경제", title: "전북 농업·수산 경쟁력 강화", description: "스마트팜·수산물 수출 확대" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 12. 충남 아산을 ── 민주당
  {
    districtId: "chungnam-asan-eul",
    districtName: "충남 아산을",
    region: "충청권",
    byeReason: "복기왕 의원 충남도지사 출마 사직",
    elected: { name: "전은수", party: "더불어민주당", voteShare: 60.16, badge: "확정" },
    runner: null,
    career: ["더불어민주당 충남 아산 정치 활동"],
    pledges: [
      { category: "경제", title: "아산 삼성·현대 산업단지 연계 발전", description: "탕정·아산 산업단지 지원 강화" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 13. 충남 공주·부여·청양 ── 국민의힘
  {
    districtId: "chungnam-gongju",
    districtName: "충남 공주·부여·청양",
    region: "충청권",
    byeReason: "정진석 의원 사직",
    elected: { name: "윤용근", party: "국민의힘", voteShare: 46.64, badge: "확정" },
    runner: null,
    career: ["국민의힘 충남 정치 활동"],
    pledges: [
      { category: "경제", title: "충남 서해안 농업·관광 특화", description: "공주·부여 역사문화관광 활성화" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 14. 제주 서귀포시 ── 민주당
  {
    districtId: "jeju-seogwipo",
    districtName: "제주 서귀포시",
    region: "강원·제주",
    byeReason: "위성곤 의원 제주도지사 출마 사직",
    elected: { name: "김성범", party: "더불어민주당", voteShare: 0, badge: "확정" },
    runner: null,
    career: ["더불어민주당 제주 서귀포 정치 활동"],
    pledges: [
      { category: "환경", title: "제주 탄소중립 추진", description: "청정 제주 환경 보전 및 재생에너지 확대" },
    ],
    isIssue: false,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },
];
