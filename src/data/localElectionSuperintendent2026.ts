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
  dataAsOf:          "2026-06-04 개표율 99.79% 기준",
  totalRegions:      17,
  progressiveCount:  1,    // 현재 확정: 서울 정근식
  conservativeCount: 0,    // TODO: 선관위 확정 후 업데이트
  pendingCount:      16,
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

  // ── 2~17. 나머지 16개 — 전체 TODO ──────────────────────
  // 선관위 최종 확정 후 채워야 함
  // 아래 구조는 데이터 입력 가이드용 템플릿

  ...(["busan","daegu","incheon","gwangju_jeonnam","daejeon","ulsan","sejong",
       "gyeonggi","gangwon","chungbuk","chungnam","jeonbuk","gyeongbuk","gyeongnam","jeju"] as const
  ).map((regionId, i) => {
    const regionMap: Record<string, string> = {
      busan: "부산", daegu: "대구", incheon: "인천",
      gwangju_jeonnam: "광주·전남", daejeon: "대전", ulsan: "울산",
      sejong: "세종", gyeonggi: "경기", gangwon: "강원",
      chungbuk: "충북", chungnam: "충남", jeonbuk: "전북",
      gyeongbuk: "경북", gyeongnam: "경남", jeju: "제주",
    };
    return {
      regionId,
      regionName: regionId.charAt(0).toUpperCase() + regionId.slice(1),
      regionNameKo: regionMap[regionId] ?? regionId,
      name: "TODO",         // TODO: 선관위 확정 후 업데이트
      orientation: "확정대기" as EduOrientation,
      orientationBasis: "TODO: 선관위 확정 후 공약·이력 기반 분류 예정",
      badge: "확정대기" as EduBadge,
      voteShare: 0,         // TODO: 선관위 확정 후 업데이트
      career: [],           // TODO
      pledges: [{ category: "기타" as EduPledgeCategory, title: "공약 수집 중", description: "선관위 공약마당 확인 후 기재 예정", source: "참고" as const }],
      isReelection: false,  // TODO
      noteDate: "2026-06-04",
      sources: [{ label: "선관위 당선인 정보", url: "https://info.nec.go.kr" }],
    };
  }),
];
