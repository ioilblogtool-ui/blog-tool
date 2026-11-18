export const CHATGPT_EXAM_META = {
  slug: "chatgpt-exam-policy-2026",
  title: "ChatGPT 시험 사용 어디까지 허용될까 2026 | AI 사용 규정 정리",
  description: "대학 오픈북·온라인 시험과 과제에서 ChatGPT를 어디까지 쓸 수 있는지 공식 지침으로 비교합니다. AI 사용이 허용될 때 밝힐 내용과 시험 전 확인할 공지를 정리했습니다.",
  asOf: "2026-11-18",
  ogImage: "/og/reports/chatgpt-exam-policy-2026.png",
} as const;

export const policySources = {
  "pusan": {
    "publisher": "부산대학교",
    "title": "교육 분야 AI 활용 가이드라인",
    "url": "https://culedu.pusan.ac.kr/bbs/culedu/1850/1448039/download.do",
    "scope": "평가·과제의 허용 범위 및 사용 내역 표기"
  },
  "korea": {
    "publisher": "고려대학교 학부대학 원격교육센터",
    "title": "온라인 평가의 부정행위 방지 가이드라인 (2026-01-16)",
    "url": "https://homedu.korea.ac.kr/homedu/board/notice.do?articleNo=808833&attachNo=315078&mode=download&totalBoardNo=&totalNoticeYn=",
    "scope": "온라인 평가 운영 및 사전 안내"
  },
  "qnet": {
    "publisher": "한국산업인력공단 큐넷",
    "title": "국가기술자격 수험 안내",
    "url": "https://www.q-net.or.kr/man001.do?gId=04",
    "scope": "공단 시행 국가기술자격시험의 전자통신기기 제한"
  },
  "moe": {
    "publisher": "교육부",
    "title": "2027학년도 수능 수험생 유의사항 추가 안내 (2026-11-18)",
    "url": "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=107693&lev=0&m=020402&s=moe",
    "scope": "해당 학년도 수능 시험장 운영"
  }
} as const;

export const policyStatus = {
  prohibited: "금지",
  allowed: "허용",
  conditional: "조건부 허용",
  unconfirmed: "규정 미확인",
} as const;

type PolicyRow = {
  evaluation: string;
  scope: string;
  materials: string;
  internet: string;
  status: keyof typeof policyStatus;
  nextStep: string;
  contact: string;
  sourceIds: readonly (keyof typeof policySources)[];
};

export const policyRows: readonly PolicyRow[] = [
  {evaluation: "대학 감독 시험", scope: "해당 대학·과목", materials: "시험 안내에서 확인", internet: "시험 안내에서 확인", status: "unconfirmed", nextStep: "감독형 시험의 허용 도구 목록과 강의계획서를 대조하세요.", contact: "담당 교수", sourceIds: ["pusan"]},
  {evaluation: "대학 온라인 시험", scope: "해당 과목", materials: "시험 공지에서 확인", internet: "온라인 접속과 외부 검색을 각각 확인", status: "unconfirmed", nextStep: "시험 사이트 접속 외에 검색·AI 사용도 가능한지 확인하세요.", contact: "담당 교수", sourceIds: ["korea"]},
  {evaluation: "오픈북 시험", scope: "가상 예시 · 교재만 허용", materials: "지정 교재", internet: "별도 확인", status: "unconfirmed", nextStep: "교재 열람 안내에 AI 규정이 없으면 시험 공지와 상위 지침을 확인하고 담당자에게 문의하세요.", contact: "담당 교수", sourceIds: []},
  {evaluation: "과제·보고서", scope: "가상 예시 · 초안 검토만 명시 허용", materials: "지정 자료", internet: "별도 확인", status: "allowed", nextStep: "과제 공지에서 AI를 초안 검토에만 허용하고 별도 공개 조건을 두지 않은 경우입니다. 제출 전 적용되는 대학 지침도 확인하세요.", contact: "담당 교수", sourceIds: []},
  {evaluation: "과제·보고서", scope: "가상 예시 · 문장 교정과 공개", materials: "지정 자료", internet: "별도 확인", status: "conditional", nextStep: "교정만 사용하고 도구명·목적·범위를 밝히라는 조건을 따르세요.", contact: "담당 교수", sourceIds: ["pusan"]},
  {evaluation: "학위논문·학술지 논문", scope: "소속기관과 제출처별", materials: "연구윤리 지침 확인", internet: "제출처 지침 확인", status: "unconfirmed", nextStep: "연구윤리·저자 안내에서 허용 작업과 공개 위치를 확인하세요.", contact: "학과·편집부", sourceIds: []},
  {evaluation: "코딩 시험", scope: "전형·플랫폼별", materials: "공식 문서 열람 범위 확인", internet: "외부 접속 범위 확인", status: "unconfirmed", nextStep: "기본 편집기 자동완성, 생성형 코드 제안, AI 채팅의 허용 여부를 각각 확인하세요.", contact: "시험 운영기관", sourceIds: []},
  {evaluation: "국가기술자격시험", scope: "한국산업인력공단 시행 시험", materials: "종목별 지참물 확인", internet: "전자통신기기 제한", status: "prohibited", nextStep: "시험 중 제한된 전자통신기기를 통한 AI 사용은 금지됩니다. 전문자격시험은 해당 종목 공고를 확인하세요.", contact: "종목 시행기관", sourceIds: ["qnet"]},
  {evaluation: "수능", scope: "2027학년도 수능 시험장", materials: "수험생 유의사항 확인", internet: "반입 금지 전자기기 제한", status: "prohibited", nextStep: "스마트기기 등 반입 금지 전자기기를 이용한 AI 사용은 금지됩니다.", contact: "교육부·관할 교육청", sourceIds: ["moe"]},
];

export const policyFaq = [
  { question: "오픈북 시험에서 ChatGPT를 사용해도 되나요?", answer: "오픈북은 열람할 수 있는 자료를 지정합니다. 자료 열람, 인터넷 검색, 생성형 AI 사용이 각각 허용되는지 공지와 담당자를 통해 확인하세요." },
  { question: "AI 금지 문구가 없으면 써도 되나요?", answer: "시험 공지와 강의계획서, 적용되는 대학 지침을 함께 확인하세요. 허용 범위가 명확하지 않으면 도구명과 사용하려는 기능을 적어 담당자에게 먼저 문의하세요." },
  { question: "과제 문장 교정이나 번역도 공개해야 하나요?", answer: "공개 요건은 해당 과제 공지를 따릅니다. 사용이 허용됐고 공개가 필요하다면 도구명, 목적, 적용 범위를 적고 추가 제출 조건도 확인하세요." },
  { question: "코딩 시험에서 AI 자동완성을 사용해도 되나요?", answer: "편집기 기본 자동완성과 생성형 코드 제안은 기능이 다릅니다. 운영기관 공지에서 확장 기능과 AI 채팅까지 각각 허용되는지 확인하세요." },
  { question: "논문에 생성형 AI를 사용하면 어디에 밝혀야 하나요?", answer: "소속기관의 연구윤리 지침과 제출처의 저자 안내를 확인하세요. 공개 위치와 공개할 정보는 학위논문 제출 기준 또는 학술지 지침에 따릅니다." },
  { question: "수능이나 국가자격시험에도 대학의 허용 기준이 적용되나요?", answer: "수능 수험생은 해당 학년도 공식 유의사항을 따릅니다. 국가자격시험 응시자는 자신이 응시하는 종목의 시행 공고와 시험장 안내를 확인하세요." },
];

export const policyRelated = [
  { href: "/reports/ai-exam-cheating-2026/", label: "AI 시험 부정행위 2026 사례·제재 비교" },
  { href: "/reports/ai-learning-vs-academy-2026/", label: "AI 학습 도구와 학원 비교" },
  { href: "/reports/ai-coding-tools-comparison-2026/", label: "AI 코딩 도구 비교" },
];

export const policyIntro = [
  "오픈북 시험에서 볼 수 있는 자료는 강의마다 다릅니다. 안내에서 교재와 개인 노트만 열람할 수 있다고 하면 먼저 허용된 자료 목록을 확인하세요. 온라인 시험이라서 인터넷에 접속해야 하는 경우에도 시험 플랫폼 접속, 외부 검색, 생성형 AI 사용은 각각 확인할 항목입니다. 공지에 AI가 명시되지 않았다면 평가 시작 전에 허용 여부를 문의할 수 있습니다.",
  "대학 감독 시험은 시험 당일 수험 안내와 강의계획서를, 온라인 시험은 평가 플랫폼 공지와 담당 교수의 안내를 함께 살펴보세요. 과제와 보고서는 아이디어 정리, 번역, 교정, 초안 생성의 허용 범위가 서로 다를 수 있습니다. 학교 공통 지침과 과목 공지의 적용 관계가 모호하면 사용하려는 도구와 기능을 구체적으로 적어 담당자에게 확인하세요.",
  "과제에서 AI 사용이 허용됐더라도 제출 시 사용 사실을 공개해야 할 수 있습니다. 부산대 교육 분야 지침의 예시처럼 도구명과 사용 목적, 사용한 부분을 기록해 두면 실제 활용 범위를 설명하기 쉽습니다. AI가 제시한 인용과 사실은 원자료로 검증하고, 프롬프트 또는 출력 내역을 함께 제출해야 하는지는 평가 공지에서 확인하세요.",
  "국가기술자격시험과 수능은 반입 물품과 전자통신기기 사용에 관한 공식 안내를 확인해야 합니다. 코딩 시험에서는 기본 자동완성과 생성형 코드 제안 및 채팅 기능이 허용되는지 구분해 확인하세요. 논문은 연구윤리 지침과 학위논문 제출처 또는 학술지의 저자 안내를 함께 봐야 합니다. 이 리포트의 자료 기준일과 아래 원문 링크에서 적용 범위를 확인할 수 있습니다.",
];
