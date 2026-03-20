# Project Management

## 프로젝트 정의
- 서비스명: 비교계산소
- 목적: 비교해서 더 잘 판단하게 만드는 계산 도구 제공
- 포지션: 숫자로 비교해서 판단하는 계산 플랫폼
- 주 사용 방식: 검색 유입, 블로그 링크, iframe 삽입
- 배포 환경: 정적 사이트 배포
- 기준 경로: `/tools/<slug>/`

## 현재 구조
- `src/pages/tools/*.astro`: 실제 도구 페이지
- `src/data/tools.ts`: 도구 메타 정보
- `src/components/*`: 공통 UI 조각
- `src/styles/global.css`: 공통 스타일
- `public/scripts/*.js`: 계산 및 상호작용 스크립트
- `docs/*`: 목표, SEO, 운영 문서

## 핵심 목표
- 월 100만 원 수익 구조 만들기
- 계산기 + 비교 페이지 + 설명 가이드 + 랜딩 페이지 구조 확장
- 급여 / 실수령 / 성과급 / 총보상 / 커리어 카테고리 강화

## 현재 도구 목록
- salary: 연봉 인상 계산기
- retirement: 퇴직금 계산기
- negotiation: 이직 계산기
- parental-leave: 육아휴직 계산기
- bonus-simulator: 성과급 시뮬레이터
- birth-support-total: 출산 지원금 계산
- parental-leave-pay: 육아휴직 급여 계산
- single-parental-leave-total: 단독 육아휴직 총액 계산
- six-plus-six: 6+6 계산기

## 향후 우선 제작 대상
- 연봉 실수령 계산기
- 월급 실수령 계산기
- 성과급 포함 실수령 계산기
- 삼성전자 성과급 계산기
- SK하이닉스 성과급 계산기
- 현대차 성과급 계산기
- 대기업 초봉 계산기
- 직급별 총보상 계산기

## 운영 원칙
- 사용자 노출 경로에 `.md`를 사용하지 않는다.
- 새 도구는 `src/data/tools.ts`와 `src/pages/tools/*.astro`를 함께 관리한다.
- 공통 UX는 액션 바, 요약 카드, 안내 박스 구조를 우선 사용한다.
- 새 페이지는 모바일과 iframe 환경을 우선 점검한다.
- 단일 계산기보다 검색 확장 가능성이 있는 주제를 우선 채택한다.

## 참고 문서
- 장기 목표: `docs/MONTHLY_1M_GOAL.md`
- SEO / 광고 준비: `docs/SEO_ADSENSE_ROADMAP.md`
- 코드 생성 기준: `docs/CODE_SKILL.md`
- 에이전트 기준: `AGENT.md`
