export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export type TimelineStep = {
  timing: string;
  title: string;
  detail: string;
};

export type DocumentItem = {
  category: string;
  items: string[];
};

export type AgeGuideRow = {
  ageGroup: string;
  focus: string;
  note: string;
};

export type InterviewQuestionGroup = {
  target: string;
  questions: string[];
};

export const ISG_META = {
  slug: "international-school-admission-guide-2026",
  title: "국제학교 입학, 뭐부터 준비해야 할까",
  seoTitle: "국제학교 입학조건 2026 완전 정리 | 준비 체크리스트",
  seoDescription:
    "국제학교 입학 자격, 시험 준비, 서류부터 미인가 학교 학력인정 리스크까지 체크리스트로 정리했습니다.",
  description: "입학 시기별 준비 타임라인, 서류 체크리스트, 미인가 학교 주의사항을 한 페이지에 정리했습니다.",
  updatedAt: "2026-07-08",
  verificationNote:
    "학교별 정확한 서류·시험 과목은 일반화한 내용이며, 최종 지원 전 개별 학교 최신 입학 요강 확인이 반드시 필요합니다.",
};

export const ISG_TIMELINE: TimelineStep[] = [
  { timing: "입학 1년~1년 반 전", title: "학교 리스트업·설명회 참석", detail: "관심 학교의 입학설명회(오픈하우스)에 참석해 커리큘럼과 분위기를 확인합니다." },
  { timing: "입학 6개월~1년 전", title: "서류 준비 시작", detail: "성적표·추천서·재학증명서 등 공통 서류를 준비합니다. 내국인은 해외 거주 증빙 서류도 함께 준비합니다." },
  { timing: "입학 3~6개월 전", title: "지원서 접수·시험 응시", detail: "학교별 입학 시험(영어·수학 등)과 인터뷰 일정에 맞춰 지원서를 접수합니다." },
  { timing: "입학 1~3개월 전", title: "합격 발표·등록금 납부", detail: "합격 후 예치금·입학금을 납부하고 등록을 완료합니다." },
  { timing: "입학 직전", title: "생활 준비", detail: "교복·통학(버스 또는 기숙사) 신청, 건강검진 등 학교별 생활 준비 사항을 확인합니다." },
];

export const ISG_DOCUMENTS: DocumentItem[] = [
  {
    category: "공통 서류",
    items: ["최근 2~3년 성적표(영문)", "재학증명서", "담임 추천서 1~2부", "여권 사본", "예방접종 증명서"],
  },
  {
    category: "내국인 추가 서류 (외국인학교 지원 시)",
    items: ["출입국사실증명원(해외 거주 3년 이상 증빙)", "가족관계증명서", "학교장 면담을 위한 한국어·문화 적응 관련 소명 자료"],
  },
  {
    category: "시험·인터뷰",
    items: ["영어 능력 시험(자체 또는 표준화 시험)", "학년별 수학·영어 배치고사", "학생 개별 인터뷰", "학부모 인터뷰(저학년일수록 비중 높음)"],
  },
];

export const ISG_AGE_GUIDE: AgeGuideRow[] = [
  { ageGroup: "유치부(만 3~5세)", focus: "영어 노출 정도, 부모 인터뷰 비중 높음", note: "시험보다 적응 가능성 위주로 평가하는 경우가 많음" },
  { ageGroup: "초등 저학년", focus: "기초 영어·수학 배치고사", note: "학년이 올라갈수록 빈 자리(TO)가 줄어드는 경향" },
  { ageGroup: "초등 고학년~중등", focus: "정식 입학 시험 + 인터뷰", note: "전 학년 성적표·추천서 비중 커짐" },
  { ageGroup: "고등", focus: "학업 성취도 + 목표 진학 대학 연계성", note: "특정 커리큘럼(IB/AP/A-Level) 전환 가능 여부 사전 확인 필요" },
];

export const ISG_INTERVIEW_QUESTIONS: InterviewQuestionGroup[] = [
  {
    target: "학부모 인터뷰 (유치부·초등 저학년 비중 높음)",
    questions: [
      "왜 이 학교를 선택하셨나요?",
      "가정에서 영어를 어떻게 노출시키고 있나요?",
      "자녀의 성격과 학습 스타일을 설명해 주세요.",
      "이후 진학 계획(국내 대학/해외 대학)은 어떻게 되나요?",
    ],
  },
  {
    target: "학생 인터뷰 (초등 고학년 이상)",
    questions: [
      "좋아하는 과목과 이유는 무엇인가요?",
      "친구와 갈등이 생기면 어떻게 해결하나요?",
      "본인의 장점과 개선하고 싶은 점은 무엇인가요?",
      "취미나 특별활동에 대해 이야기해 주세요.",
    ],
  },
];

export const ISG_ENGLISH_LEVEL_GUIDE = [
  { ageGroup: "유치부", level: "일상 대화 청취·간단한 반응 가능한 수준", note: "완벽한 회화보다 적응 가능성을 더 중시하는 경우가 많음" },
  { ageGroup: "초등 저학년", level: "기초 읽기·쓰기, 간단한 문장 구사", note: "배치고사에서 어휘·문법 기초를 확인" },
  { ageGroup: "초등 고학년~중등", level: "학년 수준의 독해·에세이 작성", note: "성적표·추천서로 기존 영어 학습 이력도 함께 평가" },
  { ageGroup: "고등", level: "학술 영어(에세이, 토론) 수준", note: "IB/AP/A-Level 전환 가능 여부와 함께 평가" },
];

export const ISG_FAQ: FaqItem[] = [
  {
    question: "국제학교 입학시험은 뭘 준비해야 하나요?",
    answer:
      "대부분 영어 능력 시험(자체 시험 또는 표준화 시험)과 학년별 수학 배치고사, 학생 인터뷰가 기본입니다. 저학년일수록 학부모 인터뷰 비중이 높아지는 경향이 있습니다. 정확한 과목·형식은 학교별로 다르므로 최신 입학 요강을 확인해야 합니다.",
  },
  {
    question: "내국인이 외국인학교에 지원하려면 어떤 서류가 필요한가요?",
    answer:
      "공통 서류(성적표, 재학증명서, 추천서 등) 외에 해외 거주 3년 이상을 증빙하는 출입국사실증명원이 필요합니다. 자세한 자격 요건은 「국제학교 vs 외국인학교」 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "제주 국제학교는 준비가 더 간단한가요?",
    answer:
      "해외 거주 증빙 서류가 필요 없다는 점에서 서류 준비 부담은 적지만, 학교별 입학 시험과 인터뷰는 동일하게 거쳐야 합니다.",
  },
  {
    question: "몇 살부터 준비를 시작해야 하나요?",
    answer:
      "일반적으로 입학 1년~1년 반 전부터 학교 리스트업과 설명회 참석을 시작하는 것이 좋습니다. 학년이 올라갈수록 빈 자리(TO)가 줄어드는 경향이 있어 저학년일수록 여유 있게 준비하는 것이 유리합니다.",
  },
  {
    question: "미인가 국제학교를 준비할 때 특히 주의할 점은?",
    answer:
      "미인가 국제학교는 학력이 인정되지 않아 국내 대학 진학·병역을 위해 검정고시를 별도로 봐야 합니다. 지원 전 학교가 정식 인가 기관인지 반드시 확인하세요. 자세한 내용은 「국제학교 vs 외국인학교」 리포트를 참고하세요.",
  },
];

export const ISG_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
];
