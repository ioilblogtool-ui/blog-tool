# Project Management

## 프로젝트 정의
- 저장소 목적: 독립 웹페이지형 도구 배포
- 주 사용 방식: 블로그 본문 링크, iframe 삽입
- 배포 환경: GitHub Pages
- 기준 경로: `/blog-tool/tools/<slug>/`

## 구조
- `src/content/tools/*.md`: 도구 메타 정보 관리
- `src/pages/tools/*.astro`: 실제 페이지 구현
- `src/components/*`: 공통 UI 조각
- `src/styles/global.css`: 공통 스타일
- `public/scripts/tools.js`: 공통 계산/상호작용 스크립트
- `docs/AGENT.md`: 에이전트 작업 규칙

## 현재 도구 목록
- salary: 연봉 인상 계산기
- retirement: 퇴직금 계산기
- negotiation: 이직 계산기
- parental-leave: 육아휴직 계산기

## 향후 예정 예시
- 하이닉스 성과급 계산기
- 6+6 육아휴직 급여 계산기
- 게임형 인터랙티브 페이지
- 비교 시뮬레이터

## 운영 원칙
- 사용자 노출 URL에는 `.md`를 사용하지 않는다.
- 메타 관리는 Markdown으로 하되, 라우팅은 Astro 페이지가 담당한다.
- 도구별 제목, 설명, 정렬 순서는 frontmatter에서 관리한다.
- 새 페이지 추가 시 모바일과 iframe 환경을 우선 점검한다.
