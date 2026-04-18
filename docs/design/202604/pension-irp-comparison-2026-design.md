# 연금저축 vs IRP 비교 2026 구현 설계 문서

> 기획 문서: `docs/plan/202604/pension-irp-comparison-2026.md`
> 작성일: 2026-04-17
> 구현 기준: 이 문서만 보고 리포트 페이지 제작 가능해야 함
> 참고 리포트: `salary-asset-2016-vs-2026`, `overseas-travel-cost-compare-2026`, `national-pension-generational-comparison-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 슬러그: `pension-irp-comparison-2026`
- URL: `/reports/pension-irp-comparison-2026/`
- 콘텐츠 유형: 리포트 (`/reports/`)
- 카테고리: 투자·재테크

### 1-2. 페이지 정의

> 연금저축, IRP, 연금보험의 차이를
> 세액공제, 운용 자유도, 중도 인출, 퇴직금 이전, 수령 방식 관점에서
> 2026 기준으로 쉽게 비교해주는 리포트

### 1-3. 구현 원칙

- 검색 유입 사용자가 10초 안에 핵심 차이를 파악해야 함
- 표만 있는 설명글이 아니라 `비교 리포트 + 선택 가이드 + 계산기 유입 허브`
- 법률 자문처럼 보이지 않게 일반론 중심 문구 사용

---

## 2. 파일 구조

```text
src/
  data/
    reports.ts
    pensionIrpComparison2026.ts
  pages/
    reports/
      pension-irp-comparison-2026.astro

src/styles/scss/pages/
  _pension-irp-comparison-2026.scss

public/
  og/
    reports/
      pension-irp-comparison-2026.png
```

### 2-1. 추가 반영 파일

- `src/data/reports.ts`
- `src/styles/app.scss`
- 필요 시 `public/sitemap.xml`

---

## 3. 데이터 파일 설계 (`pensionIrpComparison2026.ts`)

### 3-1. 타입 정의

```ts
export type ComparisonProduct = {
  id: "pension-saving" | "irp" | "annuity-insurance";
  name: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export type ComparisonRow = {
  label: string;
  pensionSaving: string;
  irp: string;
  annuityInsurance: string;
};

export type ScenarioCard = {
  id: string;
  title: string;
  target: string;
  recommendation: string;
  caution: string;
};
```

### 3-2. 핵심 비교 테이블 데이터

```ts
export const PENSION_IRP_COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "세액공제",
    pensionSaving: "가능",
    irp: "가능",
    annuityInsurance: "일반적으로 없음",
  },
  {
    label: "퇴직금 수령",
    pensionSaving: "불가",
    irp: "가능",
    annuityInsurance: "불가",
  },
  {
    label: "운용 자유도",
    pensionSaving: "높음",
    irp: "중간",
    annuityInsurance: "낮음",
  },
  {
    label: "중도 인출",
    pensionSaving: "상대적으로 유연",
    irp: "제약 큼",
    annuityInsurance: "상품별 상이",
  },
];
```

### 3-3. 상황별 추천 카드

```ts
export const PENSION_IRP_SCENARIOS: ScenarioCard[] = [
  {
    id: "office-worker-basic",
    title: "직장인 기본형",
    target: "연말정산과 장기 적립을 함께 챙기고 싶은 사용자",
    recommendation: "연금저축 우선, 이후 IRP 보완",
    caution: "IRP만 과하게 넣으면 유동성 제약이 커질 수 있음",
  },
  {
    id: "retirement-transfer",
    title: "퇴직금 관리형",
    target: "퇴직금 이전과 연금 수령까지 고려하는 사용자",
    recommendation: "IRP 중심 설계",
    caution: "인출 제약과 상품 선택 폭을 같이 확인",
  },
];
```

### 3-4. FAQ / CTA / 링크 데이터

- `PENSION_IRP_FAQ`
- `PENSION_IRP_RELATED_LINKS`
- `PENSION_IRP_TOP_SUMMARY`

---

## 4. 페이지 레이아웃

### 4-1. 기본 틀

- `BaseLayout`
- `SiteHeader`
- 리포트 전용 hero
- 본문 섹션
- `SeoContent` 또는 리포트용 하단 설명

### 4-2. 시각 톤

- 정보 비교형 리포트
- 과한 감성보다 표/라벨/콜아웃 위주
- 브랜드 컬러는 포인트 정도만 사용

---

## 5. 섹션 구성

## 5-1. Hero

- eyebrow: `연금 비교 리포트`
- title: `연금저축 vs IRP 비교 2026`
- description: “세액공제, 운용, 퇴직금, 연금 수령까지 한눈에 비교”
- CTA 1: `IRP 연금 계산기 보기`
- CTA 2: `국민연금 계산기 보기`

## 5-2. 30초 요약 카드

카드 3개 구성:

1. 절세 중심이면
2. 퇴직금 관리까지 보면
3. 안정성/비과세형을 보려면

각 카드에는 한 줄 결론 + 짧은 설명만 제공

## 5-3. 핵심 비교표

### 표 구조

| 항목 | 연금저축 | IRP | 연금보험 |
| --- | --- | --- | --- |

필수 비교 항목:

- 세액공제
- 퇴직금 수령
- 운용 자유도
- 중도 인출
- 수령 방식
- 추천 성향

모바일에서는 가로 스크롤 또는 카드형 전환

## 5-4. 세액공제 설명 섹션

포맷:

- 상단 요약 카피
- 한도 설명 박스
- 예시 카드 2~3개

예시 카드:

- 연금저축만 넣는 경우
- 연금저축 + IRP 조합
- 소득 구간별 체감 예시

## 5-5. 운용 자유도 / 중도 인출 비교

포맷:

- 3열 카드
- “좋은 점”과 “불편한 점” 동시 표시

필수 메시지:

- 연금저축: 상대적으로 유연
- IRP: 절세 강점 + 제약 동반
- 연금보험: 구조가 다르므로 같은 잣대로만 비교하면 안 됨

## 5-6. 수령 방식 / 세금 비교

포맷:

- 콜아웃 박스
- 비교 리스트
- 계산기 연결 CTA

연결 문구:

`내 적립금 기준 월 수령액은 IRP 연금 계산기에서 바로 확인할 수 있습니다.`

## 5-7. 상황별 추천 카드

권장 4~5개:

- 직장인 초보
- 연말정산 환급 중심
- 퇴직금 IRP 이전 대상자
- 자영업자
- 안정성 선호형

## 5-8. 자주 하는 실수

- 한도 착각
- IRP 인출 제약 미인지
- 세액공제만 보고 선택
- 연금보험을 같은 상품처럼 이해

## 5-9. 계산기 연결 CTA

메인 CTA 카드:

- title: `내 IRP 예상 수령액 계산하기`
- href: `/tools/irp-pension-calculator/`

보조 CTA 카드:

- `국민연금 예상 수령액 계산기`
- `은퇴 계산기`

## 5-10. FAQ

5~7개 아코디언 구성

---

## 6. 추천 컴포넌트 구조

```text
PensionIrpHero
PensionIrpSummaryCards
PensionIrpComparisonTable
PensionIrpTaxGuide
PensionIrpScenarioGrid
PensionIrpMistakeList
PensionIrpCalculatorCta
PensionIrpFaq
```

Astro 단일 페이지 내부 섹션으로 먼저 구현하고, 반복성이 생기면 컴포넌트 분리.

---

## 7. 스타일 설계 (`_pension-irp-comparison-2026.scss`)

- prefix: `pic26-`
- 비교표 가독성 최우선
- CTA 카드와 요약 카드 구분 명확
- 표 헤더 고정감 있는 톤
- 모바일에서 카드형 스택 자연스럽게 전환

### 핵심 스타일 포인트

- 상단 3요약 카드
- 표 내부 `좋음/제약` 배지
- 상황별 추천 카드
- 하단 CTA 패널

---

## 8. 문구 정책

- `무조건`, `확정`, `보장` 금지
- `일반적으로`, `상황에 따라`, `설명용 예시` 사용
- 세무/법률 확정 판단을 유도하지 않음

---

## 9. 메타 / 구조화 데이터

### 메타

- title: `연금저축 vs IRP 비교 2026 | 세액공제·운용·수령 방식 한눈에`
- description: 기획 문서 기준 적용

### 구조화 데이터 후보

- `Article`
- `FAQPage`
- 필요 시 `BreadcrumbList`

---

## 10. 추천 DOM / 섹션 id

```text
#summary
#comparison
#tax-guide
#flexibility
#withdrawal
#scenario
#mistakes
#calculator-link
#faq
```

`SeoContent` 내부 목차 또는 수동 앵커 네비게이션 연결 가능.

---

## 11. 관련 링크 설계

### 내부 링크 우선순위

1. `/tools/irp-pension-calculator/`
2. `/tools/national-pension-calculator/`
3. `/tools/retirement/`

### 추천 앵커

- `내 IRP 예상 수령액 계산하기`
- `국민연금 수령액도 함께 보기`
- `은퇴 후 필요한 생활비 계산하기`

---

## 12. QA 체크리스트

- [ ] 보고서 slug/title/description 연결
- [ ] 비교표 모바일 가독성 확인
- [ ] CTA 링크 정상 동작
- [ ] FAQ 렌더링 확인
- [ ] 내부 링크 anchor 동작 확인
- [ ] `npm run build` 통과

---

## 13. 구현 우선순위

### P0

- Hero
- 30초 요약 카드
- 핵심 비교표
- 상황별 추천 카드
- 계산기 CTA

### P1

- 세액공제 설명 블록
- 자주 하는 실수
- FAQ

### P2

- 인터랙티브 필터
- 고정형 비교 네비게이션
- 인포그래픽 강화

---

## 14. 최종 구현 메모

이 페이지는 설명형 글처럼 길어지면 이탈이 빠르다. 구현의 핵심은 `비교표`, `요약 카드`, `상황별 추천`, `계산기 연결 CTA` 네 축이다. 사용자는 긴 세법 해설보다 “나는 뭘 먼저 해야 하는가”를 알고 싶기 때문에, 결론이 먼저 보이고 세부 설명이 뒤따르는 구조로 구현한다.
