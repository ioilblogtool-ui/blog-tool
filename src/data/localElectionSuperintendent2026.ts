// ============================================================
// localElectionSuperintendent2026.ts
// 2026 교육감 당선자 데이터
// 기준: 2026.06.04 개표율 99.79%
// ※ 교육감 선거는 정당 표시 없음. 진보/보수는 편집부 분류.
// ============================================================

export type EduOrientation = "진보" | "보수" | "중도" | "확정대기";
export type EduBadge       = "확정" | "확정대기" | "재선";
export type EduPledgeCategory =
  | "교육과정" | "학생인권" | "교원처우" | "학교시설"
  | "돌봄" | "직업교육" | "디지털교육" | "기타";

export interface EduPledge {
  category: EduPledgeCategory;
  title: string;
  description: string;
  source: "선관위공약마당" | "선거공보" | "참고";
}

export interface EduSuperintendent {
  regionId: string;        // SVG path id — 시도지사 지도와 동일
  regionName: string;
  regionNameKo: string;
  name: string;
  orientation: EduOrientation;
  orientationBasis: string;  // 성향 분류 근거 (편집부 기준)
  badge: EduBadge;
  voteShare: number;         // 0이면 미확정
  career: string[];
  pledges: EduPledge[];
  isReelection: boolean;
  noteDate: string;
  sources: { label: string; url: string }[];
}

export interface EduPageMeta {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalRegions: number;
  progressiveCount: number;
  conservativeCount: number;
  pendingCount: number;
  orientationNote: string;
}

// ─── 메타 ─────────────────────────────────────────────────
export const EDU_META: EduPageMeta = {
  electionName:      "제9회 전국동시지방선거 — 시도교육감선거",
  electionDate:      "2026-06-03",
  dataAsOf:          "2026-06-04 선관위 개표 결과 기준",
  totalRegions:      16,   // 전남·광주 통합으로 16개 교육감 선출
  progressiveCount:  11,   // 서울·부산·인천·울산·경기·강원·충남·전북·전남광주·경남·제주
  conservativeCount: 5,    // 대구·대전·세종·충북·경북
  pendingCount:      0,
  orientationNote:   "진보/보수 성향 분류는 후보자 공약·지지 단체·이력을 종합한 비교계산소 편집부 기준입니다. 공식 정치 정당 기준이 아닙니다.",
};

// ─── 당선자 데이터 ────────────────────────────────────────
export const SUPERINTENDENTS: EduSuperintendent[] = [

  // ── 1. 서울 — 정근식 (진보, 재선) ✅ 확정 ──────────────
  {
    regionId: "seoul",
    regionName: "Seoul",
    regionNameKo: "서울",
    name: "정근식",
    orientation: "진보",
    orientationBasis: "학생인권조례 유지, 혁신학교 확대, 무상급식 전면 실시 공약. 전교조 지지 기반.",
    badge: "재선",
    voteShare: 0,   // TODO: 선관위 확정 후 득표율 업데이트
    career: [
      "서울대학교 사회학과 교수 (1994~2022)",
      "참여연대 운영위원 역임",
      "서울시 교육감 초선 (2022~2026)",
      "서울시 교육감 재선 (2026~, 제9회 지방선거)",
    ],
    pledges: [
      // TODO: 선관위 공약마당 확인 후 상세 업데이트
      { category: "학생인권",   title: "서울 학생인권조례 유지·강화",  description: "학생인권조례 수호 및 학교 내 민주주의 확산", source: "참고" },
      { category: "교육과정",  title: "혁신학교 정책 지속 추진",      description: "서울형 혁신학교 확대·학생 중심 수업 혁신", source: "참고" },
      { category: "돌봄",      title: "방과후·돌봄 공공화",           description: "방과후학교·초등돌봄교실 공공 운영 체계 강화", source: "참고" },
      { category: "디지털교육", title: "AI·디지털 교육 인프라 강화",  description: "AI 교육 인프라 전 학교 보급·교원 연수 확대", source: "참고" },
    ],
    isReelection: true,
    noteDate: "2026-06-04",
    sources: [
      { label: "선관위 당선인 정보", url: "https://info.nec.go.kr" },
      { label: "서울시교육청",        url: "https://www.sen.go.kr" },
    ],
  },

  // ── 2. 부산 — 김석준 (진보) ────────────────────────────
  { regionId: "busan", regionName: "Busan", regionNameKo: "부산",
    name: "김석준", orientation: "진보", orientationBasis: "혁신학교 확대, 학생인권 보호, 무상교육 확대 공약",
    badge: "확정", voteShare: 50.63, isReelection: false,
    career: ["부산광역시교육감 (2022~2026 초선)", "교육학 박사"],
    pledges: [{ category: "교육과정", title: "부산형 혁신교육 추진", description: "학생 중심 수업 혁신 및 진로교육 강화", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 3. 대구 — 강은희 (보수) ─────────────────────────────
  { regionId: "daegu", regionName: "Daegu", regionNameKo: "대구",
    name: "강은희", orientation: "보수", orientationBasis: "기초학력 강화, 자사고 유지, 수능 위주 입시 지지 공약",
    badge: "확정", voteShare: 52.40, isReelection: true,
    career: ["대구광역시교육감 재선", "국회의원 대구 수성구갑 (2016~2020)", "교육부 장관 (2014~2016)"],
    pledges: [{ category: "교육과정", title: "기초학력 강화", description: "학력 제고 및 수능 대비 교육 지원", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 4. 인천 — 도성훈 (진보) ─────────────────────────────
  { regionId: "incheon", regionName: "Incheon", regionNameKo: "인천",
    name: "도성훈", orientation: "진보", orientationBasis: "무상교육 확대, 혁신학교, 학생인권 보호",
    badge: "확정", voteShare: 36.35, isReelection: true,
    career: ["인천광역시교육감 재선", "전교조 출신"],
    pledges: [{ category: "돌봄", title: "인천형 늘봄학교 확대", description: "방과후 돌봄 공공화 강화", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 5. 광주·전남 — 김대중 (진보) ────────────────────────
  { regionId: "gwangju_jeonnam", regionName: "Gwangju-Jeonnam", regionNameKo: "광주·전남",
    name: "김대중", orientation: "진보", orientationBasis: "통합특별시 첫 교육감, 무상교육·진보 교육 공약",
    badge: "확정", voteShare: 42.52, isReelection: false,
    career: ["전남광주통합특별시 초대 교육감", "광주광역시 교육 활동"],
    pledges: [{ category: "행정·자치", title: "통합특별시 교육행정 통합", description: "광주·전남 교육청 통합 안착 추진", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 6. 대전 — 오석진 (보수) ─────────────────────────────
  { regionId: "daejeon", regionName: "Daejeon", regionNameKo: "대전",
    name: "오석진", orientation: "보수", orientationBasis: "기초학력 강화, 직업교육, 수능 위주 입시 지지",
    badge: "확정", voteShare: 27.48, isReelection: false,
    career: ["대전 교육계 활동"],
    pledges: [{ category: "교육과정", title: "대전형 기초학력 보장", description: "학력 미달 학생 맞춤 지원", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 7. 울산 — 조용식 (진보) ─────────────────────────────
  { regionId: "ulsan", regionName: "Ulsan", regionNameKo: "울산",
    name: "조용식", orientation: "진보", orientationBasis: "혁신학교 확대, 학생인권 보호, 무상급식 전면 실시",
    badge: "확정", voteShare: 39.22, isReelection: false,
    career: ["울산 교육계 활동"],
    pledges: [{ category: "교육과정", title: "울산형 혁신교육 추진", description: "학생 중심 수업 및 진로 교육", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 8. 세종 — 강미애 (보수) ─────────────────────────────
  { regionId: "sejong", regionName: "Sejong", regionNameKo: "세종",
    name: "강미애", orientation: "보수", orientationBasis: "기초학력 강화, 직업교육, 자율형 교육 지지",
    badge: "확정", voteShare: 36.25, isReelection: false,
    career: ["세종 교육계 활동"],
    pledges: [{ category: "교육과정", title: "세종 교육도시 경쟁력 강화", description: "행정중심복합도시 교육 자족도시 완성", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 9. 경기 — 안민석 (진보) ─────────────────────────────
  { regionId: "gyeonggi", regionName: "Gyeonggi", regionNameKo: "경기",
    name: "안민석", orientation: "진보", orientationBasis: "혁신학교·학생인권조례 유지, 무상교육 확대",
    badge: "확정", voteShare: 52.81, isReelection: false,
    career: ["국회의원 경기 오산시 (2004~2024, 다선)", "문화체육관광위원장"],
    pledges: [
      { category: "교육과정", title: "경기형 혁신교육 강화", description: "학생 주도 교육·진로교육 확대", source: "참고" },
      { category: "돌봄", title: "늘봄학교 경기 전 학교 확대", description: "방과후 돌봄 공공화", source: "참고" },
    ],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 10. 강원 — 강삼영 (진보) ────────────────────────────
  { regionId: "gangwon", regionName: "Gangwon", regionNameKo: "강원",
    name: "강삼영", orientation: "진보", orientationBasis: "혁신학교 확대, 농산어촌 교육격차 해소 공약",
    badge: "확정", voteShare: 41.54, isReelection: false,
    career: ["강원 교육계 활동"],
    pledges: [{ category: "교육과정", title: "강원 교육격차 해소", description: "농산어촌 소규모학교 지원 강화", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 11. 충북 — 윤건영 (보수) ────────────────────────────
  { regionId: "chungbuk", regionName: "Chungbuk", regionNameKo: "충북",
    name: "윤건영", orientation: "보수", orientationBasis: "기초학력 보장, 직업교육 강화, 수능 지원",
    badge: "확정", voteShare: 48.21, isReelection: false,
    career: ["충북 교육계 활동"],
    pledges: [{ category: "직업교육", title: "충북 직업교육 강화", description: "지역 산업 연계 직업교육 고도화", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 12. 충남 — 이병도 (진보) ────────────────────────────
  { regionId: "chungnam", regionName: "Chungnam", regionNameKo: "충남",
    name: "이병도", orientation: "진보", orientationBasis: "혁신교육, 무상급식, 학생인권 강화 공약",
    badge: "확정", voteShare: 30.59, isReelection: false,
    career: ["충남 교육계 활동"],
    pledges: [{ category: "교육과정", title: "충남형 미래교육 추진", description: "학생 주도 학습 환경 조성", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 13. 전북 — 천호성 (진보) ────────────────────────────
  { regionId: "jeonbuk", regionName: "Jeonbuk", regionNameKo: "전북",
    name: "천호성", orientation: "진보", orientationBasis: "혁신학교 전국 선도, 학생인권 보호 공약",
    badge: "확정", voteShare: 56.63, isReelection: false,
    career: ["전북 교육계 활동", "교육학 연구"],
    pledges: [{ category: "교육과정", title: "전북 혁신교육 확대", description: "전북 혁신교육 모델 고도화", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 14. 경북 — 임종식 (보수) ────────────────────────────
  { regionId: "gyeongbuk", regionName: "Gyeongbuk", regionNameKo: "경북",
    name: "임종식", orientation: "보수", orientationBasis: "기초학력 강화, 직업교육, 자사고 유지 공약",
    badge: "확정", voteShare: 43.49, isReelection: true,
    career: ["경북교육감 재선"],
    pledges: [{ category: "직업교육", title: "경북 직업교육 강화", description: "경북 산업단지 연계 직업교육", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 15. 경남 — 송영기 (진보) ────────────────────────────
  { regionId: "gyeongnam", regionName: "Gyeongnam", regionNameKo: "경남",
    name: "송영기", orientation: "진보", orientationBasis: "혁신교육 확대, 학생인권 보호, 무상급식 전면 실시 공약",
    badge: "확정", voteShare: 0, isReelection: false,
    career: ["경남 교육계 활동"],
    pledges: [{ category: "교육과정", title: "경남 혁신교육 추진", description: "학생 중심 교육 환경 조성", source: "참고" }],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }] },

  // ── 16. 제주 — 고의숙 (진보) ────────────────────────────
  { regionId: "jeju", regionName: "Jeju", regionNameKo: "제주",
    name: "고의숙", orientation: "진보", orientationBasis: "혁신교육·무상교육 확대, 제주 첫 민선 여성 교육감",
    badge: "확정", voteShare: 48.08, isReelection: false,
    career: ["제주특별자치도 첫 민선 여성 교육감", "제주 교육계 활동"],
    pledges: [
      { category: "교육과정", title: "제주 미래교육 추진", description: "제주 특성화 교육 모델 개발", source: "참고" },
      { category: "환경", title: "환경·생태 교육 강화", description: "제주 자연환경 활용 생태 교육", source: "참고" },
    ],
    noteDate: "2026-06-04", sources: [{ label: "선관위", url: "https://info.nec.go.kr" }],
    // Note: 제주 첫 민선 여성 교육감
  },
];

