# AI 시험 부정행위 2026 — 리포트 상세설계

> 기획 원문: [ai-exam-cheating-2026.md](../../plan/202611/ai-exam-cheating-2026.md)
> 작성일 및 자료 기준일: 2026-11-18 (한국시간, 2027학년도 수능 시행 전)
> 문서 상태: **설계 작성 완료**

## 1. 개요와 구현 결정

| 항목 | 결정 |
|---|---|
| 제목 | AI 시험 부정행위 2026 완전 정리 \| 스마트안경·ChatGPT 어디까지 왔나 |
| URL | `/reports/ai-exam-cheating-2026/` |
| 검색 설명 | 2027학년도 수능 스마트안경 규정, 세무사·국가기술자격시험 적발 사례, 대학의 생성형 AI 평가 기준을 공식자료와 함께 비교합니다. |
| 페이지 패턴 | 기존 AI 학습 리포트의 `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent` 재사용 |
| 렌더링 | Astro 정적 생성. 본문, 비교표, 출처 링크, 날짜를 초기 HTML에 렌더링 |
| 탐색 | 섹션 앵커와 `SeoContent`의 기본 FAQ 접기·펼치기 |
| 분류 | 홈과 리포트 허브에서 기존 AI 학습 리포트와 같은 `life` |
| 콘텐츠 범위 | 수능, 국가자격시험, 대학별 입학고사, 대학 교과 평가. 토익과 고교 내신은 범위와 출처가 확인된 경우 보조 사례로 수록 |

## 2. 파일 구조와 책임

| 파일 | 향후 변경 | 책임 |
|---|---|---|
| `src/data/aiExamCheating2026.ts` | 신규 | 메타, 기준일, 출처 목록, 수능 타임라인, 사례, 규정 비교, FAQ, 관련 링크, 갱신 이력 |
| `src/pages/reports/ai-exam-cheating-2026.astro` | 신규 | 공통 컴포넌트 조합, 본문 렌더링, Article 구조화 데이터 |
| `src/styles/scss/pages/_ai-exam-cheating-2026.scss` | 신규 | 페이지 전용 `aec-` 스타일과 비교표의 모바일 대응 |
| `src/styles/app.scss` | 수정 | 페이지 스타일 `@use` 등록 |
| `src/data/reports.ts` | 수정 | 제목·설명·slug·배지·정렬 등록. 순서는 구현 시 기존 값과 중복 확인 |
| `src/pages/index.astro`, `src/pages/reports/index.astro` | 수정 | 양쪽 `reportMetaBySlug`에 `life` 등록 |
| `public/sitemap.xml` | 수정 | 슬래시 포함 정규 URL 1건 등록 |
| `public/og/reports/ai-exam-cheating-2026.png` | 신규 | 제목과 비교 범위를 담은 공유 이미지. 기존 리포트 OG 생성 방식 적용 |

페이지 전용 스크립트와 차트 라이브러리 없이 섹션 앵커, 표, 기본 FAQ를 사용한다.

## 3. 데이터 구조와 표시 규칙

| 데이터 | 주요 필드 | 표시와 갱신 규칙 |
|---|---|---|
| 메타 | `slug`, `title`, `description`, `ogImage`, `asOf`, `datePublished`, `dateModified` | `asOf`는 조사 기준일이다. 공개일·수정일은 실제 게시·수정 시 확정한다. |
| 출처 | `id`, `publisher`, `title`, `url`, `publishedAt`, `checkedAt`, `kind` | `kind`는 기관 발표·법령·연구/지침·언론 보도. 발표일 미상은 생략하고 열람일을 기록한다. |
| 수능 타임라인 | `date`, `summary`, `status`, `sourceIds` | 날짜 오름차순. 대응계획, 시행 전 안내, 확인된 시행 결과를 각 행의 상태로 표시한다. |
| 사례 | `id`, `examType`, `examName`, `occurredOn`, `reportedOn`, `summary`, `evidence`, `stage`, `sourceIds` | 발생일이 불명확하면 확인 가능한 월·시기를 표시한다. 근거와 사건 진행 상태를 함께 보여준다. 후속 발표는 같은 사례 행을 갱신한다. |
| 규정 비교 | `examType`, `scope`, `conduct`, `consequence`, `authority`, `effectiveOn`, `sourceIds` | 하나의 시험 유형에 여러 행을 둔다. 적용 요건·주체·해당 시험을 처분과 같은 행에 표시한다. |
| 수능 집계 | `examDate`, `publishedAt`, `overallCount`, `deviceCount`, `aiCount`, `status`, `sourceIds` | 시행 전에는 집계를 표시하지 않는다. 시행 후 숫자 미공개는 null로 저장해 “미공개”로 표시한다. 기관이 명시한 0건은 0으로 표시한다. |
| FAQ·이력 | `question`, `answer`, `sourceIds`; `date`, `summary`, `sourceIds` | FAQ는 기획서의 6문항을 기준으로 작성한다. 갱신 시 관련 FAQ와 요약을 함께 확인한다. |

- 근거 배지는 `공식`·`참고`·`해석`을 사용한다. 사례 단계는 보도, 기관 적발 확인, 수사의뢰, 처분 절차 개시, 확정 처분 중 최신 원문으로 입증되는 상태를 표시한다. 수사와 행정 처분이 병행되면 양쪽 상태를 기재한다.
- 출처는 행 또는 해당 주장 직후에 표시한다. 출처 ID를 통해 하단의 기관명·문서명·발표일·열람일로 연결한다.
- 적발 수에는 기관·기간·대상·단위를 붙인다. 공단의 12건은 적발·수사의뢰 건수이고 491개와 37개는 전수조사 대상 종목 수다. 전국 규모나 연도별 증가율은 동일 정의·기간·분모가 확보된 경우에만 산출한다.
- 사례의 생성형 AI 제품명은 원자료에서 확인되는 범위로 제한한다. 기기 유형과 확인된 행위 및 후속 절차 중심으로 쓴다.

## 4. 화면 구성과 문구

| 순서 | 앵커 | 초기 화면과 내용 |
|---|---|---|
| 1 | `#overview` | H1 하나, 기준일과 “수능 시행 전” 표시, 핵심 요약. 주요 섹션으로 이동하는 본문 목차 |
| 2 | `#csat` | 시험일과 최신 교육부 안내 링크, 제출·소지·사용·확인 불응 비교, 정부 발표 타임라인 |
| 3 | `#cases` | 공식 사례 먼저 배치. 공단 적발·수사의뢰와 세무사 처분 착수의 문구를 각각 표시. 대학 논술·교과 언론 보도는 참고 배지 표시 |
| 4 | `#rules` | 시험 유형, 규정 적용 대상, 행위, 처분, 주관기관 안내를 비교. 대학은 전형과 교과 평가를 구분 |
| 5 | `#assessment` | 감독형·구술 등 독립 수행 확인 방식과 AI 사용 공개·과정 제출형 평가 비교. 채점 부담, 접근성, 소명 절차를 함께 설명 |
| 6 | `#sources` | 조사 범위, 집계 단위, 출처 목록, 확인일, 갱신 이력 |
| 7 | `#faq` | `SeoContent`에 소개 4단락, FAQ 6개, AI 학습 리포트와 AI 과외·학원비 비교 링크 제공 |

초기 수능 요약 문구는 “2027학년도 수능은 2026년 11월 19일 시행 예정입니다. 11월 18일 교육부가 강화된 예방조치에 따른 수험생 유의사항을 추가 안내했습니다.”로 둔다. 시행 후 첫 갱신에서는 시험일 문구를 과거형으로 전환하고 결과의 공개 상태를 같은 위치에 표시한다.

비교표에 설명이 있는 `caption`과 열·행 제목을 제공한다. 좁은 화면에서는 페이지 전체 너비를 유지한 채 표 영역에서 가로 스크롤이 가능하게 한다. 스크롤 영역은 키보드로 접근할 수 있고, 배지는 색과 함께 문구로 상태를 전달한다. 출처 링크에는 기관과 문서명이 드러나는 라벨을 사용한다.

## 5. 공식자료 대조와 게시 전 확인

| 항목 | 설계 기준과 확인할 사항 |
|---|---|
| 수능 조치 | 11월 17일 담화의 검사 계획과 11월 18일 추가 안내를 사용한다. 구현 전에 추가 안내 첨부와 해당 학년도 공지에서 제출 시점·허용 물품·편의 예외를 확인한다. [총리 담화](https://www.opm.go.kr/opm/news/press-release.do?articleNo=164199&mode=view), [교육부 추가 안내](https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=107693&lev=0&m=020402&s=moe) |
| 수능 제재 | 소지·미제출, 사용·착용, 확인 불응의 적용 요건을 현행 법령·훈령과 해당 학년도 안내로 대조한다. 형사 절차는 행정 제재와 별도 문장에 둔다. [교육부 스마트안경 문답](https://www.moe.go.kr/boardCnts/view.do?boardID=340&boardSeq=107580&lev=0&m=020501&s=moe), [고등교육법 제34조](https://www.law.go.kr/법령/고등교육법/제34조) |
| 수능 시행 후 | 교육부·평가원·교육청의 전체 및 세부 적발 집계, 잠정·확정 여부, 후속 발표를 확인한다. 공개 수치에 맞춰 요약·집계·FAQ를 한 번에 갱신한다. [관계부처 회의 자료](https://www.opm.go.kr/opm/news/press-release.do?articleNo=164181&attachNo=157820&mode=download) |
| 세무사·국가자격시험 | 세무사 시험 무효 및 해당 시험 5년 응시자격 정지는 절차 개시 상태로 표기한다. 확정 처분, 수사 결과 및 공단 전수조사 발표를 재확인한다. [국세청 관계기관 자료](https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1356171), [한국산업인력공단 발표](https://webzine.hrdkorea.or.kr/section/press/view?id=13805) |
| 대학 사례·평가 | 논술 처분은 실제 적용된 모집요강이나 입학처 공지를 확보한 범위에서 명시한다. 교과 평가에는 강의별 허용 범위와 학교 지침을 적용한다. [연세대 생성형 AI 가이드라인](https://ghe.yonsei.ac.kr/research/notice.do?articleNo=454652&attachNo=196395&mode=download), [TEQSA 평가 개편 적용 사례](https://www.teqsa.gov.au/guides-resources/resources/corporate-publications/enacting-assessment-reform-time-artificial-intelligence) |

## 6. SEO와 구현 완료 기준

- [ ] canonical, OG URL, 리포트 목록, 사이트맵이 슬래시 포함 URL을 사용한다. H1과 메타 설명은 기획과 일치한다.
- [ ] `BaseLayout`에 Article JSON-LD를 전달한다. 게시일과 갱신일은 화면과 일치시키고, FAQ 구조화 데이터 사용 시 화면의 FAQ와 동일한 원본에서 생성한다.
- [ ] 수능 시행 전·후와 집계 미공개·0건 표시를 각각 확인한다. 제재 문구의 적용 요건, 사건 단계, 출처 링크를 원문과 대조한다.
- [ ] 홈·리포트 허브 카드 경로, 페이지 내 앵커, 모바일 표, 키보드 탐색, FAQ 펼침과 관련 링크를 확인한다.
- [ ] 구현 완료 후 저장소 기준에 따라 빌드를 실행하고 결과를 확인한다.
