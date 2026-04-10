# C007 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202603/C007_PLAN.md`
- 구현 대상: `2026 이재명 정부 핵심 공직자 재산·보수 비교` 리포트
- 참고 리포트: `insurance-salary-bonus-comparison-2026`, `construction-salary-bonus-comparison-2026`, `korea-rich-top10-assets`

### 1-2. 전제
- 현재 [C007_PLAN.md](D:/git/swchoi/blog-tool/docs/plan/202603/C007_PLAN.md)는 비어 있으므로, 이번 문서는 사용자 요청 제목과 추가 제공한 1차 공개용 데이터 표를 기준으로 설계한 개발 문서다.
- 데이터 기준은 `2026년 3월 26일 정기 재산변동 공개` 기사 요약본이며, 기사에 명시된 값만 1차 반영하고 공란은 2차 원문 보강 대상으로 둔다.
- 따라서 이번 문서는 `1차 오픈용 비교 리포트 설계`이며, 추후 관보 원문 기준으로 보강하는 구조를 전제로 한다.

### 1-3. 문서 역할
- C007 주제를 비교계산소 기준의 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션, 비교 기준, 계산 규칙, 구현 순서, QA 기준을 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-4. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `정권 핵심 인사 요약 -> 재산/보수 랭킹 -> 자산 구성 비교 -> 내 기준 벤치마크 -> 인물 상세 탐색`
- 정치 기사형 장문 콘텐츠가 아니라, 공개 재산과 공직 보수를 카드, 차트, 표, 배수 비교로 읽게 만드는 구조를 우선한다.
- 비교계산소답게 `공개 데이터 비교 + 가벼운 개인 벤치마크`를 결합하되, 정치적 평가보다 수치 해석에 집중한다.

### 1-5. 권장 slug
- `lee-jaemyung-government-officials-assets-salary-2026`
- URL: `/reports/lee-jaemyung-government-officials-assets-salary-2026/`

### 1-6. 권장 파일 구조
- `src/data/leeGovernmentOfficialsAssetsSalary2026.ts`
- `src/pages/reports/lee-jaemyung-government-officials-assets-salary-2026.astro`
- `public/scripts/lee-jaemyung-government-officials-assets-salary-2026.js`
- `src/styles/scss/pages/_lee-jaemyung-government-officials-assets-salary-2026.scss`
- `public/og/reports/lee-jaemyung-government-officials-assets-salary-2026.png`

---

## 2. 현재 프로젝트 비교 컨텐츠 구조 정리

### 2-1. 현재 리포트 공통 구조
현재 `/reports/` 비교 컨텐츠는 아래 공통 구조를 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 요약 보드 또는 KPI 카드
4. 비교 차트 / 표 / 랭킹 보드
5. 선택형 탐색 영역
6. 패턴 요약 / 인사이트 카드
7. 외부 참고 링크
8. 선택형 제휴 블록
9. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 C007이 따라야 할 방향
- `construction-salary-bonus-comparison-2026`에서 가져올 것
  - 리포트형 브리프 보드
  - KPI + 포디움 + 상세 카드 조합
  - 필터/정렬/선택 카드 흐름
- `insurance-salary-bonus-comparison-2026`에서 가져올 것
  - 비교표 중심 구조
  - 가벼운 벤치마크 패널
  - 패턴 요약 + 공식 링크 구성
- `korea-rich-top10-assets`에서 가져올 것
  - 자산 비교 콘텐츠의 읽는 방식
  - 자산 절대액을 직관적으로 해석하는 보조 지표 구조
- C007에서 새롭게 강조할 것
  - `총재산`과 `공직 보수`를 분리해서 읽게 하는 것
  - 자산 절대액뿐 아니라 `건물 / 토지 / 전세권 / 예금 / 증권 / 채무` 세부 자산 구성까지 보여주는 것
  - `연 보수 대비 자산 배수`를 같이 보여 주는 것
  - 정치적 평가가 아니라 `공개 수치 비교`와 `역할군 비교`에 집중하는 것

---

## 3. 구현 범위

### 3-1. MVP 범위
- 비교 대상 공직자 15명을 고정 데이터로 제공한다.
- 1차 공개 기준 비교 대상은 아래 15명으로 시작한다.
  - 이재명 대통령
  - 김민석 국무총리
  - 강훈식 대통령비서실장
  - 김용범 정책실장
  - 위성락 국가안보실장
  - 하정우 AI미래기획수석
  - 한성숙 중소벤처기업부 장관
  - 최휘영 문화체육관광부 장관
  - 김정관 산업통상자원부 장관
  - 안규백 국방부 장관
  - 정은경 보건복지부 장관
  - 구윤철 경제부총리 겸 재정경제부 장관
  - 정동영 통일부 장관
  - 조현 외교부 장관
  - 송미령 농림축산식품부 장관
- 핵심 비교 항목 11종을 제공한다.
  - 총재산
  - 건물
  - 토지
  - 전세권
  - 예금
  - 증권
  - 채무
  - 공직 연 보수
  - 월 보수 환산
  - 재산/보수 배수
  - 소속 그룹 / 직책
- 비교 인터랙션 4종을 제공한다.
  - 비교 기준 탭: 총재산 / 연 보수 / 월 보수 / 재산배수
  - 그룹 필터: 전체 / 대통령실 / 국무총리실 / 내각 / 기타 핵심 인사
  - 자산 세부 필드 보기 토글: 전체 / 실물자산 / 금융자산 / 채무 중심
  - 정렬: 높은순 / 낮은순 / 가나다순
- 벤치마크 패널 1종을 제공한다.
  - 내 연봉 입력
  - 내 순자산 입력
  - 선택 공직자 기준 비교
  - `몇 배`, `몇 년치` 해석 출력
- 해설 영역 3종을 제공한다.
  - 역할군별 특징 카드
  - 패턴 요약 카드
  - 공식/언론/공개 자료 링크

### 3-2. 1차 공개 화면에 고정할 필드
- 사용
  - 총재산
  - 건물
  - 토지
  - 전세권
  - 예금
  - 증권
  - 채무
  - 공직 연봉
- 2차 추천
  - 순자산
  - 금융자산 비중

### 3-3. MVP 제외 범위
- 정치 성향 / 찬반 해석
- 선거 공약 비교
- 실시간 뉴스 연동
- 댓글 / 여론 기능
- 사용자 저장 기능
- 비공개 추정 자산 추가
- 관보 원문 OCR 자동 파싱

---

## 4. 페이지 목적

- 2026년 3월 26일 정기 재산변동 공개 기준으로 이재명 정부 핵심 공직자의 공개 재산과 보수를 한 페이지에서 비교해 사용자가 수치 구조를 빠르게 읽게 한다.
- 자산 절대액만 소비되는 페이지가 아니라, `공직 보수 대비 자산 규모`와 `세부 자산 구성`까지 함께 보여 줘 비교 해석을 쉽게 만든다.
- 비교계산소다운 차별점으로 `내 연봉 / 내 자산 기준 벤치마크`를 붙여 사용자가 숫자를 자기 기준으로 환산하게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 일반 검색 유입 사용자
- `이재명 정부 장관 재산`, `핵심 공직자 재산 순위`, `공직자 연봉 비교` 검색 후 들어와 상위 인사의 재산과 보수를 빠르게 파악한다.

### 5-2. 뉴스 소비 사용자
- 기사에서 본 인사의 자산 규모가 다른 인사들과 비교해 어느 수준인지 본다.
- 재산이 큰 인사와 보수가 높은 직책이 반드시 같은지 확인한다.
- 특정 인물의 자산 구성이 건물 중심인지 예금/증권 중심인지 본다.

### 5-3. 정치/행정 관심 사용자
- 대통령실, 총리실, 장관급 인사의 공개 재산과 보수를 그룹별로 나눠 본다.
- 역할군별 평균치를 보고 어느 그룹의 자산 규모가 상대적으로 큰지 읽는다.

### 5-4. 숫자 비교형 사용자
- 내 연봉, 내 순자산을 넣고 특정 공직자의 재산이 내 기준 몇 배인지 확인한다.
- 연 보수 기준으로 공개 재산이 몇 년치인지 직관적으로 이해한다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력
- `compareMode`
  - `asset`: 총재산
  - `annualComp`: 연 보수
  - `monthlyComp`: 월 보수 환산
  - `assetToComp`: 재산/연 보수 배수
- `groupFilter`
  - `all`
  - `presidential-office`
  - `prime-minister-office`
  - `cabinet`
  - `other-core`
- `assetBreakdownFilter`
  - `all`
  - `real-estate`
  - `financial`
  - `debt`
- `sort`
  - `desc`
  - `asc`
  - `name`
- `selectedOfficial`
  - 상세 카드용 인물 slug

#### 벤치마크 입력
- `myAnnualSalary`
  - 단위: 만원
  - 설명: 사용자 기준 연 보수
- `myNetWorth`
  - 단위: 만원
  - 설명: 사용자 기준 순자산
- `selectedOfficial`
  - 비교 기준 인물

### 6-2. 출력값

#### 메인 리포트 출력
- 공개 재산 상위 공직자
- 연 보수 상위 직책군 또는 인물
- 재산/보수 배수 상위 인물
- 비교 대상 공직자 수

#### 랭킹 / 탐색 출력
- 필터링된 공직자 차트 또는 ranking rows
- 선택 공직자 상세 카드
- 역할군별 평균 요약 카드
- 자산 세부 필드 요약 카드

#### 벤치마크 출력
- 내 연봉 대비 선택 공직자 연 보수 배수
- 내 순자산 대비 선택 공직자 총재산 배수
- 선택 공직자 재산이 공직 보수 몇 년치인지
- 짧은 해석 코멘트

---

## 7. 섹션 구조

### 7-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 핵심 공직자 자산·보수 브리프 보드
4. KPI 요약 카드
5. 상위권 포디움
6. 비교 차트 보드
7. 메인 비교 테이블
8. 내 기준 벤치마크 + 선택 공직자 상세 카드
9. 패턴 요약 / 역할군 특징
10. 외부 참고 링크
11. 선택형 제휴 블록
12. `SeoContent`

### 7-2. 모바일 우선 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 포디움 카드
- 차트 보드
- 비교 테이블
- 벤치마크 패널
- 선택 공직자 상세 카드
- 패턴 요약
- 외부 참고 링크
- 제휴 블록
- SEO

### 7-3. PC 레이아웃
- 브리프 보드는 `좌: 리드 해설 / 우: 하이라이트 카드` 2열
- 차트 보드는 `좌: 총재산 / 우: 연 보수 또는 배수` 2열
- 벤치마크/상세 카드는 `좌: 내 기준 벤치마크 / 우: 선택 인물 카드` 2열
- 비교 테이블은 전체폭 + 가로 스크롤 대응

### 7-4. 섹션별 역할

#### Hero
- eyebrow: `Interactive Report`
- H1 예시: `2026 이재명 정부 핵심 공직자 재산·보수 비교`
- 설명 예시:
  - 대통령실, 총리실, 장관급 등 핵심 공직자의 공개 재산과 연 보수를 한 페이지에서 비교한다.
  - 단순 재산 순위가 아니라 공직 보수 대비 자산 규모와 자산 구성까지 같이 읽는 구조라는 점을 초반에 준다.

#### InfoNotice
- 필수 문구
  - 재산은 `2026년 3월 26일 정기 재산변동 공개` 기사 요약 기준 값임
  - 기사에 명시된 세부 항목만 1차 반영했고 공란은 2차 관보 원문 보강 대상임
  - 보수는 직책별 공개 보수 규정 또는 연 환산 추정치일 수 있음
  - 실제 수령액과 공개 재산은 시점 및 산정 방식 차이가 있을 수 있음

#### 핵심 공직자 브리프 보드
- 리드 문단 1개
- 하이라이트 카드 3~4개
  - 총재산 상위권
  - 연 보수 상위권
  - 재산/보수 배수 상위권
  - 그룹별 평균 차이 포인트
- 목적: 검색 유입 사용자가 첫 화면에서 이 페이지 성격을 바로 이해하게 한다.

#### KPI 요약 카드
- 카드 4개 권장
  - 총재산 1위
  - 연 보수 상위권
  - 재산/보수 배수 최대
  - 비교 대상 공직자 수

#### 포디움 카드
- 기준: 기본값은 총재산 Top 3
- 카드 노출값
  - 이름
  - 직책
  - 총재산
  - 한 줄 해설
- 숫자만이 아니라 왜 눈에 띄는지 같이 보여 준다.

#### 비교 차트 보드
- 차트 2종 권장
  - 총재산 비교
  - 연 보수 또는 재산/보수 배수 비교
- 1차는 Chart.js 가로 바 차트
- 막대 클릭 시 상세 카드와 선택 select가 동기화되면 좋다.

#### 메인 비교 테이블
- 페이지의 핵심 데이터 영역
- 컬럼
  - 이름
  - 직책
  - 소속 그룹
  - 총재산
  - 건물
  - 토지
  - 전세권
  - 예금
  - 증권
  - 채무
  - 연 보수
  - 재산/보수 배수
- 모바일에서는 `overflow-x: auto` 우선
- 결측치는 `-`로 표기

#### 내 기준 벤치마크 패널
- 비교계산소다운 참여 요소
- 입력
  - 내 연봉
  - 내 순자산
  - 비교 대상 인물 선택
- 출력
  - 내 자산 대비 몇 배
  - 내 연봉 대비 몇 배
  - 해당 인물 재산이 연 보수 몇 년치인지
  - 짧은 코멘트
- 주의
  - 이 패널은 해석 보조용이며 본 리포트 메인은 공개 수치 비교다.

#### 선택 공직자 상세 카드
- 선택 인물 기준 정보 노출
  - 이름 / 직책 / 그룹
  - 총재산
  - 연 보수
  - 월 보수 환산
  - 재산/보수 배수
  - 건물 / 토지 / 전세권 / 예금 / 증권 / 채무 카드
  - 태그
  - 한 줄 요약
  - 자산 구조 설명
  - 공식 / 기사 / 공개자료 링크

#### 패턴 요약 섹션
- 카드 3~4개
- 예시 주제
  - 재산 상위와 보수 상위가 다른 이유
  - 대통령실 / 내각 / 총리실 그룹 차이
  - 재산/보수 배수로 읽으면 보이는 구조
  - 1차 기사 요약 데이터와 2차 관보 원문 보강의 차이

#### 역할군 특징 섹션
- 그룹별 특징을 짧게 보여주는 카드 또는 리스트
- 예: 대통령실 / 장관급 / 총리실 / 기타 핵심 인사
- SEO용 장문보다 `그룹명 + 한 줄 특징` 구조를 유지한다.

#### 외부 참고 링크 섹션
- 3개 그룹으로 분리
  - 공식 공개자료
  - 보수 기준 / 정책 자료
  - 기사 출처
- 공식 링크 우선
- 새 창 열기

#### 제휴 상품 섹션
- 이번 주제는 상업성이 약하므로 `선택형`이다.
- 기본안은 제휴 섹션 생략
- 넣더라도 뉴스/행정/업무 정리용 생산성 아이템 1개 박스만 허용

---

## 8. 컴포넌트 구조

### 8-1. 공용 컴포넌트
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `panel`, `content-section`, `section-header`, `report-stat-card`

### 8-2. 페이지 전용 블록
- `gov-report-hero-board`
- `gov-highlight-card`
- `gov-podium-grid`
- `gov-chart-board`
- `gov-compare-table`
- `gov-benchmark-panel`
- `gov-official-profile`
- `gov-asset-breakdown-grid`
- `gov-pattern-grid`
- `gov-reference-panel`

설명:
- prefix `gov-` = government officials assets report

### 8-3. Astro 페이지 구성 방식
- `.astro`에서 KPI, 기본 선택 인물, FAQ 데이터를 계산한다.
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/lee-jaemyung-government-officials-assets-salary-2026.js`에서
  - 필터/정렬
  - 차트/row 렌더
  - 인물 선택 동기화
  - 벤치마크 결과 갱신
- 1차는 별도 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태
```ts
type CompareMode = "asset" | "annualComp" | "monthlyComp" | "assetToComp";
type GroupFilter = "all" | "presidential-office" | "prime-minister-office" | "cabinet" | "other-core";
type AssetBreakdownFilter = "all" | "real-estate" | "financial" | "debt";

type ViewState = {
  compareMode: CompareMode;
  groupFilter: GroupFilter;
  assetBreakdownFilter: AssetBreakdownFilter;
  sort: "desc" | "asc" | "name";
  selectedOfficial: string;
  myAnnualSalary: number;
  myNetWorth: number;
};
```

### 9-2. 초기값
- `compareMode = "asset"`
- `groupFilter = "all"`
- `assetBreakdownFilter = "all"`
- `sort = "desc"`
- `selectedOfficial = asset top official`
- `myAnnualSalary = 7000`
- `myNetWorth = 30000`

### 9-3. 동작 규칙
- 비교 기준 변경 시
  - 차트/row 재정렬
  - 요약 bar 동기화
- 그룹 필터 변경 시
  - 차트 / 테이블 / select 후보를 함께 갱신
- 세부 자산 필터 변경 시
  - 상세 카드 및 보조 bar UI를 재구성
- 인물 선택 변경 시
  - 상세 카드와 벤치마크 기준 인물 동기화
- 벤치마크 입력 변경 시
  - 배수 및 연수 결과 즉시 갱신
- URL 파라미터 동기화 권장
  - `mode`
  - `group`
  - `assetFilter`
  - `sort`
  - `official`
  - `salary`
  - `asset`

예시:
```txt
/reports/lee-jaemyung-government-officials-assets-salary-2026/?mode=assetToComp&group=cabinet&official=jeong-eunkyung&salary=8000&asset=50000
```

---

## 10. 계산 로직

### 10-1. 월 보수 환산
```ts
monthlyCompManwon = Math.round(annualCompManwon / 12);
```

### 10-2. 재산/보수 배수
```ts
assetToComp = annualCompManwon > 0 ? Number((totalAssetsManwon / annualCompManwon).toFixed(1)) : null;
```

### 10-3. 내 자산 대비 배수
```ts
vsMyAsset = myNetWorth > 0 ? Number((selected.totalAssetsManwon / myNetWorth).toFixed(1)) : null;
```

### 10-4. 내 연봉 대비 배수
```ts
vsMySalary = myAnnualSalary > 0 ? Number((selected.annualCompManwon / myAnnualSalary).toFixed(1)) : null;
```

### 10-5. 해당 인물 재산이 연 보수 몇 년치인지
```ts
yearsOfComp = selected.annualCompManwon > 0 ? Number((selected.totalAssetsManwon / selected.annualCompManwon).toFixed(1)) : null;
```

### 10-6. 자산 세부 합계 참고치
```ts
knownAssetSubtotal =
  (buildingManwon ?? 0) +
  (landManwon ?? 0) +
  (jeonseRightManwon ?? 0) +
  (depositsManwon ?? 0) +
  (securitiesManwon ?? 0);
```
- 1차 데이터는 기사 요약 기반이라 세부 합계가 총재산과 반드시 일치하지 않을 수 있음
- 따라서 합계는 표시용 참고치로만 사용하고, 총재산을 기준값으로 본다.

### 10-7. 정렬값
```ts
if (compareMode === "asset") sortValue = entry.totalAssetsManwon;
if (compareMode === "annualComp") sortValue = entry.annualCompManwon;
if (compareMode === "monthlyComp") sortValue = entry.monthlyCompManwon;
if (compareMode === "assetToComp") sortValue = entry.assetToComp ?? -1;
```

### 10-8. KPI 계산
- 총재산 1위 인물: `totalAssetsManwon` max
- 연 보수 상위 인물: `annualCompManwon` max
- 재산/보수 배수 최대 인물: `assetToComp` max
- 비교 대상 수: entries length

### 10-9. 그룹별 평균
```ts
presidentialOfficeAvgAsset = average(entries.filter((e) => e.group === "presidential-office"));
cabinetAvgAsset = average(entries.filter((e) => e.group === "cabinet"));
primeMinisterOfficeAvgAsset = average(entries.filter((e) => e.group === "prime-minister-office"));
```

---

## 11. 데이터 파일 구조

### 11-1. 메인 데이터 파일 구조
```ts
export type OfficialGroup = "presidential-office" | "prime-minister-office" | "cabinet" | "other-core";

export type GovernmentOfficialEntry = {
  slug: string;
  personId: string;
  personName: string;
  roleTitle: string;
  group: OfficialGroup;
  groupLabel: string;
  totalAssetsManwon: number;
  buildingManwon?: number | null;
  landManwon?: number | null;
  jeonseRightManwon?: number | null;
  depositsManwon?: number | null;
  securitiesManwon?: number | null;
  debtsManwon?: number | null;
  annualCompManwon: number;
  monthlyCompManwon: number;
  assetToComp: number | null;
  memo: string;
  roleTag: string;
  summary: string;
  tags: string[];
  sourceLabel: string;
  sourceUrl: string;
  officialUrl?: string;
  updatedAt: string;
  hasPartialBreakdown?: boolean;
};

export type LeeGovernmentOfficialsAssetsSalary2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
    dataBaseDate: string;
  };
  entries: GovernmentOfficialEntry[];
  patternPoints: { title: string; body: string }[];
  featureCards: { label: string; body: string }[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    official: { label: string; href: string }[];
    salary: { label: string; href: string }[];
    coverage: { label: string; href: string }[];
  };
  appendix: {
    readyForDetailedCompare: string[];
    needsSecondPass: { name: string; reason: string }[];
  };
  rawTsv?: string;
};
```

### 11-2. 1차 데이터 반영 규칙
- 단위는 모두 `만원` 기준으로 저장한다.
- 자산 세부 필드는 사용자가 제공한 1차 표를 기준으로 넣는다.
- 기사에 명시되지 않은 값은 `null` 또는 `undefined`로 둔다.
- `totalAssetsManwon`은 기사 기준 총재산 원값을 우선한다.
- 세부 자산 필드 합계가 총재산과 어긋나더라도 1차 오픈에서는 허용하고, `InfoNotice`와 `memo`에서 설명한다.
- `sourceLabel`, `sourceUrl`은 행 단위로 반드시 1개 이상 넣는다.

### 11-3. 1차 공개용 권장 데이터 행 예시
```ts
{
  slug: "lee-jaemyung",
  personId: "lee-jaemyung",
  personName: "이재명",
  roleTitle: "대통령",
  group: "presidential-office",
  groupLabel: "대통령실",
  totalAssetsManwon: 49772,
  buildingManwon: 230000,
  jeonseRightManwon: 4800,
  depositsManwon: 30641,
  annualCompManwon: 26000,
  monthlyCompManwon: 2167,
  assetToComp: 1.9,
  memo: "분당 아파트 16,850, 부동산 자산 총 23억 보도",
  roleTag: "대통령",
  summary: "공개 재산과 예금이 같이 언급된 대표 인물",
  tags: ["대통령실", "총재산 공개", "예금 확인"],
  sourceLabel: "뉴시스",
  sourceUrl: "https://www.newsis.com/view/NISX20260325_0003563035?utm_source=chatgpt.com",
  updatedAt: "2026-03-26",
  hasPartialBreakdown: true,
}
```

### 11-4. 1차 공개용 TSV 원문 보관 방식
- 사용자가 제공한 TSV는 `rawTsv` 문자열로 데이터 파일 하단에 보관 가능
- 목적
  - 2차 관보 보강 시 원본 입력 추적
  - 데이터 이관 / 수정 비교
- 단, 렌더링은 구조화된 `entries` 배열 기준으로만 진행한다.

### 11-5. 등록 파일
- 메인 데이터: `src/data/leeGovernmentOfficialsAssetsSalary2026.ts`
- 리포트 목록 등록: `src/data/reports.ts`
- 리포트 허브 노출: `src/pages/reports/index.astro`
- 사이트맵 등록: `public/sitemap.xml`

---

## 12. 구현 순서

### 12-1. 1단계: 데이터 파일 작성
- `src/data/leeGovernmentOfficialsAssetsSalary2026.ts` 생성
- 공직자 15명 데이터 입력
- 사용자가 준 1차 표 기준으로 `건물 / 토지 / 전세권 / 예금 / 증권 / 채무` 반영
- `meta`, `faq`, `patternPoints`, `featureCards`, `referenceLinks`, `appendix` 포함
- 파생값
  - 재산 순위
  - 보수 순위
  - 배수 순위
  - 그룹별 평균

### 12-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/lee-jaemyung-government-officials-assets-salary-2026.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - 브리프 보드
  - KPI
  - 포디움 카드
  - 차트 보드
  - 비교 테이블
  - 내 기준 벤치마크
  - 선택 공직자 카드
  - 패턴 요약
  - 외부 참고 링크
  - 선택형 제휴 상품
  - SeoContent

### 12-3. 3단계: 스크립트 구현
- `public/scripts/lee-jaemyung-government-officials-assets-salary-2026.js`
- 담당 기능
  - 비교 기준 필터 / 정렬
  - 그룹 필터
  - 세부 자산 필드 보기 토글
  - 선택 인물 카드 갱신
  - 벤치마크 계산 로직
  - URL 파라미터 동기화

### 12-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_lee-jaemyung-government-officials-assets-salary-2026.scss`
- `src/styles/app.scss` import 추가
- 확인 포인트
  - 정치 뉴스 카드처럼 너무 딱딱하거나 기사 리스트처럼 보이지 않는지
  - 비교표와 벤치마크 영역이 서로 충돌하지 않는지
  - 모바일에서 자산/보수 숫자가 답답하지 않게 읽히는지
  - 공란 데이터가 UI에서 어색하게 보이지 않는지

### 12-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro`의 적절한 시리즈에 추가
- `public/sitemap.xml` 추가

### 12-6. 6단계: OG / 메타 / 링크 정리
- OG 이미지 생성
- 메타 타이틀 / 설명 반영
- 관련 리포트 연결
- 외부 링크 rel 속성 점검

---

## 13. QA 체크포인트

### 13-1. 데이터
- [ ] 인물명 / 직책 / 그룹명이 통일되어 있는지 확인
- [ ] 재산 단위와 보수 단위가 모두 `만원` 기준으로 맞는지 확인
- [ ] `assetToComp` 계산이 데이터 정의와 일치하는지 확인
- [ ] 기사에서 확인되지 않은 값이 `0`으로 잘못 들어가지 않았는지 확인
- [ ] 공식 링크 / 공개자료 링크 / 기사 링크가 정상인지 확인
- [ ] `추정`, `참고`, `공개 기준` 라벨이 필요한 곳에 빠지지 않았는지 확인
- [ ] 기준일이 `2026년 3월 26일`로 명시되어 있는지 확인

### 13-2. UI
- [ ] 첫 화면에서 `공직자 재산·보수 비교 리포트`라는 성격이 명확한지 확인
- [ ] KPI -> 차트 -> 테이블 -> 벤치마크 흐름이 자연스러운지 확인
- [ ] 모바일에서 비교표 가로 스크롤이 깨지지 않는지 확인
- [ ] 결측 데이터가 `-` 처리되어 레이아웃이 무너지지 않는지 확인
- [ ] 벤치마크 입력 변경 시 결과가 즉시 갱신되는지 확인
- [ ] 선택 인물 변경 시 상세 카드와 벤치마크 기준 인물이 함께 바뀌는지 확인
- [ ] 그룹 필터가 차트와 테이블 모두에 반영되는지 확인

### 13-3. 운영
- [ ] `reports.ts` 등록
- [ ] `reports/index.astro` 노출 확인
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` 구성 완료
- [ ] `InfoNotice` 기준 문구 포함
- [ ] OG 이미지 경로 설정
- [ ] 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] 제휴 링크 사용 시 `nofollow` 및 고지 문구 적용
- [ ] `npm run build` 통과

---

## 14. 구현 메모

### 14-1. 비교계산소 기준 포지션
- 이 페이지는 정치 논평 글이 아니라 `공개 수치 비교 리포트`다.
- 비교계산소의 강점인 `숫자 비교 + 가벼운 개인 벤치마크`를 유지하되, 정치적 해석은 최소화한다.

### 14-2. 기존 리포트와의 차이
- `insurance-salary-bonus-comparison-2026`보다 업종 비교가 아니라 `인물/직책/그룹` 비교가 중요하다.
- `construction-salary-bonus-comparison-2026`보다 절대 연봉보다 `재산/보수 배수`와 `세부 자산 구성` 해석 비중이 크다.
- `korea-rich-top10-assets`보다 공개 자산과 공직 보수를 함께 보여 주는 구조가 핵심이다.

### 14-3. 구현 우선순위
1. 데이터 구조 확정
2. 브리프 + KPI + 포디움 정적 섹션 구성
3. 비교 차트 / 비교 테이블 구현
4. 벤치마크 패널 구현
5. 선택 공직자 상세 카드 구현
6. 외부 링크 / SEO 연결

### 14-4. 2차 보강 메모
- 현재 1차 공개 기준으로 세부 비교가 비교적 가능한 인물
  - 이재명, 김민석, 강훈식, 김용범, 한성숙, 최휘영, 김정관, 안규백, 정은경, 구윤철, 정동영, 조현
- 2차 원문 보강이 특히 필요한 인물
  - 위성락: 총재산 외 세부 항목 미확인
  - 하정우: 예금 급증과 총재산은 확인되나 건물/채무/증권 잔액 미확인
  - 송미령: 예금·증권은 확인되나 건물 세부 가액 기사 요약 부족
  - 이재명: 부동산 총액과 예금은 확인되지만 건물/전세권 분리값은 원문 보강 시 더 정확

### 14-5. 확장 방향
- `장관 재산 비교`, `대통령실 참모 재산 비교`, `국회의원 자산 비교` 시리즈로 확장 가능
- 향후 정권별 비교 아카이브 구조로도 확장 가능
- 자산뿐 아니라 `병역 / 경력 / 학력 / 관보 공개 정보` 비교 리포트로 파생 가능
