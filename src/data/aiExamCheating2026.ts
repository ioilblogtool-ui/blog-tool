export const EXAM_META = {
  slug: "ai-exam-cheating-2026",
  title: "AI 시험 부정행위 2026 완전 정리 | 스마트안경·ChatGPT 어디까지 왔나",
  description: "2027학년도 수능 스마트안경 규정, 세무사·국가기술자격시험 적발 사례, 대학의 생성형 AI 평가 기준을 공식자료와 함께 비교합니다.",
  asOf: "2026-11-18",
  examDate: "2026-11-19",
  ogImage: "/og/reports/ai-exam-cheating-2026.png",
} as const;

export const examSources = ([
  ["edu","교육부","2027 수능 강화된 부정행위 예방조치에 따른 수험생 유의사항 추가 안내","2026-11-18","https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=107693&lev=0&m=020402&s=moe"],
  ["check","교육부","수능 필기구·복장·검사 유의사항","2026-11-18","https://m.korea.kr/multi/visualNewsView.do?newsId=148976013"],
  ["rules","교육부","시험 중 스마트 안경, 착용만 해도 부정행위일까?","2026-11-06","https://www.moe.go.kr/boardCnts/view.do?boardID=340&boardSeq=107580&lev=0&m=020501&s=moe"],
  ["law","국가법령정보센터","고등교육법 제34조",null,"https://www.law.go.kr/법령/고등교육법/제34조"],
  ["speech","국무조정실","수능 부정행위 대응 관련 대국민 담화문","2026-11-17","https://www.opm.go.kr/opm/news/press-release.do?articleNo=164199&mode=view"],
  ["tf","관계부처 합동","AI 활용 부정행위 대응 관계부처 회의","2026-11-16","https://www.opm.go.kr/opm/news/press-release.do?articleNo=164181&attachNo=157820&mode=download"],
  ["initial","교육부","대학수학능력시험 스마트안경 활용 부정행위 관련 대응계획","2026-10-29","https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=107520&lev=0&m=020402&s=moe"],
  ["tax","국세청","세무사 시험 부정행위 대응 TF 및 시험 무효 절차 개시","2026-11-17","https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1356171"],
  ["hrd","한국산업인력공단","국가자격시험 AI 활용 부정행위 전수조사","2026-11-16","https://webzine.hrdkorea.or.kr/section/press/view?id=13805"],
  ["essay","연합뉴스","대입 논술시험 스마트안경 관련 적발 보도","2026-10-13","https://www.yna.co.kr/view/AKR20261013090600004"],
  ["campus","연합뉴스","대학 교과 시험 AI 사용 논란 보도","2025-11-09","https://www.yna.co.kr/view/AKR20251101048451004"],
  ["yonsei","연세대학교","생성형 AI 활용 가이드라인","2025-08","https://ghe.yonsei.ac.kr/research/notice.do?articleNo=454652&attachNo=196395&mode=download"],
  ["teqsa","호주 고등교육 품질기준원","생성형 AI 시대 평가 개편 적용 사례",null,"https://www.teqsa.gov.au/guides-resources/resources/corporate-publications/enacting-assessment-reform-time-artificial-intelligence"],
] as const).map(([id, publisher, title, publishedAt, url]) => ({
  id, publisher, title, publishedAt, url, checkedAt: EXAM_META.asOf,
}));

export const examTimeline = [
  ["2026-10-29","대응계획","교육부가 수능 스마트안경 부정행위 대응계획을 발표했습니다.",["initial"]],
  ["2026-11-06","제재 안내","교육부가 소지, 사용·착용, 확인 요구 불응에 따른 제재를 안내했습니다.",["rules"]],
  ["2026-11-16","관계부처 회의","범정부 TF 구성과 국가 주관시험 운영체계 재검토를 지시했습니다.",["tf"]],
  ["2026-11-17","사전점검 발표","1교시 전 안경 전수검사와 휴대물품 점검 강화, 3교시 전 휴대물품 재점검 방침을 밝혔습니다.",["speech"]],
  ["2026-11-18","수험생 추가 안내","교육부가 필기구, 복장, 안경과 휴대물품 점검에 관한 유의사항을 추가 안내했습니다.",["edu","check"]],
] as const;

export const examCases = [
  ["tax-accountant","제63회 세무사 시험","2026년 11월 공개","공식","처분 절차 개시","관계기관이 시험 무효와 세무사 시험 응시자격 5년 정지 절차 착수를 발표했습니다. 형사 고소도 발표했습니다.",["tax"]],
  ["national-certification","공단 시행 국가자격시험","2026년","공식","적발·수사의뢰","공단은 소방설비기사·정보처리기사 등을 포함한 스마트안경 관련 12건을 적발해 수사의뢰했다고 밝혔습니다. 전수조사 대상은 국가기술자격 491개 종목과 국가전문자격 37개 종목입니다.",["hrd"]],
  ["university-essay","대학별 수시 논술","2026년 10월","참고","적발 보도","연세대와 서울시립대 논술의 스마트안경 관련 적발이 보도됐습니다. 개별 처분은 각 대학과 전형의 공지에서 확인해야 합니다.",["essay"]],
  ["university-course","대학 교과 평가","2025년 11월","참고","정황 보도","연세대 교과 시험에서 생성형 AI 사용 정황이 보도됐습니다. 확정 인원과 징계 결과는 이 집계에 포함하지 않았습니다.",["campus"]],
] as const;

export const examRules = [
  ["수능","반입 금지 스마트기기 미제출·소지","정해진 시점까지 제출하지 않아 소지하면 해당 시험 무효가 적용됩니다.","교육부·시험 감독관",["rules","edu"]],
  ["수능","시험 중 스마트기기 사용·착용","해당 시험 무효와 다음 해 수능 응시자격 제한이 적용됩니다.","교육부·시험 감독관",["rules","law"]],
  ["수능","스마트안경 확인 요구 불응","심의 결과에 따라 해당 시험 무효 및 다음 해 응시자격 제한이 적용될 수 있습니다.","교육부·부정행위 심의",["rules","law"]],
  ["국가자격시험","종목 규정상 금지된 기기나 외부 도움 사용","종목별 근거 규정에 따라 처리합니다. 세무사 시험의 5년 제한은 해당 사건의 처분 착수 발표에 해당합니다.","해당 종목 시행기관",["tax","hrd"]],
  ["대학별 입학고사","전형별 금지 물품 소지·사용","해당 전형 모집요강과 입학처 공지에서 무효, 불합격, 추가 제재 요건을 확인합니다.","해당 대학 입학처",["essay"]],
  ["대학 교과 평가","강의에서 허용한 범위를 벗어난 AI 사용","성적 처리와 학칙상 징계 절차는 학교와 수업에 따라 달라집니다.","담당 교수·해당 대학",["yonsei"]],
] as const;

export const examFaq = ([
  ["일반 안경도 수능에서 검사하나요?","11월 17일 총리 담화는 1교시 전 착용한 안경을 내려놓고 스마트안경 여부를 확인한다고 밝혔습니다. 의료상 필요한 기기나 시험 편의는 관할 교육청과 최신 수험생 안내에서 확인하세요.",["speech","edu"]],
  ["스마트안경을 가지고만 있어도 수능이 무효인가요?","반입 금지 물품을 정해진 시점까지 제출하지 않아 소지하면 해당 시험이 무효 처리될 수 있습니다. 시험 중 사용·착용과 확인 요구 불응에는 별도 요건이 적용됩니다.",["rules","edu"]],
  ["세무사 시험의 5년 제한이 모든 국가자격시험에 적용되나요?","5년 응시자격 정지는 제63회 세무사 시험 사건에 대해 발표된 처분 절차에 해당합니다. 응시하는 종목의 시행 공고에서 해당 종목의 제재 기준을 확인하세요.",["tax"]],
  ["대학 시험에서 ChatGPT를 써도 되나요?","강의계획서와 담당 교수가 밝힌 시험별 허용 도구, 사용 범위, 표기 기준을 확인하세요. 사용이 허용된 과제에서도 도구명과 활용 범위를 밝혀야 할 수 있습니다.",["yonsei"]],
  ["AI 탐지 도구 결과만으로 부정행위가 확정되나요?","연세대 가이드라인은 생성형 AI 탐지 도구를 보조적으로 사용하도록 안내합니다. 부정행위 판단과 성적 처리는 학교 지침과 증거·소명 검토 절차에 따릅니다.",["yonsei"]],
  ["2027학년도 수능에서 AI 부정행위가 실제 적발됐나요?","이 리포트의 기준일인 2026년 11월 18일에는 해당 수능이 시행되기 전입니다. 시행 이후 발표에서 전체 적발과 스마트기기 또는 AI 관련 집계의 공개 여부를 확인할 수 있습니다.",["tf","edu"]],
] as const).map(([question, answer, sourceIds]) => ({ question, answer, sourceIds }));

export const examRelated = [
  { href: "/reports/chatgpt-exam-policy-2026/", label: "ChatGPT 시험·과제 사용 규정 2026" },
  { href: "/reports/ai-learning-vs-academy-2026/", label: "AI 학습 도구와 학원 비용·효과 비교" },
  { href: "/tools/ai-tutoring-vs-academy-cost/", label: "AI 과외·학원비 비교 계산기" },
];
