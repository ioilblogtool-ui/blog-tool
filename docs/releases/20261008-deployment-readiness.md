# 2026-10-08 미배포 페이지 점검 및 배포 준비

## 판정

신규 리포트 3개와 공통 검사 오류 수정은 배포 준비를 마쳤다. 건강보험료 계산기 2027 개편은 이론값·공유·비교 기능을 검증했지만, 최종 납부액에 필요한 공식 세부 기준이 미확인이라 이번 권장 배포 대상에서 보류한다. 현재 작업 트리에는 두 범위가 함께 있으므로 전체 파일을 일괄 커밋하지 않는다.

실제 커밋·push·배포는 실행하지 않았다. `main` push는 즉시 운영 배포로 이어진다.

## 운영 상태와 페이지별 결과

원격 `main` SHA와 로컬 HEAD는 `1934c62d1b051837e1d5f2128c82a6fa0558a853`으로 같았다. 아래 HTTP 상태와 제목은 2026-10-08 운영 도메인 직접 조회 결과다.

| 페이지 | 현재 운영 상태 | 로컬 검증 | 배포 판정 |
|---|---|---|---|
| `/reports/kpop-big4-agency-comparison-2026/` | 404 | 공시 데이터·산식·기준일·배지·SEO·반응형 통과 | 배포 가능 |
| `/reports/kpop-market-size-2026/` | 404 | 산업 통계·산식·범위 구분·4사 연동·SEO·반응형 통과 | 배포 가능 |
| `/reports/samsung-micron-earnings-2026/` | 404 | 잠정/확정·회계기간·통화·산식·스냅샷·SEO·반응형 통과 | 배포 가능 |
| `/tools/health-insurance-premium-calculator/` | 200, 제목은 2026 버전 | 2027 이론값·비교·URL·입력·모바일 통과, 미확인 납부액은 pending | 완전한 납부액 서비스 배포 보류 |

연계 수정: 건강보험 2026 인상 페이지의 최신 링크는 건강보험 개편과 함께 보류한다. 코스피 실적·한국영화 리포트의 새 리포트 링크는 신규 리포트와 함께 배포한다.

## 수정한 배포 장애

- `CalculatorHero`, `InfoNotice`, `CompareCta`의 기존 호출부와 속성 타입 계약을 맞추고 누락 가능한 제목에 한국어 기본값을 제공했다. 기존 Hero 배지·통계 메타는 호출 호환성을 유지하며 표시 구조를 추가하지 않았다.
- `SeoContent`는 readonly 데이터를 받아들이고 기존 호출부가 넘긴 FAQ 제목·계산식 내용을 표시한다. 인테리어 페이지의 잘못된 설명·관련 링크 속성을 수정했다.
- `BaseLayout`의 기존 canonical/OG 타입 옵션을 반영했다.
- 모바일 메뉴 검색·포커스 대상에 DOM 타입을 명시했다. 리포트 목록의 null 항목 제거에 타입 가드를 적용하고 사용 중인 태그 타입을 맞췄다.
- 홈 분류 객체의 중복 키를 제거했다. 목록에서 빠지던 육아 리포트 2개의 분류를 기존 생활 필터로 연결했다.
- 기존 ISA 페이지의 잘못된 속성 따옴표, FIRE 옵션의 undefined 처리, 실업급여 CTA 변형 값을 수정했다.
- 기존 데이터의 정당 코드 추론과 실제 사용 중인 공약 분류 타입을 맞췄다. 강동 리포트의 빈 데이터 배지 2곳은 ‘확인 필요’로 표시했다. 새로운 가격·공약 수치를 입력하지 않았다.
- 코스피 실적 리포트의 차트가 320px 화면에서 페이지를 넓히던 문제를 해당 페이지 범위의 grid 최소 너비로 해결했다.

## 검증 증거

| 검사 | 결과 |
|---|---|
| `npm run check:all` | 오류 0개, 기존 미사용 변수 경고 2개, 힌트 738개; 매핑 누락 없음 |
| `npm run build` | 성공, 428개 경로, 53.03초 |
| 건강보험 계산 검증 | 대표값·경계·null·지역·퇴직·오류 입력·URL·콘텐츠 통과 |
| 4대 기획사 검증 | 데이터·산식·순위·기준일·오류 검출·정적 HTML·FAQ 스키마·배지·역링크 통과 |
| K팝 시장 규모 검증 | 데이터·산식·4사 연동·공개 게이트·SEO·빌드 HTML 통과 |
| 삼성·마이크론 검증 | 산식·예외·회계 범위·3사 확장·스냅샷 보존·SEO 통과 |
| 브라우저 QA | 아래 12개 경로, 320·360·640·768·1280px에서 페이지 넘침 없음 |
| 검색·목록 | 홈 K팝 검색, 계산기 건강보험 검색, 리포트 문화/자산 필터, 모바일 메뉴 K팝 검색·Escape 통과 |
| 로컬 자원·링크 | 검사 경로의 내부 링크가 빌드 파일로 연결, 로컬 HTTP 오류·페이지 콘솔 오류 없음 |
| OG | 신규 3개와 건강보험 1200×630 이미지 시각 확인 |
| `git diff --check` | 통과 |

브라우저 검사 경로: `/`, `/tools/`, `/reports/`, 신규 리포트 3개, 건강보험 계산기·2026 인상 페이지, 코스피 실적, 한국영화 손익, ISA 계산기, 인테리어 계산기. 외부 광고·분석 요청을 제외하고 로컬 기능을 검증했다. 운영 광고 송출이나 모든 기존 페이지의 내용 정확성을 보증하는 검사는 아니다.

핵심 원문 재확인: [삼성전자 2026년 3분기 잠정 실적](https://news.samsung.com/global/samsung-electronics-announces-earnings-guidance-for-third-quarter-2026), [마이크론 FY2026 4분기 실적](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx), [문화체육관광부 콘텐츠산업 조사](https://www.korea.kr/briefing/pressReleaseView.do?newsId=156746399), [IFPI 2026 보고서](https://www.ifpi.org/global-music-report-2026-global-recorded-music-revenues-grow-6-4-as-record-companies-drive-innovation/). 각 페이지의 공시·통계 기준일을 현재 날짜의 시세나 전 산업 규모처럼 바꾸지 않았다. DART 원문은 이번 재점검 환경에서 직접 열리지 않아 기존 원문 조사·검증 기록을 유지했다.

## 권장 커밋 범위

첫 배포 묶음은 신규 리포트 3개 각각의 데이터·유틸·Astro·SCSS·OG·검증 스크립트·기획/설계 문서와 다음 연계 파일이다.

- `src/data/reports.ts`, `src/pages/index.astro`, `src/pages/reports/index.astro`, `src/styles/app.scss`
- `src/data/koreanMovieBreakEvenProfit.ts`, `src/pages/reports/kospi-large-cap-2026-q2-earnings.astro`, 해당 코스피 SCSS
- `public/sitemap.xml`의 신규 리포트 3개 항목
- `scripts/generate-og-tools.py`의 신규 리포트 3개 항목
- 위 배포 장애 수정에 해당하는 공통 컴포넌트·레이아웃·기존 데이터/계산기 파일
- 이 점검서

공유 파일의 주의점: sitemap에는 건강보험 lastmod 수정도 있고, OG 생성 목록에는 건강보험 항목도 있으므로 신규 리포트 항목만 선택한다. 이 두 파일은 파일 전체 staging 대신 변경 블록별 staging 또는 별도 배포 브랜치에서 선별 반영한다.

이번 묶음에서 제외할 항목:

- 건강보험 계산기 데이터·페이지·코어·클라이언트 JS·SCSS·OG·검증 스크립트·기획/설계 문서
- `src/data/tools.ts`의 건강보험 메타와 `/tools/health-insurance-rate-increase-2026/`의 개편 링크
- `package-lock.json`: 패키지 버전 변경 없이 `dev` 메타만 바뀐 기존 변경이며 이번 배포에 필요하지 않다. 작업 파일은 보존했다.
- `docs/sheets/page_inventory_2026-10-07.csv`: 별도 기존 작업 산출물로 배포 코드에 포함하지 않는다.
- `.playwright-cli/`, `dist/`, `.astro/`, 로컬 로그·스크린샷: Git 제외 경로다.

## 선별 배포 후보 검증

`D:\git\blog-tool\.playwright-cli\release-candidate`에 원격 main 기준 파일을 복원하고 위 첫 묶음의 변경 52개 파일만 반영했다. 건강보험 관련 운영 파일 4개는 HEAD와 내용이 같음을 확인했고, sitemap의 건강보험 lastmod도 기존 `2026-06-03`으로 유지했다. OG 생성 목록에서도 건강보험 신규 항목을 제외했다. 원본 작업 트리는 그대로 보존했다.

- 후보 `npm run check:all`: 오류 0개, 기존 경고 2개, 힌트 740개, 매핑 누락 없음.
- 후보 `npm run build`: 성공, 428개 경로, 46.90초.
- 후보의 4대 기획사·K팝 시장·삼성/마이크론 검증 스크립트 모두 통과.
- 후보 브라우저 QA: 같은 12개 경로와 5개 화면 폭, 메타·내부 링크·FAQ·검색·분류·모바일 메뉴·콘솔 검증 통과.
- 후보 미리보기: `http://127.0.0.1:4323/reports/`.
- 적용 패치: `D:\git\blog-tool\.playwright-cli\20261008-ready.patch`.
- 파일 목록: `D:\git\blog-tool\.playwright-cli\release-candidate-files.json`.

패치는 동일 SHA의 깨끗한 체크아웃용이다. 현재 혼합 작업 트리에 적용하지 않는다. 임시 Git index로 패치 적용 검사를 수행하며 실제 staging·커밋·브랜치·원격 상태는 바꾸지 않는다. 원격 main이 바뀌거나 파일을 추가 수정하면 검증을 다시 수행한다.

## 건강보험 개편의 남은 조건

2027 장기요양보험료율·건강보험 상하한, 연도별 단수처리 단계와 지역 세부 정책의 공식 근거를 확보해야 최종 납부액을 제공할 수 있다. 2026도 단수처리 계약이 미확인이라 최종 납부액은 대기한다. 가상 테스트 규칙을 운영에 넣거나 이전 연도 값을 2027 값으로 대체하지 않는다.

현재 제한 범위를 명시한 건강보험 이론값 서비스로 공개하는 선택은 가능하지만, 전체 직장·지역·퇴직 납부액 계산 완료로 소개하지 않는다. 이 점검에서는 최종 계산 서비스 기준으로 보류했다.

## 배포 후 확인 순서

1. 승인된 묶음을 검증 후 커밋하고 정상 push로 배포한다. hook을 우회하지 않는다.
2. CI·Cloudflare Pages 완료 상태를 확인한다.
3. 운영 홈·리포트 목록에서 3개 신규 링크와 검색/분류를 확인한다.
4. 신규 3개 경로가 200으로 응답하고 새 제목·OG·FAQ·모바일 화면이 반영됐는지 확인한다.
5. 보류한 건강보험 경로가 의도치 않게 변경되지 않았는지 확인한다.
6. 문제 발견 시 해당 배포 커밋을 정상 revert로 되돌린다. force push하지 않는다.
