# 서울 아파트 전세 리포트 설계 문서

> 기획 원문: `docs/plan/202604/seoul-apartment-jeonse-report.md`
> 작성일: 2026-04-08
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/seoul-apartment-jeonse-report.md`
- 구현 대상: `전세 사라지는 서울 아파트 - 신혼부부가 찾던 역세권 전세는 왜 없어졌나`
- 참고 페이지:
  - `seoul-housing-2016-vs-2026`
  - `wedding-cost-2016-vs-2026`
  - `salary-asset-2016-vs-2026`
  - `seoul-84-apartment-prices`

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 섹션 목적, 인터랙션, CTA 흐름, SEO, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `문제 인식 -> 서울 평균 변화 -> 지역 체감 비교 -> 조건 변화 비교 -> 왜 어려워졌는지 해설 -> 전세/월세/매매 대안 비교 -> 관련 계산기 연결`
- SEO 유입형이지만 블로그형 긴 글이 아니라 `요약 카드 + 차트 + 비교 보드 + 가벼운 입력` 중심 구조로 간다.
- 톤은 공포 조장보다 `체감 설명 + 선택지 비교 + 다음 액션 제시`에 둔다.

### 1-4. 권장 slug
- `seoul-apartment-jeonse-report`
- URL: `/reports/seoul-apartment-jeonse-report/`

### 1-5. 권장 파일 구조
- `src/data/seoulApartmentJeonseReport.ts`
- `src/pages/reports/seoul-apartment-jeonse-report.astro`
- `public/scripts/seoul-apartment-jeonse-report.js`
- `src/styles/scss/pages/_seoul-apartment-jeonse-report.scss`
- `public/og/reports/seoul-apartment-jeonse-report.png`

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 리포트 공통 구조
현재 `/reports/` 콘텐츠는 아래 흐름을 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 브리프 보드 또는 KPI 카드
4. 차트 / 비교표 / 지역 카드
5. 선택형 탐색 또는 체감 계산 영역
6. 요약 인사이트 카드
7. 외부 참고 링크
8. 관련 계산기 / 리포트 CTA
9. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트가 따라야 할 방향
- `seoul-housing-2016-vs-2026`에서 가져올 것
  - 서울 주거비 변화 설명 방식
  - 평균값 기반 상단 브리프 + 차트 + 직접 비교 보드
  - 지역 체감 카드와 해설형 UX
- `wedding-cost-2016-vs-2026`에서 가져올 것
  - `예전 vs 지금` 비교 보드
  - 사용자가 빠르게 읽는 카드형 정보 압축
  - 체감 섹션에서 다음 계산기로 이어지는 구조
- 이번 페이지에서 새롭게 강조할 것
  - `서울 아파트 전세 물량 감소`와 `신혼부부 체감`을 같이 보여주는 것
  - 강서/강동/강북 등 실수요형 지역을 별도 섹션으로 보여주는 것
  - 전세만이 아니라 `반전세, 월세, 매매`까지 선택지 전환을 연결하는 것

---

## 3. 구현 범위

### 3-1. MVP 범위
- 서울 아파트 전세 시장의 핵심 지표를 고정 데이터로 제공한다.
  - 기준 연도별 서울 평균 전세가
  - 서울 평균 매매가
  - 서울 평균 월세 보증금
  - 서울 평균 월세
  - 서울 아파트 전세 비중 또는 전세 거래 비중
  - 서울 내 대표 체감 지역별 전세 수준
  - 역세권 선호 지역에서의 체감 포인트
- 핵심 비교 UI 4종을 제공한다.
  - 상단 브리프 보드
  - KPI 카드
  - 시계열 차트 2종
  - `이전 vs 현재` 직접 비교 보드
- 지역 체감 UI 2종을 제공한다.
  - 강서 / 강동 / 강북 체감 카드
  - 조건 변화 비교표
- 가벼운 입력 인터랙션 1종을 제공한다.
  - 예산 또는 보증금 입력
  - 같은 예산에서 가능한 전세 / 반전세 / 월세 선택지 비교
  - CTA로 연결되는 결과 요약
- 해설 영역 4종을 제공한다.
  - 전세가 줄어든 이유 4대 요인
  - 수요자 행동 변화 설명
  - FAQ
  - 관련 계산기 / 제휴 CTA

### 3-2. MVP 제외 범위
- 실시간 매물 API 연동
- 지도 기반 매물 탐색
- 사용자 조건별 상세 필터링
- 대출 규제/DSR 통합 계산
- 자치구 전수 데이터 시각화
- 저장 기능 / 비교 히스토리

---

## 4. 페이지 목적

- 서울 아파트 전세가 왜 체감상 더 찾기 어려워졌는지 한 페이지에서 빠르게 이해하게 한다.
- 신혼부부나 무주택 실수요자가 `전세 감소 -> 선택지 축소 -> 대안 전환`의 흐름을 읽게 만든다.
- 리포트에서 끝나지 않고 `전세 vs 월세`, `주택 구매 자금`, `대출/보증금`, `서울 주거비 비교` 계산기로 자연스럽게 이어지게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 신혼부부 실수요자
- `서울 아파트 전세`, `서울 역세권 전세`, `신혼부부 서울 전세` 검색 후 유입한다.
- 먼저 서울 평균 전세가 변화와 전세 비중 변화를 본다.
- 이후 강서/강동/강북 등 후보 지역의 체감 설명을 확인한다.

### 5-2. 예산 한계가 있는 무주택 직장인
- `전세로 서울 들어가기 너무 어렵다`는 체감을 수치로 확인하고 싶어한다.
- 현재 예산을 입력해 전세만 볼지, 반전세/월세까지 봐야 할지 감을 잡는다.
- 다음 단계로 전세대출/주거비 계산기로 이동한다.

### 5-3. 부동산 정보 탐색 사용자
- 왜 최근 몇 년 사이 전세 매물이 줄어든 것처럼 느껴지는지 구조적 이유를 알고 싶어한다.
- 전세사기, 금리, 공급, 월세 전환 같은 요인을 한 번에 이해하고 싶어한다.

### 5-4. 일반 검색 유입 사용자
- `서울 전세 감소`, `서울 아파트 전세 사라짐`, `역세권 전세 찾기 힘든 이유` 검색으로 들어와 핵심 수치와 비교만 빠르게 읽는다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력
- `budgetMode`
  - `deposit`: 보증금 기준
  - `monthlyTotal`: 월 고정 주거비 기준
- `budgetValue`
  - 단위 `만원`
  - 기본값 예시 `30000`
- `districtKey`
  - `gangseo`
  - `gangdong`
  - `gangbuk`
  - 추후 확장 가능
- `housingMode`
  - `jeonse`
  - `semiJeonse`
  - `wolse`

#### 확장 대비 URL 파라미터
- `budget`
- `mode`
- `district`
- `housing`

### 6-2. 출력값

#### 메인 리포트 출력
- 서울 평균 전세가 변화율
- 서울 평균 매매가 변화율
- 서울 전세 비중 변화
- 반전세/월세 전환 체감 요약
- 지역별 체감 난이도 문구

#### 차트 / 표 출력
- 연도별 서울 평균 전세가 / 매매가 추이
- 연도별 전세 비중 또는 거래 비중 추이
- 지역별 비교 카드
- 조건 변화 비교표

#### 체감 계산 출력
- 입력 예산에서 가능한 주거 방식
- 전세 유지 가능 여부
- 반전세/월세로 전환 시 월 부담 요약
- 관련 계산기 CTA 문구

---

## 7. 데이터 구조 (`src/data/seoulApartmentJeonseReport.ts`)

### 7-1. 타입 정의

```ts
export type HousingMode = 'jeonse' | 'semiJeonse' | 'wolse';
export type BudgetMode = 'deposit' | 'monthlyTotal';
export type DistrictKey = 'gangseo' | 'gangdong' | 'gangbuk';

export interface ReportMeta {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  caution: string;
}

export interface KpiCard {
  label: string;
  value: string;
  change: string;
  tone?: 'neutral' | 'warn' | 'accent';
}

export interface MarketPoint {
  year: number;
  jeonsePrice: number;
  salePrice: number;
  rentDeposit?: number;
  rentMonthly?: number;
  jeonseShare?: number;
}

export interface DistrictCard {
  key: DistrictKey;
  name: string;
  tagline: string;
  commuteFit: string;
  summary: string;
  thenVsNow: string;
  compromise: string[];
}

export interface ConditionCompareRow {
  label: string;
  before: string;
  now: string;
  impact: string;
}

export interface CauseCard {
  title: string;
  description: string;
}

export interface BehaviorShiftCard {
  title: string;
  summary: string;
}

export interface BudgetScenario {
  budgetMin: number;
  budgetMax: number;
  depositGuide: string;
  jeonseResult: string;
  semiJeonseResult: string;
  wolseResult: string;
  recommendedCta: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface SeoulApartmentJeonseReportData {
  meta: ReportMeta;
  heroSummary: string;
  kpis: KpiCard[];
  marketSeries: MarketPoint[];
  districtCards: DistrictCard[];
  conditionRows: ConditionCompareRow[];
  causes: CauseCard[];
  behaviorShifts: BehaviorShiftCard[];
  budgetScenarios: BudgetScenario[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}
```

### 7-2. 데이터 설계 원칙
- 수치는 실시간 호출이 아니라 고정 데이터로 보관한다.
- `marketSeries`는 차트와 KPI 계산의 단일 소스로 사용한다.
- 지역 체감 섹션은 과도한 정밀 수치보다 `설명 가능한 비교 문구`를 우선한다.
- 예산 인터랙션은 정밀 매물 추천이 아니라 `대안 구조 이해`에 초점을 둔다.

### 7-3. 초기 데이터 범위
- 시계열 데이터: 2016, 2018, 2020, 2022, 2024, 2026 기준
- 지역 카드: 강서 / 강동 / 강북 3개
- 조건 비교 행: 최소 5개
  - 예산
  - 역세권 접근성
  - 면적
  - 준공 연식
  - 전세 단독 선택 가능성
- 전세 감소 원인 카드: 4개
- 행동 변화 카드: 3개
- FAQ: 5개 내외

---

## 8. 페이지 구조

### 8-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 서울 전세 브리프 보드
4. KPI 요약 카드
5. 서울 평균 전세가 / 매매가 추이 차트
6. 전세 비중 또는 거래 구조 변화 차트
7. `예전 vs 지금` 직접 비교 보드
8. 강서 / 강동 / 강북 체감 카드
9. 조건 변화 비교표
10. 전세가 어려워진 이유 카드 보드
11. 수요자 행동 변화 카드 보드
12. 예산 기준 선택지 체감 박스
13. FAQ
14. 외부 참고 링크
15. 관련 계산기 / 제휴 CTA
16. `SeoContent`

### 8-2. 모바일 우선 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 메인 차트
- 보조 차트
- 직접 비교 보드
- 지역 체감 카드
- 조건 비교표
- 원인 카드
- 행동 변화 카드
- 예산 입력 박스
- FAQ
- 참고 링크
- CTA
- SEO

### 8-3. PC 레이아웃
- 브리프 보드는 `좌: 리드 설명 / 우: 요약 카드 3개` 2열
- 차트 2종은 상하 배치가 기본, 넓은 화면에서는 2열 허용
- 지역 카드 3종은 3열 카드 그리드
- 조건 비교표는 전체폭, 모바일에서는 가로 스크롤 허용
- 하단 CTA는 `관련 계산기 2개 + 제휴 1개` 카드 그리드

---

## 9. 섹션별 구현 상세

### 9-1. Hero
- eyebrow: `서울 주거 리포트`
- H1: `전세 사라지는 서울 아파트`
- H2 또는 서브카피: `신혼부부가 찾던 역세권 전세는 왜 없어졌나`
- 설명:
  - 서울 아파트 전세가 줄어든 체감과 선택지 변화를 데이터 중심으로 정리한다.
  - 전세만 볼지, 반전세와 월세까지 같이 봐야 할지를 비교계산소답게 보여준다.

### 9-2. InfoNotice
- 필수 문구
  - 수치는 공개 통계와 기사 정리값 기반의 비교용 참고 데이터임
  - 평균값과 개별 매물 가격은 다를 수 있음
  - 지역 체감 카드는 실제 현장 매물 탐색을 대체하지 않음
  - 기준 시점과 업데이트일 명시

### 9-3. 서울 전세 브리프 보드
- 목적: 첫 화면에서 사용자가 `전세 감소`, `선호 지역 난이도 상승`, `대안 전환 필요`를 동시에 이해하게 만든다.
- 구성
  - 리드 문단 1개
  - 하이라이트 카드 3개
    - 서울 평균 전세가 변화
    - 전세 비중 또는 전세 매물 체감 감소
    - 신혼부부 선택 방식 변화

### 9-4. KPI 요약 카드
- 4~5개 권장
  - 서울 평균 전세가 변화율
  - 서울 평균 매매가 변화율
  - 전세 비중 변화
  - 월세 전환 체감
  - 특정 대표 지역 체감 문구

### 9-5. 서울 평균 전세가 / 매매가 추이 차트
- 메인 메시지 차트
- x축: 연도
- y축: 금액
- 라인 2개
  - 서울 평균 전세가
  - 서울 평균 매매가
- 목적: 전세만이 아니라 매매와의 거리도 커졌음을 보여준다.

### 9-6. 전세 비중 변화 차트
- 보조 차트
- x축: 연도
- y축: 비중 또는 지표값
- 전세 비중 단일 라인 또는 거래 구조 스택 막대
- 목적: 단순 가격 문제가 아니라 공급/거래 구조 변화라는 점을 보여준다.

### 9-7. 예전 vs 지금 직접 비교 보드
- 2열 비교 카드
- 왼쪽 `이전`
- 오른쪽 `현재`
- 비교 항목
  - 예산 대비 전세 선택지
  - 역세권 접근성
  - 면적
  - 연식
  - 전세 단독 탐색 가능성
- UX 목표: 한눈에 `같은 예산인데 조건이 달라졌다`는 체감을 만든다.

### 9-8. 강서 / 강동 / 강북 체감 카드
- 각 카드 구성
  - 지역명
  - 왜 많이 찾는지
  - 지금 느껴지는 변화
  - 어떤 조건을 포기하게 되는지
- 수치보다 문장 해설 비중을 높인다.

### 9-9. 조건 변화 비교표
- 열 구성
  - 항목
  - 예전
  - 지금
  - 실수요자 영향
- 최소 5행
- 모바일에서 잘리는 경우 가로 스크롤 허용

### 9-10. 전세가 어려워진 이유 카드 보드
- 카드 4개 고정
  - 금리 환경 변화
  - 전세사기 이후 신뢰 저하
  - 임대인의 월세 선호 확대
  - 입지 좋은 신축/역세권 물량 경쟁 심화

### 9-11. 수요자 행동 변화 카드 보드
- 카드 3개 고정
  - 전세만 보던 수요가 반전세/월세까지 넓어짐
  - 서울 안에서 입지/면적/연식 중 하나를 양보하게 됨
  - 일부는 매매 가능성까지 병행 검토하게 됨

### 9-12. 예산 기준 선택지 체감 박스
- 입력 2개
  - 예산 기준 방식
  - 금액
- 출력 3개
  - 전세 기준 결과
  - 반전세 기준 결과
  - 월세 기준 결과
- 결과 하단에 CTA 2개 노출
  - `전세 vs 월세 계산기`
  - `주택 구매 자금 계산기`
- 주의: 이 박스는 추천 엔진이 아니라 `방향 제시형 도우미`다.

### 9-13. FAQ
- 5개 권장
  - 왜 서울 전세가 줄어든 것처럼 느껴지나
  - 역세권 전세가 특히 더 어려운 이유는 뭔가
  - 전세 대신 반전세를 봐야 하는 기준은 뭔가
  - 서울 외곽으로 가면 해결되나
  - 지금은 전세보다 매매를 같이 봐야 하나

### 9-14. 외부 참고 링크
- 정부/통계/언론 참고 링크 3~5개
- 링크 카드 또는 목록형

### 9-15. 관련 계산기 / 제휴 CTA
- 계산기 CTA 2개
  - `전세 vs 월세 비교 계산기`
  - `주택 구매 자금 계산기`
- 리포트 CTA 1개
  - `서울 주거비 2016 vs 2026`
- 제휴 영역은 과도하게 크게 두지 않는다.

---

## 10. 인터랙션 설계 (`public/scripts/seoul-apartment-jeonse-report.js`)

### 10-1. 필요한 인터랙션
- 차트 탭 또는 보조 지표 토글
- 지역 카드 active 상태 전환
- 예산 입력값에 따른 시나리오 매칭
- 결과 CTA 문구 동적 변경

### 10-2. 스크립트 책임 범위
- 입력값 읽기
- 사전 정의된 시나리오와 매칭
- DOM 업데이트
- URL 파라미터 동기화는 선택 구현, MVP에서는 선택

### 10-3. 비계산 원칙
- 복잡한 실거래 계산은 하지 않는다.
- 사용자가 입력한 값은 미리 정의한 구간(`budgetScenarios`)에 매핑한다.
- 계산 불가 상태에서는 `정확 매물 추천 아님` 문구를 유지한다.

---

## 11. 스타일 가이드 (`_seoul-apartment-jeonse-report.scss`)

### 11-1. CSS prefix
- `sajr-` 사용
  - Seoul Apartment Jeonse Report

### 11-2. 톤 앤 매너
- 기존 부동산 리포트와 연결감을 유지하되 과도한 위기감 연출은 피한다.
- 색상 방향
  - 전세/중립 데이터: 딥 블루 계열
  - 경고성 체감: 앰버/오렌지 포인트
  - 대안 선택지: 민트 또는 그린 포인트
- 카드 대비를 충분히 줘서 숫자와 문장이 같이 읽히게 한다.

### 11-3. 반응형 포인트
- 768px 이하
  - 지역 카드 1열
  - KPI 2열 이하
  - 비교표 가로 스크롤
- 1024px 이상
  - 브리프 2열
  - 지역 카드 3열
  - CTA 3열 가능

---

## 12. SEO 설계

### 12-1. 메인 키워드
- 서울 아파트 전세
- 서울 전세 감소
- 서울 역세권 전세
- 신혼부부 서울 전세

### 12-2. 서브 키워드
- 강서구 아파트 전세
- 강동구 아파트 전세
- 강북구 아파트 전세
- 서울 전세 사라짐
- 서울 전세 대신 월세

### 12-3. 롱테일 키워드
- 신혼부부가 서울 전세 구하기 어려운 이유
- 서울 역세권 아파트 전세가 왜 없나
- 서울 아파트 전세 줄어든 이유
- 서울에서 전세 대신 반전세를 봐야 하나

### 12-4. 메타 초안
- `seoTitle`: `전세 사라지는 서울 아파트 | 신혼부부가 찾던 역세권 전세는 왜 없어졌나`
- `seoDescription`: `서울 아파트 전세가 왜 체감상 줄어들었는지, 강서·강동·강북 실수요 지역 기준으로 정리했습니다. 전세, 반전세, 월세 중 어떤 선택을 같이 봐야 하는지도 비교합니다.`

---

## 13. 구현 체크리스트

### 13-1. 데이터
- `src/data/seoulApartmentJeonseReport.ts` 생성
- KPI, 차트, 지역 카드, FAQ 데이터 분리
- 문구와 수치가 한 파일에서 관리되도록 고정

### 13-2. 페이지
- `src/pages/reports/seoul-apartment-jeonse-report.astro` 생성
- 공통 리포트 컴포넌트 재사용 우선
- 표/카드/CTA 섹션 조립

### 13-3. 스크립트
- `public/scripts/seoul-apartment-jeonse-report.js` 생성
- 예산 입력과 지역 선택 인터랙션 구현
- JS 미동작 시에도 기본 콘텐츠 읽기 가능해야 함

### 13-4. 스타일
- `_seoul-apartment-jeonse-report.scss` 생성 및 `app.scss`에 import
- 모바일 우선 반응형 적용
- 차트 컨테이너 높이 고정

### 13-5. 사이트 반영
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro` 허브 노출 확인
- `public/sitemap.xml` 추가

---

## 14. QA 기준

### 14-1. 콘텐츠 QA
- 제목, 서브카피, 메타 문구가 기획 의도와 맞는가
- 지역 카드 3종의 톤이 과장 없이 일관적인가
- 전세 감소 이유 4개와 행동 변화 3개가 중복되지 않는가

### 14-2. 데이터 QA
- KPI 값이 차트 데이터와 모순되지 않는가
- 비교 보드의 `이전 vs 현재` 문구가 브리프/KPI와 충돌하지 않는가
- 예산 시나리오 구간이 겹치거나 비지 않는가

### 14-3. UI QA
- 모바일에서 비교표와 차트가 깨지지 않는가
- 카드 간 높이 차가 과도하지 않은가
- CTA가 본문 흐름을 끊지 않고 자연스럽게 이어지는가

### 14-4. 인터랙션 QA
- 지역 선택 시 active 상태가 명확한가
- 예산 입력 시 잘못된 값에 대한 기본 처리 문구가 있는가
- JS 없이도 핵심 콘텐츠를 읽을 수 있는가

---

## 15. 개발 메모

- 기획 원문이 콘솔에서 일부 인코딩 이슈로 깨져 보여, 제목과 기존 섹션 구조를 기준으로 설계 문서 형태로 재정리했다.
- 실제 수치 입력 단계에서는 공개 통계/기사 기준 출처를 데이터 파일 주석에 함께 남기는 것을 권장한다.
- 이후 구현 시 가장 먼저 `src/data/seoulApartmentJeonseReport.ts`를 고정하면 페이지 조립 속도가 빨라진다.
