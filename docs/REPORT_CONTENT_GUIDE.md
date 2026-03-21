# REPORT_CONTENT_GUIDE.md

## 목적
- `비교계산소`에서 계산기 외 `인터랙티브 비교 리포트` 콘텐츠를 만들 때 공통 기준으로 사용합니다.
- 새 리포트를 추가할 때 데이터 구조, 페이지 구성, SEO, 출처, 이미지, 홈 반영, 리포트 허브 반영까지 한 번에 참고할 수 있게 정리합니다.

## 이 문서가 필요한 이유
- 계산기 페이지와 리포트 페이지는 구조가 다릅니다.
- 리포트는 `입력 → 계산`보다 `선택 → 비교 → 해석` 흐름이 핵심입니다.
- 비슷한 리포트를 계속 추가할 예정이라면, 공통 패턴을 먼저 정리해두는 편이 유지보수에 유리합니다.

## 리포트형 콘텐츠 정의
- 계산기가 아닌 `데이터 기반 인터랙티브 콘텐츠`
- 공개 데이터를 선택하거나 비교하면서 읽는 페이지
- 예시:
  - 미국 부자 TOP 10 성공 패턴 리포트
  - 한국 부자 TOP 10 최근 10년 자산 성장 비교
  - 이재용 vs 최태원 자산 변화 비교 리포트

## 핵심 원칙
- 사용자에게 보이는 카피는 한국어로 작성
- 구현 계획, 데이터 모델링, 기술 설명은 필요 시 영어 사용 가능
- 브랜드 톤은 현재 사이트처럼 가볍고 실용적으로 유지
- 계산기처럼 복잡한 폼 대신 `선택 UI + 비교 카드 + 해석 블록` 중심으로 설계
- 대시보드처럼 무겁게 만들지 않기
- 차트는 라이브러리보다 `CSS bar / 카드 / 분포 요약`을 우선 고려
- 팩트와 해석을 명확히 분리

## 팩트 / 해석 / 추정 구분 원칙
- Fact:
  - 자산, 순위, 회사, 업종, 학력, 연도별 수치, 공개 프로필 정보
- Interpretation:
  - 공통 패턴, 성공 요인, 비교 해석, 읽는 포인트
- Estimate / Low confidence:
  - MBTI, 성향 추정, 추론성 태그
- MBTI나 성향 추정은 반드시 `참고용`, `추정`, `공식 공개 아님` 라벨을 붙입니다.

## 추천 URL 구조
- 리포트 허브: `/reports/`
- 개별 리포트: `/reports/<slug>/`

예시:
- `/reports/us-rich-top10-patterns/`
- `/reports/korea-rich-top10-growth/`
- `/reports/lee-jaeyong-vs-choi-taewon/`

## 권장 파일 구조
- 데이터: `src/data/<reportName>.ts`
- 리포트 허브 데이터: `src/data/reports.ts`
- 페이지: `src/pages/reports/<slug>.astro`
- 인터랙션 스크립트: `public/scripts/<slug>.js`
- 스타일: `src/styles/scss/pages/_<slug>.scss`
- 이미지: `public/images/reports/<slug>/`

예시:
- `src/data/usRichTop10Report.ts`
- `src/pages/reports/us-rich-top10-patterns.astro`
- `public/scripts/us-rich-top10-report.js`
- `src/styles/scss/pages/_us-rich-top10-report.scss`
- `public/images/reports/us-rich-top10/`

## 기본 데이터 모델 권장안
```ts
export type ReportImage = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sourceName: string;
  sourceUrl: string;
  licenseLabel: string;
  licenseUrl?: string;
};

export type ReportFaq = {
  question: string;
  answer: string;
};

export type DistributionItem = {
  label: string;
  count: number;
  note?: string;
};
```

### 선택형 프로필 리포트 권장 구조
```ts
export type ProfileRecord = {
  id: string;
  rank: number;
  name: string;
  metricDisplay: string;
  companies: string[];
  primaryCompany: string;
  sector: string;
  education: string[];
  summary: string;
  highlights: string[];
  tags: string[];
  image?: ReportImage;
};
```

## 페이지 IA 권장안
1. Hero
2. 주의 / 참고 문구
3. Overview cards
4. Select box or tabs
5. Selected detail card
6. 분포 / 비교 요약
7. 공통 패턴 분석
8. 방법론 / 출처 / 주의
9. FAQ
10. 관련 리포트 링크

## 섹션별 작성 원칙

### 1. Hero
- 강한 H1
- 한 줄 설명으로 이 페이지가 무엇을 비교하는지 바로 알 수 있어야 함
- 계산기가 아니라 `리포트`라는 성격이 느껴져야 함

예시:
- `미국 부자 TOP 10 성공 패턴 리포트`
- `자산, 학력, 업종, 창업 배경, 성향 태그를 선택해서 비교해보는 인터랙티브 리포트`

### 2. 참고 문구
- 길게 쓰지 않기
- 팩트 기준과 추정 기준을 2~3줄로만 안내

예시:
- `자산·학력·업종 정보는 공개 프로필과 보도 자료를 기준으로 정리했습니다.`
- `MBTI는 공식 공개가 아닌 경우가 많아 참고용 추정으로만 제공합니다.`

### 3. Overview cards
- 상위 5~10개 개요 카드는 작은 카드로 빠르게 훑을 수 있게 구성
- 카드에는 핵심만 넣기
  - 순위
  - 이름
  - 자산/핵심 수치
  - 업종
- 모바일에서는 2열 또는 가로 스크롤 없이 자연스럽게 쌓이는 구조 권장

### 4. Select interaction
- 페이지의 핵심 인터랙션은 하나만 명확하게
- `select` 또는 `tabs` 중 하나만 우선 사용
- 첫 기본 선택값은 가장 대표적인 인물/항목으로 설정

### 5. Selected detail card
- 선택 결과는 카드 하나로 깔끔하게 정리
- 이미지가 있다면 보조 정보로만 사용
- 카드 안에 들어갈 우선순위:
  - 이름 / 순위
  - 핵심 수치
  - 대표 회사
  - 업종
  - 학력
  - 유형/태그
  - 요약
  - 핵심 포인트

### 6. 분포 비교
- 라이브러리 차트보다 `bar rows`를 우선 사용
- 항목 수가 많지 않다면 카드 + 수치 + 가로 bar만으로 충분
- 무거운 인터랙션은 피하기

### 7. 패턴 분석
- 리포트에서 가장 중요한 설명 영역
- 문장을 길게 쓰기보다 `짧은 제목 + 2~3문장` 카드로 쪼개기
- 예시 패턴:
  - 기술 업종 집중
  - 창업자 비중 우세
  - 장기 지분 보유
  - 공학/수학 배경 다수

### 8. FAQ
- 페이지에 실제로 보여야 함
- 구조화된 FAQ를 쓸 때는 visible 상태 유지
- 검색 유입 사용자가 바로 가질 질문 위주로 작성

### 9. 관련 링크
- 리포트끼리 연결
- 계산기와도 자연스럽게 연결
- 추천:
  - 같은 주제 리포트 2개
  - 연관 계산기 1개

## 이미지 운영 원칙
- 외부 핫링크보다 `로컬 저장` 우선
- 로컬 이미지 경로 예시:
  - `public/images/reports/us-rich-top10/elon-musk.jpg`
- 데이터에는 `src`와 함께 출처 메타데이터를 유지
- 이미지가 없어도 페이지가 깨지지 않도록 설계
- 로컬 이미지 실패 시 `fallbackSrc` 사용 가능

### 이미지 소스 우선순위
1. Wikimedia Commons
2. 공식 회사/리더십 이미지
3. 사용 조건이 명확한 공개 프로필 이미지

### 비추천 이미지 소스
- 구글 이미지 검색 결과 직접 사용
- 출처 불명 SNS 이미지
- 언론 기사 이미지 무단 사용
- 외부 URL 핫링크만 의존하는 구조

## 카피 작성 기준
- 사용자 문구는 짧고 명확하게
- 내부 설계 설명 문장을 그대로 노출하지 않기
- `이 페이지가 무엇을 보여주는지`, `어떤 기준인지`, `어떻게 읽으면 되는지` 중심으로 작성
- 설명문이 길어지면 카드나 리스트로 분리

좋은 예:
- `한 명씩 자세히 보기`
- `업종·학력·창업 배경`
- `공통적으로 많이 보이는 특징`

피할 예:
- `상단에서 선택하면 아래 상세 카드와 분포 요약이 함께 갱신되도록 설계했습니다.`

## 스타일 가이드
- 현재 사이트 톤 유지: 깔끔함, 가벼움, 실용성
- 카드 기반이지만 과하게 마케팅 페이지처럼 만들지 않기
- 색은 은은하게
- 과한 gradient, 고채도 블록, 장식용 배지 남용 금지
- 숫자/핵심 키워드를 본문보다 더 빨리 읽히게 배치

## 모바일 가이드
- 첫 화면에서 페이지 목적이 바로 보여야 함
- `select`는 상단 가까이에 배치
- 상세 카드는 선택 UI 바로 아래
- 분포/패턴 카드는 세로 스택 우선
- 빽빽한 표는 피하기
- 이미지가 들어가도 카드 높이가 과도하게 커지지 않게 조절

## Astro 구현 패턴
- 가능하면 기존 공용 컴포넌트 재사용
- 기본 조합 예시:
  - `BaseLayout`
  - `SiteHeader`
  - `CalculatorHero` 또는 이후 `ReportHero` 검토
  - `InfoNotice`
  - `SeoContent`
- 새 리포트는 우선 페이지 inline 구현으로 시작하고, 반복되면 컴포넌트 분리

## 인터랙션 구현 기준
- 기본은 가벼운 클라이언트 스크립트 1개
- `script[type="application/json"]`로 데이터 주입
- `public/scripts/*.js`에서 DOM 업데이트
- 선택 UI는 `select` 하나부터 시작
- 차트 라이브러리는 정말 필요할 때만 도입

## 홈 / 허브 반영 체크
리포트를 새로 추가할 때 아래를 함께 확인합니다.
- `src/data/reports.ts` 업데이트
- `src/pages/reports/index.astro` 노출 확인
- 홈 추천 리포트 영역 필요 시 추가/교체
- `public/sitemap.xml` 반영
- 관련 계산기/리포트 내부 링크 연결

## SEO 체크
- 강한 H1
- 짧은 인트로
- 상단 가까운 인터랙션
- FAQ visible
- 방법론/출처/주의 문구 포함
- title / description / canonical / OG 반영
- 검색 유입 사용자가 처음 봐도 이해 가능한 구조 유지

## 새 리포트 만들 때 체크리스트
1. 주제와 검색 의도 정의
2. fact / interpretation / estimate 구분
3. `src/data/<report>.ts` 작성
4. `/reports/<slug>/` 페이지 생성
5. 선택 UI와 상세 카드 연결
6. 분포/패턴 카드 작성
7. FAQ와 관련 링크 추가
8. 이미지 사용 시 로컬 저장 + 출처 메타데이터 확인
9. `src/data/reports.ts` 반영
10. `public/sitemap.xml` 반영
11. `src/styles/app.scss`에 페이지 스타일 연결
12. `npm run build` 확인
13. 홈/리포트 허브에서 노출 확인

## 현재 첫 리포트 기준 참고 파일
- `src/data/usRichTop10Report.ts`
- `src/data/reports.ts`
- `src/pages/reports/index.astro`
- `src/pages/reports/us-rich-top10-patterns.astro`
- `public/scripts/us-rich-top10-report.js`
- `src/styles/scss/pages/_us-rich-top10-report.scss`
- `public/images/reports/us-rich-top10/`

## 추천 다음 리포트 후보
- 한국 부자 TOP 10 최근 10년 자산 성장 비교
- 이재용 vs 최태원 자산 변화 비교 리포트
- 미국 빅테크 창업자 성공 패턴 비교

## 한 줄 운영 원칙
- `리포트는 계산기보다 읽기 쉬워야 하고, 기사보다 인터랙티브해야 합니다.`
