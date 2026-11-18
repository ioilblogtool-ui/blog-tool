# 젠슨 황 사임·엔비디아 실적 2026 — 리포트 상세설계

> 기획 원문: [nvidia-jensen-huang-earnings-2026.md](../../plan/202611/nvidia-jensen-huang-earnings-2026.md)
>
> 작성일 및 자료 기준일: 2026-11-18 (한국시간)
>
> 문서 상태: **설계 작성 완료**

## 1. 설계 결정

| 항목 | 결정 |
|---|---|
| 제목 | 젠슨 황 사임·엔비디아 실적 2026 \| AI 성장 계속될까 |
| 슬러그·URL | `nvidia-jensen-huang-earnings-2026` · `/reports/nvidia-jensen-huang-earnings-2026/` |
| 분류 | 홈과 리포트 목록의 `reportMetaBySlug`에 기존 AI 설비투자·반도체 리포트와 같은 `asset` |
| 구조 | Astro 정적 리포트. `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent` 재사용 |
| 읽는 순서 | 실적 요약 → 승계 타임라인 → 분기 비교 → Vera Rubin → 가이던스 → 출처·FAQ |
| 비교 범위 | NVIDIA 연결 실적 기준. 실적과 회사 전망을 각각의 표에 표시 |
| 상호작용 | 섹션 앵커와 기본 FAQ 펼침. 숫자 비교는 정적 표로 제공 |

첫 화면 문구는 “FY2027 3분기는 2026년 10월 25일에 종료됐고, 젠슨 황의 사임은 11월 11일 수리됐습니다. 이 분기 실적은 승계 이전 사업 기간을 집계합니다.”로 둔다. 제목의 2026은 달력연도이며 표는 NVIDIA 회계연도 명칭을 사용한다.

## 2. 렌더링 및 파일 책임

| 경로 | 향후 역할 |
|---|---|
| `src/data/nvidiaJensenHuangEarnings2026.ts` | 메타, 회계 기간과 실적, 가이던스, 타임라인, 제품 공개 상태, 출처, FAQ, 관련 링크 |
| `src/pages/reports/nvidia-jensen-huang-earnings-2026.astro` | 섹션별 정적 렌더링, 공통 레이아웃, 표와 출처 연결, Article 구조화 데이터 |
| `src/styles/scss/pages/_nvidia-jensen-huang-earnings-2026.scss` 및 `src/styles/app.scss` | 페이지 범위 `nje-` 스타일과 등록 |
| `src/data/reports.ts`, `src/pages/index.astro`, `src/pages/reports/index.astro` | 공유 메타 및 두 목록의 카드 등록. 정렬값은 구현 시 중복 확인 |
| `public/sitemap.xml`, `public/og/reports/nvidia-jensen-huang-earnings-2026.png` | 정규 URL과 공유 이미지 |

## 3. 데이터 모델 및 계산

| 데이터 | 주요 필드와 처리 |
|---|---|
| 메타 | `slug`, `title`, `description`, `ogImage`, `asOf`, `datePublished`, `dateModified`. 실제 공개일과 자료 확인일 별도 |
| 출처 | `id`, `publisher`, `title`, `url`, `publishedAt`, `checkedAt`, `scope`. SEC 공시 본문과 회사 실적 발표의 역할 구분 |
| 분기 | `id`, `fiscalYear`, `quarter`, `periodEnd`, `reportDate`, `sourceIds`. 현지 발표일과 한국시간 날짜가 다르면 병기 |
| 실적 | `metric`, `basis`, `unit`, 분기별 값, 회사 발표 YoY·QoQ, `sourceIds`. 원자료 정밀도와 표시용 반올림 분리 |
| 승계 | `date`, `event`, `role`, `sourceIds`. 사임 수리, 임시 CEO, 발표 날짜를 구분 |
| 제품 공개 | `product`, `milestone`, `revenueDisclosure`, `sourceIds`. 출하·파트너 가동과 인식 매출을 별도 필드로 둔다. |
| 전망 | `period`, `revenueMidpoint`, `revenueRangePercent`, `grossMarginRange`, `includesExtraWeek`, `assumptions`, `sourceIds` |
| 이력 | `date`, `summary`, `sourceIds`. 후임 선임·제품 매출 공개·실제 실적의 변경 근거 기록 |

공식 표의 금액은 가능한 경우 백만 달러 단위로 보관하고 화면에서 억 달러로 환산한다. 원자료가 십억 달러 단위의 반올림 값만 제공하면 원자료 정밀도를 유지한다. 미확인 값은 null로 보관하고 빈칸 대신 “미확인” 또는 “별도 미공개”를 표시한다. 공시가 명시한 0은 0으로 출력한다.

| 표시 항목 | 입력 또는 산식 | 초기 예상 표시 |
|---|---|---|
| FY2027 3분기 연결 매출 | 회사 발표값 115.8십억 달러 | 1,158억 달러 · YoY +103% · QoQ +20% |
| 데이터센터 매출 | 회사 발표값 107.6십억 달러 | 1,076억 달러 · YoY +110% · QoQ +21% |
| GAAP 영업이익 | 회사 발표값 77.5십억 달러 | 775억 달러 · YoY +115% · QoQ +22% |
| GAAP 매출총이익률 | 회사 발표값 | 74.8% · YoY +1.4%p · QoQ -0.2%p |
| 데이터센터 비중 | 데이터센터 매출 ÷ 연결 매출 × 100 | 약 92.9% · 계산값 |
| FY2027 4분기 매출 범위 | 130십억 달러 × (1 ± 0.03) | 1,261억~1,339억 달러 · 회사 가이던스에서 계산 |
| 가이던스 중심값의 QoQ | (130 ÷ 115.8 − 1) × 100 | 약 +12.3% · 계산값. 4분기 추가 1주 병기 |
| FY2027 4분기 매출총이익률 | 회사 발표 GAAP·비GAAP 전망 | 71~72% · 회사 가이던스 |

회사가 발표한 성장률을 우선 사용한다. 계산값은 표시 단계에서 반올림하며 통화 금액, 퍼센트, 퍼센트포인트를 구별한다. 가이던스의 중국 제외 범위는 **중국 데이터센터 컴퓨트 매출**로 원문 표현에 맞춘다.

## 4. 화면 구성

| 앵커 | 표시 내용 |
|---|---|
| `#overview` | H1, 기준일, 회계 분기 종료일, 세 가지 요약 수치(매출·데이터센터 비중·4분기 가이던스) |
| `#transition` | 10월 25일 분기 종료 → 11월 11일 사임 수리 → 11월 12일 회사 발표 → 11월 17일 미국 현지 실적 발표. 콜레트 크레스 임시 CEO·CFO 겸직 표시 |
| `#results` | FY2026 Q3, FY2027 Q2, FY2027 Q3, YoY, QoQ 비교. 데이터센터 비교 분기 금액은 공시의 해당 항목을 확인한 뒤 채운다. |
| `#rubin` | Vera Rubin NVL72 생산 확대·출하 시작·파트너 가동을 회사 발표에 귀속. 제품 단독 매출은 별도 공개 여부 표시 |
| `#outlook` | 가이던스 범위와 매출총이익률, 추가 1주, 중국 데이터센터 컴퓨트 매출 가정, 다음 공시에서 검증할 지표 |
| `#sources` | 기관명·문서명·발표일·확인일, 데이터 산식과 갱신 이력 |
| `#faq` | 기획서의 소개 4단락 방향 및 FAQ 6문항. 기존 SK하이닉스·엔비디아 협력 및 AI 설비투자 리포트 연결 |

표에 단위가 포함된 캡션과 행·열 헤더를 둔다. 작은 화면에서는 페이지 전체 너비를 유지하고 표 영역만 가로 스크롤한다. 영역에 접근 가능한 이름과 키보드 초점을 제공한다. 상태 라벨은 텍스트로 읽을 수 있게 표시한다.

## 5. 출처 대조 및 갱신

- **승계** — 11월 11일 사임 수리와 임시 CEO 역할의 공식 근거를 사용한다. 게시 전 정식 후임 선임과 새 임원 공시를 재확인한다. [SEC Form 8-K](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvda-20261111.htm) · [NVIDIA 승계 발표](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-CEO-Transition/default.aspx)
- **비교 실적** — 분기별 데이터센터 매출의 원자료와 컴퓨트·네트워킹 분류를 IR 자료 및 CFO 코멘터리에서 확인한다. 확인이 끝난 비교 수치만 표시하고 공표 성장률로 역산한 금액은 공식값으로 쓰지 않는다. [NVIDIA 실적 발표](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2027/default.aspx) · [NVIDIA 분기 자료 목록](https://investor.nvidia.com/financial-info/financial-reports/)
- **출하와 매출** — 현재 확인된 근거는 회사가 발표한 출하와 파트너 가동이다. 제품 단독 매출 공개 여부는 CFO 코멘터리와 후속 공시에서 재확인한다. [NVIDIA 분기 프레젠테이션](https://investor.nvidia.com/files/doc_financials/2027/Q327/NVDA-F3Q27-Quarterly-Presentation.pdf)
- **전망** — 4분기 실적 발표 후 최초 가이던스 범위와 실제 결과를 같은 단위로 비교한다. 기존 전망의 발표일과 가정을 보존하고 실제 실적의 출처를 별도로 추가한다. [NVIDIA 실적 발표](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2027/default.aspx)

## 6. 구현 완료 기준

- [ ] 첫 화면과 타임라인에서 3분기 종료일과 사임 수리일이 순서대로 보인다.
- [ ] 공시 수치·파생 계산·가이던스의 출처와 단위가 각 항목에 표시된다. 계산 결과 92.9%, 1,261억~1,339억 달러, 약 +12.3%를 확인한다.
- [ ] 추가 1주와 중국 데이터센터 컴퓨트 매출 가정이 전망 표 가까이에 표시된다. Rubin 출하와 제품 매출 공개 여부를 구분한다.
- [ ] canonical, Article JSON-LD, OG, 홈·리포트 목록·사이트맵의 URL을 확인한다.
- [ ] 모바일·태블릿·데스크톱에서 표, 목차, FAQ, 출처 링크를 확인한다. 구현 완료 후 Astro 빌드와 카테고리 매핑 검사를 실행한다.
