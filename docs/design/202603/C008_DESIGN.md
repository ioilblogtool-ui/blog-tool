# C008 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202603/C008_PLAN.md`
- 구현 대상: `결혼 준비 예산 계산기`
- 참고 페이지: `salary`, `home-purchase-fund`, `bonus-simulator`, `salary-tier`

### 1-2. 전제
- 현재 기획 문서는 결혼 준비 총예산을 빠르게 계산하고, 항목별 수정과 분담 비율 조정, 지역/티어 비교, 공유까지 가능한 계산기형 콘텐츠를 목표로 한다.
- `/reports/`형 장문 비교 콘텐츠보다 `/tools/` 계산기 구조가 더 적합하다.
- 첫 오픈은 `지역 + 티어 기반 기본값 제공 -> 항목 직접 수정 -> 총액/분담/비교 확인` 흐름에 집중한다.
- 결과값은 실시간 반영되는 추정치이며, 실제 계약 금액과 차이가 날 수 있으므로 `추정`, `참고` 성격을 명확히 표시해야 한다.

### 1-3. 문서 역할
- C008 기획을 비교계산소 기준의 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 입력/출력, 계산 규칙, 상태 흐름, 파일 구조, 구현 순서, QA 포인트를 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-4. 페이지 성격
- `실시간 입력형 예산 계산기`
- 핵심 흐름: `기본 조건 입력 -> 카테고리별 비용 조정 -> 총예산 확인 -> 분담 계산 -> 티어 비교 -> 공유`
- 블로그형 설명보다 계산과 비교가 먼저 보이는 도구형 화면을 우선한다.
- 비교계산소답게 단순 합산이 아니라 `지역 차이`, `티어 차이`, `신랑/신부 분담`, `카테고리별 비중`을 함께 보여 준다.

### 1-5. 권장 slug
- `wedding-budget-calculator`
- URL: `/tools/wedding-budget-calculator/`

### 1-6. 권장 파일 구조
- `src/data/weddingBudget.ts`
- `src/pages/tools/wedding-budget-calculator.astro`
- `public/scripts/wedding-budget-calculator.js`
- `src/styles/scss/pages/_wedding-budget-calculator.scss`
- `public/og/tools/wedding-budget-calculator.png`

---

## 2. 현재 프로젝트 계산기 구조 정리

### 2-1. 현재 도구 공통 구조
현재 `/tools/` 계산기형 콘텐츠는 아래 공통 구조를 따른다.
1. `CalculatorHero`
2. `ToolActionBar` 또는 즉시 액션 영역
3. 입력 패널
4. 요약 결과 카드
5. 차트 또는 상세 비교 블록
6. 안내/주의사항
7. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/tools.ts`
- 페이지 데이터: 전용 `src/data/<tool>.ts` 또는 페이지 내부 seed
- 페이지 마크업: `src/pages/tools/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 스타일 등록: `src/styles/app.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 C008이 따라야 할 방향
- `salary`에서 가져올 것
  - 단순한 입력 -> 결과 중심 계산기 흐름
  - 빠른 요약 카드 구조
- `home-purchase-fund`에서 가져올 것
  - 큰 금액 계산기 UI 톤
  - 여러 입력 필드와 실시간 결과 구조
- `bonus-simulator`에서 가져올 것
  - 카테고리별 비교 보드
  - 시나리오/비교형 차트 사용 방식
- `salary-tier`에서 가져올 것
  - 사용자가 자기 상황을 입력하고 해석을 받는 UX
- C008에서 새롭게 강조할 것
  - 결혼 준비 카테고리별 비용 비중
  - 지역/티어 기반 빠른 기본값 불러오기
  - 신랑/신부 분담 계산
  - 항목 직접 수정과 공유 가능한 URL 상태 저장

---

## 3. 구현 범위

### 3-1. MVP 범위
- 지역 3종을 제공한다.
  - `서울`
  - `수도권`
  - `지방`
- 티어 3종을 제공한다.
  - `가성비`
  - `평균`
  - `고급`
- 핵심 카테고리 6종을 제공한다.
  - 결혼 전 준비
  - 웨딩홀
  - 스드메
  - 예물/예단
  - 신혼여행
  - 기타 비용
- 분담 계산 3종을 제공한다.
  - 반반
  - 비율 직접 입력
  - 카테고리별 분담
- 출력 5종을 제공한다.
  - 총예산
  - 카테고리별 합계
  - 신랑 부담액
  - 신부 부담액
  - 티어 비교 결과
- 인터랙션 5종을 제공한다.
  - 지역/티어 선택 시 기본값 로드
  - 각 카테고리 항목 금액 실시간 수정
  - 추가 항목 on/off 또는 기타 항목 직접 입력
  - 분담 비율 변경
  - URL 파라미터 공유

### 3-2. MVP에서 고정할 입력 카테고리
- 공통 설정
  - 지역
  - 티어
  - 신랑 하객 수
  - 신부 하객 수
  - 신랑 식대 단가
  - 신부 식대 단가
  - 분담 방식
  - 신랑 분담 비율
- 결혼 전 준비
  - 상견례
  - 웨딩밴드
  - 예복
  - 혼수 가전/가구
- 웨딩홀
  - 대관료
  - 식대
  - 꽃장식/연출
  - 본식 스냅/영상
  - 사회/축가/부대비용
- 스드메
  - 스튜디오
  - 드레스
  - 메이크업/헤어
  - 추가 촬영/업그레이드
- 예물/예단
  - 예물
  - 예단/예단비
  - 혼수 예단 기타
- 신혼여행
  - 항공
  - 숙박
  - 현지 경비
  - 쇼핑/기타
- 기타
  - 청첩장
  - 답례품
  - 본식 추가비
  - 예비비

### 3-3. MVP 제외 범위
- 날짜별 물가 변동 반영
- 카드 할부 시뮬레이션
- 대출 상품 추천
- 실제 업체 견적 DB 연동
- 지역 세부 구 단위 가격 분리
- 회원 저장 기능
- PDF/엑셀 다운로드

---

## 4. 페이지 목적

- 결혼 준비 중인 사용자가 복잡한 웨딩 비용을 한 번에 계산하고, 항목별 수정과 신랑/신부 분담까지 빠르게 정리하게 한다.
- 단순 총액 계산기가 아니라 `지역`, `티어`, `카테고리 비중`, `분담 구조`까지 같이 읽게 한다.
- 비교계산소다운 차별점으로 `평균/가성비/고급 티어 비교`와 `공유 가능한 상태 저장`을 결합한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 처음 예산을 잡는 예비부부
- 서울/수도권/지방과 가성비/평균/고급 티어를 선택해 대략적인 결혼 준비 총액을 먼저 파악한다.
- 어떤 카테고리가 큰지 보고 예산 감을 잡는다.

### 5-2. 실제 견적을 입력하는 사용자
- 웨딩홀, 스드메, 신혼여행 등 항목 금액을 직접 수정해 내 상황에 맞는 총예산으로 맞춘다.
- 추가 비용이나 예비비를 직접 넣어 현실적인 예산표로 만든다.

### 5-3. 분담을 조정하는 커플
- 반반 또는 비율 입력으로 각자 부담액을 계산한다.
- 웨딩홀은 신랑 측, 예물은 신부 측처럼 카테고리별 책임 분담을 가정해 본다.

### 5-4. 비교형 사용자
- 같은 조건에서 가성비 / 평균 / 고급 티어 차이가 얼마나 나는지 본다.
- 서울과 지방 기본값 차이를 보고 전체 계획 규모를 조정한다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 공통 설정 입력
- `region`
  - `seoul`
  - `metro`
  - `local`
- `weddingTier`
  - `value`
  - `standard`
  - `premium`
- `guestCountGroom`
  - 숫자
- `guestCountBride`
  - 숫자
- `mealPriceGroom`
  - 만원 단위 또는 원 단위 내부 통일 필요
- `mealPriceBride`
  - 만원 단위 또는 원 단위 내부 통일 필요
- `shareMode`
  - `half`
  - `ratio`
  - `category`
- `groomShareRatio`
  - 0~100

#### 카테고리 입력
- `preWedding.*`
- `hall.*`
- `studioDressMakeup.*`
- `gifts.*`
- `honeymoon.*`
- `misc.*`

#### 옵션 입력
- `reserveBudget`
  - 예비비
- `customItems[]`
  - 기타 항목명 + 금액

### 6-2. 출력값

#### 핵심 출력
- `totalBudget`
- `groomShareAmount`
- `brideShareAmount`
- `largestCategory`
- `hallCostTotal`

#### 상세 출력
- 카테고리별 합계
- 하위 항목별 합계
- 전체 대비 카테고리 비중
- 티어별 비교 카드
- 지역별 기본값 차이 요약

#### 해석 출력
- 가장 큰 지출 카테고리
- 식대가 전체에서 차지하는 비중
- 현재 티어 대비 가성비/고급 차이
- 입력값 기준 한 줄 코멘트

---

## 7. 섹션 구조

### 7-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 기본 조건 입력 패널
4. 카테고리별 예산 입력 섹션
5. 결과 요약 카드
6. 카테고리 비중 차트 / 보드
7. 신랑·신부 분담 계산 섹션
8. 티어 비교 섹션
9. 공유 액션 / 리셋
10. `SeoContent`

### 7-2. 모바일 우선 순서
- Hero
- 기준 안내
- 지역/티어 입력
- 핵심 금액 입력
- 총예산 결과
- 분담 결과
- 카테고리 상세
- 티어 비교
- SEO 안내

### 7-3. 데스크톱 레이아웃
- 좌측: 입력 패널
- 우측: 결과 대시보드
- 하단 전체폭: 상세 카테고리 / 비교 / SEO
- `CompareToolShell`보다 `SimpleToolShell` 또는 커스텀 2컬럼 계산기 레이아웃이 더 적합

---

## 8. 컴포넌트 구조

### 8-1. 공통 컴포넌트
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- `ToolActionBar`

### 8-2. 페이지 내부 블록
- `WeddingBudgetSetupPanel`
  - 지역, 티어, 하객수, 식대, 분담방식 입력
- `WeddingBudgetCategoryPanel`
  - 카테고리별 accordion 입력 카드
- `WeddingBudgetSummaryCards`
  - 총예산, 신랑 부담, 신부 부담, 최대 카테고리
- `WeddingBudgetChartBoard`
  - 카테고리별 비중 bar/donut chart
- `WeddingBudgetShareBoard`
  - 분담 계산 상세
- `WeddingBudgetTierCompare`
  - 가성비/평균/고급 비교 카드
- `WeddingBudgetCustomItems`
  - 기타 항목 추가

### 8-3. DOM id 권장 예시
- `weddingRegionSelect`
- `weddingTierSelect`
- `weddingGuestCountGroomInput`
- `weddingGuestCountBrideInput`
- `weddingShareModeTabs`
- `weddingTotalBudget`
- `weddingGroomShare`
- `weddingBrideShare`
- `weddingCategoryChart`
- `weddingTierCompareBoard`

---

## 9. 상태 관리 포인트

### 9-1. 기본 상태
- `region`
- `tier`
- `shareMode`
- `groomShareRatio`
- `categoryValues`
- `customItems`

### 9-2. 파생 상태
- `totalBudget`
- `categoryTotals`
- `categoryShares`
- `groomShareAmount`
- `brideShareAmount`
- `tierComparison`
- `largestCategory`

### 9-3. URL 저장 대상
- 지역
- 티어
- 하객 수
- 식대 단가
- 분담 모드
- 분담 비율
- 주요 카테고리 합계 또는 항목별 값

### 9-4. 상태 처리 원칙
- 입력 변경 즉시 결과를 다시 계산한다.
- 기본값 세트는 `region + tier` 조합으로 덮어쓴 뒤, 사용자가 수정한 값은 다시 덮이지 않도록 초기화/리셋 시점만 명확히 분리한다.
- URL 파라미터 복원 시 기본 preset보다 URL 상태가 우선한다.

---

## 10. 계산 로직

### 10-1. 기본 원칙
- 내부 계산 단위를 하나로 통일한다. 권장: `만원` 단위 정수
- 화면 포맷은 `만원`, `억원` 혼합 표기 허용
- 식대는 `하객 수 × 1인 식대`로 계산한다.
- 카테고리 총합은 하위 항목 합계로 계산한다.

### 10-2. 카테고리 합계
```text
preWeddingTotal = 상견례 + 웨딩밴드 + 예복 + 혼수 가전/가구
hallTotal = 대관료 + (신랑 하객수 × 신랑 식대) + (신부 하객수 × 신부 식대) + 꽃장식/연출 + 본식 스냅/영상 + 사회/축가/부대비용
sdmTotal = 스튜디오 + 드레스 + 메이크업/헤어 + 추가 촬영/업그레이드
giftsTotal = 예물 + 예단/예단비 + 혼수 예단 기타
honeymoonTotal = 항공 + 숙박 + 현지 경비 + 쇼핑/기타
miscTotal = 청첩장 + 답례품 + 본식 추가비 + 예비비 + customItems 합계
```

### 10-3. 총예산
```text
totalBudget = preWeddingTotal + hallTotal + sdmTotal + giftsTotal + honeymoonTotal + miscTotal
```

### 10-4. 분담 계산
#### half
```text
groomShareAmount = totalBudget / 2
brideShareAmount = totalBudget / 2
```

#### ratio
```text
groomShareAmount = totalBudget × (groomShareRatio / 100)
brideShareAmount = totalBudget - groomShareAmount
```

#### category
- 카테고리별로 신랑/신부 귀속값을 따로 계산한다.
- MVP에서는 카테고리별 귀속 토글까지 넣을지 여부를 구현 시 결정 가능하나, 설계 문서 기준으로는 확장 가능 구조를 유지한다.

### 10-5. 비중 계산
```text
categoryShare = categoryTotal / totalBudget × 100
financial risk note = 특정 카테고리 비중이 40% 이상이면 과도 집중 안내
```

### 10-6. 티어 비교
- 현재 입력값과 별도로 동일 지역 기준 `가성비 / 평균 / 고급` preset 총액을 계산한다.
- 사용자 수정값과 preset 총액은 분리한다.
- 출력 예시
  - 가성비 기준보다 `+1,200만원`
  - 고급 기준보다 `-2,800만원`

---

## 11. 데이터 파일 구조

### 11-1. 권장 구조
`src/data/weddingBudget.ts`

### 11-2. 포함 데이터
- 지역 라벨
- 티어 라벨
- 지역별 기본 식대 범위
- 지역×티어별 기본 preset
- 카테고리별 기본 금액
- FAQ
- 관련 링크용 추천 계산기

### 11-3. 타입 예시
```ts
export type WeddingRegion = "seoul" | "metro" | "local";
export type WeddingTier = "value" | "standard" | "premium";
export type ShareMode = "half" | "ratio" | "category";

export type WeddingPreset = {
  region: WeddingRegion;
  tier: WeddingTier;
  guestMealDefaultGroom: number;
  guestMealDefaultBride: number;
  categories: {
    preWedding: Record<string, number>;
    hall: Record<string, number>;
    sdm: Record<string, number>;
    gifts: Record<string, number>;
    honeymoon: Record<string, number>;
    misc: Record<string, number>;
  };
};
```

### 11-4. FAQ/SEO 데이터
- `faq: { q: string; a: string }[]`
- `relatedLinks: { href: string; label: string }[]`

---

## 12. 구현 순서

### 12-1. 1단계
- `src/data/weddingBudget.ts` 생성
- 지역/티어/preset/FAQ 구조 정의
- 기본 계산 함수 초안 작성

### 12-2. 2단계
- `src/pages/tools/wedding-budget-calculator.astro` 생성
- Hero, 안내, 입력, 요약 카드, 비교 섹션 마크업 구성

### 12-3. 3단계
- `public/scripts/wedding-budget-calculator.js` 생성
- 입력 상태 관리
- 실시간 계산
- URL 파라미터 저장/복원
- 차트 렌더링

### 12-4. 4단계
- `src/styles/scss/pages/_wedding-budget-calculator.scss` 생성
- 모바일 우선 UI 정리
- 입력 섹션 간격, 카드형 결과, 비교 보드 스타일링

### 12-5. 5단계
- `src/data/tools.ts` 등록
- `src/styles/app.scss` import 추가
- `public/sitemap.xml` 등록
- 필요 시 OG 이미지 생성

### 12-6. 6단계
- `npm run build`
- 모바일/태블릿/PC 수동 검증
- 공유 URL 검증

---

## 13. QA 체크포인트

### 13-1. 계산 정확성
- 지역/티어 변경 시 preset이 정상 반영되는가
- 식대 계산이 `하객 수 × 식대`로 정확히 반영되는가
- 총예산 합계가 카테고리 합계와 정확히 일치하는가
- 반반/비율 분담 계산이 정확한가
- 사용자 수정값이 의도치 않게 preset에 의해 덮이지 않는가

### 13-2. UX
- 모바일 첫 화면에서 핵심 입력과 총예산이 빠르게 보이는가
- accordion 입력 구조가 답답하지 않은가
- 결과 카드가 숫자만 나열하지 않고 해석을 주는가
- `리셋`, `URL 공유`가 직관적으로 동작하는가

### 13-3. 상태/공유
- URL 복원 시 같은 상태가 재현되는가
- 숫자 입력이 비정상 값일 때 깨지지 않는가
- 0원 / 공란 / 음수 입력 처리 기준이 명확한가

### 13-4. SEO/콘텐츠
- 제목, 설명, H1, FAQ가 모두 한국어로 자연스러운가
- 추정값/참고값 고지가 명확한가
- `SeoContent`에 관련 계산기 링크가 연결되는가

### 13-5. 반응형
- 모바일 360px 기준 깨짐 없는가
- 태블릿에서 입력과 결과 균형이 맞는가
- PC에서 좌우 컬럼 여백이 과도하지 않은가
- 긴 표/비교 보드에서 overflow 처리가 되는가

---

## 14. 개발 요청용 요약

- C008은 `/reports/`가 아니라 `/tools/` 계산기형으로 구현한다.
- slug는 `wedding-budget-calculator`를 사용한다.
- 핵심은 `지역/티어 preset + 항목 직접 수정 + 총예산 + 신랑/신부 분담 + 티어 비교 + 공유 URL`이다.
- 결과는 실시간 반영이며, 모든 값은 `추정` 성격임을 안내한다.
- 1차 오픈은 결혼 준비 전체를 덮는 대형 계산기 1개로 구성하고, 이후 `예식장 비용`, `스드메 비용`, `신혼여행 비용` 등으로 세분화 확장 가능하게 설계한다.
