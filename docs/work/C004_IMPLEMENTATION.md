# C004 구현 기록

## 작업 개요
- 기준 문서: `docs/design/202603/C004_DESIGN.md`
- 구현 대상: `서울 국평 아파트 가격 비교 리포트`
- 구현 경로: `/reports/seoul-84-apartment-prices/`
- 리디자인 반영일: `2026-03-26`

## 구현 파일
- `src/data/seoul84ApartmentPrices.ts`
- `src/pages/reports/seoul-84-apartment-prices.astro`
- `public/scripts/seoul-84-apartment-prices.js`
- `src/styles/scss/pages/_seoul-84-apartment-prices.scss`
- `src/data/reports.ts`
- `src/pages/reports/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

## 구현 내용

### 1. 데이터 구조
- 서울 6개 구, 20개 단지 데이터를 `src/data/seoul84ApartmentPrices.ts`에 정리했다.
- 각 단지에 대해 아래 파생값을 사전 계산해서 넣었다.
  - `pricePerPyeongMan`
  - `diffHighVsAvgEok`
  - `salaryYearsAvgWorker`
  - `salaryYearsSamsung`
  - `salaryYearsHynix`
- FAQ, 인사이트, 관련 링크, 외부 참고 링크, 제휴 상품 데이터까지 한 파일에서 관리하도록 구성했다.

### 2. 계산기 계열 UI에 맞춘 레이아웃 재정렬
- 초기 구현은 리포트 전용 화면처럼 보였고, `formula-cost`, `diaper-cost`, `home-purchase-fund`와 톤 차이가 컸다.
- 이후 페이지 구조를 `SimpleToolShell` 기반으로 다시 정리했다.
- 핵심 변경점은 아래와 같다.
  - `SimpleToolShell` 2열 구조 사용
  - `ToolActionBar` 추가로 상단 액션 일관성 확보
  - 필터/요약을 좌측 패널에 배치
  - 본문 섹션 헤더와 KPI 카드를 기존 계산기 페이지 톤에 맞춤
  - 과한 리포트형 장식 제거, 패널 중심 UI로 정리
- 결과적으로 비교 검색 리포트이지만 같은 제품군의 계산기처럼 보이도록 맞췄다.

### 3. 페이지 구조
- 현재 페이지는 아래 순서로 구성했다.
  - Hero
  - ActionBar
  - 좌측 패널: 검색 조건 / 가격·등급 기준 / 시장 포커스 / Live Brief
  - 본문: 핵심 요약 KPI / 단지 비교 카드 / 연봉 대비 체감 / 가격 표 / 인사이트
  - InfoNotice
  - CTA
  - 외부 참고 링크
  - 제휴 상품
  - SeoContent

### 4. 인터랙션
- `public/scripts/seoul-84-apartment-prices.js`에서 아래 동작을 구현했다.
  - 지역 / 단지명 / 등급 / 가격 기준 / 정렬 필터
  - 최대 4개 비교 선택
  - 필터 결과 즉시 갱신
  - 포커스 카드 자동 갱신
  - Live Brief 요약 문구 자동 갱신
  - 연봉 기준 탭 변경
  - URL 쿼리 동기화
  - 링크 복사 버튼 동작
- CTA 링크는 선택 단지 기준으로 `home-purchase-fund` 계산기에 연결했다.
- 가격이 매매 자금 계산기 상한(35억)을 넘는 경우에는 지역 조건만 넘기고 가격은 직접 입력하도록 안내 문구를 넣었다.

### 5. 스타일 구조
- `src/styles/scss/pages/_seoul-84-apartment-prices.scss`를 기존 계산기 페이지 문법에 맞춰 다시 작성했다.
- 주요 방향은 아래와 같다.
  - 작은 섹션 헤더
  - 얕은 패널과 낮은 카드 밀도
  - 절제된 그린 포인트 컬러
  - `formula-cost` / `diaper-cost` 계열과 유사한 KPI 카드 톤
  - `home-purchase-fund`와 유사한 입력 패널 체계
- 목적은 페이지 자체를 화려하게 만드는 것이 아니라, 사이트 전체 안에서 이질감 없이 붙이는 것이었다.

### 6. 허브/색인 반영
- `src/data/reports.ts`에 새 리포트를 등록했다.
- `src/pages/reports/index.astro`를 정리하면서 부동산 시리즈 카드를 추가했다.
- `public/sitemap.xml`에 `/reports/seoul-84-apartment-prices/`를 추가했다.

## 검증
- 실행 명령: `npm run build`
- 결과: 성공
- 확인 사항:
  - 정적 라우트 생성 성공
  - `/reports/seoul-84-apartment-prices/` 빌드 포함 확인
  - `/reports/` 허브 페이지 빌드 성공

## 남은 작업 메모
- `public/og/reports/seoul-84-apartment-prices.png` OG 이미지는 아직 생성하지 않았다.
- 실제 시각 품질 최종 확인은 브라우저에서 한 번 더 보는 편이 좋다. 현재는 정적 빌드 기준으로만 검증했다.
- `home-purchase-fund` 계산기의 가격 상한이 35억이라, 초고가 단지는 파라미터 자동 주입에 제한이 있다.
