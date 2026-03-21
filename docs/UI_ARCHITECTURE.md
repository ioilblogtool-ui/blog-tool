# 비교계산소 UI 아키텍처 설계안

## 목표
- 모바일 우선으로 설계하고 태블릿, PC까지 자연스럽게 확장한다.
- 계산기마다 정보 밀도가 달라도 같은 제품군처럼 보이게 만든다.
- 블로그형 레이아웃이 아니라 입력, 결과, 비교, 해석 중심의 도구형 화면 구조를 유지한다.
- 이후 새 도구를 만들 때 공통 레이아웃 템플릿 위에 내용만 교체할 수 있게 한다.

## 핵심 원칙
- 첫 화면에서 `제목 -> 핵심 입력 -> 계산 버튼 -> 핵심 결과`가 보여야 한다.
- 긴 표, 기준 메모, 상세 설명은 접을 수 있어야 한다.
- 결과 화면은 숫자만 나열하지 않고 비교와 해석을 같이 제공한다.
- 모바일에서는 1열, 태블릿에서는 2열, PC에서는 역할 기반 2컬럼으로 확장한다.
- 페이지별 커스텀은 허용하되, 공통 패턴을 깨지 않는 범위에서만 조정한다.

## 페이지 타입
### 1. Simple Calculator
- 예: 연봉 인상 계산기, 퇴직금 계산기, 이직 계산기
- 구조: 입력 / 핵심 결과 / 상세표 / 안내

### 2. Comparison Calculator
- 예: 대기업 성과급 시뮬레이터, 6+6 부모육아휴직제 계산기
- 구조: 입력 / 핵심 결과 / 비교 카드 / 해석 / 상세표

### 3. Timeline Calculator
- 예: 한 명만 육아휴직 총수령액 계산기, 육아휴직 급여 계산기, 출산~2세 총지원금 계산기
- 구조: 입력 / 핵심 결과 / 월별 흐름 / 세부 분해 / 안내

## 공통 컴포넌트 레이어
- `CalculatorHero.astro`: 도구 제목과 짧은 설명
- `ToolActionBar.astro`: 초기화, 링크 복사 같은 즉시 행동
- `SummaryCards.astro`: 가장 중요한 요약 지표
- `InfoNotice.astro`: 계산 기준과 주의사항
- `SeoContent.astro`: 검색용 설명, FAQ, 관련 링크
- `SimpleToolShell.astro`: 단순 계산기용 2컬럼 템플릿
- `CompareToolShell.astro`: 비교형 도구용 2컬럼 템플릿
- `TimelineToolShell.astro`: 타임라인형 도구용 상단 요약 + 하단 흐름 템플릿

## 레이아웃 템플릿
### SimpleToolShell
- 왼쪽: 입력 패널
- 오른쪽: 요약 결과, 상세표, 안내
- PC에서는 입력과 결과를 분리하고 모바일에서는 한 컬럼으로 자연스럽게 내린다.

### CompareToolShell
- 왼쪽: 입력 패널
- 오른쪽: 결과 대시보드
- PC에서는 `입력`과 `결과`를 역할 기준으로 분리한다.
- 모바일에서는 한 컬럼으로 자연스럽게 내려온다.

### TimelineToolShell
- 상단: 입력 패널 + 요약 결과
- 하단: 월별 흐름, 타임라인, 표
- PC에서는 상단 2컬럼, 하단 전체폭 구조를 사용한다.
- 모바일에서는 상단과 하단이 자연스럽게 1열로 이어진다.

## 스타일 레이어
### 1. Legacy Layer
- 기존 `app.scss`와 `scss/_legacy.scss`에서 안정적으로 쓰이던 토큰, 카드, 버튼, 입력, 테이블 스타일을 보존한다.
- 빠른 전면 교체보다 점진적 이전을 목표로 한다.

### 2. Layout Layer
- 페이지 유형별 레이아웃 규칙을 둔다.
- 예: `layouts/_simple-tool.scss`, `layouts/_compare-tool.scss`, `layouts/_timeline-tool.scss`

### 3. Page Layer
- 개별 도구의 정보 밀도와 우선순위를 조정한다.
- 예: `pages/_bonus-simulator.scss`

## SCSS 구조
- `src/styles/app.scss`: 전체 진입점
- `src/styles/scss/_legacy.scss`: 기존 공통 스타일 보존
- `src/styles/scss/layouts/_simple-tool.scss`: 단순 계산기 템플릿 레이아웃
- `src/styles/scss/layouts/_compare-tool.scss`: 비교형 템플릿 레이아웃
- `src/styles/scss/layouts/_timeline-tool.scss`: 타임라인형 템플릿 레이아웃
- `src/styles/scss/pages/_salary.scss`: 연봉 인상 계산기 조정
- `src/styles/scss/pages/_retirement.scss`: 퇴직금 계산기 조정
- `src/styles/scss/pages/_negotiation.scss`: 이직 계산기 조정
- `src/styles/scss/pages/_timeline-tools.scss`: 타임라인형 계산기 공통 조정
- `src/styles/scss/pages/_bonus-simulator.scss`: 성과급 시뮬레이터 전용 조정
- `src/styles/scss/pages/_single-parental-leave-total.scss`: 한 명만 육아휴직 총수령액 페이지 조정
- `src/styles/scss/pages/_six-plus-six.scss`: 6+6 페이지 조정

## 적용 상태
- `salary`: simple calculator 템플릿 적용 완료
- `retirement`: simple calculator 템플릿 적용 완료
- `negotiation`: simple calculator 템플릿 적용 완료
- `bonus-simulator`: comparison calculator 템플릿 1차 적용 완료
- `single-parental-leave-total`: timeline calculator 템플릿 적용 완료
- `parental-leave-pay`: timeline calculator 템플릿 적용 완료
- `birth-support-total`: timeline calculator 템플릿 적용 완료
- `six-plus-six`: comparison calculator 템플릿 2차 적용 완료

## 다음 대상
- `parental-leave`: simple 또는 timeline 후보 재분류
- `tools/index`: 템플릿 분류 기반 카드 정보 강화
- 공통 detail-box / table mobile 패턴 추가 정리

