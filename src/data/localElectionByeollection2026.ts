// ============================================================
// localElectionByeollection2026.ts
// 2026 재보궐선거 당선자 데이터
// 기준: 2026.06.04 개표율 99.79%
// TODO 주석 = 선관위 최종 확정 후 업데이트 필요
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
  voteShare: number;  // 0이면 미확정
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
  dataAsOf: "2026-06-04 14:00 개표율 99.92% 기준",
  totalDistricts: 14,
  demCount: 9,
  pppCount: 4,
  indCount: 1,
};

// ─── 이슈 하이라이트 (3인) ────────────────────────────────
export const ISSUE_HIGHLIGHTS: IssueHighlight[] = [
  {
    type: "winner",
    districtId: "busan-bukgu-gap",
    personName: "한동훈",
    party: "무소속",
    badge: "확정",
    headline: "한동훈, 부산 북구갑 무소속 당선",
    subHeadline: "前 법무부 장관·국민의힘 대표, 탈당 후 의회 복귀",
    career: [
      "서울대학교 법학과 졸업",
      "사법시험 합격 (1998년, 제40회)",
      "검사 임관 (1999년)",
      "법무부 검찰국장·기획조정실장",
      "법무부 장관 (2022.05 ~ 2023.01, 윤석열 정부)",
      "국민의힘 비상대책위원장 (2023.07 ~ 2024.02)",
      "국민의힘 대표 (2024.03 ~ 2024.12)",
      "국민의힘 탈당 (2024.12)",
      "부산 북구갑 무소속 당선 (2026.06)",
    ],
    noteText:
      "前 의원 전재수(더불어민주당)의 경남도지사 출마로 공석. 한동훈이 무소속으로 출마·당선. 국민의힘 탈당 후 첫 선거 복귀.",
  },
  {
    type: "loser",
    districtId: "todo-jokuk-district", // TODO: 조국 출마 지역구 선관위 확인 필요
    personName: "조국",
    party: "조국혁신당",
    badge: "낙선확정",
    headline: "조국, 지역구 직접 출마 낙선",
    subHeadline: "조국혁신당 대표, 재보궐 지역구 출마 — 낙선",
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
      "조국혁신당 대표 직접 출마. 출마 지역구는 선관위 확인 중.", // TODO: 지역구 확인 후 업데이트
  },
  {
    type: "notable",
    districtId: "daegu-dalseong",
    personName: "이진숙",
    party: "국민의힘", // TODO: 정당 선관위 최종 확인 필요
    badge: "확정",
    headline: "이진숙, 대구 달성군 당선",
    subHeadline: "前 방통위원장, 대구 달성군에서 당선",
    career: [
      "MBC 기자·앵커 출신",
      "MBC 보도국장 (2013~2014)",
      "MBC 사장 (2014~2016)",
      "방송통신위원회 위원장 (2024.07~2024.08, 재임 30일 탄핵)", // TODO: 정확한 날짜 확인
    ],
    noteText:
      "方통위원장으로 탄핵을 겪은 이진숙이 대구 달성군에서 당선. 소속 정당 선관위 최종 확인 필요.", // TODO
  },
];

// ─── 전체 14개 지역구 ─────────────────────────────────────
export const BYE_DISTRICTS: ByeDistrict[] = [
  // ── 1. 부산 북구갑 — 확정 (한동훈 무소속)
  {
    districtId: "busan-bukgu-gap",
    districtName: "부산 북구갑",
    region: "경상권",
    byeReason: "전재수 의원 경남도지사 출마로 의원직 사직",
    elected: {
      name: "한동훈",
      party: "무소속",
      voteShare: 0, // TODO: 선관위 확정 후 업데이트
      badge: "확정",
    },
    runner: null, // TODO: 상대 후보 득표율 확인
    career: [
      "서울대학교 법학과 졸업",
      "검사 임관 (1999년)",
      "법무부 장관 (2022.05 ~ 2023.01)",
      "국민의힘 비상대책위원장 (2023.07 ~ 2024.02)",
      "국민의힘 대표 (2024.03 ~ 2024.12)",
      "국민의힘 탈당 (2024.12)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "경제",  title: "부산 북구 경제 활성화",    description: "지역 중소기업·소상공인 지원 강화 및 일자리 창출" },
      { category: "교통",  title: "부산 북구 교통 인프라 개선", description: "도시철도 연장 및 간선 버스 노선 개편" },
      { category: "복지",  title: "부산 북구 민생 복지 강화",  description: "취약계층 생활 안전망 확충 및 어르신 지원" },
    ],
    isIssue: true,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 2. 대구 달성군 — 당선 확정 (이진숙, 정당 TODO)
  {
    districtId: "daegu-dalseong",
    districtName: "대구 달성군",
    region: "경상권",
    byeReason: "추경호 의원 대구시장 출마로 의원직 사직",
    elected: {
      name: "이진숙",
      party: "국민의힘", // TODO: 선관위 최종 확인
      voteShare: 0, // TODO: 득표율 확인
      badge: "확정",
    },
    runner: null,
    career: [
      "MBC 기자·앵커 출신",
      "MBC 사장 (2014~2016)",
      "방통위원장 (2024.07~2024.08, 탄핵)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 업데이트
      { category: "경제",  title: "달성 산업단지 혁신",    description: "달성 국가산업단지 고도화 및 기업 유치" },
      { category: "교통",  title: "달성 교통망 개선",      description: "대구 도시철도 연장 및 도로 인프라 확충" },
      { category: "기타",  title: "달성 지역발전 특별사업", description: "낙동강 주변 생태·관광 개발" },
    ],
    isIssue: true,
    noteDate: "2026-06-04",
    sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
  },

  // ── 3~14. 나머지 12개 지역구 — 전체 확정 대기 TODO
  // 더불어민주당 8곳 + 국민의힘 3곳 (지역구명 미확정)

  { districtId: "todo-dem-01", districtName: "확인 중 (민주①)", region: "수도권",
    byeReason: "TODO: 재보궐 사유 확인",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-dem-02", districtName: "확인 중 (민주②)", region: "수도권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-dem-03", districtName: "확인 중 (민주③)", region: "수도권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-dem-04", districtName: "확인 중 (민주④)", region: "충청권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-dem-05", districtName: "확인 중 (민주⑤)", region: "전라권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-dem-06", districtName: "확인 중 (민주⑥)", region: "전라권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-dem-07", districtName: "확인 중 (민주⑦)", region: "경상권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-dem-08", districtName: "확인 중 (민주⑧)", region: "수도권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "더불어민주당", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-ppp-01", districtName: "확인 중 (국힘①)", region: "경상권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-ppp-02", districtName: "확인 중 (국힘②)", region: "경상권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  { districtId: "todo-ppp-03", districtName: "확인 중 (국힘③)", region: "수도권",
    byeReason: "TODO",
    elected: { name: "TODO", party: "국민의힘", voteShare: 0, badge: "확정대기" },
    runner: null, career: [],
    pledges: [{ category: "기타", title: "공약 수집 중", description: "선관위 공약마당 업데이트 후 기재 예정" }],
    isIssue: false, noteDate: "2026-06-04",
    sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },
];
