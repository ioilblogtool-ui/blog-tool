import { IST_SCHOOLS, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export type SchoolTypeRow = {
  type: string;
  legalBasis: string;
  koreanQuota: string;
  residencyRequirement: string;
  academicRecognition: string;
};

export type MisconceptionRow = { misconception: string; reality: string };

export const ISF_META = {
  slug: "international-school-vs-foreign-school-2026",
  title: "국제학교 vs 외국인학교, 헷갈리는 차이 정리",
  seoTitle: "국제학교 vs 외국인학교 2026 | 입학조건·학비 차이 완전정리",
  seoDescription:
    "국제학교, 외국인학교, 외국교육기관의 입학자격과 학비 차이를 비교합니다. 내국인 입학 가능 여부까지 확인하세요.",
  description: "국제학교·외국인학교·외국교육기관·미인가 국제학교, 4가지 유형의 법적 근거와 입학자격 차이를 정리했습니다.",
  updatedAt: "2026-07-08",
  verificationNote:
    "이 페이지의 법령명과 수치는 2026-07-08 웹검색 기준이며, 국가법령정보센터 원문·교육부 공식 발표로 재검증을 권장합니다.",
};

export const ISF_TYPE_ROWS: SchoolTypeRow[] = [
  {
    type: "외국인학교",
    legalBasis: "「외국인학교 및 외국인유치원 설립·운영에 관한 규정」(교육부)",
    koreanQuota: "정원의 30% (교육감 재량 시 50%)",
    residencyRequirement: "해외 거주 합산 3년 이상 + 학교장 판단(한국어 능력·문화 적응)",
    academicRecognition: "정식 학력 인정",
  },
  {
    type: "국제학교 (외국교육기관, 제주국제학교 등)",
    legalBasis: "「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」",
    koreanQuota: "제한 없음",
    residencyRequirement: "제한 없음",
    academicRecognition: "정식 학력 인정",
  },
  {
    type: "미인가 국제학교",
    legalBasis: "법적 근거 없음 (사설 교육시설)",
    koreanQuota: "제한 없음",
    residencyRequirement: "제한 없음",
    academicRecognition: "학력 인정 안 됨 — 검정고시 필요",
  },
];

export const ISF_MISCONCEPTIONS: MisconceptionRow[] = [
  {
    misconception: "영어로 수업하면 다 국제학교다",
    reality: "수업 언어와 무관하게 법적 유형(외국인학교/국제학교/미인가)이 다르고, 유형에 따라 입학 자격과 학력 인정 여부가 완전히 달라집니다.",
  },
  {
    misconception: "외국인학교는 한국인도 자유롭게 갈 수 있다",
    reality: "외국인학교는 내국인 정원이 30%(교육감 재량 시 50%)로 제한되고, 해외 거주 3년 이상 등 별도 요건을 충족해야 합니다.",
  },
  {
    misconception: "미인가 국제학교도 정규 학력으로 인정된다",
    reality: "미인가 국제학교는 초중등교육법상 정식 학교가 아니라 학력이 인정되지 않습니다. 국내 대학 진학·병역을 위해서는 검정고시가 필요합니다.",
  },
  {
    misconception: "학비만 내면 입학할 수 있다",
    reality: "대부분의 학교가 영어 능력 시험, 학년별 배치고사, 학생·학부모 인터뷰, 이전 학교 추천서를 함께 요구합니다.",
  },
  {
    misconception: "국제학교를 나오면 무조건 해외 대학 진학에 유리하다",
    reality: "커리큘럼(IB/AP/A-Level)과 실제 성적·활동 내역이 중요하며, 국제학교 졸업 자체가 진학을 보장하지 않습니다.",
  },
];

// 이 클러스터 7개교의 유형 분류 — 구현 전 각 학교 공식 분류 재확인 필요
export const ISF_SCHOOL_CLASSIFICATION: { schoolId: string; typeLabel: string }[] = [
  { schoolId: "nlcs-jeju", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "branksome-hall-asia", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "kis-jeju", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "sja-jeju", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "chadwick-songdo", typeLabel: "외국인학교 (재확인 필요)" },
  { schoolId: "sfs-seoul", typeLabel: "외국인학교" },
  { schoolId: "dulwich-seoul", typeLabel: "외국인학교 (재확인 필요)" },
];

export const ISF_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS;

export const ISF_FAQ: FaqItem[] = [
  {
    question: "국제학교와 외국인학교, 법적으로 뭐가 다른가요?",
    answer:
      "외국인학교는 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」의 적용을 받아 내국인 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 반면 제주국제학교 등 국제학교(외국교육기관)는 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」에 근거해 내국인 입학 제한이 없습니다.",
  },
  {
    question: "미인가 국제학교에 보내면 학력이 인정되나요?",
    answer:
      "아니요. 미인가 국제학교는 초중등교육법상 정식 '학교'로 인정되지 않아 국내 학력으로 인정되지 않습니다. 국내 대학 진학이나 병역 관련 학력 증빙을 위해서는 검정고시에 별도로 응시해야 합니다.",
  },
  {
    question: "내국인이 외국인학교에 입학하려면 어떤 조건을 채워야 하나요?",
    answer:
      "출생 이후 해외 체류 기간이 합산 3년(1,095일) 이상이어야 하며, 학교장이 한국어 능력이 현저히 부족하거나 문화적 차이로 학교 부적응 우려가 있다고 판단해야 입학할 수 있습니다. 체류는 연속적이지 않아도 되고 부모 동반도 필수가 아닙니다.",
  },
  {
    question: "이 클러스터의 7개교는 각각 어떤 유형인가요?",
    answer:
      "제주 4개교(NLCS, Branksome Hall Asia, KIS Jeju, SJA Jeju)는 국제학교(외국교육기관)로 내국인 입학 제한이 없습니다. 서울·송도 3개교(Chadwick, SFS, Dulwich)는 외국인학교로 분류되어 내국인 정원 제한이 적용되는 것으로 추정되나, 학교별 정확한 법적 분류는 재확인이 필요합니다.",
  },
  {
    question: "제주 국제학교에 내국인이 몰리면 정원이 줄어들지 않나요?",
    answer:
      "제주 국제학교는 정원 제한 자체가 없어 외국인학교처럼 '내국인 정원 30% 초과' 문제가 발생하지 않습니다. 다만 실제 합격은 입학 시험과 정원 경쟁에 따라 달라지므로, 법적 자격과 합격 가능성은 별개입니다.",
  },
];

export const ISF_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
  { href: "/reports/seoul-international-school-comparison-2026/", label: "서울·경기 국제학교 비교" },
  { href: "/reports/international-school-admission-guide-2026/", label: "국제학교 입학조건 체크리스트" },
];
